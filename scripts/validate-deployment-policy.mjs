import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const errors = [];

const absolute = (relativePath) => path.join(root, relativePath);
const exists = (relativePath) => fs.existsSync(absolute(relativePath));
const read = (relativePath) => fs.readFileSync(absolute(relativePath), 'utf8');
const fail = (message) => errors.push(message);
const requireText = (file, phrases) => {
  if (!exists(file)) {
    fail(`missing required deployment-policy file: ${file}`);
    return;
  }
  const text = read(file);
  for (const phrase of phrases) {
    if (!text.includes(phrase)) fail(`${file} is missing required text: ${phrase}`);
  }
};

const requiredFiles = [
  'AGENTS.md',
  'README.md',
  'docs/deployment-policy.md',
  'docs/cloudflare-pages.md',
  'docs/roadmap.md',
  'docs/roadmap-publication-state.md',
  'docs/audits/manual-production-deployment.md',
  'docs/audits/manual-production-activation-2026-06-22.md',
  '.github/pull_request_template.md',
  '.github/workflows/deploy-production.yml',
  '.github/workflows/production-consistency.yml'
];

for (const file of requiredFiles) {
  if (!exists(file)) fail(`missing required deployment-policy file: ${file}`);
}

requireText('AGENTS.md', [
  'docs/deployment-policy.md',
  'A normal pull request must not wait for Cloudflare Pages'
]);

if (exists('README.md')) {
  const text = read('README.md');
  if (!text.includes('docs/deployment-policy.md')) fail('README.md must reference docs/deployment-policy.md');
  if (/after each `?main`? push/i.test(text)) fail('README.md still describes production verification after each main push');
}

requireText('docs/deployment-policy.md', [
  'Automatic production branch deployments: OFF',
  'Automatic preview branch deployments: OFF',
  'Manual publication architecture: operational',
  'Workflow run: 27908380603',
  'CLOUDFLARE_API_TOKEN',
  'CLOUDFLARE_ACCOUNT_ID'
]);

requireText('docs/cloudflare-pages.md', [
  'docs/deployment-policy.md',
  'Automatic production branch deployments: OFF',
  'Automatic preview branch deployments:    OFF',
  'Manual deployment workflow:     operational',
  'Workflow run: 27908380603'
]);

if (exists('docs/roadmap.md')) {
  const text = [
    read('docs/roadmap.md'),
    exists('docs/roadmap-publication-state.md') ? read('docs/roadmap-publication-state.md') : ''
  ].join('\n');
  const required = [
    'Automatic production deployment: disabled',
    'Preview branch deployments: disabled',
    'Publication path: manual GitHub Actions workflow only',
    'Manual production publication activation — PASS',
    'Deployment workflow run: 27908380603'
  ];
  for (const phrase of required) {
    if (!text.includes(phrase)) fail(`roadmap publication state is missing required manual-publication text: ${phrase}`);
  }
  if (/Automatic production deployment:\s*enabled/i.test(text)) {
    fail('roadmap publication state must not describe automatic production deployment as enabled');
  }
  if (/successful merge to `main` triggers one production deployment/i.test(text)) {
    fail('roadmap publication state still describes automatic publication after main merge');
  }
}

requireText('docs/audits/manual-production-deployment.md', [
  'Status: OPERATIONAL',
  'Workflow run: 27908380603',
  'Automatic Cloudflare publication is disabled'
]);

requireText('docs/audits/manual-production-activation-2026-06-22.md', [
  'Run: 27908380603',
  'Job: 82581060887',
  'Source commit: 1aa87b0ca8251eea651af74f2af80f30c791e39c',
  'PASS'
]);

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
  if (!/environment:\s*production/.test(text)) fail('deploy-production.yml must use the production environment');
  if (!/CLOUDFLARE_API_TOKEN/.test(text)) fail('deploy-production.yml must use CLOUDFLARE_API_TOKEN');
  if (!/CLOUDFLARE_ACCOUNT_ID/.test(text)) fail('deploy-production.yml must use CLOUDFLARE_ACCOUNT_ID');
  if (!/confirm=DEPLOY|CONFIRM.*DEPLOY|"DEPLOY"/.test(text)) fail('deploy-production.yml must enforce explicit DEPLOY confirmation');
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

console.log(`Deployment policy validation passed across ${workflowFiles.length} workflow files with manual publication operational.`);
