#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const BASE_URL = String(process.env.CAPTURE_BASE_URL ?? 'http://127.0.0.1:4173').replace(/\/$/, '');
const devices = {
  desktop: { viewport: { width: 1440, height: 900 }, isMobile: false, hasTouch: false },
  mobile: { viewport: { width: 393, height: 852 }, isMobile: true, hasTouch: true }
};

const containerSelectors = [
  '.event-index-masthead',
  '.organization-index-masthead',
  '.guide-index-masthead',
  '.editorial-page-masthead',
  '.event-index-title',
  '.organization-index-title',
  '.event-detail-title',
  '.organization-detail-title',
  '.stablecoin-dossier-title-row',
  '.event-index-section-heading',
  '.organization-index-section-heading',
  '.event-detail-section-heading',
  '.organization-detail-section-heading',
  '.stablecoin-section-heading',
  '.stablecoin-index-section-heading',
  '.timeline-section-heading',
  '.compare-section-heading',
  '.ar-section-heading',
  '.maintenance-section-heading',
  '.update-feed-section-heading',
  '.stats-section-heading',
  '.guide-index-section-heading',
  '.utility-section-heading',
  '.reference-section-heading',
  '.event-index-overline',
  '.organization-index-overline',
  '.guide-article-overline',
  '.event-detail-overline',
  '.organization-detail-overline',
  '.stablecoin-dossier-overline',
  '.guide-index-overline',
  '.editorial-page-overline',
  '.contact-actions'
];

const headingSelectors = [
  '.event-index-section-heading',
  '.organization-index-section-heading',
  '.event-detail-section-heading',
  '.organization-detail-section-heading',
  '.stablecoin-section-heading',
  '.stablecoin-index-section-heading',
  '.timeline-section-heading',
  '.compare-section-heading',
  '.ar-section-heading',
  '.maintenance-section-heading',
  '.update-feed-section-heading',
  '.stats-section-heading',
  '.guide-index-section-heading',
  '.utility-section-heading',
  '.reference-section-heading'
];

const manifests = {};
for (const device of Object.keys(devices)) {
  manifests[device] = JSON.parse(await readFile(`artifacts/screenshots/manifest.${device}.json`, 'utf8'));
}

const browser = await chromium.launch({ args: ['--disable-lcd-text'] });
const records = [];
const failures = [];

for (const [deviceName, device] of Object.entries(devices)) {
  const context = await browser.newContext({
    viewport: device.viewport,
    deviceScaleFactor: 1,
    isMobile: device.isMobile,
    hasTouch: device.hasTouch,
    reducedMotion: 'reduce'
  });
  const page = await context.newPage();
  const routes = [...new Set(manifests[deviceName].records.map((record) => record.path))];

  for (const route of routes) {
    const url = `${BASE_URL}${route}`;
    const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    if (!response?.ok()) {
      failures.push({ device: deviceName, route, type: 'navigation', detail: `HTTP ${response?.status() ?? 'no response'}` });
      continue;
    }
    await page.evaluate(() => document.fonts?.ready);

    const result = await page.evaluate(({ containerSelectors, headingSelectors, deviceName }) => {
      const visible = (element) => {
        if (!(element instanceof HTMLElement || element instanceof SVGElement)) return false;
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
      };
      const label = (element) => {
        const className = element instanceof HTMLElement || element instanceof SVGElement ? element.className : '';
        const classes = typeof className === 'string' ? className.trim().split(/\s+/).slice(0, 3).join('.') : '';
        return `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ''}${classes ? `.${classes}` : ''}`;
      };
      const intersection = (left, right) => {
        const width = Math.min(left.right, right.right) - Math.max(left.left, right.left);
        const height = Math.min(left.bottom, right.bottom) - Math.max(left.top, right.top);
        return { width, height, area: Math.max(0, width) * Math.max(0, height) };
      };
      const problems = [];

      for (const selector of containerSelectors) {
        for (const container of document.querySelectorAll(selector)) {
          if (!visible(container)) continue;
          const children = [...container.children].filter(visible);
          for (let leftIndex = 0; leftIndex < children.length; leftIndex += 1) {
            for (let rightIndex = leftIndex + 1; rightIndex < children.length; rightIndex += 1) {
              const left = children[leftIndex].getBoundingClientRect();
              const right = children[rightIndex].getBoundingClientRect();
              const overlap = intersection(left, right);
              if (overlap.width > 2 && overlap.height > 2 && overlap.area > 16) {
                problems.push({
                  type: 'overlap',
                  container: label(container),
                  left: label(children[leftIndex]),
                  right: label(children[rightIndex]),
                  overlap_width: Number(overlap.width.toFixed(2)),
                  overlap_height: Number(overlap.height.toFixed(2))
                });
              }
            }
          }
        }
      }

      for (const selector of headingSelectors) {
        for (const container of document.querySelectorAll(selector)) {
          if (!visible(container)) continue;
          const heading = container.querySelector('h2');
          if (!(heading instanceof HTMLElement) || !visible(heading)) continue;
          const containerRect = container.getBoundingClientRect();
          const headingRect = heading.getBoundingClientRect();
          const offset = headingRect.left - containerRect.left;
          if (offset > Math.max(28, containerRect.width * 0.14)) {
            problems.push({
              type: 'heading-shifted-right',
              container: label(container),
              heading: heading.textContent?.trim().replace(/\s+/g, ' ').slice(0, 120),
              offset: Number(offset.toFixed(2)),
              container_width: Number(containerRect.width.toFixed(2))
            });
          }
        }
      }

      const renderedLineRects = (element) => {
        const range = document.createRange();
        range.selectNodeContents(element);
        return [...range.getClientRects()].filter((rect) => rect.width > 0 && rect.height > 0);
      };

      for (const element of document.querySelectorAll([
        '.event-index-overline > span',
        '.organization-index-overline > span',
        '.event-detail-overline > span',
        '.organization-detail-overline > span',
        '.stablecoin-dossier-overline > span',
        '.guide-article-overline > span',
        '.guide-index-overline > span',
        '.editorial-page-overline > span',
        '.contact-actions h2'
      ].join(', '))) {
        if (!(element instanceof HTMLElement) || !visible(element)) continue;
        const text = element.textContent?.trim().replace(/\s+/g, ' ') ?? '';
        if (text.length < 7) continue;
        const rect = element.getBoundingClientRect();
        const fontSize = Number.parseFloat(getComputedStyle(element).fontSize) || 13;
        const lineRects = renderedLineRects(element);
        const maxLineWidth = lineRects.length ? Math.max(...lineRects.map((line) => line.width)) : rect.width;
        if (lineRects.length >= 3 && rect.width < fontSize * 5 && maxLineWidth < fontSize * 5) {
          problems.push({
            type: 'fragmented-ordinary-label',
            element: label(element),
            text: text.slice(0, 120),
            width: Number(rect.width.toFixed(2)),
            font_size: Number(fontSize.toFixed(2)),
            rendered_lines: lineRects.length,
            maximum_line_width: Number(maxLineWidth.toFixed(2))
          });
        }
      }

      for (const heading of document.querySelectorAll('main h1, main h2, main h3')) {
        if (!(heading instanceof HTMLElement) || !visible(heading)) continue;
        const text = heading.textContent?.trim().replace(/\s+/g, ' ') ?? '';
        if (text.length < 12 || !text.includes(' ')) continue;
        const lineRects = renderedLineRects(heading);
        const fontSize = Number.parseFloat(getComputedStyle(heading).fontSize) || 16;
        const maxLineWidth = lineRects.length ? Math.max(...lineRects.map((rect) => rect.width)) : heading.getBoundingClientRect().width;
        const width = heading.getBoundingClientRect().width;
        if (lineRects.length >= 4 && width < fontSize * 5 && maxLineWidth < fontSize * 5) {
          problems.push({
            type: 'fragmented-heading',
            element: label(heading),
            text: text.slice(0, 120),
            width: Number(width.toFixed(2)),
            font_size: Number(fontSize.toFixed(2)),
            rendered_lines: lineRects.length,
            maximum_line_width: Number(maxLineWidth.toFixed(2))
          });
        }
      }

      if (location.pathname === '/contact/' && deviceName === 'mobile') {
        const actions = document.querySelector('.contact-actions');
        if (actions instanceof HTMLElement && visible(actions)) {
          const containerWidth = actions.getBoundingClientRect().width;
          for (const action of actions.querySelectorAll(':scope > a')) {
            if (!(action instanceof HTMLElement) || !visible(action)) continue;
            const width = action.getBoundingClientRect().width;
            if (width < containerWidth * 0.85) {
              problems.push({ type: 'collapsed-contact-action', text: action.textContent?.trim().replace(/\s+/g, ' ').slice(0, 120), width: Number(width.toFixed(2)), container_width: Number(containerWidth.toFixed(2)) });
            }
          }
        }
      }

      if (location.pathname === '/guides/' && deviceName === 'mobile') {
        const table = document.querySelector('.guide-index-table');
        const mobile = document.querySelector('.guide-index-mobile');
        if (table && visible(table)) problems.push({ type: 'desktop-guide-table-visible-on-mobile' });
        if (!mobile || !visible(mobile)) problems.push({ type: 'mobile-guide-cards-hidden' });
      }

      return { problems };
    }, { containerSelectors, headingSelectors, deviceName });

    records.push({ device: deviceName, route, problems: result.problems });
    failures.push(...result.problems.map((problem) => ({ device: deviceName, route, ...problem })));
  }
  await context.close();
}

await browser.close();
const report = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  audited_routes: records.length,
  desktop_routes: manifests.desktop.records.length,
  mobile_routes: manifests.mobile.records.length,
  failure_count: failures.length,
  records,
  failures
};
await writeFile('artifacts/screenshots/layout-geometry-audit.json', `${JSON.stringify(report, null, 2)}\n`);

if (failures.length) {
  console.error(JSON.stringify(report, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ audited_routes: report.audited_routes, failure_count: 0 }, null, 2));
