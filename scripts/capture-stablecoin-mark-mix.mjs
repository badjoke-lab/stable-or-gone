#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const baseUrl = String(process.env.CAPTURE_BASE_URL ?? 'http://127.0.0.1:4173').replace(/\/$/, '');
const route = '/stablecoins/?q=usd';
const devices = {
  desktop: { viewport: { width: 1440, height: 900 }, output: 'artifacts/screenshots/desktop/stablecoins__mixed-marks.png' },
  mobile: { viewport: { width: 393, height: 852 }, output: 'artifacts/screenshots/mobile/stablecoins__mixed-marks.png', isMobile: true, hasTouch: true }
};

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
  const page = await context.newPage();
  const url = `${baseUrl}${route}`;
  const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  if (!response?.ok()) throw new Error(`${device}: HTTP ${response?.status() ?? 'no response'}`);
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForFunction(() => {
    const input = document.querySelector('[data-index-search]');
    return input instanceof HTMLInputElement && input.value.toLowerCase() === 'usd';
  });

  const metrics = await page.evaluate(() => {
    const visible = (element) => {
      if (!(element instanceof HTMLElement || element instanceof SVGElement)) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    };
    const marks = [...document.querySelectorAll('.stablecoin-mark')].filter(visible);
    const markMetrics = marks.map((mark) => {
      const rect = mark.getBoundingClientRect();
      return {
        kind: mark.getAttribute('data-mark-kind'),
        width: Number(rect.width.toFixed(2)),
        height: Number(rect.height.toFixed(2)),
        record: mark.closest('[data-record-slug]')?.getAttribute('data-record-slug') ?? null
      };
    });
    const widths = markMetrics.map((mark) => mark.width);
    const heights = markMetrics.map((mark) => mark.height);
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
      brokenImages: [...document.images]
        .filter((image) => image.complete && image.naturalWidth === 0)
        .map((image) => image.getAttribute('src') ?? 'missing-src'),
      marks: markMetrics
    };
  });

  const output = path.join(root, config.output);
  await mkdir(path.dirname(output), { recursive: true });
  await page.screenshot({ path: output, fullPage: true });

  const deviceFailures = [];
  if (metrics.query?.toLowerCase() !== 'usd') deviceFailures.push('query state was not applied');
  if (metrics.visibleMarks < 2) deviceFailures.push('fewer than two visible marks');
  if (metrics.logos < 1) deviceFailures.push('no real logo is visible');
  if (metrics.fallbacks < 1) deviceFailures.push('no fallback monogram is visible');
  if (!metrics.square) deviceFailures.push('one or more marks are not square');
  if (!metrics.uniform) deviceFailures.push('logo and fallback dimensions differ');
  if (metrics.brokenImages.length) deviceFailures.push(`broken images: ${metrics.brokenImages.join(', ')}`);

  records.push({ device, url, output: config.output, metrics, failures: deviceFailures });
  if (deviceFailures.length) failures.push({ device, failures: deviceFailures });
  await context.close();
}

await browser.close();
const report = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  route,
  records,
  failures
};
await writeFile(path.join(root, 'artifacts/screenshots/stablecoin-mark-mix-audit.json'), `${JSON.stringify(report, null, 2)}\n`);

if (failures.length) {
  console.error(JSON.stringify(report, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(report, null, 2));
