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
  'overlapping_section_heading_content',
  'ambiguous_internal_accent_links',
  'undersized_mobile_targets',
    'unexpected_public_font',
  'raw_public_enum',
  'empty_visible_toc',
  'duplicate_visible_record_number',
  'excessive_route_height'
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
  schema_version: '1.2',
  generated_at: new Date().toISOString(),
  ok: findings.length === 0,
  policy: {
    ordinary_copy: '>=17px desktop and >=16px mobile',
    compact_values: '>=15px desktop and mobile',
    interactive_text: '>=15px desktop and mobile',
    metadata: '>=13px',
    line_height: '>=1.45 ordinary and >=1.35 compact',
    headings: 'bounded by device and route role',
    section_heading_layout: 'visible heading text must not overlap at any descendant level',
    navigation_integrity: 'visible tables of contents must contain links and static lists must not show duplicate numbering',
    route_height: 'home mobile <=5000px and statistics desktop <=9000px in representative captures',
    internal_accent_links: 'forbidden outside approved semantic contexts',
    mobile_controls: '>=40px high, with the public UI contract targeting 44px',
    public_typography: 'sans-serif only outside explicit technical values',
    public_enums: 'raw lowercase snake_case tokens forbidden outside technical values; canonical sog_ IDs exempt',
    desktop_and_mobile: 'both exhaustive audits required'
  },
  summaries,
  finding_count: findings.length,
  findings
};
fs.writeFileSync('artifacts/screenshots/readability-validation.json', `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
if (findings.length) process.exit(1);
