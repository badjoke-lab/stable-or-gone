import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
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
import { implementedMobileTableRepresentations, mobileTableSourceFiles, requiredMobileTableKinds } from './mobile-table-manifest.mjs';

const root = process.cwd();
const outputPath = path.join(root, 'data/generated/responsive-accessibility-audit.json');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const unique = (values) => [...new Set(values)].sort();

const tableInventory = [];
for (const file of mobileTableSourceFiles) {
  const source = read(file);
  for (const match of source.matchAll(/<table\b[^>]*>/g)) {
    const tag = match[0];
    tableInventory.push({
      source_file: file,
      kind: tag.match(/data-table-kind="([^"]+)"/)?.[1] ?? null,
      mobile_strategy: tag.match(/data-mobile-table="([^"]+)"/)?.[1] ?? null,
      has_caption: /<caption\b/.test(source),
      header_count: [...source.matchAll(/<th\b/g)].length
    });
  }
}

const implementedRepresentations = Object.entries(implementedMobileTableRepresentations).map(([kind, file]) => {
  const sourceExists = fs.existsSync(path.join(root, file));
  const source = sourceExists ? read(file) : '';
  const generatedRuntime = file === 'src/components/MobileTableRuntime.astro';
  return {
    kind,
    source_file: file,
    source_exists: sourceExists,
    strategy: generatedRuntime ? 'generated_from_server_table' : 'explicit_server_markup',
    marker_present: generatedRuntime
      ? source.includes('buildMobileTableRepresentations') && source.includes('data.mobileRepresentationFor = kind')
      : source.includes(`data-mobile-representation-for="${kind}"`)
  };
});
const implementedKinds = implementedRepresentations.filter((entry) => entry.source_exists && entry.marker_present).map((entry) => entry.kind);

const accessibilityCssFiles = [
  'src/styles/global.css',
  'src/styles/shell.css',
  'src/styles/accessibility-utilities.css',
  'src/styles/guide-editorial-v3.css',
  'src/styles/reference-utility-v3.css',
  'src/styles/mobile-accessibility-v3.css'
];
const css = accessibilityCssFiles.map(read).join('\n');
const layout = read('src/layouts/BaseLayout.astro');
const mediaBreakpoints = unique([...css.matchAll(/@media\s*\(max-width:\s*(\d+)px\)/g)].map((match) => Number(match[1]))).sort((a, b) => b - a);
const sourceSet = unique(['src/layouts/BaseLayout.astro', 'src/components/MobileTableRuntime.astro', ...mobileTableSourceFiles, ...pageFamilyContracts.flatMap((family) => family.sources)]);
const sourceSignals = sourceSet.map((file) => {
  const source = read(file);
  return {
    file,
    h1_count: [...source.matchAll(/<h1\b/g)].length,
    h2_count: [...source.matchAll(/<h2\b/g)].length,
    input_count: [...source.matchAll(/<input\b/g)].length,
    select_count: [...source.matchAll(/<select\b/g)].length,
    button_count: [...source.matchAll(/<button\b/g)].length,
    details_count: [...source.matchAll(/<details\b/g)].length,
    label_count: [...source.matchAll(/<label\b/g)].length,
    fieldset_count: [...source.matchAll(/<fieldset\b/g)].length,
    aria_live_count: [...source.matchAll(/aria-live=/g)].length,
    aria_expanded_count: [...source.matchAll(/aria-expanded=/g)].length,
    aria_controls_count: [...source.matchAll(/aria-controls=/g)].length,
    aria_current_count: [...source.matchAll(/aria-current=/g)].length
  };
});

const targetTableKinds = mobileTableContracts.map((entry) => entry.kind);
const currentTableKinds = tableInventory.map((entry) => entry.kind).filter(Boolean);
const missingTargetTableContracts = requiredMobileTableKinds.filter((kind) => !targetTableKinds.includes(kind));
const unknownTargetTableContracts = targetTableKinds.filter((kind) => !requiredMobileTableKinds.includes(kind));
const missingCurrentTables = requiredMobileTableKinds.filter((kind) => !currentTableKinds.includes(kind));
const duplicateCurrentTables = unique(currentTableKinds.filter((kind, index) => currentTableKinds.indexOf(kind) !== index));

const dynamicLanguageContract = layout.includes('language?: string')
  && layout.includes("language = 'en'")
  && layout.includes('<html lang={language}>');
const currentBaseline = {
  table_source_files: mobileTableSourceFiles.length,
  table_count: tableInventory.length,
  table_kinds: currentTableKinds.sort(),
  tables_using_scroll_preserve: tableInventory.filter((entry) => entry.mobile_strategy === 'scroll-preserve').length,
  implemented_mobile_representations: implementedKinds.length,
  implemented_mobile_table_kinds: implementedKinds.sort(),
  explicit_mobile_representations: implementedRepresentations.filter((entry) => entry.strategy === 'explicit_server_markup' && entry.marker_present).length,
  generated_mobile_representations: implementedRepresentations.filter((entry) => entry.strategy === 'generated_from_server_table' && entry.marker_present).length,
  mobile_representation_checks: implementedRepresentations,
  missing_current_tables: missingCurrentTables,
  duplicate_current_tables: duplicateCurrentTables,
  css: {
    source_files: accessibilityCssFiles,
    media_breakpoints_max_width_px: mediaBreakpoints,
    horizontal_overflow_present: css.includes('overflow-x: auto'),
    table_min_width_present: /table\[data-mobile-table="scroll-preserve"\][^{]*\{[^}]*(?:min-width|max-width):/s.test(css),
    generic_column_hiding_present: /(?:th|td):nth-child\([^)]*\)[^{]*\{[^}]*display\s*:\s*none/s.test(css),
    focus_visible_rule_count: [...css.matchAll(/:focus-visible/g)].length,
    reduced_motion_present: /prefers-reduced-motion/.test(css),
    forced_colors_present: /forced-colors/.test(css),
    overflow_wrap_anywhere_present: /overflow-wrap\s*:\s*anywhere/.test(css),
    minimum_target_44_present: /(?:min-width|min-height|width|height)\s*:\s*44px/.test(css),
    compact_320_present: /max-width:\s*(?:360|480|520|719)px/.test(css)
  },
  layout: {
    language_declared: /<html\s+lang="en"/.test(layout) || dynamicLanguageContract,
    viewport_declared: /name="viewport"/.test(layout),
    main_landmark_present: /<main\b/.test(layout),
    main_landmark_has_id: /<main\b[^>]*\bid="main-content"/.test(layout),
    skip_link_present: /class="skip-link"[^>]*href="#main-content"/.test(layout),
    primary_navigation_label_present: /<nav\b[^>]*aria-label="Primary navigation"/.test(layout),
    current_page_state_present: /aria-current=/.test(layout),
    disclosure_state_sync_present: layout.includes("setAttribute('aria-expanded', String(details.open))"),
    escape_focus_return_present: layout.includes("event.key !== 'Escape'") && layout.includes('trigger.focus()'),
    anchor_focus_present: layout.includes('focusAnchorTarget'),
    copy_feedback_present: layout.includes('data-copy-feedback') && layout.includes("aria-live', 'polite'")
  },
  source_signals: sourceSignals
};

const implementationGaps = {
  table_transformations_pending: mobileTableContracts.filter((contract) => !implementedKinds.includes(contract.kind)).map((contract) => contract.kind),
  skip_link_missing: !currentBaseline.layout.skip_link_present,
  main_target_missing: !currentBaseline.layout.main_landmark_has_id,
  current_page_state_missing: !currentBaseline.layout.current_page_state_present,
  disclosure_state_sync_missing: !currentBaseline.layout.disclosure_state_sync_present,
  escape_focus_return_missing: !currentBaseline.layout.escape_focus_return_present,
  anchor_focus_missing: !currentBaseline.layout.anchor_focus_present,
  copy_feedback_missing: !currentBaseline.layout.copy_feedback_present,
  reduced_motion_missing: !currentBaseline.css.reduced_motion_present,
  forced_colors_missing: !currentBaseline.css.forced_colors_present,
  long_value_wrapping_missing: !currentBaseline.css.overflow_wrap_anywhere_present,
  minimum_target_rule_missing: !currentBaseline.css.minimum_target_44_present,
  compact_320_rule_missing: !currentBaseline.css.compact_320_present
};

const audit = {
  schema_version: '2.0',
  generated_at: new Date().toISOString(),
  implementation_boundary: {
    specification_only: responsiveAccessibilityPolicies.implementation_deferred,
    implementation_starts_at_pr: responsiveAccessibilityPolicies.implementation_starts_at_pr,
    route_changes_allowed: responsiveAccessibilityPolicies.route_changes_allowed
  },
  totals: {
    responsive_bands: responsiveBands.length,
    page_families: pageFamilyContracts.length,
    current_table_source_files: mobileTableSourceFiles.length,
    current_tables: tableInventory.length,
    required_table_kinds: requiredMobileTableKinds.length,
    target_table_contracts: mobileTableContracts.length,
    tables_with_scroll_fallback: currentBaseline.tables_using_scroll_preserve,
    implemented_mobile_representations: implementedKinds.length,
    explicit_mobile_representations: currentBaseline.explicit_mobile_representations,
    generated_mobile_representations: currentBaseline.generated_mobile_representations,
    keyboard_contracts: keyboardContracts.length,
    announcement_contracts: announcementContracts.length,
    source_files_scanned: sourceSignals.length,
    route_changes: responsiveAccessibilityPolicies.route_changes_allowed ? 1 : 0
  },
  current_baseline: currentBaseline,
  target_contract: {
    responsive_bands: responsiveBands,
    page_families: pageFamilyContracts,
    mobile_tables: mobileTableContracts,
    keyboard: keyboardContracts,
    announcements: announcementContracts,
    long_values: longValueContract,
    visual_accessibility: visualAccessibilityContract,
    motion: motionContract,
    policies: responsiveAccessibilityPolicies
  },
  contract_alignment: {
    missing_target_table_contracts: missingTargetTableContracts,
    unknown_target_table_contracts: unknownTargetTableContracts,
    missing_current_tables: missingCurrentTables,
    duplicate_current_tables: duplicateCurrentTables
  },
  implementation_gaps: implementationGaps,
  contract_digest: `sha256:${createHash('sha256').update(JSON.stringify({ responsiveBands, pageFamilyContracts, mobileTableContracts, keyboardContracts, announcementContracts, longValueContract, visualAccessibilityContract, motionContract, responsiveAccessibilityPolicies })).digest('hex')}`
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(audit, null, 2)}\n`);
console.log(JSON.stringify(audit.totals, null, 2));
