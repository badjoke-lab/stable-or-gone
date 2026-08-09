import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = process.env.CAPTURE_BASE_URL || 'http://127.0.0.1:4173';
const outputDir = path.resolve('artifacts/stablecoin-compare-matrix');
fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

const fixed = ['usdt', 'usdc', 'dai', 'ust'];
const results = [];
const failures = [];

const record = (name, ok, details = {}) => {
  results.push({ name, ok, ...details });
  if (!ok) failures.push({ name, ...details });
};

const waitForMatrix = async (page, count) => {
  await page.waitForSelector('[data-comparison-table]');
  await page.waitForFunction((expected) => {
    const table = document.querySelector('[data-comparison-table]');
    return table instanceof HTMLElement && table.dataset.selectedCount === String(expected);
  }, count);
};

const pageHasOverflow = async (page) => page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);

const captureState = async (page, name) => {
  const section = page.locator('[data-comparison-panel]');
  await section.scrollIntoViewIfNeeded();
  await page.evaluate(() => { if (document.activeElement instanceof HTMLElement) document.activeElement.blur(); });
  await section.screenshot({ path: path.join(outputDir, `${name}.png`) });
};

const assertColumnCount = async (page, count, label) => {
  const headers = await page.locator('.comparison-record-header').count();
  const selected = await page.locator('[data-comparison-table]').getAttribute('data-selected-count');
  const ok = headers === count && selected === String(count);
  record(label, ok, { expected: count, headers, selected });
};

const runDesktop = async (browser) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const page = await context.newPage();

  for (const count of [2, 3, 4]) {
    const slugs = fixed.slice(0, count);
    await page.goto(`${baseUrl}/stablecoins/?compare=${slugs.join(',')}`, { waitUntil: 'networkidle' });
    await waitForMatrix(page, count);
    await assertColumnCount(page, count, `desktop_${count}_columns`);
    const href = new URL(page.url()).searchParams.get('compare');
    record(`desktop_${count}_url_order`, href === slugs.join(','), { href, expected: slugs.join(',') });
    record(`desktop_${count}_page_overflow`, !(await pageHasOverflow(page)));
    await captureState(page, `desktop-${count}-selected`);
  }

  await page.goto(`${baseUrl}/stablecoins/?compare=${fixed.join(',')}`, { waitUntil: 'networkidle' });
  await waitForMatrix(page, 4);
  const beforeRows = await page.locator('tr[data-comparison-row]').count();
  await page.locator('[data-comparison-differences]').check();
  await page.waitForTimeout(50);
  const afterRows = await page.locator('tr[data-comparison-row]').count();
  record('differences_only_reduces_or_preserves_rows', afterRows <= beforeRows && afterRows > 0, { beforeRows, afterRows });
  record('differences_only_hides_at_least_one_same_row', afterRows < beforeRows, { beforeRows, afterRows });
  await captureState(page, 'desktop-4-differences-only');

  await page.locator('[data-comparison-differences]').uncheck();
  const firstRemove = page.locator('[data-remove-comparison]').first();
  const removedSlug = await firstRemove.getAttribute('data-remove-comparison');
  await firstRemove.click();
  await waitForMatrix(page, 3);
  const compareAfterRemove = new URL(page.url()).searchParams.get('compare') || '';
  const expectedAfterRemove = fixed.filter((slug) => slug !== removedSlug).join(',');
  record('column_remove_url_sync', compareAfterRemove === expectedAfterRemove, { removedSlug, compareAfterRemove, expectedAfterRemove });
  await assertColumnCount(page, 3, 'column_remove_matrix_sync');
  await captureState(page, 'desktop-after-column-remove');

  await page.goto(`${baseUrl}/stablecoins/?compare=${fixed.join(',')}`, { waitUntil: 'networkidle' });
  await waitForMatrix(page, 4);
  const fifth = await page.evaluate(() => {
    const selected = new Set((new URLSearchParams(location.search).get('compare') || '').split(',').filter(Boolean));
    const inputs = [...document.querySelectorAll('[data-compare-select]')].filter((item) => item instanceof HTMLInputElement);
    const candidate = inputs.find((item) => !selected.has(item.value));
    if (!(candidate instanceof HTMLInputElement)) return null;
    candidate.checked = true;
    candidate.dispatchEvent(new Event('change', { bubbles: true }));
    return { value: candidate.value, checked: candidate.checked };
  });
  await page.waitForTimeout(50);
  const afterFifth = new URL(page.url()).searchParams.get('compare') || '';
  const alert = (await page.locator('[data-comparison-alert]').textContent())?.trim() || '';
  record('fifth_selection_rejected', Boolean(fifth) && fifth.checked === false && afterFifth === fixed.join(',') && /maximum of four/i.test(alert), { fifth, afterFifth, alert });
  await captureState(page, 'desktop-fifth-selection-rejected');

  await page.goto(`${baseUrl}/stablecoins/`, { waitUntil: 'networkidle' });
  const missingState = await page.evaluate(() => {
    for (const source of document.querySelectorAll('[data-comparison-source]')) {
      if (!(source instanceof HTMLElement)) continue;
      const values = [...source.querySelectorAll('[data-compare-value]')].map((node) => node.textContent?.trim().toLowerCase() || '');
      if (values.includes('unknown') || values.includes('not recorded')) return source.dataset.recordSlug || null;
    }
    return null;
  });
  if (missingState) {
    const peer = missingState === 'usdt' ? 'usdc' : 'usdt';
    await page.goto(`${baseUrl}/stablecoins/?compare=${missingState},${peer}`, { waitUntil: 'networkidle' });
    await waitForMatrix(page, 2);
    const explicitStateCount = await page.locator('[data-value-state="unknown"], [data-value-state="not-recorded"]').count();
    record('explicit_unknown_not_recorded_visible', explicitStateCount > 0, { missingState, explicitStateCount });
    await captureState(page, 'desktop-explicit-unknown-not-recorded');
  } else {
    record('explicit_unknown_not_recorded_visible', false, { reason: 'No canonical comparison source contains Unknown or Not recorded.' });
  }

  await context.close();
};

const runMobile = async (browser) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await context.newPage();

  for (const count of [2, 4]) {
    const slugs = fixed.slice(0, count);
    await page.goto(`${baseUrl}/stablecoins/?compare=${slugs.join(',')}`, { waitUntil: 'networkidle' });
    await waitForMatrix(page, count);
    await assertColumnCount(page, count, `mobile_${count}_columns`);
    const overflow = await pageHasOverflow(page);
    const shellMetrics = await page.locator('[data-comparison-grid]').evaluate((shell) => ({ clientWidth: shell.clientWidth, scrollWidth: shell.scrollWidth }));
    record(`mobile_${count}_page_overflow`, !overflow, { shellMetrics });
    record(`mobile_${count}_bounded_matrix_scroll`, shellMetrics.scrollWidth > shellMetrics.clientWidth, shellMetrics);
    await captureState(page, `mobile-${count}-selected-left`);
    if (count === 4) {
      await page.locator('[data-comparison-grid]').evaluate((shell) => { shell.scrollLeft = shell.scrollWidth; });
      await page.waitForTimeout(50);
      const rightEdgeGeometry = await page.evaluate(() => {
        const attribute = document.querySelector('.comparison-matrix .comparison-attribute-column');
        const headers = [...document.querySelectorAll('.comparison-record-header')];
        const last = headers.at(-1);
        const sectionLabel = document.querySelector('.comparison-section-label');
        if (!(attribute instanceof HTMLElement) || !(last instanceof HTMLElement) || !(sectionLabel instanceof HTMLElement)) return null;
        const attributeRect = attribute.getBoundingClientRect();
        const lastRect = last.getBoundingClientRect();
        const sectionRect = sectionLabel.getBoundingClientRect();
        return { attributeRight: attributeRect.right, lastLeft: lastRect.left, sectionLeft: sectionRect.left, sectionRight: sectionRect.right };
      });
      record('mobile_4_last_column_clears_sticky_attribute', Boolean(rightEdgeGeometry) && rightEdgeGeometry.lastLeft >= rightEdgeGeometry.attributeRight - 1, rightEdgeGeometry ?? {});
      record('mobile_4_section_label_remains_sticky', Boolean(rightEdgeGeometry) && rightEdgeGeometry.sectionLeft >= -1 && rightEdgeGeometry.sectionRight > 100, rightEdgeGeometry ?? {});
      await captureState(page, 'mobile-4-selected-right');
    }
  }

  await context.close();
};

const browser = await chromium.launch({ headless: true, args: ['--disable-lcd-text'] });
try {
  await runDesktop(browser);
  await runMobile(browser);
} finally {
  await browser.close();
}

const audit = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  base_url: baseUrl,
  fixed_selection_order: fixed,
  ok: failures.length === 0,
  results,
  failures
};
fs.writeFileSync(path.join(outputDir, 'audit.json'), `${JSON.stringify(audit, null, 2)}\n`);
console.log(JSON.stringify(audit, null, 2));
if (failures.length) process.exit(1);
