import fs from 'node:fs';

const replaceRequired = (text, before, after, label) => {
  if (!text.includes(before)) throw new Error(`Missing expected ${label}`);
  return text.replace(before, after);
};

const scriptPath = 'src/scripts/stablecoin-index.ts';
let script = fs.readFileSync(scriptPath, 'utf8');
script = replaceRequired(script,
"  const compareDock = root.querySelector<HTMLElement>('[data-comparison-dock]');\n",
"  const compareDock = root.querySelector<HTMLElement>('[data-comparison-dock]');\n  const compareRegistry = root.querySelector<HTMLElement>('.stablecoin-index-registry');\n",
'Compare dock declaration');
script = replaceRequired(script,
"  let currentPage = 1;\n  let selectedComparisons = new Set<string>();\n",
"  let currentPage = 1;\n  let selectedComparisons = new Set<string>();\n  let comparisonPanelInView = false;\n  let comparisonRegistryInView = typeof IntersectionObserver === 'undefined';\n",
'Compare view state declarations');
script = replaceRequired(script,
"  function renderComparisonNavigation(selectedSources: HTMLElement[]) {\n",
"  function syncComparisonDockVisibility() {\n    if (!compareDock) return;\n    compareDock.hidden = selectedComparisons.size === 0 || comparisonPanelInView || !comparisonRegistryInView;\n  }\n\n  function renderComparisonNavigation(selectedSources: HTMLElement[]) {\n",
'dock visibility function insertion');
script = replaceRequired(script,
"    if (compareDock) compareDock.hidden = count === 0;\n",
"    syncComparisonDockVisibility();\n",
'dock render visibility');
script = replaceRequired(script,
"  window.addEventListener('popstate', () => { applyState(stateFromUrl()); refresh(); });\n\n  applyState(stateFromUrl());\n",
"  window.addEventListener('popstate', () => { applyState(stateFromUrl()); refresh(); });\n  if ('IntersectionObserver' in window) {\n    if (comparePanel) new IntersectionObserver(([entry]) => {\n      comparisonPanelInView = entry?.isIntersecting ?? false;\n      syncComparisonDockVisibility();\n    }, { threshold: 0.01 }).observe(comparePanel);\n    if (compareRegistry) new IntersectionObserver(([entry]) => {\n      comparisonRegistryInView = entry?.isIntersecting ?? false;\n      syncComparisonDockVisibility();\n    }, { threshold: 0.01 }).observe(compareRegistry);\n  }\n\n  applyState(stateFromUrl());\n",
'IntersectionObserver setup');
fs.writeFileSync(scriptPath, script);

const auditPath = 'scripts/audit-stablecoin-compare-navigation.mjs';
let audit = fs.readFileSync(auditPath, 'utf8');
audit = replaceRequired(audit,
"  await waitForSelection(page, 1);\n  const one = await page.evaluate(() => {\n",
"  await waitForSelection(page, 1);\n  await page.locator('.stablecoin-index-registry').scrollIntoViewIfNeeded();\n  await page.waitForTimeout(150);\n  const one = await page.evaluate(() => {\n",
'one-selection register positioning');
audit = replaceRequired(audit,
"  await page.locator('.stablecoin-index-registry').scrollIntoViewIfNeeded();\n  await page.mouse.wheel(0, 900);\n",
"  await page.mouse.wheel(0, 900);\n",
'duplicate desktop register scroll');
audit = replaceRequired(audit,
"  const viewTarget = await page.locator('[data-comparison-panel]').evaluate((panel) => ({ top: panel.getBoundingClientRect().top, active: document.activeElement === panel }));\n  record('view_comparison_returns_to_matrix', viewTarget.top >= 0 && viewTarget.top < 190 && viewTarget.active, viewTarget);\n",
"  const viewTarget = await page.locator('[data-comparison-panel]').evaluate((panel) => ({ top: panel.getBoundingClientRect().top, active: document.activeElement === panel, dockHidden: document.querySelector('[data-comparison-dock]')?.hasAttribute('hidden') }));\n  record('view_comparison_returns_to_matrix', viewTarget.top >= 0 && viewTarget.top < 190 && viewTarget.active && viewTarget.dockHidden === true, viewTarget);\n",
'comparison view dock-hidden assertion');
audit = replaceRequired(audit,
"  await page.goto(`${baseUrl}/stablecoins/?compare=usdt`, { waitUntil: 'networkidle' });\n  await waitForSelection(page, 1);\n  await page.locator('.stablecoin-index-registry').scrollIntoViewIfNeeded();\n  await page.mouse.wheel(0, 700);\n",
"  await page.goto(`${baseUrl}/stablecoins/?compare=usdt`, { waitUntil: 'networkidle' });\n  await waitForSelection(page, 1);\n  await page.locator('.stablecoin-index-registry').scrollIntoViewIfNeeded();\n  await page.waitForTimeout(150);\n  await page.mouse.wheel(0, 700);\n",
'mobile dock observer settle');
audit = replaceRequired(audit,
"  await page.locator('[data-comparison-panel]').scrollIntoViewIfNeeded();\n  const matrix = await page.locator('[data-comparison-grid]').evaluate((shell) => ({ clientWidth: shell.clientWidth, scrollWidth: shell.scrollWidth }));\n",
"  await page.locator('[data-comparison-panel]').scrollIntoViewIfNeeded();\n  await page.waitForTimeout(150);\n  const dockHiddenOnMatrix = await page.locator('[data-comparison-dock]').evaluate((dock) => dock.hasAttribute('hidden'));\n  record('mobile_dock_hidden_while_comparing', dockHiddenOnMatrix, { dockHidden: dockHiddenOnMatrix });\n  const matrix = await page.locator('[data-comparison-grid]').evaluate((shell) => ({ clientWidth: shell.clientWidth, scrollWidth: shell.scrollWidth }));\n",
'mobile comparison dock-hidden check');
fs.writeFileSync(auditPath, audit);

const validatorPath = 'scripts/validate-stablecoin-compare-discovery-navigation-remediation.mjs';
let validator = fs.readFileSync(validatorPath, 'utf8');
validator = replaceRequired(validator,
"for (const marker of ['renderComparisonNavigation', 'selectedComparisons.size < 2', 'document.scrollingElement', \"style.setProperty('scroll-behavior', 'auto', 'important')\", \"comparePanel.scrollIntoView({ block: 'start', behavior: 'auto' })\", 'comparePanel.focus({ preventScroll: true })', 'window.requestAnimationFrame', 'compareAddButton?.addEventListener', 'selectedComparisons.size >= 4', 'writeUrl'])",
"for (const marker of ['syncComparisonDockVisibility', 'IntersectionObserver', 'comparisonPanelInView', 'comparisonRegistryInView', 'renderComparisonNavigation', 'selectedComparisons.size < 2', 'document.scrollingElement', \"style.setProperty('scroll-behavior', 'auto', 'important')\", \"comparePanel.scrollIntoView({ block: 'start', behavior: 'auto' })\", 'comparePanel.focus({ preventScroll: true })', 'window.requestAnimationFrame', 'compareAddButton?.addEventListener', 'selectedComparisons.size >= 4', 'writeUrl'])",
'validator dock scoping markers');
validator = validator.replace("persistent_dock: true,", "persistent_dock: 'register_only; hidden_on_matrix_and_outside_register',");
fs.writeFileSync(validatorPath, validator);
