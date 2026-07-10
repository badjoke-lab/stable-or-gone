#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const baseUrl = (process.env.CAPTURE_BASE_URL ?? 'http://127.0.0.1:4173').replace(/\/$/, '');
const outputDir = path.join(root, 'artifacts/compare-presets');
fs.mkdirSync(outputDir, { recursive: true });

const browser = await chromium.launch();
const failures = [];
const results = [];

const stateSnapshot = async (page) => page.evaluate(() => {
  const selected = [...document.querySelectorAll('[data-compare-slot]')]
    .map((element) => element instanceof HTMLSelectElement ? element.value : '')
    .filter(Boolean);
  const visibleGroups = [...document.querySelectorAll('[data-compare-group]')]
    .filter((element) => element instanceof HTMLElement && !element.hidden);
  const visibleRows = visibleGroups.reduce((sum, group) => sum + group.querySelectorAll('[data-dimension-id]').length, 0);
  const visibleCells = visibleGroups.reduce((sum, group) => sum + group.querySelectorAll('.compare-value-cell').length, 0);
  const visibleReadiness = visibleGroups.reduce((sum, group) => sum + group.querySelectorAll('.compare-badge--readiness').length, 0);
  const visibleFreshness = visibleGroups.reduce((sum, group) => sum + group.querySelectorAll('.compare-badge--freshness').length, 0);
  const params = new URL(window.location.href).searchParams;
  const presetButtons = [...document.querySelectorAll('[data-compare-preset-id]')];
  const activePresets = presetButtons
    .filter((element) => element.getAttribute('aria-pressed') === 'true')
    .map((element) => element.getAttribute('data-compare-preset-id'));
  const presetHeights = presetButtons
    .filter((element) => element instanceof HTMLElement)
    .map((element) => Math.round(element.getBoundingClientRect().height));
  const groupHeights = [...document.querySelectorAll('.compare-group-toggle')]
    .filter((element) => element instanceof HTMLElement)
    .map((element) => Math.round(element.getBoundingClientRect().height));
  return {
    selected,
    preset: params.get('preset'),
    assets: params.get('assets'),
    groups: params.get('groups'),
    active_presets: activePresets,
    visible_group_ids: visibleGroups.map((element) => element.getAttribute('data-compare-group')),
    visible_group_count: visibleGroups.length,
    visible_row_count: visibleRows,
    visible_cell_count: visibleCells,
    visible_readiness_badge_count: visibleReadiness,
    visible_freshness_badge_count: visibleFreshness,
    preset_status: document.querySelector('[data-compare-preset-status]')?.textContent?.trim() ?? '',
    page_horizontal_overflow_px: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
    min_preset_height: presetHeights.length ? Math.min(...presetHeights) : 0,
    min_group_toggle_height: groupHeights.length ? Math.min(...groupHeights) : 0
  };
});

const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const desktop = await desktopContext.newPage();
let response = await desktop.goto(`${baseUrl}/compare/`, { waitUntil: 'networkidle', timeout: 90000 });
if (!response || !response.ok()) failures.push(`desktop: compare route returned ${response?.status() ?? 'no response'}`);

await desktop.click('[data-compare-preset-id="model-contrast"]');
await desktop.waitForSelector('[data-compare-output]:not([hidden])', { timeout: 60000 });
await desktop.waitForFunction(() => new URL(window.location.href).searchParams.get('preset') === 'model-contrast');
const modelContrast = await stateSnapshot(desktop);
results.push({ step: 'desktop_model_contrast', ...modelContrast });

if (JSON.stringify(modelContrast.selected) !== JSON.stringify(['usdc', 'dai', 'frax', 'ust'])) failures.push(`desktop model contrast: asset selection mismatch ${JSON.stringify(modelContrast.selected)}`);
if (modelContrast.preset !== 'model-contrast') failures.push(`desktop model contrast: preset URL mismatch ${modelContrast.preset}`);
if (modelContrast.assets !== 'usdc,dai,frax,ust') failures.push(`desktop model contrast: assets URL mismatch ${modelContrast.assets}`);
if (modelContrast.groups !== 'identity_state,mechanism_reserves') failures.push(`desktop model contrast: groups URL mismatch ${modelContrast.groups}`);
if (JSON.stringify(modelContrast.active_presets) !== JSON.stringify(['model-contrast'])) failures.push(`desktop model contrast: active preset state mismatch ${JSON.stringify(modelContrast.active_presets)}`);
if (modelContrast.visible_group_count !== 2) failures.push(`desktop model contrast: expected 2 groups, found ${modelContrast.visible_group_count}`);
if (modelContrast.visible_row_count !== 13) failures.push(`desktop model contrast: expected 13 rows, found ${modelContrast.visible_row_count}`);
if (modelContrast.visible_cell_count !== 52) failures.push(`desktop model contrast: expected 52 cells, found ${modelContrast.visible_cell_count}`);
if (modelContrast.visible_readiness_badge_count !== 52) failures.push(`desktop model contrast: readiness badges ${modelContrast.visible_readiness_badge_count}`);
if (modelContrast.visible_freshness_badge_count !== 52) failures.push(`desktop model contrast: freshness badges ${modelContrast.visible_freshness_badge_count}`);
if (!modelContrast.preset_status.includes('Preset applied: Model contrast')) failures.push('desktop model contrast: preset status missing');
if (modelContrast.page_horizontal_overflow_px > 2) failures.push(`desktop model contrast: page overflow ${modelContrast.page_horizontal_overflow_px}px`);
if (modelContrast.min_preset_height < 44) failures.push(`desktop model contrast: preset control height ${modelContrast.min_preset_height}px`);
if (modelContrast.min_group_toggle_height < 44) failures.push(`desktop model contrast: group toggle height ${modelContrast.min_group_toggle_height}px`);

await desktop.locator('[data-compare-group-toggle][value="evidence_uncertainty"]').check();
await desktop.waitForFunction(() => !new URL(window.location.href).searchParams.has('preset'));
const expandedGroups = await stateSnapshot(desktop);
results.push({ step: 'desktop_custom_group_expansion', ...expandedGroups });
if (expandedGroups.preset !== null) failures.push('desktop group expansion: preset must clear after manual group change');
if (expandedGroups.groups !== 'identity_state,mechanism_reserves,evidence_uncertainty') failures.push(`desktop group expansion: groups URL mismatch ${expandedGroups.groups}`);
if (expandedGroups.visible_group_count !== 3) failures.push(`desktop group expansion: expected 3 groups, found ${expandedGroups.visible_group_count}`);
if (expandedGroups.visible_row_count !== 16) failures.push(`desktop group expansion: expected 16 rows, found ${expandedGroups.visible_row_count}`);
if (expandedGroups.visible_cell_count !== 64) failures.push(`desktop group expansion: expected 64 cells, found ${expandedGroups.visible_cell_count}`);
if (expandedGroups.active_presets.length !== 0) failures.push('desktop group expansion: no preset button should remain pressed');

await desktop.click('[data-compare-preset-id="model-contrast"]');
await desktop.waitForFunction(() => new URL(window.location.href).searchParams.get('preset') === 'model-contrast');
await desktop.selectOption('[data-compare-slot][data-slot-index="0"]', 'usdt');
await desktop.waitForFunction(() => !new URL(window.location.href).searchParams.has('preset'));
const customSelection = await stateSnapshot(desktop);
results.push({ step: 'desktop_custom_asset_selection', ...customSelection });
if (JSON.stringify(customSelection.selected) !== JSON.stringify(['usdt', 'dai', 'frax', 'ust'])) failures.push(`desktop custom selection mismatch ${JSON.stringify(customSelection.selected)}`);
if (customSelection.preset !== null) failures.push('desktop custom selection: preset must clear after manual asset change');
if (customSelection.active_presets.length !== 0) failures.push('desktop custom selection: no preset button should remain pressed');

await desktop.goto(`${baseUrl}/compare/?preset=protocol-stablecoins`, { waitUntil: 'networkidle', timeout: 90000 });
await desktop.waitForSelector('[data-compare-output]:not([hidden])', { timeout: 60000 });
await desktop.waitForFunction(() => new URL(window.location.href).searchParams.get('assets') === 'dai,usds,frax,mim');
const presetOnlyRestore = await stateSnapshot(desktop);
results.push({ step: 'desktop_preset_only_restore', ...presetOnlyRestore });
if (JSON.stringify(presetOnlyRestore.selected) !== JSON.stringify(['dai', 'usds', 'frax', 'mim'])) failures.push(`desktop preset-only restore mismatch ${JSON.stringify(presetOnlyRestore.selected)}`);
if (presetOnlyRestore.preset !== 'protocol-stablecoins') failures.push(`desktop preset-only restore preset mismatch ${presetOnlyRestore.preset}`);
if (presetOnlyRestore.groups !== 'mechanism_reserves,evidence_uncertainty') failures.push(`desktop preset-only restore groups mismatch ${presetOnlyRestore.groups}`);
if (presetOnlyRestore.visible_group_count !== 2 || presetOnlyRestore.visible_row_count !== 8 || presetOnlyRestore.visible_cell_count !== 32) failures.push(`desktop preset-only restore shape mismatch groups=${presetOnlyRestore.visible_group_count} rows=${presetOnlyRestore.visible_row_count} cells=${presetOnlyRestore.visible_cell_count}`);
await desktop.screenshot({ path: path.join(outputDir, 'desktop-protocol-preset.png'), fullPage: true });
await desktopContext.close();

const mobileContext = await browser.newContext({ viewport: { width: 393, height: 852 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
const mobile = await mobileContext.newPage();
response = await mobile.goto(`${baseUrl}/compare/?preset=lifecycle-outcomes`, { waitUntil: 'networkidle', timeout: 90000 });
if (!response || !response.ok()) failures.push(`mobile: compare route returned ${response?.status() ?? 'no response'}`);
await mobile.waitForSelector('[data-compare-output]:not([hidden])', { timeout: 60000 });
await mobile.waitForFunction(() => new URL(window.location.href).searchParams.get('assets') === 'usdt,busd,ust,fei');
const mobileLifecycle = await stateSnapshot(mobile);
results.push({ step: 'mobile_lifecycle_preset', ...mobileLifecycle });
if (JSON.stringify(mobileLifecycle.selected) !== JSON.stringify(['usdt', 'busd', 'ust', 'fei'])) failures.push(`mobile lifecycle: asset selection mismatch ${JSON.stringify(mobileLifecycle.selected)}`);
if (mobileLifecycle.preset !== 'lifecycle-outcomes') failures.push(`mobile lifecycle: preset mismatch ${mobileLifecycle.preset}`);
if (mobileLifecycle.groups !== 'identity_state,evidence_uncertainty') failures.push(`mobile lifecycle: groups mismatch ${mobileLifecycle.groups}`);
if (mobileLifecycle.visible_group_count !== 2) failures.push(`mobile lifecycle: expected 2 groups, found ${mobileLifecycle.visible_group_count}`);
if (mobileLifecycle.visible_row_count !== 11) failures.push(`mobile lifecycle: expected 11 rows, found ${mobileLifecycle.visible_row_count}`);
if (mobileLifecycle.visible_cell_count !== 44) failures.push(`mobile lifecycle: expected 44 cells, found ${mobileLifecycle.visible_cell_count}`);
if (mobileLifecycle.page_horizontal_overflow_px > 2) failures.push(`mobile lifecycle: page overflow ${mobileLifecycle.page_horizontal_overflow_px}px`);
if (mobileLifecycle.min_preset_height < 44) failures.push(`mobile lifecycle: preset control height ${mobileLifecycle.min_preset_height}px`);
if (mobileLifecycle.min_group_toggle_height < 44) failures.push(`mobile lifecycle: group toggle height ${mobileLifecycle.min_group_toggle_height}px`);
await mobile.screenshot({ path: path.join(outputDir, 'mobile-lifecycle-preset.png'), fullPage: true });
await mobileContext.close();

await browser.close();

const output = {
  schema_version: '1.0',
  audit_id: 'sog_compare_presets_interaction_audit_pr345',
  route: '/compare/',
  preset_count: 5,
  results,
  failures,
  ok: failures.length === 0
};
fs.writeFileSync(path.join(outputDir, 'audit.json'), `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify(output, null, 2));
if (failures.length) process.exit(1);
