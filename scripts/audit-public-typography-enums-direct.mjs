#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const distRoot = path.resolve('dist');
const baseUrl = (process.env.PUBLIC_UI_AUDIT_BASE_URL ?? 'http://127.0.0.1:4173').replace(/\/$/, '');
const concurrency = Math.max(1, Number.parseInt(process.env.PUBLIC_UI_AUDIT_CONCURRENCY ?? '6', 10) || 6);
const samplesPerFamily = Math.max(1, Number.parseInt(process.env.PUBLIC_UI_AUDIT_SAMPLES_PER_FAMILY ?? '3', 10) || 3);
const outputPath = 'artifacts/public-typography-enum-runtime-audit.json';
const DETAIL_FAMILIES = [
  ['stablecoin-detail', '/stablecoin/'],
  ['issuer-detail', '/issuer/'],
  ['event-detail', '/event/'],
  ['guide-detail', '/guides/']
];

if (!fs.existsSync(distRoot)) throw new Error('dist/ is missing; build the site before running the public UI audit');

const htmlFiles = [];
const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target);
    else if (entry.name.endsWith('.html')) htmlFiles.push(target);
  }
};
walk(distRoot);

const routeForFile = (file) => {
  const relative = path.relative(distRoot, file).split(path.sep).join('/');
  if (relative === 'index.html') return '/';
  if (relative.endsWith('/index.html')) return `/${relative.slice(0, -'index.html'.length)}`;
  return `/${relative}`;
};
const fileForRoute = (route) => route === '/'
  ? path.join(distRoot, 'index.html')
  : path.join(distRoot, route.replace(/^\/+|\/+$/g, ''), 'index.html');
const discoveredRoutes = [...new Set(htmlFiles.map(routeForFile))].sort();

const familyForRoute = (route) => {
  for (const [name, prefix] of DETAIL_FAMILIES) {
    if (route !== prefix && route.startsWith(prefix)) return { name, prefix, forced: true };
  }
  const segments = route.split('/').filter(Boolean);
  return segments.length >= 2 ? { name: `nested-${segments[0]}`, prefix: `/${segments[0]}/`, forced: false } : null;
};
const quantileSample = (entries, count) => {
  if (entries.length <= count) return entries;
  const sorted = [...entries].sort((left, right) => left.size - right.size || left.route.localeCompare(right.route));
  const selected = [];
  for (let index = 0; index < count; index += 1) {
    selected.push(sorted[Math.round(index * (sorted.length - 1) / Math.max(1, count - 1))]);
  }
  return [...new Map(selected.map((entry) => [entry.route, entry])).values()];
};
const selectRepresentativeRoutes = (routes) => {
  const staticRoutes = [];
  const grouped = new Map();
  for (const route of routes) {
    const family = familyForRoute(route);
    if (!family) {
      staticRoutes.push(route);
      continue;
    }
    if (!grouped.has(family.name)) grouped.set(family.name, { family, routes: [] });
    grouped.get(family.name).routes.push(route);
  }
  const selected = [...staticRoutes];
  const families = [];
  for (const { family, routes: familyRoutes } of grouped.values()) {
    const entries = familyRoutes.map((route) => {
      let size = 0;
      try { size = fs.statSync(fileForRoute(route)).size; } catch {}
      return { route, size };
    });
    const shouldSample = family.forced || entries.length > 8;
    const chosen = shouldSample ? quantileSample(entries, samplesPerFamily) : entries;
    selected.push(...chosen.map((entry) => entry.route));
    families.push({ name: family.name, discovered: entries.length, selected: chosen.length, routes: chosen.map((entry) => entry.route) });
  }
  return { routes: [...new Set(selected)].sort(), families };
};
const selection = selectRepresentativeRoutes(discoveredRoutes);
const routes = selection.routes;
const devices = [
  { name: 'desktop', viewport: { width: 1440, height: 900 }, isMobile: false, hasTouch: false },
  { name: 'mobile', viewport: { width: 393, height: 852 }, isMobile: true, hasTouch: true }
];

const browser = await chromium.launch({ args: ['--disable-lcd-text'] });
const records = [];
const navigationFailures = [];
let hoverTail = Promise.resolve();
const withHoverLock = async (callback) => {
  const previous = hoverTail;
  let release;
  hoverTail = new Promise((resolve) => { release = resolve; });
  await previous;
  try { return await callback(); } finally { release(); }
};

for (const device of devices) {
  let cursor = 0;
  const worker = async () => {
    const context = await browser.newContext({ viewport: device.viewport, isMobile: device.isMobile, hasTouch: device.hasTouch, reducedMotion: 'reduce' });
    const page = await context.newPage();
    while (true) {
      const index = cursor++;
      if (index >= routes.length) break;
      const route = routes[index];
      try {
        const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
        if (!response?.ok()) throw new Error(`HTTP ${response?.status() ?? 'no response'}`);
        await page.evaluate(async () => {
          if (document.fonts?.ready) await Promise.race([document.fonts.ready, new Promise((resolve) => setTimeout(resolve, 5000))]);
        });

        const result = await page.evaluate(() => {
          const technicalSelector = 'code, pre, kbd, samp, .contract-address, .transaction-hash, [data-long-value], [data-technical-value]';
          const editorialSerifSelector = [
            'main h1', 'main h2', 'main h3', 'main h4', 'main h5', 'main h6',
            'main [data-editorial-serif]', 'main [data-editorial-number]',
            '.home-register-strip strong', '.home-facts dd', '.directory-copy strong', '.home-status-ledger dd',
            '.stablecoin-register-count strong', '.event-index-ledger dd', '.organization-index-ledger dd',
            '.maintenance-counts dd', '.stats-kpi-grid dd', '.stats-mini-kpi-grid dd',
            '.update-analysis__deck', '.analysis-deck'
          ].join(', ');
          const explicitMonoSelector = [
            '.bar', '.kicker', '.eyebrow', '[class*="eyebrow"]', '[class*="kicker"]', '[class*="overline"]', '[class*="-label"]',
            'dt', 'th', 'time', '.archive-note', '.directory-number', '.chip', '[class*="badge"]', '[class*="status-chip"]',
            '.home-status-label', '.update-feed-category', '.ar-chip', '.ar-lifecycle', '.home-section-kicker',
            '.home-facts dd small', '.home-search__popular > span', '.home-material-list__meta', '.home-guide-list__meta',
            '.v3-masthead-meta', '.record-kicker', '.record-symbol', '.static-registry-range',
            '.timeline-item__date', '.update-feed-item__date', '.update-feed-paths', '[data-ui-mono]'
          ].join(', ');
          const badgeSelector = '.chip, [class*="badge"], [class*="status-chip"], .home-status-label, .update-feed-category, .ar-chip, .ar-lifecycle';
          const monospaceFamilies = new Set(['ui-monospace', 'sfmono-regular', 'menlo', 'monaco', 'consolas', 'liberation mono', 'courier', 'courier new', 'monospace']);
          const serifFamilies = new Set(['iowan old style', 'palatino linotype', 'palatino', 'georgia', 'times', 'times new roman', 'serif']);
          const visible = (element) => {
            if (!(element instanceof HTMLElement)) return false;
            const style = getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0 && rect.width > 0 && rect.height > 0;
          };
          const pathFor = (element) => {
            const parts = [];
            let current = element;
            while (current instanceof HTMLElement && parts.length < 6) {
              let part = current.tagName.toLowerCase();
              if (current.id) part += `#${current.id}`;
              else if (current.classList.length) part += `.${[...current.classList].slice(0, 3).join('.')}`;
              parts.unshift(part);
              current = current.parentElement;
            }
            return parts.join(' > ');
          };
          const displayText = (element) => {
            if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) return element.value || element.placeholder || element.getAttribute('aria-label') || '';
            if (element instanceof HTMLSelectElement) return element.selectedOptions[0]?.textContent ?? '';
            return (element.textContent ?? '').trim().replace(/\s+/g, ' ');
          };
          const parseRgb = (value) => {
            const match = String(value).match(/rgba?\((\d+(?:\.\d+)?)[, ]+(\d+(?:\.\d+)?)[, ]+(\d+(?:\.\d+)?)(?:[, /]+(\d+(?:\.\d+)?))?\)/i);
            return match ? [Number(match[1]), Number(match[2]), Number(match[3]), match[4] === undefined ? 1 : Number(match[4])] : null;
          };
          const luminance = ([r, g, b]) => {
            const convert = (channel) => { const value = channel / 255; return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4; };
            return .2126 * convert(r) + .7152 * convert(g) + .0722 * convert(b);
          };
          const contrast = (foreground, background) => {
            const left = luminance(foreground);
            const right = luminance(background);
            return (Math.max(left, right) + .05) / (Math.min(left, right) + .05);
          };
          const opaqueBackground = (element, fallback) => {
            let current = element;
            while (current instanceof HTMLElement) {
              const parsed = parseRgb(getComputedStyle(current).backgroundColor);
              if (parsed && parsed[3] >= .95) return parsed;
              current = current.parentElement;
            }
            return fallback;
          };
          const resolvedCustomColor = (name) => {
            const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
            const probe = document.createElement('span');
            probe.style.color = value;
            document.body.append(probe);
            const color = getComputedStyle(probe).color;
            probe.remove();
            return color;
          };

          const rootBackground = parseRgb(resolvedCustomColor('--ui-bg')) ?? [244, 241, 233, 1];
          const allowedHoverColors = { link: resolvedCustomColor('--ui-hover'), text: resolvedCustomColor('--ui-text') };
          const unexpectedFonts = [];
          const publicTextSelector = ['body', 'header', 'footer', 'main h1', 'main h2', 'main h3', 'main h4', 'main h5', 'main h6', 'main p', 'main li', 'main dt', 'main dd', 'main th', 'main td', 'main figcaption', 'main small', 'main time', 'main summary', 'main label', 'main a', 'main button', 'main input', 'main select', 'main textarea', 'main span'].join(', ');
          const checkedFonts = new Set();
          for (const element of [...document.querySelectorAll(publicTextSelector)].filter(visible)) {
            if (element.matches(technicalSelector) || element.closest(technicalSelector) || element.closest('[aria-hidden="true"]')) continue;
            const key = pathFor(element);
            if (checkedFonts.has(key)) continue;
            checkedFonts.add(key);
            const fontFamily = getComputedStyle(element).fontFamily;
            const families = fontFamily.split(',').map((family) => family.trim().replace(/^[\'\"]|[\'\"]$/g, '').toLowerCase());
            const allowsSerif = element.matches(editorialSerifSelector) || Boolean(element.closest(editorialSerifSelector));
            const allowsMono = element.matches(explicitMonoSelector) || Boolean(element.closest(explicitMonoSelector));
            const forbidden = families.find((family) => (!allowsMono && monospaceFamilies.has(family)) || (!allowsSerif && serifFamilies.has(family)));
            if (forbidden) unexpectedFonts.push({ element: key, text: displayText(element).slice(0, 160), font_family: fontFamily, forbidden_family: forbidden, expected_role: allowsSerif ? 'editorial-serif' : allowsMono ? 'label-mono' : 'ordinary-sans' });
            if (unexpectedFonts.length >= 100) break;
          }

          const lowContrastText = [];
          for (const element of [...document.querySelectorAll('main p, main li, main dd, main td, main figcaption, main small, main label, header a, footer a')].filter(visible)) {
            if (element.closest(technicalSelector) || element.closest('[aria-hidden="true"]')) continue;
            const style = getComputedStyle(element);
            const foreground = parseRgb(style.color);
            if (!foreground) continue;
            const background = opaqueBackground(element, rootBackground);
            const ratio = contrast(foreground, background);
            const size = Number.parseFloat(style.fontSize) || 16;
            const weight = Number.parseInt(style.fontWeight, 10) || 400;
            const required = size >= 24 || (size >= 18.66 && weight >= 700) ? 3 : 4.5;
            if (ratio + .01 < required) lowContrastText.push({ element: pathFor(element), text: displayText(element).slice(0, 160), color: style.color, contrast_ratio: Number(ratio.toFixed(2)), required });
            if (lowContrastText.length >= 100) break;
          }

          const invalidBadges = [];
          for (const element of [...document.querySelectorAll(badgeSelector)].filter(visible)) {
            const style = getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            const radius = Number.parseFloat(style.borderTopLeftRadius) || 0;
            const borderBottomWidth = Number.parseFloat(style.borderBottomWidth) || 0;
            const background = parseRgb(style.backgroundColor);
            const transparent = !background || background[3] < .08;
            if (rect.height < 14 || radius !== 0 || borderBottomWidth < 1 || !transparent) invalidBadges.push({ element: pathFor(element), text: displayText(element).slice(0, 100) });
            if (invalidBadges.length >= 100) break;
          }

          const rawEnums = [];
          const schemaLabels = [];
          const enumPattern = /\b[a-z][a-z0-9]*(?:_[a-z0-9]+)+\b/g;
          const schemaPattern = /\b[a-z]+(?:-[a-z]+)*\s+detail\s+[—-]\s+/i;
          const checkedEnums = new Set();
          const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
          let node;
          while ((node = walker.nextNode())) {
            const parent = node.parentElement;
            if (!(parent instanceof HTMLElement) || !visible(parent)) continue;
            if (parent.closest('script, style, noscript, template, [aria-hidden="true"]') || parent.closest(technicalSelector)) continue;
            const text = String(node.textContent ?? '').trim();
            if (!text) continue;
            if (schemaPattern.test(text)) schemaLabels.push({ element: pathFor(parent), text: text.replace(/\s+/g, ' ').slice(0, 180) });
            for (const match of text.matchAll(enumPattern)) {
              const token = match[0];
              if (token.startsWith('sog_') || /https?:\/\//i.test(text) || /\b\S+@\S+\b/.test(text)) continue;
              const key = `${pathFor(parent)}:${token}`;
              if (checkedEnums.has(key)) continue;
              checkedEnums.add(key);
              rawEnums.push({ element: pathFor(parent), token, text: text.replace(/\s+/g, ' ').slice(0, 180) });
            }
          }

          const linkTargets = [];
          for (const zone of ['header', 'main', 'footer']) {
            const target = [...document.querySelectorAll(`${zone} a`)].find((element) => visible(element) && !element.closest(badgeSelector));
            if (!(target instanceof HTMLAnchorElement)) continue;
            const id = `${zone}-${linkTargets.length}`;
            target.dataset.uiAuditLink = id;
            linkTargets.push({ id, zone, element: pathFor(target), text: displayText(target).slice(0, 100) });
          }
          return { unexpected_public_font: unexpectedFonts, low_contrast_public_text: lowContrastText, invalid_badge_contract: invalidBadges, raw_public_enum: rawEnums, schema_oriented_label: schemaLabels, link_targets: linkTargets, allowed_hover_colors: allowedHoverColors };
        });

        const invalidLinkHover = device.hasTouch ? [] : await withHoverLock(async () => {
          const findings = [];
          for (const target of result.link_targets) {
            const locator = page.locator(`[data-ui-audit-link="${target.id}"]`);
            await locator.scrollIntoViewIfNeeded();
            await locator.hover({ timeout: 5000 });
            await locator.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
            const state = await locator.evaluate((element) => ({ active: element.matches(':hover'), color: getComputedStyle(element).color }));
            const allowed = target.zone === 'main' ? [result.allowed_hover_colors.link, result.allowed_hover_colors.text] : [result.allowed_hover_colors.link, result.allowed_hover_colors.text];
            if (!state.active || !allowed.includes(state.color)) findings.push({ ...target, hover_active: state.active, hover_color: state.color, allowed });
          }
          return findings;
        });
        const findings = { ...result, invalid_link_hover: invalidLinkHover };
        delete findings.link_targets;
        delete findings.allowed_hover_colors;
        const counts = Object.fromEntries(Object.entries(findings).map(([key, values]) => [key, values.length]));
        records.push({ device: device.name, route, counts, findings });
      } catch (error) {
        navigationFailures.push({ device: device.name, route, error: error instanceof Error ? error.message : String(error) });
      }
    }
    await page.close();
    await context.close();
  };
  await Promise.all(Array.from({ length: Math.min(concurrency, routes.length) }, () => worker()));
}

await browser.close();
records.sort((left, right) => left.device.localeCompare(right.device) || left.route.localeCompare(right.route));
const categories = ['unexpected_public_font', 'low_contrast_public_text', 'invalid_badge_contract', 'invalid_link_hover', 'raw_public_enum', 'schema_oriented_label'];
const totals = Object.fromEntries(categories.map((category) => [category, records.reduce((sum, record) => sum + Number(record.counts?.[category] ?? 0), 0)]));
const expectedAuditCount = routes.length * devices.length;
const result = {
  schema_version: '2.1',
  generated_at: new Date().toISOString(),
  mode: 'representative',
  discovered_route_count: discoveredRoutes.length,
  route_count: routes.length,
  samples_per_family: samplesPerFamily,
  families: selection.families,
  device_count: devices.length,
  expected_audit_count: expectedAuditCount,
  audited_count: records.length,
  routes_with_findings: records.filter((record) => categories.some((category) => Number(record.counts?.[category] ?? 0) > 0)).length,
  ok: navigationFailures.length === 0 && records.length === expectedAuditCount && categories.every((category) => totals[category] === 0),
  typography_roles: { ordinary: 'sans-serif', editorial_headings: 'serif', technical_values: 'monospace' },
  interaction_contract: { hover: '--ui-hover or --ui-text', badges: 'flat square underlined status labels', text_contrast: 'WCAG AA' },
  totals,
  navigation_failures: navigationFailures,
  records
};
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify({ ok: result.ok, mode: result.mode, discovered_routes: result.discovered_route_count, selected_routes: result.route_count, expected_audit_count: result.expected_audit_count, audited_count: result.audited_count, routes_with_findings: result.routes_with_findings, totals: result.totals, navigation_failure_count: result.navigation_failures.length }, null, 2));
if (!result.ok) process.exit(1);
