import fs from 'node:fs';
import { isDeepStrictEqual } from 'node:util';
import {
  contractIdentityStates,
  deploymentChangeStates,
  deploymentOperationalStates,
  deploymentTypeCategoryMap,
  deploymentVerificationStates,
  networkIdentityStates,
  publicDeploymentCategories,
  rawDeploymentStatusOperationalMap
} from '../config/deployment-taxonomy.mjs';
import { deploymentTaxonomyBaseline } from './deployment-taxonomy-baseline.mjs';

const inputPath = 'data/generated/deployment-taxonomy-migration.json';
const outputPath = 'data/generated/deployment-taxonomy-validation.json';
const report = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const sum = (object) => Object.values(object).reduce((total, value) => total + value, 0);

const records = report.records;
const rawStatuses = [...new Set(records.map((record) => record.status))].sort();
const deploymentTypes = [...new Set(records.map((record) => record.deployment_type))].sort();
const categoryValues = new Set(publicDeploymentCategories.map((entry) => entry.value));
const operationalValues = new Set(deploymentOperationalStates.map((entry) => entry.value));
const changeValues = new Set(deploymentChangeStates.map((entry) => entry.value));
const verificationValues = new Set(deploymentVerificationStates.map((entry) => entry.value));
const contractValues = new Set(contractIdentityStates.map((entry) => entry.value));
const networkValues = new Set(networkIdentityStates.map((entry) => entry.value));

check(report.totals.deployments === deploymentTaxonomyBaseline.deployments, `expected ${deploymentTaxonomyBaseline.deployments} deployments, found ${report.totals.deployments}`);
check(report.totals.unique_ids === deploymentTaxonomyBaseline.unique_ids, `expected ${deploymentTaxonomyBaseline.unique_ids} unique ids, found ${report.totals.unique_ids}`);
check(report.totals.duplicate_ids === 0, `duplicate deployment ids found: ${report.totals.duplicate_ids}`);
check(report.totals.stablecoins_covered === deploymentTaxonomyBaseline.stablecoins_covered, `expected ${deploymentTaxonomyBaseline.stablecoins_covered} covered stablecoins, found ${report.totals.stablecoins_covered}`);
check(report.totals.records_with_evidence === deploymentTaxonomyBaseline.records_with_evidence, 'deployment evidence coverage changed');
check(report.totals.records_with_control_events === deploymentTaxonomyBaseline.records_with_control_events, 'deployment control-event coverage changed');
check(report.field_coverage.verification_status_recorded === deploymentTaxonomyBaseline.verification_status_recorded, 'explicit verification-status inventory changed without review');

for (const status of rawStatuses) check(Boolean(rawDeploymentStatusOperationalMap[status]), `unmapped raw deployment status: ${status}`);
for (const type of deploymentTypes) check(Boolean(deploymentTypeCategoryMap[type]), `unmapped deployment type: ${type}`);
check(records.every((record) => categoryValues.has(record.public_deployment_category) && record.public_deployment_category !== 'unknown'), 'public deployment category contains unresolved current records');
check(records.every((record) => operationalValues.has(record.operational_state)), 'deployment operational state contains an invalid value');
check(records.every((record) => changeValues.has(record.change_state)), 'deployment change state contains an invalid value');
check(records.every((record) => verificationValues.has(record.verification_state)), 'deployment verification state contains an invalid value');
check(records.every((record) => contractValues.has(record.contract_identity_state)), 'contract identity state contains an invalid value');
check(records.every((record) => networkValues.has(record.network_identity_state)), 'network identity state contains an invalid value');
check(records.every((record) => record.evidence_count > 0), 'every deployment must preserve at least one evidence relation');

const counts = report.counts;
check(isDeepStrictEqual(counts.public_deployment_category, deploymentTaxonomyBaseline.public_deployment_categories), `public deployment category counts changed: ${JSON.stringify(counts.public_deployment_category)}`);
check(isDeepStrictEqual(counts.operational_state, deploymentTaxonomyBaseline.operational_states), `operational-state counts changed: ${JSON.stringify(counts.operational_state)}`);
check(isDeepStrictEqual(counts.change_state, deploymentTaxonomyBaseline.change_states), `change-state counts changed: ${JSON.stringify(counts.change_state)}`);
check(isDeepStrictEqual(counts.canonicality, deploymentTaxonomyBaseline.canonicality), `canonicality counts changed: ${JSON.stringify(counts.canonicality)}`);
check(isDeepStrictEqual(counts.canonicality_record_state, deploymentTaxonomyBaseline.canonicality_record_state), `canonicality-record-state counts changed: ${JSON.stringify(counts.canonicality_record_state)}`);
check(isDeepStrictEqual(counts.verification_state, deploymentTaxonomyBaseline.verification_states), `verification-state counts changed: ${JSON.stringify(counts.verification_state)}`);
check(isDeepStrictEqual(counts.contract_identity_state, deploymentTaxonomyBaseline.contract_identity_states), `contract-state counts changed: ${JSON.stringify(counts.contract_identity_state)}`);
check(isDeepStrictEqual(counts.network_identity_state, deploymentTaxonomyBaseline.network_identity_states), `network-state counts changed: ${JSON.stringify(counts.network_identity_state)}`);
for (const [name, values] of Object.entries({
  public_deployment_category: counts.public_deployment_category,
  operational_state: counts.operational_state,
  change_state: counts.change_state,
  canonicality: counts.canonicality,
  canonicality_record_state: counts.canonicality_record_state,
  verification_state: counts.verification_state,
  contract_identity_state: counts.contract_identity_state,
  network_identity_state: counts.network_identity_state
})) check(sum(values) === deploymentTaxonomyBaseline.deployments, `${name} counts do not total ${deploymentTaxonomyBaseline.deployments}`);

const detailSource = fs.readFileSync('src/components/StablecoinDetailView.astro', 'utf8');
for (const heading of ['Public deployment category', 'Canonical deployment type', 'Operational state', 'Recorded status', 'Change or proposal state', 'Canonicality', 'Canonicality record state', 'Verification state', 'Network record state', 'Contract identity state']) {
  check(detailSource.includes(`<th>${heading}</th>`), `deployment table heading is missing: ${heading}`);
}
check(detailSource.includes('resolveDeploymentTaxonomy'), 'stablecoin deployment table must resolve normalized deployment taxonomy');

const machineSource = fs.readFileSync('src/lib/machine-readable.ts', 'utf8');
for (const key of ['public_deployment_category', 'canonical_deployment_type', 'deployment_operational_state', 'deployment_change_state', 'deployment_canonicality', 'deployment_canonicality_record_state', 'deployment_verification_state', 'deployment_contract_identity_state', 'deployment_network_identity_state']) {
  check(machineSource.includes(`${key}: countValues`), `machine-readable deployment breakdown is missing: ${key}`);
}

const statsSource = fs.readFileSync('scripts/generate-registry-stats.mjs', 'utf8');
for (const key of ['public_deployment_categories:', 'canonical_deployment_types:', 'deployment_operational_states:', 'deployment_change_states:', 'deployment_canonicalities:', 'deployment_canonicality_record_states:', 'deployment_verification_states:', 'deployment_contract_identity_states:', 'deployment_network_identity_states:']) {
  check(statsSource.includes(key), `registry stats deployment axis is missing: ${key}`);
}

const validation = {
  schema_version: '1.0',
  validated_at: new Date().toISOString(),
  deployments: records.length,
  raw_status_values: rawStatuses.length,
  canonical_deployment_types: deploymentTypes.length,
  public_categories: publicDeploymentCategories.length,
  operational_states: deploymentOperationalStates.length,
  change_states: deploymentChangeStates.length,
  verification_states: deploymentVerificationStates.length,
  counts: {
    public_deployment_category: counts.public_deployment_category,
    operational_state: counts.operational_state,
    change_state: counts.change_state,
    canonicality: counts.canonicality,
    canonicality_record_state: counts.canonicality_record_state,
    verification_state: counts.verification_state,
    contract_identity_state: counts.contract_identity_state,
    network_identity_state: counts.network_identity_state
  },
  failures
};
fs.writeFileSync(outputPath, `${JSON.stringify(validation, null, 2)}\n`);
if (failures.length) throw new Error(failures.join('\n'));
console.log(JSON.stringify({ ...validation, failures: undefined }, null, 2));
