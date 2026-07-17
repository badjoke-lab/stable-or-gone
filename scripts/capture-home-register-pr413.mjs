import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const baseUrl = String(process.env.SOG_SCREENSHOT_BASE_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
const outputRoot = path.join(root, 'artifacts/pr413-home-register');
fs.rmSync(outputRoot, { recursive: true, force: true });
fs.mkdirSync(outputRoot, { recursive: true });

const devices = [
  { id: 'desktop', viewport: { width: 1440, height: 1000 } },
  { id: 'mobile', viewport: { width: 390, height: 844 } }
];
const stateDefinitions = [
  { id: 'home', route: '/', assertion: 'home' },
  { id: 'register-default', route: '/stablecoins/', assertion: 'register-default' },
  { id: 'register-filtered', route: '/stablecoins/?lifecycle=active&sort=evidence_most', assertion: 'register-filtered' },
  { id: 'register-no-results', route: '/stablecoins/?q=__sog_no_matching_record__', assertion: 'register-no-results' },
  { id: 'register-compare', route: '/stablecoins/?compare=usdt,usdc', assertion: 'register-compare' }
];

const browser = await chromium.launch({ headless: true });
const records = [];
const failures = [];
try {
  for (const device of devices) {
    const context = await browser.newContext({ viewport: device.viewport, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    const page = await context.newPage();
    for (const state of stateDefinitions) {
      const url = `${baseUrl}${state.route}`;
      const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 45_000 });
      if (!response?.ok()) {
        failures.push(`${device.id}/${state.id}: HTTP ${response?.status() ?? 'no response'}`);
        continue;
      }
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(250);

      const metrics = await page.evaluate(({ assertion }) => {
        const body = document.body;
        const documentElement = document.documentElement;
        const horizontalOverflow = Math.max(body.scrollWidth, documentElement.scrollWidth) > documentElement.clientWidth + 1;
        const shell = document.querySelector('[data-shell="evidence-registry-pr411"]');
        const home = document.querySelector('[data-home-registry="pr413"]');
        const register = document.querySelector('[data-register-version="pr413"]');
        const activeChips = document.querySelectorAll('.active-filter-chip').length;
        const noResults = document.querySelector('[data-no-results]');
        const comparison = document.querySelector('[data-comparison-panel]');
        const visibleRows = [...document.querySelectorAll('[data-registry-row]')].filter((row) => !(row instanceof HTMLElement) || !row.hidden).length;
        const visibleCards = [...document.querySelectorAll('[data-registry-card]')].filter((card) => !(card instanceof HTMLElement) || !card.hidden).length;
        return {
          assertion,
          horizontalOverflow,
          shellPresent: Boolean(shell),
          homePresent: Boolean(home),
          registerPresent: Boolean(register),
          activeChips,
          noResultsVisible: noResults instanceof HTMLElement ? !noResults.hidden : false,
          comparisonVisible: comparison instanceof HTMLElement ? !comparison.hidden : false,
          visibleRows,
          visibleCards,
          bodyHeight: body.scrollHeight,
          documentTitle: document.title
        };
      }, { assertion: state.assertion });

      if (!metrics.shellPresent) failures.push(`${device.id}/${state.id}: shared shell missing`);
      if (metrics.horizontalOverflow) failures.push(`${device.id}/${state.id}: horizontal overflow`);
      if (state.assertion === 'home' && !metrics.homePresent) failures.push(`${device.id}/${state.id}: home marker missing`);
      if (state.assertion.startsWith('register') && !metrics.registerPresent) failures.push(`${device.id}/${state.id}: register marker missing`);
      if (state.assertion === 'register-default' && (metrics.visibleRows > 20 || metrics.visibleCards > 20)) failures.push(`${device.id}/${state.id}: more than 20 primary records visible`);
      if (state.assertion === 'register-filtered' && metrics.activeChips < 1) failures.push(`${device.id}/${state.id}: active filter chip missing`);
      if (state.assertion === 'register-no-results' && !metrics.noResultsVisible) failures.push(`${device.id}/${state.id}: no-result state missing`);
      if (state.assertion === 'register-compare' && !metrics.comparisonVisible) failures.push(`${device.id}/${state.id}: comparison state missing`);

      const fileName = `${device.id}-${state.id}.png`;
      await page.screenshot({ path: path.join(outputRoot, fileName), fullPage: true, animations: 'disabled' });
      records.push({ device: device.id, state: state.id, route: state.route, viewport: device.viewport, file: fileName, metrics });
    }
    await context.close();
  }
} finally {
  await browser.close();
}

const expectedCount = devices.length * stateDefinitions.length;
if (records.length !== expectedCount) failures.push(`expected ${expectedCount} captures, found ${records.length}`);
const manifest = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  implementation_pr: 413,
  owner_approval: false,
  expected_capture_count: expectedCount,
  capture_count: records.length,
  failure_count: failures.length,
  records,
  failures
};
fs.writeFileSync(path.join(outputRoot, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
if (failures.length) {
  console.error(JSON.stringify(manifest, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, captures: records.length, owner_approval: false, output: 'artifacts/pr413-home-register' }, null, 2));
