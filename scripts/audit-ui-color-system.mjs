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
const browser = await chromium.launch({ args: ['--disable-lcd-text'] });
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
      const parseColor = (value) => {
        const match = String(value).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?/i);
        if (!match) return null;
        return { rgb: match.slice(1, 4).map(Number), alpha: match[4] === undefined ? 1 : Number(match[4]) };
      };
      const saturation = ([r, g, b]) => {
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        return max === 0 ? 0 : (max - min) / max;
      };
      const toHex = ([r, g, b]) => `#${[r, g, b].map((part) => part.toString(16).padStart(2, '0')).join('')}`;
      const legacyPalette = new Map(Object.entries({
        '#061018': 'global-bg', '#091722': 'global-bg-soft', '#0b1722': 'global-panel', '#0f1f2d': 'global-panel-2', '#1f3a4d': 'global-line', '#e7f2f5': 'global-text', '#84a1ae': 'global-muted', '#66d19e': 'global-green', '#d7b85f': 'global-amber', '#dd6d6d': 'global-red', '#71d6ff': 'global-cyan', '#d6b46f': 'global-gold',
        '#071018': 'shell-bg', '#0a151f': 'shell-bg-subtle', '#0d1924': 'shell-surface', '#112332': 'shell-surface-raised', '#172c3b': 'shell-surface-emphasis', '#284555': 'shell-line', '#1b3443': 'shell-line-subtle', '#eaf3f6': 'shell-text', '#9ab0ba': 'shell-muted', '#75d5ff': 'shell-link', '#f4c96b': 'shell-focus', '#78d7a9': 'shell-positive', '#e9c96f': 'shell-warning', '#f08a8a': 'shell-critical', '#b7a9dd': 'shell-unknown', '#a7b3b9': 'shell-inactive'
      }));
      const rootStyle = getComputedStyle(document.documentElement);
      const tokens = Object.fromEntries([
        '--ui-bg', '--ui-bg-soft', '--ui-surface', '--ui-surface-strong',
        '--ui-text', '--ui-copy', '--ui-muted', '--ui-quiet',
        '--ui-line', '--ui-line-soft', '--ui-link', '--ui-hover', '--ui-visited', '--ui-focus',
        '--ui-positive', '--ui-warning', '--ui-danger', '--ui-neutral'
      ].map((name) => [name, rootStyle.getPropertyValue(name).trim()]));
      const interactiveSelector = 'a, button, summary, [role="button"], [role="link"]';
      const explicitSemantic = '[class*="status"], [class*="lifecycle"], [class*="badge"], [class*="chip"], [class*="legend"], [class*="chart"], [class*="bar"], [class*="warning"], [class*="danger"], [class*="alert"], [class*="archive"], [class*="reliability"], [class*="severity"], [data-status], [data-tone], [aria-current="page"], [aria-selected="true"]';
      const neutralBorderHexes = new Set([
        tokens['--ui-line'],
        tokens['--ui-line-soft']
      ].map((value) => value.toLowerCase()).filter(Boolean));
      const inventory = new Map();
      const legacyPaletteHits = [];
      const coloredOrdinaryText = [];
      const textShadows = [];
      const coloredBorders = [];
      const coloredBackgrounds = [];
      const noteLegacy = (element, property, value, parsed) => {
        if (!parsed || parsed.alpha <= 0.02) return;
        const hex = toHex(parsed.rgb);
        const token = legacyPalette.get(hex);
        if (token && legacyPaletteHits.length < 300) legacyPaletteHits.push({ element: pathFor(element), property, value, hex, legacy_token: token });
      };
      const textElements = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,dt,dd,th,td,a,button,label,summary,small,strong,span,time')].filter(visible);
      for (const element of textElements) {
        const text = (element.textContent ?? '').trim().replace(/\s+/g, ' ');
        if (!text) continue;
        const style = getComputedStyle(element);
        const parsed = parseColor(style.color);
        if (!parsed) continue;
        const entry = inventory.get(style.color) ?? { color: style.color, count: 0, samples: [] };
        entry.count += 1;
        if (entry.samples.length < 4) entry.samples.push({ element: pathFor(element), text: text.slice(0, 100) });
        inventory.set(style.color, entry);
        const isInteractive = element.matches(interactiveSelector) || Boolean(element.closest(interactiveSelector));
        const isSemantic = Boolean(element.closest(explicitSemantic));
        const sat = saturation(parsed.rgb);
        const brightness = Math.max(...parsed.rgb);
        noteLegacy(element, 'color', style.color, parsed);
        if (sat >= 0.22 && brightness >= 95 && !isInteractive && !isSemantic && coloredOrdinaryText.length < 300) {
          coloredOrdinaryText.push({ element: pathFor(element), text: text.slice(0, 140), color: style.color, saturation: Number(sat.toFixed(3)) });
        }
        if (style.textShadow !== 'none' && textShadows.length < 300) {
          textShadows.push({ element: pathFor(element), text: text.slice(0, 140), text_shadow: style.textShadow });
        }
      }
      const structureElements = [...document.querySelectorAll('main section, main article, main aside, main header, main footer, main nav, main table, main details, main [class*="panel"], main [class*="notice"], main [class*="callout"]')].filter(visible);
      for (const element of structureElements) {
        const style = getComputedStyle(element);
        const isInteractive = element.matches(interactiveSelector) || Boolean(element.closest(interactiveSelector));
        const isSemantic = Boolean(element.closest(explicitSemantic));
        const properties = ['borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor'];
        for (const property of properties) {
          const value = style[property];
          const parsed = parseColor(value);
          if (!parsed || parsed.alpha <= 0.02) continue;
          noteLegacy(element, property, value, parsed);
          const sat = saturation(parsed.rgb);
          const brightness = Math.max(...parsed.rgb);
          const isNeutralBorder = neutralBorderHexes.has(toHex(parsed.rgb));
          if (sat >= 0.22 && brightness >= 60 && !isNeutralBorder && !isInteractive && !isSemantic && coloredBorders.length < 300) {
            coloredBorders.push({ element: pathFor(element), property, color: value, saturation: Number(sat.toFixed(3)) });
          }
        }
        const background = parseColor(style.backgroundColor);
        if (background && background.alpha > 0.05) {
          noteLegacy(element, 'backgroundColor', style.backgroundColor, background);
          const sat = saturation(background.rgb);
          const brightness = Math.max(...background.rgb);
          if (sat >= 0.22 && brightness >= 28 && !isInteractive && !isSemantic && coloredBackgrounds.length < 300) {
            coloredBackgrounds.push({ element: pathFor(element), color: style.backgroundColor, saturation: Number(sat.toFixed(3)) });
          }
        }
      }
      return {
        tokens,
        rendering: {
          webkit_font_smoothing: rootStyle.getPropertyValue('-webkit-font-smoothing').trim(),
          text_rendering: rootStyle.textRendering,
          chromium_lcd_text_disabled: true
        },
        text_color_inventory: [...inventory.values()].sort((a, b) => b.count - a.count),
        legacy_palette_hits: legacyPaletteHits,
        legacy_palette_hit_count: legacyPaletteHits.length,
        colored_ordinary_text: coloredOrdinaryText,
        colored_ordinary_text_count: coloredOrdinaryText.length,
        text_shadows: textShadows,
        text_shadow_count: textShadows.length,
        nonsemantic_colored_borders: coloredBorders,
        nonsemantic_colored_border_count: coloredBorders.length,
        nonsemantic_colored_backgrounds: coloredBackgrounds,
        nonsemantic_colored_background_count: coloredBackgrounds.length
      };
    });
    records.push({ route, ...result });
    console.log(`[color:${deviceName}] audited ${route}`);
  } catch (error) {
    failures.push({ route, error: error.message });
  }
}

await browser.close();
const sum = (field) => records.reduce((total, record) => total + Number(record[field] ?? 0), 0);
const output = {
  schema_version: '2.1',
  generated_at: new Date().toISOString(),
  device: deviceName,
  text_rasterization: 'grayscale_antialiasing',
  chromium_args: ['--disable-lcd-text'],
  route_count: routes.length,
  audited_count: records.length,
  failed_count: failures.length,
  routes_with_colored_ordinary_text: records.filter((record) => record.colored_ordinary_text_count > 0).length,
  colored_ordinary_text_count: sum('colored_ordinary_text_count'),
  routes_with_legacy_palette_hits: records.filter((record) => record.legacy_palette_hit_count > 0).length,
  legacy_palette_hit_count: sum('legacy_palette_hit_count'),
  routes_with_text_shadows: records.filter((record) => record.text_shadow_count > 0).length,
  text_shadow_count: sum('text_shadow_count'),
  routes_with_nonsemantic_colored_borders: records.filter((record) => record.nonsemantic_colored_border_count > 0).length,
  nonsemantic_colored_border_count: sum('nonsemantic_colored_border_count'),
  routes_with_nonsemantic_colored_backgrounds: records.filter((record) => record.nonsemantic_colored_background_count > 0).length,
  nonsemantic_colored_background_count: sum('nonsemantic_colored_background_count'),
  records,
  failures
};
fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify({
  device: deviceName,
  routes: routes.length,
  audited: records.length,
  failed: failures.length,
  colored_ordinary_text_count: output.colored_ordinary_text_count,
  legacy_palette_hit_count: output.legacy_palette_hit_count,
  text_shadow_count: output.text_shadow_count,
  nonsemantic_colored_border_count: output.nonsemantic_colored_border_count,
  nonsemantic_colored_background_count: output.nonsemantic_colored_background_count,
  text_rasterization: output.text_rasterization
}, null, 2));
if (failures.length) process.exit(1);
