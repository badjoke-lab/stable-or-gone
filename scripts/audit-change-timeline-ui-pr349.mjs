#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const baseUrl = (process.env.CAPTURE_BASE_URL ?? 'http://127.0.0.1:4173').replace(/\/$/, '');
const outputDir = path.join(root, 'artifacts/change-timeline-ui');
fs.mkdirSync(outputDir, { recursive: true });

const projection = JSON.parse(fs.readFileSync(path.join(root, 'dist/data/change-timeline.json'), 'utf8'));
const failures = [];
const results = [];
const browser = await chromium.launch();

const sourceChoice = projection.filters.source_family?.[0];
const dateKindChoice = projection.filters.date_kind?.[0];
const uniqueAssetChoice = projection.filters.asset_slug?.find((row) => row.item_count === 1) ?? null;
const nonzeroIntersection = (() => {
  for (const source of projection.filters.source_family ?? []) {
    for (const dateKind of projection.filters.date_kind ?? []) {
      const count = projection.items.filter((item) => item.source_family === source.value && item.date_kind === dateKind.value).length;
      if (count > 0 && count < projection.item_count) return { source: source.value, date_kind: dateKind.value, count };
    }
  }
  return null;
})();
const zeroIntersection = (() => {
  for (const source of projection.filters.source_family ?? []) {
    for (const dateKind of projection.filters.date_kind ?? []) {
      const count = projection.items.filter((item) => item.source_family === source.value && item.date_kind === dateKind.value).length;
      if (count === 0) return { source: source.value, date_kind: dateKind.value };
    }
  }
  return null;
})();

if (!sourceChoice) failures.push('projection has no source_family filter value');
if (!dateKindChoice) failures.push('projection has no date_kind filter value');
if (!uniqueAssetChoice) failures.push('projection has no asset_slug with exactly one timeline item for unique search audit');
if (!nonzeroIntersection) failures.push('projection has no nonzero source/date-kind intersection for audit');
if (!zeroIntersection) failures.push('projection has no zero-result source/date-kind intersection for audit');

const snapshot = async (page) => page.evaluate(() => {
  const controls = [...document.querySelectorAll('[data-timeline-search], [data-timeline-clear], [data-timeline-copy], [data-timeline-filter-id], [data-timeline-show-more]')]
    .filter((element) => {
      if (!(element instanceof HTMLElement) || element.hidden || getComputedStyle(element).display === 'none') return false;
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });
  const selects = Object.fromEntries([...document.querySelectorAll('[data-timeline-filter-id]')]
    .map((element) => [element.getAttribute('data-timeline-filter-id'), element instanceof HTMLSelectElement ? element.value : '']));
  return {
    url: window.location.pathname + window.location.search,
    result_count: Number(document.querySelector('[data-timeline-result-count]')?.textContent ?? 0),
    rendered_item_count: document.querySelectorAll('.timeline-item').length,
    badge_count: document.querySelectorAll('.timeline-badge').length,
    empty_hidden: document.querySelector('[data-timeline-empty]')?.hasAttribute('hidden') ?? false,
    results_hidden: document.querySelector('[data-timeline-results]')?.hasAttribute('hidden') ?? true,
    show_more_hidden: document.querySelector('[data-timeline-show-more-row]')?.hasAttribute('hidden') ?? true,
    active_filter_text: document.querySelector('[data-timeline-active-filters]')?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
    page_horizontal_overflow_px: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
    min_control_height: controls.length ? Math.min(...controls.map((element) => Math.round(element.getBoundingClientRect().height))) : 0,
    search_value: document.querySelector('[data-timeline-search]') instanceof HTMLInputElement ? document.querySelector('[data-timeline-search]').value : '',
    selects
  };
});

async function waitForTimeline(page) {
  await page.waitForSelector('[data-timeline-filter-id="source_family"]', { timeout: 60000 });
  await page.waitForFunction(() => document.querySelectorAll('.timeline-item').length > 0, null, { timeout: 60000 });
}

const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const desktop = await desktopContext.newPage();
let response = await desktop.goto(`${baseUrl}/timeline/`, { waitUntil: 'networkidle', timeout: 90000 });
if (!response || !response.ok()) failures.push(`desktop: timeline route returned ${response?.status() ?? 'no response'}`);
await waitForTimeline(desktop);

const initial = await snapshot(desktop);
results.push({ step: 'desktop_initial', ...initial });
const expectedInitialRendered = Math.min(40, projection.item_count);
if (initial.result_count !== projection.item_count) failures.push(`desktop initial: expected ${projection.item_count} results, found ${initial.result_count}`);
if (initial.rendered_item_count !== expectedInitialRendered) failures.push(`desktop initial: expected ${expectedInitialRendered} rendered items, found ${initial.rendered_item_count}`);
if (initial.badge_count !== initial.rendered_item_count * 3) failures.push(`desktop initial: expected ${initial.rendered_item_count * 3} semantic badges, found ${initial.badge_count}`);
if (projection.item_count > 40 && initial.show_more_hidden) failures.push('desktop initial: Show more must be visible when item_count > 40');
if (initial.page_horizontal_overflow_px > 2) failures.push(`desktop initial: page overflow ${initial.page_horizontal_overflow_px}px`);
if (initial.min_control_height < 44) failures.push(`desktop initial: minimum control height ${initial.min_control_height}px`);

if (sourceChoice) {
  await desktop.selectOption('[data-timeline-filter-id="source_family"]', sourceChoice.value);
  await desktop.waitForFunction((expected) => document.querySelector('[data-timeline-result-count]')?.textContent === String(expected), sourceChoice.item_count);
  const sourceFiltered = await snapshot(desktop);
  results.push({ step: 'desktop_source_filter', expected_source: sourceChoice.value, ...sourceFiltered });
  if (sourceFiltered.result_count !== sourceChoice.item_count) failures.push(`desktop source filter: expected ${sourceChoice.item_count}, found ${sourceFiltered.result_count}`);
  if (!sourceFiltered.url.includes(`source=${encodeURIComponent(sourceChoice.value)}`)) failures.push(`desktop source filter: URL state missing ${sourceFiltered.url}`);
  await desktop.screenshot({ path: path.join(outputDir, 'desktop-source-filter.png'), fullPage: true });
}

if (nonzeroIntersection) {
  await desktop.click('[data-timeline-clear]');
  await desktop.selectOption('[data-timeline-filter-id="source_family"]', nonzeroIntersection.source);
  await desktop.selectOption('[data-timeline-filter-id="date_kind"]', nonzeroIntersection.date_kind);
  await desktop.waitForFunction((expected) => document.querySelector('[data-timeline-result-count]')?.textContent === String(expected), nonzeroIntersection.count);
  const intersection = await snapshot(desktop);
  results.push({ step: 'desktop_nonzero_intersection', expected: nonzeroIntersection, ...intersection });
  if (intersection.result_count !== nonzeroIntersection.count) failures.push(`desktop intersection: expected ${nonzeroIntersection.count}, found ${intersection.result_count}`);
}

if (zeroIntersection) {
  await desktop.click('[data-timeline-clear]');
  await desktop.selectOption('[data-timeline-filter-id="source_family"]', zeroIntersection.source);
  await desktop.selectOption('[data-timeline-filter-id="date_kind"]', zeroIntersection.date_kind);
  await desktop.waitForFunction(() => document.querySelector('[data-timeline-result-count]')?.textContent === '0');
  const zero = await snapshot(desktop);
  results.push({ step: 'desktop_zero_intersection', expected: zeroIntersection, ...zero });
  if (zero.result_count !== 0) failures.push(`desktop zero intersection: expected 0, found ${zero.result_count}`);
  if (!zero.results_hidden || zero.empty_hidden) failures.push('desktop zero intersection: empty/results visibility contract failed');
}

if (uniqueAssetChoice) {
  await desktop.click('[data-timeline-clear]');
  await desktop.fill('[data-timeline-search]', uniqueAssetChoice.value);
  await desktop.waitForTimeout(250);
  await desktop.waitForFunction(() => document.querySelector('[data-timeline-result-count]')?.textContent === '1');
  const search = await snapshot(desktop);
  results.push({ step: 'desktop_unique_asset_search', query: uniqueAssetChoice.value, ...search });
  if (search.result_count !== 1 || search.rendered_item_count !== 1) failures.push(`desktop unique search: expected 1 result/item, found ${search.result_count}/${search.rendered_item_count}`);
  if (!search.url.includes(`q=${encodeURIComponent(uniqueAssetChoice.value)}`)) failures.push(`desktop unique search: URL state missing ${search.url}`);
}

await desktop.click('[data-timeline-clear]');
await desktop.waitForFunction((expected) => document.querySelector('[data-timeline-result-count]')?.textContent === String(expected), projection.item_count);
if (projection.item_count > 40) {
  await desktop.click('[data-timeline-show-more]');
  const expectedAfterMore = Math.min(60, projection.item_count);
  await desktop.waitForFunction((expected) => document.querySelectorAll('.timeline-item').length === expected, expectedAfterMore);
  const showMore = await snapshot(desktop);
  results.push({ step: 'desktop_show_more', ...showMore });
  if (showMore.rendered_item_count !== expectedAfterMore) failures.push(`desktop show more: expected ${expectedAfterMore}, found ${showMore.rendered_item_count}`);
}
await desktopContext.close();

const mobileContext = await browser.newContext({ viewport: { width: 393, height: 852 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
const mobile = await mobileContext.newPage();
if (uniqueAssetChoice) {
  response = await mobile.goto(`${baseUrl}/timeline/?asset=${encodeURIComponent(uniqueAssetChoice.value)}`, { waitUntil: 'networkidle', timeout: 90000 });
  if (!response || !response.ok()) failures.push(`mobile: timeline route returned ${response?.status() ?? 'no response'}`);
  await waitForTimeline(mobile);
  await mobile.waitForFunction(() => document.querySelector('[data-timeline-result-count]')?.textContent === '1');
  const mobileAsset = await snapshot(mobile);
  results.push({ step: 'mobile_asset_restore', asset: uniqueAssetChoice.value, ...mobileAsset });
  if (mobileAsset.result_count !== 1 || mobileAsset.rendered_item_count !== 1) failures.push(`mobile asset restore: expected 1 result/item, found ${mobileAsset.result_count}/${mobileAsset.rendered_item_count}`);
  if (mobileAsset.selects.asset_slug !== uniqueAssetChoice.value) failures.push(`mobile asset restore: filter state mismatch ${mobileAsset.selects.asset_slug}`);
  if (mobileAsset.page_horizontal_overflow_px > 2) failures.push(`mobile asset restore: page overflow ${mobileAsset.page_horizontal_overflow_px}px`);
  if (mobileAsset.min_control_height < 44) failures.push(`mobile asset restore: minimum control height ${mobileAsset.min_control_height}px`);
  await mobile.screenshot({ path: path.join(outputDir, 'mobile-asset-filter.png'), fullPage: true });
} else {
  response = await mobile.goto(`${baseUrl}/timeline/`, { waitUntil: 'networkidle', timeout: 90000 });
  if (!response || !response.ok()) failures.push(`mobile: timeline route returned ${response?.status() ?? 'no response'}`);
  await waitForTimeline(mobile);
}
await mobileContext.close();

await browser.close();

const output = {
  schema_version: '1.0',
  audit_id: 'sog_change_timeline_ui_interaction_audit_pr349',
  route: '/timeline/',
  projection_item_count: projection.item_count,
  expected: {
    initial_result_limit: 40,
    result_limit_increment: 20,
    semantic_badges_per_item: 3,
    source_choice: sourceChoice,
    date_kind_choice: dateKindChoice,
    unique_asset_choice: uniqueAssetChoice,
    nonzero_intersection: nonzeroIntersection,
    zero_intersection: zeroIntersection,
    min_control_height: 44,
    max_page_overflow_px: 2
  },
  results,
  failures,
  ok: failures.length === 0
};
fs.writeFileSync(path.join(outputDir, 'audit.json'), `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify(output, null, 2));
if (failures.length) process.exit(1);
