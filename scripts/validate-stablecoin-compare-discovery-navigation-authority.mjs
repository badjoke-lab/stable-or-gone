import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const json = (path) => JSON.parse(read(path));
const failures = [];
const check = (value, message) => { if (!value) failures.push(message); };

const authority = json('config/stablecoin-compare-discovery-navigation-authority.json');
const amendment = read('docs/roadmap-amendments/2026-08-10-stablecoin-compare-discovery-navigation-remediation.md');
const spec = read('docs/quality/stablecoin-compare-discovery-navigation-remediation-spec.md');

check(authority.authority_id === 'sog_stablecoin_compare_discovery_navigation_remediation_2026_08_10', 'authority id');
check(authority.status === 'active_after_merge', 'historical authority package status changed');
check(authority.entry_main_commit === 'f275fd4b2f5efe266cf053858934cd22fa87664c', 'entry main commit');
check(authority.public_route === '/stablecoins/', 'public route');
check(authority.selection?.minimum_ready === 2 && authority.selection?.maximum === 4 && authority.selection?.reject_fifth === true, 'selection bounds');
check(authority.selection?.dock_visible_from_selection_count === 1, 'dock discovery threshold');
for (const value of Object.values(authority.canonical_delta ?? {})) check(value === 0, 'canonical delta must remain zero');
check(authority.canonical_baseline?.stable_assets === 119, 'stable asset baseline');
check(authority.canonical_baseline?.evidence === 585, 'Evidence baseline');
check(authority.canonical_baseline?.evidence_relations === 585, 'Evidence Relation baseline');
check(authority.canonical_baseline?.market_access === 12, 'Market Access baseline');
check(authority.canonical_baseline?.archive_recorded === 463 && authority.canonical_baseline?.archive_not_recorded === 122, 'historical archive baseline');
check(authority.preserved_review_gate?.stage === 'REVIEW_GATE', 'preserved review gate stage');
check(authority.preserved_review_gate?.reviewed === 10 && authority.preserved_review_gate?.proposals === 8 && authority.preserved_review_gate?.no_safe_change === 2, 'preserved review counts');
check(authority.preserved_review_gate?.canonical_promotions_authorized === 0, 'no archive implementation authority');

const requiredFeatures = [
  'comparison_panel_before_public_register_results',
  'persistent_compare_dock_after_first_selection',
  'dock_selected_count_and_selected_record_identity',
  'dock_view_comparison_action',
  'in_panel_add_or_replace_record_control',
  'remove_then_replace_without_register_scroll',
  'preserve_two_three_four_record_matrix',
  'preserve_differences_only',
  'preserve_shared_compare_url_restoration'
];
for (const feature of requiredFeatures) check(authority.required_features?.includes(feature), `missing required feature ${feature}`);

for (const marker of ['persistent Compare dock', 'Add / replace record', 'REVIEW_GATE']) check(amendment.includes(marker), `historical amendment missing ${marker}`);
for (const marker of ['comparison panel must precede', 'Compare dock', 'Add / replace record', 'No page-level horizontal overflow']) check(spec.includes(marker), `historical spec missing ${marker}`);

// This validator intentionally does not pin current AGENTS/roadmap/governance/deployment text.
// Later merged authorities own the forward workstream pointer while this package remains an immutable historical dependency.

if (failures.length) {
  console.error('Stablecoin Compare discovery/navigation authority validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  authority_id: authority.authority_id,
  stage: 'HISTORICAL_AUTHORITY_PACKAGE_VALID',
  public_route: authority.public_route,
  selection_bounds: [authority.selection.minimum_ready, authority.selection.maximum],
  canonical_delta: 0,
  preserved_evidence_review_gate: authority.preserved_review_gate
}, null, 2));
