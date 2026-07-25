#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const distRoot = path.resolve('dist');
const baseUrl = (process.env.PUBLIC_UI_AUDIT_BASE_URL ?? 'http://127.0.0.1:4173').replace(/\/$/, '');
const concurrency = Math.max(1, Number.parseInt(process.env.PUBLIC_UI_AUDIT_CONCURRENCY ?? '8', 10) || 8);
const outputPath = 'artifacts/public-typography-enum-runtime-audit.json';

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
const routes = [...new Set(htmlFiles.map(routeForFile))].sort();

const devices = [
  { name: 'desktop', viewport: { width: 1440, height: 900 }, isMobile: false, hasTouch: false },
  { name: 'mobile', viewport: { width: 393, height: 852 }, isMobile: true, hasTouch: true }
];

const browser = await chromium.launch({ args: ['--disable-lcd-text'] });
const records = [];
const navigationFailures = [];

for (const device of devices) {
  const context = await browser.newContext({
    viewport: device.viewport,
    isMobile: device.isMobile,
    hasTouch: device.hasTouch,
    reducedMotion: 'reduce'
  });
  let cursor = 0;

  const worker = async () => {
    const page = await context.newPage();
    while (true) {
      const index = cursor;
      cursor += 1;
      if (index >= routes.length) break;
      const route = routes[index];
      try {
        const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
        if (!response?.ok()) throw new Error(`HTTP ${response?.status() ?? 'no response'}`);
        await page.evaluate(async () => {
          if (document.fonts?.ready) await Promise.race([
            document.fonts.ready,
            new Promise((resolve) => setTimeout(resolve, 5000))
          ]);
        });
        const result = await page.evaluate(() => {
          const technicalSelector = 'code, pre, kbd, samp, .contract-address, .transaction-hash, [data-long-value], [data-technical-value]';
          const editorialSerifSelector = 'main h1, main h2, main [data-editorial-serif], main [data-editorial-number]';
          const monospaceFamilies = new Set([
            'ui-monospace', 'sfmono-regular', 'menlo', 'monaco', 'consolas',
            'liberation mono', 'courier', 'courier new', 'monospace'
          ]);
          const serifFamilies = new Set([
            'iowan old style', 'palatino linotype', 'palatino', 'georgia',
            'times', 'times new roman', 'serif'
          ]);
          const visible = (element) => {
            if (!(element instanceof HTMLElement)) return false;
            const style = getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            return style.display !== 'none'
              && style.visibility !== 'hidden'
              && Number(style.opacity) > 0
              && rect.width > 0
              && rect.height > 0;
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
            if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
              return element.value || element.placeholder || element.getAttribute('aria-label') || '';
            }
            if (element instanceof HTMLSelectElement) return element.selectedOptions[0]?.textContent ?? '';
            return (element.textContent ?? '').trim().replace(/\s+/g, ' ');
          };

          const unexpectedFonts = [];
          const publicTextSelector = [
            'body', 'header', 'footer',
            'main h1', 'main h2', 'main h3', 'main h4', 'main h5', 'main h6',
            'main p', 'main li', 'main dt', 'main dd', 'main th', 'main td',
            'main figcaption', 'main small', 'main time', 'main summary', 'main label',
            'main a', 'main button', 'main input', 'main select', 'main textarea', 'main span'
          ].join(', ');
          const checkedFonts = new Set();
          for (const element of [...document.querySelectorAll(publicTextSelector)].filter(visible)) {
            if (element.matches(technicalSelector) || element.closest(technicalSelector)) continue;
            if (element.closest('[aria-hidden="true"]')) continue;
            const key = pathFor(element);
            if (checkedFonts.has(key)) continue;
            checkedFonts.add(key);
            const fontFamily = getComputedStyle(element).fontFamily;
            const families = fontFamily
              .split(',')
              .map((family) => family.trim().replace(/^[\'"]|[\'"]$/g, '').toLowerCase());
            const allowsSerif = element.matches(editorialSerifSelector) || Boolean(element.closest(editorialSerifSelector));
            const forbidden = families.find((family) => monospaceFamilies.has(family) || (!allowsSerif && serifFamilies.has(family)));
            if (!forbidden) continue;
            unexpectedFonts.push({
              element: key,
              text: displayText(element).slice(0, 160),
              font_family: fontFamily,
              forbidden_family: forbidden,
              expected_role: allowsSerif ? 'editorial-serif' : 'ordinary-sans'
            });
            if (unexpectedFonts.length >= 100) break;
          }

          const rawEnums = [];
          const enumPattern = /\b[a-z][a-z0-9]*(?:_[a-z0-9]+)+\b/g;
          const checkedEnums = new Set();
          const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
          let node;
          while ((node = walker.nextNode())) {
            const parent = node.parentElement;
            if (!(parent instanceof HTMLElement) || !visible(parent)) continue;
            if (parent.closest('script, style, noscript, template, [aria-hidden="true"]')) continue;
            if (parent.matches(technicalSelector) || parent.closest(technicalSelector)) continue;
            const text = String(node.textContent ?? '').trim();
            if (!text) continue;
            for (const match of text.matchAll(enumPattern)) {
              const token = match[0];
              if (token.startsWith('sog_')) continue;
              if (/https?:\/\//i.test(text) || /\b\S+@\S+\b/.test(text)) continue;
              const key = `${pathFor(parent)}:${token}`;
              if (checkedEnums.has(key)) continue;
              checkedEnums.add(key);
              rawEnums.push({
                element: pathFor(parent),
                token,
                text: text.replace(/\s+/g, ' ').slice(0, 180)
              });
              if (rawEnums.length >= 100) break;
            }
            if (rawEnums.length >= 100) break;
          }

          return {
            unexpected_public_font: unexpectedFonts,
            raw_public_enum: rawEnums
          };
        });
        records.push({
          device: device.name,
          route,
          counts: {
            unexpected_public_font: result.unexpected_public_font.length,
            raw_public_enum: result.raw_public_enum.length
          },
          findings: result
        });
      } catch (error) {
        navigationFailures.push({ device: device.name, route, error: error instanceof Error ? error.message : String(error) });
      }
    }
    await page.close();
  };

  await Promise.all(Array.from({ length: Math.min(concurrency, routes.length) }, () => worker()));
  await context.close();
}

await browser.close();
records.sort((left, right) => left.device.localeCompare(right.device) || left.route.localeCompare(right.route));
const totals = {
  unexpected_public_font: records.reduce((sum, record) => sum + record.counts.unexpected_public_font, 0),
  raw_public_enum: records.reduce((sum, record) => sum + record.counts.raw_public_enum, 0)
};
const routesWithFindings = records.filter((record) => record.counts.unexpected_public_font > 0 || record.counts.raw_public_enum > 0).length;
const expectedAuditCount = routes.length * devices.length;
const result = {
  schema_version: '1.1',
  generated_at: new Date().toISOString(),
  ok: navigationFailures.length === 0
    && records.length === expectedAuditCount
    && totals.unexpected_public_font === 0
    && totals.raw_public_enum === 0,
  route_count: routes.length,
  device_count: devices.length,
  expected_audit_count: expectedAuditCount,
  audited_count: records.length,
  routes_with_findings: routesWithFindings,
  typography_roles: {
    ordinary: 'sans-serif',
    editorial_headings: 'serif',
    technical_values: 'monospace'
  },
  totals,
  navigation_failures: navigationFailures,
  records
};
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify({
  ok: result.ok,
  route_count: result.route_count,
  expected_audit_count: result.expected_audit_count,
  audited_count: result.audited_count,
  routes_with_findings: result.routes_with_findings,
  typography_roles: result.typography_roles,
  totals: result.totals,
  navigation_failure_count: result.navigation_failures.length
}, null, 2));
if (!result.ok) process.exit(1);
