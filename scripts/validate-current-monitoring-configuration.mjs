import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';
import { validateOfficialSourceBaselines } from './monitoring/baselines/baseline-store.mjs';
import { validateOfficialSources } from './monitoring/monitors/official-source-observer.mjs';

const root = process.cwd();
const failures = [];
const readRows = (file) => { const value = JSON.parse(fs.readFileSync(path.join(root, file), 'utf8')); return Array.isArray(value) ? value : value.records ?? []; };
const baseline = loadRegistryV2Baseline(root);
const stablecoins = (baseline.data_groups?.stablecoins ?? []).flatMap(readRows);
const organizations = (baseline.data_groups?.organizations ?? []).flatMap(readRows);
const relationships = (baseline.data_groups?.relationships ?? []).flatMap(readRows);
const sources = JSON.parse(fs.readFileSync('scripts/monitoring/sources/official-sources.json', 'utf8'));
const baselineSet = JSON.parse(fs.readFileSync('scripts/monitoring/baselines/official-source-baselines.json', 'utf8'));
const workflow = fs.readFileSync('.github/workflows/monitoring-review.yml', 'utf8');
const fail = (condition, message) => { if (!condition) failures.push(message); };

const sourceIds = sources.map((row) => row.source_id);
const baselineIds = (baselineSet.baselines ?? []).map((row) => row.source_id);
fail(stablecoins.length >= 92, 'canonical registry must not fall below the completed 92-record baseline');
fail(sources.length === 24, 'current monitoring configuration must contain 24 sources');
fail(baselineSet.baselines?.length === 24, 'current monitoring configuration must contain 24 baselines');
fail(new Set(sourceIds).size === 24, 'monitoring source IDs must be unique');
fail(new Set(baselineIds).size === 24, 'monitoring baseline IDs must be unique');
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
console.log(`Current monitoring configuration valid: ${sources.length} pending sources across ${stablecoins.length} canonical assets.`);
