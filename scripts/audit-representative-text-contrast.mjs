#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const ROOT = process.cwd();
const BASE_URL = (process.env.CAPTURE_BASE_URL ?? 'http://127.0.0.1:4173').replace(/\/$/, '');
const OUTPUT = path.join(ROOT, 'artifacts/screenshots/representative-text-contrast-audit.json');

const DEVICES = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 393, height: 852 }
};

const THRESHOLDS = {
  body: 9,
  muted: 7,
  quiet: 5.5
};

const ROUTES = [
  {
    path: '/',
    roles: {
      body: ['.home-intro .lede', '.section-heading > p', '.directory-copy small', '.home-registry-table td'],
      muted: ['.archive-note', '.registry-count', '.home-registry-table th'],
      quiet: ['.home-registry-table td small']
    }
  },
  {
    path: '/stablecoin/usdt/',
    roles: {
      body: ['.stablecoin-assessment-copy p', '.stablecoin-material-change p', '.stablecoin-control-note', '.stablecoin-related-guides p'],
      muted: ['.stablecoin-dossier-overline', '.stablecoin-record-id', '.stablecoin-section-heading > span', '.stablecoin-dossier-nav a', '.stablecoin-dossier th'],
      quiet: []
    }
  },
  {
    path: '/guides/eu-stablecoin-access-after-mica/',
    roles: {
      body: ['.guide-article-deck', '.guide-article-content > .hero p', '.guide-article-content > section p', '.guide-article-content > section li'],
      muted: ['.guide-article-overline', '.guide-article-meta dt', '.guide-article-toc a', '.guide-article-content blockquote', '.guide-article-content th'],
      quiet: []
    }
  },
  {
    path: '/methodology/',
    roles: {
      body: ['.longform-content > section p', '.longform-content > section li'],
      muted: ['.editorial-page-overline', '.editorial-page-ledger dt', '.longform-toc a', '.longform-content th'],
      quiet: []
    }
  },
  {
    path: '/about/',
    roles: {
      body: ['.longform-content > section p', '.longform-content > section li'],
      muted: ['.editorial-page-overline', '.editorial-page-ledger dt', '.longform-toc a', '.longform-content th'],
      quiet: []
    }
  },
  {
    path: '/stats/',
    roles: {
      body: ['.stats-intro p', '.stats-analysis-note', '.stats-section-heading p'],
      muted: ['.stats-kpi dt', '.stats-section-heading a', '.stats-table th'],
      quiet: []
    }
  }
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

  const routeResults = [];
  const roleTotals = Object.fromEntries(Object.keys(THRESHOLDS).map((role) => [role, 0]));

  for (const route of ROUTES) {
    const page = await context.newPage();
    const response = await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'networkidle', timeout: 60000 });
    if (!response || !response.ok()) {
      failures.push(`${device}: ${route.path} returned ${response?.status() ?? 'no response'}`);
      await page.close();
      continue;
    }

    const result = await page.evaluate(({ roles, thresholds }) => {
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

      const effectiveBackground = (start) => {
        const layers = [];
        let current = start;
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

      const samples = [];
      for (const [role, selectors] of Object.entries(roles)) {
        for (const selector of selectors) {
          for (const element of document.querySelectorAll(selector)) {
            if (!visible(element)) continue;
            const foreground = parseColor(getComputedStyle(element).color);
            if (!foreground) continue;
            const background = effectiveBackground(element);
            samples.push({
              role,
              selector,
              text: (element.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 120),
              ratio: Number(contrast(foreground, background).toFixed(2)),
              foreground: formatColor(foreground),
              background: formatColor(background),
              threshold: thresholds[role]
            });
          }
        }
      }

      return {
        samples,
        violations: samples.filter((sample) => sample.ratio < sample.threshold)
      };
    }, { roles: route.roles, thresholds: THRESHOLDS });

    for (const sample of result.samples) roleTotals[sample.role] += 1;
    for (const violation of result.violations) {
      failures.push(`${device}: ${route.path} ${violation.role} contrast ${violation.ratio}:1 < ${violation.threshold}:1 for ${violation.selector} (${violation.text})`);
    }

    routeResults.push({ path: route.path, ...result });
    await page.close();
  }

  for (const [role, count] of Object.entries(roleTotals)) {
    if (count === 0) failures.push(`${device}: no ${role} text contrast samples were collected across representative routes`);
  }

  deviceResults.push({ device, viewport, role_sample_counts: roleTotals, routes: routeResults });
  await context.close();
}

await browser.close();

const output = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  thresholds: THRESHOLDS,
  routes: ROUTES.map((route) => route.path),
  ok: failures.length === 0,
  devices: deviceResults,
  failures
};

await mkdir(path.dirname(OUTPUT), { recursive: true });
await writeFile(OUTPUT, `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify(output, null, 2));
if (failures.length) process.exit(1);
