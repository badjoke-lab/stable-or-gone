import fs from 'node:fs';
import './validate-batch21-growth-d.mjs';
import './validate-current-final-eight.mjs';

const read = (file) => fs.readFileSync(file, 'utf8');
const roadmap = read('docs/roadmap.md');
const agents = read('AGENTS.md');
const governance = read('docs/spec-governance.md');
const nonUiPlan = read('docs/quality/non-ui-quality-program.md');
const releaseBaseline = JSON.parse(read('docs/migration/registry-release-integrity-baseline.json'));
const checkpoint = JSON.parse(read('docs/migration/audited-100-asset-canonical-checkpoint.json'));
const historical321 = JSON.parse(read('scripts/monitoring/baselines/monitoring-baseline-sync-100-assets.json'));
const historical322 = JSON.parse(read('scripts/monitoring/baselines/monitoring-reserve-redemption-expansion-100-assets.json'));
const current323 = JSON.parse(read('scripts/monitoring/baselines/monitoring-lifecycle-regulatory-market-access-expansion-100-assets.json'));
const scheduledSpec = read('docs/quality/monitoring-bounded-scheduled-read-only-spec.md');
const scheduledWorkflow = read('.github/workflows/monitoring-bounded-scheduled-read-only.yml');
const baselineSpec = read('docs/quality/monitoring-baseline-spec.md');

const failures = [];
const requireText = (body, text, file) => {
  if (!body.includes(text)) failures.push(`${file}: missing ${text}`);
};

requireText(roadmap, 'Current item: PR #324 bounded scheduled read-only monitoring', 'roadmap');
requireText(roadmap, 'Next item: PR #325 deterministic statistics generator and validator', 'roadmap');
requireText(roadmap, 'PR #323 lifecycle, regulatory, and EU market-access source/schema expansion: complete', 'roadmap');
requireText(agents, 'Active: PR #324 bounded scheduled read-only monitoring', 'AGENTS');
requireText(agents, 'Next: PR #325 deterministic statistics generator and validator', 'AGENTS');
requireText(governance, 'PR #324 bounded scheduled read-only monitoring governance', 'governance');
requireText(nonUiPlan, 'PR #324 bounded scheduled read-only monitoring: active', 'non-UI plan');
requireText(nonUiPlan, 'PR #325 deterministic statistics generator and validator: next', 'non-UI plan');
requireText(scheduledSpec, 'bounded scheduled read-only monitoring specification', 'PR #324 spec');
requireText(scheduledSpec, 'daily count = 4', 'PR #324 spec');
requireText(scheduledSpec, 'weekly count = 35', 'PR #324 spec');
requireText(scheduledWorkflow, 'contents: read', 'PR #324 workflow');
requireText(scheduledWorkflow, "cron: '17 3 * * *'", 'PR #324 workflow');
requireText(scheduledWorkflow, "cron: '23 4 * * 0'", 'PR #324 workflow');
requireText(baselineSpec, 'sources: 39', 'baseline spec');
requireText(baselineSpec, 'pending_initial_acceptance: 39', 'baseline spec');

if (releaseBaseline.status !== 'current') failures.push('release baseline must be current');
if (releaseBaseline.expected_v2_counts?.stablecoins !== 100) failures.push('release baseline must protect 100 assets');
if (checkpoint.status !== 'audited') failures.push('checkpoint must be audited');
if (checkpoint.v2_groups?.stablecoins?.record_count !== 100) failures.push('checkpoint must protect 100 assets');

if (historical321.source_baseline_sync?.source_count !== 24) failures.push('PR #321 historical source count changed');
if (historical321.coverage?.registered_asset_reach_count !== 16) failures.push('PR #321 historical reach changed');
if (historical321.coverage?.uncovered_asset_count !== 84) failures.push('PR #321 historical uncovered queue changed');
if (historical321.source_baseline_sync?.accepted !== 0) failures.push('PR #321 historical accepted count changed');

if (historical322.source_baseline_sync?.source_count !== 30) failures.push('PR #322 historical source count changed');
if (historical322.coverage?.registered_asset_reach_count !== 22) failures.push('PR #322 historical reach changed');
if (historical322.coverage?.uncovered_asset_count !== 78) failures.push('PR #322 historical uncovered queue changed');
if (historical322.source_baseline_sync?.accepted !== 0) failures.push('PR #322 historical accepted count changed');

if (current323.source_baseline_sync?.source_count !== 39) failures.push('current source count must be 39');
if (current323.source_baseline_sync?.baseline_count !== 39) failures.push('current baseline count must be 39');
if (current323.source_baseline_sync?.pending_initial_acceptance !== 39) failures.push('current pending count must be 39');
if (current323.source_baseline_sync?.accepted !== 0) failures.push('current accepted count must be zero');
if (current323.source_baseline_sync?.missing !== 0) failures.push('current missing count must be zero');
if (current323.coverage?.registered_asset_reach_count !== 23) failures.push('current reach must be 23');
if (current323.coverage?.uncovered_asset_count !== 77) failures.push('current uncovered queue must be 77');
if (current323.coverage?.covered_organization_count !== 18) failures.push('current covered organization count must be 18');
if (current323.coverage?.accepted_asset_reach_count !== 0) failures.push('accepted asset reach must be zero');
if (current323.scoped_coverage?.market_access_schema_capable_source_count !== 5) failures.push('market-access schema-capable source count must be 5');
if (current323.scoped_coverage?.scoped_platform_count !== 4) failures.push('scoped platform count must be 4');
if (current323.source_family_counts?.issuer_lifecycle !== 7) failures.push('lifecycle source family count must be 7');
if (current323.source_family_counts?.regulatory !== 9) failures.push('regulatory source family count must be 9');
if (current323.source_family_counts?.platform_policy !== 3) failures.push('platform-policy source family count must be 3');
if (current323.source_family_counts?.platform_service_state !== 1) failures.push('platform service-state source family count must be 1');
if (current323.source_family_counts?.regulatory_register !== 1) failures.push('regulatory-register source family count must be 1');
if (current323.policy?.network_access_used !== false) failures.push('snapshot generation must be offline');
if (current323.policy?.canonical_action !== 'none') failures.push('snapshot canonical action must be none');
if (current323.policy?.public_output !== false) failures.push('snapshot public output must be false');

if (failures.length) {
  console.error('100-record core workstream validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Workstream valid: PR #323 complete, PR #324 active, PR #325 next.');
