#!/usr/bin/env node
import { chromium } from 'playwright';

const baseUrl = (() => {
  const index = process.argv.indexOf('--base-url');
  const value = index === -1 ? 'http://127.0.0.1:4321' : process.argv[index + 1];
  if (!value) throw new Error('--base-url requires a value');
  return value.replace(/\/$/, '');
})();

const representativeRoutes = [
  '/',
  '/stablecoins/',
  '/stablecoin/usdc/',
  '/issuers/',
  '/events/',
  '/timeline/',
  '/compare/',
  '/stats/',
  '/guides/',
  '/access-regulation/',
  '/updates/',
  '/maintenance/'
];

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 393, height: 852 }
];

const failures = [];
const noteFailure = (scope, detail) => failures.push(`${scope}: ${detail}`);
const integerFromText = (value) => {
  const match = String(value ?? '').replaceAll(',', '').match(/\d+/);
  return match ? Number.parseInt(match[0], 10) : Number.NaN;
};

const versionResponse = await fetch(`${baseUrl}/version.json`, { headers: { accept: 'application/json' } });
if (!versionResponse.ok) throw new Error(`version.json HTTP ${versionResponse.status}`);
const version = await versionResponse.json();
const canonicalCounts = version?.build?.canonical_record_counts ?? {};

const browser = await chromium.launch({ args: ['--disable-lcd-text'] });

async function inspectRoute(page, route, viewportName) {
  const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle', timeout: 60000 });
  if (!response?.ok()) {
    noteFailure(`${viewportName} ${route}`, `HTTP ${response?.status() ?? 'no response'}`);
    return;
  }

  const result = await page.evaluate(() => {
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
    const labelledByText = (element) => String(element.getAttribute('aria-labelledby') ?? '')
      .split(/\s+/)
      .filter(Boolean)
      .map((id) => document.getElementById(id)?.textContent?.trim() ?? '')
      .filter(Boolean)
      .join(' ');
    const accessibleName = (element) => {
      const aria = element.getAttribute('aria-label')?.trim();
      if (aria) return aria;
      const labelled = labelledByText(element);
      if (labelled) return labelled;
      if ('labels' in element && element.labels?.length) {
        const labelText = [...element.labels].map((label) => label.textContent?.trim() ?? '').filter(Boolean).join(' ');
        if (labelText) return labelText;
      }
      const text = element.textContent?.trim();
      if (text) return text;
      const imageAlt = element.querySelector?.('img[alt]')?.getAttribute('alt')?.trim();
      if (imageAlt) return imageAlt;
      if (element instanceof HTMLInputElement) {
        if (['button', 'submit', 'reset'].includes(element.type) && element.value.trim()) return element.value.trim();
        if (element.placeholder?.trim()) return element.placeholder.trim();
      }
      const title = element.getAttribute('title')?.trim();
      return title ?? '';
    };

    const ids = [...document.querySelectorAll('[id]')].map((element) => element.id).filter(Boolean);
    const seen = new Set();
    const duplicateIds = ids.filter((id) => seen.has(id) || !seen.add(id));
    const missingImageAlt = [...document.images]
      .filter((image) => visible(image) && !image.hasAttribute('alt'))
      .map(elementPath);
    const controls = [...document.querySelectorAll('button,input:not([type="hidden"]),select,textarea,summary,a[href]')]
      .filter((element) => element instanceof HTMLElement && visible(element) && element.getAttribute('aria-hidden') !== 'true');
    const unnamedControls = controls
      .filter((element) => !accessibleName(element))
      .map(elementPath);
    const html = document.documentElement;
    const overflowPx = Math.max(0, html.scrollWidth - html.clientWidth);

    return {
      title: document.title,
      lang: html.lang,
      mainCount: document.querySelectorAll('main').length,
      h1Count: document.querySelectorAll('h1').length,
      duplicateIds: [...new Set(duplicateIds)],
      missingImageAlt,
      unnamedControls,
      horizontalOverflowPx: overflowPx
    };
  });

  if (!result.lang) noteFailure(`${viewportName} ${route}`, 'missing html lang');
  if (result.mainCount !== 1) noteFailure(`${viewportName} ${route}`, `main count ${result.mainCount}`);
  if (result.h1Count !== 1) noteFailure(`${viewportName} ${route}`, `h1 count ${result.h1Count}`);
  if (result.duplicateIds.length) noteFailure(`${viewportName} ${route}`, `duplicate ids ${result.duplicateIds.join(', ')}`);
  if (result.missingImageAlt.length) noteFailure(`${viewportName} ${route}`, `visible images without alt ${result.missingImageAlt.join(', ')}`);
  if (result.unnamedControls.length) noteFailure(`${viewportName} ${route}`, `unnamed controls ${result.unnamedControls.join(', ')}`);
  if (result.horizontalOverflowPx > 2) noteFailure(`${viewportName} ${route}`, `horizontal overflow ${result.horizontalOverflowPx}px`);
}

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    isMobile: viewport.name === 'mobile',
    hasTouch: viewport.name === 'mobile',
    reducedMotion: 'reduce'
  });
  const page = await context.newPage();
  for (const route of representativeRoutes) await inspectRoute(page, route, viewport.name);
  await context.close();
}

const dataContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const dataPage = await dataContext.newPage();

async function readHomeCounts() {
  await dataPage.goto(`${baseUrl}/`, { waitUntil: 'networkidle', timeout: 60000 });
  return dataPage.evaluate(() => {
    const result = {};
    for (const row of document.querySelectorAll('.home-kpi-strip > div')) {
      const label = row.querySelector('dt')?.textContent?.trim();
      const value = row.querySelector('dd')?.textContent?.trim();
      if (label && value) result[label] = value;
    }
    return result;
  });
}

const homeCounts = await readHomeCounts();
const homeExpectations = {
  Stablecoins: canonicalCounts.stablecoins,
  Organizations: canonicalCounts.organizations,
  Events: canonicalCounts.events,
  Evidence: canonicalCounts.evidence
};
for (const [label, expected] of Object.entries(homeExpectations)) {
  const actual = integerFromText(homeCounts[label]);
  if (!Number.isInteger(expected)) noteFailure('data home', `version.json missing ${label} canonical count`);
  else if (actual !== expected) noteFailure('data home', `${label} UI=${actual} canonical=${expected}`);
}

const routeCountChecks = [
  ['/stablecoins/', '[data-result-count]', canonicalCounts.stablecoins, 'stablecoin register'],
  ['/issuers/', '[data-organization-result-count]', canonicalCounts.organizations, 'organization register'],
  ['/events/', '[data-event-result-count]', canonicalCounts.events, 'event register']
];
for (const [route, selector, expected, label] of routeCountChecks) {
  await dataPage.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle', timeout: 60000 });
  const text = await dataPage.locator(selector).first().textContent();
  const actual = integerFromText(text);
  if (actual !== expected) noteFailure(`data ${label}`, `UI=${actual} canonical=${expected}`);
}

await dataContext.close();
await browser.close();

if (failures.length) {
  console.error(`Gate 7 UI contract failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(JSON.stringify({
  status: 'ok',
  representative_routes: representativeRoutes.length,
  viewports: viewports.map((item) => item.name),
  data_spot_checks: {
    home: homeExpectations,
    registers: {
      stablecoins: canonicalCounts.stablecoins,
      organizations: canonicalCounts.organizations,
      events: canonicalCounts.events
    }
  }
}, null, 2));
