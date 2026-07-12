import { buildTierABatch3Impact, serializeTierABatch3Impact } from './growth/build-tier-a-batch-3-impact-pr357.mjs';

const report = buildTierABatch3Impact();
const repeat = buildTierABatch3Impact();
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const bySlug = new Map(report.selected_assets.map((row) => [row.asset_slug, row]));

expect(report.schema_version === '1.0', 'impact schema version mismatch');
expect(report.report_id === 'sog_tier_a_dossier_batch_3_pr357_impact', 'impact report ID mismatch');
expect(report.status === 'deterministic_internal_impact_report', 'impact status mismatch');
expect(report.public_output === false, 'impact report must remain internal');
expect(report.review_pr === 357, 'impact review PR mismatch');
expect(report.prior_work_item_merge_commit === 'ff48267a54333bd05c2fae1606c7744c3d5e200d', 'PR #356 merge commit mismatch');
expect(report.selected_asset_count === 5, 'impact report must contain five selected assets');
expect(JSON.stringify(report.selected_asset_slugs) === JSON.stringify(['audd','fei','husd','mim','nzds']), 'impact selected asset order mismatch');
expect(serializeTierABatch3Impact(report) === serializeTierABatch3Impact(repeat), 'impact report must be byte deterministic');
expect(/^[a-f0-9]{64}$/.test(report.input_digest_sha256), 'impact input digest invalid');

expect(report.aggregate_outcome.reviewed_asset_count === 5, 'all five selected assets must be reviewed');
expect(report.aggregate_outcome.canonical_improvement_asset_count === 3, 'exactly three selected assets must receive canonical improvements');
expect(report.aggregate_outcome.reviewed_no_change_asset_count === 2, 'exactly two selected assets must remain unchanged after review');
expect(report.aggregate_outcome.changed_legal_profile_count === 3, 'exactly three legal profiles must change');
expect(report.aggregate_outcome.changed_redemption_profile_count === 1, 'exactly one redemption profile must change');
expect(report.aggregate_outcome.new_evidence_record_count === 0, 'PR #357 must not add Evidence records');
expect(report.aggregate_outcome.new_event_record_count === 0, 'PR #357 must not add Event records');
expect(report.aggregate_outcome.new_organization_record_count === 0, 'PR #357 must not add Organization records');
expect(report.aggregate_outcome.new_relationship_record_count === 0, 'PR #357 must not add Relationship records');

expect(report.constraints.canonical_asset_count_expected === 110 && report.constraints.canonical_asset_count_actual === 110, 'canonical asset count boundary mismatch');
expect(report.constraints.canonical_evidence_count_expected === 551 && report.constraints.canonical_evidence_count_actual === 551, 'canonical Evidence count boundary mismatch');
expect(report.constraints.market_access_record_count_expected === 4 && report.constraints.market_access_record_count_actual === 4, 'Market Access count boundary mismatch');
expect(report.constraints.new_canonical_assets_allowed === false, 'new canonical asset boundary changed');
expect(report.constraints.new_public_surface_allowed === false, 'new public surface boundary changed');
expect(report.constraints.asset_rank === false, 'asset ranking boundary changed');
expect(report.constraints.single_composite_score === false, 'composite score boundary changed');

for (const row of report.selected_assets) {
  expect(row.reviewed_evidence_present === true, `${row.asset_slug}: reviewed Evidence missing`);
  expect(row.missing_reviewed_evidence_ids.length === 0, `${row.asset_slug}: missing reviewed Evidence IDs`);
  expect(row.review_status?.startsWith('reviewed_'), `${row.asset_slug}: review status missing`);
  expect(row.notes && row.notes.length > 0, `${row.asset_slug}: reviewed outcome note missing`);
}

const audd = bySlug.get('audd');
expect(audd?.review_status === 'reviewed_no_safe_canonical_change', 'AUDD: review status mismatch');
expect(audd?.changed_dimensions.length === 0, 'AUDD: unsupported canonical change recorded');
expect(JSON.stringify(audd?.remaining_unresolved_dimensions) === JSON.stringify(['events','lifecycle','organization_relationships','redemption']), 'AUDD: unresolved target set mismatch');
expect(audd?.current_target_states.events === 'absent', 'AUDD: event state must remain absent');
expect(audd?.current_target_states.lifecycle === 'partial', 'AUDD: lifecycle state must remain partial');
expect(audd?.current_target_states.organization_relationships === 'partial', 'AUDD: organization relationship state must remain partial');
expect(audd?.current_target_states.redemption === 'partial', 'AUDD: redemption state must remain partial');
expect(audd?.reason_codes.includes('current_product_and_redemption_state_not_reverified'), 'AUDD: current-state review boundary missing');

const fei = bySlug.get('fei');
expect(fei?.review_status === 'reviewed_canonical_improvement', 'FEI: review status mismatch');
expect(JSON.stringify(fei?.changed_dimensions) === JSON.stringify(['legal_profile']), 'FEI: changed dimension mismatch');
expect(['usable','strong'].includes(fei?.current_target_states.legal_profile), `FEI: legal profile did not become usable: ${fei?.current_target_states.legal_profile}`);
expect(fei?.legal_profile?.classifications?.[0]?.classification === 'protocol_asset', 'FEI: legal classification mismatch');
expect(fei?.legal_profile?.holder_claim_type === 'protocol_redemption_right', 'FEI: holder claim mismatch');
expect(fei?.legal_profile?.claim_against_organization_ids?.length === 0, 'FEI: corporate claim must remain absent');

const husd = bySlug.get('husd');
expect(husd?.review_status === 'reviewed_partial_canonical_improvement', 'HUSD: review status mismatch');
expect(JSON.stringify(husd?.changed_dimensions) === JSON.stringify(['legal_profile','redemption']), 'HUSD: changed dimensions mismatch');
expect(JSON.stringify(husd?.remaining_unresolved_dimensions) === JSON.stringify(['redemption']), 'HUSD: unresolved dimension mismatch');
expect(['usable','strong'].includes(husd?.current_target_states.legal_profile), `HUSD: legal profile did not become usable: ${husd?.current_target_states.legal_profile}`);
expect(husd?.current_target_states.redemption === 'partial', `HUSD: current redemption uncertainty must remain partial: ${husd?.current_target_states.redemption}`);
expect(husd?.legal_profile?.holder_claim_type === 'direct_claim_on_issuer', 'HUSD: historical holder claim mismatch');
expect(husd?.legal_profile?.bankruptcy_remoteness === 'not_established', 'HUSD: bankruptcy remoteness must remain not established');
expect(husd?.redemption_profile?.status === 'unknown', 'HUSD: current redemption status must remain unknown');
expect(husd?.redemption_profile?.redemption_url === null, 'HUSD: current redemption URL must remain absent');

const mim = bySlug.get('mim');
expect(mim?.review_status === 'reviewed_canonical_improvement', 'MIM: review status mismatch');
expect(JSON.stringify(mim?.changed_dimensions) === JSON.stringify(['legal_profile']), 'MIM: changed dimension mismatch');
expect(['usable','strong'].includes(mim?.current_target_states.legal_profile), `MIM: legal profile did not become usable: ${mim?.current_target_states.legal_profile}`);
expect(mim?.legal_profile?.classifications?.[0]?.classification === 'protocol_asset', 'MIM: legal classification mismatch');
expect(mim?.legal_profile?.holder_claim_type === 'no_direct_claim', 'MIM: direct organization claim must remain absent');
expect(mim?.legal_profile?.claim_against_organization_ids?.length === 0, 'MIM: claim-against organization list must remain empty');

const nzds = bySlug.get('nzds');
expect(nzds?.review_status === 'reviewed_no_safe_canonical_change', 'NZDS: review status mismatch');
expect(nzds?.changed_dimensions.length === 0, 'NZDS: unsupported canonical change recorded');
expect(JSON.stringify(nzds?.remaining_unresolved_dimensions) === JSON.stringify(['events','lifecycle','organization_relationships','redemption']), 'NZDS: unresolved target set mismatch');
expect(nzds?.current_target_states.events === 'absent', 'NZDS: event state must remain absent');
expect(nzds?.current_target_states.lifecycle === 'partial', 'NZDS: lifecycle state must remain partial');
expect(nzds?.current_target_states.organization_relationships === 'partial', 'NZDS: organization relationship state must remain partial');
expect(nzds?.current_target_states.redemption === 'partial', 'NZDS: redemption state must remain partial');
expect(nzds?.reason_codes.includes('current_product_and_redemption_state_not_reverified'), 'NZDS: current-state review boundary missing');

if (failures.length) {
  console.error('PR #357 Tier A dossier impact validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  selected_assets: report.selected_asset_slugs,
  canonical_improvement_assets: report.selected_assets.filter((row) => row.changed_dimensions.length > 0).map((row) => row.asset_slug),
  reviewed_no_change_assets: report.selected_assets.filter((row) => row.changed_dimensions.length === 0).map((row) => row.asset_slug),
  current_target_states: Object.fromEntries(report.selected_assets.map((row) => [row.asset_slug, row.current_target_states])),
  canonical_assets: report.constraints.canonical_asset_count_actual,
  canonical_evidence: report.constraints.canonical_evidence_count_actual,
  market_access_records: report.constraints.market_access_record_count_actual,
  input_digest_sha256: report.input_digest_sha256
}, null, 2));
