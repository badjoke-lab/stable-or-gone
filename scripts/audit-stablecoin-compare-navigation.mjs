import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = process.env.CAPTURE_BASE_URL || 'http://127.0.0.1:4173';
const outputDir = path.resolve('artifacts/stablecoin-compare-navigation');
fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });
const failures = [];
const results = [];
const record = (name, ok, details = {}) => { results.push({ name, ok, ...details }); if (!ok) failures.push({ name, ...details }); };
const overflow = (page) => page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
const hideSkip = (page) => page.evaluate(() => { const skip = document.querySelector('.skip-link'); if (skip instanceof HTMLElement) skip.style.visibility = 'hidden'; });

async function waitForSelection(page, count) {
  if (count === 0) {
    await page.waitForFunction(() => document.querySelector('[data-comparison-panel]')?.hasAttribute('hidden') === true);
    return;
  }
  await page.waitForFunction((expected) => document.querySelector('[data-comparison-table]')?.getAttribute('data-selected-count') === String(expected), count);
}

async function screenshotViewport(page, name) {
  await hideSkip(page);
  await page.screenshot({ path: path.join(outputDir, `${name}.png`), fullPage: false });
}

async function desktop(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 950 }, reducedMotion: 'reduce' });
  const page = await context.newPage();

  await page.goto(`${baseUrl}/stablecoins/`, { waitUntil: 'networkidle' });
  await waitForSelection(page, 0);
  const zero = await page.evaluate(() => ({
    panelHidden: document.querySelector('[data-comparison-panel]')?.hasAttribute('hidden') === true,
    dockHidden: document.querySelector('[data-comparison-dock]')?.hasAttribute('hidden') === true,
    order: Boolean(document.querySelector('[data-comparison-panel]')?.compareDocumentPosition(document.querySelector('.stablecoin-index-registry')) & Node.DOCUMENT_POSITION_FOLLOWING)
  }));
  record('zero_selection_hidden', zero.panelHidden && zero.dockHidden, zero);
  record('comparison_precedes_register', zero.order, zero);
  record('desktop_zero_page_overflow', !(await overflow(page)));

  await page.goto(`${baseUrl}/stablecoins/?compare=usdt`, { waitUntil: 'networkidle' });
  await waitForSelection(page, 1);
  const one = await page.evaluate(() => {
    const dock = document.querySelector('[data-comparison-dock]');
    const view = document.querySelector('[data-view-comparison]');
    return {
      dockHidden: dock?.hasAttribute('hidden'),
      stickyClass: dock?.classList.contains('stats-v4-jump'),
      layoutClass: dock?.classList.contains('masthead-row'),
      viewDisabled: view instanceof HTMLButtonElement ? view.disabled : null,
      count: document.querySelector('[data-comparison-dock-count]')?.textContent?.trim(),
      records: document.querySelector('[data-comparison-dock-records]')?.textContent?.trim()
    };
  });
  record('one_selection_dock_discoverable', one.dockHidden === false && one.stickyClass && one.layoutClass && one.viewDisabled === true && /1 record selected/.test(one.count || ''), one);
  await page.locator('.stablecoin-index-registry').scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 900);
  await page.waitForTimeout(100);
  await screenshotViewport(page, 'desktop-one-selected-dock');

  await page.goto(`${baseUrl}/stablecoins/?compare=usdt,usdc`, { waitUntil: 'networkidle' });
  await waitForSelection(page, 2);
  await page.locator('[data-pagination]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(100);
  const sticky = await page.locator('[data-comparison-dock]').evaluate((dock) => {
    const r = dock.getBoundingClientRect();
    return { top: r.top, bottom: r.bottom, hidden: dock.hasAttribute('hidden'), viewport: window.innerHeight };
  });
  record('dock_persists_while_browsing_register', !sticky.hidden && sticky.top >= 0 && sticky.top < 180 && sticky.bottom <= sticky.viewport, sticky);
  await screenshotViewport(page, 'desktop-two-selected-register-dock');
  await page.locator('[data-view-comparison]').click();
  await page.waitForTimeout(450);
  const viewTarget = await page.locator('[data-comparison-panel]').evaluate((panel) => ({ top: panel.getBoundingClientRect().top, active: document.activeElement === panel }));
  record('view_comparison_returns_to_matrix', viewTarget.top >= 0 && viewTarget.top < 190 && viewTarget.active, viewTarget);
  await screenshotViewport(page, 'desktop-two-selected-comparison');

  await page.goto(`${baseUrl}/stablecoins/?compare=usdt,usdc,dai,ust`, { waitUntil: 'networkidle' });
  await waitForSelection(page, 4);
  const addLocked = await page.evaluate(() => ({ select: (document.querySelector('[data-comparison-add]'))?.disabled, button: (document.querySelector('[data-comparison-add-button]'))?.disabled }));
  record('four_selection_add_locked', addLocked.select === true && addLocked.button === true, addLocked);
  await page.locator('[data-remove-comparison]').first().click();
  await waitForSelection(page, 3);
  const replacement = await page.locator('[data-comparison-add]').evaluate((select) => {
    if (!(select instanceof HTMLSelectElement)) return '';
    return [...select.options].find((option) => option.value && !option.disabled)?.value || '';
  });
  record('replacement_candidate_available_after_remove', Boolean(replacement), { replacement });
  if (replacement) {
    await page.locator('[data-comparison-add]').selectOption(replacement);
    await page.locator('[data-comparison-add-button]').click();
    await waitForSelection(page, 4);
  }
  const replaced = await page.evaluate((replacementValue) => ({
    selectedCount: document.querySelector('[data-comparison-table]')?.getAttribute('data-selected-count'),
    compare: new URLSearchParams(location.search).get('compare'),
    replacementPresent: (new URLSearchParams(location.search).get('compare') || '').split(',').includes(replacementValue),
    pickerVisible: Boolean(document.querySelector('[data-comparison-picker]')?.getClientRects().length)
  }), replacement);
  record('remove_replace_without_register_round_trip', Boolean(replacement) && replaced.selectedCount === '4' && replaced.replacementPresent && replaced.pickerVisible, replaced);
  record('desktop_replace_page_overflow', !(await overflow(page)));
  await page.locator('[data-comparison-panel]').scrollIntoViewIfNeeded();
  await screenshotViewport(page, 'desktop-four-selected-after-replace');
  await context.close();
}

async function mobile(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await context.newPage();

  await page.goto(`${baseUrl}/stablecoins/?compare=usdt`, { waitUntil: 'networkidle' });
  await waitForSelection(page, 1);
  await page.locator('.stablecoin-index-registry').scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 700);
  await page.waitForTimeout(100);
  const one = await page.locator('[data-comparison-dock]').evaluate((dock) => {
    const r = dock.getBoundingClientRect();
    return { top: r.top, bottom: r.bottom, hidden: dock.hasAttribute('hidden'), width: r.width, viewportWidth: window.innerWidth };
  });
  record('mobile_one_selection_sticky_dock', !one.hidden && one.top >= 0 && one.top < 170 && one.bottom <= 844 && one.width <= one.viewportWidth, one);
  record('mobile_one_page_overflow', !(await overflow(page)));
  await screenshotViewport(page, 'mobile-one-selected-register-dock');

  await page.goto(`${baseUrl}/stablecoins/?compare=usdt,usdc,dai,ust`, { waitUntil: 'networkidle' });
  await waitForSelection(page, 4);
  await page.locator('[data-comparison-panel]').scrollIntoViewIfNeeded();
  const matrix = await page.locator('[data-comparison-grid]').evaluate((shell) => ({ clientWidth: shell.clientWidth, scrollWidth: shell.scrollWidth }));
  record('mobile_four_matrix_bounded_scroll', matrix.scrollWidth > matrix.clientWidth && !(await overflow(page)), matrix);
  const picker = await page.locator('[data-comparison-picker]').evaluate((node) => ({ visible: Boolean(node.getClientRects().length), width: node.getBoundingClientRect().width, viewportWidth: window.innerWidth }));
  record('mobile_picker_bounded', picker.visible && picker.width <= picker.viewportWidth, picker);
  await screenshotViewport(page, 'mobile-four-selected-comparison-picker');
  await context.close();
}

const browser = await chromium.launch({ headless: true, args: ['--disable-lcd-text'] });
try {
  await desktop(browser);
  await mobile(browser);
} finally {
  await browser.close();
}
const audit = { schema_version: '1.0', generated_at: new Date().toISOString(), base_url: baseUrl, ok: failures.length === 0, results, failures };
fs.writeFileSync(path.join(outputDir, 'audit.json'), `${JSON.stringify(audit, null, 2)}\n`);
console.log(JSON.stringify(audit, null, 2));
if (failures.length) process.exit(1);
