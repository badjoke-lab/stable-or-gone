import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = process.env.UI_AUDIT_BASE_URL || 'http://127.0.0.1:4321';
const outputRoot = process.env.UI_AUDIT_OUTPUT || 'artifacts/ui-remediation-r8';
const viewports = [
  ['desktop-1440', 1440, 900],
  ['desktop-1280', 1280, 800],
  ['tablet-768', 768, 1024],
  ['mobile-390', 390, 844],
  ['mobile-320', 320, 568]
];
const states = [
  { family: 'compare', state: 'empty', route: '/compare/' },
  { family: 'compare', state: 'ready', route: '/compare/?assets=usdc,usdt' },
  { family: 'compare', state: 'error', route: '/compare/', simulate: 'compare-error' },
  { family: 'access', state: 'ready', route: '/access-regulation/' },
  { family: 'access', state: 'empty', route: '/access-regulation/?q=zzzzzz-no-match' },
  { family: 'access', state: 'error', route: '/access-regulation/', simulate: 'access-error' },
  { family: 'access', state: 'loading', route: '/access-regulation/', simulate: 'access-loading' }
];

fs.mkdirSync(outputRoot, { recursive: true });
const browser = await chromium.launch({ headless: true });
const manifest = { schema_version: '1.1', base_url: baseUrl, captures: [], failures: [] };

for (const [viewportName, width, height] of viewports) {
  const context = await browser.newContext({ viewport: { width, height } });
  for (const spec of states) {
    const page = await context.newPage();
    const consoleErrors = [];
    const failedRequests = [];
    page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
    page.on('requestfailed', (request) => failedRequests.push(`${request.method()} ${request.url()} ${request.failure()?.errorText ?? ''}`));
    const response = await page.goto(`${baseUrl}${spec.route}`, { waitUntil: 'networkidle' });

    if (spec.family === 'compare' && spec.state === 'ready') await page.waitForSelector('[data-compare-output]:not([hidden])');
    if (spec.family === 'access' && spec.state === 'ready') await page.waitForSelector('.r8-access-row');
    if (spec.family === 'access' && spec.state === 'empty') await page.waitForSelector('[data-ar-empty]:not([hidden])');

    if (spec.simulate) {
      await page.evaluate((simulation) => {
        const setHidden = (selector, hidden) => { const element = document.querySelector(selector); if (element instanceof HTMLElement) element.hidden = hidden; };
        if (simulation === 'compare-error') {
          setHidden('[data-compare-alert]', false); setHidden('[data-compare-empty]', true); setHidden('[data-compare-output]', true);
        } else if (simulation === 'access-error') {
          setHidden('[data-ar-alert]', false); setHidden('[data-ar-loading]', true); setHidden('[data-ar-empty]', true); setHidden('[data-ar-results]', true); setHidden('[data-ar-show-more-row]', true);
        } else if (simulation === 'access-loading') {
          setHidden('[data-ar-alert]', true); setHidden('[data-ar-loading]', false); setHidden('[data-ar-empty]', true); setHidden('[data-ar-results]', true); setHidden('[data-ar-show-more-row]', true);
        }
      }, spec.simulate);
    }

    const diagnostics = await page.evaluate(({ width, family, state }) => {
      const visible = (selector) => {
        const element = document.querySelector(selector);
        if (!(element instanceof HTMLElement)) return false;
        const style = getComputedStyle(element); const rect = element.getBoundingClientRect();
        return !element.hidden && style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
      };
      const visibleText = document.body.innerText;
      const interactiveScoreRanking = [...document.querySelectorAll('button,select,option,input,label')]
        .filter((element) => /(score|ranking)/i.test(element.textContent ?? '')).map((element) => element.textContent?.trim().slice(0,80));
      const compareOutput = document.querySelector('[data-compare-output]');
      const accessRows = [...document.querySelectorAll('.r8-access-row')];
      return {
        document_width: document.documentElement.scrollWidth,
        viewport_width: width,
        visible_error_language: /(contract mismatch|index unavailable|failed to load|HTTP \d+)/i.test(visibleText),
        interactive_score_ranking: interactiveScoreRanking,
        compare: {
          empty: visible('[data-compare-empty]'),
          ready: visible('[data-compare-output]'),
          error: visible('[data-compare-alert]'),
          mobile_facet_control: visible('[data-compare-mobile-facet]'),
          visible_facets: [...document.querySelectorAll('[data-dimension-id]')].filter((element) => element instanceof HTMLElement && !element.hidden && getComputedStyle(element).display !== 'none').length,
          output_scroll_width: compareOutput instanceof HTMLElement ? compareOutput.scrollWidth : 0,
          output_client_width: compareOutput instanceof HTMLElement ? compareOutput.clientWidth : 0
        },
        access: {
          loading: visible('[data-ar-loading]'),
          empty: visible('[data-ar-empty]'),
          ready: visible('[data-ar-results]') && accessRows.length > 0,
          error: visible('[data-ar-alert]'),
          rows: accessRows.length,
          max_row_height: accessRows.length ? Math.max(...accessRows.map((row) => row.getBoundingClientRect().height)) : 0
        },
        family,
        state
      };
    }, { width, family: spec.family, state: spec.state });

    const failures = [];
    if (!response?.ok()) failures.push(`HTTP ${response?.status() ?? 'no response'}`);
    if (diagnostics.document_width > width + 1) failures.push(`horizontal overflow ${diagnostics.document_width}px > ${width}px`);
    if (consoleErrors.length) failures.push(`${consoleErrors.length} console errors`);
    if (failedRequests.length) failures.push(`${failedRequests.length} failed requests`);
    if (diagnostics.interactive_score_ranking.length) failures.push('unsupported Score or Ranking control visible');
    if (spec.state === 'ready' && diagnostics.visible_error_language) failures.push('internal/load error language visible in ready state');

    if (spec.family === 'compare') {
      const statesVisible = [diagnostics.compare.empty, diagnostics.compare.ready, diagnostics.compare.error].filter(Boolean).length;
      if (statesVisible !== 1) failures.push(`compare state overlap: ${statesVisible} visible`);
      if (spec.state === 'empty' && !diagnostics.compare.empty) failures.push('compare empty state missing');
      if (spec.state === 'ready' && !diagnostics.compare.ready) failures.push('compare ready state missing');
      if (spec.state === 'error' && !diagnostics.compare.error) failures.push('compare error state missing');
      if (spec.state === 'ready' && width <= 719 && (!diagnostics.compare.mobile_facet_control || diagnostics.compare.visible_facets !== 1)) failures.push(`mobile compare must show one facet, found ${diagnostics.compare.visible_facets}`);
      if (spec.state === 'ready' && width > 719 && diagnostics.compare.output_scroll_width > diagnostics.compare.output_client_width + 1) failures.push('desktop comparison requires horizontal scrolling');
    } else {
      const statesVisible = [diagnostics.access.loading, diagnostics.access.empty, diagnostics.access.ready, diagnostics.access.error].filter(Boolean).length;
      if (statesVisible !== 1) failures.push(`access state overlap: ${statesVisible} visible`);
      if (spec.state === 'ready' && !diagnostics.access.ready) failures.push('access ready state missing');
      if (spec.state === 'empty' && !diagnostics.access.empty) failures.push('access empty state missing');
      if (spec.state === 'error' && !diagnostics.access.error) failures.push('access error state missing');
      if (spec.state === 'loading' && !diagnostics.access.loading) failures.push('access loading state missing');
      if (spec.state === 'ready' && width <= 719 && diagnostics.access.max_row_height > 300) failures.push(`access mobile row too tall: ${diagnostics.access.max_row_height}px`);
    }

    const directory = path.join(outputRoot, viewportName);
    fs.mkdirSync(directory, { recursive: true });
    const screenshot = path.join(directory, `${spec.family}-${spec.state}.png`);
    await page.screenshot({ path: screenshot, fullPage: true });
    const capture = { ...spec, viewport: viewportName, width, height, screenshot, diagnostics, console_errors: consoleErrors, failed_requests: failedRequests, failures };
    manifest.captures.push(capture); if (failures.length) manifest.failures.push(capture);
    await page.close();
  }
  await context.close();
}
await browser.close();
manifest.ok = manifest.failures.length === 0;
manifest.summary = { captures: manifest.captures.length, passed: manifest.captures.length - manifest.failures.length, failed: manifest.failures.length };
fs.writeFileSync(path.join(outputRoot, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify(manifest.summary, null, 2));
if (!manifest.ok) process.exit(1);
