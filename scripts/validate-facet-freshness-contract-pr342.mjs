import fs from 'node:fs';
import path from 'node:path';
import { buildFacetFreshnessAudit } from './comparison/build-facet-freshness-pr342.mjs';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const contract = readJson('data/quality/facet-freshness-contract-v1.json');
const comparison = readJson('data/quality/comparison-readiness-contract-v1.json');
const governance = readJson('config/market-access-governance-v1.json');
const marketAccessRecords = readJson('data/market-access-records-v1.json');
const audit = buildFacetFreshnessAudit();

expect(contract.schema_version === '1.0', 'freshness contract schema version mismatch');
expect(contract.status === 'canonical_internal_derivation_contract', 'freshness contract status mismatch');
expect(/^\d{4}-\d{2}-\d{2}$/.test(contract.as_of_date ?? ''), 'freshness contract requires deterministic YYYY-MM-DD as_of_date');
expect(contract.comparison_contract_id === comparison.contract_id, 'freshness contract comparison binding mismatch');
expect(contract.market_access_governance_id === governance.governance_id, 'freshness contract Market Access governance binding mismatch');
expect(contract.separation_contract?.freshness_is_readiness === false, 'freshness must not equal readiness');
expect(contract.separation_contract?.freshness_is_confidence === false, 'freshness must not equal confidence');
expect(contract.separation_contract?.freshness_is_truth === false, 'freshness must not equal truth');
expect(contract.separation_contract?.freshness_is_safety_score === false, 'freshness must not be a safety score');
expect(contract.separation_contract?.single_composite_freshness_score === false, 'single composite freshness score must be forbidden');
expect(contract.separation_contract?.historical_effective_date_may_be_used_as_review_anchor === false, 'historical effective dates must not become review anchors');
expect(contract.separation_contract?.future_date_clamp_allowed === false, 'future freshness dates must fail instead of being clamped');

const allowedStates = new Set(['fresh','aging','stale','undated','no_canonical_record','not_applicable']);
expect(contract.freshness_states?.length === allowedStates.size, 'freshness state vocabulary size mismatch');
for (const state of allowedStates) expect(contract.freshness_states.includes(state), `freshness state missing: ${state}`);

for (const [profileId, threshold] of Object.entries(contract.threshold_profiles ?? {})) {
  expect(Number.isInteger(threshold.fresh_max_days) && threshold.fresh_max_days >= 0, `${profileId}: fresh_max_days invalid`);
  expect(Number.isInteger(threshold.aging_max_days) && threshold.aging_max_days > threshold.fresh_max_days, `${profileId}: aging_max_days must exceed fresh_max_days`);
}
expect(contract.threshold_profiles?.market_access?.fresh_max_days === 30, 'Market Access fresh window must be 30 days');
expect(contract.threshold_profiles?.market_access?.aging_max_days === 90, 'Market Access aging window must be 90 days');

expect(contract.source_boundaries?.canonical_only === true, 'freshness derivation must be canonical-only');
for (const excluded of ['monitoring_observations','monitoring_candidates','editorial_research','candidate_research','news_discovery','private_notes','live_price','market_cap','apy','risk_feed']) {
  expect(contract.source_boundaries?.excluded_source_families?.includes(excluded), `freshness excluded-source boundary missing ${excluded}`);
}

const comparisonDimensions = comparison.dimensions.map((row) => row.id);
const rules = contract.dimension_rules ?? [];
const ruleIds = rules.map((row) => row.dimension_id);
expect(rules.length === 19, `freshness contract must define 19 dimension rules, found ${rules.length}`);
expect(new Set(ruleIds).size === 19, 'freshness dimension rules must be unique');
expect(JSON.stringify([...ruleIds].sort()) === JSON.stringify([...comparisonDimensions].sort()), 'freshness dimension set must exactly match comparison dimension set');
for (const rule of rules) {
  expect(Boolean(contract.threshold_profiles?.[rule.threshold_profile]), `${rule.dimension_id}: threshold profile missing`);
  expect(typeof rule.anchor_kind === 'string' && rule.anchor_kind.length > 0, `${rule.dimension_id}: anchor kind missing`);
  expect(typeof rule.date_semantics === 'string' && rule.date_semantics.length > 0, `${rule.dimension_id}: date semantics missing`);
  expect(typeof rule.inherited_review_anchor === 'boolean', `${rule.dimension_id}: inherited review anchor flag missing`);
}

const regulatoryRule = rules.find((row) => row.dimension_id === 'regulatory_action_scope');
expect(regulatoryRule?.anchor_kind === 'latest_regulatory_review_date', 'regulatory freshness must use explicit review-date anchor');
expect(regulatoryRule?.date_semantics === 'explicit_review_or_last_checked_date_only', 'regulatory note_date must not be freshness anchor');
const launchRule = rules.find((row) => row.dimension_id === 'launch_date_semantics');
expect(launchRule?.date_semantics === 'review_date_not_launch_date', 'launch date itself must not be freshness anchor');
const marketAccessRule = rules.find((row) => row.dimension_id === 'market_access_applicability');
expect(marketAccessRule?.anchor_kind === 'latest_market_access_observed_at', 'Market Access freshness must use observed_at');
expect(marketAccessRule?.no_record_state === 'no_canonical_record', 'Market Access absence must remain no_canonical_record');
expect(Array.isArray(marketAccessRecords) && marketAccessRecords.length === 0, 'PR #342 assumes PR #341 canonical Market Access entrypoint remains empty');

expect(audit.schema_version === '1.0', 'freshness audit schema version mismatch');
expect(audit.status === 'internal_deterministic_derivation', 'freshness audit status mismatch');
expect(audit.as_of_date === contract.as_of_date, 'freshness audit as_of_date mismatch');
expect(audit.contract_id === contract.contract_id, 'freshness audit contract ID mismatch');
expect(audit.comparison_contract_id === comparison.contract_id, 'freshness audit comparison contract mismatch');
expect(audit.market_access_governance_id === governance.governance_id, 'freshness audit Market Access governance mismatch');
expect(audit.canonical_only === true, 'freshness audit must be canonical-only');
expect(audit.public_output === false, 'PR #342 freshness audit must remain internal');
expect(audit.single_composite_score === false, 'freshness audit must not emit composite score');
expect(audit.asset_count === 110, `freshness audit must contain 110 assets, found ${audit.asset_count}`);
expect(audit.dimension_count === 19, `freshness audit must contain 19 dimensions, found ${audit.dimension_count}`);
expect(audit.cell_count === 2090, `freshness audit must contain 2090 cells, found ${audit.cell_count}`);
expect((audit.assets ?? []).length === 110, 'freshness audit asset rows mismatch');

const cells = audit.assets.flatMap((asset) => asset.facets ?? []);
expect(cells.length === 2090, 'freshness audit flattened cell count mismatch');
for (const asset of audit.assets) {
  expect(asset.facets?.length === 19, `${asset.asset_id}: must contain 19 freshness facets`);
  expect(new Set(asset.facets?.map((row) => row.dimension_id)).size === 19, `${asset.asset_id}: freshness dimensions must be unique`);
  for (const facet of asset.facets ?? []) {
    expect(allowedStates.has(facet.freshness_state), `${asset.asset_id}/${facet.dimension_id}: invalid freshness state`);
    if (facet.anchor_date) {
      expect(Number.isInteger(facet.age_days) && facet.age_days >= 0, `${asset.asset_id}/${facet.dimension_id}: dated facet requires nonnegative integer age_days`);
    } else {
      expect(facet.age_days === null, `${asset.asset_id}/${facet.dimension_id}: undated facet must have null age_days`);
    }
  }
}

const marketAccessCells = cells.filter((row) => row.dimension_id === 'market_access_applicability');
expect(marketAccessCells.length === 110, 'Market Access freshness cell count mismatch');
expect(marketAccessCells.every((row) => row.freshness_state === 'no_canonical_record'), 'empty canonical Market Access entrypoint must derive no_canonical_record for all assets');
expect(marketAccessCells.every((row) => row.anchor_date === null), 'empty Market Access records must not fabricate freshness dates');

const legalCells = cells.filter((row) => row.dimension_id === 'legal_classification_comparability');
expect(legalCells.length === 110, 'legal freshness cell count mismatch');
expect(legalCells.every((row) => row.anchor_kind === 'legal_profile_review_date'), 'legal freshness must use legal review dates only');

const regulatoryCells = cells.filter((row) => row.dimension_id === 'regulatory_action_scope');
expect(regulatoryCells.every((row) => row.anchor_kind === 'latest_regulatory_review_date'), 'regulatory cells must use review-date anchor');
expect(regulatoryCells.every((row) => row.date_semantics === 'explicit_review_or_last_checked_date_only'), 'regulatory cells must preserve review-date semantics');

const summaryCount = Object.values(audit.summary?.freshness_states ?? {}).reduce((sum, value) => sum + value, 0);
expect(summaryCount === 2090, `freshness summary must sum to 2090, found ${summaryCount}`);
expect(audit.summary?.dimension_states?.length === 19, 'freshness dimension summary must contain 19 rows');
for (const row of audit.summary?.dimension_states ?? []) {
  const total = Object.values(row.state_counts ?? {}).reduce((sum, value) => sum + value, 0);
  expect(total === 110, `${row.dimension_id}: freshness dimension summary must sum to 110, found ${total}`);
}

expect(contract.output_contract?.asset_count === 110, 'freshness output contract asset count mismatch');
expect(contract.output_contract?.dimension_count === 19, 'freshness output contract dimension count mismatch');
expect(contract.output_contract?.cell_count === 2090, 'freshness output contract cell count mismatch');
expect(contract.output_contract?.single_composite_score_forbidden === true, 'freshness output contract must forbid composite score');
expect(contract.output_contract?.public_output === false, 'PR #342 freshness output must remain internal');
expect(contract.output_contract?.next_pr === 343, 'PR #342 next PR must be #343');

if (failures.length) {
  console.error('PR #342 facet freshness validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  as_of_date: audit.as_of_date,
  asset_count: audit.asset_count,
  dimension_count: audit.dimension_count,
  cell_count: audit.cell_count,
  freshness_states: audit.summary.freshness_states,
  market_access_no_canonical_record: marketAccessCells.filter((row) => row.freshness_state === 'no_canonical_record').length,
  next_pr: contract.output_contract.next_pr
}, null, 2));
