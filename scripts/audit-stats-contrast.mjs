#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const ROOT = process.cwd();
const BASE_URL = (process.env.CAPTURE_BASE_URL ?? 'http://127.0.0.1:4173').replace(/\/$/, '');
const OUTPUT = path.join(ROOT, 'artifacts/screenshots/stats-contrast-audit.json');
const DEVICES = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 393, height: 852 }
};

const TEXT_SELECTORS = [
  '.stats-kpi dd',
  '.stats-bar-row__label',
  '.stats-compact-bar > div:first-child',
  '.stats-year-row',
  '.stats-chain-row',
  '.stats-metric-list dd',
  '.stats-checkpoint-single strong'
];

const GRAPHIC_PAIRS = [
  { name: 'distribution bars', fill: '.stats-bar-track span', track: '.stats-bar-track' },
  { name: 'year and chain bars', fill: '.stats-year-track span', track: '.stats-year-track' }
];

const browser = await chromium.launch();
const deviceResults = [];
const failures = [];

for (const [device, viewport] of Object.entries(DEVICES)) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    isMobile: device === 'mobile',
    hasTouch: device === 'mobile',
    reducedMotion: 'reduce'
  });
  const page = await context.newPage();
  const response = await page.goto(`${BASE_URL}/stats/`, { waitUntil: 'networkidle', timeout: 60000 });
  if (!response || !response.ok()) throw new Error(`${device}: /stats/ returned ${response?.status() ?? 'no response'}`);

  const result = await page.evaluate(({ textSelectors, graphicPairs }) => {
    const visible = (element) => {
      if (!(element instanceof HTMLElement)) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0 && rect.width > 0 && rect.height > 0;
    };

    const parseColor = (value) => {
      const match = value.match(/rgba?\(([^)]+)\)/i);
      if (!match) return null;
      const parts = match[1].split(/[\s,\/]+/).filter(Boolean).map(Number);
      if (parts.length < 3 || parts.slice(0, 3).some((part) => !Number.isFinite(part))) return null;
      return { r: parts[0], g: parts[1], b: parts[2], a: Number.isFinite(parts[3]) ? parts[3] : 1 };
    };

    const over = (front, back) => {
      const a = front.a + back.a * (1 - front.a);
      if (a <= 0) return { r: 0, g: 0, b: 0, a: 0 };
      return {
        r: (front.r * front.a + back.r * back.a * (1 - front.a)) / a,
        g: (front.g * front.a + back.g * back.a * (1 - front.a)) / a,
        b: (front.b * front.a + back.b * back.a * (1 - front.a)) / a,
        a
      };
    };

    const effectiveBackground = (element) => {
      const layers = [];
      let current = element;
      while (current instanceof HTMLElement) {
        const color = parseColor(getComputedStyle(current).backgroundColor);
        if (color && color.a > 0) layers.push(color);
        if (color && color.a >= 0.999) break;
        current = current.parentElement;
      }
      let result = layers.length ? layers[layers.length - 1] : { r: 6, g: 16, b: 24, a: 1 };
      for (let index = layers.length - 2; index >= 0; index -= 1) result = over(layers[index], result);
      return result;
    };

    const channel = (value) => {
      const normalized = value / 255;
      return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
    };

    const luminance = (color) => 0.2126 * channel(color.r) + 0.7152 * channel(color.g) + 0.0722 * channel(color.b);
    const contrast = (left, right) => {
      const a = luminance(left);
      const b = luminance(right);
      return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    };
    const formatColor = (color) => `rgb(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)})`;

    const textSamples = [];
    for (const selector of textSelectors) {
      for (const element of document.querySelectorAll(selector)) {
        if (!visible(element)) continue;
        const foreground = parseColor(getComputedStyle(element).color);
        if (!foreground) continue;
        const background = effectiveBackground(element);
        textSamples.push({
          selector,
          text: (element.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 100),
          ratio: Number(contrast(foreground, background).toFixed(2)),
          foreground: formatColor(foreground),
          background: formatColor(background)
        });
      }
    }

    const graphicSamples = [];
    for (const pair of graphicPairs) {
      const fills = [...document.querySelectorAll(pair.fill)].filter(visible);
      for (const fill of fills) {
        const track = fill.closest(pair.track) ?? fill.parentElement;
        if (!(track instanceof HTMLElement)) continue;
        const fillColor = effectiveBackground(fill);
        const trackColor = effectiveBackground(track);
        graphicSamples.push({
          name: pair.name,
          ratio: Number(contrast(fillColor, trackColor).toFixed(2)),
          fill: formatColor(fillColor),
          track: formatColor(trackColor)
        });
      }
    }

    return {
      text_samples: textSamples,
      text_violations: textSamples.filter((sample) => sample.ratio < 4.5),
      graphic_samples: graphicSamples,
      graphic_violations: graphicSamples.filter((sample) => sample.ratio < 3)
    };
  }, { textSelectors: TEXT_SELECTORS, graphicPairs: GRAPHIC_PAIRS });

  if (result.text_samples.length === 0) failures.push(`${device}: no Stats text contrast samples were collected`);
  if (result.graphic_samples.length === 0) failures.push(`${device}: no Stats graphic contrast samples were collected`);
  for (const violation of result.text_violations) failures.push(`${device}: text contrast ${violation.ratio}:1 for ${violation.selector} (${violation.text})`);
  for (const violation of result.graphic_violations) failures.push(`${device}: graphic contrast ${violation.ratio}:1 for ${violation.name}`);

  deviceResults.push({ device, viewport, ...result });
  await context.close();
}

await browser.close();
const output = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  route: '/stats/',
  thresholds: { text: 4.5, graphics: 3 },
  selectors: { text: TEXT_SELECTORS, graphics: GRAPHIC_PAIRS },
  ok: failures.length === 0,
  devices: deviceResults,
  failures
};
await mkdir(path.dirname(OUTPUT), { recursive: true });
await writeFile(OUTPUT, `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify(output, null, 2));
if (failures.length) process.exit(1);
