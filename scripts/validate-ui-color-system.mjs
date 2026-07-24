#!/usr/bin/env node
import fs from 'node:fs';

const files = [
  'artifacts/screenshots/color-audit.desktop.json',
  'artifacts/screenshots/color-audit.mobile.json'
];
const findings = [];
const summaries = {};

for (const file of files) {
  if (!fs.existsSync(file)) {
    findings.push({ device: file.includes('mobile') ? 'mobile' : 'desktop', category: 'audit_missing', detail: file });
    continue;
  }
  const audit = JSON.parse(fs.readFileSync(file, 'utf8'));
  const device = audit.device;
  summaries[device] = {
    route_count: audit.route_count,
    audited_count: audit.audited_count,
    failed_count: audit.failed_count,
    legacy_palette_hit_count: audit.legacy_palette_hit_count,
    colored_ordinary_text_count: audit.colored_ordinary_text_count,
    text_shadow_count: audit.text_shadow_count,
    nonsemantic_colored_border_count: audit.nonsemantic_colored_border_count,
    nonsemantic_colored_background_count: audit.nonsemantic_colored_background_count
  };
  if (audit.audited_count !== audit.route_count) findings.push({ device, category: 'incomplete_audit', detail: `${audit.audited_count}/${audit.route_count}` });
  if (audit.failed_count) findings.push({ device, category: 'audit_failures', detail: audit.failures });
  for (const [category, count] of [
    ['legacy_palette_hit', audit.legacy_palette_hit_count],
    ['colored_ordinary_text', audit.colored_ordinary_text_count],
    ['text_shadow', audit.text_shadow_count],
    ['nonsemantic_colored_border', audit.nonsemantic_colored_border_count],
    ['nonsemantic_colored_background', audit.nonsemantic_colored_background_count]
  ]) {
    if (Number(count ?? 0) > 0) findings.push({ device, category, detail: count });
  }
}

const result = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  ok: findings.length === 0,
  policy: {
    ordinary_text: 'neutral V3 hierarchy only',
    legacy_palette: 'forbidden',
    text_shadow: 'forbidden',
    semantic_color: 'status, warning, archive, chart, and interactive roles only',
    desktop_and_mobile: 'both exhaustive audits required'
  },
  summaries,
  finding_count: findings.length,
  findings
};
fs.writeFileSync('artifacts/screenshots/color-system-validation.json', `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
if (findings.length) process.exit(1);
