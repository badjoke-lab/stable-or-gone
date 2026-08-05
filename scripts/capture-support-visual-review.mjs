#!/usr/bin/env node
import { chromium } from 'playwright';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const baseUrl = (process.env.CAPTURE_BASE_URL ?? 'http://127.0.0.1:4173').replace(/\/$/, '');
const output = 'artifacts/support-visual-review';
const pages = [
  { id: 'home', route: '/' },
  { id: 'stablecoin-usdt', route: '/stablecoin/usdt/' },
  { id: 'methodology', route: '/methodology/' },
  { id: 'support', route: '/support/' }
];
const devices = {
  desktop: { width: 1440, height: 1000 },
  mobile: { width: 390, height: 844, isMobile: true, hasTouch: true }
};

const visible = `element => {
  if (!(element instanceof HTMLElement)) return false;
  const rect = element.getBoundingClientRect();
  const style = getComputedStyle(element);
  return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
}`;

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ args: ['--disable-lcd-text'] });
const records = [];
const failures = [];

for (const [deviceName, device] of Object.entries(devices)) {
  const dir = path.join(output, deviceName);
  await mkdir(dir, { recursive: true });
  for (const spec of pages) {
    const context = await browser.newContext({
      viewport: { width: device.width, height: device.height },
      isMobile: Boolean(device.isMobile),
      hasTouch: Boolean(device.hasTouch),
      reducedMotion: 'reduce'
    });
    const page = await context.newPage();
    try {
      const response = await page.goto(`${baseUrl}${spec.route}`, { waitUntil: 'networkidle', timeout: 60000 });
      if (!response?.ok()) throw new Error(`HTTP ${response?.status() ?? 'no response'}`);
      await page.evaluate(() => document.fonts?.ready);
      const metrics = await page.evaluate((visibleSource) => {
        const isVisible = Function(`return (${visibleSource})`)();
        const supportPattern = /(support|donat(?:e|ion)|contribut|fund|back this|help keep|wallet)/i;
        const supportLinks = [...document.querySelectorAll('a,button')]
          .filter(isVisible)
          .map((element) => {
            const rect = element.getBoundingClientRect();
            const text = `${element.textContent ?? ''} ${element.getAttribute('aria-label') ?? ''}`.replace(/\s+/g, ' ').trim();
            const href = element instanceof HTMLAnchorElement ? element.href : '';
            return {
              tag: element.tagName.toLowerCase(),
              text,
              href,
              location: element.closest('header') ? 'header' : element.closest('footer') ? 'footer' : element.closest('main') ? 'main' : 'other',
              top: Math.round(rect.top + scrollY),
              in_initial_viewport: rect.bottom > 0 && rect.top < innerHeight
            };
          })
          .filter((item) => {
            if (supportPattern.test(item.text)) return true;
            if (!item.href) return false;
            try {
              const url = new URL(item.href);
              return url.pathname === '/support/' && !url.hash;
            } catch {
              return false;
            }
          });
        const selfSupportLinks = supportLinks.filter((item) => {
          if (item.tag !== 'a' || !item.href) return false;
          try {
            const url = new URL(item.href);
            return url.pathname === '/support/' && !url.hash;
          } catch {
            return false;
          }
        });
        const root = document.documentElement;
        return {
          h1_count: document.querySelectorAll('h1').length,
          main_count: document.querySelectorAll('main').length,
          horizontal_overflow_px: Math.max(0, root.scrollWidth - root.clientWidth),
          broken_images: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.currentSrc || image.src),
          support_links: supportLinks,
          support_link_count: supportLinks.length,
          support_links_in_initial_viewport: supportLinks.filter((item) => item.in_initial_viewport).length,
          self_support_link_count: selfSupportLinks.length,
          additional_networks_collapsed: (() => {
            const details = document.querySelector('.additional-wallet-options');
            return details instanceof HTMLDetailsElement ? !details.open : null;
          })()
        };
      }, visible);
      const viewportFile = path.join(dir, `${spec.id}-${deviceName}.viewport.png`);
      const fullFile = path.join(dir, `${spec.id}-${deviceName}.full.png`);
      await page.screenshot({ path: viewportFile });
      await page.screenshot({ path: fullFile, fullPage: true });
      const issues = [];
      if (metrics.h1_count !== 1) issues.push(`expected one h1, found ${metrics.h1_count}`);
      if (metrics.main_count !== 1) issues.push(`expected one main, found ${metrics.main_count}`);
      if (metrics.horizontal_overflow_px > 2) issues.push(`horizontal overflow ${metrics.horizontal_overflow_px}px`);
      if (metrics.broken_images.length) issues.push(`${metrics.broken_images.length} broken image(s)`);
      if (spec.route === '/support/') {
        if (metrics.self_support_link_count > 0) issues.push(`support page contains ${metrics.self_support_link_count} self-referencing support link(s)`);
        if (metrics.additional_networks_collapsed !== true) issues.push('additional support networks are not collapsed by default');
      } else {
        if (metrics.support_link_count === 0) issues.push('page exposes no visible support route');
        if (metrics.support_links_in_initial_viewport === 0) issues.push('support route is not visible in the initial viewport');
      }
      const record = { page_id: spec.id, route: spec.route, device: deviceName, viewport: device, viewport_file: viewportFile, full_file: fullFile, metrics, issues };
      records.push(record);
      if (issues.length) failures.push(record);
      console.log(`[${deviceName}] captured ${spec.route}`);
    } catch (error) {
      failures.push({ page_id: spec.id, route: spec.route, device: deviceName, issues: [error instanceof Error ? error.message : String(error)] });
    } finally {
      await context.close();
    }
  }
}
await browser.close();

const manifest = {
  schema_version: '1.1',
  site: 'Stable or Gone',
  generated_at: new Date().toISOString(),
  expected_state_count: pages.length * Object.keys(devices).length,
  captured_state_count: records.length,
  screenshot_count: records.length * 2,
  failure_count: failures.length,
  records,
  failures,
  status: failures.length === 0 ? 'pass' : 'fail'
};
await writeFile(path.join(output, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
const cards = records.map((record) => `<article><h2>${record.page_id} · ${record.device}</h2><p><code>${record.route}</code></p><img src="${path.relative(output, record.viewport_file)}"><img src="${path.relative(output, record.full_file)}"><p>Support-like controls: ${record.metrics.support_link_count}; initial viewport: ${record.metrics.support_links_in_initial_viewport}; self-links: ${record.metrics.self_support_link_count}</p></article>`).join('');
await writeFile(path.join(output, 'index.html'), `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>SOG support visual review</title><style>body{font-family:system-ui;margin:24px;background:#eee}article{background:#fff;border:1px solid #bbb;padding:16px;margin:24px 0}img{display:block;max-width:100%;border:1px solid #ddd;margin:12px 0}</style><h1>SOG support visual review</h1>${cards}`);
if (manifest.status !== 'pass') process.exitCode = 1;
