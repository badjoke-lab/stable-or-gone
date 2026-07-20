import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = String(process.env.SOG_SCREENSHOT_BASE_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
const outputRoot = path.resolve('artifacts/ui-remediation-r4');
const viewports = [
  { id: 'desktop-1440', width: 1440, height: 900 },
  { id: 'desktop-1280', width: 1280, height: 800 },
  { id: 'tablet-768', width: 768, height: 1024 },
  { id: 'mobile-390', width: 390, height: 844 },
  { id: 'mobile-320', width: 320, height: 568 }
];
const states = [
  { id: 'usdc', pathname: '/stablecoin/usdc/' },
  { id: 'ust', pathname: '/stablecoin/ust/' },
  { id: 'busd', pathname: '/stablecoin/busd/' }
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
    await page.waitForTimeout(250);
    const audit = await page.evaluate(({ width }) => {
      const visible = (element) => {
        if (!(element instanceof Element)) return false;
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) !== 0 && rect.width > 0 && rect.height > 0;
      };
      const root = document.documentElement;
      const body = document.body;
      const h1 = document.querySelector('h1');
      const sections = [...document.querySelectorAll('[data-r4-section]')].filter((item) => item instanceof HTMLDetailsElement);
      const firstEvidenceTable = document.querySelector('#evidence > .stablecoin-r4-section-body > .stablecoin-r4-evidence-table table');
      const firstEvidenceRows = firstEvidenceTable ? firstEvidenceTable.querySelectorAll('tbody tr').length : 0;
      const visibleTableTextSizes = [...document.querySelectorAll('.stablecoin-dossier-r4 table th, .stablecoin-dossier-r4 table td')]
        .filter(visible)
        .map((cell) => Number.parseFloat(window.getComputedStyle(cell).fontSize))
        .filter(Number.isFinite);
      const bodyText = body.innerText;
      return {
        viewportWidth: window.innerWidth,
        scrollWidth: Math.max(root.scrollWidth, body.scrollWidth),
        pageHeight: Math.max(root.scrollHeight, body.scrollHeight),
        h1Size: h1 ? Number.parseFloat(window.getComputedStyle(h1).fontSize) : 0,
        primaryFacts: document.querySelectorAll('.stablecoin-dossier-facts-r4 > div').length,
        navLinks: document.querySelectorAll('.stablecoin-dossier-nav-r4 a').length,
        r4Sections: sections.length,
        openSections: sections.filter((section) => section.open).length,
        visibleEvents: document.querySelectorAll('#events > .stablecoin-r4-section-body > .stablecoin-r4-event-list > li').length,
        initialEvidenceRows: firstEvidenceRows,
        organizationColumns: document.querySelectorAll('.stablecoin-organizations-table-r4 thead th').length,
        minimumVisibleTableTextSize: visibleTableTextSizes.length ? Math.min(...visibleTableTextSizes) : 0,
        overviewVisible: visible(document.querySelector('#overview')),
        errorTextVisible: /failed to load|contract mismatch|index unavailable|comparison data failed|undefined is not|internal server error/i.test(bodyText),
        ordinaryBreakAll: [...document.querySelectorAll('body *')]
          .filter(visible)
          .filter((element) => !element.closest('code,pre,kbd,samp,[data-long-value],.contract-address,.transaction-hash'))
          .filter((element) => window.getComputedStyle(element).wordBreak === 'break-all')
          .slice(0, 10)
          .map((element) => element.tagName.toLowerCase() + (element.className ? `.${String(element.className).split(/\s+/).slice(0, 2).join('.')}` : '')),
        isMobile: width <= 760
      };
    }, { width: viewport.width });

    const stateFailures = [];
    if (!response?.ok()) stateFailures.push(`response ${response?.status() ?? 'missing'}`);
    if (consoleErrors.length) stateFailures.push(`console errors ${consoleErrors.join(' | ')}`);
    if (pageErrors.length) stateFailures.push(`page errors ${pageErrors.join(' | ')}`);
    if (failedRequests.length) stateFailures.push(`failed requests ${failedRequests.join(' | ')}`);
    if (audit.scrollWidth > audit.viewportWidth + 1) stateFailures.push(`horizontal overflow ${audit.scrollWidth}/${audit.viewportWidth}`);
    if (audit.h1Size > (audit.isMobile ? 36 : 48)) stateFailures.push(`H1 too large ${audit.h1Size}`);
    if (audit.h1Size < (audit.isMobile ? 28 : 32)) stateFailures.push(`H1 too small ${audit.h1Size}`);
    if (audit.primaryFacts !== 6) stateFailures.push(`primary facts ${audit.primaryFacts}/6`);
    if (audit.navLinks !== 8) stateFailures.push(`section nav links ${audit.navLinks}/8`);
    if (audit.r4Sections < 8) stateFailures.push(`R4 sections ${audit.r4Sections}/8 minimum`);
    if (audit.isMobile && audit.openSections !== 0) stateFailures.push(`mobile open sections ${audit.openSections}/0`);
    if (!audit.isMobile && audit.openSections !== audit.r4Sections) stateFailures.push(`desktop open sections ${audit.openSections}/${audit.r4Sections}`);
    if (audit.visibleEvents > 5) stateFailures.push(`initial events ${audit.visibleEvents}/5 maximum`);
    if (audit.initialEvidenceRows > 10) stateFailures.push(`initial evidence rows ${audit.initialEvidenceRows}/10 maximum`);
    if (audit.organizationColumns > 5) stateFailures.push(`organization columns ${audit.organizationColumns}/5 maximum`);
    if (audit.minimumVisibleTableTextSize > 0 && audit.minimumVisibleTableTextSize < 14) stateFailures.push(`table text below 14px ${audit.minimumVisibleTableTextSize}`);
    if (!audit.overviewVisible) stateFailures.push('overview not visible');
    if (audit.errorTextVisible) stateFailures.push('visible runtime error text');
    if (audit.ordinaryBreakAll.length) stateFailures.push(`ordinary break-all ${audit.ordinaryBreakAll.join(', ')}`);
    const heightBudget = audit.isMobile ? 9000 : 8500;
    if (audit.pageHeight > heightBudget) stateFailures.push(`page height ${audit.pageHeight}/${heightBudget}`);

    const screenshot = path.join(viewportDir, `${state.id}.png`);
    await page.screenshot({ path: screenshot, fullPage: true });
    const record = {
      id: `${viewport.id}-${state.id}`,
      route: state.pathname,
      viewport,
      screenshot: path.relative(outputRoot, screenshot),
      audit,
      consoleErrors,
      pageErrors,
      failedRequests,
      failures: stateFailures
    };
    records.push(record);
    for (const failure of stateFailures) failures.push(`${record.id}: ${failure}`);
    await page.close();
  }
}

await browser.close();
const manifest = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  capture_count: records.length,
  failure_count: failures.length,
  records,
  failures
};
fs.writeFileSync(path.join(outputRoot, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
fs.writeFileSync(path.join(outputRoot, 'contact-sheet.html'), `<!doctype html><meta charset="utf-8"><title>UI remediation R4</title><style>body{font-family:system-ui;margin:24px;background:#111;color:#eee}section{margin:0 0 32px}img{max-width:100%;border:1px solid #555}pre{white-space:pre-wrap}</style><h1>UI remediation R4 dossier audit</h1>${records.map((record) => `<section><h2>${record.id}</h2><p>${record.route} · ${record.audit.pageHeight}px · ${record.failures.length ? 'FAIL' : 'PASS'}</p><img src="${record.screenshot}" alt="${record.id}"><pre>${record.failures.join('\n')}</pre></section>`).join('')}`);

if (failures.length) {
  console.error(`UI remediation R4 audit failed with ${failures.length} failure(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`UI remediation R4 audit passed: ${records.length} captures.`);
