import fs from 'node:fs';
import path from 'node:path';
import './validate-ui-v3-mobile-accessibility.mjs';
import { mobileTableContracts, pageFamilyContracts, responsiveAccessibilityPolicies, responsiveBands } from '../config/responsive-accessibility-contract.mjs';
import { implementedMobileTableRepresentations, mobileTableSourceFiles, requiredMobileTableKinds } from './mobile-table-manifest.mjs';

const root = process.cwd();
const auditPath = path.join(root, 'data/generated/responsive-accessibility-audit.json');
const outputPath = path.join(root, 'data/generated/responsive-accessibility-validation.json');
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

check(fs.existsSync(auditPath), 'responsive accessibility audit is missing');
if (!fs.existsSync(auditPath)) process.exit(1);
const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
const expected = [...requiredMobileTableKinds].sort();

check(audit.schema_version === '2.0', 'audit schema changed');
check(responsiveBands.length === 3, 'responsive band count changed');
check(pageFamilyContracts.length === 11, 'page family count changed');
check(mobileTableSourceFiles.length === 17, 'table source count changed');
check(requiredMobileTableKinds.length === 23, 'table kind count changed');
check(mobileTableContracts.length === 23, 'table contract count changed');
check(new Set(mobileTableContracts.map((item) => item.kind)).size === 23, 'table contract IDs must be unique');
check(JSON.stringify([...mobileTableContracts.map((item) => item.kind)].sort()) === JSON.stringify(expected), 'table contract coverage changed');
check(JSON.stringify(Object.keys(implementedMobileTableRepresentations).sort()) === JSON.stringify(expected), 'implemented mobile representation registry is incomplete');
check(responsiveAccessibilityPolicies.implementation_deferred === false, 'mobile implementation must no longer be deferred');
check(responsiveAccessibilityPolicies.implementation_starts_at_pr === 270, 'mobile implementation PR changed');
check(audit.totals?.current_tables === 23, 'current table count changed');
check(audit.totals?.tables_with_scroll_fallback === 23, 'complete table fallbacks must remain');
check(audit.totals?.implemented_mobile_representations === 23, 'all protected tables require compact representations');
check(audit.totals?.explicit_mobile_representations === 13, 'explicit mobile representation count changed');
check(audit.totals?.generated_mobile_representations === 10, 'generated mobile representation count changed');
check(JSON.stringify(audit.current_baseline?.implemented_mobile_table_kinds) === JSON.stringify(expected), 'audited mobile table kinds changed');
for (const entry of audit.current_baseline?.mobile_representation_checks ?? []) check(entry.source_exists === true && entry.marker_present === true, `mobile representation validation failed: ${entry.kind}`);
for (const key of ['missing_target_table_contracts', 'unknown_target_table_contracts', 'missing_current_tables', 'duplicate_current_tables']) check((audit.contract_alignment?.[key] ?? []).length === 0, `table alignment failed: ${key}`);

const css = audit.current_baseline?.css ?? {};
check(css.horizontal_overflow_present === true, 'table fallback overflow is missing');
check(css.table_min_width_present === true, 'table fallback width is missing');
check(css.generic_column_hiding_present === false, 'generic column hiding is prohibited');
for (const key of ['reduced_motion_present', 'forced_colors_present', 'overflow_wrap_anywhere_present', 'minimum_target_44_present', 'compact_320_present']) check(css[key] === true, `responsive CSS foundation is missing: ${key}`);
const layout = audit.current_baseline?.layout ?? {};
for (const key of ['language_declared', 'viewport_declared', 'main_landmark_present', 'main_landmark_has_id', 'skip_link_present', 'primary_navigation_label_present', 'current_page_state_present', 'disclosure_state_sync_present', 'escape_focus_return_present', 'anchor_focus_present', 'copy_feedback_present']) check(layout[key] === true, `layout accessibility contract is missing: ${key}`);

const gaps = audit.implementation_gaps ?? {};
check(gaps.table_transformations_pending?.length === 0, 'all protected table transformations must be complete');
for (const key of ['skip_link_missing', 'main_target_missing', 'current_page_state_missing', 'disclosure_state_sync_missing', 'escape_focus_return_missing', 'anchor_focus_missing', 'copy_feedback_missing', 'reduced_motion_missing', 'forced_colors_missing', 'long_value_wrapping_missing', 'minimum_target_rule_missing', 'compact_320_rule_missing']) check(gaps[key] === false, `mobile/accessibility foundation remains incomplete: ${key}`);

const result = {
  schema_version: '2.2',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  gate: 'V3-E-R5',
  totals: {
    responsive_bands: 3,
    page_families: 11,
    table_contracts: 23,
    implemented_mobile_representations: 23,
    explicit_mobile_representations: audit.totals?.explicit_mobile_representations ?? 0,
    generated_mobile_representations: audit.totals?.generated_mobile_representations ?? 0,
    retired_duplicate_tables: 2,
    page_transformations_pending: gaps.table_transformations_pending?.length ?? 0,
    failures: failures.length
  },
  failures
};
fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
if (failures.length) { console.error(JSON.stringify(result, null, 2)); process.exit(1); }
console.log(JSON.stringify(result, null, 2));
