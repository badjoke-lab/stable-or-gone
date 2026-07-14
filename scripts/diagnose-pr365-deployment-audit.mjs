import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {loadDeploymentVerification} from './load-deployment-verification.mjs';

execFileSync(process.execPath,['scripts/audit-registry-deployment-chain-identity-current.mjs'],{stdio:'inherit',env:process.env});
const report=JSON.parse(fs.readFileSync('data/generated/registry-deployment-chain-identity-audit.json','utf8'));
const checkpoint=JSON.parse(fs.readFileSync('docs/migration/current-canonical-checkpoint.json','utf8'));
const verification=loadDeploymentVerification(process.cwd());
const compact={
  schema_version:'1.0',
  report_id:'sog_pr365_deployment_audit_diagnostic',
  checkpoint_id:checkpoint.checkpoint_id,
  expected_counts:checkpoint.expected_counts,
  audited_counts:report.audited_counts,
  result:report.result,
  critical:report.findings?.critical??[],
  network_review_needed:report.taxonomy?.network_review_needed??[],
  aggregate_network_context_count:(report.taxonomy?.aggregate_network_context??[]).length,
  freeze_not_recorded_count:(report.control_capability?.freeze_not_recorded??[]).length,
  blacklist_not_recorded_count:(report.control_capability?.blacklist_not_recorded??[]).length,
  verification_expected:verification.status_counts,
  verification_actual:report.verification?.state_counts??{},
  review_needed_count:(report.verification?.review_needed??[]).length,
  not_recorded_or_unknown_count:(report.verification?.not_recorded_or_unknown??[]).length,
  identifier_not_recorded_count:(report.verification?.identifiers_not_recorded??[]).length,
  missing_evidence_ids:report.evidence?.missing_evidence_ids??[]
};
fs.writeFileSync('docs/migration/pr365-deployment-audit-diagnostic.json',`${JSON.stringify(compact,null,2)}\n`);
console.log('Wrote PR #365 deployment diagnostic.');
