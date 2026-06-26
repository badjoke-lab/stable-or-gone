import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { isDeepStrictEqual } from 'node:util';

const root = process.cwd();
const versionPath = path.join(root, 'dist/version.json');
const manifestPath = path.join(root, 'dist/data/manifest.json');
const reportPath = path.join(root, 'data/generated/deployment-taxonomy-migration.json');
const versionText = fs.readFileSync(versionPath, 'utf8');
const manifestText = fs.readFileSync(manifestPath, 'utf8');
const version = JSON.parse(versionText);
const manifest = JSON.parse(manifestText);
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

const expected = {
  public_deployment_category: report.counts.public_deployment_category,
  canonical_deployment_type: report.counts.canonical_deployment_type,
  deployment_operational_state: report.counts.operational_state,
  deployment_status: report.counts.raw_status,
  deployment_change_state: report.counts.change_state,
  deployment_canonicality: report.counts.canonicality,
  deployment_canonicality_record_state: report.counts.canonicality_record_state,
  deployment_verification_state: report.counts.verification_state,
  deployment_contract_identity_state: report.counts.contract_identity_state,
  deployment_network_identity_state: report.counts.network_identity_state,
  deployment_chain: report.counts.chain
};

for (const [key, value] of Object.entries(expected)) {
  if (!isDeepStrictEqual(version.data?.record_count_breakdown?.[key], value)) {
    throw new Error(`version deployment breakdown mismatch: ${key}`);
  }
  if (!isDeepStrictEqual(manifest.record_count_breakdown?.[key], value)) {
    throw new Error(`manifest deployment breakdown mismatch: ${key}`);
  }
}

const stripDeploymentAxes = (document, manifestShape = false) => {
  const copy = structuredClone(document);
  const breakdown = manifestShape ? copy.record_count_breakdown : copy.data?.record_count_breakdown;
  for (const key of Object.keys(expected)) delete breakdown[key];
  return copy;
};

try {
  fs.writeFileSync(versionPath, `${JSON.stringify(stripDeploymentAxes(version), null, 2)}\n`);
  fs.writeFileSync(manifestPath, `${JSON.stringify(stripDeploymentAxes(manifest, true), null, 2)}\n`);
  execFileSync(process.execPath, ['scripts/verify-public-layer.mjs'], {
    cwd: root,
    stdio: 'inherit',
    env: process.env
  });
} finally {
  fs.writeFileSync(versionPath, versionText);
  fs.writeFileSync(manifestPath, manifestText);
}

console.log(JSON.stringify({
  ok: true,
  deployments: report.totals.deployments,
  verified_axes: Object.keys(expected)
}, null, 2));
