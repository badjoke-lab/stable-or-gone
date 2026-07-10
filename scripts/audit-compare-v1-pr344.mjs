#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const baseUrl = (process.env.CAPTURE_BASE_URL ?? 'http://127.0.0.1:4173').replace(/\/$/, '');
const outputDir = path.join(root, 'artifacts/compare-v1');
const devices = {
  desktop: { width: 1440, height: 900, isMobile: false, hasTouch: false },
  mobile: { width: 393, height: 852, isMobile: true, hasTouch: true }
};

fs.mkdirSync(outputDir, { recursive: true });
const browser = await chromium.launch();
const results = [];
const failures = [];

for (const [device, settings] of Object.entries(devices)) {
  const context = await browser.newContext({
    viewport: { width: settings.width, height: settings.height },
    deviceScaleFactor: 1,
    isMobile: settings.isMobile,
    hasTouch: settings.hasTouch,
    reducedMotion: 'reduce'
  });
  const page = await context.newPage();
  const response = await page.goto(`${baseUrl}/compare/?assets=usdt,usdc,rlusd`, { waitUntil: 'networkidle', timeout: 90000 });
  if (!response || !response.ok()) {
    failures.push(`${device}: compare route returned ${response?.status() ?? 'no response'}`);
    await context.close();
    continue;
  }

  await page.waitForSelector('[data-compare-output]:not([hidden])', { timeout: 60000 });
  const result = await page.evaluate(() => {
    const selected = [...document.querySelectorAll('[data-compare-slot]')]
      .map((element) => element instanceof HTMLSelectElement ? element.value : '')
      .filter(Boolean);
    const minControlHeight = Math.min(...[...document.querySelectorAll('[data-compare-slot], [data-compare-clear], [data-compare-copy]')]
      .filter((element) => element instanceof HTMLElement)
      .map((element) => Math.round(element.getBoundingClientRect().height)));
    return {
      selected,
      group_count: document.querySelectorAll('[data-compare-group]').length,
      facet_row_count: document.querySelectorAll('[data-dimension-id]').length,
      value_cell_count: document.querySelectorAll('.compare-value-cell').length,
      readiness_badge_count: document.querySelectorAll('.compare-badge--readiness').length,
      freshness_badge_count: document.querySelectorAll('.compare-badge--freshness').length,
      h1_count: document.querySelectorAll('h1').length,
      page_horizontal_overflow_px: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
      min_control_height: minControlHeight,
      url_assets: new URL(window.location.href).searchParams.get('assets'),
      status_text: document.querySelector('[data-compare-status]')?.textContent?.trim() ?? '',
      alert_text: document.querySelector('[data-compare-alert]')?.textContent?.trim() ?? ''
    };
  });

  if (JSON.stringify(result.selected) !== JSON.stringify(['usdt', 'usdc', 'rlusd'])) failures.push(`${device}: URL selection did not restore usdt,usdc,rlusd`);
  if (result.group_count !== 4) failures.push(`${device}: expected 4 facet groups, found ${result.group_count}`);
  if (result.facet_row_count !== 19) failures.push(`${device}: expected 19 facet rows, found ${result.facet_row_count}`);
  if (result.value_cell_count !== 57) failures.push(`${device}: expected 57 value cells for 3 assets, found ${result.value_cell_count}`);
  if (result.readiness_badge_count !== 57) failures.push(`${device}: expected 57 readiness badges, found ${result.readiness_badge_count}`);
  if (result.freshness_badge_count !== 57) failures.push(`${device}: expected 57 freshness badges, found ${result.freshness_badge_count}`);
  if (result.h1_count !== 1) failures.push(`${device}: expected exactly one h1, found ${result.h1_count}`);
  if (result.page_horizontal_overflow_px > 2) failures.push(`${device}: page horizontal overflow ${result.page_horizontal_overflow_px}px`);
  if (result.min_control_height < 44) failures.push(`${device}: minimum control height ${result.min_control_height}px is below 44px`);
  if (result.url_assets !== 'usdt,usdc,rlusd') failures.push(`${device}: URL state mismatch ${result.url_assets}`);
  if (!result.status_text.includes('3 stablecoin records selected')) failures.push(`${device}: selection status does not report 3 records`);

  await page.screenshot({ path: path.join(outputDir, `${device}.png`), fullPage: true });
  results.push({ device, viewport: { width: settings.width, height: settings.height }, ...result });

  if (device === 'desktop') {
    await page.goto(`${baseUrl}/compare/?assets=usdt,usdc,rlusd,dai,usdd`, { waitUntil: 'networkidle', timeout: 90000 });
    await page.waitForSelector('[data-compare-output]:not([hidden])', { timeout: 60000 });
    const bounded = await page.evaluate(() => ({
      selected: [...document.querySelectorAll('[data-compare-slot]')]
        .map((element) => element instanceof HTMLSelectElement ? element.value : '')
        .filter(Boolean),
      url_assets: new URL(window.location.href).searchParams.get('assets')
    }));
    if (bounded.selected.length !== 4) failures.push(`desktop: five-item URL must be bounded to 4 assets, found ${bounded.selected.length}`);
    if (bounded.url_assets?.split(',').length !== 4) failures.push(`desktop: normalized URL must contain 4 assets, found ${bounded.url_assets}`);

    const duplicateResult = await page.evaluate(() => {
      const slots = [...document.querySelectorAll('[data-compare-slot]')].filter((element) => element instanceof HTMLSelectElement);
      const first = slots[0];
      const fourth = slots[3];
      if (!(first instanceof HTMLSelectElement) || !(fourth instanceof HTMLSelectElement)) return null;
      fourth.value = first.value;
      fourth.dispatchEvent(new Event('change', { bubbles: true }));
      return {
        fourth_value: fourth.value,
        alert_text: document.querySelector('[data-compare-alert]')?.textContent?.trim() ?? ''
      };
    });
    if (!duplicateResult || duplicateResult.fourth_value !== '') failures.push('desktop: duplicate selection was not cleared');
    if (!duplicateResult?.alert_text.includes('duplicate selection was cleared')) failures.push('desktop: duplicate selection alert missing');
  }

  await context.close();
}

await browser.close();
const output = {
  schema_version: '1.0',
  audit_id: 'sog_compare_v1_interaction_audit_pr344',
  route: '/compare/',
  representative_assets: ['usdt', 'usdc', 'rlusd'],
  expected: { groups: 4, facets: 19, selected_assets: 3, cells: 57, max_assets: 4, min_control_height: 44, max_page_overflow_px: 2 },
  results,
  failures,
  ok: failures.length === 0
};
fs.writeFileSync(path.join(outputDir, 'audit.json'), `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify(output, null, 2));
if (failures.length) process.exit(1);
