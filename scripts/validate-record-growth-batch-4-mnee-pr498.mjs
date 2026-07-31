import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';
import { generateCurrentHistorySnapshot } from './stats/build-history-snapshot.mjs';

const root = process.cwd();
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const text = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const rows = (file) => { const value = read(file); return Array.isArray(value) ? value : value.records; };
const loadFiles = (files) => files.flatMap((file) => rows(file));
const sorted = (values) => [...values].sort().join('|');
const sha256 = (value) => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');

const config = read('config/record-growth-batch-4-mnee-pr498.json');
const sourceReview = read('data/editorial-research/record-growth-batch-4-mnee-pr498-source-review.json');
const promotion = rows('data/candidate-promotions-batch-30.json');
const overlay = read('data/deployment-verification-growth-pr498.json');
const handoff = read('docs/migration/record-growth-batch-4-mnee-pr498-handoff.json');
const checkpoint = read('docs/migration/current-canonical-checkpoint.json');
const statsCheckpoint = read('docs/migration/current-stats-history-checkpoint.json');
const history = read('data/stats-history.json');
const parity = read('docs/migration/registry-v3-parity-baseline.json');
const release = read('docs/migration/registry-release-integrity-baseline.json');
const v3Foundation = read('docs/migration/registry-v3-foundation.json');
const incomeManifest = read('docs/migration/registry-v3-income-profiles.json');
const deploymentManifest = read('docs/migration/registry-v3-view-67.json');
const migrationAudit = read('docs/migration/registry-v3-migration-audit.json');
const freshnessContract = read('data/quality/facet-freshness-contract-v1.json');
const candidateMaster = read('docs/growth/candidate-master-70.json');
const spec = text('docs/quality/record-growth-batch-4-mnee-pr498-spec.md');
const amendment = text('docs/roadmap-amendments/2026-07-31-record-growth-batch-4-mnee.md');
const agents = text('AGENTS.md');
const roadmap = text('docs/roadmap.md');
const governance = text('docs/spec-governance.md');

const baseline = loadRegistryV2Baseline(root);
const groups = Object.fromEntries(Object.entries(baseline.data_groups).map(([name, files]) => [name, loadFiles(files)]));
const legalProfiles = loadFiles(v3Foundation.data_groups.legal_profiles);
const stableAssetRelationships = loadFiles(v3Foundation.data_groups.stable_asset_relationships);
const reserveComponents = loadFiles(v3Foundation.data_groups.reserve_components);
const incomeProfiles = loadFiles(incomeManifest.data_files);
const marketAccess = rows('data/market-access-records-v1.json');

const expected = {
  stablecoins: 117, organizations: 108, relationships: 129, classifications: 117, profiles: 117,
  events: 192, event_details: 192, evidence: 579, evidence_relations: 579,
  reserve_reports: 125, known_unknowns: 342, regulatory_notes: 9, deployments: 184,
  legal_profiles: 117, stable_asset_relationships: 5, reserve_components: 151, income_profiles: 117,
  market_access_records: 8, archive_recorded: 450, archive_not_recorded: 129, detail_routes: 417
};
const archiveRecorded = groups.evidence.filter((row) => typeof row.archived_url === 'string' && row.archived_url.trim()).length;
const actual = {
  stablecoins: groups.stablecoins.length, organizations: groups.organizations.length, relationships: groups.relationships.length,
  classifications: groups.classifications.length, profiles: groups.profiles.length, events: groups.events.length,
  event_details: groups.event_details.length, evidence: groups.evidence.length, evidence_relations: groups.evidence.length,
  reserve_reports: groups.reserve_reports.length, known_unknowns: groups.known_unknowns.length,
  regulatory_notes: groups.regulatory_notes.length, deployments: groups.deployments.length,
  legal_profiles: legalProfiles.length, stable_asset_relationships: stableAssetRelationships.length,
  reserve_components: reserveComponents.length, income_profiles: incomeProfiles.length,
  market_access_records: marketAccess.length, archive_recorded: archiveRecorded,
  archive_not_recorded: groups.evidence.length - archiveRecorded,
  detail_routes: groups.stablecoins.length + groups.organizations.length + groups.events.length
};
for (const [field, value] of Object.entries(expected)) check(actual[field] === value, `count mismatch ${field}: ${actual[field]} != ${value}`);

check(config.status === 'reviewed_complete', 'config status mismatch');
check(config.authority_pr === 497 && config.candidate_audit_pr === 496 && config.implementation_pr === 498, 'authority lineage mismatch');
check(config.selected_candidate.candidate_id === 'sog_cand_pr496_mnee' && config.selected_candidate.canonical_candidate_id === 'sog_cand_000117', 'selected candidate mismatch');
check(config.selected_candidate.stablecoin_id === 'sog_st_mnee', 'selected stablecoin mismatch');
check(config.selected_candidate.replacement_candidate_used === false, 'replacement candidate used');
check(config.record_boundary.ylds_promoted === false, 'YLDS incorrectly promoted');
check(config.record_boundary.deployment_identifiers_recorded_as_verified === false, 'deployment verification overclaim');
check(config.record_boundary.review_gate_after_pr498 === true && config.next_boundary === 'REVIEW_GATE', 'review gate missing');

const stablecoin = groups.stablecoins.find((row) => row.id === 'sog_st_mnee');
const issuer = groups.organizations.find((row) => row.id === 'sog_issuer_mnee_limited');
const relationship = groups.relationships.find((row) => row.id === 'sog_rel_mnee_mnee_limited_pr498');
const classification = groups.classifications.find((row) => row.id === 'sog_st_mnee');
const event = groups.events.find((row) => row.id === 'sog_ev_mnee_launch_pr498');
const eventDetail = groups.event_details.find((row) => row.id === 'sog_ev_mnee_launch_pr498');
const evidence = groups.evidence.filter((row) => (row.stablecoin_ids ?? [row.stablecoin_id]).includes('sog_st_mnee'));
const reserve = groups.reserve_reports.find((row) => row.id === 'sog_rr_mnee_attestation_program_pr498');
const gaps = groups.known_unknowns.filter((row) => row.stablecoin_id === 'sog_st_mnee');
const deployments = groups.deployments.filter((row) => row.stablecoin_id === 'sog_st_mnee');
const legal = legalProfiles.find((row) => row.id === 'sog_st_mnee');
const components = reserveComponents.filter((row) => row.stablecoin_id === 'sog_st_mnee');
const income = incomeProfiles.find((row) => row.id === 'sog_st_mnee');

check(Boolean(stablecoin) && stablecoin.slug === 'mnee' && stablecoin.symbol === 'MNEE', 'MNEE identity mismatch');
check(stablecoin?.launch_date === '2025-03-03' && stablecoin?.status === 'active', 'MNEE lifecycle mismatch');
check(stablecoin?.issuer_id === 'sog_issuer_mnee_limited', 'MNEE issuer reference mismatch');
check(stablecoin?.minimum_redemption === '100000 USD equivalent under the reviewed terms', 'redemption minimum mismatch');
check(stablecoin?.redemption_notes?.includes('USD 5,000') && stablecoin?.redemption_notes?.includes('0.5%'), 'redemption fee mismatch');
check(Boolean(issuer) && issuer.name === 'MNEE Limited' && issuer.jurisdiction === 'Antigua and Barbuda', 'issuer organization mismatch');
check(relationship?.role === 'legal_issuer' && relationship?.organization_id === issuer?.id, 'legal issuer relationship mismatch');
check(classification?.asset_class === 'stablecoin' && classification?.yield_or_rebase_profile?.mode === 'none', 'classification mismatch');
check(event?.event_date === '2025-03-03' && event?.source_count === 4, 'launch event mismatch');
check(eventDetail?.event_detail_kind === 'launch', 'typed launch event missing');

check(evidence.length === 8, `expected eight MNEE Evidence records, found ${evidence.length}`);
check(evidence.filter((row) => row.reliability === 'high').length === 7 && evidence.filter((row) => row.reliability === 'medium').length === 1, 'MNEE Evidence reliability distribution mismatch');
check(evidence.every((row) => typeof row.archived_url === 'string' && row.archived_url.length > 0), 'MNEE Evidence archive missing');
check(new Set(evidence.map((row) => row.id)).size === 8, 'MNEE Evidence ID duplicate');
check(sourceReview.reviewed_sources.length === 8, 'source review must contain eight sources');
check(sorted(sourceReview.reviewed_sources.map((row) => row.id)) === sorted(evidence.map((row) => row.id)), 'source review / Evidence source set mismatch');
check(sourceReview.reviewed_terms.fiat_redemption_minimum === 'USD 100,000 equivalent', 'source review minimum mismatch');
check(sourceReview.reviewed_terms.fiat_redemption_fee.includes('USD 5,000') && sourceReview.reviewed_terms.fiat_redemption_fee.includes('0.5%'), 'source review fee mismatch');
check(sourceReview.reviewed_terms.attestation_index.includes('May 2026'), 'attestation index boundary missing');

check(Boolean(reserve), 'MNEE reserve report missing');
check(gaps.length === 5, `expected five MNEE known unknowns, found ${gaps.length}`);
check(sorted(gaps.map((row) => row.id)) === sorted(config.required_known_unknown_ids), 'known unknown set mismatch');
check(components.length === 2, 'two reserve components required');
check(sorted(components.map((row) => row.asset_category)) === sorted(['cash', 'government_securities']), 'reserve component categories mismatch');
check(legal?.holder_claim_type === 'direct_claim_on_issuer', 'legal holder claim mismatch');
check(legal?.reserve_segregation === 'unclear' && legal?.bankruptcy_remoteness === 'not_established', 'legal unknown preservation mismatch');
check(income?.availability === 'none' && income?.accrual === 'none', 'income profile mismatch');

const oneSatId = 'ae59f3b898ec61acbdb6cc7a245fabeded0c094bf046f35206a3aec60ef88127_0';
const ethereumContract = '0x8ccedbae4916b79da7f3f612efb2eb93a2bfd6cf';
check(deployments.length === 2, 'exactly two MNEE deployments required');
check(deployments.find((row) => row.id === 'sog_dep_mnee_1sat_pr498')?.contract_address === oneSatId, '1Sat production token ID mismatch');
check(deployments.find((row) => row.id === 'sog_dep_mnee_ethereum_pr498')?.contract_address === ethereumContract, 'Ethereum contract mismatch');
check(overlay.status_counts.identifier_recorded_unverified === 2 && overlay.status_counts.verified === 0, 'deployment overlay status mismatch');
check(sorted(overlay.status_ids.identifier_recorded_unverified) === sorted(deployments.map((row) => row.id)), 'deployment overlay ID set mismatch');
check(sourceReview.candidate.deployment_identities.one_sat_ordinals.identifier === oneSatId, 'source review 1Sat ID mismatch');
check(sourceReview.candidate.deployment_identities.ethereum.identifier === ethereumContract, 'source review Ethereum contract mismatch');

check(promotion.length === 1, 'exactly one promotion mapping required');
check(promotion[0]?.candidate_id === 'sog_cand_000117' && promotion[0]?.source_candidate_id === 'sog_cand_pr496_mnee' && promotion[0]?.promoted_record_id === 'sog_st_mnee', 'promotion mapping mismatch');
check(promotion[0]?.promotion_pr === 498 && promotion[0]?.replacement_candidate_used === false, 'promotion boundary mismatch');
check(marketAccess.length === 8, 'Market Access count changed');

check(checkpoint.checkpoint_id === 'sog_pr498_record_growth_batch_4_mnee_117_2026_07_31', 'canonical checkpoint ID mismatch');
check(checkpoint.growth_pr === 498 && checkpoint.counts.assets === 117 && checkpoint.counts.evidence === 579 && checkpoint.counts.deployments === 184, 'canonical checkpoint counts mismatch');
check(checkpoint.counts.archive_index_count === 450 && checkpoint.counts.archive_not_recorded_count === 129, 'archive checkpoint mismatch');
check(parity.expected_v2_counts.stablecoins === 117 && parity.expected_v3_counts.legal_profiles === 117 && parity.expected_v3_counts.deployment_view === 184, 'parity baseline mismatch');
check(release.expected_public_record_counts.primary_records === 117 && release.expected_route_counts.total_detail === 417, 'release baseline mismatch');
check(freshnessContract.as_of_date === '2026-07-31', 'facet freshness as-of date mismatch');
check(freshnessContract.output_contract?.asset_count === 117 && freshnessContract.output_contract?.dimension_count === 19 && freshnessContract.output_contract?.cell_count === 2223, 'facet freshness output contract mismatch');
check(statsCheckpoint.asset_count === 117 && statsCheckpoint.source_checkpoint_id === 'sog_record_growth_batch_3_116_checkpoint_pr467_2026_07_25', 'stats checkpoint chain mismatch');
const previousSnapshot = history.snapshots.find((row) => row.checkpoint_id === 'sog_record_growth_batch_3_116_checkpoint_pr467_2026_07_25');
check(previousSnapshot?.snapshot_sha256 === '558c1e99fbd85203ea89fe374823efa2834167636580f976dfb714863e585ab7', 'immutable PR #467 stats snapshot changed');
const currentSnapshot = generateCurrentHistorySnapshot({ root });
check(history.snapshots.at(-1)?.checkpoint_id === currentSnapshot.checkpoint_id, 'current stats snapshot not final');
check(history.snapshots.at(-1)?.snapshot_sha256 === currentSnapshot.snapshot_sha256, 'current stats snapshot hash mismatch');
check(handoff.status === 'reviewed_complete' && handoff.next_work_item === 'REVIEW_GATE', 'handoff exit mismatch');
check(handoff.deployment_identities.one_sat_ordinals.token_id === oneSatId, 'handoff 1Sat ID mismatch');

const wiring = [
 ['src/lib/data/registry.ts', 'stablecoins-batch-ac.json'], ['src/lib/data/registry.ts', 'organizations-batch-ac.json'],
 ['src/lib/data/registry.ts', 'evidence-batch-ac.json'], ['src/lib/data/currentProfiles.ts', 'batch-ac-reserve-redemption.json'],
 ['src/lib/data/registryV3.ts', 'ac-legal.json'], ['src/lib/data/registryV3.ts', 'batch-ac-components.json'],
 ['src/lib/data/incomeProfilesV3.ts', 'batch-ac-income.json'], ['docs/migration/registry-v3-foundation.json', 'data/ac-legal.json'],
 ['docs/migration/registry-v3-foundation.json', 'data/batch-ac-components.json'], ['docs/migration/registry-v3-income-profiles.json', 'data/batch-ac-income.json']
];
for (const [file, marker] of wiring) check(text(file).includes(marker), `${file}: missing ${marker}`);
check(deploymentManifest.minimum_count === 184, 'deployment manifest minimum mismatch');
check(migrationAudit.minimum_counts.deployments === 184 && migrationAudit.coverage.protected_stablecoins === 117, 'migration audit mismatch');
check(candidateMaster.status === 'batch_030_complete' && candidateMaster.protected_minimums?.total_candidates === 117 && candidateMaster.protected_minimums?.promoted_candidates === 117, 'candidate master not advanced to 117');

for (const body of [spec, amendment, agents, roadmap, governance]) {
  check(body.includes('PR #498'), 'PR #498 authority missing');
  check(body.includes('MNEE'), 'MNEE authority missing');
  check(body.includes('YLDS'), 'YLDS deferred boundary missing');
  check(body.includes('REVIEW GATE'), 'REVIEW GATE missing');
}
check(agents.includes('Canonical stable assets: 117'), 'AGENTS count not updated');
check(roadmap.includes('Stable assets: 117') || roadmap.includes('Canonical stable assets: 117'), 'roadmap count not updated');
check(governance.includes('PR #498 Record Growth Batch 4 — MNEE'), 'governance work item missing');
check(text('scripts/validate-active-workstream.mjs').trim() === "import './validate-record-growth-batch-4-mnee-pr498.mjs';", 'active-workstream validator not wired to PR #498');

const requiredFiles = [
 'data/stablecoins-batch-ac.json','data/organizations-batch-ac.json','data/issuers-batch-ac.json','data/relationships-batch-ac.json',
 'data/stablecoin-classification-batch-ac.json','data/events-batch-ac.json','data/event-details-batch-ac.json','data/evidence-batch-ac.json',
 'data/batch-ac-context.json','data/batch-ac-reserve-redemption.json','data/batch-ac-review-gaps.json','data/batch-ac-deployments.json',
 'data/ac-legal.json','data/batch-ac-components.json','data/batch-ac-income.json','data/candidate-promotions-batch-30.json',
 'data/deployment-verification-growth-pr498.json','docs/migration/registry-v2-baseline-batch-zd.json',
 'data/editorial-research/record-growth-batch-4-mnee-pr498-source-review.json','docs/migration/record-growth-batch-4-mnee-pr498-handoff.json'
];
for (const file of requiredFiles) check(fs.existsSync(path.join(root, file)), `required PR #498 file missing: ${file}`);

if (failures.length) {
  console.error('PR #498 MNEE validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(JSON.stringify({
  ok: true,
  validation_id: 'sog_pr498_mnee_complete_record',
  counts: actual,
  stablecoin_id: 'sog_st_mnee',
  issuer_id: 'sog_issuer_mnee_limited',
  one_sat_token_id: oneSatId,
  ethereum_contract: ethereumContract,
  evidence_records: evidence.length,
  known_unknowns: gaps.length,
  deployment_overlay: 'identifier_recorded_unverified',
  next_work_item: 'REVIEW_GATE'
}, null, 2));
