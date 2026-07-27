#!/usr/bin/env node
import fs from 'node:fs';

const cssPath = 'src/styles/public-ui.css';
const capturePath = 'scripts/capture-site-screenshots.mjs';
const validatorPath = 'scripts/validate-exhaustive-screenshot-audit.mjs';

const replaceRequired = (source, before, after, label) => {
  if (source.includes(after)) return source;
  if (!source.includes(before)) throw new Error(`${label} marker missing`);
  return source.replace(before, after);
};

let css = fs.readFileSync(cssPath, 'utf8');
const siteMainLine = '.site-main { width: min(calc(100% - 2rem), var(--ui-content)); margin: 0 auto; padding: 2.25rem 0 5rem; outline: none; }';
const containmentBlock = `${siteMainLine}

/* Horizontal containment contract */
.site-main > *, .home-ledger, .home-ledger > *, .home-recent, .stats-page, .stats-page > *, .stats-section, .stablecoin-dossier, .stablecoin-dossier > *, .stablecoin-dossier-section, .stablecoin-dossier-section > *, .panel, .registry { min-width: 0; max-width: 100%; }
pre { max-width: 100%; overflow-x: auto; white-space: pre-wrap; overflow-wrap: anywhere; }`;
css = replaceRequired(css, siteMainLine, containmentBlock, 'CSS containment');

const currentTableWrap = '.table-wrap, :where([class*="-table"]:not(table)) { max-width: 100%; overflow-x: auto; border: 1px solid var(--ui-line); border-radius: var(--ui-radius); background: var(--ui-bg-soft); }';
const containedTableWrap = '.table-wrap, .home-recent__table-wrap, .stats-table-wrap, .evidence-table-wrap, .compare-output, :where(div,section,article,details)[class*="-table"] { width: 100%; min-width: 0; max-width: 100%; overflow-x: auto; border: 1px solid var(--ui-line); border-radius: var(--ui-radius); background: var(--ui-bg-soft); }';
css = replaceRequired(css, currentTableWrap, containedTableWrap, 'CSS table wrapper');

const currentTable = 'table { width: 100%; border-collapse: collapse; font-size: .9375rem; line-height: 1.55; }';
const boundedTable = `table { width: 100%; max-width: 100%; border-collapse: collapse; font-size: .9375rem; line-height: 1.55; }
table[data-table-kind] { table-layout: fixed; }
[data-table-kind="stablecoin-deployments"] { min-width: 1780px; table-layout: auto; }
[data-table-kind$="sources"] { table-layout: fixed; }`;
css = replaceRequired(css, currentTable, boundedTable, 'CSS table sizing');

const currentCells = 'th, td { padding: .9rem 1rem; border-bottom: 1px solid var(--ui-line-soft); text-align: left; vertical-align: top; }';
const wrappedCells = 'th, td { padding: .9rem 1rem; border-bottom: 1px solid var(--ui-line-soft); text-align: left; vertical-align: top; overflow-wrap: anywhere; word-break: normal; }';
css = replaceRequired(css, currentCells, wrappedCells, 'CSS table cells');

const currentMobileTable = 'table[data-mobile-table] { display: block; width: 100%; min-width: 0; max-width: 100%; overflow-x: auto; }';
const boundedMobileTable = 'table[data-mobile-table] { width: 100%; min-width: 0; max-width: 100%; }';
css = replaceRequired(css, currentMobileTable, boundedMobileTable, 'CSS mobile table base');

const mobileMarker = '@media (max-width: 820px) {';
const mobileContainment = `@media (max-width: 820px) {
  /* Mobile records replace wide desktop tables without dropping fields. */
  .stablecoin-identity-table, .stablecoin-organizations-table, .stablecoin-dossier table[data-mobile-table="scroll-preserve"] { display: none; }
  .stablecoin-coverage-disclosure table[data-table-kind="stablecoin-record-coverage"] { display: table; width: 100%; min-width: 0; table-layout: fixed; }
  .stablecoin-deployment-table-wrap, .evidence-table-wrap { display: none; }
  .stats-wide-table, .stats-table-wrap table { width: 100%; min-width: 0; table-layout: fixed; }
  .stats-table-wrap { overflow: visible; }
  .home-recent__table-wrap { overflow: visible; border: 0; background: transparent; }
  .home-recent table, .home-recent tbody, .home-recent tr, .home-recent td { display: block; width: 100%; min-width: 0; }
  .home-recent thead { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
  .home-recent tbody { display: grid; gap: .75rem; }
  .home-recent tr { border: 1px solid var(--ui-line); border-radius: var(--ui-radius); background: var(--ui-surface); }
  .home-recent td { padding: .7rem .8rem; display: grid; grid-template-columns: minmax(7.5rem,.45fr) minmax(0,1fr); gap: .7rem; border-bottom: 1px solid var(--ui-line-soft); }
  .home-recent td:last-child { border-bottom: 0; }
  .home-recent td::before { color: var(--ui-muted); font: 700 .75rem/1.4 var(--ui-mono); letter-spacing: .04em; text-transform: uppercase; }
  .home-recent td:nth-child(1)::before { content: "Record"; }
  .home-recent td:nth-child(2)::before { content: "Symbol"; }
  .home-recent td:nth-child(3)::before { content: "Lifecycle"; }
  .home-recent td:nth-child(4)::before { content: "Primary organization"; }
  .home-recent td:nth-child(5)::before { content: "Last reviewed"; }`;
if (!css.includes('/* Mobile records replace wide desktop tables without dropping fields. */')) {
  css = replaceRequired(css, mobileMarker, mobileContainment, 'CSS mobile containment');
}
fs.writeFileSync(cssPath, css);

let capture = fs.readFileSync(capturePath, 'utf8');
const measureMarker = 'async function measurePage(page) {';
const pngHelper = `async function readPngDimensions(file) {
  const buffer = await readFile(file);
  if (buffer.length < 24 || buffer.toString('ascii', 1, 4) !== 'PNG') throw new Error(\`Invalid PNG: \${file}\`);
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

${measureMarker}`;
if (!capture.includes('async function readPngDimensions(file)')) {
  capture = replaceRequired(capture, measureMarker, pngHelper, 'PNG dimension helper');
}

const currentRootMetrics = `    const root = document.documentElement;
    const overflowPx = Math.max(0, root.scrollWidth - root.clientWidth);`;
const diagnosticRootMetrics = `    const root = document.documentElement;
    const viewportWidth = root.clientWidth;
    const overflowPx = Math.max(0, root.scrollWidth - viewportWidth);
    const overflowElements = [...document.querySelectorAll('body *')]
      .filter(visible)
      .map((element) => {
        const rect = element.getBoundingClientRect();
        const outsidePx = Math.max(0, rect.right - viewportWidth, -rect.left, rect.width - viewportWidth);
        return { element: elementPath(element), left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width), outside_px: Math.round(outsidePx) };
      })
      .filter((entry) => entry.outside_px > 2)
      .sort((left, right) => right.outside_px - left.outsidePx)
      .slice(0, 40);`;
if (!capture.includes('const overflowElements = [...document.querySelectorAll')) {
  capture = replaceRequired(capture, currentRootMetrics, diagnosticRootMetrics, 'DOM overflow diagnostics');
}

capture = replaceRequired(capture, '      viewportWidth: root.clientWidth,', `      viewportWidth,
      overflowElements,`, 'DOM overflow return');

const currentScreenshotRecord = `      await page.screenshot({ path: file, fullPage: true });
      const screenshotBytes = (await stat(file)).size;
      records.push({ url, path: route, device: deviceName, file, screenshot_bytes: screenshotBytes, metrics });`;
const diagnosticScreenshotRecord = `      await page.screenshot({ path: file, fullPage: true });
      const screenshotBytes = (await stat(file)).size;
      const screenshotDimensions = await readPngDimensions(file);
      records.push({
        url,
        path: route,
        device: deviceName,
        file,
        screenshot_bytes: screenshotBytes,
        screenshot_width_px: screenshotDimensions.width,
        screenshot_height_px: screenshotDimensions.height,
        expected_viewport_width_px: device.viewport.width,
        screenshot_horizontal_overflow_px: Math.max(0, screenshotDimensions.width - device.viewport.width),
        metrics
      });`;
if (!capture.includes('screenshot_width_px: screenshotDimensions.width')) {
  capture = replaceRequired(capture, currentScreenshotRecord, diagnosticScreenshotRecord, 'screenshot dimensions');
}
capture = capture.replace("schema_version: '3.1'", "schema_version: '3.2'");
fs.writeFileSync(capturePath, capture);

let validator = fs.readFileSync(validatorPath, 'utf8');
const currentOverflowCheck = "    if (metrics.horizontalOverflow) add(device, route, 'horizontal_overflow', metrics.horizontalOverflowPx);";
const screenshotWidthCheck = `    if (metrics.horizontalOverflow) add(device, route, 'horizontal_overflow', metrics.horizontalOverflowPx);
    const screenshotWidth = Number(record.screenshot_width_px ?? 0);
    const expectedWidth = Number(record.expected_viewport_width_px ?? metrics.viewportWidth ?? 0);
    if (!screenshotWidth || !expectedWidth) {
      add(device, route, 'screenshot_dimensions_missing', { screenshot_width_px: screenshotWidth, expected_viewport_width_px: expectedWidth });
    } else if (screenshotWidth > expectedWidth + 2) {
      add(device, route, 'screenshot_width_overflow', {
        screenshot_width_px: screenshotWidth,
        expected_viewport_width_px: expectedWidth,
        overflow_px: screenshotWidth - expectedWidth,
        overflow_elements: metrics.overflowElements ?? []
      });
    }`;
if (!validator.includes("'screenshot_width_overflow'")) {
  validator = replaceRequired(validator, currentOverflowCheck, screenshotWidthCheck, 'screenshot width validator');
}
validator = validator.replace("schema_version: '1.1'", "schema_version: '1.2'");
fs.writeFileSync(validatorPath, validator);

console.log(JSON.stringify({ cssPath, capturePath, validatorPath }, null, 2));
