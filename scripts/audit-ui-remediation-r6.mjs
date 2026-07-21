import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = String(process.env.SOG_SCREENSHOT_BASE_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
const outputRoot = path.resolve('artifacts/ui-remediation-r6');
const viewports = [
  { id: 'desktop-1440', width: 1440, height: 900 },
  { id: 'desktop-1280', width: 1280, height: 800 },
  { id: 'tablet-768', width: 768, height: 1024 },
  { id: 'mobile-390', width: 390, height: 844 },
  { id: 'mobile-320', width: 320, height: 568 }
];
const states = [
  { id: 'guides-index', family: 'guides-index', pathname: '/guides/' },
  { id: 'guide-article', family: 'guide-article', pathname: '/guides/what-is-a-depeg/' },
  { id: 'methodology', family: 'methodology', pathname: '/methodology/' }
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
    await page.waitForTimeout(350);
    const audit = await page.evaluate(({ width, family }) => {
      const visible = (element) => {
        if (!(element instanceof Element)) return false;
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) !== 0 && rect.width > 0 && rect.height > 0;
      };
      const root = document.documentElement;
      const body = document.body;
      const h1 = document.querySelector('h1');
      const guideRegisters = [...document.querySelectorAll('[data-r6-guide-register]')];
      const guideColumnCounts = guideRegisters.map((table) => table.querySelectorAll('thead th').length);
      const guideRows = [...document.querySelectorAll('[data-r6-guide-register] tbody tr')].filter(visible);
      const guideRowHeights = guideRows.map((item) => item.getBoundingClientRect().height);
      const tables = [...document.querySelectorAll('table')].filter(visible);
      const tableSizes = tables.flatMap((table) => [...table.querySelectorAll('th,td')].filter(visible).map((cell) => Number.parseFloat(window.getComputedStyle(cell).fontSize))).filter(Number.isFinite);
      const contents = document.querySelector('[data-r6-contents-details]');
      const reference = document.querySelector('[data-r6-reference]');
      const primary = document.querySelector('.r6-methodology-primary') ?? document.querySelector('.r6-guide-article-page article') ?? document.querySelector('.r6-guide-article-page .longform-content') ?? document.querySelector('.r6-guide-article-page .prose');
      const ordinaryText = [...document.querySelectorAll('h1,h2,h3,p,a,th,td,li,dt,dd')].filter(visible);
      return {
        family,
        viewportWidth: window.innerWidth,
        scrollWidth: Math.max(root.scrollWidth, body.scrollWidth),
        pageHeight: Math.max(root.scrollHeight, body.scrollHeight),
        isMobile: width <= 760,
        h1Size: h1 ? Number.parseFloat(window.getComputedStyle(h1).fontSize) : 0,
        guideVersion: document.querySelector('[data-secondary-version="r6-guides"]') !== null,
        guideRegisterCount: guideRegisters.length,
        guideColumnCounts,
        guideRows: guideRows.length,
        maxGuideRowHeight: guideRowHeights.length ? Math.max(...guideRowHeights) : 0,
        visibleDuplicateGuideMobile: [...document.querySelectorAll('.guide-index-mobile')].filter(visible).length,
        contentsLinks: document.querySelectorAll('[data-r6-contents-list] a').length,
        contentsOpen: contents instanceof HTMLDetailsElement ? contents.open : null,
        contentsCurrent: document.querySelectorAll('[data-r6-contents-list] a[aria-current]').length,
        referenceOpen: reference instanceof HTMLDetailsElement ? reference.open : null,
        operationalSummaryPresent: document.querySelector('.r6-methodology-summary h2')?.textContent?.trim() === 'Operational summary',
        primaryWidth: primary instanceof Element ? primary.getBoundingClientRect().width : 0,
        minimumVisibleTableTextSize: tableSizes.length ? Math.min(...tableSizes) : 0,
        breakAllCount: ordinaryText.filter((item) => window.getComputedStyle(item).wordBreak === 'break-all').length,
        essentialEllipsisCount: ordinaryText.filter((item) => window.getComputedStyle(item).textOverflow === 'ellipsis').length,
        visibleErrorText: /failed to load|contract mismatch|index unavailable|internal server error|undefined is not/i.test(body.innerText)
      };
    }, { width: viewport.width, family: state.family });

    const stateFailures = [];
    if (!response?.ok()) stateFailures.push(`response ${response?.status() ?? 'missing'}`);
    if (consoleErrors.length) stateFailures.push(`console errors ${consoleErrors.join(' | ')}`);
    if (pageErrors.length) stateFailures.push(`page errors ${pageErrors.join(' | ')}`);
    if (failedRequests.length) stateFailures.push(`failed requests ${failedRequests.join(' | ')}`);
    if (audit.scrollWidth > audit.viewportWidth + 1) stateFailures.push(`horizontal overflow ${audit.scrollWidth}/${audit.viewportWidth}`);
    if (audit.h1Size > (audit.isMobile ? 36 : 48)) stateFailures.push(`H1 too large ${audit.h1Size}`);
    if (audit.h1Size < (audit.isMobile ? 28 : 32)) stateFailures.push(`H1 too small ${audit.h1Size}`);
    if (audit.minimumVisibleTableTextSize > 0 && audit.minimumVisibleTableTextSize < 14) stateFailures.push(`table text below 14px ${audit.minimumVisibleTableTextSize}`);
    if (audit.breakAllCount) stateFailures.push(`ordinary break-all ${audit.breakAllCount}`);
    if (audit.essentialEllipsisCount) stateFailures.push(`essential ellipsis ${audit.essentialEllipsisCount}`);
    if (audit.visibleErrorText) stateFailures.push('visible runtime error text');

    if (state.family === 'guides-index') {
      if (!audit.guideVersion) stateFailures.push('R6 Guide index marker missing');
      if (audit.guideRegisterCount < 1) stateFailures.push('Guide registers missing');
      if (audit.guideColumnCounts.some((count) => count !== 4)) stateFailures.push(`Guide column counts ${audit.guideColumnCounts.join(',')}/4 each`);
      if (audit.guideRows < 1) stateFailures.push('Guide rows missing');
      if (audit.visibleDuplicateGuideMobile !== 0) stateFailures.push(`duplicate mobile Guide surface ${audit.visibleDuplicateGuideMobile}`);
      if (audit.isMobile && audit.maxGuideRowHeight > 180) stateFailures.push(`Guide mobile row height ${audit.maxGuideRowHeight}/180`);
    }

    if (state.family === 'guide-article' || state.family === 'methodology') {
      if (audit.contentsLinks < 2) stateFailures.push(`contents links ${audit.contentsLinks}/2`);
      if (audit.contentsCurrent !== 1) stateFailures.push(`current contents section ${audit.contentsCurrent}/1`);
      if (audit.isMobile && audit.contentsOpen !== false) stateFailures.push('mobile contents open by default');
      if (!audit.isMobile && audit.contentsOpen !== true) stateFailures.push('desktop contents closed by default');
      if (audit.primaryWidth > 800) stateFailures.push(`reading width ${audit.primaryWidth}/800`);
    }

    if (state.family === 'methodology') {
      if (!audit.operationalSummaryPresent) stateFailures.push('operational summary missing');
      if (audit.referenceOpen !== false) stateFailures.push('internal enum reference open by default');
    }

    const budget = state.family === 'guides-index' ? (audit.isMobile ? 6500 : 5000) : (audit.isMobile ? 8500 : 7500);
    if (audit.pageHeight > budget) stateFailures.push(`page height ${audit.pageHeight}/${budget}`);

    const screenshot = path.join(viewportDir, `${state.id}.png`);
    await page.screenshot({ path: screenshot, fullPage: true });
    const record = { id: `${viewport.id}-${state.id}`, route: state.pathname, viewport, state, screenshot: path.relative(outputRoot, screenshot), audit, consoleErrors, pageErrors, failedRequests, failures: stateFailures };
    records.push(record);
    for (const failure of stateFailures) failures.push(`${record.id}: ${failure}`);
    await page.close();
  }
}

await browser.close();
const manifest = { schema_version: '1.1', generated_at: new Date().toISOString(), capture_count: records.length, failure_count: failures.length, records, failures };
fs.writeFileSync(path.join(outputRoot, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
fs.writeFileSync(path.join(outputRoot, 'contact-sheet.html'), `<!doctype html><meta charset="utf-8"><title>UI remediation R6</title><style>body{font-family:system-ui;margin:24px;background:#111;color:#eee}section{margin:0 0 32px}img{max-width:100%;border:1px solid #555}pre{white-space:pre-wrap}</style><h1>UI remediation R6 audit</h1>${records.map((record) => `<section><h2>${record.id}</h2><p>${record.route} · ${record.audit.pageHeight}px · ${record.failures.length ? 'FAIL' : 'PASS'}</p><img src="${record.screenshot}" alt="${record.id}"><pre>${record.failures.join('\n')}</pre></section>`).join('')}`);
if (failures.length) { console.error(`UI remediation R6 audit failed with ${failures.length} failure(s):`); failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1); }
console.log(`UI remediation R6 audit passed: ${records.length} captures.`);
