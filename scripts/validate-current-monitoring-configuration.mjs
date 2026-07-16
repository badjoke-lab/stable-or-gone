import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';
import { validateOfficialSourceBaselines } from './monitoring/baselines/baseline-store.mjs';
import { validateOfficialSources } from './monitoring/monitors/official-source-observer.mjs';

const root = process.cwd();
const failures = [];
const readRows = (file) => { const value = JSON.parse(fs.readFileSync(path.join(root, file), 'utf8')); return Array.isArray(value) ? value : value.records ?? []; };
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const baseline = loadRegistryV2Baseline(root);
const stablecoins = (baseline.data_groups?.stablecoins ?? []).flatMap(readRows);
const organizations = (baseline.data_groups?.organizations ?? []).flatMap(readRows);
const relationships = (baseline.data_groups?.relationships ?? []).flatMap(readRows);
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const sources = readJson('scripts/monitoring/sources/official-sources.json');
const baselineSet = readJson('scripts/monitoring/baselines/official-source-baselines.json');
const workflow = fs.readFileSync('.github/workflows/monitoring-review.yml', 'utf8');
const fail = (condition, message) => { if (!condition) failures.push(message); };

const sourceIds = sources.map((row) => row.source_id);
const baselineIds = (baselineSet.baselines ?? []).map((row) => row.source_id);
const expected = checkpoint.expected_counts ?? {};
fail(stablecoins.length === checkpoint.asset_count, `canonical monitoring boundary must match current checkpoint asset count ${checkpoint.asset_count}, found ${stablecoins.length}`);
fail(organizations.length === expected.organizations, `canonical monitoring boundary must match current checkpoint organizations ${expected.organizations}, found ${organizations.length}`);
fail(relationships.length === expected.relationships, `canonical monitoring boundary must match current checkpoint relationships ${expected.relationships}, found ${relationships.length}`);
fail(sources.length === 41, `current monitoring configuration must contain 41 sources, found ${sources.length}`);
fail(baselineSet.baselines?.length === 41, `current monitoring configuration must contain 41 baselines, found ${baselineSet.baselines?.length ?? 0}`);
fail(new Set(sourceIds).size === 41, 'monitoring source IDs must be unique');
fail(new Set(baselineIds).size === 41, 'monitoring baseline IDs must be unique');
fail(JSON.stringify([...sourceIds].sort()) === JSON.stringify([...baselineIds].sort()), 'source and baseline IDs must match exactly');

const canonicalIndex = {
  stablecoinIds:new Set(stablecoins.map((row) => row.id)),
  organizationIds:new Set(organizations.map((row) => row.id)),
  relationships
};
for (const message of validateOfficialSources(sources, canonicalIndex)) failures.push(message);
for (const message of validateOfficialSourceBaselines(baselineSet, sources)) failures.push(message);
for (const row of baselineSet.baselines ?? []) {
  fail(row.status === 'pending_initial_acceptance', `${row.source_id}: baseline must remain pending`);
  for (const field of ['accepted_final_url','body_sha256','normalized_content_sha256','content_type','etag','last_modified','accepted_observed_at','accepted_repository_commit','accepted_review_reference']) fail(row[field] === null, `${row.source_id}: ${field} must remain null`);
}
for (const token of ['workflow_dispatch:','contents: read','actions/upload-artifact']) fail(workflow.includes(token), `workflow missing ${token}`);
for (const token of ['schedule:','contents: write','pull-requests: write','wrangler','CLOUDFLARE_']) fail(!workflow.includes(token), `workflow contains prohibited ${token}`);
fail(sources.filter((row) => row.monitoring_scope?.kind === 'platform_policy').length === 3, 'current configuration must contain three platform-policy sources');
fail(sources.filter((row) => row.monitoring_scope?.kind === 'platform_service_state').length === 3, 'current configuration must contain three platform service-state scopes');
fail(sources.filter((row) => row.monitoring_scope?.kind === 'regulatory_register').length === 1, 'current configuration must contain one regulatory-register source');
const openUsd = sources.find((row) => row.source_id === 'open-standard-open-usd');
const vsp = sources.find((row) => row.source_id === 'visa-stablecoin-platform');
fail(openUsd?.monitoring_scope?.subject_kind === 'prelaunch_stablecoin' && openUsd?.monitoring_scope?.canonical_record === false, 'Open USD private pre-launch scope changed');
fail(vsp?.monitoring_scope?.subject_kind === 'stablecoin_infrastructure' && vsp?.monitoring_scope?.canonical_record === false, 'VSP private infrastructure scope changed');
fail((openUsd?.affected_stablecoin_ids ?? []).length === 0 && (vsp?.affected_stablecoin_ids ?? []).length === 0, 'noncanonical monitoring subjects gained canonical asset IDs');
fail(baselineSet.policy?.monitoring_write_allowed === false, 'monitoring write must remain disabled');
fail(baselineSet.policy?.canonical_evidence === false, 'monitoring baseline data must not become canonical evidence');
fail(baselineSet.policy?.public_output === false, 'monitoring public output must remain disabled');
fail(baselineSet.policy?.automatic_pull_request === false, 'automatic pull requests must remain disabled');
fail(baselineSet.policy?.production_publication === false, 'production publication must remain disabled');

if (failures.length) {
  console.error('Current monitoring configuration validation failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}
console.log(`Current monitoring configuration valid: 41 pending sources synchronized against current checkpoint ${checkpoint.checkpoint_id} with ${stablecoins.length} canonical assets, ${organizations.length} organizations, and ${relationships.length} relationships.`);
