#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const baseUrl = (process.env.CAPTURE_BASE_URL ?? 'http://127.0.0.1:4173').replace(/\/$/, '');
const outputDir = path.join(root, 'artifacts/update-feed');
fs.mkdirSync(outputDir, { recursive: true });

const feed = JSON.parse(fs.readFileSync(path.join(root, 'dist/data/update-feed.json'), 'utf8'));
const failures = [];
const results = [];
const browser = await chromium.launch();

const categoryChoice = feed.filters.category?.[0] ?? null;
const routeFamilyChoice = feed.filters.route_family?.find((row) => row.item_count > 0 && row.item_count < feed.item_count) ?? feed.filters.route_family?.[0] ?? null;
const pathCounts = new Map();
for (const entry of feed.entries) for (const pathname of entry.related_paths) pathCounts.set(pathname, (pathCounts.get(pathname) ?? 0) + 1);
const uniquePathChoice = [...pathCounts.entries()].find(([, count]) => count === 1)?.[0] ?? null;
const nonzeroIntersection = (() => {
  for (const category of feed.filters.category ?? []) {
    for (const routeFamily of feed.filters.route_family ?? []) {
      const count = feed.entries.filter((entry) => entry.category === category.value && entry.route_families.includes(routeFamily.value)).length;
      if (count > 0 && count < feed.item_count) return { category: category.value, route_family: routeFamily.value, count };
    }
  }
  return null;
})();
const zeroIntersection = (() => {
  for (const category of feed.filters.category ?? []) {
    for (const routeFamily of feed.filters.route_family ?? []) {
      const count = feed.entries.filter((entry) => entry.category === category.value && entry.route_families.includes(routeFamily.value)).length;
      if (count === 0) return { category: category.value, route_family: routeFamily.value };
    }
  }
  return null;
})();

if (!categoryChoice) failures.push('feed has no category filter value');
if (!routeFamilyChoice) failures.push('feed has no route-family filter value');
if (!uniquePathChoice) failures.push('feed has no unique related path for search audit');
if (!nonzeroIntersection) failures.push('feed has no nonzero category/route-family intersection');
if (!zeroIntersection) failures.push('feed has no zero category/route-family intersection');

const snapshot = async (page) => page.evaluate(() => {
  const controls = [...document.querySelectorAll('[data-update-feed-search], [data-update-feed-clear], [data-update-feed-copy], [data-update-feed-filter-id], [data-update-feed-show-more]')]
    .filter((element) => {
      if (!(element instanceof HTMLElement) || element.hidden || getComputedStyle(element).display === 'none') return false;
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });
  const selects = Object.fromEntries([...document.querySelectorAll('[data-update-feed-filter-id]')]
    .map((element) => [element.getAttribute('data-update-feed-filter-id'), element instanceof HTMLSelectElement ? element.value : '']));
  return {
    url: window.location.pathname + window.location.search,
    result_count: Number(document.querySelector('[data-update-feed-result-count]')?.textContent ?? 0),
    rendered_item_count: [...document.querySelectorAll('.update-feed-item')].filter((element) => element instanceof HTMLElement && !element.hidden).length,
    total_dom_item_count: document.querySelectorAll('.update-feed-item').length,
    empty_hidden: document.querySelector('[data-update-feed-empty]')?.hasAttribute('hidden') ?? false,
    results_hidden: document.querySelector('[data-update-feed-results]')?.hasAttribute('hidden') ?? true,
    show_more_hidden: document.querySelector('[data-update-feed-show-more-row]')?.hasAttribute('hidden') ?? true,
    page_horizontal_overflow_px: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
    min_control_height: controls.length ? Math.min(...controls.map((element) => Math.round(element.getBoundingClientRect().height))) : 0,
    search_value: document.querySelector('[data-update-feed-search]') instanceof HTMLInputElement ? document.querySelector('[data-update-feed-search]').value : '',
    selects
  };
});

async function waitForFeed(page) {
  await page.waitForSelector('[data-update-feed-filter-id="category"]', { timeout: 60000 });
  await page.waitForFunction(() => Number(document.querySelector('[data-update-feed-result-count]')?.textContent ?? 0) > 0, null, { timeout: 60000 });
}

const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const desktop = await desktopContext.newPage();
let response = await desktop.goto(`${baseUrl}/updates/`, { waitUntil: 'networkidle', timeout: 90000 });
if (!response || !response.ok()) failures.push(`desktop: Update Feed route returned ${response?.status() ?? 'no response'}`);
await waitForFeed(desktop);

const initial = await snapshot(desktop);
results.push({ step: 'desktop_initial', ...initial });
const expectedInitial = Math.min(20, feed.item_count);
if (initial.result_count !== feed.item_count) failures.push(`desktop initial: expected ${feed.item_count}, found ${initial.result_count}`);
if (initial.rendered_item_count !== expectedInitial) failures.push(`desktop initial: expected ${expectedInitial} visible items, found ${initial.rendered_item_count}`);
if (initial.total_dom_item_count !== feed.item_count) failures.push(`desktop initial: expected ${feed.item_count} DOM items, found ${initial.total_dom_item_count}`);
if (feed.item_count <= 20 && !initial.show_more_hidden) failures.push('desktop initial: Show more must be hidden while feed fits initial limit');
if (initial.page_horizontal_overflow_px > 2) failures.push(`desktop initial: page overflow ${initial.page_horizontal_overflow_px}px`);
if (initial.min_control_height < 44) failures.push(`desktop initial: minimum control height ${initial.min_control_height}px`);

if (categoryChoice) {
  await desktop.selectOption('[data-update-feed-filter-id="category"]', categoryChoice.value);
  await desktop.waitForFunction((expected) => document.querySelector('[data-update-feed-result-count]')?.textContent === String(expected), categoryChoice.item_count);
  const category = await snapshot(desktop);
  results.push({ step: 'desktop_category_filter', expected_category: categoryChoice, ...category });
  if (category.result_count !== categoryChoice.item_count) failures.push(`desktop category filter: expected ${categoryChoice.item_count}, found ${category.result_count}`);
  if (!category.url.includes(`category=${encodeURIComponent(categoryChoice.value)}`)) failures.push(`desktop category filter URL missing: ${category.url}`);
  await desktop.screenshot({ path: path.join(outputDir, 'desktop-category-filter.png'), fullPage: true });
}

if (routeFamilyChoice) {
  await desktop.click('[data-update-feed-clear]');
  await desktop.selectOption('[data-update-feed-filter-id="route_family"]', routeFamilyChoice.value);
  await desktop.waitForFunction((expected) => document.querySelector('[data-update-feed-result-count]')?.textContent === String(expected), routeFamilyChoice.item_count);
  const routeFamily = await snapshot(desktop);
  results.push({ step: 'desktop_route_family_filter', expected_route_family: routeFamilyChoice, ...routeFamily });
  if (routeFamily.result_count !== routeFamilyChoice.item_count) failures.push(`desktop route-family filter: expected ${routeFamilyChoice.item_count}, found ${routeFamily.result_count}`);
}

if (nonzeroIntersection) {
  await desktop.click('[data-update-feed-clear]');
  await desktop.selectOption('[data-update-feed-filter-id="category"]', nonzeroIntersection.category);
  await desktop.selectOption('[data-update-feed-filter-id="route_family"]', nonzeroIntersection.route_family);
  await desktop.waitForFunction((expected) => document.querySelector('[data-update-feed-result-count]')?.textContent === String(expected), nonzeroIntersection.count);
  const intersection = await snapshot(desktop);
  results.push({ step: 'desktop_nonzero_intersection', expected: nonzeroIntersection, ...intersection });
  if (intersection.result_count !== nonzeroIntersection.count) failures.push(`desktop nonzero intersection: expected ${nonzeroIntersection.count}, found ${intersection.result_count}`);
}

if (zeroIntersection) {
  await desktop.click('[data-update-feed-clear]');
  await desktop.selectOption('[data-update-feed-filter-id="category"]', zeroIntersection.category);
  await desktop.selectOption('[data-update-feed-filter-id="route_family"]', zeroIntersection.route_family);
  await desktop.waitForFunction(() => document.querySelector('[data-update-feed-result-count]')?.textContent === '0');
  const zero = await snapshot(desktop);
  results.push({ step: 'desktop_zero_intersection', expected: zeroIntersection, ...zero });
  if (zero.result_count !== 0) failures.push(`desktop zero intersection: expected 0, found ${zero.result_count}`);
  if (!zero.results_hidden || zero.empty_hidden) failures.push('desktop zero intersection: empty/results visibility contract failed');
}

if (uniquePathChoice) {
  await desktop.click('[data-update-feed-clear]');
  await desktop.fill('[data-update-feed-search]', uniquePathChoice);
  await desktop.waitForTimeout(250);
  await desktop.waitForFunction(() => document.querySelector('[data-update-feed-result-count]')?.textContent === '1');
  const search = await snapshot(desktop);
  results.push({ step: 'desktop_unique_path_search', query: uniquePathChoice, ...search });
  if (search.result_count !== 1 || search.rendered_item_count !== 1) failures.push(`desktop unique path search: expected 1 result/item, found ${search.result_count}/${search.rendered_item_count}`);
  if (!search.url.includes(`q=${encodeURIComponent(uniquePathChoice)}`)) failures.push(`desktop unique path search URL missing: ${search.url}`);
}

await desktopContext.close();

const mobileContext = await browser.newContext({ viewport: { width: 393, height: 852 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
const mobile = await mobileContext.newPage();
if (categoryChoice) {
  response = await mobile.goto(`${baseUrl}/updates/?category=${encodeURIComponent(categoryChoice.value)}`, { waitUntil: 'networkidle', timeout: 90000 });
  if (!response || !response.ok()) failures.push(`mobile: Update Feed route returned ${response?.status() ?? 'no response'}`);
  await waitForFeed(mobile);
  await mobile.waitForFunction((expected) => document.querySelector('[data-update-feed-result-count]')?.textContent === String(expected), categoryChoice.item_count);
  const mobileCategory = await snapshot(mobile);
  results.push({ step: 'mobile_category_restore', expected_category: categoryChoice, ...mobileCategory });
  if (mobileCategory.result_count !== categoryChoice.item_count) failures.push(`mobile category restore: expected ${categoryChoice.item_count}, found ${mobileCategory.result_count}`);
  if (mobileCategory.selects.category !== categoryChoice.value) failures.push(`mobile category restore state mismatch: ${mobileCategory.selects.category}`);
  if (mobileCategory.page_horizontal_overflow_px > 2) failures.push(`mobile category restore: page overflow ${mobileCategory.page_horizontal_overflow_px}px`);
  if (mobileCategory.min_control_height < 44) failures.push(`mobile category restore: minimum control height ${mobileCategory.min_control_height}px`);
  await mobile.screenshot({ path: path.join(outputDir, 'mobile-category-filter.png'), fullPage: true });
}
await mobileContext.close();

await browser.close();

const output = {
  schema_version: '1.0',
  audit_id: 'sog_update_feed_interaction_audit_pr350',
  route: '/updates/',
  feed_item_count: feed.item_count,
  expected: {
    initial_result_limit: 20,
    result_limit_increment: 20,
    category_choice: categoryChoice,
    route_family_choice: routeFamilyChoice,
    unique_path_choice: uniquePathChoice,
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
