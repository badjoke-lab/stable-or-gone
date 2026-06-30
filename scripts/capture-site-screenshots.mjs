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
  const context = await browser.newContext({ viewport: device.viewport, deviceScaleFactor: 1, isMobile: device.isMobile ?? false, hasTouch: device.hasTouch ?? false });
  const page = await context.newPage();
  const records = [];
  const failures = [];

  for (const route of selection.routes) {
    const url = `${baseUrl}${route}`;
    const file = path.join(device.dir, safeFilename(route));
    try {
      const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
      if (!response || !response.ok()) throw new Error(`HTTP ${response?.status() ?? 'no response'}`);
      await page.screenshot({ path: file, fullPage: true });
      records.push({ url, path: route, device: deviceName, file });
      console.log(`[${deviceName}] captured ${route}`);
    } catch (error) {
      failures.push({ url, path: route, device: deviceName, error: error.message });
      console.error(`[${deviceName}] failed ${route}: ${error.message}`);
    }
  }

  await browser.close();
  const manifest = {
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
