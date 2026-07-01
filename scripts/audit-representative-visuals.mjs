#!/usr/bin/env node
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const ARTIFACT_ROOT = path.join(ROOT, 'artifacts/screenshots');
const DEVICES = ['desktop', 'mobile'];
const REQUIRED_FAMILIES = ['stablecoin-detail', 'issuer-detail', 'event-detail', 'guide-detail'];
const EXPECTED_VIEWPORTS = { desktop: { width: 1440, height: 900 }, mobile: { width: 393, height: 852 } };
const MIN_SCREENSHOT_BYTES = 5000;

async function readJson(file) {
  return JSON.parse(await readFile(path.join(ROOT, file), 'utf8'));
}

async function fileExists(file) {
  try { await access(path.join(ROOT, file)); return true; }
  catch { return false; }
}

const requiredRoutesConfig = await readJson('config/public-routes.json');
const requiredUniqueRoutes = Array.isArray(requiredRoutesConfig) ? requiredRoutesConfig : requiredRoutesConfig.routes;
const failures = [];
const warnings = [];
const deviceSummaries = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

for (const device of DEVICES) {
  const manifestPath = `artifacts/screenshots/manifest.${device}.json`;
  check(await fileExists(manifestPath), `${device}: capture manifest missing`);
  if (!(await fileExists(manifestPath))) continue;
  const manifest = await readJson(manifestPath);
  check(manifest.schema_version === '2.0', `${device}: manifest schema must be 2.0`);
  check(manifest.device === device, `${device}: device marker mismatch`);
  check(manifest.capture_mode === 'representative', `${device}: capture mode must be representative`);
  check(manifest.viewport?.width === EXPECTED_VIEWPORTS[device].width && manifest.viewport?.height === EXPECTED_VIEWPORTS[device].height, `${device}: viewport changed`);
  check(manifest.failed_count === 0 && manifest.failures?.length === 0, `${device}: screenshot capture failures remain`);
  check(manifest.captured_count === manifest.selected_route_count, `${device}: selected and captured route counts differ`);

  const capturedRoutes = new Set((manifest.records ?? []).map((record) => record.path));
  for (const route of requiredUniqueRoutes) check(capturedRoutes.has(route), `${device}: required unique route not captured: ${route}`);

  const familyMap = new Map((manifest.family_selection ?? []).map((family) => [family.name, family]));
  for (const familyName of REQUIRED_FAMILIES) {
    const family = familyMap.get(familyName);
    check(Boolean(family), `${device}: family selection missing: ${familyName}`);
    if (family) check(family.selected >= 3 && family.routes?.length >= 3, `${device}: ${familyName} needs at least three representatives`);
  }

  let overflowCount = 0;
  let brokenImageCount = 0;
  let brandViolationCount = 0;
  let legacyMarkerCount = 0;
  let unexpectedEmptyCount = 0;
  for (const record of manifest.records ?? []) {
    check(await fileExists(record.file), `${device}: screenshot file missing for ${record.path}`);
    if (await fileExists(record.file)) {
      const size = (await stat(path.join(ROOT, record.file))).size;
      check(size >= MIN_SCREENSHOT_BYTES, `${device}: screenshot is unexpectedly small for ${record.path}`);
    }
    const metrics = record.metrics ?? {};
    check(metrics.h1Count === 1, `${device}: ${record.path} must contain exactly one H1`);
    check(metrics.mainCount === 1, `${device}: ${record.path} must contain exactly one main landmark`);
    if (metrics.horizontalOverflow) overflowCount += 1;
    if (metrics.brokenImages?.length) brokenImageCount += metrics.brokenImages.length;
    if (metrics.brandViolations?.length) brandViolationCount += metrics.brandViolations.length;
    if (metrics.legacyVisualMarkers?.length) legacyMarkerCount += metrics.legacyVisualMarkers.length;
    if (metrics.unexpectedEmptyStates?.length) unexpectedEmptyCount += metrics.unexpectedEmptyStates.length;
    check(metrics.horizontalOverflow === false, `${device}: horizontal overflow on ${record.path} (${metrics.horizontalOverflowPx ?? '?'}px)`);
    check((metrics.brokenImages?.length ?? 0) === 0, `${device}: broken images on ${record.path}: ${(metrics.brokenImages ?? []).join(', ')}`);
    check((metrics.brandViolations?.length ?? 0) === 0, `${device}: unapproved brand asset on ${record.path}`);
    check((metrics.legacyVisualMarkers?.length ?? 0) === 0, `${device}: legacy visual marker on ${record.path}: ${(metrics.legacyVisualMarkers ?? []).join(', ')}`);
    check((metrics.unexpectedEmptyStates?.length ?? 0) === 0, `${device}: false initial empty state on ${record.path}`);
  }

  deviceSummaries.push({
    device,
    viewport: manifest.viewport,
    discovered_routes: manifest.discovered_route_count,
    selected_routes: manifest.selected_route_count,
    captured_routes: manifest.captured_count,
    required_unique_routes: requiredUniqueRoutes.length,
    family_selection: Object.fromEntries(REQUIRED_FAMILIES.map((name) => [name, familyMap.get(name)?.routes ?? []])),
    overflow_count: overflowCount,
    broken_image_count: brokenImageCount,
    brand_violation_count: brandViolationCount,
    legacy_marker_count: legacyMarkerCount,
    unexpected_empty_state_count: unexpectedEmptyCount
  });
}

const result = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  gate: 'V3-F',
  ok: failures.length === 0,
  requirements: {
    devices: DEVICES,
    required_unique_routes: requiredUniqueRoutes,
    repeated_families: REQUIRED_FAMILIES,
    samples_per_family: 3,
    minimum_screenshot_bytes: MIN_SCREENSHOT_BYTES
  },
  devices: deviceSummaries,
  failures,
  warnings
};

await mkdir(ARTIFACT_ROOT, { recursive: true });
await writeFile(path.join(ARTIFACT_ROOT, 'representative-visual-audit.json'), `${JSON.stringify(result, null, 2)}\n`);
const markdown = [
  '# Representative visual audit',
  '',
  `- Gate: V3-F`,
  `- Result: ${result.ok ? 'PASS' : 'FAIL'}`,
  `- Unique routes required per device: ${requiredUniqueRoutes.length}`,
  `- Repeated detail samples per family: 3`,
  '',
  ...deviceSummaries.flatMap((summary) => [
    `## ${summary.device}`,
    '',
    `- Viewport: ${summary.viewport.width} × ${summary.viewport.height}`,
    `- Captured: ${summary.captured_routes} / ${summary.selected_routes}`,
    `- Horizontal overflow: ${summary.overflow_count}`,
    `- Broken images: ${summary.broken_image_count}`,
    `- Brand violations: ${summary.brand_violation_count}`,
    `- Legacy visual markers: ${summary.legacy_marker_count}`,
    `- Unexpected empty states: ${summary.unexpected_empty_state_count}`,
    '',
    ...REQUIRED_FAMILIES.map((family) => `- ${family}: ${(summary.family_selection[family] ?? []).join(', ')}`),
    ''
  ]),
  '## Failures',
  '',
  ...(failures.length ? failures.map((failure) => `- ${failure}`) : ['- None'])
].join('\n');
await writeFile(path.join(ARTIFACT_ROOT, 'representative-visual-audit.md'), `${markdown}\n`);
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
