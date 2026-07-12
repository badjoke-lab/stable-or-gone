import fs from 'node:fs';

const files = ['README.md', 'AGENTS.md', 'docs/spec-governance.md', 'docs/roadmap.md'];
for (const file of files) {
  let body = fs.readFileSync(file, 'utf8');
  body = body.replaceAll(
    'PR #355  Tier A Dossier Deepening — Batch 2 — active',
    'PR #355  Tier A Dossier Deepening — Batch 2 — complete'
  );
  fs.writeFileSync(file, body);
}

const roadmapPath = 'docs/roadmap.md';
let roadmap = fs.readFileSync(roadmapPath, 'utf8');
const oldCheckpoint = `Current reviewed canonical checkpoint after PR #355:

\`\`\`text
110 stable assets
549 evidence records
549 evidence relations
110 legal profiles
0 canonical Market Access Records
\`\`\``;
const newCheckpoint = `Current reviewed canonical checkpoint after PR #356:

\`\`\`text
110 stable assets
551 evidence records
551 evidence relations
110 legal profiles
4 canonical Market Access Records
\`\`\``;
if (!roadmap.includes(oldCheckpoint)) throw new Error('roadmap current checkpoint block not found');
roadmap = roadmap.replace(oldCheckpoint, newCheckpoint);
fs.writeFileSync(roadmapPath, roadmap);

console.log('PR #356 authority sequence and current checkpoint finalized.');
