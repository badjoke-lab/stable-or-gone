import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const write = (file, value) => fs.writeFileSync(path.join(root, file), value);
const replaceRequired = (text, before, after, label) => {
  if (!text.includes(before)) throw new Error(`Missing anchor: ${label}`);
  return text.replace(before, after);
};

{
  const file = 'README.md';
  let text = read(file);
  text = replaceRequired(text, '92 events\n92 Event v2 detail records\n279 evidence records\n279 evidence relation projections', '97 events\n97 Event v2 detail records\n286 evidence records\n286 evidence relation projections', 'README counts');
  text = replaceRequired(text,
    'The build chain runs baseline, candidate, data, compatibility, classification, profile, event, evidence-relation, Registry v3, deployment, income-profile, final-state, batch-finalization, and integrity validation before Astro check and site generation.',
    'The build chain runs deployment-policy, baseline, candidate, data, compatibility, classification, profile, event, evidence-relation, Registry v3, deployment, income-profile, final-state, batch-finalization, and integrity validation before Astro check and site generation.',
    'README build chain');
  text = replaceRequired(text,
    'A separate production workflow waits for the Cloudflare Pages deployment after each `main` push and repeats the HTML, JSON, sitemap, and metadata checks against the public origin.\n\nUseful commands:',
    '## Development and production deployment\n\nDevelopment validation and production publication are separate. Normal pull requests and normal `main` merges complete through GitHub CI and do not wait for Cloudflare Pages.\n\nProduction deployment is reserved for defined publication checkpoints or verified emergencies. The target workflow builds in GitHub Actions, uploads the prebuilt `dist` directory with Wrangler, and then verifies the public origin.\n\nCanonical policy: `docs/deployment-policy.md`\n\nCloudflare operator setup: `docs/cloudflare-pages.md`\n\nUseful commands:',
    'README production paragraph');
  text = replaceRequired(text,
    '```bash\nnpm run validate:finalization',
    '```bash\nnpm run validate:deployment-policy\nnpm run validate:finalization',
    'README useful commands');
  write(file, text);
}

{
  const file = 'docs/roadmap.md';
  let text = read(file);
  text = replaceRequired(text,
    '## Cloudflare and public-parity position\n\nIssue #66 remains open as a deferred verification item. It no longer blocks 70-record quality work.',
    '## Cloudflare and public-parity position\n\nAll deployment classifications and timing follow `docs/deployment-policy.md`. Normal pull requests and normal `main` merges do not wait for Cloudflare Pages.\n\nIssue #66 remains open as a deferred verification item. It no longer blocks 70-record quality work.',
    'roadmap deployment policy link');
  text = replaceRequired(text,
    '# Validation and merge rules\n\nEvery work item in this roadmap must:',
    '# Validation and merge rules\n\nDeployment decisions must follow `docs/deployment-policy.md`. Production publication is manual and separate from normal development completion.\n\nEvery work item in this roadmap must:',
    'roadmap validation rule');
  write(file, text);
}

{
  const file = '.github/workflows/production-smoke.yml';
  let text = read(file);
  text = replaceRequired(text,
`on:
  push:
    branches:
      - main
  workflow_dispatch:
  schedule:
    - cron: '23 3 * * *'`,
`on:
  workflow_dispatch:`,
    'production smoke triggers');
  text = text.replace('run: npm install --no-audit --no-fund', 'run: npm install --no-package-lock --no-audit --no-fund');
  text = text.replace('name: Check production endpoints', 'name: Check deliberately deployed production endpoints');
  write(file, text);
}

console.log('Applied deployment-policy documentation and workflow updates.');
