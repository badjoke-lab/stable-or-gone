import fs from 'node:fs';
import path from 'node:path';
import { buildPr517GeneratedState } from './build-record-growth-batch-5-bison-eub-usb-pr517.mjs';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
buildPr517GeneratedState();

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const text = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const rows = (file) => { const value = read(file); return Array.isArray(value) ? value : value.records; };
const loadFiles = (files) => files.flatMap((file) => rows(file));
const sorted = (values) => [...values].sort().join('|');

const config = read('config/record-growth-batch-5-bison-eub-usb-pr517.json');
const sourceReview = read('data/editorial-research/record-growth-batch-5-bison-eub-usb-pr517-source-review.json');
const promotion = rows('data/candidate-promotions-batch-31.json');
const candidates = rows('data/candidate-stable-assets-growth-119.json');
const checkpoint = read('docs/migration/current-canonical-checkpoint.json');
const reviewCheckpoint = read('docs/migration/current-review-checkpoint.json');
const statsCheckpoint = read('docs/migration/current-stats-history-checkpoint.json');
const history = read('data/stats-history.json');
const parity = read('docs/migration/registry-v3-parity-baseline.json');
const release = read('docs/migration/registry-release-integrity-baseline.json');
const v3Foundation = read('docs/migration/registry-v3-foundation.json');
const incomeManifest = read('docs/migration/registry-v3-income-profiles.json');
const deploymentManifest = read('docs/migration/registry-v3-view-67.json');
const migrationAudit = read('docs/migration/registry-v3-migration-audit.json');
const freshness = read('data/quality/facet-freshness-contract-v1.json');
const candidateMaster = read('docs/growth/candidate-master-70.json');
const authority = read('config/record-growth-batch-5-review-gate-pr516.json');
const spec = text('docs/quality/record-growth-batch-5-bison-eub-usb-pr517-spec.md');
const agents = text('AGENTS.md');
const roadmap = text('docs/roadmap.md');
const active = text('scripts/validate-active-workstream.mjs').trim();

const baseline = loadRegistryV2Baseline(root);
const groups = Object.fromEntries(Object.entries(baseline.data_groups).map(([name, files]) => [name, loadFiles(files)]));
const legalProfiles = loadFiles(v3Foundation.data_groups.legal_profiles);
const stableAssetRelationships = loadFiles(v3Foundation.data_groups.stable_asset_relationships);
const reserveComponents = loadFiles(v3Foundation.data_groups.reserve_components);
const incomeProfiles = loadFiles(incomeManifest.data_files);
const marketAccess = rows('data/market-access-records-v1.json');

const expected = {
  stablecoins: 119,
  organizations: 109,
  relationships: 131,
  classifications: 119,
  profiles: 119,
  events: 194,
  event_details: 194,
  evidence: 584,
  evidence_relations: 584,
  reserve_reports: 127,
  known_unknowns: 352,
  regulatory_notes: 9,
  deployments: 186,
  legal_profiles: 119,
  stable_asset_relationships: 5,
  reserve_components: 153,
  income_profiles: 119,
  market_access_records: 8,
  archive_recorded: 462,
  archive_not_recorded: 122,
  detail_routes: 422
};
const archiveRecorded = groups.evidence.filter((row) => typeof row.archived_url === 'string' && row.archived_url.trim()).length;
const actual = {
  stablecoins: groups.stablecoins.length,
  organizations: groups.organizations.length,
  relationships: groups.relationships.length,
  classifications: groups.classifications.length,
  profiles: groups.profiles.length,
  events: groups.events.length,
  event_details: groups.event_details.length,
  evidence: groups.evidence.length,
  evidence_relations: groups.evidence.length,
  reserve_reports: groups.reserve_reports.length,
  known_unknowns: groups.known_unknowns.length,
  regulatory_notes: groups.regulatory_notes.length,
  deployments: groups.deployments.length,
  legal_profiles: legalProfiles.length,
  stable_asset_relationships: stableAssetRelationships.length,
  reserve_components: reserveComponents.length,
  income_profiles: incomeProfiles.length,
  market_access_records: marketAccess.length,
  archive_recorded: archiveRecorded,
  archive_not_recorded: groups.evidence.length - archiveRecorded,
  detail_routes: groups.stablecoins.length + groups.organizations.length + groups.events.length
};
for (const [field, value] of Object.entries(expected)) check(actual[field] === value, `count mismatch ${field}: ${actual[field]} != ${value}`);

check(config.status === 'reviewed_complete_record_implementation', 'config status mismatch');
check(config.authority_pr === 516 && config.implementation_pr === 517 && config.source_audit_pr === 515, 'authority lineage mismatch');
check(JSON.stringify(config.selected_candidate_ids) === JSON.stringify(['sog_cand_pr515_bison_eub', 'sog_cand_pr515_bison_usb']), 'selected candidates changed');
check(config.promoted_assets.length === 2, 'promotion count changed');
check(config.shared_issuer.organization_id === 'sog_issuer_bison_bank', 'shared issuer changed');
check(config.implementation_boundaries.exact_eub_solana_mint === null && config.implementation_boundaries.exact_usb_solana_mint === null, 'unconfirmed mint entered config');
check(config.implementation_boundaries.token_specific_reserve_attestation_recorded === false, 'token-specific assurance overclaimed');
check(config.implementation_boundaries.issuer_level_audit_not_promoted === true, 'issuer audit boundary missing');
check(config.implementation_boundaries.institutional_allowlist_restriction_recorded === true, 'allowlist restriction missing');
check(config.implementation_boundaries.replacement_candidate_used === false, 'replacement candidate used');
check(config.implementation_boundaries.market_access_change === false && config.implementation_boundaries.material_ui_change === false, 'unrelated product change enabled');
check(config.implementation_boundaries.legacy_redirect_change === false, 'legacy redirect changed');
check(config.required_exit === 'REVIEW_GATE', 'review gate exit missing');

check(authority.decision.authorize_next_pr === 517, 'PR #516 did not authorize PR #517');
check(JSON.stringify(authority.decision.selected_candidate_ids) === JSON.stringify(config.selected_candidate_ids), 'PR #516 selected set mismatch');
check(authority.decision.maximum_new_canonical_assets === 2 && authority.decision.maximum_new_organizations === 1, 'PR #516 maximum changed');
check(authority.decision.replacement_candidate_allowed === false, 'PR #516 replacement boundary changed');

const assetIds = ['sog_st_bison_eub', 'sog_st_bison_usb'];
const issuer = groups.organizations.find((row) => row.id === 'sog_issuer_bison_bank');
check(issuer?.name === 'Bison Bank, S.A.' && issuer?.jurisdiction === 'Portugal', 'Bison Bank organization mismatch');

for (const [assetId, symbol, peg, eventId, deploymentId, reserveId] of [
  ['sog_st_bison_eub', 'EUB', 'EUR', 'sog_ev_bison_eub_launch_pr517', 'sog_dep_bison_eub_solana_pr517', 'sog_rr_bison_eub_whitepaper_framework_pr517'],
  ['sog_st_bison_usb', 'USB', 'USD', 'sog_ev_bison_usb_launch_pr517', 'sog_dep_bison_usb_solana_pr517', 'sog_rr_bison_usb_whitepaper_framework_pr517']
]) {
  const asset = groups.stablecoins.find((row) => row.id === assetId);
  const relationship = groups.relationships.find((row) => row.stablecoin_id === assetId && row.organization_id === issuer?.id);
  const classification = groups.classifications.find((row) => row.id === assetId);
  const profile = groups.profiles.find((row) => row.id === assetId);
  const event = groups.events.find((row) => row.id === eventId);
  const eventDetail = groups.event_details.find((row) => row.id === eventId);
  const deployment = groups.deployments.find((row) => row.id === deploymentId);
  const reserve = groups.reserve_reports.find((row) => row.id === reserveId);
  const gaps = groups.known_unknowns.filter((row) => row.stablecoin_id === assetId);
  const legal = legalProfiles.find((row) => row.id === assetId);
  const components = reserveComponents.filter((row) => row.stablecoin_id === assetId);
  const income = incomeProfiles.find((row) => row.id === assetId);
  const evidence = groups.evidence.filter((row) => (row.stablecoin_ids ?? [row.stablecoin_id]).includes(assetId));

  check(asset?.symbol === symbol && asset?.peg_asset === peg, `${symbol} identity mismatch`);
  check(asset?.status === 'limited' && asset?.launch_date === '2026-05-06', `${symbol} lifecycle mismatch`);
  check(asset?.issuer_id === issuer?.id, `${symbol} issuer reference mismatch`);
  check(asset?.redemption_status === 'institutional_only' && asset?.retail_redemption === 'not_available', `${symbol} access mismatch`);
  check(relationship?.role === 'legal_issuer' && relationship?.status === 'active', `${symbol} issuer relationship mismatch`);
  check(classification?.lifecycle_status === 'restricted' && classification?.issuance_status === 'restricted', `${symbol} classification restriction mismatch`);
  check(classification?.peg_reference?.asset === peg && classification?.yield_or_rebase_profile?.mode === 'none', `${symbol} peg or yield classification mismatch`);
  check(profile?.reserve_profile?.backing_types?.length === 1 && profile?.reserve_profile?.backing_types?.[0] === 'other', `${symbol} reserve-category boundary mismatch`);
  check(profile?.redemption_profile?.status === 'institutional_only', `${symbol} redemption profile mismatch`);
  check(event?.event_date === '2026-05-06' && event?.event_status_effect === 'restricted', `${symbol} launch event mismatch`);
  check(eventDetail?.event_detail_kind === 'launch' && eventDetail?.launch_detail?.affected_deployment_ids?.includes(deploymentId), `${symbol} event detail mismatch`);
  check(deployment?.chain === 'Solana' && deployment?.token_standard === 'Solana Token-2022', `${symbol} deployment family mismatch`);
  check(deployment?.contract_address === null, `${symbol} unconfirmed mint address entered`);
  check(deployment?.canonicality === 'issuer_native' && deployment?.is_primary === true, `${symbol} deployment canonicality mismatch`);
  check(reserve?.report_type === 'issuer_whitepaper_reserve_and_redemption_framework', `${symbol} reserve report type mismatch`);
  check(reserve?.notes?.includes('not treated') || reserve?.notes?.includes('does not establish'), `${symbol} reserve assurance limitation missing`);
  check(gaps.length === 5, `${symbol} must have five known unknowns`);
  check(gaps.filter((row) => row.severity === 'high').length === 3, `${symbol} high-severity unknown count mismatch`);
  check(legal?.holder_claim_type === 'direct_claim_on_issuer' && legal?.reserve_segregation === 'unclear', `${symbol} legal profile mismatch`);
  check(components.length === 1 && components[0]?.asset_category === 'other' && components[0]?.share_percent === null, `${symbol} reserve component mismatch`);
  check(income?.availability === 'none' && income?.accrual === 'none', `${symbol} income profile mismatch`);
  check(evidence.length === 3, `${symbol} must have three related Evidence records including shared launch`);
  check(evidence.every((row) => row.is_primary === true), `${symbol} has non-primary new Evidence`);
  check(evidence.every((row) => typeof row.archived_url === 'string' && row.archived_url.length > 0), `${symbol} Evidence archive discovery URL missing`);
}

const sharedLaunch = groups.evidence.find((row) => row.id === 'sog_src_bison_emt_launch_pr517');
check(sorted(sharedLaunch?.stablecoin_ids ?? []) === sorted(assetIds), 'shared launch Evidence does not bind both assets');
const newEvidenceIds = [
  'sog_src_bison_emt_launch_pr517',
  'sog_src_bison_eub_product_pr517',
  'sog_src_bison_eub_whitepaper_pr517',
  'sog_src_bison_usb_product_pr517',
  'sog_src_bison_usb_whitepaper_pr517'
];
check(newEvidenceIds.every((id) => groups.evidence.some((row) => row.id === id)), 'new Evidence set incomplete');
check(sourceReview.deployment_identity_review.exact_eub_mint === null && sourceReview.deployment_identity_review.exact_usb_mint === null, 'source review mint boundary changed');
check(sourceReview.deployment_identity_review.official_whitepaper_identifier_field === 'not_applicable', 'whitepaper identifier boundary missing');
check(sourceReview.reserve_and_assurance_review.token_specific_attestation_or_audit_report === null, 'source review assurance overclaim');
check(sourceReview.launch_boundary_review.canonical_launch_date === '2026-05-06' && sourceReview.launch_boundary_review.whitepaper_offer_start_date === '2026-04-10', 'launch boundary mismatch');
check(sourceReview.income_review.holder_yield === false, 'holder yield boundary changed');

check(candidates.length === 2 && sorted(candidates.map((row) => row.candidate_id)) === sorted(['sog_cand_000118', 'sog_cand_000119']), 'candidate records mismatch');
check(promotion.length === 2 && promotion.every((row) => row.status === 'promoted' && row.promotion_pr === 517), 'promotion ledger mismatch');
check(promotion.every((row) => row.replacement_candidate_used === false), 'promotion replacement candidate used');
check(candidateMaster.status === 'batch_031_complete', 'candidate master status mismatch');
check(candidateMaster.protected_minimums.total_candidates === 119 && candidateMaster.protected_minimums.promoted_candidates === 119, 'candidate master count mismatch');

check(checkpoint.checkpoint_id === 'sog_pr517_record_growth_batch_5_bison_eub_usb_119_2026_08_03', 'canonical checkpoint mismatch');
check(checkpoint.counts.assets === 119 && checkpoint.counts.evidence === 584 && checkpoint.counts.deployments === 186, 'canonical checkpoint counts mismatch');
check(checkpoint.counts.archive_index_count === 462 && checkpoint.counts.archive_not_recorded_count === 122, 'archive checkpoint mismatch');
check(checkpoint.counts.detail_routes === 422 && checkpoint.counts.metadata_checked_routes === 422, 'route checkpoint mismatch');
check(reviewCheckpoint.exit_boundary === 'REVIEW_GATE' && reviewCheckpoint.reviewed_stablecoin_ids.length === 2, 'review checkpoint mismatch');
check(statsCheckpoint.asset_count === 119 && statsCheckpoint.canonical_checkpoint_id === checkpoint.checkpoint_id, 'stats checkpoint mismatch');
const latestSnapshot = history.snapshots.at(-1);
check(latestSnapshot?.checkpoint_id === statsCheckpoint.checkpoint_id, 'PR #517 stats snapshot is not final');
check(latestSnapshot?.totals?.assets === 119 && latestSnapshot?.totals?.evidence === 584 && latestSnapshot?.totals?.deployments === 186, 'PR #517 stats totals mismatch');

check(parity.expected_v2_counts.stablecoins === 119 && parity.expected_v3_counts.legal_profiles === 119 && parity.expected_v3_counts.deployment_view === 186, 'parity baseline mismatch');
check(release.expected_public_record_counts.primary_records === 119 && release.expected_route_counts.total_detail === 422, 'release baseline mismatch');
check(v3Foundation.minimum_counts.legal_profiles === 119 && v3Foundation.minimum_counts.reserve_components === 153, 'v3 foundation minimum mismatch');
check(incomeManifest.minimum_count === 119, 'income manifest minimum mismatch');
check(deploymentManifest.minimum_count === 186, 'deployment manifest minimum mismatch');
check(migrationAudit.minimum_counts.deployments === 186 && migrationAudit.coverage.protected_stablecoins === 119, 'migration audit mismatch');
check(freshness.as_of_date === '2026-08-03' && freshness.output_contract.asset_count === 119 && freshness.output_contract.cell_count === 2261, 'freshness contract mismatch');
check(marketAccess.length === 8, 'Market Access changed');

check(spec.includes('exact mint address') && spec.includes('REVIEW GATE'), 'PR #517 spec boundary missing');
check(agents.includes('PR #517') && agents.includes('Bison Bank EUB and USB'), 'AGENTS authority missing');
check(roadmap.includes('PR #517') && roadmap.includes('EUB') && roadmap.includes('USB'), 'roadmap authority missing');
check(active === "import './validate-record-growth-batch-5-bison-eub-usb-pr517.mjs';", 'active validator not wired to PR #517');

if (failures.length) {
  console.error('PR #517 Bison EUB and USB complete-record validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  authority_pr: 516,
  implementation_pr: 517,
  promoted_assets: assetIds,
  shared_issuer: issuer?.id,
  counts: actual,
  exact_mint_addresses_recorded: 0,
  token_specific_reserve_attestations_recorded: 0,
  replacement_candidates: 0,
  market_access_changes: 0,
  legacy_redirect_changes: 0,
  next_boundary: 'REVIEW_GATE'
}, null, 2));
