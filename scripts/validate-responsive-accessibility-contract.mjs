import fs from 'node:fs';
import path from 'node:path';
import { mobileTableContracts, pageFamilyContracts, responsiveBands } from '../config/responsive-accessibility-contract.mjs';
import { implementedMobileTableRepresentations, mobileTableSourceFiles, requiredMobileTableKinds } from './mobile-table-manifest.mjs';

const root = process.cwd();
const auditPath = path.join(root, 'data/generated/responsive-accessibility-audit.json');
const outputPath = path.join(root, 'data/generated/responsive-accessibility-validation.json');
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

check(fs.existsSync(auditPath), 'responsive accessibility audit is missing');
if (!fs.existsSync(auditPath)) process.exit(1);
const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
const expected = [
  'stablecoin-index',
  'stablecoin-overview',
  'stablecoin-organizations',
  'organization-index',
  'organization-overview',
  'organization-relationships',
  'organization-events',
  'organization-sources',
  'event-index',
  'event-details',
  'event-detail-overlay',
  'event-sources'
].sort();

check(audit.schema_version === '1.0', 'audit schema changed');
check(responsiveBands.length === 3, 'responsive band count changed');
check(pageFamilyContracts.length === 8, 'page family count changed');
check(mobileTableSourceFiles.length === 15, 'table source count changed');
check(requiredMobileTableKinds.length === 25, 'table kind count changed');
check(mobileTableContracts.length === 25, 'table contract count changed');
check(new Set(mobileTableContracts.map((item) => item.kind)).size === 25, 'table contract IDs must be unique');
check(JSON.stringify([...mobileTableContracts.map((item) => item.kind)].sort()) === JSON.stringify([...requiredMobileTableKinds].sort()), 'table contract coverage changed');
check(JSON.stringify(Object.keys(implementedMobileTableRepresentations).sort()) === JSON.stringify(expected), 'implemented mobile representation registry changed');
check(audit.totals?.current_tables === 25, 'current table count changed');
check(audit.totals?.tables_with_scroll_fallback === 25, 'complete table fallbacks must remain');
check(audit.totals?.implemented_mobile_representations === expected.length, 'implemented mobile representation total mismatch');
check(JSON.stringify(audit.current_baseline?.implemented_mobile_table_kinds) === JSON.stringify(expected), 'audited mobile table kinds changed');
for (const entry of audit.current_baseline?.mobile_representation_checks ?? []) check(entry.source_exists === true && entry.marker_present === true, `mobile representation validation failed: ${entry.kind}`);
for (const key of ['missing_target_table_contracts', 'unknown_target_table_contracts', 'missing_current_tables', 'duplicate_current_tables']) check((audit.contract_alignment?.[key] ?? []).length === 0, `table alignment failed: ${key}`);

const css = audit.current_baseline?.css ?? {};
check(css.horizontal_overflow_present === true, 'table fallback overflow is missing');
check(css.table_min_width_present === true, 'table fallback width is missing');
check(css.generic_column_hiding_present === false, 'generic column hiding is prohibited');
for (const key of ['reduced_motion_present', 'forced_colors_present', 'overflow_wrap_anywhere_present', 'minimum_target_44_present']) check(css[key] === true, `shell CSS foundation is missing: ${key}`);
const layout = audit.current_baseline?.layout ?? {};
for (const key of ['language_declared', 'viewport_declared', 'main_landmark_present', 'main_landmark_has_id', 'skip_link_present', 'primary_navigation_label_present', 'current_page_state_present']) check(layout[key] === true, `layout foundation is missing: ${key}`);

const gaps = audit.implementation_gaps ?? {};
check(gaps.table_transformations_pending?.length === 13, 'page transformation queue must contain 13 pending tables');
for (const kind of expected) check(!gaps.table_transformations_pending?.includes(kind), `implemented table remains pending: ${kind}`);
for (const key of ['skip_link_missing', 'main_target_missing', 'current_page_state_missing', 'reduced_motion_missing', 'forced_colors_missing', 'long_value_wrapping_missing', 'minimum_target_rule_missing']) check(gaps[key] === false, `global shell foundation remains incomplete: ${key}`);

const result = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  totals: {
    responsive_bands: 3,
    page_families: 8,
    table_contracts: 25,
    implemented_mobile_representations: expected.length,
    page_transformations_pending: gaps.table_transformations_pending?.length ?? 0,
    failures: failures.length
  },
  failures
};
fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
if (failures.length) { console.error(JSON.stringify(result, null, 2)); process.exit(1); }
console.log(JSON.stringify(result, null, 2));
