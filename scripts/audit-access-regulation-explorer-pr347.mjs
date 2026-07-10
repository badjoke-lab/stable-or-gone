#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const baseUrl = (process.env.CAPTURE_BASE_URL ?? 'http://127.0.0.1:4173').replace(/\/$/, '');
const outputDir = path.join(root, 'artifacts/access-regulation-explorer');
fs.mkdirSync(outputDir, { recursive: true });

const browser = await chromium.launch();
const failures = [];
const results = [];

const snapshot = async (page) => page.evaluate(() => {
  const controls = [...document.querySelectorAll('[data-ar-search], [data-ar-clear], [data-ar-copy], [data-ar-filter-id], [data-ar-show-more]')]
    .filter((element) => element instanceof HTMLElement && !element.hidden && getComputedStyle(element).display !== 'none');
  return {
    url: window.location.pathname + window.location.search,
    result_count: Number(document.querySelector('[data-ar-result-count]')?.textContent ?? 0),
    rendered_card_count: document.querySelectorAll('.ar-result-card').length,
    empty_hidden: document.querySelector('[data-ar-empty]')?.hasAttribute('hidden') ?? false,
    results_hidden: document.querySelector('[data-ar-results]')?.hasAttribute('hidden') ?? true,
    show_more_hidden: document.querySelector('[data-ar-show-more-row]')?.hasAttribute('hidden') ?? true,
    active_filter_text: document.querySelector('[data-ar-active-filters]')?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
    page_horizontal_overflow_px: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
    min_control_height: controls.length ? Math.min(...controls.map((element) => Math.round(element.getBoundingClientRect().height))) : 0,
    legal_state: (document.querySelector('[data-ar-filter-id="legal_profile_state"]') instanceof HTMLSelectElement ? document.querySelector('[data-ar-filter-id="legal_profile_state"]').value : ''),
    regulatory_state: (document.querySelector('[data-ar-filter-id="regulatory_record_state"]') instanceof HTMLSelectElement ? document.querySelector('[data-ar-filter-id="regulatory_record_state"]').value : ''),
    regulatory_type: (document.querySelector('[data-ar-filter-id="regulatory_note_type"]') instanceof HTMLSelectElement ? document.querySelector('[data-ar-filter-id="regulatory_note_type"]').value : ''),
    access_record_state: (document.querySelector('[data-ar-filter-id="market_access_record_state"]') instanceof HTMLSelectElement ? document.querySelector('[data-ar-filter-id="market_access_record_state"]').value : ''),
    access_state_disabled: (document.querySelector('[data-ar-filter-id="market_access_state"]') instanceof HTMLSelectElement ? document.querySelector('[data-ar-filter-id="market_access_state"]').disabled : false),
    search_value: (document.querySelector('[data-ar-search]') instanceof HTMLInputElement ? document.querySelector('[data-ar-search]').value : '')
  };
});

async function waitForExplorer(page) {
  await page.waitForSelector('[data-ar-filter-id="legal_profile_state"]', { timeout: 60000 });
  await page.waitForFunction(() => document.querySelectorAll('.ar-result-card').length > 0, null, { timeout: 60000 });
}

const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const desktop = await desktopContext.newPage();
let response = await desktop.goto(`${baseUrl}/access-regulation/`, { waitUntil: 'networkidle', timeout: 90000 });
if (!response || !response.ok()) failures.push(`desktop: Explorer route returned ${response?.status() ?? 'no response'}`);
await waitForExplorer(desktop);

const initial = await snapshot(desktop);
results.push({ step: 'desktop_initial', ...initial });
if (initial.result_count !== 110) failures.push(`desktop initial: expected 110 results, found ${initial.result_count}`);
if (initial.rendered_card_count !== 50) failures.push(`desktop initial: expected 50 rendered cards, found ${initial.rendered_card_count}`);
if (initial.show_more_hidden) failures.push('desktop initial: Show more must be visible');
if (!initial.access_state_disabled) failures.push('desktop initial: Market Access state filter must be disabled while canonical axis has no values');
if (initial.page_horizontal_overflow_px > 2) failures.push(`desktop initial: page overflow ${initial.page_horizontal_overflow_px}px`);
if (initial.min_control_height < 44) failures.push(`desktop initial: minimum control height ${initial.min_control_height}px`);

await desktop.selectOption('[data-ar-filter-id="legal_profile_state"]', 'explicit_classification_present');
await desktop.waitForFunction(() => document.querySelector('[data-ar-result-count]')?.textContent === '63');
const legalExplicit = await snapshot(desktop);
results.push({ step: 'desktop_legal_explicit', ...legalExplicit });
if (legalExplicit.result_count !== 63) failures.push(`desktop legal explicit: expected 63, found ${legalExplicit.result_count}`);
if (legalExplicit.rendered_card_count !== 50) failures.push(`desktop legal explicit: expected first 50 rendered, found ${legalExplicit.rendered_card_count}`);
if (!legalExplicit.url.includes('legal_state=explicit_classification_present')) failures.push(`desktop legal explicit: URL state missing ${legalExplicit.url}`);

await desktop.click('[data-ar-clear]');
await desktop.selectOption('[data-ar-filter-id="regulatory_record_state"]', 'canonical_records_present');
await desktop.waitForFunction(() => document.querySelector('[data-ar-result-count]')?.textContent === '5');
const regulatoryPresence = await snapshot(desktop);
results.push({ step: 'desktop_regulatory_presence', ...regulatoryPresence });
if (regulatoryPresence.result_count !== 5 || regulatoryPresence.rendered_card_count !== 5) failures.push(`desktop regulatory presence: expected 5 results/cards, found ${regulatoryPresence.result_count}/${regulatoryPresence.rendered_card_count}`);
if (!regulatoryPresence.url.includes('reg_state=canonical_records_present')) failures.push(`desktop regulatory presence: URL state missing ${regulatoryPresence.url}`);
await desktop.screenshot({ path: path.join(outputDir, 'desktop-regulatory-presence.png'), fullPage: true });

await desktop.click('[data-ar-clear]');
await desktop.selectOption('[data-ar-filter-id="regulatory_note_type"]', 'regulatory_action');
await desktop.waitForFunction(() => document.querySelector('[data-ar-result-count]')?.textContent === '2');
const regulatoryAction = await snapshot(desktop);
results.push({ step: 'desktop_regulatory_action', ...regulatoryAction });
if (regulatoryAction.result_count !== 2 || regulatoryAction.rendered_card_count !== 2) failures.push(`desktop regulatory_action: expected 2 results/cards, found ${regulatoryAction.result_count}/${regulatoryAction.rendered_card_count}`);

await desktop.click('[data-ar-clear]');
await desktop.selectOption('[data-ar-filter-id="legal_profile_state"]', 'explicit_classification_present');
await desktop.selectOption('[data-ar-filter-id="regulatory_record_state"]', 'canonical_records_present');
await desktop.waitForFunction(() => document.querySelector('[data-ar-result-count]')?.textContent === '0');
const zeroIntersection = await snapshot(desktop);
results.push({ step: 'desktop_zero_intersection', ...zeroIntersection });
if (zeroIntersection.result_count !== 0) failures.push(`desktop zero intersection: expected 0, found ${zeroIntersection.result_count}`);
if (!zeroIntersection.results_hidden || zeroIntersection.empty_hidden) failures.push('desktop zero intersection: empty/results visibility contract failed');

await desktop.click('[data-ar-clear]');
await desktop.fill('[data-ar-search]', 'usdt');
await desktop.waitForTimeout(250);
await desktop.waitForFunction(() => document.querySelector('[data-ar-result-count]')?.textContent === '1');
const searchUsdt = await snapshot(desktop);
results.push({ step: 'desktop_search_usdt', ...searchUsdt });
if (searchUsdt.result_count !== 1 || searchUsdt.rendered_card_count !== 1) failures.push(`desktop search usdt: expected 1 result/card, found ${searchUsdt.result_count}/${searchUsdt.rendered_card_count}`);
if (!searchUsdt.url.includes('q=usdt')) failures.push(`desktop search usdt: URL search state missing ${searchUsdt.url}`);

await desktop.click('[data-ar-clear]');
await desktop.waitForFunction(() => document.querySelector('[data-ar-result-count]')?.textContent === '110');
await desktop.click('[data-ar-show-more]');
await desktop.waitForFunction(() => document.querySelectorAll('.ar-result-card').length === 75);
const showMore = await snapshot(desktop);
results.push({ step: 'desktop_show_more', ...showMore });
if (showMore.rendered_card_count !== 75) failures.push(`desktop show more: expected 75 rendered cards, found ${showMore.rendered_card_count}`);
await desktopContext.close();

const mobileContext = await browser.newContext({ viewport: { width: 393, height: 852 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
const mobile = await mobileContext.newPage();
response = await mobile.goto(`${baseUrl}/access-regulation/?reg_type=regulatory_action`, { waitUntil: 'networkidle', timeout: 90000 });
if (!response || !response.ok()) failures.push(`mobile: Explorer route returned ${response?.status() ?? 'no response'}`);
await waitForExplorer(mobile);
await mobile.waitForFunction(() => document.querySelector('[data-ar-result-count]')?.textContent === '2');
const mobileRegulatoryAction = await snapshot(mobile);
results.push({ step: 'mobile_regulatory_action_restore', ...mobileRegulatoryAction });
if (mobileRegulatoryAction.result_count !== 2 || mobileRegulatoryAction.rendered_card_count !== 2) failures.push(`mobile regulatory_action: expected 2 results/cards, found ${mobileRegulatoryAction.result_count}/${mobileRegulatoryAction.rendered_card_count}`);
if (mobileRegulatoryAction.regulatory_type !== 'regulatory_action') failures.push(`mobile regulatory_action: filter state did not restore, found ${mobileRegulatoryAction.regulatory_type}`);
if (mobileRegulatoryAction.page_horizontal_overflow_px > 2) failures.push(`mobile regulatory_action: page overflow ${mobileRegulatoryAction.page_horizontal_overflow_px}px`);
if (mobileRegulatoryAction.min_control_height < 44) failures.push(`mobile regulatory_action: minimum control height ${mobileRegulatoryAction.min_control_height}px`);
await mobile.screenshot({ path: path.join(outputDir, 'mobile-regulatory-action.png'), fullPage: true });

await mobile.goto(`${baseUrl}/access-regulation/?access_record_state=no_canonical_record`, { waitUntil: 'networkidle', timeout: 90000 });
await waitForExplorer(mobile);
await mobile.waitForFunction(() => document.querySelector('[data-ar-result-count]')?.textContent === '110');
const mobileAccessNoRecord = await snapshot(mobile);
results.push({ step: 'mobile_access_no_record_restore', ...mobileAccessNoRecord });
if (mobileAccessNoRecord.result_count !== 110) failures.push(`mobile access no-record: expected 110, found ${mobileAccessNoRecord.result_count}`);
if (mobileAccessNoRecord.access_record_state !== 'no_canonical_record') failures.push(`mobile access no-record: filter state did not restore, found ${mobileAccessNoRecord.access_record_state}`);
if (!mobileAccessNoRecord.access_state_disabled) failures.push('mobile access no-record: access-state filter must remain disabled');
await mobileContext.close();

await browser.close();

const output = {
  schema_version: '1.0',
  audit_id: 'sog_access_regulation_explorer_interaction_audit_pr347',
  route: '/access-regulation/',
  expected: {
    assets: 110,
    initial_rendered_cards: 50,
    legal_explicit_assets: 63,
    regulatory_record_assets: 5,
    regulatory_action_assets: 2,
    zero_intersection_assets: 0,
    market_access_no_record_assets: 110,
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
