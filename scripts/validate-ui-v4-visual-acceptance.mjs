import fs from 'node:fs';

const path = 'config/ui-v4-visual-acceptance.json';
if (!fs.existsSync(path)) throw new Error(`${path} is missing`);

const contract = JSON.parse(fs.readFileSync(path, 'utf8'));
const requiredTemplates = ['home', 'stablecoin_register', 'stablecoin_dossier', 'events', 'organizations', 'guides_longform'];

if (contract.tracking_issue !== 281) throw new Error('UI rebuild must remain linked to issue #281');
if (!['rebuild_in_progress', 'closure_candidate', 'complete'].includes(contract.phase)) throw new Error(`invalid phase: ${contract.phase}`);
if (contract.required_audit_steps_skipped !== false) throw new Error('required visual-audit steps may not be skipped');

for (const key of requiredTemplates) {
  if (typeof contract.templates?.[key] !== 'boolean') throw new Error(`missing boolean template approval: ${key}`);
}

for (const key of ['canonical_data_unchanged_by_design_only_prs', 'routes_preserved', 'machine_readable_outputs_preserved', 'accessibility_checks_required', 'provenance_checks_required']) {
  if (contract.protected_contracts?.[key] !== true) throw new Error(`protected contract disabled: ${key}`);
}

const approvalsComplete = requiredTemplates.every((key) => contract.templates[key] === true)
  && contract.desktop_artifacts_reviewed === true
  && contract.mobile_artifacts_reviewed === true
  && contract.owner_approval?.approved === true
  && typeof contract.owner_approval?.reference === 'string'
  && /^[0-9a-f]{40}$/i.test(contract.owner_approval?.commit ?? '')
  && Number.isInteger(contract.owner_approval?.artifact_run_id);

if (contract.phase === 'complete' || contract.closure_allowed === true) {
  if (!approvalsComplete) throw new Error('UI closure claimed without complete visual and owner approval');
  if (contract.phase !== 'complete' || contract.closure_allowed !== true) throw new Error('complete phase and closure_allowed must be set together');
} else if (contract.owner_approval?.approved === true) {
  throw new Error('owner approval may only be recorded on a closure candidate or complete contract');
}

console.log(JSON.stringify({ ok: true, phase: contract.phase, closure_allowed: contract.closure_allowed, approvals_complete: approvalsComplete }, null, 2));
