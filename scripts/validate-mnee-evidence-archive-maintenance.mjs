import fs from 'node:fs';
import path from 'node:path';

import './validate-record-growth-batch-4-mnee-pr498.mjs';

const root = process.cwd();
const failures = [];

function readJson(relativePath) {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
  } catch (error) {
    failures.push(`${relativePath}: ${error.message}`);
    return null;
  }
}

function readText(relativePath) {
  try {
    return fs.readFileSync(path.join(root, relativePath), 'utf8');
  } catch (error) {
    failures.push(`${relativePath}: ${error.message}`);
    return '';
  }
}

function expect(condition, message) {
  if (!condition) failures.push(message);
}

const configPath = 'config/mnee-evidence-archive-maintenance.json';
const reviewPath = 'data/editorial-research/mnee-evidence-archive-maintenance-batch-1-source-review.json';
const gapsPath = 'data/batch-ac-review-gaps.json';
const evidencePath = 'data/evidence-batch-ac.json';
const deploymentsPath = 'data/batch-ac-deployments.json';
const deploymentOverlayPath = 'data/deployment-verification-growth-pr498.json';
const reservePath = 'data/batch-ac-reserve-redemption.json';
const reserveContextPath = 'data/batch-ac-context.json';
const reserveComponentsPath = 'data/batch-ac-components.json';
const statsPath = 'data/generated/registry-stats.json';

const config = readJson(configPath) ?? {};
const review = readJson(reviewPath) ?? {};
const gaps = readJson(gapsPath) ?? [];
const evidence = readJson(evidencePath) ?? [];
const deployments = readJson(deploymentsPath) ?? [];
const deploymentOverlay = readJson(deploymentOverlayPath) ?? {};
const reserveRows = readJson(reservePath) ?? [];
const reserveContext = readJson(reserveContextPath) ?? [];
const reserveComponents = readJson(reserveComponentsPath) ?? [];
const stats = readJson(statsPath) ?? {};

const expectedTargets = [
  'latest_attestation_body_and_archive',
  'current_reserve_custodian_and_allocation',
  'first_public_ethereum_issuance_date',
  'current_deployment_control_configuration',
  'complete_direct_access_and_jurisdiction_inventory'
];

const expectedGapIds = [
  'sog_ku_mnee_latest_attestation_pr498',
  'sog_ku_mnee_reserve_custodian_pr498',
  'sog_ku_mnee_ethereum_launch_pr498',
  'sog_ku_mnee_controls_pr498',
  'sog_ku_mnee_access_pr498'
];

const expectedEvidenceIds = [
  'sog_src_mnee_launch_pr498',
  'sog_src_mnee_terms_pr498',
  'sog_src_mnee_transparency_pr498',
  'sog_src_mnee_docs_pr498',
  'sog_src_mnee_faq_pr498',
  'sog_src_mnee_attestation_program_pr498',
  'sog_src_mnee_sdk_pr498',
  'sog_src_mnee_ethereum_pr498'
];

expect(config.work_item === 'mnee_evidence_archive_maintenance_batch_1', `${configPath}: unexpected work_item`);
expect(config.stablecoin_id === 'sog_st_mnee', `${configPath}: stablecoin_id must be sog_st_mnee`);
expect(config.issuer_id === 'sog_issuer_mnee_limited', `${configPath}: issuer_id must be sog_issuer_mnee_limited`);
expect(JSON.stringify(config.authorized_targets) === JSON.stringify(expectedTargets), `${configPath}: authorized targets changed`);
expect(config.exit_boundary === 'review_gate', `${configPath}: exit_boundary must be review_gate`);

for (const [field, expected] of Object.entries({
  new_stable_assets: 0,
  new_organizations: 0,
  new_events: 0,
  new_market_access_records: 0,
  new_evidence_max: 8,
  new_reserve_reports_max: 1,
  new_deployments: 0
})) {
  expect(config.limits?.[field] === expected, `${configPath}: limits.${field} must be ${expected}`);
}
expect(config.limits?.material_ui_changes === false, `${configPath}: material UI changes must remain prohibited`);
expect(config.limits?.new_public_route_families === false, `${configPath}: new public route families must remain prohibited`);

expect(review.status === 'reviewed_bounded_maintenance', `${reviewPath}: unexpected status`);
expect(review.authority_pr === 499, `${reviewPath}: authority_pr must be 499`);
expect(review.stablecoin_id === 'sog_st_mnee', `${reviewPath}: stablecoin_id changed`);
expect(review.issuer_id === 'sog_issuer_mnee_limited', `${reviewPath}: issuer_id changed`);
expect(Array.isArray(review.target_dispositions) && review.target_dispositions.length === 5, `${reviewPath}: expected five target dispositions`);
const reviewTargets = (review.target_dispositions ?? []).map((row) => row.target);
expect(JSON.stringify(reviewTargets) === JSON.stringify(expectedTargets), `${reviewPath}: target disposition order or identity changed`);
for (const row of review.target_dispositions ?? []) {
  expect(typeof row.disposition === 'string' && row.disposition.length > 0, `${reviewPath}: ${row.target} missing disposition`);
  expect(typeof row.canonical_action === 'string' && row.canonical_action.length > 0, `${reviewPath}: ${row.target} missing canonical_action`);
  expect(typeof row.remaining_unknown === 'string' && row.remaining_unknown.length > 0, `${reviewPath}: ${row.target} missing remaining_unknown`);
}
expect(review.canonical_change_plan?.new_stable_assets === 0, `${reviewPath}: new stable asset prohibited`);
expect(review.canonical_change_plan?.new_organizations === 0, `${reviewPath}: new organization prohibited`);
expect(review.canonical_change_plan?.new_events === 0, `${reviewPath}: new event prohibited`);
expect(review.canonical_change_plan?.new_evidence === 0, `${reviewPath}: this maintenance result must preserve Evidence count`);
expect(review.canonical_change_plan?.new_reserve_reports === 0, `${reviewPath}: this maintenance result must preserve reserve-report count`);
expect(review.canonical_change_plan?.new_deployments === 0, `${reviewPath}: new deployment prohibited`);
expect(review.canonical_change_plan?.known_unknown_count_change === 0, `${reviewPath}: known-unknown count must be preserved`);
expect(review.canonical_change_plan?.public_route_change === 0, `${reviewPath}: public route count must be preserved`);
expect(review.decision?.all_five_targets_disposed === true, `${reviewPath}: all five targets must have dispositions`);
expect(review.decision?.forced_resolution === false, `${reviewPath}: forced resolution must remain false`);
expect(review.decision?.exit_boundary === 'REVIEW_GATE', `${reviewPath}: exit boundary must be REVIEW_GATE`);

expect(Array.isArray(gaps) && gaps.length === 5, `${gapsPath}: expected five MNEE known unknowns`);
expect(JSON.stringify(gaps.map((row) => row.id)) === JSON.stringify(expectedGapIds), `${gapsPath}: known-unknown IDs changed`);
for (const row of gaps) {
  expect(row.stablecoin_id === 'sog_st_mnee', `${gapsPath}: ${row.id} wrong stablecoin_id`);
  expect(row.issuer_id === 'sog_issuer_mnee_limited', `${gapsPath}: ${row.id} wrong issuer_id`);
  expect(row.last_checked_at === '2026-08-01', `${gapsPath}: ${row.id} last_checked_at must be 2026-08-01`);
  expect(typeof row.description === 'string' && row.description.length > 80, `${gapsPath}: ${row.id} description is too thin`);
}

expect(Array.isArray(evidence) && evidence.length === 8, `${evidencePath}: expected eight preserved MNEE Evidence records`);
expect(JSON.stringify(evidence.map((row) => row.id)) === JSON.stringify(expectedEvidenceIds), `${evidencePath}: Evidence IDs changed`);
const evidenceById = new Map(evidence.map((row) => [row.id, row]));
for (const id of ['sog_src_mnee_terms_pr498', 'sog_src_mnee_transparency_pr498', 'sog_src_mnee_attestation_program_pr498', 'sog_src_mnee_ethereum_pr498']) {
  expect(evidenceById.get(id)?.accessed_at === '2026-08-01', `${evidencePath}: ${id} must be rechecked on 2026-08-01`);
}
expect(evidenceById.get('sog_src_mnee_ethereum_pr498')?.claim_scopes?.includes('upgradeability'), `${evidencePath}: Ethereum Evidence must record upgradeability scope`);
expect(evidenceById.get('sog_src_mnee_ethereum_pr498')?.claim_scopes?.includes('control_capability_boundary'), `${evidencePath}: Ethereum Evidence must preserve control boundary`);

expect(Array.isArray(deployments) && deployments.length === 2, `${deploymentsPath}: expected two MNEE deployments`);
const deploymentById = new Map(deployments.map((row) => [row.id, row]));
const oneSat = deploymentById.get('sog_dep_mnee_1sat_pr498');
const ethereum = deploymentById.get('sog_dep_mnee_ethereum_pr498');
expect(oneSat?.contract_address === 'ae59f3b898ec61acbdb6cc7a245fabeded0c094bf046f35206a3aec60ef88127_0', `${deploymentsPath}: 1Sat token ID changed`);
expect(ethereum?.contract_address?.toLowerCase() === '0x8ccedbae4916b79da7f3f612efb2eb93a2bfd6cf', `${deploymentsPath}: Ethereum contract changed`);
expect(ethereum?.mint_authority_type === 'issuer_controlled_current_roles_unverified', `${deploymentsPath}: Ethereum control boundary missing`);
expect(ethereum?.contract_version?.includes('2025-09-15'), `${deploymentsPath}: Ethereum upgrade date missing`);
expect(ethereum?.evidence_ids?.includes('sog_src_mnee_terms_pr498'), `${deploymentsPath}: Ethereum control policy Evidence missing`);

expect(deploymentOverlay.status_counts?.verified === 0, `${deploymentOverlayPath}: no MNEE deployment may be promoted to verified`);
expect(deploymentOverlay.status_counts?.identifier_recorded_unverified === 2, `${deploymentOverlayPath}: both MNEE deployments must remain identifier_recorded_unverified`);
expect(deploymentOverlay.maintenance_boundary?.verification_status_unchanged === true, `${deploymentOverlayPath}: verification boundary missing`);
expect(deploymentOverlay.maintenance_boundary?.new_deployments === 0, `${deploymentOverlayPath}: new deployments prohibited`);

expect(Array.isArray(reserveRows) && reserveRows.length === 1 && reserveRows[0]?.id === 'sog_st_mnee', `${reservePath}: expected one MNEE reserve/redemption profile`);
expect(reserveRows[0]?.reserve_profile?.as_of_date === null, `${reservePath}: latest report as-of date must remain unknown`);
expect(reserveRows[0]?.reserve_profile?.disclosure_status === 'monthly_attestation_index_report_body_not_preserved', `${reservePath}: attestation body boundary missing`);
expect(reserveRows[0]?.redemption_profile?.as_of_date === '2026-08-01', `${reservePath}: redemption review date not refreshed`);
expect(reserveRows[0]?.redemption_profile?.jurisdiction_restrictions?.includes('complete_current_inventory_not_recorded'), `${reservePath}: access inventory unknown must remain explicit`);
expect(Array.isArray(reserveContext) && reserveContext.length === 1, `${reserveContextPath}: reserve context count changed`);
expect(Array.isArray(reserveComponents) && reserveComponents.length === 2, `${reserveComponentsPath}: reserve component count changed`);
for (const component of reserveComponents) {
  expect(component.share_percent === null, `${reserveComponentsPath}: ${component.id} share must remain unknown`);
  expect(component.amount_text === null, `${reserveComponentsPath}: ${component.id} amount must remain unknown`);
  expect(component.custodian_organization_id === null, `${reserveComponentsPath}: ${component.id} custodian must remain unknown`);
  expect(component.as_of_date === null, `${reserveComponentsPath}: ${component.id} as_of_date must remain unknown`);
}

const expectedCounts = {
  stablecoins: 117,
  organizations: 108,
  events: 192,
  evidence: 579,
  reserve_reports: 125,
  known_unknowns: 342,
  deployments: 184
};
for (const [field, expected] of Object.entries(expectedCounts)) {
  expect(stats.registry?.[field] === expected, `${statsPath}: registry.${field} must remain ${expected}`);
}

const agents = readText('AGENTS.md');
const roadmap = readText('docs/roadmap.md');
expect(agents.includes('MNEE Evidence and Archive Maintenance — Batch 1'), 'AGENTS.md: maintenance item missing');
expect(agents.includes('REVIEW GATE'), 'AGENTS.md: REVIEW GATE boundary missing');
expect(roadmap.includes('MNEE Evidence and Archive Maintenance — Batch 1'), 'docs/roadmap.md: maintenance item missing');
expect(roadmap.includes('REVIEW GATE'), 'docs/roadmap.md: REVIEW GATE boundary missing');
expect(!agents.includes('Figure YLDS work: authorized'), 'AGENTS.md: Figure YLDS must remain prohibited');

if (failures.length) {
  console.error('MNEE evidence and archive maintenance validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  work_item: config.work_item,
  targets_disposed: review.target_dispositions.length,
  evidence_preserved: evidence.length,
  known_unknowns_preserved: gaps.length,
  deployments_preserved: deployments.length,
  canonical_counts: expectedCounts,
  exit_boundary: review.decision.exit_boundary
}, null, 2));
