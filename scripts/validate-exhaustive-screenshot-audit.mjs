#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const manifestFiles = [
  'artifacts/screenshots/manifest.desktop.json',
  'artifacts/screenshots/manifest.mobile.json'
];
const findings = [];
const devices = {};
const monospaceObservations = [];
const monoTokens = ['ui-monospace', 'sfmono-regular', 'menlo', 'monaco', 'consolas', 'liberation mono', 'monospace'];

const add = (device, route, category, detail) => {
  findings.push({ device, route, category, detail });
};

const usesMonospace = (fontFamily) => {
  const value = String(fontFamily ?? '').toLocaleLowerCase();
  return monoTokens.some((token) => value.includes(token));
};

const isBlockingFontLeak = (detail) => {
  const element = String(detail?.element ?? '');
  return element.includes('static-registry-') || element.includes('panel.registry') || element.includes('data-saas-dashboard') || element.includes('event-structured');
};

for (const file of manifestFiles) {
  if (!fs.existsSync(file)) {
    add(path.basename(file), null, 'manifest_missing', file);
    continue;
  }
  const manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
  const device = manifest.device ?? path.basename(file);
  devices[device] = {
    discovered: manifest.discovered_route_count,
    selected: manifest.selected_route_count,
    captured: manifest.captured_count,
    failed: manifest.failed_count
  };

  if (manifest.capture_mode !== 'exhaustive') add(device, null, 'capture_not_exhaustive', manifest.capture_mode);
  if (manifest.selected_route_count !== manifest.discovered_route_count) {
    add(device, null, 'route_selection_incomplete', `${manifest.selected_route_count}/${manifest.discovered_route_count}`);
  }
  if (manifest.captured_count !== manifest.discovered_route_count) {
    add(device, null, 'route_capture_incomplete', `${manifest.captured_count}/${manifest.discovered_route_count}`);
  }
  if (manifest.failed_count !== 0) add(device, null, 'capture_failures', manifest.failures ?? []);

  for (const record of manifest.records ?? []) {
    const route = record.path;
    const metrics = record.metrics ?? {};
    if (metrics.mainCount !== 1) add(device, route, 'main_count', metrics.mainCount);
    if (metrics.h1Count < 1) add(device, route, 'missing_h1', metrics.h1Count);
    if (metrics.horizontalOverflow) add(device, route, 'horizontal_overflow', metrics.horizontalOverflowPx);
    for (const value of metrics.brokenImages ?? []) add(device, route, 'broken_image', value);
    for (const value of metrics.brandViolations ?? []) add(device, route, 'brand_violation', value);
    for (const value of metrics.legacyVisualMarkers ?? []) add(device, route, 'legacy_visual_marker', value);
    for (const value of metrics.legacyPanelSurfaces ?? []) add(device, route, 'legacy_panel_surface', value);
    for (const value of metrics.largeOffTokenSurfaces ?? []) add(device, route, 'large_off_token_surface', value);
    for (const value of metrics.semanticColorViolations ?? []) add(device, route, 'semantic_color_misuse', value);
    for (const value of metrics.legacyFontViolations ?? []) {
      monospaceObservations.push({ device, route, detail: value });
      if (isBlockingFontLeak(value)) add(device, route, 'legacy_font_leak', value);
    }
    for (const role of ['body', 'h1', 'h2', 'h3']) {
      const fontFamily = metrics.fontRoles?.[role];
      if (fontFamily && usesMonospace(fontFamily)) {
        add(device, route, 'primary_font_role_monospace', { role, font_family: fontFamily });
      }
    }
    for (const value of metrics.unexpectedEmptyStates ?? []) add(device, route, 'unexpected_empty_state', value);
    if (!record.screenshot_bytes || record.screenshot_bytes < 1000) add(device, route, 'invalid_screenshot', record.screenshot_bytes ?? 0);
  }
}

const categories = findings.reduce((counts, finding) => {
  counts[finding.category] = (counts[finding.category] ?? 0) + 1;
  return counts;
}, {});
const result = {
  schema_version: '1.2',
  generated_at: new Date().toISOString(),
  ok: findings.length === 0,
  manual_review_required: true,
  visual_policy: {
    sans_body_and_primary_headings_required: true,
    editorial_metadata_monospace_allowed: true,
    static_pagination_monospace_forbidden: true,
    legacy_panel_surfaces_forbidden: true,
    large_off_token_colored_surfaces_forbidden: true,
    semantic_colors_require_approved_meaning: true
  },
  devices,
  observed_monospace_count: monospaceObservations.length,
  blocking_finding_count: findings.length,
  finding_count: findings.length,
  categories,
  findings
};

fs.mkdirSync('artifacts/screenshots', { recursive: true });
fs.writeFileSync('artifacts/screenshots/exhaustive-ui-audit.json', `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
if (findings.length) process.exit(1);
