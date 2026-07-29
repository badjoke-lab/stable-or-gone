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
const REQUIRED_REPRESENTATIVE_ROUTES = [
  '/stablecoin/usdt/',
  '/stablecoin/usdc/',
  '/stablecoin/dai/'
];
const REQUIRED_REPRESENTATIVE_STATES = [
  '/stablecoins/?q=usd'
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
    const chosen = family.name === 'stablecoin-detail'
      ? entries.filter((entry) => REQUIRED_REPRESENTATIVE_ROUTES.includes(entry.route))
      : shouldSample ? quantileSample(entries, samplesPerFamily) : entries;
    selected.push(...chosen.map((entry) => entry.route));
    families.push({ name: family.name, discovered: familyRoutes.length, selected: chosen.length, routes: chosen.map((entry) => entry.route) });
  }
  return { routes: [...new Set([...selected, ...REQUIRED_REPRESENTATIVE_STATES])].sort(), families };
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
    const approvedMonoContainer = [
      'code', 'pre', 'kbd', 'samp', 'time', 'dt', 'th',
      '.bar', '.kicker', '.eyebrow', '[class*="eyebrow"]', '[class*="kicker"]', '[class*="overline"]', '[class*="-label"]',
      '.home-masthead__edition', '.home-section-kicker', '.home-search__popular > span',
      '.home-material-list__meta', '.home-guide-list__meta', '.v3-masthead-meta',
      '.record-kicker', '.record-symbol',
      '.stablecoin-section-heading > p', '.event-detail-section-heading > p', '.organization-detail-section-heading > p',
      '.static-registry-eyebrow', '.static-registry-range',
      '.timeline-item__date', '.update-feed-item__date', '.update-feed-paths',
      '[data-ui-mono]', '[data-mono]', '.v3-brand-copy small'
    ].join(', ');
    const fontFor = (selector, excludedContainer = null) => {
      const element = [...document.querySelectorAll(selector)].find((candidate) => (
        visible(candidate)
        && (!excludedContainer || (!candidate.matches(excludedContainer) && !candidate.closest(excludedContainer)))
      ));
      return element instanceof HTMLElement ? getComputedStyle(element).fontFamily : null;
    };
    const root = document.documentElement;
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
    const legacyVisualSelectors = ['.page-hero', '.metric-card', '[class*="blue-purple"]', '[class*="glow-art"]', '[data-saas-dashboard]'];
    const legacyVisualMarkers = legacyVisualSelectors.flatMap((selector) => [...document.querySelectorAll(selector)].filter(visible).map(() => selector));
    const unexpectedEmptySelectors = ['[data-stablecoin-no-results]', '[data-organization-no-results]', '[data-event-no-results]'];
    const mobileRepresentationSelector = (kind) => `[data-mobile-representation-for="${CSS.escape(kind)}"]`;
    const hiddenMobileTableContent = innerWidth > 820 ? [] : [...document.querySelectorAll('table[data-table-kind][data-mobile-table]')].flatMap((table) => {
      const kind = table.getAttribute('data-table-kind') ?? 'unknown';
      const rows = table.querySelectorAll(':scope > tbody > tr').length;
      const representation = [table.nextElementSibling, table.parentElement?.nextElementSibling]
        .find((candidate) => candidate instanceof HTMLElement && candidate.matches(mobileRepresentationSelector(kind)));
      const tableVisible = visible(table);
      const representationVisible = representation instanceof HTMLElement && visible(representation);
      if (rows === 0 || (tableVisible && !representationVisible) || (!tableVisible && representationVisible)) return [];
      if (tableVisible && representationVisible) return [`duplicate-mobile-table:${kind}`];
      return [`hidden-mobile-table:${kind}`];
    });
    const unexpectedEmptyStates = [
      ...unexpectedEmptySelectors.flatMap((selector) => [...document.querySelectorAll(selector)].filter(visible).map(() => selector)),
      ...hiddenMobileTableContent
    ];
    const monoTokens = ['ui-monospace', 'sfmono-regular', 'menlo', 'monaco', 'consolas', 'liberation mono', 'monospace'];
    const textCandidates = [...document.querySelectorAll('a, span, strong, small, p, li, dd, label, button, input, select, textarea, summary, h1, h2, h3, h4, h5, h6')].filter(visible);
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
      legacyFontViolations,
      unexpectedEmptyStates,
      bodyHeight: Math.round(document.body.getBoundingClientRect().height),
      viewportWidth: root.clientWidth,
      fontRoles: {
        body: getComputedStyle(document.body).fontFamily,
        h1: fontFor('h1'),
        h2: fontFor('h2', approvedMonoContainer),
        h3: fontFor('h3', approvedMonoContainer),
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

  // CI screenshots must use grayscale antialiasing so authored colors are not
  // confused with Chromium's RGB LCD subpixel fringes.
  const browser = await chromium.launch({ args: ['--disable-lcd-text'] });
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
      const screenshot = await page.screenshot({ path: file, fullPage: true });
      const screenshotWidth = screenshot.readUInt32BE(16);
      const screenshotOverflowPx = Math.max(0, screenshotWidth - device.viewport.width);
      metrics.screenshotWidth = screenshotWidth;
      metrics.screenshotOverflowPx = screenshotOverflowPx;
      if (screenshotOverflowPx > 2) metrics.horizontalOverflow = true;
      records.push({ route, url, file, ...metrics });
      if (metrics.h1Count !== 1 || metrics.mainCount !== 1 || metrics.horizontalOverflow || metrics.brokenImages.length || metrics.brandViolations.length || metrics.legacyVisualMarkers.length || metrics.legacyFontViolations.length || metrics.unexpectedEmptyStates.length) {
        failures.push({ route, metrics });
      }
    } catch (error) {
      failures.push({ route, error: error instanceof Error ? error.message : String(error) });
    }
  }

  await browser.close();
  const manifest = {
    schema_version: '4.0',
    generated_at: new Date().toISOString(),
    base_url: baseUrl,
    device: deviceName,
    mode,
    samples_per_family: samplesPerFamily,
    discovered_routes: routesManifest.routes.length,
    selected_routes: selection.routes.length,
    families: selection.families,
    records,
    failures
  };
  await mkdir(path.dirname(device.manifest), { recursive: true });
  await writeFile(device.manifest, `${JSON.stringify(manifest, null, 2)}\n`);
  if (failures.length) {
    console.error(JSON.stringify(manifest, null, 2));
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
