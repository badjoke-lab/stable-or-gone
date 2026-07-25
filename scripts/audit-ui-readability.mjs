#!/usr/bin/env node
import fs from 'node:fs';
import { chromium } from 'playwright';

const device = process.argv.includes('--mobile') ? 'mobile' : 'desktop';
const manifestPath = `artifacts/screenshots/manifest.${device}.json`;
const outputPath = `artifacts/screenshots/readability-audit.${device}.json`;
const baseUrl = (process.env.CAPTURE_BASE_URL ?? process.env.SOG_SCREENSHOT_BASE_URL ?? 'http://127.0.0.1:4173').replace(/\/$/, '');
const viewport = device === 'mobile' ? { width: 393, height: 852 } : { width: 1440, height: 900 };

if (!fs.existsSync(manifestPath)) throw new Error(`Missing ${manifestPath}`);
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const routes = manifest.records.map((record) => record.path);
const browser = await chromium.launch({ args: ['--disable-lcd-text'] });
const context = await browser.newContext({
  viewport,
  reducedMotion: 'reduce',
  isMobile: device === 'mobile',
  hasTouch: device === 'mobile'
});
const page = await context.newPage();
const records = [];
const failures = [];

for (const route of routes) {
  try {
    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle', timeout: 60000 });
    if (!response?.ok()) throw new Error(`HTTP ${response?.status() ?? 'no response'}`);
    await page.evaluate(() => document.fonts?.ready);
    const result = await page.evaluate(({ deviceName }) => {
      const mobile = deviceName === 'mobile';
      const thresholds = mobile
        ? { ordinary: 16, compact: 15, interactive: 15, metadata: 12, h1: 44, h1Home: 60, h2: 36 }
        : { ordinary: 15, compact: 14, interactive: 14, metadata: 12, h1: 72, h1Home: 80, h2: 42 };
      const visible = (element) => {
        if (!(element instanceof HTMLElement)) return false;
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0 && rect.width > 0 && rect.height > 0;
      };
      const directText = (element) => {
        if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
          return element.value || element.getAttribute('placeholder') || element.getAttribute('aria-label') || '';
        }
        return [...element.childNodes]
          .filter((node) => node.nodeType === Node.TEXT_NODE)
          .map((node) => node.textContent ?? '')
          .join(' ')
          .trim()
          .replace(/\s+/g, ' ');
      };
      const pathFor = (element) => {
        const parts = [];
        let current = element;
        while (current instanceof HTMLElement && parts.length < 5) {
          let part = current.tagName.toLowerCase();
          if (current.id) part += `#${current.id}`;
          else if (current.classList.length) part += `.${[...current.classList].slice(0, 3).join('.')}`;
          parts.unshift(part);
          current = current.parentElement;
        }
        return parts.join(' > ');
      };
      const number = (value) => Number.parseFloat(String(value)) || 0;
      const lineRatio = (style) => {
        const size = number(style.fontSize);
        const height = style.lineHeight === 'normal' ? size * 1.2 : number(style.lineHeight);
        return size > 0 ? height / size : 0;
      };
      const sample = (element, role) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return {
          role,
          element: pathFor(element),
          text: (directText(element) || element.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 140),
          font_family: style.fontFamily,
          font_size_px: Number(number(style.fontSize).toFixed(2)),
          line_height_ratio: Number(lineRatio(style).toFixed(2)),
          width_px: Math.round(rect.width),
          height_px: Math.round(rect.height),
          color: style.color
        };
      };
      const overlap = (left, right) => {
        const width = Math.min(left.right, right.right) - Math.max(left.left, right.left);
        const height = Math.min(left.bottom, right.bottom) - Math.max(left.top, right.top);
        return {
          width,
          height,
          area: Math.max(0, width) * Math.max(0, height)
        };
      };
      const findings = {
        undersized_ordinary_text: [],
        undersized_compact_text: [],
        undersized_interactive_text: [],
        undersized_metadata: [],
        compressed_line_height: [],
        oversized_headings: [],
        excessive_heading_height: [],
        overlapping_section_heading_content: [],
        ambiguous_internal_accent_links: [],
        undersized_mobile_targets: [],
        unexpected_public_font: [],
        raw_public_enum: []
      };
      const push = (category, value) => {
        if (findings[category].length < 250) findings[category].push(value);
      };

      const ordinary = [...document.querySelectorAll('main p, main li, main blockquote')].filter(visible);
      for (const element of ordinary) {
        if (!directText(element) && element.children.length > 0) continue;
        if (element.closest('[class*="overline"], [class*="meta"], .kicker, .eyebrow, [aria-hidden="true"]')) continue;
        const entry = sample(element, 'ordinary');
        if (entry.font_size_px < thresholds.ordinary) push('undersized_ordinary_text', entry);
        if (entry.line_height_ratio < 1.45) push('compressed_line_height', entry);
      }

      const compact = [...document.querySelectorAll('main dd, main td, main figcaption')].filter(visible);
      for (const element of compact) {
        if (!directText(element) && element.children.length > 0) continue;
        const entry = sample(element, 'compact');
        if (entry.font_size_px < thresholds.compact) push('undersized_compact_text', entry);
        if (entry.line_height_ratio < 1.35) push('compressed_line_height', entry);
      }

      const interactive = [...document.querySelectorAll('a, button, input, select, textarea, summary, label')].filter(visible);
      for (const element of interactive) {
        if (element instanceof HTMLLabelElement && !directText(element) && element.children.length > 0) continue;
        const entry = sample(element, 'interactive');
        if (entry.font_size_px < thresholds.interactive) push('undersized_interactive_text', entry);
      }

      const metadata = [...document.querySelectorAll('main time, main dt, main th, main small, main .kicker, main .eyebrow, main [class*="overline"], main [class*="meta"]')].filter(visible);
      for (const element of metadata) {
        if (!directText(element)) continue;
        const entry = sample(element, 'metadata');
        if (entry.font_size_px < thresholds.metadata) push('undersized_metadata', entry);
      }

      const home = location.pathname === '/';
      for (const heading of [...document.querySelectorAll('h1, h2')].filter(visible)) {
        const entry = sample(heading, heading.tagName.toLowerCase());
        const max = heading.tagName === 'H1' ? (home ? thresholds.h1Home : thresholds.h1) : thresholds.h2;
        if (entry.font_size_px > max + .1) push('oversized_headings', { ...entry, allowed_max_px: max });
        if (heading.tagName === 'H1' && entry.height_px > innerHeight * (mobile ? .42 : .48)) {
          push('excessive_heading_height', { ...entry, viewport_height_px: innerHeight });
        }
      }

      /* Font-size checks cannot detect text painted on top of adjacent text.
       * Inspect the direct children of every shared section-heading component
       * and reject any material rectangle intersection. */
      const sectionHeadingSelector = [
        '.event-detail-section-heading',
        '.organization-detail-section-heading',
        '.stablecoin-section-heading',
        '.event-index-section-heading',
        '.organization-index-section-heading',
        '.guide-index-section-heading'
      ].join(', ');
      for (const container of [...document.querySelectorAll(sectionHeadingSelector)].filter(visible)) {
        const children = [...container.children].filter(visible);
        for (let leftIndex = 0; leftIndex < children.length; leftIndex += 1) {
          for (let rightIndex = leftIndex + 1; rightIndex < children.length; rightIndex += 1) {
            const left = children[leftIndex];
            const right = children[rightIndex];
            const intersection = overlap(left.getBoundingClientRect(), right.getBoundingClientRect());
            if (intersection.width <= 2 || intersection.height <= 2 || intersection.area <= 16) continue;
            push('overlapping_section_heading_content', {
              container: pathFor(container),
              first: sample(left, 'section-heading-child'),
              second: sample(right, 'section-heading-child'),
              overlap_width_px: Math.round(intersection.width),
              overlap_height_px: Math.round(intersection.height),
              overlap_area_px: Math.round(intersection.area)
            });
          }
        }
      }

      const rootStyle = getComputedStyle(document.documentElement);
      const accent = rootStyle.getPropertyValue('--v3-accent').trim();
      const probe = document.createElement('span');
      probe.style.color = accent;
      document.body.append(probe);
      const accentRgb = getComputedStyle(probe).color;
      probe.remove();
      const semanticLinkContext = '[aria-current="page"], [class*="status"], [class*="chip"], [class*="button"], [class*="archive"], [class*="source"], [class*="evidence"], [class*="warning"], [data-tone]';
      for (const anchor of [...document.querySelectorAll('main a')].filter(visible)) {
        let url;
        try { url = new URL(anchor.href, location.href); } catch { continue; }
        if (url.origin !== location.origin) continue;
        if (anchor.matches(semanticLinkContext) || anchor.closest(semanticLinkContext)) continue;
        if (getComputedStyle(anchor).color === accentRgb) push('ambiguous_internal_accent_links', sample(anchor, 'internal-link'));
      }

      if (mobile) {
        const controls = [...document.querySelectorAll('button, input, select, textarea, summary, nav a, [class*="action"] a, a[class*="button"]')].filter(visible);
        for (const element of controls) {
          const rect = element.getBoundingClientRect();
          if (rect.height < 40) push('undersized_mobile_targets', { ...sample(element, 'mobile-target'), required_height_px: 40 });
        }
      }

      /* Ordinary public UI must use the shared sans stack. Monospace and serif
       * families are allowed only in explicitly technical surfaces. */
      const technicalSelector = 'code, pre, kbd, samp, .contract-address, .transaction-hash, [data-long-value], [data-technical-value]';
      const forbiddenFamilies = new Set([
        'ui-monospace', 'sfmono-regular', 'menlo', 'monaco', 'consolas',
        'liberation mono', 'courier', 'courier new', 'monospace',
        'georgia', 'times', 'times new roman', 'serif'
      ]);
      const publicTextSelector = 'body, header, footer, main h1, main h2, main h3, main h4, main h5, main h6, main p, main li, main dt, main dd, main th, main td, main figcaption, main small, main time, main summary, main label, main a, main button, main input, main select, main textarea, main span';
      const checkedFonts = new Set();
      for (const element of [...document.querySelectorAll(publicTextSelector)].filter(visible)) {
        if (element.matches(technicalSelector) || element.closest(technicalSelector)) continue;
        if (element.closest('[aria-hidden="true"]')) continue;
        const key = pathFor(element);
        if (checkedFonts.has(key)) continue;
        checkedFonts.add(key);
        const families = getComputedStyle(element).fontFamily
          .split(',')
          .map((family) => family.trim().replace(/^['"]|['"]$/g, '').toLowerCase());
        const forbidden = families.find((family) => forbiddenFamilies.has(family));
        if (forbidden) push('unexpected_public_font', { ...sample(element, 'public-font'), forbidden_family: forbidden });
      }

      /* Public copy must not expose internal snake_case enum tokens. Canonical
       * SOG record IDs remain permitted and technical code surfaces are skipped. */
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
          const key = `${pathFor(parent)}:${token}`;
          if (checkedEnums.has(key)) continue;
          checkedEnums.add(key);
          push('raw_public_enum', {
            element: pathFor(parent),
            token,
            text: text.replace(/\s+/g, ' ').slice(0, 180)
          });
        }
      }

      const counts = Object.fromEntries(Object.entries(findings).map(([key, values]) => [key, values.length]));
      return { thresholds, counts, findings };
    }, { deviceName: device });
    records.push({ route, ...result });
    console.log(`[readability:${device}] audited ${route}`);
  } catch (error) {
    failures.push({ route, error: error.message });
  }
}

await browser.close();
const categories = [
  'undersized_ordinary_text',
  'undersized_compact_text',
  'undersized_interactive_text',
  'undersized_metadata',
  'compressed_line_height',
  'oversized_headings',
  'excessive_heading_height',
  'overlapping_section_heading_content',
  'ambiguous_internal_accent_links',
  'undersized_mobile_targets',
  'unexpected_public_font',
  'raw_public_enum'
];
const totals = Object.fromEntries(categories.map((category) => [category, records.reduce((sum, record) => sum + Number(record.counts?.[category] ?? 0), 0)]));
const routesWithFindings = records.filter((record) => categories.some((category) => Number(record.counts?.[category] ?? 0) > 0)).length;
const output = {
  schema_version: '1.2',
  generated_at: new Date().toISOString(),
  device,
  route_count: routes.length,
  audited_count: records.length,
  failed_count: failures.length,
  routes_with_findings: routesWithFindings,
  totals,
  records,
  failures
};
fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify({ device, routes: routes.length, audited: records.length, failed: failures.length, routes_with_findings: routesWithFindings, totals }, null, 2));
if (failures.length) process.exit(1);
