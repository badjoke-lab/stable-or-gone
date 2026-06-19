import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const errors = [];

const absolute = (relativePath) => path.join(root, relativePath);
const exists = (relativePath) => fs.existsSync(absolute(relativePath));
const read = (relativePath) => fs.readFileSync(absolute(relativePath), 'utf8');
const fail = (message) => errors.push(message);

const requiredFiles = [
  'AGENTS.md',
  'README.md',
  'docs/deployment-policy.md',
  'docs/cloudflare-pages.md',
  '.github/pull_request_template.md',
  '.github/workflows/production-consistency.yml'
];

for (const file of requiredFiles) {
  if (!exists(file)) fail(`missing required deployment-policy file: ${file}`);
}

if (exists('AGENTS.md')) {
  const text = read('AGENTS.md');
  if (!text.includes('docs/deployment-policy.md')) fail('AGENTS.md must reference docs/deployment-policy.md');
  if (!text.includes('A normal pull request must not wait for Cloudflare Pages')) fail('AGENTS.md must prohibit waiting for Cloudflare in normal PRs');
}

if (exists('README.md')) {
  const text = read('README.md');
  if (!text.includes('docs/deployment-policy.md')) fail('README.md must reference docs/deployment-policy.md');
  if (/after each `?main`? push/i.test(text)) fail('README.md still describes production verification after each main push');
}

if (exists('docs/cloudflare-pages.md')) {
  const text = read('docs/cloudflare-pages.md');
  if (!text.includes('docs/deployment-policy.md')) fail('docs/cloudflare-pages.md must defer deployment timing to docs/deployment-policy.md');
}

if (exists('.github/pull_request_template.md')) {
  const text = read('.github/pull_request_template.md');
  const requiredTemplateText = [
    'No production deployment required',
    'Publication checkpoint deployment required after merge',
    'Emergency production deployment required',
    'docs/deployment-policy.md'
  ];
  for (const phrase of requiredTemplateText) {
    if (!text.includes(phrase)) fail(`pull request template is missing: ${phrase}`);
  }
}

const workflowDir = absolute('.github/workflows');
const workflowFiles = fs.readdirSync(workflowDir)
  .filter((name) => /\.ya?ml$/i.test(name))
  .sort();

const topLevelTrigger = (text, trigger) => new RegExp(`^\\s{2}${trigger}:`, 'm').test(text);

for (const name of workflowFiles) {
  const relativePath = `.github/workflows/${name}`;
  const text = read(relativePath);
  const deploysPages = /wrangler\s+pages\s+deploy/i.test(text);
  const checksProduction = /check:production/.test(text);

  if (deploysPages && name !== 'deploy-production.yml') {
    fail(`${relativePath} calls wrangler pages deploy outside the approved manual deployment workflow`);
  }

  if (checksProduction && (topLevelTrigger(text, 'push') || topLevelTrigger(text, 'pull_request') || topLevelTrigger(text, 'schedule'))) {
    fail(`${relativePath} runs production checks from an automatic trigger`);
  }
}

if (exists('.github/workflows/production-consistency.yml')) {
  const text = read('.github/workflows/production-consistency.yml');
  if (!topLevelTrigger(text, 'workflow_dispatch')) fail('production-consistency.yml must have workflow_dispatch');
  for (const trigger of ['push', 'pull_request', 'schedule']) {
    if (topLevelTrigger(text, trigger)) fail(`production-consistency.yml must not have ${trigger} trigger`);
  }
}

if (exists('.github/workflows/deploy-production.yml')) {
  const text = read('.github/workflows/deploy-production.yml');
  if (!topLevelTrigger(text, 'workflow_dispatch')) fail('deploy-production.yml must have workflow_dispatch');
  for (const trigger of ['push', 'pull_request', 'schedule']) {
    if (topLevelTrigger(text, trigger)) fail(`deploy-production.yml must not have ${trigger} trigger`);
  }
  if (!/wrangler\s+pages\s+deploy/i.test(text)) fail('deploy-production.yml must upload prebuilt assets with Wrangler');
  if (!/npm\s+run\s+build/.test(text)) fail('deploy-production.yml must run the full repository build');
  if (!/check:production/.test(text)) fail('deploy-production.yml must verify production after deployment');
}

if (exists('package.json')) {
  const packageJson = JSON.parse(read('package.json'));
  const scripts = packageJson.scripts ?? {};
  if (scripts['validate:deployment-policy'] !== 'node scripts/validate-deployment-policy.mjs') {
    fail('package.json must define validate:deployment-policy');
  }
  if (!String(scripts.build ?? '').includes('validate:deployment-policy')) {
    fail('the normal build chain must run validate:deployment-policy');
  }
}

if (errors.length > 0) {
  console.error('Deployment policy validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Deployment policy validation passed across ${workflowFiles.length} workflow files.`);
