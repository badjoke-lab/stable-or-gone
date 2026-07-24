#!/usr/bin/env node
import { mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const DEFAULT_BASE_URL = 'https://sog.badjoke-lab.com';
const ROUTES_FILE = 'artifacts/screenshots/routes.json';
const ROOT = process.cwd();
const DEVICES = {
  desktop: { viewport: { width: 1440, height: 900 }, dir: 'artifacts/screenshots/desktop', manifest: 'artifacts/screenshots/manifest.desktop.json', zip: 'artifacts/screenshots-desktop.zip' },
  mobile: { viewport: { width: 393, height: 852 }, dir: 'artifacts/screenshots/mobile', manifest: 'artifacts/screenshots/manifest.mobile.json', zip: 'artifacts/screenshots-mobile.zip', isMobile: true, hasTouch: true }
};
const DETAIL_FAMILIES = [
  ['stablecoin-detail', '/stablecoin/'],
  ['issuer-detail', '/issuer/'],
  ['event-detail', '/event/'],
  ['guide-detail', '/guides/']
];

function argValue(name, fallback) {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? fallback : process.argv[index + 1];
}

function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

function safeFilename(route) {
  if (route === '/') return 'home.png';
  const safe = route.replace(/^\/+|\/+$/g, '').split('/').map((segment) => segment.replace(/[^a-z0-9-]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase()).filter(Boolean).join('__');
  return `${safe || 'home'}.png`;
}

function command(commandName, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(commandName, args, { cwd: options.cwd ?? ROOT, stdio: 'inherit' });
    child.on('error', reject);
    child.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`${commandName} ${args.join(' ')} exited ${code}`)));
  });
}

async function collectRoutes(baseUrl) {
  const collector = fileURLToPath(new URL('./collect-public-routes.mjs', import.meta.url));
  await command(process.execPath, [collector, '--base-url', baseUrl, '--output', ROUTES_FILE]);
  return JSON.parse(await readFile(ROUTES_FILE, 'utf8'));
}

async function zipDirectory(sourceDir, outputFile) {
  await mkdir(path.dirname(outputFile), { recursive: true });
  await rm(outputFile, { force: true });
  await command('zip', ['-qr', path.resolve(ROOT, outputFile), '.'], { cwd: path.resolve(ROOT, sourceDir) });
}

function familyForRoute(route) {
  for (const [name, prefix] of DETAIL_FAMILIES) {
    if (route !== prefix && route.startsWith(prefix)) return { name, prefix, forced: true };
  }
  const segments = route.split('/').filter(Boolean);
  return segments.length >= 2 ? { name: `nested-${segments[0]}`, prefix: `/${segments[0]}/`, forced: false } : null;
}

async function htmlSize(route) {
  const relative = route === '/' ? 'index.html' : path.join(route.replace(/^\/+|\/+$/g, ''), 'index.html');
  try {
    return (await stat(path.join(ROOT, 'dist', relative))).size;
  } catch {
    return 0;
  }
}

function quantileSample(entries, count) {
  if (entries.length <= count) return entries;
  const sorted = [...entries].sort((a, b) => a.size - b.size || a.route.localeCompare(b.route));
  const picked = [];
  for (let index = 0; index < count; index += 1) {
    picked.push(sorted[Math.round(index * (sorted.length - 1) / Math.max(1, count - 1))]);
  }
  return [...new Map(picked.map((entry) => [entry.route, entry])).values()];
}

async function selectRoutes(routes, mode, samplesPerFamily) {
  if (mode === 'exhaustive') return { routes, families: [] };
  const staticRoutes = [];
  const groups = new Map();
  for (const route of routes) {
    const family = familyForRoute(route);
    if (!family) {
      staticRoutes.push(route);
      continue;
    }
    if (!groups.has(family.name)) groups.set(family.name, { family, routes: [] });
    groups.get(family.name).routes.push(route);
  }
  const selected = [...staticRoutes];
  const families = [];
  for (const { family, routes: familyRoutes } of groups.values()) {
    const entries = await Promise.all(familyRoutes.map(async (route) => ({ route, size: await htmlSize(route) })));
    const shouldSample = family.forced || familyRoutes.length > 8;
    const chosen = shouldSample ? quantileSample(entries, samplesPerFamily) : entries;
    selected.push(...chosen.map((entry) => entry.route));
    families.push({ name: family.name, discovered: familyRoutes.length, selected: chosen.length, routes: chosen.map((entry) => entry.route) });
  }
  return { routes: [...new Set(selected)].sort(), families };
}

async function measurePage(page) {
  return page.evaluate(() => {
    const visible = (element) => {
      if (!(element instanceof HTMLElement)) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    };
    const elementPath = (element) => {
      const parts = [];
      let current = element;
      while (current instanceof HTMLElement && parts.length < 4) {
        let part = current.tagName.toLowerCase();
        if (current.id) part += `#${current.id}`;
        else if (current.classList.length) part += `.${[...current.classList].slice(0, 2).join('.')}`;
        parts.unshift(part);
        current = current.parentElement;
      }
      return parts.join(' > ');
    };
    const fontFor = (selector) => {
      const element = [...document.querySelectorAll(selector)].find(visible);
      return element instanceof HTMLElement ? getComputedStyle(element).fontFamily : null;
    };
    const parseColor = (value) => {
      const input = String(value ?? '').trim().toLowerCase();
      if (!input || input === 'transparent') return null;
      const hex = input.match(/^#([0-9a-f]{6}|[0-9a-f]{3})$/i);
      if (hex) {
        const raw = hex[1].length === 3 ? hex[1].split('').map((part) => `${part}${part}`).join('') : hex[1];
        return { r: Number.parseInt(raw.slice(0, 2), 16), g: Number.parseInt(raw.slice(2, 4), 16), b: Number.parseInt(raw.slice(4, 6), 16), a: 1 };
      }
      const rgb = input.match(/^rgba?\(([^)]+)\)$/i);
      if (!rgb) return null;
      const parts = rgb[1].split(',').map((part) => Number.parseFloat(part.trim()));
      if (parts.length < 3 || parts.some((part, index) => index < 3 && !Number.isFinite(part))) return null;
      return { r: Math.round(parts[0]), g: Math.round(parts[1]), b: Math.round(parts[2]), a: Number.isFinite(parts[3]) ? parts[3] : 1 };
    };
    const colorKey = (color) => color ? `${color.r},${color.g},${color.b}` : null;
    const root = document.documentElement;
    const rootStyle = getComputedStyle(root);
    const tokenColor = (name) => parseColor(rootStyle.getPropertyValue(name));
    const allowedSurfaceColors = new Set([
      colorKey(tokenColor('--v3-bg')),
      colorKey(tokenColor('--v3-bg-raised')),
      colorKey(tokenColor('--v3-bg-soft')),
      '0,0,0'
    ].filter(Boolean));
    const semanticColors = Object.fromEntries([
      ['accent', '--v3-accent'],
      ['archive', '--v3-archive'],
      ['positive', '--v3-positive'],
      ['warning', '--v3-warning'],
      ['danger', '--v3-danger'],
      ['violet', '--v3-violet']
    ].map(([label, token]) => [colorKey(tokenColor(token)), label]).filter(([key]) => Boolean(key)));

    const overflowPx = Math.max(0, root.scrollWidth - root.clientWidth);
    const brokenImages = [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.getAttribute('src') ?? 'missing-src');
    const approvedBrandPaths = new Set([
      '/brand/sog-lockup-on-light.svg',
      '/brand/sog-lockup-on-dark.svg',
      '/brand/sog-mark-on-light.svg',
      '/brand/sog-mark-on-dark.svg'
    ]);
    const brandViolations = [...document.querySelectorAll('.brand-lockup img')]
      .map((image) => image.getAttribute('src') ?? '')
      .filter((src) => {
        try { return !approvedBrandPaths.has(new URL(src, location.origin).pathname); }
        catch { return true; }
      });

    const legacyVisualSelectors = ['.page-hero', '.metric-card', '[class*="blue-purple"]', '[class*="glow-art"]', '[data-saas-dashboard]', '.event-structured-detail.panel.registry'];
    const legacyVisualMarkers = legacyVisualSelectors.flatMap((selector) => [...document.querySelectorAll(selector)].filter(visible).map(() => selector));
    const legacyPanelSurfaces = [...document.querySelectorAll('.panel.registry, .panel > .bar')].filter(visible).flatMap((element) => {
      const style = getComputedStyle(element);
      const background = parseColor(style.backgroundColor);
      const backgroundKey = colorKey(background);
      const radius = Number.parseFloat(style.borderTopLeftRadius) || 0;
      const hasShadow = style.boxShadow !== 'none';
      const offTokenBackground = background && background.a > .05 && !allowedSurfaceColors.has(backgroundKey);
      if (!offTokenBackground && radius === 0 && !hasShadow) return [];
      const rect = element.getBoundingClientRect();
      return [{ element: elementPath(element), background: style.backgroundColor, border_radius: style.borderTopLeftRadius, box_shadow: style.boxShadow, area: Math.round(rect.width * rect.height) }];
    }).slice(0, 50);

    const largeOffTokenSurfaces = [...document.querySelectorAll('body *')].filter(visible).flatMap((element) => {
      const style = getComputedStyle(element);
      const background = parseColor(style.backgroundColor);
      if (!background || background.a <= .05) return [];
      const backgroundKey = colorKey(background);
      if (allowedSurfaceColors.has(backgroundKey)) return [];
      const rect = element.getBoundingClientRect();
      const area = rect.width * rect.height;
      if (area < 12000) return [];
      const chroma = Math.max(background.r, background.g, background.b) - Math.min(background.r, background.g, background.b);
      if (chroma < 6) return [];
      return [{ element: elementPath(element), background: style.backgroundColor, area: Math.round(area), width: Math.round(rect.width), height: Math.round(rect.height) }];
    }).sort((left, right) => right.area - left.area).slice(0, 50);

    const approvedSemanticContainer = [
      '[class*="status"]', '[class*="chip"]', '[class*="badge"]', '[data-value-state]', '[data-confidence]', '[data-lifecycle]',
      '.stablecoin-dossier-title-row h1 span', '.stablecoin-material-change > span',
      '.organization-latest-change > span', '.organization-latest-change > time',
      '.organization-unknowns-r5 > summary small', '.organization-unknowns-r5 > summary > b',
      '.timeline-item__date > span', '.timeline-active-filter', '.ar-active-filter', '.timeline-filter-group legend', '.ar-filter-group legend'
    ].join(', ');
    const semanticColorCandidates = [...document.querySelectorAll('h1, h2, h3, h4, p, li, dd, dt, span, strong, small, time, label, summary')].filter(visible);
    const semanticColorViolations = semanticColorCandidates.flatMap((element) => {
      if (element.closest('a') || element.closest(approvedSemanticContainer)) return [];
      const text = (element.textContent ?? '').trim().replace(/\s+/g, ' ');
      if (!text) return [];
      const style = getComputedStyle(element);
      const role = semanticColors[colorKey(parseColor(style.color))];
      if (!role) return [];
      return [{ element: elementPath(element), text: text.slice(0, 120), color: style.color, semantic_role: role }];
    }).slice(0, 100);

    const unexpectedEmptySelectors = ['[data-stablecoin-no-results]', '[data-organization-no-results]', '[data-event-no-results]'];
    const unexpectedEmptyStates = unexpectedEmptySelectors.flatMap((selector) => [...document.querySelectorAll(selector)].filter(visible).map(() => selector));
    const monoTokens = ['ui-monospace', 'sfmono-regular', 'menlo', 'monaco', 'consolas', 'liberation mono', 'monospace'];
    const approvedMonoContainer = 'code, pre, kbd, samp, time, dt, th, .kicker, .eyebrow, [class*="meta"], [class*="overline"], [data-mono], .v3-brand-copy small';
    const textCandidates = [...document.querySelectorAll('a, span, strong, small, p, li, dd, label, button, input, select, textarea, summary, h3')].filter(visible);
    const legacyFontViolations = textCandidates.flatMap((element) => {
      const text = element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement
        ? element.value || element.placeholder || ''
        : element.textContent || '';
      if (!text.trim()) return [];
      const fontFamily = getComputedStyle(element).fontFamily;
      const lower = fontFamily.toLowerCase();
      const usesMono = monoTokens.some((token) => lower.includes(token));
      if (!usesMono || element.closest(approvedMonoContainer)) return [];
      return [{
        element: elementPath(element),
        text: text.trim().replace(/\s+/g, ' ').slice(0, 120),
        font_family: fontFamily
      }];
    }).slice(0, 100);
    return {
      title: document.title,
      h1Count: document.querySelectorAll('h1').length,
      mainCount: document.querySelectorAll('main').length,
      horizontalOverflowPx: overflowPx,
      horizontalOverflow: overflowPx > 2,
      brokenImages,
      brandViolations,
      legacyVisualMarkers,
      legacyPanelSurfaces,
      largeOffTokenSurfaces,
      semanticColorViolations,
      legacyFontViolations,
      unexpectedEmptyStates,
      bodyHeight: Math.round(document.body.getBoundingClientRect().height),
      viewportWidth: root.clientWidth,
      fontRoles: {
        body: getComputedStyle(document.body).fontFamily,
        h1: fontFor('h1'),
        h2: fontFor('h2'),
        h3: fontFor('h3'),
        paragraph: fontFor('p'),
        link: fontFor('a'),
        strong: fontFor('strong'),
        definition: fontFor('dd'),
        button: fontFor('button'),
        input: fontFor('input'),
        select: fontFor('select')
      },
      stylesheetCount: document.styleSheets.length
    };
  });
}

async function main() {
  const deviceName = argValue('device', 'desktop');
  if (!DEVICES[deviceName]) throw new Error(`Unsupported device: ${deviceName}`);
  const mode = argValue('mode', process.env.SOG_SCREENSHOT_MODE ?? 'representative');
  if (!['representative', 'exhaustive'].includes(mode)) throw new Error(`Unsupported mode: ${mode}`);
  const samplesPerFamily = Number.parseInt(argValue('samples-per-family', '3'), 10);
  if (!Number.isInteger(samplesPerFamily) || samplesPerFamily < 1) throw new Error('samples-per-family must be a positive integer');
  const device = DEVICES[deviceName];
  const baseUrl = argValue('base-url', process.env.SOG_SCREENSHOT_BASE_URL ?? DEFAULT_BASE_URL).replace(/\/$/, '');

  if (hasFlag('zip-only')) {
    await zipDirectory(device.dir, device.zip);
    return;
  }

  const routesManifest = await collectRoutes(baseUrl);
  const selection = await selectRoutes(routesManifest.routes, mode, samplesPerFamily);
  await rm(device.dir, { recursive: true, force: true });
  await mkdir(device.dir, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: device.viewport, deviceScaleFactor: 1, isMobile: device.isMobile ?? false, hasTouch: device.hasTouch ?? false, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const records = [];
  const failures = [];

  for (const route of selection.routes) {
    const url = `${baseUrl}${route}`;
    const file = path.join(device.dir, safeFilename(route));
    try {
      const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
      if (!response || !response.ok()) throw new Error(`HTTP ${response?.status() ?? 'no response'}`);
      await page.evaluate(() => document.fonts?.ready);
      const metrics = await measurePage(page);
      await page.screenshot({ path: file, fullPage: true });
      const screenshotBytes = (await stat(file)).size;
      records.push({ url, path: route, device: deviceName, file, screenshot_bytes: screenshotBytes, metrics });
      console.log(`[${deviceName}] captured ${route}`);
    } catch (error) {
      failures.push({ url, path: route, device: deviceName, error: error.message });
      console.error(`[${deviceName}] failed ${route}: ${error.message}`);
    }
  }

  await browser.close();
  const manifest = {
    schema_version: '3.2',
    generated_at: new Date().toISOString(),
    device: deviceName,
    viewport: device.viewport,
    capture_mode: mode,
    samples_per_family: samplesPerFamily,
    discovered_route_count: routesManifest.routes.length,
    selected_route_count: selection.routes.length,
    family_selection: selection.families,
    route_source_type: routesManifest.source_type,
    route_source: routesManifest.source,
    captured_count: records.length,
    failed_count: failures.length,
    records,
    failures
  };
  await writeFile(device.manifest, `${JSON.stringify(manifest, null, 2)}\n`);
  await zipDirectory(device.dir, device.zip);
  console.log(JSON.stringify({ device: deviceName, mode, discovered: routesManifest.routes.length, selected: selection.routes.length, captured: records.length, failed: failures.length, zip: device.zip }, null, 2));
  if (failures.length > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
