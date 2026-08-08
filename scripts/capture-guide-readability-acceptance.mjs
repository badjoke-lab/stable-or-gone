#!/usr/bin/env node
import { mkdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const ROOT = process.cwd();
const OUTPUT = path.join(ROOT, 'artifacts', 'guide-readability-acceptance');
const ROUTES = [
  '/',
  '/guides/global-stablecoin-regulation-2026/',
  '/guides/uk-stablecoin-capital-rules-2026/'
];
const DEVICES = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 }
};

const argValue = (name, fallback) => {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? fallback : process.argv[index + 1];
};
const baseUrl = argValue('base-url', 'http://127.0.0.1:4173').replace(/\/$/, '');
const safeName = (route) => route === '/' ? 'home' : route.replace(/^\/+|\/+$/g, '').replace(/\//g, '__');

await rm(OUTPUT, { recursive: true, force: true });
await mkdir(OUTPUT, { recursive: true });

const browser = await chromium.launch({ args: ['--disable-lcd-text'] });
const records = [];
const failures = [];

for (const [device, viewport] of Object.entries(DEVICES)) {
  const deviceDir = path.join(OUTPUT, device);
  await mkdir(deviceDir, { recursive: true });
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: device === 'mobile', hasTouch: device === 'mobile', reducedMotion: 'reduce' });
  const page = await context.newPage();

  for (const route of ROUTES) {
    const url = `${baseUrl}${route}`;
    try {
      const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
      if (!response || !response.ok()) throw new Error(`HTTP ${response?.status() ?? 'no response'}`);
      await page.evaluate(() => document.fonts?.ready);
      await page.evaluate(() => window.scrollTo(0, 0));

      const metrics = await page.evaluate(() => {
        const visible = (element) => {
          if (!(element instanceof HTMLElement)) return false;
          const style = getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
        };
        const root = document.documentElement;
        const guide = document.querySelector('.guide-article-layout');
        const toc = document.querySelector('.guide-article-toc');
        const tocList = document.querySelector('.guide-article-toc ol');
        const guideHeading = document.querySelector('.guide-article-content > section > h2.bar, .guide-article-content > section > .guide-article-section-title');
        const guideSectionPanel = document.querySelector('.guide-article-content > section.panel');
        const contextSupport = document.querySelector('.guide-article-layout > .context-support-callout');
        const footerSupport = document.querySelector('.site-footer > .footer-support');
        const research = document.querySelector('section:has(#research-guides-title) > .editorial-directory');
        const rect = (element) => element instanceof HTMLElement ? element.getBoundingClientRect() : null;
        const style = (element) => element instanceof HTMLElement ? getComputedStyle(element) : null;
        const columns = (element) => {
          const value = style(element)?.gridTemplateColumns ?? '';
          return value && value !== 'none' ? value.split(/\s+/).filter(Boolean).length : 0;
        };
        return {
          viewportWidth: root.clientWidth,
          horizontalOverflowPx: Math.max(0, root.scrollWidth - root.clientWidth),
          bodyHeight: Math.round(document.body.getBoundingClientRect().height),
          guideWidth: Math.round(rect(guide)?.width ?? 0),
          tocPosition: style(toc)?.position ?? null,
          tocColumns: columns(tocList),
          guideHeadingFontPx: Number.parseFloat(style(guideHeading)?.fontSize ?? '0'),
          guideHeadingLineHeight: style(guideHeading)?.lineHeight ?? null,
          guideSectionBorderLeftPx: Number.parseFloat(style(guideSectionPanel)?.borderLeftWidth ?? '0'),
          guideSectionBorderRightPx: Number.parseFloat(style(guideSectionPanel)?.borderRightWidth ?? '0'),
          contextSupportWidth: Math.round(rect(contextSupport)?.width ?? 0),
          footerSupportVisible: visible(footerSupport),
          researchColumns: columns(research),
          researchVisible: visible(research)
        };
      });

      const routeName = safeName(route);
      const viewportFile = path.join(deviceDir, `${routeName}__viewport.png`);
      const fullFile = path.join(deviceDir, `${routeName}__full.png`);
      await page.screenshot({ path: viewportFile, fullPage: false });
      await page.screenshot({ path: fullFile, fullPage: true });

      const routeFailures = [];
      if (metrics.horizontalOverflowPx > 2) routeFailures.push(`horizontal overflow ${metrics.horizontalOverflowPx}px`);

      if (route.startsWith('/guides/')) {
        if (device === 'desktop' && (metrics.guideWidth < 1080 || metrics.guideWidth > 1121)) routeFailures.push(`desktop Guide width ${metrics.guideWidth}px outside 1080–1120px contract`);
        if (metrics.tocPosition !== 'static') routeFailures.push(`Guide TOC position is ${metrics.tocPosition ?? 'missing'}, expected static`);
        if (device === 'desktop' && metrics.tocColumns !== 3) routeFailures.push(`desktop Guide TOC has ${metrics.tocColumns} columns, expected 3`);
        if (device === 'mobile' && metrics.tocColumns !== 1) routeFailures.push(`mobile Guide TOC has ${metrics.tocColumns} columns, expected 1`);
        const headingFloor = device === 'desktop' ? 24 : 22;
        if (metrics.guideHeadingFontPx < headingFloor) routeFailures.push(`Guide primary heading ${metrics.guideHeadingFontPx}px below ${headingFloor}px floor`);
        if (metrics.guideSectionBorderLeftPx > 0 || metrics.guideSectionBorderRightPx > 0) routeFailures.push(`Guide direct section retains side borders ${metrics.guideSectionBorderLeftPx}/${metrics.guideSectionBorderRightPx}px`);
        if (metrics.footerSupportVisible) routeFailures.push('duplicate generic footer support is visible on Guide article');
        if (metrics.contextSupportWidth <= 0) routeFailures.push('contextual Guide support block is missing');
        if (device === 'desktop' && Math.abs(metrics.contextSupportWidth - metrics.guideWidth) > 2) routeFailures.push(`context support width ${metrics.contextSupportWidth}px does not match Guide width ${metrics.guideWidth}px`);
      }

      if (route === '/') {
        const expectedColumns = device === 'desktop' ? 3 : 1;
        if (!metrics.researchVisible) routeFailures.push('home Research & Guides secondary list is missing');
        if (metrics.researchColumns !== expectedColumns) routeFailures.push(`home Research & Guides has ${metrics.researchColumns} columns, expected ${expectedColumns}`);
      }

      const viewportBytes = (await stat(viewportFile)).size;
      const fullBytes = (await stat(fullFile)).size;
      records.push({ route, device, viewport, metrics, viewport_file: viewportFile, full_file: fullFile, viewport_bytes: viewportBytes, full_bytes: fullBytes, failures: routeFailures });
      for (const failure of routeFailures) failures.push({ route, device, failure });
      console.log(`[guide-readability] ${device} ${route}: ${routeFailures.length ? routeFailures.join('; ') : 'pass'}`);
    } catch (error) {
      failures.push({ route, device, failure: error.message });
      console.error(`[guide-readability] ${device} ${route}: ${error.message}`);
    }
  }

  await context.close();
}

await browser.close();
const manifest = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  base_url: baseUrl,
  required_routes: ROUTES,
  required_devices: DEVICES,
  records,
  failure_count: failures.length,
  failures,
  manual_visual_review_required: true
};
await writeFile(path.join(OUTPUT, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

if (failures.length) {
  console.error(JSON.stringify({ ok: false, failure_count: failures.length, failures }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, routes: ROUTES.length, captures: records.length * 2, manual_visual_review_required: true }, null, 2));
