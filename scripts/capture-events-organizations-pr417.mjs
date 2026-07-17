import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const baseUrl = String(process.env.SOG_SCREENSHOT_BASE_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
const outputRoot = path.join(root, 'artifacts/pr417-events-organizations');
fs.rmSync(outputRoot, { recursive:true, force:true });
fs.mkdirSync(outputRoot, { recursive:true });

const states = [
  { id:'events-desktop', kind:'event-index', route:'/events/', viewport:{ width:1440, height:1000 } },
  { id:'events-mobile', kind:'event-index', route:'/events/', viewport:{ width:390, height:844 } },
  { id:'event-ust-collapse-desktop', kind:'event-detail', route:'/event/sog_ev_ust_2022_05_collapse/', viewport:{ width:1440, height:1000 } },
  { id:'event-ust-collapse-mobile', kind:'event-detail', route:'/event/sog_ev_ust_2022_05_collapse/', viewport:{ width:390, height:844 } },
  { id:'organizations-desktop', kind:'organization-index', route:'/issuers/', viewport:{ width:1440, height:1000 } },
  { id:'organizations-mobile', kind:'organization-index', route:'/issuers/', viewport:{ width:390, height:844 } },
  { id:'organization-circle-desktop', kind:'organization-detail', route:'/issuer/circle/', viewport:{ width:1440, height:1000 } },
  { id:'organization-circle-mobile', kind:'organization-detail', route:'/issuer/circle/', viewport:{ width:390, height:844 } }
];

const browser = await chromium.launch({ headless:true });
const records = [];
const failures = [];
try {
  for (const state of states) {
    const context = await browser.newContext({ viewport:state.viewport, deviceScaleFactor:1, reducedMotion:'reduce' });
    const page = await context.newPage();
    const response = await page.goto(`${baseUrl}${state.route}`, { waitUntil:'networkidle', timeout:45_000 });
    if (!response?.ok()) { failures.push(`${state.id}: HTTP ${response?.status() ?? 'no response'}`); await context.close(); continue; }
    await page.evaluate(() => document.fonts.ready);
    const selector = state.kind === 'event-index' ? '[data-register-version="pr417-events"]' : state.kind === 'organization-index' ? '[data-register-version="pr417-organizations"]' : state.kind === 'event-detail' ? '[data-record-version="pr417-event"]' : '[data-record-version="pr417-organization"]';
    await page.waitForSelector(selector, { timeout:15_000 });
    await page.waitForTimeout(250);
    const metrics = await page.evaluate((kind) => {
      const body = document.body;
      const html = document.documentElement;
      const scrollWidth = Math.max(body.scrollWidth, html.scrollWidth);
      const common = {
        shellPresent: Boolean(document.querySelector('[data-shell="evidence-registry-pr411"]')),
        horizontalOverflow: scrollWidth > html.clientWidth + 1,
        viewportWidth: html.clientWidth,
        scrollWidth,
        bodyHeight: body.scrollHeight,
        title: document.querySelector('h1')?.textContent?.trim() ?? '',
        documentTitle: document.title
      };
      if (kind === 'event-index') {
        const rows = [...document.querySelectorAll('[data-event-row]')];
        const cards = [...document.querySelectorAll('[data-event-card]')];
        return { ...common, markerPresent:Boolean(document.querySelector('[data-register-version="pr417-events"]')), search:Boolean(document.querySelector('[data-event-search]')), sort:Boolean(document.querySelector('[data-event-sort]')), filters:document.querySelectorAll('[data-event-filter-group]').length, visibleRows:rows.filter((item) => !(item instanceof HTMLElement) || !item.hidden).length, visibleCards:cards.filter((item) => !(item instanceof HTMLElement) || !item.hidden).length, resultCount:Boolean(document.querySelector('[data-event-result-count]')), pagination:Boolean(document.querySelector('[data-event-pagination]')), emptyState:Boolean(document.querySelector('[data-event-no-results]')) };
      }
      if (kind === 'organization-index') {
        const rows = [...document.querySelectorAll('[data-organization-row]')];
        const cards = [...document.querySelectorAll('[data-organization-card]')];
        return { ...common, markerPresent:Boolean(document.querySelector('[data-register-version="pr417-organizations"]')), search:Boolean(document.querySelector('[data-organization-search]')), sort:Boolean(document.querySelector('[data-organization-sort]')), filters:document.querySelectorAll('[data-organization-filter-group]').length, visibleRows:rows.filter((item) => !(item instanceof HTMLElement) || !item.hidden).length, visibleCards:cards.filter((item) => !(item instanceof HTMLElement) || !item.hidden).length, resultCount:Boolean(document.querySelector('[data-organization-result-count]')), pagination:Boolean(document.querySelector('[data-organization-pagination]')), emptyState:Boolean(document.querySelector('[data-organization-no-results]')) };
      }
      if (kind === 'event-detail') return { ...common, markerPresent:Boolean(document.querySelector('[data-record-version="pr417-event"]')), nav:Boolean(document.querySelector('.event-detail-nav')), overview:Boolean(document.querySelector('#overview')), subjects:Boolean(document.querySelector('#subjects')), sources:Boolean(document.querySelector('#sources')), corrections:Boolean(document.querySelector('#corrections')), ledgerItems:document.querySelectorAll('.event-detail-ledger > div').length };
      return { ...common, markerPresent:Boolean(document.querySelector('[data-record-version="pr417-organization"]')), nav:Boolean(document.querySelector('.organization-detail-nav')), overview:Boolean(document.querySelector('#overview')), relationships:Boolean(document.querySelector('#relationships')), events:Boolean(document.querySelector('#events')), evidence:Boolean(document.querySelector('#evidence')), unknowns:Boolean(document.querySelector('#unknowns')), corrections:Boolean(document.querySelector('#corrections')), ledgerItems:document.querySelectorAll('.organization-detail-ledger > div').length };
    }, state.kind);

    if (!metrics.shellPresent) failures.push(`${state.id}: shared shell missing`);
    if (!metrics.markerPresent) failures.push(`${state.id}: route marker missing`);
    if (!metrics.title) failures.push(`${state.id}: page title missing`);
    if (metrics.horizontalOverflow) failures.push(`${state.id}: horizontal overflow ${metrics.scrollWidth}px > ${metrics.viewportWidth}px`);
    if (state.kind.endsWith('index')) {
      if (!metrics.search || !metrics.sort || !metrics.resultCount || !metrics.pagination || !metrics.emptyState) failures.push(`${state.id}: register controls incomplete`);
      if (metrics.filters < 5) failures.push(`${state.id}: expected at least five filter options`);
      if (metrics.visibleRows > 20 || metrics.visibleCards > 20) failures.push(`${state.id}: primary index is not bounded to 20`);
    } else if (state.kind === 'event-detail') {
      for (const key of ['nav','overview','subjects','sources','corrections']) if (!metrics[key]) failures.push(`${state.id}: ${key} missing`);
      if (metrics.ledgerItems < 6) failures.push(`${state.id}: event fact ledger incomplete`);
    } else {
      for (const key of ['nav','overview','relationships','events','evidence','unknowns','corrections']) if (!metrics[key]) failures.push(`${state.id}: ${key} missing`);
      if (metrics.ledgerItems < 6) failures.push(`${state.id}: organization fact ledger incomplete`);
    }
    const file = `${state.id}.png`;
    await page.screenshot({ path:path.join(outputRoot, file), fullPage:true, animations:'disabled' });
    records.push({ ...state, file, metrics });
    await context.close();
  }
} finally { await browser.close(); }

if (records.length !== states.length) failures.push(`expected ${states.length} captures, found ${records.length}`);
const manifest = { schema_version:'1.0', generated_at:new Date().toISOString(), implementation_pr:417, owner_approval:false, expected_capture_count:8, capture_count:records.length, failure_count:failures.length, horizontal_overflow_failure_count:failures.filter((item) => item.includes('horizontal overflow')).length, records, failures };
fs.writeFileSync(path.join(outputRoot, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
if (failures.length) { console.error(JSON.stringify(manifest, null, 2)); process.exit(1); }
console.log(JSON.stringify({ ok:true, captures:records.length, owner_approval:false, output:'artifacts/pr417-events-organizations' }, null, 2));
