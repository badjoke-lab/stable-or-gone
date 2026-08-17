import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = process.env.CAPTURE_BASE_URL || 'http://127.0.0.1:4173';
const artifactDir = path.join(process.cwd(), 'artifacts', 'screenshots', 'compare-phase-c');
fs.mkdirSync(artifactDir, { recursive: true });

const normalize = (value) => String(value ?? '').normalize('NFKC').toLocaleLowerCase().trim().replace(/\s+/g, ' ');
const compactText = (value) => String(value ?? '').trim().replace(/\s+/g, ' ');
const phase3LifecycleKeys = [
  'depeg_recovery_state',
  'recovery_dates',
  'failure_mechanisms',
  'regulatory_history',
  'redemption_change_history',
  'migration_termination_history'
];

function comparisonStats(records) {
  const keys = Object.keys(records[0]?.values ?? {});
  const differing = keys.filter((key) => new Set(records.map((record) => normalize(record.values[key]))).size > 1);
  return { total: keys.length, differing: differing.length, matching: keys.length - differing.length };
}

function findPair(records, predicate) {
  for (let left = 0; left < records.length; left += 1) {
    for (let right = left + 1; right < records.length; right += 1) {
      const selection = [records[left], records[right]];
      const stats = comparisonStats(selection);
      if (predicate(stats)) return { selection, stats };
    }
  }
  return null;
}

function findTriple(records, predicate) {
  for (let first = 0; first < records.length; first += 1) {
    for (let second = first + 1; second < records.length; second += 1) {
      for (let third = second + 1; third < records.length; third += 1) {
        const selection = [records[first], records[second], records[third]];
        const stats = comparisonStats(selection);
        if (predicate(stats)) return { selection, stats };
      }
    }
  }
  return null;
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });

try {
  await page.goto(`${baseUrl}/stablecoins/`, { waitUntil: 'networkidle' });
  const records = await page.locator('[data-comparison-source]').evaluateAll((sources) => sources.map((source) => ({
    slug: source.getAttribute('data-record-slug') || '',
    href: source.getAttribute('data-record-href') || '',
    markKind: source.querySelector('[data-comparison-source-mark] [data-mark-kind]')?.getAttribute('data-mark-kind') || '',
    values: Object.fromEntries(Array.from(source.querySelectorAll('[data-compare-value]')).map((value) => [
      value.getAttribute('data-compare-value') || '',
      value.textContent?.trim() || 'Not recorded'
    ]))
  })));

  if (records.length !== 119) throw new Error(`Expected 119 comparison sources, found ${records.length}.`);
  const alignedKeys = Object.keys(records[0]?.values ?? {}).sort();
  if (alignedKeys.length !== 21) throw new Error(`Expected 21 aligned comparison attributes after Phase 3, found ${alignedKeys.length}.`);
  for (const key of phase3LifecycleKeys) {
    if (!alignedKeys.includes(key)) throw new Error(`Phase 3 comparison attribute missing from aligned source contract: ${key}.`);
  }
  const alignedKeySignature = JSON.stringify(alignedKeys);
  if (records.some((record) => JSON.stringify(Object.keys(record.values).sort()) !== alignedKeySignature)) {
    throw new Error('Every comparison source must expose the same 21 aligned attributes.');
  }

  const matchingCase = findPair(records, (stats) => stats.matching > 0 && stats.differing > 0);
  const allDifferentCase = findPair(records, (stats) => stats.matching === 0) || findTriple(records, (stats) => stats.matching === 0);
  const directRecord = records.find((record) => record.markKind === 'logo');
  const fallbackRecord = records.find((record) => record.markKind === 'fallback');

  if (!matchingCase) throw new Error('Could not find a deterministic pair containing both matching and differing attributes.');
  if (!allDifferentCase) throw new Error('Could not find a deterministic 2–3 record selection where every aligned attribute differs.');
  if (!directRecord || !fallbackRecord) throw new Error('Compare source population must contain both direct-logo and neutral-fallback marks.');

  const compareUrl = (selection) => `${baseUrl}/stablecoins/?compare=${encodeURIComponent(selection.map((record) => record.slug).join(','))}`;
  const waitForComparison = async (selectionLength) => {
    await page.waitForSelector('[data-comparison-panel]:not([hidden])');
    await page.waitForFunction((expected) => document.querySelectorAll('[data-comparison-header-mark]').length === expected, selectionLength);
  };
  const feedbackGeometry = async () => page.locator('[data-comparison-feedback]').evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return {
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
      lineHeight: Number.parseFloat(style.lineHeight),
      visibleWithinViewport: rect.left >= -1 && rect.right <= window.innerWidth + 1,
      text: element.innerText.trim().replace(/\s+/g, ' ')
    };
  });

  await page.goto(compareUrl(matchingCase.selection), { waitUntil: 'networkidle' });
  await waitForComparison(matchingCase.selection.length);
  const matchingToggle = page.locator('[data-comparison-differences]');
  const feedback = page.locator('[data-comparison-feedback]');
  const rowLocator = page.locator('[data-comparison-row]');

  if ((await page.locator('.comparison-differences-toggle').innerText()).trim() !== 'Hide matching rows') throw new Error('Compare matching-row control must be labeled “Hide matching rows”.');

  const fullRowCount = await rowLocator.count();
  if (fullRowCount !== matchingCase.stats.total) throw new Error(`Expected ${matchingCase.stats.total} full rows, found ${fullRowCount}.`);
  const initialFeedback = compactText(await feedback.innerText());
  if (!initialFeedback.includes(`${matchingCase.stats.differing} differing attribute`) || !initialFeedback.includes(`${matchingCase.stats.matching} matching attribute`) || !initialFeedback.endsWith('shown.')) throw new Error(`Unexpected matching-case initial feedback: ${initialFeedback}`);

  await matchingToggle.check();
  await page.waitForFunction((expected) => document.querySelectorAll('[data-comparison-row]').length === expected, matchingCase.stats.differing);
  const reducedRowCount = await rowLocator.count();
  const hiddenFeedback = compactText(await feedback.innerText());
  if (reducedRowCount !== matchingCase.stats.differing) throw new Error('Hide matching rows did not reduce the matrix to differing attributes.');
  if (!hiddenFeedback.includes(`${matchingCase.stats.matching} matching attribute`) || !hiddenFeedback.endsWith('hidden.')) throw new Error(`Matching hidden-count feedback is missing: ${hiddenFeedback}`);

  await matchingToggle.uncheck();
  await page.waitForFunction((expected) => document.querySelectorAll('[data-comparison-row]').length === expected, matchingCase.stats.total);
  const restoredRowCount = await rowLocator.count();
  if (restoredRowCount !== fullRowCount) throw new Error('Disabling Hide matching rows did not restore the full comparison matrix.');

  await page.goto(compareUrl(allDifferentCase.selection), { waitUntil: 'networkidle' });
  await waitForComparison(allDifferentCase.selection.length);
  const allDifferentRowsBefore = await page.locator('[data-comparison-row]').count();
  await page.locator('[data-comparison-differences]').check();
  await page.waitForFunction(() => document.querySelector('[data-comparison-feedback]')?.textContent?.includes('Nothing to hide.'));
  const allDifferentRowsAfter = await page.locator('[data-comparison-row]').count();
  const noOpFeedback = compactText(await page.locator('[data-comparison-feedback]').innerText());
  if (allDifferentRowsAfter !== allDifferentRowsBefore) throw new Error('All-different no-op selection unexpectedly changed row count.');
  if (!noOpFeedback.includes('All displayed attributes already differ. Nothing to hide.')) throw new Error(`Explicit all-different no-op feedback is missing: ${noOpFeedback}`);

  const markSelection = [directRecord, fallbackRecord];
  await page.setViewportSize({ width: 1440, height: 1200 });
  await page.goto(compareUrl(markSelection), { waitUntil: 'networkidle' });
  await waitForComparison(markSelection.length);
  const desktopMarkKinds = await page.locator('[data-comparison-header-mark]').evaluateAll((marks) => marks.map((mark) => mark.getAttribute('data-mark-kind')));
  if (!desktopMarkKinds.includes('logo') || !desktopMarkKinds.includes('fallback')) throw new Error(`Compare headers must preserve direct and fallback mark semantics, got ${desktopMarkKinds.join(', ')}.`);
  await page.locator('[data-comparison-panel]').screenshot({ path: path.join(artifactDir, 'compare-desktop-direct-fallback.png') });

  await page.setViewportSize({ width: 390, height: 1000 });
  await page.goto(compareUrl(matchingCase.selection), { waitUntil: 'networkidle' });
  await waitForComparison(matchingCase.selection.length);
  const mobileMatchingFeedback = await feedbackGeometry();
  if (!mobileMatchingFeedback.visibleWithinViewport || mobileMatchingFeedback.scrollWidth > mobileMatchingFeedback.clientWidth + 1) {
    throw new Error(`Mobile matching-row feedback is clipped: ${JSON.stringify(mobileMatchingFeedback)}`);
  }
  if (mobileMatchingFeedback.clientHeight <= mobileMatchingFeedback.lineHeight * 1.5) {
    throw new Error(`Mobile matching-row feedback must visibly wrap instead of truncating: ${JSON.stringify(mobileMatchingFeedback)}`);
  }
  await page.locator('[data-comparison-panel]').screenshot({ path: path.join(artifactDir, 'compare-mobile-feedback.png') });

  await page.goto(compareUrl(allDifferentCase.selection), { waitUntil: 'networkidle' });
  await waitForComparison(allDifferentCase.selection.length);
  await page.locator('[data-comparison-differences]').check();
  await page.waitForFunction(() => document.querySelector('[data-comparison-feedback]')?.textContent?.includes('Nothing to hide.'));
  const mobileNoOpFeedback = await feedbackGeometry();
  if (mobileNoOpFeedback.text !== `${allDifferentCase.stats.differing} differing attributes. All displayed attributes already differ. Nothing to hide.`) {
    throw new Error(`Mobile no-op feedback lost required wording: ${mobileNoOpFeedback.text}`);
  }
  if (!mobileNoOpFeedback.visibleWithinViewport || mobileNoOpFeedback.scrollWidth > mobileNoOpFeedback.clientWidth + 1) {
    throw new Error(`Mobile no-op feedback is clipped: ${JSON.stringify(mobileNoOpFeedback)}`);
  }
  if (mobileNoOpFeedback.clientHeight <= mobileNoOpFeedback.lineHeight * 2.5) {
    throw new Error(`Mobile no-op feedback must visibly occupy multiple lines: ${JSON.stringify(mobileNoOpFeedback)}`);
  }
  await page.locator('[data-comparison-panel]').screenshot({ path: path.join(artifactDir, 'compare-mobile-noop.png') });

  await page.goto(compareUrl(markSelection), { waitUntil: 'networkidle' });
  await waitForComparison(markSelection.length);
  const mobileMarkKinds = await page.locator('[data-comparison-header-mark]').evaluateAll((marks) => marks.map((mark) => mark.getAttribute('data-mark-kind')));
  if (!mobileMarkKinds.includes('logo') || !mobileMarkKinds.includes('fallback')) throw new Error(`Mobile Compare headers lost direct/fallback mark semantics, got ${mobileMarkKinds.join(', ')}.`);
  const matrixShell = page.locator('[data-comparison-grid]');
  const horizontalGeometry = await matrixShell.evaluate((element) => ({ clientWidth: element.clientWidth, scrollWidth: element.scrollWidth }));
  if (horizontalGeometry.scrollWidth <= horizontalGeometry.clientWidth) throw new Error('Mobile comparison matrix must remain horizontally scrollable and bounded.');

  await matrixShell.evaluate((element) => { element.scrollLeft = 0; });
  await page.locator('[data-comparison-panel]').screenshot({ path: path.join(artifactDir, 'compare-mobile-direct.png') });
  const leftScroll = await matrixShell.evaluate((element) => element.scrollLeft);

  const rightScroll = await matrixShell.evaluate((element) => {
    element.scrollLeft = element.scrollWidth - element.clientWidth;
    return element.scrollLeft;
  });
  if (rightScroll <= leftScroll) throw new Error('Mobile comparison matrix did not scroll to expose the fallback record column.');
  await page.locator('[data-comparison-panel]').screenshot({ path: path.join(artifactDir, 'compare-mobile-fallback.png') });

  const result = {
    ok: true,
    audited_at: new Date().toISOString(),
    canonical_comparison_sources: records.length,
    aligned_attributes: matchingCase.stats.total,
    phase3_lifecycle_attributes: phase3LifecycleKeys,
    matching_row_case: {
      slugs: matchingCase.selection.map((record) => record.slug),
      differing_attributes: matchingCase.stats.differing,
      matching_attributes: matchingCase.stats.matching,
      full_rows: fullRowCount,
      reduced_rows: reducedRowCount,
      restored_rows: restoredRowCount,
      feedback_before: initialFeedback,
      feedback_hidden: hiddenFeedback
    },
    all_different_noop_case: {
      slugs: allDifferentCase.selection.map((record) => record.slug),
      row_count_before: allDifferentRowsBefore,
      row_count_after: allDifferentRowsAfter,
      feedback: noOpFeedback
    },
    mobile_feedback: {
      matching: mobileMatchingFeedback,
      all_different_noop: mobileNoOpFeedback
    },
    mark_case: {
      direct_slug: directRecord.slug,
      fallback_slug: fallbackRecord.slug,
      desktop_mark_kinds: desktopMarkKinds,
      mobile_mark_kinds: mobileMarkKinds,
      mobile_matrix_client_width: horizontalGeometry.clientWidth,
      mobile_matrix_scroll_width: horizontalGeometry.scrollWidth,
      mobile_direct_artifact_scroll_left: leftScroll,
      mobile_fallback_artifact_scroll_left: rightScroll
    }
  };

  fs.writeFileSync(path.join(artifactDir, 'compare-phase-c-audit.json'), `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify(result, null, 2));
} finally {
  await browser.close();
}
