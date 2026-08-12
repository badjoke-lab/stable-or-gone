#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const baseUrl = String(process.env.CAPTURE_BASE_URL ?? 'http://127.0.0.1:4173').replace(/\/$/, '');
const devices = {
  desktop: { viewport: { width: 1440, height: 900 } },
  mobile: { viewport: { width: 393, height: 852 }, isMobile: true, hasTouch: true }
};
const scenarios = [
  {
    id: 'mixed-marks',
    query: 'usd',
    expected: { minimumVisibleMarks: 2, minimumLogos: 1, minimumFallbacks: 1 }
  },
  {
    id: 'phase-e-mnee',
    query: 'mnee',
    expected: { record: 'mnee', kind: 'logo' }
  },
  {
    id: 'phase-e-usdgo',
    query: 'usdgo',
    expected: { record: 'usdgo', kind: 'logo' }
  },
  {
    id: 'phase-e-usr',
    query: 'usr',
    expected: { record: 'usr', kind: 'logo' }
  },
  {
    id: 'phase-e-fallback',
    query: 'acala',
    expected: { record: 'acala-ausd', kind: 'fallback' }
  }
];

const visible = `element => {
  if (!(element instanceof HTMLElement || element instanceof SVGElement)) return false;
  const style = getComputedStyle(element);
  const rect = element.getBoundingClientRect();
  return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
}`;

const browser = await chromium.launch({ args: ['--disable-lcd-text'] });
const records = [];
const failures = [];

for (const [device, config] of Object.entries(devices)) {
  const context = await browser.newContext({
    viewport: config.viewport,
    deviceScaleFactor: 1,
    isMobile: config.isMobile ?? false,
    hasTouch: config.hasTouch ?? false,
    reducedMotion: 'reduce'
  });

  for (const scenario of scenarios) {
    const page = await context.newPage();
    const route = `/stablecoins/?q=${encodeURIComponent(scenario.query)}`;
    const url = `${baseUrl}${route}`;
    const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    if (!response?.ok()) throw new Error(`${device}/${scenario.id}: HTTP ${response?.status() ?? 'no response'}`);
    await page.evaluate(() => document.fonts?.ready);
    await page.waitForFunction((query) => {
      const input = document.querySelector('[data-index-search]');
      return input instanceof HTMLInputElement && input.value.toLowerCase() === query.toLowerCase();
    }, scenario.query);

    const metrics = await page.evaluate((visibleSource) => {
      const isVisible = (0, eval)(`(${visibleSource})`);
      const marks = [...document.querySelectorAll('.stablecoin-mark')].filter(isVisible);
      const markMetrics = marks.map((mark) => {
        const rect = mark.getBoundingClientRect();
        return {
          kind: mark.getAttribute('data-mark-kind'),
          width: Number(rect.width.toFixed(2)),
          height: Number(rect.height.toFixed(2)),
          record: mark.closest('[data-record-slug]')?.getAttribute('data-record-slug') ?? null,
          left: Number(rect.left.toFixed(2)),
          right: Number(rect.right.toFixed(2)),
          top: Number(rect.top.toFixed(2)),
          bottom: Number(rect.bottom.toFixed(2))
        };
      });
      const widths = markMetrics.map((mark) => mark.width);
      const heights = markMetrics.map((mark) => mark.height);
      const doc = document.documentElement;
      return {
        query: document.querySelector('[data-index-search]') instanceof HTMLInputElement
          ? document.querySelector('[data-index-search]').value
          : null,
        visibleMarks: markMetrics.length,
        logos: markMetrics.filter((mark) => mark.kind === 'logo').length,
        fallbacks: markMetrics.filter((mark) => mark.kind === 'fallback').length,
        minimumWidth: widths.length ? Math.min(...widths) : null,
        maximumWidth: widths.length ? Math.max(...widths) : null,
        minimumHeight: heights.length ? Math.min(...heights) : null,
        maximumHeight: heights.length ? Math.max(...heights) : null,
        square: markMetrics.every((mark) => Math.abs(mark.width - mark.height) <= 0.5),
        uniform: widths.length > 0
          && Math.max(...widths) - Math.min(...widths) <= 0.5
          && Math.max(...heights) - Math.min(...heights) <= 0.5,
        pageHorizontalOverflow: doc.scrollWidth > doc.clientWidth + 1,
        brokenImages: [...document.images]
          .filter((image) => image.complete && image.naturalWidth === 0)
          .map((image) => image.getAttribute('src') ?? 'missing-src'),
        marks: markMetrics
      };
    }, visible);

    const output = path.join(root, `artifacts/screenshots/${device}/stablecoins__${scenario.id}.png`);
    await mkdir(path.dirname(output), { recursive: true });
    await page.screenshot({ path: output, fullPage: true });

    const scenarioFailures = [];
    if (metrics.query?.toLowerCase() !== scenario.query.toLowerCase()) scenarioFailures.push('query state was not applied');
    if (metrics.brokenImages.length) scenarioFailures.push(`broken images: ${metrics.brokenImages.join(', ')}`);
    if (metrics.visibleMarks < (scenario.expected.minimumVisibleMarks ?? 1)) scenarioFailures.push('too few visible marks');
    if (metrics.logos < (scenario.expected.minimumLogos ?? 0)) scenarioFailures.push('required direct Stablecoin/product logo is not visible');
    if (metrics.fallbacks < (scenario.expected.minimumFallbacks ?? 0)) scenarioFailures.push('required neutral fallback is not visible');
    if (metrics.logos + metrics.fallbacks !== metrics.visibleMarks) scenarioFailures.push('visible mark kinds do not account for every record');
    if (!metrics.square) scenarioFailures.push('one or more marks are not square');
    if (!metrics.uniform) scenarioFailures.push('visible mark dimensions differ');
    if (metrics.pageHorizontalOverflow) scenarioFailures.push('page-level horizontal overflow detected');

    if (scenario.expected.record) {
      const target = metrics.marks.find((mark) => mark.record === scenario.expected.record);
      if (!target) scenarioFailures.push(`expected record is not visible: ${scenario.expected.record}`);
      else if (target.kind !== scenario.expected.kind) scenarioFailures.push(`expected ${scenario.expected.kind} for ${scenario.expected.record}, found ${target.kind}`);
    }

    const record = { device, scenario: scenario.id, route, url, output: path.relative(root, output), expected: scenario.expected, metrics, failures: scenarioFailures };
    records.push(record);
    if (scenarioFailures.length) failures.push({ device, scenario: scenario.id, failures: scenarioFailures });
    await page.close();
  }

  await context.close();
}

await browser.close();
const report = {
  schema_version: '4.0',
  generated_at: new Date().toISOString(),
  expected_mark_policy: 'direct Stablecoin/product logos plus neutral fallbacks for issuer/project/directory-only records',
  phase_e_targets: ['mnee', 'usdgo', 'usr', 'acala-ausd'],
  records,
  failures
};
await writeFile(path.join(root, 'artifacts/screenshots/stablecoin-mark-mix-audit.json'), `${JSON.stringify(report, null, 2)}\n`);

if (failures.length) {
  console.error(JSON.stringify(report, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(report, null, 2));
