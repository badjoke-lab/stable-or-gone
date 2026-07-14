import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readRows = (file) => {
  const value = readJson(file);
  if (!Array.isArray(value)) throw new Error(`${file}: expected array`);
  return value;
};
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const equal = (actual, expected, message) => check(JSON.stringify(actual) === JSON.stringify(expected), `${message}: expected ${JSON.stringify(expected)}, found ${JSON.stringify(actual)}`);
const unique = (values) => [...new Set(values)];

const config = readJson('config/tier-a-dossier-batch-4-pr364.json');
const queue = readJson('docs/migration/tier-a-dossier-batch-4-pr364-review-queue.json');
const findings = readJson('docs/migration/tier-a-dossier-batch-4-pr364-findings.json');
const sourceQueue = readJson('docs/migration/tier-a-candidate-queue-pr363.json');
const v2 = loadRegistryV2Baseline(root);
const group = (name) => (v2.data_groups?.[name] ?? []).flatMap(readRows);
const organizations = group('organizations');
const relationships = group('relationships');
const stablecoins = group('stablecoins');
const profiles = group('profiles');
const events = group('events');
const evidence = group('evidence');
const evidenceRelations = group('evidence_relations');
const reserveReports = group('reserve_reports');
const knownUnknowns = group('known_unknowns');
const regulatoryNotes = group('regulatory_notes');
const deployments = group('deployments');
const marketAccess = readJson('data/market-access-records-v1.json');
const foundation = readJson('docs/migration/registry-v3-foundation.json');
const legalProfiles = foundation.data_groups.legal_profiles.flatMap(readRows);

const selected = ['husd', 'poundtoken', 'rlusd', 'usdg', 'usds'];
const selectedIds = ['sog_st_husd', 'sog_st_1gbp', 'sog_st_rlusd', 'sog_st_usdg', 'sog_st_usds'];
equal(config.selected_assets.map((row) => row.asset_slug), selected, 'config selected assets changed');
equal(queue.selected_assets.map((row) => row.asset_slug), selected, 'review queue selected assets changed');
check(config.max_assets === 5, 'PR #364 maximum asset count must remain five');
check(config.new_canonical_assets_allowed === false, 'new canonical assets must remain prohibited');
check(config.market_access_records_allowed === false, 'Market Access changes must remain prohibited');
check(config.new_public_surface_allowed === false, 'new public surface must remain prohibited');
check(config.asset_rank === false && config.single_composite_score === false, 'ranking and composite score must remain prohibited');
check(sourceQueue.candidates.filter((row) => selected.includes(row.asset_slug)).length === 5, 'all selected assets must be present in the reviewed PR #363 queue');

check(findings.status === 'reviewed_source_findings', 'findings status mismatch');
check(findings.selected_asset_count === 5, 'findings selected asset count mismatch');
check(findings.changed_asset_count === 2, 'exactly two assets must receive canonical changes');
check(findings.reviewed_no_safe_change_count === 3, 'exactly three assets must be reviewed no-safe-change');
equal(findings.findings.map((row) => row.asset_slug), selected, 'findings asset order changed');
equal(findings.findings.filter((row) => row.decision === 'canonical_change_applied').map((row) => row.asset_slug), ['usdg','usds'], 'changed assets changed');
equal(findings.findings.filter((row) => row.decision === 'reviewed_no_safe_change').map((row) => row.asset_slug), ['husd','poundtoken','rlusd'], 'no-safe-change assets changed');
for (const finding of findings.findings) {
  check(selectedIds.includes(finding.asset_id), `unexpected finding asset ${finding.asset_id}`);
  check(Array.isArray(finding.reviewed_evidence_ids) && finding.reviewed_evidence_ids.length > 0, `${finding.asset_slug}: reviewed Evidence IDs are required`);
  check(typeof finding.reason === 'string' && finding.reason.length > 40, `${finding.asset_slug}: bounded decision reason is required`);
  if (finding.decision === 'reviewed_no_safe_change') check((finding.canonical_files_changed ?? []).length === 0, `${finding.asset_slug}: no-safe-change finding must not name canonical files`);
}

const expectedCounts = {
  stablecoins: 112,
  organizations: 107,
  relationships: 124,
  profiles: 112,
  events: 187,
  evidence: 559,
  evidence_relations: 559,
  reserve_reports: 120,
  known_unknowns: 325,
  regulatory_notes: 9,
  deployments: 174,
  market_access_records: 8,
  legal_profiles: 112
};
const actualCounts = {
  stablecoins: stablecoins.length,
  organizations: organizations.length,
  relationships: relationships.length,
  profiles: profiles.length,
  events: events.length,
  evidence: evidence.length,
  evidence_relations: evidenceRelations.length,
  reserve_reports: reserveReports.length,
  known_unknowns: knownUnknowns.length,
  regulatory_notes: regulatoryNotes.length,
  deployments: deployments.length,
  market_access_records: marketAccess.length,
  legal_profiles: legalProfiles.length
};
equal(actualCounts, expectedCounts, 'canonical boundary changed');
check(unique(stablecoins.map((row) => row.id)).length === stablecoins.length, 'stablecoin IDs must remain unique');
check(unique(organizations.map((row) => row.id)).length === organizations.length, 'organization IDs must remain unique');
check(unique(relationships.map((row) => row.id)).length === relationships.length, 'relationship IDs must remain unique');
check(unique(profiles.map((row) => row.id)).length === profiles.length, 'profile IDs must remain unique');
check(unique(evidence.map((row) => row.id)).length === evidence.length, 'Evidence IDs must remain unique');
check(unique(knownUnknowns.map((row) => row.id)).length === knownUnknowns.length, 'known-unknown IDs must remain unique');
check(unique(legalProfiles.map((row) => row.id)).length === legalProfiles.length, 'legal-profile IDs must remain unique');

const orgById = new Map(organizations.map((row) => [row.id, row]));
const relById = new Map(relationships.map((row) => [row.id, row]));
const profileById = new Map(profiles.map((row) => [row.id, row]));
const evidenceById = new Map(evidence.map((row) => [row.id, row]));
const unknownById = new Map(knownUnknowns.map((row) => [row.id, row]));
const legalById = new Map(legalProfiles.map((row) => [row.id, row]));

for (const id of ['sog_issuer_paxos_digital_singapore','sog_issuer_paxos_issuance_europe']) check(orgById.has(id), `missing exact USDG issuer organization ${id}`);
check(orgById.get('sog_issuer_paxos_digital_singapore')?.jurisdiction === 'Singapore', 'Paxos Digital Singapore jurisdiction changed');
check(orgById.get('sog_issuer_paxos_issuance_europe')?.jurisdiction === 'Finland / European Union', 'Paxos Issuance Europe jurisdiction changed');
for (const id of ['sog_rel_usdg_paxos_digital_singapore_pr364','sog_rel_usdg_paxos_issuance_europe_pr364']) {
  const row = relById.get(id);
  check(row?.stablecoin_id === 'sog_st_usdg', `${id}: USDG relationship missing`);
  check(row?.role === 'legal_issuer' && row?.status === 'active', `${id}: legal issuer semantics changed`);
}

for (const id of ['sog_src_usdg_paxos_stablecoin_terms_pr364','sog_src_usds_sky_protocol_interface_pr364']) check(evidenceById.has(id), `missing reviewed Evidence ${id}`);
const usdgTerms = evidenceById.get('sog_src_usdg_paxos_stablecoin_terms_pr364');
check(usdgTerms?.url === 'https://www.paxos.com/terms-and-conditions/stablecoin-terms-conditions', 'USDG terms URL changed');
check(usdgTerms?.published_at === '2026-06-30' && usdgTerms?.accessed_at === '2026-07-14', 'USDG terms date boundary changed');
check(usdgTerms?.reliability === 'high', 'USDG terms reliability changed');
const usdsSource = evidenceById.get('sog_src_usds_sky_protocol_interface_pr364');
check(usdsSource?.url === 'https://sky.money/' && usdsSource?.accessed_at === '2026-07-14', 'USDS source boundary changed');

const usdgProfile = profileById.get('sog_st_usdg');
check(usdgProfile?.redemption_profile?.status === 'eligible_customers_only', 'USDG redemption status changed');
check(usdgProfile?.redemption_profile?.settlement_asset === 'USD', 'USDG settlement asset changed');
check(usdgProfile?.redemption_profile?.as_of_date === '2026-07-14', 'USDG redemption as-of date changed');
check(usdgProfile?.redemption_profile?.evidence_ids?.includes('sog_src_usdg_paxos_stablecoin_terms_pr364'), 'USDG redemption terms Evidence missing');
equal(usdgProfile?.reserve_profile?.backing_types, ['cash','government_securities'], 'USDG backing types changed');

const usdgLegal = legalById.get('sog_st_usdg');
check(usdgLegal?.holder_claim_type === 'direct_claim_on_issuer', 'USDG holder claim changed');
equal(usdgLegal?.claim_against_organization_ids, ['sog_issuer_paxos_digital_singapore','sog_issuer_paxos_issuance_europe'], 'USDG legal issuers changed');
check(usdgLegal?.reserve_segregation === 'stated_segregated', 'USDG segregation semantics changed');
check(usdgLegal?.bankruptcy_remoteness === 'unknown', 'USDG bankruptcy-remoteness boundary changed');
check((usdgLegal?.classifications ?? []).length === 2, 'USDG must retain two jurisdiction-scoped classifications');

const usdsLegal = legalById.get('sog_st_usds');
check(usdsLegal?.classifications?.[0]?.classification === 'protocol_asset', 'USDS protocol classification changed');
check(usdsLegal?.holder_claim_type === 'no_direct_claim', 'USDS holder claim changed');
check(usdsLegal?.reserve_ownership === 'protocol_controlled', 'USDS reserve ownership changed');
check(usdsLegal?.reserve_segregation === 'operationally_separate', 'USDS operational separation changed');
check(usdsLegal?.bankruptcy_remoteness === 'not_applicable', 'USDS bankruptcy-remoteness semantics changed');
check((usdsLegal?.claim_against_organization_ids ?? []).length === 0, 'USDS must not create a corporate holder claim');

check(unknownById.get('sog_unknown_usdg_issuer_entity')?.last_checked_at === '2026-07-14', 'USDG issuer unknown was not narrowed');
check(unknownById.get('sog_unknown_usdg_redemption_path')?.last_checked_at === '2026-07-14', 'USDG redemption unknown was not narrowed');

for (const forbidden of [
  'data/stablecoin-profiles-pr364-tier-a-batch-4.json',
  'data/legal-profiles-v3-pr364-tier-a-batch-4.json',
  'data/known-unknowns-pr364-tier-a-batch-4.json'
]) check(!fs.existsSync(path.join(root, forbidden)), `temporary duplicate override must be removed: ${forbidden}`);

check(findings.boundaries?.new_canonical_assets === 0, 'findings must preserve zero new assets');
check(findings.boundaries?.market_access_record_changes === 0, 'findings must preserve Market Access');
check(findings.boundaries?.deployment_changes === 0, 'findings must preserve deployments');
check(findings.boundaries?.reserve_report_changes === 0, 'findings must preserve reserve reports');
check(findings.boundaries?.income_profile_changes === 0, 'findings must preserve income profiles');
check(findings.boundaries?.new_public_surface === false, 'findings must preserve public surface boundary');

if (failures.length) {
  console.error('PR #364 Tier A Dossier Batch 4 validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  selected_assets: selected,
  changed_assets: ['usdg','usds'],
  reviewed_no_safe_change_assets: ['husd','poundtoken','rlusd'],
  counts: actualCounts,
  new_public_surface: false,
  asset_rank: false,
  single_composite_score: false
}, null, 2));
