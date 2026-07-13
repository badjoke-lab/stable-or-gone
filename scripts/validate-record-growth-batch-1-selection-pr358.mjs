import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readRows = (file) => {
  const value = readJson(file);
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.records)) return value.records;
  throw new Error(`${file}: expected array or { records: [] }`);
};
const normalize = (value) => String(value ?? '').trim().toLowerCase().replace(/[\s_-]+/g, ' ');
const compact = (value) => normalize(value).replace(/[^a-z0-9]+/g, '');

const config = readJson('config/record-growth-batch-1-pr358.json');
const research = readJson(config.source_research);
const handoff = readJson(config.source_handoff);
const baseline = loadRegistryV2Baseline(root);
const stablecoins = (baseline.data_groups?.stablecoins ?? []).flatMap(readRows);
const researchById = new Map((research.candidates ?? []).map((row) => [row.candidate_id, row]));
const canonicalById = new Map(stablecoins.map((row) => [row.id, row]));

const expected = [
  { candidate_id: 'sog_cand_pr358_xusd', asset_id: 'sog_st_xusd', slug: 'straitsx-usd-xusd', name: 'StraitsX USD', symbol: 'XUSD', mechanism: 'fiat_backed_stablecoin' },
  { candidate_id: 'sog_cand_pr358_usdb', asset_id: 'sog_st_usdb', slug: 'blast-usdb', name: 'USDB', symbol: 'USDB', mechanism: 'protocol_bridged_yield_bearing_stablecoin' }
];

check(config.schema_version === '1.0', 'config schema version mismatch');
check(config.config_id === 'sog_record_growth_batch_1_pr358_v1', 'config ID mismatch');
check(config.status === 'reviewed_full_record_promotion_pending_checkpoint', 'config status must reflect reviewed full-record promotion');
check(config.review_pr === 358, 'review PR must be 358');
check(config.selection_rule === 'context_grouped_reviewed_new_identity_non_ranking', 'selection rule mismatch');
check(config.context_group === 'current_usd_payment_stablecoins_with_distinct_stabilization_models', 'context group mismatch');
check(config.canonical_count_before === 110, 'pre-growth canonical count must be 110');
check(config.maximum_new_assets === 2, 'maximum new assets must be two');
check(config.planned_canonical_count_after === 112 && config.canonical_count_after === 112, 'post-growth canonical count must be 112');
check(config.selected_candidates?.length === 2, 'exactly two candidates must be selected');
check(config.next_pr === 359, 'next PR must be 359');

check(handoff.status === 'reviewed_merged_handoff', 'PR #357 handoff status mismatch');
check(handoff.review_pr === 357, 'PR #357 handoff review PR mismatch');
check(handoff.source_merge_commit === 'b849bfd582209aad217dd1af2198c755ff0760ab', 'PR #357 handoff merge commit mismatch');
check(handoff.canonical_counts?.assets === 110, 'PR #357 handoff asset count mismatch');
check(handoff.canonical_counts?.evidence === 551, 'PR #357 handoff Evidence count mismatch');
check(handoff.canonical_counts?.market_access_records === 4, 'PR #357 handoff Market Access count mismatch');

check(research.schema_version === '1.0', 'research schema version mismatch');
check(research.status === 'reviewed_candidate_checkpoint_not_canonical', 'research artifact must remain noncanonical');
check(research.review_pr === 358, 'research review PR mismatch');
check(research.context_group === config.context_group, 'research/config context group mismatch');
check(research.canonical_boundary?.included_in_public_canonical_counts === false, 'research artifact must remain outside canonical counts');
check(research.canonical_boundary?.automatic_promotion === false, 'automatic promotion must remain disabled');
check(research.canonical_boundary?.manual_review_required === true, 'manual review must remain required');
check(research.candidates?.length === 2, 'research must contain exactly two candidates');

check(JSON.stringify(config.selected_candidates.map((row) => row.candidate_id)) === JSON.stringify(expected.map((row) => row.candidate_id)), 'candidate order or identity mismatch');
check(JSON.stringify(config.selected_candidates.map((row) => row.proposed_asset_id)) === JSON.stringify(expected.map((row) => row.asset_id)), 'promoted asset ID order mismatch');
check(stablecoins.length === 112, `post-promotion canonical count must be 112, found ${stablecoins.length}`);
check(new Set(stablecoins.map((row) => row.id)).size === stablecoins.length, 'canonical stablecoin IDs must remain unique');
check(new Set(stablecoins.map((row) => row.slug)).size === stablecoins.length, 'canonical stablecoin slugs must remain unique');

for (const item of expected) {
  const selected = config.selected_candidates.find((row) => row.candidate_id === item.candidate_id);
  const candidate = researchById.get(item.candidate_id);
  const canonical = canonicalById.get(item.asset_id);
  const label = item.candidate_id;

  check(Boolean(selected), `${label}: selection config missing`);
  check(Boolean(candidate), `${label}: research candidate missing`);
  check(Boolean(canonical), `${label}: promoted canonical record missing`);
  if (!candidate || !canonical || !selected) continue;

  check(selected.proposed_asset_id === item.asset_id, `${label}: selected asset ID mismatch`);
  check(selected.proposed_slug === item.slug, `${label}: selected slug mismatch`);
  check(selected.symbol === item.symbol, `${label}: selected symbol mismatch`);
  check(candidate.proposed_asset_id === item.asset_id, `${label}: research asset ID mismatch`);
  check(candidate.proposed_slug === item.slug, `${label}: research slug mismatch`);
  check(candidate.canonical_name === item.name, `${label}: research canonical name mismatch`);
  check(candidate.symbol === item.symbol, `${label}: research symbol mismatch`);
  check(candidate.mechanism === item.mechanism, `${label}: mechanism mismatch`);
  check(candidate.selection_decision === 'selected_for_full_record_review', `${label}: selection decision mismatch`);
  check(Array.isArray(candidate.source_leads) && candidate.source_leads.length >= 3, `${label}: at least three source leads required`);
  check(candidate.source_leads.some((lead) => lead.official === true), `${label}: at least one official source lead required`);
  check(Array.isArray(candidate.blocking_unknowns) && candidate.blocking_unknowns.length >= 3, `${label}: blocking unknowns must remain explicit`);

  check(canonical.slug === item.slug, `${label}: canonical slug mismatch`);
  check(canonical.name === item.name, `${label}: canonical name mismatch`);
  check(canonical.symbol === item.symbol, `${label}: canonical symbol mismatch`);
  check(canonical.status === 'active', `${label}: canonical status must be active`);
  check(canonical.peg_asset === 'USD', `${label}: canonical peg asset must be USD`);
  check(canonical.confidence === 'high', `${label}: canonical confidence must be high`);

  const identityMatches = stablecoins.filter((row) => (
    row.id === item.asset_id
    || normalize(row.slug) === normalize(item.slug)
    || normalize(row.name) === normalize(item.name)
    || compact(row.name) === compact(item.name)
    || normalize(row.symbol) === normalize(item.symbol)
    || (row.aliases ?? []).some((alias) => (candidate.aliases ?? []).some((candidateAlias) => normalize(alias) === normalize(candidateAlias)))
  ));
  check(identityMatches.length === 1 && identityMatches[0]?.id === item.asset_id, `${label}: promoted identity collides with another canonical record`);
}

for (const [field, expectedValue] of Object.entries({
  entity: true, classification: true, profile: true, legal_profile: true, income_profile: true,
  reserve_components: true, organization_relationships: true, deployments: true,
  evidence_relation_parity: true, known_unknowns_for_unresolved_fields: true
})) check(config.full_record_minimum?.[field] === expectedValue, `full-record minimum changed: ${field}`);
check(config.full_record_minimum?.events_per_asset_minimum === 1, 'minimum event count must be one per asset');
check(config.full_record_minimum?.evidence_per_asset_minimum === 3, 'minimum Evidence count must be three per asset');
check(config.promotion_policy?.automatic === false, 'automatic promotion must remain disabled');
check(config.promotion_policy?.manual_review_required === true, 'manual review must remain required');
check(config.promotion_policy?.thin_record_allowed === false, 'thin records must remain forbidden');
for (const field of ['new_public_surface_allowed','market_access_records_allowed','compare_preset_membership_change_allowed','comparison_readiness_semantics_change_allowed','facet_freshness_semantics_change_allowed','monitoring_auto_promotion_allowed','asset_rank','single_composite_score']) {
  check(config.boundaries?.[field] === false, `boundary must remain false: ${field}`);
}

if (failures.length) {
  console.error('PR #358 Record Growth Batch 1 selection and promotion validation failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  stage: config.status,
  context_group: config.context_group,
  canonical_assets_before: config.canonical_count_before,
  canonical_assets_after: stablecoins.length,
  promoted_asset_ids: expected.map((row) => row.asset_id),
  rejected_duplicate_candidates: ['sog_st_usdg', 'sog_st_usd1', 'sog_st_sofiusd'],
  automatic_promotion: false,
  next_pr: config.next_pr
}, null, 2));
