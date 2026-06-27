import fs from 'node:fs';
import path from 'node:path';
import { mobileTableContracts, pageFamilyContracts, responsiveBands } from '../config/responsive-accessibility-contract.mjs';
import { mobileTableSourceFiles, requiredMobileTableKinds } from './mobile-table-manifest.mjs';

const root = process.cwd();
const auditPath = path.join(root, 'data/generated/responsive-accessibility-audit.json');
const outputPath = path.join(root, 'data/generated/responsive-accessibility-validation.json');
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

check(fs.existsSync(auditPath), 'responsive accessibility audit is missing');
if (!fs.existsSync(auditPath)) process.exit(1);
const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
check(audit.schema_version === '1.0', 'audit schema changed');
check(responsiveBands.length === 3, 'responsive band count changed');
check(pageFamilyContracts.length === 8, 'page family count changed');
check(mobileTableSourceFiles.length === 15, 'table source count changed');
check(requiredMobileTableKinds.length === 25, 'table kind count changed');
check(mobileTableContracts.length === 25, 'table contract count changed');
check(new Set(mobileTableContracts.map((item) => item.kind)).size === 25, 'table contract IDs must be unique');
check(JSON.stringify([...mobileTableContracts.map((item) => item.kind)].sort()) === JSON.stringify([...requiredMobileTableKinds].sort()), 'table contract coverage changed');

check(audit.totals?.current_tables === 25, 'current table count changed');
check(audit.totals?.tables_currently_scroll_only === 25, 'complete table fallbacks must remain before page transformations');
for (const key of ['missing_target_table_contracts', 'unknown_target_table_contracts', 'missing_current_tables', 'duplicate_current_tables']) check((audit.contract_alignment?.[key] ?? []).length === 0, `table alignment failed: ${key}`);

const css = audit.current_baseline?.css ?? {};
check(JSON.stringify(css.source_files) === JSON.stringify(['src/styles/global.css', 'src/styles/shell.css']), 'shell CSS is not included in the audit');
check(css.horizontal_overflow_present === true, 'table fallback overflow is missing');
check(css.table_min_width_present === true, 'table fallback width is missing');
check(css.generic_column_hiding_present === false, 'generic column hiding is prohibited');
for (const key of ['reduced_motion_present', 'forced_colors_present', 'overflow_wrap_anywhere_present', 'minimum_target_44_present']) check(css[key] === true, `shell CSS foundation is missing: ${key}`);

const layout = audit.current_baseline?.layout ?? {};
for (const key of ['language_declared', 'viewport_declared', 'main_landmark_present', 'main_landmark_has_id', 'skip_link_present', 'primary_navigation_label_present', 'current_page_state_present']) check(layout[key] === true, `layout foundation is missing: ${key}`);

const gaps = audit.implementation_gaps ?? {};
check(gaps.table_transformations_pending?.length === 25, 'page transformation queue changed');
for (const key of ['skip_link_missing', 'main_target_missing', 'current_page_state_missing', 'reduced_motion_missing', 'forced_colors_missing', 'long_value_wrapping_missing', 'minimum_target_rule_missing']) check(gaps[key] === false, `global shell foundation remains incomplete: ${key}`);

const validation = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  totals: {
    responsive_bands: 3,
    page_families: 8,
    table_contracts: 25,
    global_shell_gaps: 0,
    page_transformations_pending: gaps.table_transformations_pending?.length ?? 0,
    failures: failures.length
  },
  failures
};
fs.writeFileSync(outputPath, `${JSON.stringify(validation, null, 2)}\n`);
if (failures.length) { console.error(JSON.stringify(validation, null, 2)); process.exit(1); }
console.log(JSON.stringify(validation, null, 2));
