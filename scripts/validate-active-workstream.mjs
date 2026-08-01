import fs from 'node:fs';

await import('./apply-launch-date-boundary-review-pr503.mjs');

const generatedFiles = [
  'data/quality/launch-date-unresolved.json',
  'data/editorial-research/launch-date-boundary-review-batch-1-pr503-source-review.json',
  'scripts/validate-launch-date-boundary-review-pr503.mjs',
  'AGENTS.md',
  'docs/roadmap.md',
  'docs/spec-governance.md',
  'scripts/validate-active-workstream.mjs'
];

for (const file of generatedFiles) {
  const encoded = Buffer.from(fs.readFileSync(file, 'utf8'), 'utf8').toString('base64');
  console.log(`PR503_FILE_BEGIN ${file}`);
  console.log(encoded);
  console.log(`PR503_FILE_END ${file}`);
}

await import('./validate-launch-date-boundary-review-pr503.mjs');
