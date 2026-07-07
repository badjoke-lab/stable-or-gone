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
const historical = JSON.parse(read('scripts/monitoring/baselines/monitoring-baseline-sync-100-assets.json'));
const current = JSON.parse(read('scripts/monitoring/baselines/monitoring-reserve-redemption-expansion-100-assets.json'));
const expansionSpec = read('docs/quality/monitoring-reserve-redemption-source-expansion-spec.md');
const baselineSpec = read('docs/quality/monitoring-baseline-spec.md');

const failures = [];
const requireText = (body, text, file) => {
  if (!body.includes(text)) failures.push(`${file}: missing ${text}`);
};

requireText(roadmap, 'Current item: PR #322 reserve and redemption source expansion', 'roadmap');
requireText(roadmap, 'Next item: PR #323 lifecycle, regulatory, and EU market-access source/schema expansion', 'roadmap');
requireText(roadmap, 'PR #321 100-asset monitoring baseline synchronization: complete', 'roadmap');
requireText(agents, 'Active: PR #322 reserve and redemption source expansion', 'AGENTS');
requireText(agents, 'Next: PR #323 lifecycle, regulatory, and EU market-access source/schema expansion', 'AGENTS');
requireText(governance, 'PR #322 reserve/redemption source-expansion governance', 'governance');
requireText(nonUiPlan, 'PR #322 reserve and redemption source expansion: active', 'non-UI plan');
requireText(nonUiPlan, 'PR #323 lifecycle, regulatory, and EU market-access source/schema expansion: next', 'non-UI plan');
requireText(expansionSpec, 'reserve and redemption source expansion specification', 'PR #322 spec');
requireText(expansionSpec, 'scripts/validate-monitoring-reserve-redemption-expansion-100-assets.mjs', 'PR #322 spec');
requireText(baselineSpec, 'reviewed official sources: 30', 'baseline spec');
requireText(baselineSpec, 'pending_initial_acceptance: 30', 'baseline spec');

if (releaseBaseline.status !== 'current') failures.push('release baseline must be current');
if (releaseBaseline.expected_v2_counts?.stablecoins !== 100) failures.push('release baseline must protect 100 assets');
if (checkpoint.status !== 'audited') failures.push('checkpoint must be audited');
if (checkpoint.v2_groups?.stablecoins?.record_count !== 100) failures.push('checkpoint must protect 100 assets');

if (historical.source_baseline_sync?.source_count !== 24) failures.push('historical source count changed');
if (historical.coverage?.registered_asset_reach_count !== 16) failures.push('historical reach changed');
if (historical.coverage?.uncovered_asset_count !== 84) failures.push('historical uncovered queue changed');
if (historical.source_baseline_sync?.accepted !== 0) failures.push('historical accepted count changed');

if (current.source_baseline_sync?.source_count !== 30) failures.push('current source count must be 30');
if (current.source_baseline_sync?.baseline_count !== 30) failures.push('current baseline count must be 30');
if (current.source_baseline_sync?.pending_initial_acceptance !== 30) failures.push('current pending count must be 30');
if (current.source_baseline_sync?.accepted !== 0) failures.push('current accepted count must be zero');
if (current.source_baseline_sync?.missing !== 0) failures.push('current missing count must be zero');
if (current.coverage?.registered_asset_reach_count !== 22) failures.push('current reach must be 22');
if (current.coverage?.uncovered_asset_count !== 78) failures.push('current uncovered queue must be 78');
if (current.coverage?.covered_organization_count !== 18) failures.push('current covered organization count must be 18');
if (current.coverage?.accepted_asset_reach_count !== 0) failures.push('accepted asset reach must be zero');
if (current.source_family_counts?.issuer_lifecycle !== 5) failures.push('lifecycle family changed');
if (current.source_family_counts?.regulatory !== 5) failures.push('regulatory family changed');
if (current.policy?.network_access_used !== false) failures.push('snapshot generation must be offline');
if (current.policy?.canonical_action !== 'none') failures.push('snapshot canonical action must be none');
if (current.policy?.public_output !== false) failures.push('snapshot public output must be false');

if (failures.length) {
  console.error('100-record core workstream validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Workstream valid: PR #321 complete, PR #322 active, PR #323 next.');
