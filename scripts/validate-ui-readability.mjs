#!/usr/bin/env node
import fs from 'node:fs';

const files = [
  'artifacts/screenshots/readability-audit.desktop.json',
  'artifacts/screenshots/readability-audit.mobile.json'
];
const findings = [];
const summaries = {};
const categories = [
  'undersized_ordinary_text',
  'undersized_compact_text',
  'undersized_interactive_text',
  'undersized_metadata',
  'compressed_line_height',
  'oversized_headings',
  'excessive_heading_height',
  'ambiguous_internal_accent_links',
  'undersized_mobile_targets'
];

for (const file of files) {
  const device = file.includes('mobile') ? 'mobile' : 'desktop';
  if (!fs.existsSync(file)) {
    findings.push({ device, category: 'audit_missing', detail: file });
    continue;
  }
  const audit = JSON.parse(fs.readFileSync(file, 'utf8'));
  summaries[device] = {
    route_count: audit.route_count,
    audited_count: audit.audited_count,
    failed_count: audit.failed_count,
    routes_with_findings: audit.routes_with_findings,
    totals: audit.totals
  };
  if (audit.audited_count !== audit.route_count) findings.push({ device, category: 'incomplete_audit', detail: `${audit.audited_count}/${audit.route_count}` });
  if (audit.failed_count) findings.push({ device, category: 'audit_failures', detail: audit.failures });
  for (const category of categories) {
    const count = Number(audit.totals?.[category] ?? 0);
    if (count > 0) findings.push({ device, category, detail: count });
  }
}

const result = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  ok: findings.length === 0,
  policy: {
    ordinary_copy: '>=15px desktop and >=16px mobile',
    compact_values: '>=14px desktop and >=15px mobile',
    interactive_text: '>=14px desktop and >=15px mobile',
    metadata: '>=12px',
    line_height: '>=1.45 ordinary and >=1.35 compact',
    headings: 'bounded by device and route role',
    internal_accent_links: 'forbidden outside approved semantic contexts',
    mobile_controls: '>=40px high',
    desktop_and_mobile: 'both exhaustive audits required'
  },
  summaries,
  finding_count: findings.length,
  findings
};
fs.writeFileSync('artifacts/screenshots/readability-validation.json', `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
if (findings.length) process.exit(1);
