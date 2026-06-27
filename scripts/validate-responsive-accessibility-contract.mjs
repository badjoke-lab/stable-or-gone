import fs from 'node:fs';
import path from 'node:path';
import {
  announcementContracts,
  keyboardContracts,
  longValueContract,
  mobileTableContracts,
  motionContract,
  pageFamilyContracts,
  responsiveAccessibilityPolicies,
  responsiveBands,
  visualAccessibilityContract
} from '../config/responsive-accessibility-contract.mjs';
import { mobileTableSourceFiles, requiredMobileTableKinds } from './mobile-table-manifest.mjs';

const root = process.cwd();
const auditPath = path.join(root, 'data/generated/responsive-accessibility-audit.json');
const validationPath = path.join(root, 'data/generated/responsive-accessibility-validation.json');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const unique = (values) => new Set(values).size === values.length;

assert(fs.existsSync(auditPath), 'responsive accessibility audit is missing');
if (!fs.existsSync(auditPath)) {
  console.error(failures.join('\n'));
  process.exit(1);
}

const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
assert(audit.schema_version === '1.0', 'audit schema version must be 1.0');
assert(responsiveBands.length === 3, 'three responsive bands are required');
assert(JSON.stringify(responsiveBands.map((band) => band.id)) === JSON.stringify(['wide', 'medium', 'compact']), 'responsive band order must be wide, medium, compact');
assert(responsiveBands[0].min_width === 1024, 'wide band must begin at 1024 CSS pixels');
assert(responsiveBands[1].min_width === 720 && responsiveBands[1].max_width === 1023, 'medium band must cover 720–1023 CSS pixels');
assert(responsiveBands[2].min_width === 0 && responsiveBands[2].max_width === 719, 'compact band must cover 0–719 CSS pixels');

assert(pageFamilyContracts.length === 8, 'eight page-family contracts are required');
assert(unique(pageFamilyContracts.map((family) => family.id)), 'page-family IDs must be unique');
for (const family of pageFamilyContracts) {
  assert(family.sources.length > 0, `${family.id}: source inventory is missing`);
  assert(family.focus_order[0] === 'skip_link', `${family.id}: focus order must start with skip link`);
  assert(family.focus_order.includes('primary_navigation'), `${family.id}: primary navigation is missing from focus order`);
  assert(family.focus_order.at(-1) === 'footer', `${family.id}: focus order must end with footer`);
  assert(unique([...family.focus_order]), `${family.id}: focus order contains duplicates`);
  assert(typeof family.mobile_rule === 'string' && family.mobile_rule.length > 40, `${family.id}: mobile rule is incomplete`);
  for (const source of family.sources) assert(fs.existsSync(path.join(root, source)), `${family.id}: source file is missing: ${source}`);
}

assert(mobileTableSourceFiles.length === 15, `expected 15 current mobile table source files, found ${mobileTableSourceFiles.length}`);
assert(requiredMobileTableKinds.length === 25, `expected 25 current table kinds, found ${requiredMobileTableKinds.length}`);
assert(mobileTableContracts.length === 25, `expected 25 target table contracts, found ${mobileTableContracts.length}`);
assert(unique(mobileTableContracts.map((entry) => entry.kind)), 'target table kinds must be unique');
assert(JSON.stringify([...mobileTableContracts.map((entry) => entry.kind)].sort()) === JSON.stringify([...requiredMobileTableKinds].sort()), 'target table contracts must exactly cover current table kinds');
for (const entry of mobileTableContracts) {
  assert(entry.mobile_representation !== 'scroll-preserve', `${entry.kind}: horizontal scrolling cannot remain the only mobile representation`);
  assert(entry.horizontal_scroll_fallback === true, `${entry.kind}: full table scroll fallback must remain available`);
  assert(entry.material_fields_preserved === true, `${entry.kind}: material fields must be preserved`);
  assert(entry.row_identity_preserved === true, `${entry.kind}: row identity must be preserved`);
  assert(entry.header_context_preserved === true, `${entry.kind}: header context must be preserved`);
}
assert(mobileTableContracts.find((entry) => entry.kind === 'stablecoin-deployments')?.long_identifier_copy_required === true, 'deployment cards must require long-identifier copy controls');

assert(audit.totals?.current_tables === 25, `expected 25 current tables, found ${audit.totals?.current_tables}`);
assert(audit.totals?.tables_currently_scroll_only === 25, 'all current protected tables must remain recorded as scroll-preserve before implementation');
assert(audit.current_baseline?.tables_with_non_scroll_strategy === 0, 'current non-scroll mobile implementation changed and requires re-audit');
assert((audit.contract_alignment?.missing_target_table_contracts ?? []).length === 0, 'target table contracts are missing current table kinds');
assert((audit.contract_alignment?.unknown_target_table_contracts ?? []).length === 0, 'target table contracts contain unknown table kinds');
assert((audit.contract_alignment?.missing_current_tables ?? []).length === 0, 'current protected tables are missing');
assert((audit.contract_alignment?.duplicate_current_tables ?? []).length === 0, 'current protected table identities are duplicated');

const css = audit.current_baseline?.css ?? {};
assert(JSON.stringify(css.media_breakpoints_max_width_px) === JSON.stringify([980, 820, 620, 560]), 'current CSS breakpoint inventory changed without contract review');
assert(css.horizontal_overflow_present === true, 'current horizontal table access must remain available');
assert(css.table_min_width_present === true, 'current table minimum width protection is missing');
assert(css.generic_column_hiding_present === false, 'generic mobile column hiding is prohibited');
assert(css.focus_visible_rule_count > 0, 'current CSS must retain at least one focus-visible rule');

const layout = audit.current_baseline?.layout ?? {};
assert(layout.language_declared === true, 'document language must remain declared');
assert(layout.viewport_declared === true, 'viewport metadata must remain declared');
assert(layout.main_landmark_present === true, 'main landmark must remain present');
assert(layout.primary_navigation_label_present === true, 'primary navigation label must remain present');

assert(keyboardContracts.length === 10, 'ten keyboard interaction contracts are required');
assert(unique(keyboardContracts.map((entry) => entry.id)), 'keyboard contract IDs must be unique');
for (const entry of keyboardContracts) {
  assert(entry.keys.includes('Tab'), `${entry.id}: Tab behavior is missing`);
  assert(typeof entry.behavior === 'string' && entry.behavior.length > 30, `${entry.id}: keyboard behavior is incomplete`);
}
assert(keyboardContracts.find((entry) => entry.id === 'global_navigation')?.keys.includes('Escape'), 'global navigation must define Escape behavior');
assert(keyboardContracts.find((entry) => entry.id === 'copy_identifier')?.keys.includes('Enter'), 'copy action must support Enter');

assert(announcementContracts.length === 5, 'five announcement contracts are required');
assert(unique(announcementContracts.map((entry) => entry.id)), 'announcement contract IDs must be unique');
assert(announcementContracts.find((entry) => entry.id === 'comparison_limit')?.priority === 'assertive', 'comparison limit must use assertive announcement');
for (const entry of announcementContracts) assert(entry.message_content.length > 0, `${entry.id}: announcement content is missing`);

assert(longValueContract.full_value_remains_in_dom === true, 'full long values must remain in the DOM');
assert(longValueContract.visual_wrapping === 'overflow-wrap:anywhere', 'long values must wrap anywhere');
assert(longValueContract.ellipsis_without_accessible_full_value_prohibited === true, 'ellipsis-only long values are prohibited');
assert(longValueContract.copy_action_required_for_contract_and_transaction_identifiers === true, 'contract and transaction IDs require copy actions');
assert(longValueContract.copy_feedback_announced === true, 'copy feedback must be announced');

assert(visualAccessibilityContract.normal_text_contrast_minimum === 4.5, 'normal text contrast minimum must be 4.5:1');
assert(visualAccessibilityContract.large_text_contrast_minimum === 3, 'large text contrast minimum must be 3:1');
assert(visualAccessibilityContract.non_text_ui_contrast_minimum === 3, 'non-text UI contrast minimum must be 3:1');
assert(visualAccessibilityContract.minimum_pointer_target_css_px === 44, 'minimum pointer target must be 44 CSS pixels');
for (const [key, value] of Object.entries(visualAccessibilityContract)) {
  if (typeof value === 'boolean') assert(value === true, `visual accessibility policy ${key} must remain true`);
}
for (const [key, value] of Object.entries(motionContract)) assert(value === true, `motion policy ${key} must remain true`);

for (const [key, value] of Object.entries(responsiveAccessibilityPolicies)) {
  if (typeof value === 'boolean' && key !== 'route_changes_allowed') assert(value === true, `responsive accessibility policy ${key} must remain true`);
}
assert(responsiveAccessibilityPolicies.implementation_starts_at_pr === 23, 'responsive implementation must begin with the global shell in PR 23');
assert(responsiveAccessibilityPolicies.route_changes_allowed === false, 'PR 21 must not change routes');

const gaps = audit.implementation_gaps ?? {};
assert(gaps.table_transformations_pending?.length === 25, 'all 25 table transformations must remain explicit implementation work');
assert(gaps.skip_link_missing === true, 'current skip-link gap changed and requires re-audit');
assert(gaps.main_target_missing === true, 'current main-target gap changed and requires re-audit');
assert(gaps.current_page_state_missing === true, 'current navigation-state gap changed and requires re-audit');
assert(gaps.reduced_motion_missing === true, 'current reduced-motion gap changed and requires re-audit');
assert(gaps.forced_colors_missing === true, 'current forced-colors gap changed and requires re-audit');
assert(gaps.long_value_wrapping_missing === true, 'current long-value wrapping gap changed and requires re-audit');
assert(gaps.minimum_target_rule_missing === true, 'current minimum-target gap changed and requires re-audit');

const validation = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  totals: {
    responsive_bands: responsiveBands.length,
    page_families: pageFamilyContracts.length,
    table_contracts: mobileTableContracts.length,
    keyboard_contracts: keyboardContracts.length,
    announcement_contracts: announcementContracts.length,
    current_implementation_gaps: Object.values(gaps).flat().length,
    failures: failures.length
  },
  failures
};

fs.writeFileSync(validationPath, `${JSON.stringify(validation, null, 2)}\n`);
if (failures.length) {
  console.error(JSON.stringify(validation, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(validation, null, 2));
