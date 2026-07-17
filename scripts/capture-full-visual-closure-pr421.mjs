import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const baseUrl = String(process.env.SOG_SCREENSHOT_BASE_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
const outputRoot = path.join(root, 'artifacts/pr421-full-visual-closure');
fs.rmSync(outputRoot, { recursive: true, force: true });
fs.mkdirSync(outputRoot, { recursive: true });

const design = JSON.parse(fs.readFileSync(path.join(root, 'config/ui-v3-rebuild-design-contract-pr409.json'), 'utf8'));
const routeByState = {
  'register-desktop-filtered': '/stablecoins/?lifecycle=active&sort=evidence_most',
  'register-mobile-filtered': '/stablecoins/?lifecycle=active&sort=evidence_most',
  'register-empty': '/stablecoins/?q=__sog_no_matching_record__'
};
const states = design.visual_review_matrix.map((state) => ({
  ...state,
  route: routeByState[state.id] ?? state.route,
  device: state.viewport.width <= 390 ? 'mobile' : 'desktop'
}));

const markerSelector = {
  home: '[data-home-registry="pr413"]',
  stablecoin_register: '[data-register-version="pr413"]',
  stablecoin_dossier: '[data-dossier-version="pr415"]',
  events: '[data-register-version="pr417-events"]',
  organizations: '[data-register-version="pr417-organizations"]',
  guides: '[data-secondary-version="pr419-guide-article"]'
};

const browser = await chromium.launch({ headless: true });
const records = [];
const failures = [];
try {
  for (const state of states) {
    const context = await browser.newContext({ viewport: state.viewport, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const response = await page.goto(`${baseUrl}${state.route}`, { waitUntil: 'networkidle', timeout: 60_000 });
    if (!response?.ok()) {
      failures.push(`${state.id}: HTTP ${response?.status() ?? 'no response'}`);
      await context.close();
      continue;
    }
    await page.evaluate(() => document.fonts.ready);
    await page.waitForSelector(markerSelector[state.template], { timeout: 20_000 });
    await page.waitForTimeout(500);

    const metrics = await page.evaluate(({ template, stateId }) => {
      const body = document.body;
      const html = document.documentElement;
      const scrollWidth = Math.max(body.scrollWidth, html.scrollWidth);
      const h1 = document.querySelector('h1');
      const visible = (selector) => [...document.querySelectorAll(selector)].filter((node) => !(node instanceof HTMLElement) || !node.hidden);
      const localScrollable = [...document.querySelectorAll('main *')].filter((node) => {
        if (!(node instanceof HTMLElement)) return false;
        const style = getComputedStyle(node);
        return ['auto', 'scroll'].includes(style.overflowX) && node.scrollWidth > node.clientWidth + 1;
      }).length;
      const common = {
        shellPresent: Boolean(document.querySelector('[data-shell="evidence-registry-pr411"]')),
        markerPresent: true,
        horizontalOverflow: scrollWidth > html.clientWidth + 1,
        viewportWidth: html.clientWidth,
        scrollWidth,
        bodyHeight: body.scrollHeight,
        title: h1?.textContent?.trim() ?? '',
        h1FontSize: h1 ? Number.parseFloat(getComputedStyle(h1).fontSize) : 0,
        localScrollable,
        documentTitle: document.title
      };

      if (template === 'home') {
        return {
          ...common,
          searchPresent: Boolean(document.querySelector('[data-home-search], input[type="search"]')),
          explorationLinks: document.querySelectorAll('[data-home-registry="pr413"] a').length,
          registryStatePresent: Boolean(document.querySelector('[data-home-registry-state], .home-registry-state, .home-summary-ledger'))
        };
      }
      if (template === 'stablecoin_register') {
        const rows = visible('[data-registry-row]');
        const cards = visible('[data-registry-card]');
        const noResults = document.querySelector('[data-no-results]');
        return {
          ...common,
          visibleRows: rows.length,
          visibleCards: cards.length,
          activeChips: document.querySelectorAll('.active-filter-chip').length,
          resultCountPresent: Boolean(document.querySelector('[data-result-count], [data-register-result-count]')),
          clearPresent: Boolean(document.querySelector('[data-clear-all], [data-register-clear-all]')),
          noResultsVisible: noResults instanceof HTMLElement ? !noResults.hidden : false,
          filterInputs: document.querySelectorAll('[data-filter-group], input[type="checkbox"]').length,
          query: window.location.search,
          stateId
        };
      }
      if (template === 'stablecoin_dossier') {
        return {
          ...common,
          decisionItems: document.querySelectorAll('.stablecoin-decision-grid > div').length,
          navPresent: Boolean(document.querySelector('.stablecoin-dossier-nav')),
          reserves: Boolean(document.querySelector('#reserves-redemption')),
          organizations: Boolean(document.querySelector('#organizations-control')),
          history: Boolean(document.querySelector('#history')),
          unknowns: Boolean(document.querySelector('#known-unknowns')),
          evidence: Boolean(document.querySelector('#evidence'))
        };
      }
      if (template === 'events') {
        return {
          ...common,
          visibleRows: visible('[data-event-row]').length,
          visibleCards: visible('[data-event-card]').length,
          searchPresent: Boolean(document.querySelector('[data-event-search]')),
          filters: document.querySelectorAll('[data-event-filter-group]').length,
          pagination: Boolean(document.querySelector('[data-event-pagination]'))
        };
      }
      if (template === 'organizations') {
        return {
          ...common,
          visibleRows: visible('[data-organization-row]').length,
          visibleCards: visible('[data-organization-card]').length,
          searchPresent: Boolean(document.querySelector('[data-organization-search]')),
          filters: document.querySelectorAll('[data-organization-filter-group]').length,
          pagination: Boolean(document.querySelector('[data-organization-pagination]'))
        };
      }
      return {
        ...common,
        tocPresent: Boolean(document.querySelector('[data-guide-toc]')),
        tocLinks: document.querySelectorAll('[data-guide-toc-list] a').length,
        articleSections: document.querySelectorAll('.guide-article-content > section').length,
        tables: document.querySelectorAll('.guide-article-content table').length,
        footerLinks: document.querySelectorAll('.guide-article-footer a').length,
        metadataItems: document.querySelectorAll('.guide-article-meta > div').length
      };
    }, { template: state.template, stateId: state.id });

    if (!metrics.shellPresent) failures.push(`${state.id}: shared shell missing`);
    if (!metrics.title) failures.push(`${state.id}: H1 missing`);
    if (metrics.h1FontSize < 28) failures.push(`${state.id}: H1 ${metrics.h1FontSize}px < 28px`);
    if (metrics.horizontalOverflow) failures.push(`${state.id}: horizontal overflow ${metrics.scrollWidth}px > ${metrics.viewportWidth}px`);

    if (state.template === 'home') {
      if (!metrics.searchPresent || metrics.explorationLinks < 3) failures.push(`${state.id}: home search or exploration paths incomplete`);
    } else if (state.template === 'stablecoin_register') {
      if (metrics.visibleRows > 20 || metrics.visibleCards > 20) failures.push(`${state.id}: register exceeds 20 visible records`);
      if (!metrics.resultCountPresent || !metrics.clearPresent) failures.push(`${state.id}: register result count or clear action missing`);
      if (state.state === 'filters_selected' && metrics.activeChips < 1) failures.push(`${state.id}: filtered state has no active chip`);
      if (state.state === 'no_results' && !metrics.noResultsVisible) failures.push(`${state.id}: no-result state not visible`);
    } else if (state.template === 'stablecoin_dossier') {
      if (metrics.decisionItems !== 6 || !metrics.navPresent || !metrics.reserves || !metrics.organizations || !metrics.history || !metrics.unknowns || !metrics.evidence) failures.push(`${state.id}: dossier hierarchy incomplete`);
    } else if (state.template === 'events') {
      if (metrics.visibleRows > 20 || metrics.visibleCards > 20 || !metrics.searchPresent || metrics.filters < 5 || !metrics.pagination) failures.push(`${state.id}: event register is unbounded or incomplete`);
    } else if (state.template === 'organizations') {
      if (metrics.visibleRows > 20 || metrics.visibleCards > 20 || !metrics.searchPresent || metrics.filters < 5 || !metrics.pagination) failures.push(`${state.id}: organization register is unbounded or incomplete`);
    } else if (state.template === 'guides') {
      if (!metrics.tocPresent || metrics.tocLinks < 5 || metrics.articleSections < 5 || metrics.tables < 1 || metrics.footerLinks < 4 || metrics.metadataItems < 3) failures.push(`${state.id}: guide hierarchy incomplete`);
    }

    const file = `${state.id}.png`;
    await page.screenshot({ path: path.join(outputRoot, file), fullPage: true, animations: 'disabled' });
    records.push({ ...state, file, metrics, automated_gate: 'pass', owner_status: 'pending' });
    await context.close();
  }
} finally {
  await browser.close();
}

if (records.length !== states.length) failures.push(`expected ${states.length} captures, found ${records.length}`);
const manifest = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  implementation_pr: 421,
  phase: 'PR G',
  status: failures.length ? 'failed' : 'awaiting_owner_review',
  owner_approval: false,
  expected_capture_count: states.length,
  capture_count: records.length,
  failure_count: failures.length,
  horizontal_overflow_failure_count: failures.filter((failure) => failure.includes('horizontal overflow')).length,
  accepted_desktop: 0,
  accepted_mobile: 0,
  records,
  failures
};
fs.writeFileSync(path.join(outputRoot, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
if (failures.length) {
  console.error(JSON.stringify(manifest, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, captures: records.length, owner_approval: false, status: 'AWAITING OWNER REVIEW', output: 'artifacts/pr421-full-visual-closure' }, null, 2));
