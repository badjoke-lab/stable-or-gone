import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const base = process.env.SOG_AUDIT_BASE_URL || 'http://127.0.0.1:4173';
const outputRoot = process.env.SOG_AUDIT_OUTPUT || 'artifacts/v3-final';
const screenshotRoot = `${outputRoot}/screenshots`;

await mkdir(screenshotRoot, { recursive: true });

const checks = [];
const failures = [];
const routeMetrics = [];
const browserErrors = [];

const record = (name, passed, details = '') => {
  const item = { name, passed: Boolean(passed), details: String(details || '') };
  checks.push(item);
  if (!item.passed) failures.push(item);
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const numberText = (value) => Number(String(value ?? '').replace(/[^0-9]/g, ''));
const errorText = (error) => error instanceof Error ? `${error.name}: ${error.message}` : String(error);

const browser = await chromium.launch();
const desktop = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  reducedMotion: 'reduce'
});
const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  isMobile: true,
  hasTouch: true,
  reducedMotion: 'reduce'
});

const attachDiagnostics = (page, scope) => {
  page.setDefaultTimeout(7000);
  page.on('pageerror', (error) => browserErrors.push({ scope, type: 'pageerror', message: error.message }));
  page.on('console', (message) => {
    if (message.type() === 'error') browserErrors.push({ scope, type: 'console', message: message.text() });
  });
};

const waitForDynamic = async (page, route) => {
  if (route === '/timeline/') {
    await page.waitForFunction(() => {
      const results = document.querySelector('[data-timeline-results]');
      const empty = document.querySelector('[data-timeline-empty]');
      return Boolean((results && !results.hasAttribute('hidden')) || (empty && !empty.hasAttribute('hidden')));
    }, null, { timeout: 7000 }).catch(() => {});
  }
  if (route === '/access-regulation/') {
    await page.waitForFunction(() => {
      const results = document.querySelector('[data-ar-results]');
      const empty = document.querySelector('[data-ar-empty]');
      return Boolean((results && !results.hasAttribute('hidden')) || (empty && !empty.hasAttribute('hidden')));
    }, null, { timeout: 7000 }).catch(() => {});
  }
  await sleep(200);
};

const routes = [
  ['home', '/'],
  ['stablecoins', '/stablecoins/'],
  ['stablecoin-usdc', '/stablecoin/usdc/'],
  ['events', '/events/'],
  ['event-detail', '/event/sog_ev_usk_limited_status_batch_g/'],
  ['organizations', '/issuers/'],
  ['organization-detail', '/issuer/aave/'],
  ['guides', '/guides/'],
  ['guide-article', '/guides/eu-stablecoin-access-after-mica/'],
  ['compare', '/compare/'],
  ['stats', '/stats/'],
  ['timeline', '/timeline/'],
  ['access-regulation', '/access-regulation/'],
  ['methodology', '/methodology/'],
  ['glossary', '/glossary/'],
  ['contact', '/contact/']
];

const captureRoute = async (context, device, name, route) => {
  const page = await context.newPage();
  attachDiagnostics(page, `capture:${device}:${route}`);
  try {
    const response = await page.goto(`${base}${route}`, { waitUntil: 'networkidle', timeout: 60000 });
    record(`${device} ${route} HTTP`, Boolean(response?.ok()), `status=${response?.status()}`);
    await waitForDynamic(page, route);
    await page.evaluate(() => document.fonts?.ready);
    const metrics = await page.evaluate(({ route, device }) => {
      const surfaceSelectors = [
        '.stablecoin-register-header',
        '.stablecoin-index-registry',
        '.event-index-masthead',
        '.organization-index-masthead',
        '.guide-index-masthead',
        '.editorial-page-masthead',
        '.timeline-boundary-grid p',
        '.ar-boundary-grid p',
        '.stats-section',
        '.event-detail-section',
        '.organization-detail-section'
      ];
      const surfaces = surfaceSelectors.flatMap((selector) => [...document.querySelectorAll(selector)]);
      const radii = surfaces.map((node) => parseFloat(getComputedStyle(node).borderRadius) || 0);
      return {
        device,
        route,
        bodyHeight: Math.round(document.body.getBoundingClientRect().height),
        viewportWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
        background: getComputedStyle(document.body).backgroundColor,
        h1: document.querySelector('h1')?.textContent?.trim() ?? '',
        headerHeight: Math.round(document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0),
        footerHeight: Math.round(document.querySelector('.site-footer')?.getBoundingClientRect().height ?? 0),
        maxSurfaceRadius: radii.length ? Math.max(...radii) : 0,
        timelineItems: document.querySelectorAll('.timeline-item').length,
        accessCards: document.querySelectorAll('.ar-result-card').length,
        accessEmpty: Boolean(document.querySelector('[data-ar-empty]:not([hidden])'))
      };
    }, { route, device });
    routeMetrics.push(metrics);
    record(`${device} ${route} no horizontal overflow`, !metrics.horizontalOverflow, JSON.stringify(metrics));
    record(`${device} ${route} dark background`, metrics.background === 'rgb(5, 6, 7)', metrics.background);
    record(`${device} ${route} has H1`, Boolean(metrics.h1), metrics.h1);
    record(`${device} ${route} flat major surfaces`, metrics.maxSurfaceRadius <= 1, `maxRadius=${metrics.maxSurfaceRadius}`);
    record(`${device} ${route} header bounded`, device === 'mobile' ? metrics.headerHeight <= 100 : metrics.headerHeight <= 150, `height=${metrics.headerHeight}`);
    await page.screenshot({
      path: `${screenshotRoot}/${device}-${name}.jpg`,
      type: 'jpeg',
      quality: 72,
      fullPage: true
    });
  } catch (error) {
    record(`${device} ${route} capture completed`, false, errorText(error));
  } finally {
    await page.close().catch(() => {});
  }
};

for (const [device, context] of [['desktop', desktop], ['mobile', mobile]]) {
  for (const [name, route] of routes) await captureRoute(context, device, name, route);
}

const runCase = async (name, context, callback) => {
  const page = await context.newPage();
  attachDiagnostics(page, `functional:${name}`);
  try {
    await callback(page);
    record(`${name} case completed`, true);
  } catch (error) {
    record(`${name} case completed`, false, errorText(error));
  } finally {
    await page.close().catch(() => {});
  }
};

await runCase('stablecoin register', desktop, async (page) => {
  await page.goto(`${base}/stablecoins/`, { waitUntil: 'networkidle' });
  const initial = numberText(await page.locator('[data-result-count]').textContent());
  record('stablecoin initial record count', initial > 20, `count=${initial}`);

  await page.locator('[data-index-search]').fill('USDC');
  await sleep(250);
  const searched = numberText(await page.locator('[data-result-count]').textContent());
  record('stablecoin search narrows results', searched > 0 && searched < initial, `initial=${initial}, searched=${searched}`);

  await page.locator('.stablecoin-index-toolbar [data-clear-all]').click();
  await page.locator('[data-index-sort]').selectOption('name_desc');
  record('stablecoin sorting changes state', await page.locator('[data-index-sort]').inputValue() === 'name_desc');

  const filterApplied = await page.evaluate(() => {
    const input = document.querySelector('[data-filter-group]');
    if (!(input instanceof HTMLInputElement)) return false;
    const details = input.closest('details');
    if (details instanceof HTMLDetailsElement) details.open = true;
    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  });
  await sleep(250);
  const filtered = numberText(await page.locator('[data-result-count]').textContent());
  const activeFilterText = (await page.locator('[data-active-filters]').textContent())?.trim() ?? '';
  record('stablecoin filter applies', filterApplied && filtered > 0 && filtered <= initial && activeFilterText.length > 0, `filtered=${filtered}, active=${activeFilterText}`);

  await page.locator('.stablecoin-index-toolbar [data-clear-all]').click();
  const pageStatusBefore = (await page.locator('[data-page-status]').textContent())?.trim() ?? '';
  await page.locator('[data-page-next]').click({ force: true });
  await sleep(200);
  const pageStatusAfter = (await page.locator('[data-page-status]').textContent())?.trim() ?? '';
  record('stablecoin pagination advances', pageStatusAfter !== pageStatusBefore && /Page 2 of/.test(pageStatusAfter), `${pageStatusBefore} -> ${pageStatusAfter}`);
  await page.locator('[data-page-prev]').click({ force: true });

  const selectedCount = await page.evaluate(() => {
    const inputs = [...document.querySelectorAll('tr[data-registry-row]:not([hidden]) [data-compare-select]')].slice(0, 2);
    for (const input of inputs) {
      if (!(input instanceof HTMLInputElement)) continue;
      input.checked = true;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
    return inputs.length;
  });
  await sleep(300);
  const panelVisible = await page.locator('[data-comparison-panel]').isVisible();
  const comparisonItems = await page.locator('[data-comparison-grid] > *').count();
  record('stablecoin bounded comparison renders', selectedCount === 2 && panelVisible && comparisonItems >= 2, `selected=${selectedCount}, visible=${panelVisible}, items=${comparisonItems}`);
});

await runCase('event register', desktop, async (page) => {
  await page.goto(`${base}/events/`, { waitUntil: 'networkidle' });
  const initial = numberText(await page.locator('[data-event-result-count]').textContent());
  const firstTitle = (await page.locator('[data-event-body] tr:not([hidden]) a').first().textContent())?.trim() ?? '';
  const query = firstTitle.split(/\s+/).find((part) => part.length >= 5) ?? firstTitle;
  await page.locator('[data-event-search]').fill(query);
  await sleep(250);
  const searched = numberText(await page.locator('[data-event-result-count]').textContent());
  record('event search returns matching records', initial > 0 && searched > 0 && searched <= initial, `initial=${initial}, searched=${searched}, query=${query}`);
  await page.locator('.event-index-toolbar [data-event-clear-all]').click();
  await page.locator('[data-event-sort]').selectOption('date_asc');
  record('event sorting changes state', await page.locator('[data-event-sort]').inputValue() === 'date_asc');
  const applied = await page.evaluate(() => {
    const input = document.querySelector('[data-event-filter-group]');
    if (!(input instanceof HTMLInputElement)) return false;
    const details = input.closest('details');
    if (details instanceof HTMLDetailsElement) details.open = true;
    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  });
  await sleep(250);
  record('event filter applies', applied && ((await page.locator('[data-event-active-filters]').textContent())?.trim() ?? '').length > 0);
});

await runCase('organization register', desktop, async (page) => {
  await page.goto(`${base}/issuers/`, { waitUntil: 'networkidle' });
  const initial = numberText(await page.locator('[data-organization-result-count]').textContent());
  const firstName = (await page.locator('[data-organization-body] tr:not([hidden]) a').first().textContent())?.trim() ?? '';
  const query = firstName.split(/\s+/).find((part) => part.length >= 4) ?? firstName;
  await page.locator('[data-organization-search]').fill(query);
  await sleep(250);
  const searched = numberText(await page.locator('[data-organization-result-count]').textContent());
  record('organization search returns matching records', initial > 0 && searched > 0 && searched <= initial, `initial=${initial}, searched=${searched}, query=${query}`);
  await page.locator('.organization-index-toolbar [data-organization-clear-all]').click();
  await page.locator('[data-organization-sort]').selectOption('name_desc');
  record('organization sorting changes state', await page.locator('[data-organization-sort]').inputValue() === 'name_desc');
  const applied = await page.evaluate(() => {
    const input = document.querySelector('[data-organization-filter-group]');
    if (!(input instanceof HTMLInputElement)) return false;
    const details = input.closest('details');
    if (details instanceof HTMLDetailsElement) details.open = true;
    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  });
  await sleep(250);
  record('organization filter applies', applied && ((await page.locator('[data-organization-active-filters]').textContent())?.trim() ?? '').length > 0);
});

await runCase('compare page', desktop, async (page) => {
  await page.goto(`${base}/compare/`, { waitUntil: 'networkidle' });
  const slots = page.locator('[data-compare-slot]');
  record('compare page has selectable slots', await slots.count() >= 2, `slots=${await slots.count()}`);
  await slots.nth(0).selectOption({ index: 1 });
  await slots.nth(1).selectOption({ index: 2 });
  await page.waitForFunction(() => {
    const output = document.querySelector('.compare-output');
    return Boolean(output && !output.hasAttribute('hidden'));
  }, null, { timeout: 7000 });
  record('compare page renders selected output', await page.locator('.compare-output').isVisible());
});

await runCase('timeline', desktop, async (page) => {
  await page.goto(`${base}/timeline/`, { waitUntil: 'networkidle' });
  await waitForDynamic(page, '/timeline/');
  const initial = await page.locator('.timeline-item').count();
  record('timeline renders canonical items', initial > 0, `items=${initial}`);
  if (initial > 0) {
    const title = (await page.locator('.timeline-item h3').first().textContent())?.trim() ?? '';
    const query = title.split(/\s+/).find((part) => part.length >= 5) ?? title;
    await page.locator('[data-timeline-search]').fill(query);
    await sleep(350);
    const searched = await page.locator('.timeline-item').count();
    record('timeline search updates rendered items', searched > 0 && searched <= initial, `initial=${initial}, searched=${searched}, query=${query}`);
    await page.locator('[data-timeline-clear]').click();
    await sleep(200);
    if (await page.locator('[data-timeline-show-more-row]').isVisible()) {
      const before = await page.locator('.timeline-item').count();
      await page.locator('[data-timeline-show-more]').click();
      await sleep(250);
      const after = await page.locator('.timeline-item').count();
      record('timeline show-more expands results', after > before, `before=${before}, after=${after}`);
    }
  }
});

await runCase('access and regulation', desktop, async (page) => {
  await page.goto(`${base}/access-regulation/`, { waitUntil: 'networkidle' });
  await waitForDynamic(page, '/access-regulation/');
  const cards = await page.locator('.ar-result-card').count();
  const emptyVisible = await page.locator('[data-ar-empty]').isVisible().catch(() => false);
  const loadingVisible = await page.locator('[data-ar-loading]').isVisible().catch(() => false);
  record('access-regulation resolves loading state', cards > 0 || emptyVisible, `cards=${cards}, empty=${emptyVisible}, loading=${loadingVisible}`);
  if (cards > 0) {
    const initial = numberText(await page.locator('[data-ar-result-count]').textContent());
    const name = (await page.locator('.ar-result-card h2').first().textContent())?.trim() ?? '';
    await page.locator('[data-ar-search]').fill(name);
    await sleep(350);
    const searched = numberText(await page.locator('[data-ar-result-count]').textContent());
    record('access-regulation search updates records', searched > 0 && searched <= initial, `initial=${initial}, searched=${searched}`);
  }
});

await runCase('mobile navigation and details', mobile, async (page) => {
  await page.goto(`${base}/stablecoins/`, { waitUntil: 'networkidle' });
  const menu = page.locator('[data-mobile-navigation]');
  await menu.locator(':scope > summary').click();
  record('mobile navigation opens', await menu.evaluate((node) => node instanceof HTMLDetailsElement && node.open));
  const details = page.locator('.stablecoin-index-card:visible .stablecoin-index-card-details').first();
  record('mobile compact record exists', await details.count() === 1);
  await details.locator(':scope > summary').click();
  record('mobile record details open', await details.evaluate((node) => node instanceof HTMLDetailsElement && node.open));
});

for (const [path, kind] of [
  ['/version.json', 'json'],
  ['/data/manifest.json', 'json'],
  ['/data/change-timeline.json', 'json'],
  ['/data/access-regulation-index.json', 'json'],
  ['/llms.txt', 'text'],
  ['/ai.txt', 'text']
]) {
  try {
    const response = await fetch(`${base}${path}`);
    const body = await response.text();
    let valid = response.ok && body.trim().length > 20;
    if (kind === 'json') {
      try { JSON.parse(body); } catch { valid = false; }
    }
    record(`machine endpoint ${path}`, valid, `status=${response.status}, bytes=${body.length}`);
  } catch (error) {
    record(`machine endpoint ${path}`, false, errorText(error));
  }
}

await desktop.close().catch(() => {});
await mobile.close().catch(() => {});
await browser.close().catch(() => {});

const pageErrors = browserErrors.filter((item) => item.type === 'pageerror');
for (const item of pageErrors) record(`browser page error in ${item.scope}`, false, item.message);

const report = {
  generatedAt: new Date().toISOString(),
  checks,
  failures,
  browserErrors,
  routeMetrics,
  summary: {
    totalChecks: checks.length,
    passed: checks.filter((item) => item.passed).length,
    failed: failures.length,
    browserErrors: browserErrors.length,
    pageErrors: pageErrors.length
  }
};

await writeFile(`${outputRoot}/acceptance-report.json`, JSON.stringify(report, null, 2));
await writeFile(`${outputRoot}/acceptance-summary.md`, [
  '# SOG V3 Final Acceptance Audit',
  '',
  `- Total checks: ${report.summary.totalChecks}`,
  `- Passed: ${report.summary.passed}`,
  `- Failed: ${report.summary.failed}`,
  `- Browser errors: ${report.summary.browserErrors}`,
  `- Page errors: ${report.summary.pageErrors}`,
  '',
  '## Failures',
  ...(failures.length ? failures.map((item) => `- **${item.name}** — ${item.details || 'no details'}`) : ['- None']),
  '',
  '## Browser errors',
  ...(browserErrors.length ? browserErrors.slice(0, 40).map((item) => `- **${item.scope} / ${item.type}** — ${item.message}`) : ['- None'])
].join('\n'));

console.log(JSON.stringify(report.summary, null, 2));
if (failures.length) process.exitCode = 1;
