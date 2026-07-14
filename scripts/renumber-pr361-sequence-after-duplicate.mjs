import fs from 'node:fs';
import { buildReviewGate, serializeReviewGate } from './build-post-pr360-review-gate-pr361.mjs';

// One-time deterministic repair after the closed duplicate PR consumed #362.
const textFiles = [
  'README.md',
  'AGENTS.md',
  'docs/spec-governance.md',
  'docs/roadmap.md',
  'docs/quality/post-pr360-review-gate-pr361-spec.md',
  'scripts/validate-post-pr360-review-gate-pr361.mjs',
  '.github/workflows/pr361-post-pr360-review-gate.yml'
];

const plainOld = [
  'PR #362 Record Depth and Coverage Baseline Refresh',
  'PR #363 Tier A Dossier Deepening Batch 4',
  'PR #364 Evidence and Archive Maintenance Batch 2'
];
const plainNew = [
  'PR #363 Record Depth and Coverage Baseline Refresh',
  'PR #364 Tier A Dossier Deepening Batch 4',
  'PR #365 Evidence and Archive Maintenance Batch 2'
];
const dashOld = [
  'PR #362 — Record Depth and Coverage Baseline Refresh',
  'PR #363 — Tier A Dossier Deepening Batch 4',
  'PR #364 — Evidence and Archive Maintenance Batch 2'
];
const dashNew = [
  'PR #363 — Record Depth and Coverage Baseline Refresh',
  'PR #364 — Tier A Dossier Deepening Batch 4',
  'PR #365 — Evidence and Archive Maintenance Batch 2'
];
const plainPlaceholders = ['__SOG_NEXT_BASELINE__', '__SOG_NEXT_DOSSIER__', '__SOG_NEXT_EVIDENCE__'];
const dashPlaceholders = ['__SOG_NEXT_BASELINE_DASH__', '__SOG_NEXT_DOSSIER_DASH__', '__SOG_NEXT_EVIDENCE_DASH__'];

function renumber(body) {
  for (let i = 0; i < plainOld.length; i += 1) body = body.replaceAll(plainOld[i], plainPlaceholders[i]);
  for (let i = 0; i < dashOld.length; i += 1) body = body.replaceAll(dashOld[i], dashPlaceholders[i]);
  for (let i = 0; i < plainNew.length; i += 1) body = body.replaceAll(plainPlaceholders[i], plainNew[i]);
  for (let i = 0; i < dashNew.length; i += 1) body = body.replaceAll(dashPlaceholders[i], dashNew[i]);

  const replacements = [
    ['PR #362–#364', 'PR #363–#365'],
    ['PR #362-#364', 'PR #363-#365'],
    ['[362,363,364]', '[363,364,365]'],
    ['[362, 363, 364]', '[363, 364, 365]'],
    ['after PR #364', 'after PR #365'],
    ['After PR #364', 'After PR #365'],
    ['through PR #364', 'through PR #365'],
    ['PR #362 baseline refresh decision', 'PR #363 baseline refresh decision'],
    ['PR #363 dossier decision', 'PR #364 dossier decision'],
    ['PR #364 Evidence maintenance decision', 'PR #365 Evidence maintenance decision'],
    ['Approved sequence: **PR #362 → #363 → #364 → review gate**', 'Approved sequence: **PR #363 → #364 → #365 → review gate**'],
    ['exact PR #362–#364 sequence', 'exact PR #363–#365 sequence'],
    ['limited to PR #362–#364', 'limited to PR #363–#365'],
    ['approved sequence must be PR #362–#364', 'approved sequence must be PR #363–#365'],
    ['review gate must recur after PR #364', 'review gate must recur after PR #365'],
    ['PR #362 must follow PR #361', 'PR #363 must follow PR #361'],
    ['PR #361 as active and PR #362 as next', 'PR #361 as active and PR #363 as next']
  ];
  for (const [from, to] of replacements) body = body.replaceAll(from, to);
  return body;
}

for (const file of textFiles) {
  const before = fs.readFileSync(file, 'utf8');
  const after = renumber(before);
  if (before === after) throw new Error(`${file}: no sequence marker was updated`);
  if (/PR #362(?: | — )Record Depth and Coverage Baseline Refresh/.test(after)) throw new Error(`${file}: stale PR #362 work-item marker remains`);
  fs.writeFileSync(file, after);
}

const report = buildReviewGate();
const sequence = report.approved_next_sequence.map((row) => row.pr);
if (JSON.stringify(sequence) !== JSON.stringify([363, 364, 365])) {
  throw new Error(`Generated review-gate sequence mismatch: ${JSON.stringify(sequence)}`);
}
fs.writeFileSync('docs/migration/post-pr360-review-gate-pr361.json', serializeReviewGate(report));

console.log(JSON.stringify({
  ok: true,
  approved_next_sequence: sequence,
  input_digest_sha256: report.input_digest_sha256,
  updated_files: [...textFiles, 'docs/migration/post-pr360-review-gate-pr361.json']
}, null, 2));
