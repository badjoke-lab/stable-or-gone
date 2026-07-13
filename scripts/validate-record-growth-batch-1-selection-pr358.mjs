import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const failures = [];
const fail = (condition, message) => { if (!condition) failures.push(message); };
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const asRows = (file) => {
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
const stablecoins = (baseline.data_groups?.stablecoins ?? []).flatMap(asRows);
const researchById = new Map((research.candidates ?? []).map((row) => [row.candidate_id, row]));

fail(config.schema_version === '1.0', 'config schema version mismatch');
fail(config.config_id === 'sog_record_growth_batch_1_pr358_v1', 'config ID mismatch');
fail(config.status === 'bounded_candidate_audit_then_manual_full_record_promotion', 'config status mismatch');
fail(config.review_pr === 358, 'review PR must be 358');
fail(config.selection_rule === 'context_grouped_reviewed_new_identity_non_ranking', 'selection rule mismatch');
fail(config.context_group === 'current_usd_payment_stablecoins_with_distinct_stabilization_models', 'context group mismatch');
fail(config.canonical_count_before === 110, 'pre-growth canonical count must be 110');
fail(config.maximum_new_assets === 2, 'maximum new assets must be two');
fail(config.planned_canonical_count_after === 112, 'maximum planned post-growth count must be 112');
fail(config.selected_candidates?.length === 2, 'exactly two candidates must be selected');
fail(config.next_pr === 359, 'next PR must be 359');

fail(handoff.status === 'reviewed_merged_handoff', 'PR #357 handoff status mismatch');
fail(handoff.review_pr === 357, 'PR #357 handoff review PR mismatch');
fail(handoff.source_merge_commit === 'b849bfd582209aad217dd1af2198c755ff0760ab', 'PR #357 handoff merge commit mismatch');
fail(handoff.canonical_counts?.assets === 110, 'PR #357 handoff asset count mismatch');
fail(handoff.canonical_counts?.evidence === 551, 'PR #357 handoff Evidence count mismatch');
fail(handoff.canonical_counts?.market_access_records === 4, 'PR #357 handoff Market Access count mismatch');
fail(handoff.next_work_item === 'PR #358 Record Growth Batch 1', 'PR #357 handoff next work item mismatch');

fail(research.schema_version === '1.0', 'research schema version mismatch');
fail(research.status === 'reviewed_candidate_checkpoint_not_canonical', 'research status must remain noncanonical');
fail(research.review_pr === 358, 'research review PR mismatch');
fail(research.context_group === config.context_group, 'research/config context group mismatch');
fail(research.canonical_boundary?.included_in_public_canonical_counts === false, 'research must remain outside canonical counts');
fail(research.canonical_boundary?.automatic_promotion === false, 'research must not auto-promote');
fail(research.canonical_boundary?.manual_review_required === true, 'research must require manual review');
fail(research.candidates?.length === 2, 'research must contain exactly two candidates');

const expectedCandidateIds = ['sog_cand_pr358_xusd', 'sog_cand_pr358_usdb'];
const expectedAssetIds = ['sog_st_xusd', 'sog_st_usdb'];
const expectedSlugs = ['straitsx-usd-xusd', 'blast-usdb'];
const expectedSymbols = ['XUSD', 'USDB'];
const expectedMechanisms = new Map([
  ['sog_cand_pr358_xusd', 'fiat_backed_stablecoin'],
  ['sog_cand_pr358_usdb', 'protocol_bridged_yield_bearing_stablecoin']
]);
fail(JSON.stringify(config.selected_candidates.map((row) => row.candidate_id)) === JSON.stringify(expectedCandidateIds), 'candidate order or identity mismatch');
fail(JSON.stringify(config.selected_candidates.map((row) => row.proposed_asset_id)) === JSON.stringify(expectedAssetIds), 'proposed asset ID order mismatch');
fail(JSON.stringify(config.selected_candidates.map((row) => row.proposed_slug)) === JSON.stringify(expectedSlugs), 'proposed slug order mismatch');
fail(JSON.stringify(config.selected_candidates.map((row) => row.symbol)) === JSON.stringify(expectedSymbols), 'candidate symbol order mismatch');

const canonicalIds = new Set(stablecoins.map((row) => row.id));
const canonicalSlugs = new Set(stablecoins.map((row) => normalize(row.slug)));
const canonicalNames = new Set(stablecoins.flatMap((row) => [row.name, row.canonical_name]).map(normalize).filter(Boolean));
const canonicalCompactNames = new Set(stablecoins.flatMap((row) => [row.name, row.canonical_name]).map(compact).filter(Boolean));
const canonicalSymbols = new Set(stablecoins.map((row) => normalize(row.symbol)).filter(Boolean));
const canonicalAliases = new Set(stablecoins.flatMap((row) => row.aliases ?? []).map(normalize).filter(Boolean));
const selectedIds = new Set();
const selectedSlugs = new Set();
const selectedNames = new Set();
const selectedSymbols = new Set();

for (const selected of config.selected_candidates) {
  const candidate = researchById.get(selected.candidate_id);
  const label = selected.candidate_id;
  fail(Boolean(candidate), `${label}: candidate missing from research checkpoint`);
  if (!candidate) continue;

  fail(/^sog_cand_pr358_[a-z0-9]+$/.test(selected.candidate_id), `${label}: invalid candidate ID`);
  fail(/^sog_st_[a-z0-9]+$/.test(selected.proposed_asset_id), `${label}: invalid proposed asset ID`);
  fail(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(selected.proposed_slug), `${label}: invalid proposed slug`);
  fail(selected.proposed_asset_id === candidate.proposed_asset_id, `${label}: config/research asset ID mismatch`);
  fail(selected.proposed_slug === candidate.proposed_slug, `${label}: config/research slug mismatch`);
  fail(selected.symbol === candidate.symbol, `${label}: config/research symbol mismatch`);
  fail(candidate.proposed_status === 'active', `${label}: proposed status must be active`);
  fail(candidate.reference_asset === 'USD', `${label}: reference asset must be USD`);
  fail(candidate.mechanism === expectedMechanisms.get(label), `${label}: mechanism mismatch`);
  fail(typeof candidate.stabilization === 'string' && candidate.stabilization.length > 0, `${label}: stabilization description missing`);
  fail(candidate.selection_decision === 'selected_for_full_record_review', `${label}: selection decision mismatch`);
  fail(Array.isArray(candidate.aliases), `${label}: aliases must be an array`);
  fail(Array.isArray(candidate.value_contribution) && candidate.value_contribution.length >= 2, `${label}: value contribution must contain at least two entries`);
  fail(Array.isArray(candidate.proposed_event_plan) && candidate.proposed_event_plan.length >= 1, `${label}: event plan required`);
  fail(Array.isArray(candidate.proposed_record_families) && candidate.proposed_record_families.length >= 12, `${label}: complete record-family plan required`);
  fail(Array.isArray(candidate.blocking_unknowns) && candidate.blocking_unknowns.length >= 3, `${label}: blocking unknowns must remain explicit`);
  fail(candidate.duplicate_review?.decision === 'new_identity_pending_full_canonical_duplicate_audit', `${label}: duplicate decision mismatch`);
  fail(Array.isArray(candidate.source_leads) && candidate.source_leads.length >= 3, `${label}: at least three source leads required`);
  fail(candidate.source_leads.some((lead) => lead.official === true), `${label}: at least one official source lead required`);
  for (const [index, lead] of candidate.source_leads.entries()) {
    fail(/^https:\/\//.test(lead.url ?? ''), `${label}: source lead ${index + 1} must use HTTPS`);
    fail(typeof lead.publisher === 'string' && lead.publisher.length > 0, `${label}: source lead ${index + 1} publisher missing`);
    fail(Array.isArray(lead.claim_scopes) && lead.claim_scopes.length >= 1, `${label}: source lead ${index + 1} claim scopes missing`);
  }

  fail(!canonicalIds.has(candidate.proposed_asset_id), `${label}: proposed asset ID already canonical`);
  fail(!canonicalSlugs.has(normalize(candidate.proposed_slug)), `${label}: proposed slug already canonical`);
  fail(!canonicalNames.has(normalize(candidate.canonical_name)), `${label}: canonical name already exists`);
  fail(!canonicalCompactNames.has(compact(candidate.canonical_name)), `${label}: compact canonical name collision`);
  fail(!canonicalSymbols.has(normalize(candidate.symbol)), `${label}: symbol already canonical`);
  for (const alias of candidate.aliases) {
    const normalized = normalize(alias);
    fail(!canonicalNames.has(normalized), `${label}: alias collides with canonical name: ${alias}`);
    fail(!canonicalAliases.has(normalized), `${label}: alias collides with canonical alias: ${alias}`);
  }

  fail(!selectedIds.has(candidate.proposed_asset_id), `${label}: duplicate proposed ID within batch`);
  fail(!selectedSlugs.has(normalize(candidate.proposed_slug)), `${label}: duplicate proposed slug within batch`);
  fail(!selectedNames.has(normalize(candidate.canonical_name)), `${label}: duplicate canonical name within batch`);
  fail(!selectedSymbols.has(normalize(candidate.symbol)), `${label}: duplicate symbol within batch`);
  selectedIds.add(candidate.proposed_asset_id);
  selectedSlugs.add(normalize(candidate.proposed_slug));
  selectedNames.add(normalize(candidate.canonical_name));
  selectedSymbols.add(normalize(candidate.symbol));
}

for (const [field, expected] of Object.entries({
  entity: true,
  classification: true,
  profile: true,
  legal_profile: true,
  income_profile: true,
  reserve_components: true,
  organization_relationships: true,
  deployments: true,
  evidence_relation_parity: true,
  known_unknowns_for_unresolved_fields: true
})) fail(config.full_record_minimum?.[field] === expected, `full-record minimum changed: ${field}`);
fail(config.full_record_minimum?.events_per_asset_minimum === 1, 'minimum event count must be one per promoted asset');
fail(config.full_record_minimum?.evidence_per_asset_minimum === 3, 'minimum Evidence count must be three per promoted asset');

fail(config.promotion_policy?.automatic === false, 'automatic promotion must remain disabled');
fail(config.promotion_policy?.manual_review_required === true, 'manual review must remain required');
fail(config.promotion_policy?.candidate_selection_is_not_canonical_promotion === true, 'candidate selection must not equal canonical promotion');
fail(config.promotion_policy?.thin_record_allowed === false, 'thin records must remain forbidden');
fail(config.promotion_policy?.promotion_requires_deterministic_impact_report === true, 'deterministic impact report must remain required');
fail(config.promotion_policy?.promotion_requires_full_duplicate_review === true, 'full duplicate review must remain required');
fail(config.promotion_policy?.promotion_requires_current_source_review === true, 'current source review must remain required');

for (const field of ['new_public_surface_allowed','market_access_records_allowed','compare_preset_membership_change_allowed','comparison_readiness_semantics_change_allowed','facet_freshness_semantics_change_allowed','monitoring_auto_promotion_allowed','asset_rank','single_composite_score']) {
  fail(config.boundaries?.[field] === false, `boundary must remain false: ${field}`);
}

fail(stablecoins.length === 110, `candidate-stage canonical count must remain 110, found ${stablecoins.length}`);

if (failures.length) {
  console.error('PR #358 Record Growth Batch 1 selection validation failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  config_id: config.config_id,
  context_group: config.context_group,
  canonical_assets_before: stablecoins.length,
  selected_candidates: expectedCandidateIds,
  proposed_asset_ids: expectedAssetIds,
  proposed_slugs: expectedSlugs,
  maximum_new_assets: config.maximum_new_assets,
  planned_canonical_count_after: config.planned_canonical_count_after,
  canonical_write_allowed_at_selection_stage: false,
  public_output_at_selection_stage: false,
  next_pr: config.next_pr
}, null, 2));
