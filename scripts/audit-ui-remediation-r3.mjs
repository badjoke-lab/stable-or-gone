import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = String(process.env.SOG_SCREENSHOT_BASE_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
const outputRoot = path.resolve('artifacts/ui-remediation-r3');
const viewports = [
  { id: 'desktop-1440', width: 1440, height: 900 },
  { id: 'desktop-1280', width: 1280, height: 800 },
  { id: 'tablet-768', width: 768, height: 1024 },
  { id: 'mobile-390', width: 390, height: 844 },
  { id: 'mobile-320', width: 320, height: 568 }
];
const states = [
  { id: 'home', pathname: '/', kind: 'home' },
  { id: 'register-default', pathname: '/stablecoins/', kind: 'register' },
  { id: 'register-filtered', pathname: '/stablecoins/?lifecycle=active', kind: 'register' },
  { id: 'register-empty', pathname: '/stablecoins/?q=__no_such_stablecoin__', kind: 'empty' }
];

fs.rmSync(outputRoot, { recursive: true, force: true });
fs.mkdirSync(outputRoot, { recursive: true });
const browser = await chromium.launch({ headless: true });
const records = [];
const failures = [];

for (const viewport of viewports) {
  const viewportDir = path.join(outputRoot, viewport.id);
  fs.mkdirSync(viewportDir, { recursive: true });
  for (const state of states) {
    const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height }, deviceScaleFactor: 1 });
    const consoleErrors = [];
    const pageErrors = [];
    const failedRequests = [];
    page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
    page.on('pageerror', (error) => pageErrors.push(String(error?.message || error)));
    page.on('requestfailed', (request) => {
      if (['document', 'stylesheet', 'script', 'xhr', 'fetch'].includes(request.resourceType())) failedRequests.push(`${request.resourceType()} ${request.url()} ${request.failure()?.errorText || ''}`.trim());
    });

    const response = await page.goto(`${baseUrl}${state.pathname}`, { waitUntil: 'networkidle', timeout: 60_000 });
    await page.waitForTimeout(150);
    const audit = await page.evaluate(({ kind, width }) => {
      const visible = (element) => {
        if (!(element instanceof Element)) return false;
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) !== 0 && rect.width > 0 && rect.height > 0;
      };
      const root = document.documentElement;
      const body = document.body;
      const tableRows = [...document.querySelectorAll('[data-registry-row]')].filter(visible);
      const cards = [...document.querySelectorAll('[data-registry-card]')].filter(visible);
      const filterPanel = document.querySelector('.stablecoin-filter-panel');
      const childFilters = [...document.querySelectorAll('.stablecoin-index-filter')];
      const noResults = document.querySelector('[data-no-results]');
      const h1 = document.querySelector('h1');
      const ordinaryBreakAll = [...document.querySelectorAll('body *')]
        .filter(visible)
        .filter((element) => !element.closest('code,pre,kbd,samp,[data-long-value],.contract-address,.transaction-hash'))
        .filter((element) => window.getComputedStyle(element).wordBreak === 'break-all')
        .slice(0, 10)
        .map((element) => element.tagName.toLowerCase() + (element.className ? `.${String(element.className).split(/\s+/).slice(0, 2).join('.')}` : ''));
      return {
        kind,
        viewportWidth: window.innerWidth,
        scrollWidth: Math.max(root.scrollWidth, body.scrollWidth),
        pageHeight: Math.max(root.scrollHeight, body.scrollHeight),
        h1Size: h1 ? Number.parseFloat(window.getComputedStyle(h1).fontSize) : 0,
        tableColumnCount: document.querySelectorAll('.stablecoin-index-table thead th').length,
        visibleTableRows: tableRows.length,
        maxTableRowHeight: tableRows.length ? Math.max(...tableRows.map((row) => row.getBoundingClientRect().height)) : 0,
        visibleCards: cards.length,
        maxCardHeight: cards.length ? Math.max(...cards.map((card) => card.getBoundingClientRect().height)) : 0,
        filterPanelOpen: filterPanel instanceof HTMLDetailsElement ? filterPanel.open : null,
        openChildFilters: childFilters.filter((filter) => filter instanceof HTMLDetailsElement && filter.open).length,
        noResultsVisible: visible(noResults),
        moreDetailsVisible: [...document.querySelectorAll('summary,button,a')].filter(visible).some((element) => /more record details/i.test(element.textContent || '')),
        tableVisible: visible(document.querySelector('.stablecoin-index-table')),
        cardsVisible: visible(document.querySelector('.stablecoin-index-cards')),
        ordinaryBreakAll,
        mobile: width <= 860
      };
    }, { kind: state.kind, width: viewport.width });

    const recordFailures = [];
    if (!response?.ok()) recordFailures.push(`document response ${response?.status() ?? 'missing'}`);
    if (consoleErrors.length) recordFailures.push(`console errors: ${consoleErrors.join(' | ')}`);
    if (pageErrors.length) recordFailures.push(`page errors: ${pageErrors.join(' | ')}`);
    if (failedRequests.length) recordFailures.push(`failed requests: ${failedRequests.join(' | ')}`);
    if (audit.scrollWidth > audit.viewportWidth + 1) recordFailures.push(`horizontal overflow ${audit.scrollWidth} > ${audit.viewportWidth}`);
    if (audit.ordinaryBreakAll.length) recordFailures.push(`ordinary break-all: ${audit.ordinaryBreakAll.join(', ')}`);

    const heightBudget = state.kind === 'home' ? (viewport.width <= 860 ? 6000 : 4000) : state.kind === 'empty' ? 2400 : (viewport.width <= 860 ? 6000 : 4500);
    if (audit.pageHeight > heightBudget) recordFailures.push(`page height ${audit.pageHeight}px exceeds ${heightBudget}px`);

    if (state.kind !== 'home') {
      if (audit.tableColumnCount !== 6) recordFailures.push(`register has ${audit.tableColumnCount} columns instead of 6`);
      if (audit.filterPanelOpen) recordFailures.push('filter panel is open by default');
      if (audit.openChildFilters) recordFailures.push(`${audit.openChildFilters} child filters are open by default`);
      if (audit.moreDetailsVisible) recordFailures.push('repeated More record details control is visible');
      if (audit.mobile) {
        if (!audit.cardsVisible || audit.tableVisible) recordFailures.push('mobile register representation is incorrect');
        if (audit.visibleCards && audit.maxCardHeight > 112.5) recordFailures.push(`mobile row height ${audit.maxCardHeight}px exceeds 112px`);
      } else {
        if (!audit.tableVisible || audit.cardsVisible) recordFailures.push('desktop register representation is incorrect');
        if (audit.visibleTableRows && audit.maxTableRowHeight > 68.5) recordFailures.push(`desktop row height ${audit.maxTableRowHeight}px exceeds 68px`);
      }
      if (state.kind === 'empty' && !audit.noResultsVisible) recordFailures.push('empty state is not visible');
      if (state.kind !== 'empty' && audit.noResultsVisible) recordFailures.push('empty state is visible for a non-empty state');
    }

    const screenshot = path.join(viewportDir, `${state.id}.png`);
    await page.screenshot({ path: screenshot, fullPage: true, animations: 'disabled' });
    records.push({ viewport: viewport.id, state: state.id, route: state.pathname, screenshot: path.relative(outputRoot, screenshot), ...audit, consoleErrors, pageErrors, failedRequests, failures: recordFailures });
    for (const failure of recordFailures) failures.push(`${viewport.id} ${state.id}: ${failure}`);
    await page.close();
  }
}

await browser.close();
const manifest = { schemaVersion: '1.0', authority: 'docs/ui-v3-remediation-authority.md', phase: 'R3', createdAt: new Date().toISOString(), baseUrl, captureCount: records.length, failureCount: failures.length, failures, records };
fs.writeFileSync(path.join(outputRoot, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const cards = records.map((record) => `<article class="card ${record.failures.length ? 'failed' : ''}"><header><strong>${escapeHtml(record.viewport)} · ${escapeHtml(record.state)}</strong><span>${record.pageHeight}px</span></header><img src="${escapeHtml(record.screenshot)}" alt="${escapeHtml(`${record.viewport} ${record.state}`)}" loading="lazy">${record.failures.length ? `<pre>${escapeHtml(record.failures.join('\n'))}</pre>` : '<p>Pass</p>'}</article>`).join('');
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>R3 audit</title><style>body{margin:0;padding:24px;background:#071018;color:#edf6f8;font:14px system-ui,sans-serif}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px}.card{border:1px solid #35505d;background:#0c1820}.card.failed{border-color:#ff7b72}.card header{padding:10px;display:flex;justify-content:space-between}.card img{display:block;width:100%;background:white}.card p,.card pre{margin:0;padding:10px;white-space:pre-wrap}</style></head><body><h1>R3 Home and Register</h1><p>${records.length} captures · ${failures.length} failures</p><div class="grid">${cards}</div></body></html>`;
fs.writeFileSync(path.join(outputRoot, 'contact-sheet.html'), html);
if (failures.length) {
  console.error(`UI remediation R3 audit failed with ${failures.length} failure(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(`UI remediation R3 audit passed: ${records.length} captures.`);
}
