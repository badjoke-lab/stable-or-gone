import fs from 'node:fs';
import { isDeepStrictEqual } from 'node:util';
import { buildMarketAccessPilot1Review, serializeMarketAccessPilot1Review } from './build-market-access-pilot-1-review-pr356.mjs';

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const config = readJson('config/market-access-pilot-1-pr356.json');
const research = readJson('data/editorial-research/japan-stablecoin-market-access-2026.json');
const handoff = readJson('docs/migration/tier-a-batch-2-pr355-reviewed-handoff.json');
const schema = readJson('schemas/market-access-record-v1.schema.json');
const governance = readJson('config/market-access-governance-v1.json');
const canonicalRecords = readJson('data/market-access-records-v1.json');
const report = buildMarketAccessPilot1Review();
const repeat = buildMarketAccessPilot1Review();
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const expectedFunctions = ['buy_sell', 'deposit', 'withdrawal', 'external_wallet_transfer'];
const expectedExcludedFunctions = ['direct_issuer_mint', 'direct_issuer_redemption'];
const functionEnum = new Set(schema.properties?.function?.enum ?? []);
const accessStateEnum = new Set(schema.properties?.access_state?.enum ?? []);
const networkKindEnum = new Set(schema.properties?.network_scope?.properties?.kind?.enum ?? []);
const customerKindEnum = new Set(schema.properties?.customer_scope?.properties?.kind?.enum ?? []);
const conditionTypeEnum = new Set(schema.properties?.conditions?.items?.properties?.type?.enum ?? []);
const evidenceIdPattern = /^sog_src_[a-z0-9_]+$/;
const recordIdPattern = /^sog_ma_[a-z0-9_]+$/;

expect(config.schema_version === '1.0', 'pilot config schema version mismatch');
expect(config.pilot_id === 'sog_market_access_pilot_1_pr356', 'pilot ID mismatch');
expect(config.review_pr === 356, 'pilot review PR mismatch');
expect(config.source_handoff_id === handoff.handoff_id, 'pilot source handoff mismatch');
expect(handoff.source_merge_commit === 'b192c4c920e3a3626d006dd8b80f44e806f40da9', 'PR #355 merge commit mismatch');
expect(handoff.canonical_counts?.assets === 110, 'PR #355 handoff asset count mismatch');
expect(handoff.canonical_counts?.evidence === 549, 'PR #355 handoff evidence count mismatch');
expect(handoff.market_access_record_count === 0, 'PR #355 handoff Market Access count must be zero');
expect(handoff.next_work_item === 'PR #356 Market Access Pilot 1', 'PR #355 handoff next work item mismatch');

expect(isDeepStrictEqual(config.jurisdictions, [{ country_code: 'JP', label: 'Japan', subdivision_code: null }]), 'pilot jurisdiction must be JP only');
expect(isDeepStrictEqual(config.assets, [{ asset_id: 'sog_st_usdc', symbol: 'USDC' }]), 'pilot asset must be USDC only');
expect(isDeepStrictEqual(config.platforms, [{ name: 'SBI VC Trade', service: 'VCTRADE', organization_id: null }]), 'pilot platform/service mismatch');
expect(isDeepStrictEqual(config.functions, expectedFunctions), 'pilot function set mismatch');
expect(isDeepStrictEqual(config.excluded_functions, expectedExcludedFunctions), 'pilot excluded function set mismatch');
expect(config.maximum_canonical_records === 4, 'pilot maximum canonical records must be four');
expect(config.effective_from === '2025-03-26', 'pilot effective_from mismatch');
expect(config.observed_at === '2026-07-10', 'pilot observed_at mismatch');
expect(config.review_cutoff === '2026-07-10', 'pilot review cutoff mismatch');
expect(config.canonical_promotion?.automatic === false, 'automatic promotion must remain disabled');
expect(config.canonical_promotion?.manual_review_required === true, 'manual review must remain required');
expect(config.canonical_promotion?.require_function_specific_claim_scope === true, 'function-specific claim scope must remain required');
expect(config.boundaries?.universal_japan_availability_claim_allowed === false, 'universal Japan availability claim must remain forbidden');
expect(config.boundaries?.new_canonical_assets_allowed === false, 'new canonical assets must remain forbidden');
expect(config.boundaries?.new_public_surface_allowed === false, 'new public surface must remain forbidden');
expect(config.boundaries?.asset_rank === false, 'asset ranking must remain forbidden');
expect(config.boundaries?.single_composite_score === false, 'composite score must remain forbidden');

expect(research.status === 'reviewed_research_checkpoint', 'source research must remain reviewed research');
expect(research.canonical_boundary?.included_in_public_canonical_counts === false, 'source research must remain outside canonical counts');
expect(isDeepStrictEqual(config.source_research_record_ids, ['jp_access_usdc_sbivc_2025_03_26']), 'pilot source research row mismatch');
const sourceRow = (research.records ?? []).find((row) => row.record_id === 'jp_access_usdc_sbivc_2025_03_26');
expect(Boolean(sourceRow), 'configured USDC source research row missing');
expect(sourceRow?.asset_id === 'sog_st_usdc', 'source research asset mismatch');
expect(sourceRow?.jurisdiction_code === 'JP', 'source research jurisdiction mismatch');
expect(sourceRow?.platform === 'SBI VC Trade', 'source research platform mismatch');
expect(sourceRow?.platform_service === 'VCTRADE', 'source research service mismatch');
expect(sourceRow?.effective_date === '2025-03-26', 'source research effective date mismatch');

expect(governance.promotion_policy?.automatic_promotion === false, 'governance automatic promotion changed');
expect(governance.promotion_policy?.review_required === true, 'governance manual review changed');
expect(governance.promotion_policy?.editorial_research_is_canonical_source === false, 'editorial research canonical boundary changed');
expect(governance.promotion_policy?.monitoring_output_is_canonical_source === false, 'monitoring canonical boundary changed');
expect(governance.canonical_data_path === 'data/market-access-records-v1.json', 'governance canonical data path mismatch');

expect(report.schema_version === '1.0', 'review report schema mismatch');
expect(report.review_id === 'sog_market_access_pilot_1_pr356_review', 'review report ID mismatch');
expect(report.status === 'deterministic_internal_candidate_review', 'review report status mismatch');
expect(report.public_output === false, 'review report must remain internal');
expect(report.review_pr === 356, 'review report PR mismatch');
expect(report.source_handoff_id === handoff.handoff_id, 'review report handoff mismatch');
expect(report.source_research_record_id === 'jp_access_usdc_sbivc_2025_03_26', 'review report source row mismatch');
expect(report.asset_exists === true, 'USDC canonical asset identity missing');
expect(report.candidate_count === 4, 'review report must contain four function candidates');
expect(report.candidates.length === 4, 'review candidate list must contain four rows');
expect(isDeepStrictEqual(report.bounded_scope.functions, expectedFunctions), 'review report function scope mismatch');
expect(report.bounded_scope.maximum_canonical_records === 4, 'review report maximum record count mismatch');
expect(serializeMarketAccessPilot1Review(report) === serializeMarketAccessPilot1Review(repeat), 'review report must be byte deterministic');
expect(isDeepStrictEqual(report, repeat), 'review report repeated object mismatch');
expect(/^[a-f0-9]{64}$/.test(report.input_digest_sha256), 'review report input digest invalid');

const proposedIds = new Set();
for (const candidate of report.candidates) {
  expect(functionEnum.has(candidate.function), `${candidate.function}: function outside schema vocabulary`);
  expect(accessStateEnum.has(candidate.mapped_access_state), `${candidate.function}: mapped state outside schema vocabulary`);
  expect(['blocked_missing_canonical_evidence','manual_function_claim_scope_review_required','approved_candidate_pending_canonical_write'].includes(candidate.promotion_status), `${candidate.function}: unsupported promotion status`);
  const proposed = candidate.proposed_record;
  expect(recordIdPattern.test(proposed.id), `${candidate.function}: proposed record ID invalid`);
  expect(!proposedIds.has(proposed.id), `${candidate.function}: duplicate proposed record ID`);
  proposedIds.add(proposed.id);
  expect(proposed.schema_version === '1.0', `${candidate.function}: proposed schema version mismatch`);
  expect(proposed.asset_id === 'sog_st_usdc', `${candidate.function}: proposed asset mismatch`);
  expect(proposed.jurisdiction?.country_code === 'JP', `${candidate.function}: proposed jurisdiction mismatch`);
  expect(proposed.platform?.name === 'SBI VC Trade' && proposed.platform?.service === 'VCTRADE', `${candidate.function}: proposed platform/service mismatch`);
  expect(networkKindEnum.has(proposed.network_scope?.kind), `${candidate.function}: proposed network scope invalid`);
  expect(customerKindEnum.has(proposed.customer_scope?.kind), `${candidate.function}: proposed customer scope invalid`);
  expect(proposed.conditions.every((condition) => conditionTypeEnum.has(condition.type) && typeof condition.description === 'string' && condition.description.length > 0), `${candidate.function}: proposed condition invalid`);
  expect(proposed.effective_from === '2025-03-26', `${candidate.function}: proposed effective date mismatch`);
  expect(proposed.observed_at === '2026-07-10', `${candidate.function}: proposed observed date mismatch`);
  expect(proposed.notes.includes('does not assert universal Japan-wide availability'), `${candidate.function}: universal-scope disclaimer missing`);
  for (const evidenceId of candidate.approved_evidence_ids) expect(evidenceIdPattern.test(evidenceId), `${candidate.function}: approved evidence ID invalid`);
}

expect(Array.isArray(canonicalRecords), 'canonical Market Access entrypoint must remain an array');
expect(canonicalRecords.length <= config.maximum_canonical_records, `canonical Market Access count exceeds pilot maximum: ${canonicalRecords.length}`);

if (config.status === 'bounded_candidate_audit_then_manual_promotion') {
  expect(canonicalRecords.length === 0, 'candidate-audit stage must not yet promote canonical Market Access records');
  expect(Object.keys(config.canonical_promotion?.approved_evidence_ids_by_function ?? {}).length === 0, 'candidate-audit stage must not pre-approve evidence mappings');
  expect(report.promotion_ready_count === 0, 'candidate-audit stage promotion-ready count must be zero');
}

if (config.status === 'canonical_promotion_reviewed') {
  expect(canonicalRecords.length >= 1, 'reviewed promotion stage requires at least one canonical Market Access record');
  expect(canonicalRecords.length === report.promotion_ready_count, 'canonical record count must match promotion-ready candidate count');
  const allowedIds = new Set(report.candidates.filter((row) => row.promotion_status === 'approved_candidate_pending_canonical_write').map((row) => row.proposed_record.id));
  for (const row of canonicalRecords) {
    expect(allowedIds.has(row.id), `${row.id}: canonical record outside approved bounded candidates`);
    expect(row.review_status === 'reviewed', `${row.id}: canonical record must be reviewed`);
    expect(Array.isArray(row.evidence_ids) && row.evidence_ids.length >= 1, `${row.id}: canonical evidence required`);
  }
}

if (failures.length) {
  console.error('PR #356 Market Access Pilot 1 validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  pilot_id: config.pilot_id,
  stage: config.status,
  source_merge_commit: handoff.source_merge_commit,
  candidate_count: report.candidate_count,
  exact_canonical_evidence_ids: report.exact_canonical_evidence_ids,
  unmatched_source_url_count: report.unmatched_source_urls.length,
  promotion_ready_count: report.promotion_ready_count,
  canonical_market_access_record_count: canonicalRecords.length,
  input_digest_sha256: report.input_digest_sha256,
}, null, 2));
