#!/usr/bin/env node
import fs from 'node:fs';

const readabilityPath = 'scripts/audit-ui-readability.mjs';
const colorPath = 'scripts/audit-ui-color-system.mjs';
const capturePath = 'scripts/capture-site-screenshots.mjs';
const validatorPath = 'scripts/validate-exhaustive-screenshot-audit.mjs';
const cssPath = 'src/styles/public-ui.css';

const replaceRequired = (source, before, after, label) => {
  if (source.includes(after)) return source;
  if (!source.includes(before)) throw new Error(`${label} marker missing`);
  return source.replace(before, after);
};

let readability = fs.readFileSync(readabilityPath, 'utf8');
readability = readability.replace("const accent = rootStyle.getPropertyValue('--v3-accent').trim();", "const accent = rootStyle.getPropertyValue('--ui-danger').trim();");

if (!readability.includes('const editorialSerifSelector = [')) throw new Error('readability editorial selector missing');
if (!readability.includes('const explicitMonoSelector = [')) throw new Error('readability mono selector missing');

const oldFontBlock = `        const allowsSerif = element.matches(editorialSerifSelector) || Boolean(element.closest(editorialSerifSelector));
        const forbidden = families.find((family) => monospaceFamilies.has(family) || (!allowsSerif && serifFamilies.has(family)));
        if (forbidden) push('unexpected_public_font', {
          ...sample(element, 'public-font'),
          forbidden_family: forbidden,
          expected_role: allowsSerif ? 'editorial-serif' : 'ordinary-sans'
        });`;
const newFontBlock = `        const allowsSerif = element.matches(editorialSerifSelector) || Boolean(element.closest(editorialSerifSelector));
        const allowsMono = element.matches(explicitMonoSelector) || Boolean(element.closest(explicitMonoSelector));
        const forbidden = families.find((family) => (!allowsMono && monospaceFamilies.has(family)) || (!allowsSerif && serifFamilies.has(family)));
        if (forbidden) push('unexpected_public_font', {
          ...sample(element, 'public-font'),
          forbidden_family: forbidden,
          expected_role: allowsSerif ? 'editorial-serif' : allowsMono ? 'label-mono' : 'ordinary-sans'
        });`;
if (readability.includes(oldFontBlock)) readability = readability.replace(oldFontBlock, newFontBlock);
else if (!readability.includes('const allowsMono = element.matches(explicitMonoSelector)')) throw new Error('readability font role block missing');
fs.writeFileSync(readabilityPath, readability);

let color = fs.readFileSync(colorPath, 'utf8');
const oldTokens = `      const tokens = Object.fromEntries([
        '--v3-text', '--v3-text-muted', '--v3-text-quiet', '--v3-accent', '--v3-archive',
        '--v3-positive', '--v3-warning', '--v3-danger', '--v3-violet',
        '--bg', '--muted', '--gold', '--sog-link', '--sog-warning', '--shell-link', '--shell-warning'
      ].map((name) => [name, rootStyle.getPropertyValue(name).trim()]));`;
const newTokens = `      const tokens = Object.fromEntries([
        '--ui-bg', '--ui-bg-soft', '--ui-surface', '--ui-surface-strong',
        '--ui-text', '--ui-copy', '--ui-muted', '--ui-quiet',
        '--ui-line', '--ui-line-soft', '--ui-link', '--ui-hover', '--ui-visited', '--ui-focus',
        '--ui-positive', '--ui-warning', '--ui-danger', '--ui-neutral'
      ].map((name) => [name, rootStyle.getPropertyValue(name).trim()]));`;
if (color.includes(oldTokens)) color = color.replace(oldTokens, newTokens);
else if (!color.includes("'--ui-hover'")) throw new Error('color audit token inventory marker missing');
fs.writeFileSync(colorPath, color);

let css = fs.readFileSync(cssPath, 'utf8');
const siteMainLine = '.site-main { width: min(calc(100% - 2rem), var(--ui-content)); margin: 0 auto; padding: 2.25rem 0 5rem; outline: none; }';
const containmentBlock = `${siteMainLine}

/* Horizontal containment contract */
.site-main > *, .home-ledger, .home-ledger > *, .home-recent, .stats-page, .stats-page > *, .stats-section, .stablecoin-dossier, .stablecoin-dossier > *, .stablecoin-dossier-section, .stablecoin-dossier-section > *, .ui-panel, .registry { min-width: 0; max-width: 100%; }
pre { max-width: 100%; overflow-x: auto; white-space: pre-wrap; overflow-wrap: anywhere; }`;
css = replaceRequired(css, siteMainLine, containmentBlock, 'CSS containment');

const oldTableWrap = '.table-wrap, [class*="-table"] { max-width: 100%; overflow-x: auto; border: 1px solid var(--ui-line); border-radius: var(--ui-radius); background: var(--ui-bg-soft); }';
const newTableWrap = '.table-wrap, .home-recent__table-wrap, .stats-table-wrap, .evidence-table-wrap, .compare-output, :where(div,section,article,details)[class*="-table"] { width: 100%; min-width: 0; max-width: 100%; overflow-x: auto; border: 1px solid var(--ui-line); border-radius: var(--ui-radius); background: var(--ui-bg-soft); }';
css = replaceRequired(css, oldTableWrap, newTableWrap, 'CSS table wrapper');

const oldTable = 'table { width: 100%; border-collapse: collapse; font-size: .9375rem; line-height: 1.55; }';
const newTable = `table { width: 100%; max-width: 100%; border-collapse: collapse; font-size: .9375rem; line-height: 1.55; }
table[data-table-kind] { table-layout: fixed; }
[data-table-kind="stablecoin-deployments"] { min-width: 1780px; table-layout: auto; }
[data-table-kind$="sources"] { table-layout: fixed; }`;
css = replaceRequired(css, oldTable, newTable, 'CSS table sizing');

const oldCells = 'th, td { padding: .9rem 1rem; border-bottom: 1px solid var(--ui-line-soft); text-align: left; vertical-align: top; }';
const newCells = 'th, td { padding: .9rem 1rem; border-bottom: 1px solid var(--ui-line-soft); text-align: left; vertical-align: top; overflow-wrap: anywhere; word-break: normal; }';
css = replaceRequired(css, oldCells, newCells, 'CSS table cells');

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

const oldRootMetrics = `    const root = document.documentElement;
    const overflowPx = Math.max(0, root.scrollWidth - root.clientWidth);`;
const newRootMetrics = `    const root = document.documentElement;
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
      .sort((left, right) => right.outside_px - left.outside_px)
      .slice(0, 40);`;
capture = replaceRequired(capture, oldRootMetrics, newRootMetrics, 'DOM overflow diagnostics');

const oldViewportReturn = '      viewportWidth: root.clientWidth,';
const newViewportReturn = `      viewportWidth,
      overflowElements,`;
capture = replaceRequired(capture, oldViewportReturn, newViewportReturn, 'DOM overflow return');

const oldScreenshotRecord = `      await page.screenshot({ path: file, fullPage: true });
      const screenshotBytes = (await stat(file)).size;
      records.push({ url, path: route, device: deviceName, file, screenshot_bytes: screenshotBytes, metrics });`;
const newScreenshotRecord = `      await page.screenshot({ path: file, fullPage: true });
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
capture = replaceRequired(capture, oldScreenshotRecord, newScreenshotRecord, 'screenshot dimensions');
capture = capture.replace("schema_version: '3.1'", "schema_version: '3.2'");
fs.writeFileSync(capturePath, capture);

let validator = fs.readFileSync(validatorPath, 'utf8');
const oldOverflowCheck = "    if (metrics.horizontalOverflow) add(device, route, 'horizontal_overflow', metrics.horizontalOverflowPx);";
const newOverflowCheck = `    if (metrics.horizontalOverflow) add(device, route, 'horizontal_overflow', metrics.horizontalOverflowPx);
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
validator = replaceRequired(validator, oldOverflowCheck, newOverflowCheck, 'screenshot width validator');
validator = validator.replace("schema_version: '1.1'", "schema_version: '1.2'");
fs.writeFileSync(validatorPath, validator);

console.log(JSON.stringify({ readabilityPath, colorPath, capturePath, validatorPath, cssPath }, null, 2));
