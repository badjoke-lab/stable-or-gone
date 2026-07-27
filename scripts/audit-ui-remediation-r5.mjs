import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = String(process.env.SOG_SCREENSHOT_BASE_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
const outputRoot = path.resolve('artifacts/ui-remediation-r5');
const viewports = [
  { id: 'desktop-1440', width: 1440, height: 900 },
  { id: 'desktop-1280', width: 1280, height: 800 },
  { id: 'tablet-768', width: 768, height: 1024 },
  { id: 'mobile-390', width: 390, height: 844 },
  { id: 'mobile-320', width: 320, height: 568 }
];
const states = [
  { id: 'events-default', family: 'events-index', mode: 'default', pathname: '/events/' },
  { id: 'events-filtered', family: 'events-index', mode: 'filtered', pathname: '/events/?q=UST' },
  { id: 'events-empty', family: 'events-index', mode: 'empty', pathname: '/events/?q=__no_such_event__' },
  { id: 'event-detail', family: 'event-detail', mode: 'detail', pathname: '/event/sog_ev_ust_2022_05_collapse/' },
  { id: 'organizations-default', family: 'organizations-index', mode: 'default', pathname: '/issuers/' },
  { id: 'organizations-filtered', family: 'organizations-index', mode: 'filtered', pathname: '/issuers/?q=Circle' },
  { id: 'organizations-empty', family: 'organizations-index', mode: 'empty', pathname: '/issuers/?q=__no_such_organization__' },
  { id: 'organization-detail', family: 'organization-detail', mode: 'detail', pathname: '/issuer/circle/' }
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
    await page.waitForTimeout(300);
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
      const eventCards = [...document.querySelectorAll('[data-event-card]')].filter(visible);
      const organizationCards = [...document.querySelectorAll('[data-organization-card]')].filter(visible);
      const cardHeights = [...eventCards, ...organizationCards].map((item) => item.getBoundingClientRect().height);
      const visibleTableSizes = [...document.querySelectorAll('table th, table td')].filter(visible).map((cell) => Number.parseFloat(window.getComputedStyle(cell).fontSize)).filter(Number.isFinite);
      return {
        viewportWidth: window.innerWidth,
        scrollWidth: Math.max(root.scrollWidth, body.scrollWidth),
        pageHeight: Math.max(root.scrollHeight, body.scrollHeight),
        h1Size: h1 ? Number.parseFloat(window.getComputedStyle(h1).fontSize) : 0,
        isMobile: width <= 760,
        eventColumns: document.querySelectorAll('.event-index-page-r5 thead th').length,
        organizationColumns: document.querySelectorAll('.organization-index-page-r5 thead th').length,
        relationshipColumns: document.querySelectorAll('.organization-relationships-r5 thead th').length,
        visibleEventRows: [...document.querySelectorAll('[data-event-row]')].filter(visible).length,
        visibleOrganizationRows: [...document.querySelectorAll('[data-organization-row]')].filter(visible).length,
        visibleEventCards: eventCards.length,
        visibleOrganizationCards: organizationCards.length,
        maxCardHeight: cardHeights.length ? Math.max(...cardHeights) : 0,
        openFilters: [...document.querySelectorAll('.event-index-filter,.organization-index-filter')].filter((item) => item instanceof HTMLDetailsElement && item.open).length,
        activeFilterChips: document.querySelectorAll('.active-filter-chip').length,
        eventEmptyVisible: visible(document.querySelector('[data-event-no-results]')),
        organizationEmptyVisible: visible(document.querySelector('[data-organization-no-results]')),
        moreEventDetailsText: (body.innerText.match(/More event details/g) || []).length,
        moreOrganizationDetailsText: (body.innerText.match(/More organization details/g) || []).length,
        eventPrimaryFacts: document.querySelectorAll('.event-detail-ledger-r5 > div').length,
        organizationPrimaryFacts: document.querySelectorAll('.organization-detail-ledger-r5 > div').length,
        duplicateEventOverviewCards: document.querySelectorAll('.event-overview-cards').length,
        duplicateEventSourceCards: document.querySelectorAll('.event-source-cards').length,
        duplicateOrganizationOverviewCards: document.querySelectorAll('.organization-overview-cards').length,
        duplicateOrganizationSourceCards: document.querySelectorAll('.organization-source-cards').length,
        organizationUnknownsOpen: document.querySelector('.organization-detail-page-r5 #unknowns') instanceof HTMLDetailsElement ? document.querySelector('.organization-detail-page-r5 #unknowns').open : null,
        minimumVisibleTableTextSize: visibleTableSizes.length ? Math.min(...visibleTableSizes) : 0,
        errorTextVisible: /failed to load|contract mismatch|index unavailable|internal server error|undefined is not/i.test(body.innerText),
        family
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
    if (audit.errorTextVisible) stateFailures.push('visible runtime error text');
    if (audit.moreEventDetailsText) stateFailures.push(`repeated More event details ${audit.moreEventDetailsText}`);
    if (audit.moreOrganizationDetailsText) stateFailures.push(`repeated More organization details ${audit.moreOrganizationDetailsText}`);

    if (state.family === 'events-index') {
      if (audit.eventColumns !== 5) stateFailures.push(`event columns ${audit.eventColumns}/5`);
      if (audit.openFilters !== 0) stateFailures.push(`open event filters ${audit.openFilters}/0`);
      if (audit.isMobile && audit.maxCardHeight > 140) stateFailures.push(`event card height ${audit.maxCardHeight}/140`);
      if (state.mode === 'empty' && (!audit.eventEmptyVisible || audit.visibleEventRows + audit.visibleEventCards !== 0)) stateFailures.push('event empty state invalid');
      if (state.mode === 'filtered' && audit.activeFilterChips < 1) stateFailures.push('event filtered state missing chip');
    }
    if (state.family === 'organizations-index') {
      if (audit.organizationColumns !== 5) stateFailures.push(`organization columns ${audit.organizationColumns}/5`);
      if (audit.openFilters !== 0) stateFailures.push(`open organization filters ${audit.openFilters}/0`);
      if (audit.isMobile && audit.maxCardHeight > 140) stateFailures.push(`organization card height ${audit.maxCardHeight}/140`);
      if (state.mode === 'empty' && (!audit.organizationEmptyVisible || audit.visibleOrganizationRows + audit.visibleOrganizationCards !== 0)) stateFailures.push('organization empty state invalid');
      if (state.mode === 'filtered' && audit.activeFilterChips < 1) stateFailures.push('organization filtered state missing chip');
    }
    if (state.family === 'event-detail') {
      if (audit.eventPrimaryFacts !== 3) stateFailures.push(`event primary facts ${audit.eventPrimaryFacts}/3`);
      if (audit.duplicateEventOverviewCards !== 0) stateFailures.push('duplicate event overview cards');
      if (audit.duplicateEventSourceCards !== 0) stateFailures.push('duplicate event source cards');
    }
    if (state.family === 'organization-detail') {
      if (audit.organizationPrimaryFacts !== 6) stateFailures.push(`organization primary facts ${audit.organizationPrimaryFacts}/6`);
      if (audit.relationshipColumns !== 5) stateFailures.push(`relationship columns ${audit.relationshipColumns}/5`);
      if (audit.duplicateOrganizationOverviewCards !== 0) stateFailures.push('duplicate organization overview cards');
      if (audit.duplicateOrganizationSourceCards !== 0) stateFailures.push('duplicate organization source cards');
      if (audit.isMobile && audit.organizationUnknownsOpen !== false) stateFailures.push('organization unknowns open on mobile');
      if (!audit.isMobile && audit.organizationUnknownsOpen !== true) stateFailures.push('organization unknowns closed on desktop');
    }

    const indexBudget = audit.isMobile ? 6000 : 4200;
    const detailBudget = audit.isMobile ? 6000 : 6000;
    const budget = state.family.endsWith('index') ? indexBudget : detailBudget;
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
const manifest = { schema_version: '1.0', generated_at: new Date().toISOString(), capture_count: records.length, failure_count: failures.length, records, failures };
fs.writeFileSync(path.join(outputRoot, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
fs.writeFileSync(path.join(outputRoot, 'contact-sheet.html'), `<!doctype html><meta charset="utf-8"><title>UI remediation R5</title><style>body{font-family:system-ui;margin:24px;background:#111;color:#eee}section{margin:0 0 32px}img{max-width:100%;border:1px solid #555}pre{white-space:pre-wrap}</style><h1>UI remediation R5 audit</h1>${records.map((record) => `<section><h2>${record.id}</h2><p>${record.route} · ${record.audit.pageHeight}px · ${record.failures.length ? 'FAIL' : 'PASS'}</p><img src="${record.screenshot}" alt="${record.id}"><pre>${record.failures.join('\n')}</pre></section>`).join('')}`);
if (failures.length) { console.error(`UI remediation R5 audit failed with ${failures.length} failure(s):`); failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1); }
console.log(`UI remediation R5 audit passed: ${records.length} captures.`);
