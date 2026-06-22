import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeJson = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
const decode = (value) => Buffer.from(value, 'base64').toString('utf8');

fs.writeFileSync(
  'data/candidate-stable-assets-emergency-msusd.json',
  decode('WwogIHsKICAgICJjYW5kaWRhdGVfaWQiOiAic29nX2NhbmRfMDAwMDgxIiwKICAgICJwcm9wb3NlZF9yZWNvcmRfaWQiOiAic29nX3N0X21zdXNkIiwKICAgICJzbHVnIjogIm1haW5zdHJlZXQtbXN1c2QiLAogICAgIm5hbWUiOiAiTWFpblN0cmVldFVTRCIsCiAgICAic3ltYm9sIjogIm1zVVNEIiwKICAgICJhbGlhc2VzIjogWyJtc1VTRCIsICJNYWluU3RyZWV0IFVTRCIsICJNYWluU3RyZWV0VVNEIl0sCiAgICAiY2FuZGlkYXRlX3R5cGUiOiAic3RhYmxlY29pbiIsCiAgICAiYXNzZXRfY2xhc3MiOiAic3RhYmxlY29pbiIsCiAgICAicmVmZXJlbmNlX2tpbmQiOiAiZmlhdCIsCiAgICAicmVmZXJlbmNlX2xhYmVsIjogIlVTRCIsCiAgICAicHJpb3JpdHkiOiAiUDAiLAogICAgInN0YXR1cyI6ICJjYW5kaWRhdGUiLAogICAgInRhcmdldF9iYXRjaCI6ICJiYXRjaF8wMTQiLAogICAgIm5vdGVzIjogIkVtZXJnZW5jeSBpbmNpZGVudCBjYW5kaWRhdGUgb3V0c2lkZSBvcmRpbmFyeSBncm93dGguIEtlZXAgYmFzZSBtc1VTRCBzZXBhcmF0ZSBmcm9tIG1zWSwgbGVnYWN5IGNvbnRyYWN0cywgdmF1bHQgcmVjZWlwdHMsIGxlbmRpbmcgcG9zaXRpb25zLCBhbmQgY3Jvc3MtY2hhaW4gcmVwcmVzZW50YXRpb25zLiIKICB9Cl0K')
);

fs.writeFileSync(
  'data/candidate-promotions-batch-n.json',
  decode('WwogIHsKICAgICJjYW5kaWRhdGVfaWQiOiAic29nX2NhbmRfMDAwMDgxIiwKICAgICJzdGF0dXMiOiAicHJvbW90ZWQiLAogICAgIm5vdGVzIjogIkVtZXJnZW5jeSBpbmNpZGVudCBjb250cm9sIGZvciBiYXNlIE1haW5TdHJlZXRVU0QgLyBtc1VTRDsgbXNZLCBsZWdhY3kgY29udHJhY3RzLCB2YXVsdCByZWNlaXB0cywgbGVuZGluZyBwb3NpdGlvbnMsIGFuZCBjcm9zcy1jaGFpbiByZXByZXNlbnRhdGlvbnMgcmVtYWluIHNlcGFyYXRlLiIKICB9Cl0K')
);

const masterFile = 'docs/growth/candidate-master-70.json';
const master = readJson(masterFile);
const candidateFile = 'data/candidate-stable-assets-emergency-msusd.json';
if (!master.candidate_files.includes(candidateFile)) master.candidate_files.push(candidateFile);
master.status = 'emergency_batch_14_included';
master.protected_minimums.total_candidates = 81;
master.protected_minimums.promoted_candidates = 81;
master.protected_minimums.pending_candidates = 0;
master.planned_batches.batch_014 = {
  minimum_candidates: 1,
  theme: 'emergency incident record'
};
master.promotion_policy.batch_014_is_emergency_incident_exception = true;
master.promotion_policy.ordinary_growth_remains_blocked = true;
writeJson(masterFile, master);

const v3File = 'docs/migration/registry-v3-baseline.json';
const v3 = readJson(v3File);
v3.quality.candidate_promotions = 81;
writeJson(v3File, v3);

execFileSync(process.execPath, ['scripts/generate-registry-stats.mjs'], { stdio: 'inherit' });
console.log('msUSD candidate controls and generated stats synchronized');
