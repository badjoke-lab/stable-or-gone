#!/usr/bin/env node
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
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

function argValue(name, fallback) {
  const flag = `--${name}`;
  const index = process.argv.indexOf(flag);
  return index === -1 ? fallback : process.argv[index + 1];
}

function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

function safeFilename(route) {
  if (route === '/') return 'home.png';
  const trimmed = route.replace(/^\/+|\/+$/g, '');
  const safe = trimmed
    .split('/')
    .map((segment) => segment.replace(/[^a-z0-9-]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase())
    .filter(Boolean)
    .join('__');
  return `${safe || 'home'}.png`;
}

function command(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: options.cwd ?? ROOT, stdio: 'inherit' });
    child.on('error', reject);
    child.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`${command} ${args.join(' ')} exited ${code}`)));
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

async function main() {
  const deviceName = argValue('device', 'desktop');
  if (!DEVICES[deviceName]) throw new Error(`Unsupported device: ${deviceName}`);
  const device = DEVICES[deviceName];
  const baseUrl = (argValue('base-url', process.env.SOG_SCREENSHOT_BASE_URL ?? DEFAULT_BASE_URL)).replace(/\/$/, '');

  if (hasFlag('zip-only')) {
    await zipDirectory(device.dir, device.zip);
    console.log(JSON.stringify({ device: deviceName, output_directory: device.dir, zip: device.zip }, null, 2));
    return;
  }

  const routesManifest = await collectRoutes(baseUrl);

  await rm(device.dir, { recursive: true, force: true });
  await mkdir(device.dir, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: device.viewport,
    deviceScaleFactor: 1,
    isMobile: device.isMobile ?? false,
    hasTouch: device.hasTouch ?? false
  });
  const page = await context.newPage();
  const records = [];
  const failures = [];

  for (const route of routesManifest.routes) {
    const url = `${baseUrl}${route}`;
    const file = path.join(device.dir, safeFilename(route));
    try {
      const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
      if (!response || !response.ok()) throw new Error(`HTTP ${response?.status() ?? 'no response'}`);
      await page.screenshot({ path: file, fullPage: true });
      records.push({ url, path: route, device: deviceName, file });
      console.log(`[${deviceName}] captured ${route} -> ${file}`);
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
    route_source_type: routesManifest.source_type,
    route_source: routesManifest.source,
    captured_count: records.length,
    failed_count: failures.length,
    records,
    failures
  };
  await writeFile(device.manifest, `${JSON.stringify(manifest, null, 2)}\n`);
  await zipDirectory(device.dir, device.zip);
  console.log(JSON.stringify({ device: deviceName, captured: records.length, failed: failures.length, route_source: routesManifest.source, output_directory: device.dir, zip: device.zip }, null, 2));
  if (failures.length > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
