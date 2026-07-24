#!/usr/bin/env node
import fs from 'node:fs';
import { chromium } from 'playwright';

const deviceName = process.argv.includes('--mobile') ? 'mobile' : 'desktop';
const manifestPath = `artifacts/screenshots/manifest.${deviceName}.json`;
const outputPath = `artifacts/screenshots/color-audit.${deviceName}.json`;
const baseUrl = (process.env.CAPTURE_BASE_URL ?? process.env.SOG_SCREENSHOT_BASE_URL ?? 'http://127.0.0.1:4173').replace(/\/$/, '');
const viewport = deviceName === 'mobile' ? { width: 393, height: 852 } : { width: 1440, height: 900 };

if (!fs.existsSync(manifestPath)) throw new Error(`Missing ${manifestPath}`);
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const routes = manifest.records.map((record) => record.path);
const browser = await chromium.launch();
const context = await browser.newContext({ viewport, reducedMotion: 'reduce', isMobile: deviceName === 'mobile', hasTouch: deviceName === 'mobile' });
const page = await context.newPage();
const records = [];
const failures = [];

for (const route of routes) {
  try {
    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle', timeout: 60000 });
    if (!response?.ok()) throw new Error(`HTTP ${response?.status() ?? 'no response'}`);
    await page.evaluate(() => document.fonts?.ready);
    const result = await page.evaluate(() => {
      const visible = (element) => {
        if (!(element instanceof HTMLElement)) return false;
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
      };
      const pathFor = (element) => {
        const parts = [];
        let current = element;
        while (current instanceof HTMLElement && parts.length < 4) {
          let part = current.tagName.toLowerCase();
          if (current.id) part += `#${current.id}`;
          else if (current.classList.length) part += `.${[...current.classList].slice(0, 3).join('.')}`;
          parts.unshift(part);
          current = current.parentElement;
        }
        return parts.join(' > ');
      };
      const parseRgb = (value) => {
        const match = String(value).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
        return match ? match.slice(1, 4).map(Number) : null;
      };
      const saturation = ([r, g, b]) => {
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        return max === 0 ? 0 : (max - min) / max;
      };
      const rootStyle = getComputedStyle(document.documentElement);
      const tokens = Object.fromEntries([
        '--v3-text', '--v3-text-muted', '--v3-text-quiet', '--v3-accent', '--v3-archive',
        '--v3-positive', '--v3-warning', '--v3-danger', '--v3-violet'
      ].map((name) => [name, rootStyle.getPropertyValue(name).trim()]));
      const explicitSemantic = '[class*="status"], [class*="badge"], [class*="chip"], [class*="legend"], [class*="chart"], [class*="bar"], [class*="warning"], [class*="danger"], [class*="alert"], [class*="archive"], [data-status], [data-tone], [aria-current="page"], [aria-selected="true"]';
      const textElements = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,dt,dd,th,td,a,button,label,summary,small,strong,span,time')].filter(visible);
      const inventory = new Map();
      const violations = [];
      for (const element of textElements) {
        const text = (element.textContent ?? '').trim().replace(/\s+/g, ' ');
        if (!text) continue;
        const color = getComputedStyle(element).color;
        const rgb = parseRgb(color);
        if (!rgb) continue;
        const entry = inventory.get(color) ?? { color, count: 0, samples: [] };
        entry.count += 1;
        if (entry.samples.length < 4) entry.samples.push({ element: pathFor(element), text: text.slice(0, 100) });
        inventory.set(color, entry);
        const isInteractive = element.matches('a,button') || Boolean(element.closest('a,button'));
        const isSemantic = Boolean(element.closest(explicitSemantic));
        const sat = saturation(rgb);
        const brightness = Math.max(...rgb);
        const coloredOrdinaryText = sat >= 0.22 && brightness >= 95 && !isInteractive && !isSemantic;
        if (coloredOrdinaryText && violations.length < 200) {
          violations.push({ element: pathFor(element), text: text.slice(0, 140), color, saturation: Number(sat.toFixed(3)) });
        }
      }
      return {
        tokens,
        text_color_inventory: [...inventory.values()].sort((a, b) => b.count - a.count),
        colored_ordinary_text: violations,
        colored_ordinary_text_count: violations.length
      };
    });
    records.push({ route, ...result });
    console.log(`[color:${deviceName}] audited ${route}`);
  } catch (error) {
    failures.push({ route, error: error.message });
  }
}

await browser.close();
const routesWithViolations = records.filter((record) => record.colored_ordinary_text_count > 0);
const output = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  device: deviceName,
  route_count: routes.length,
  audited_count: records.length,
  failed_count: failures.length,
  routes_with_colored_ordinary_text: routesWithViolations.length,
  colored_ordinary_text_count: records.reduce((sum, record) => sum + record.colored_ordinary_text_count, 0),
  records,
  failures
};
fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify({ device: deviceName, routes: routes.length, audited: records.length, failed: failures.length, routes_with_colored_ordinary_text: output.routes_with_colored_ordinary_text, colored_ordinary_text_count: output.colored_ordinary_text_count }, null, 2));
if (failures.length) process.exit(1);
