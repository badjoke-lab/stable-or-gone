import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const workflowDir = path.resolve('.github/workflows');
const outputDir = path.resolve('artifacts/workflow-prune');
const apply = process.argv.includes('--apply');
const currentPr = Number(process.env.CURRENT_PR_NUMBER || '458');

const files = (await readdir(workflowDir, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && /\.ya?ml$/i.test(entry.name))
  .map((entry) => entry.name)
  .sort((a, b) => a.localeCompare(b));

const workflows = [];
const targets = [];

for (const file of files) {
  const fullPath = path.join(workflowDir, file);
  const source = await readFile(fullPath, 'utf8');
  const rawName = source.match(/^name:\s*(.+?)\s*$/m)?.[1] ?? file;
  const name = rawName.replace(/^['"]|['"]$/g, '').trim();
  const match = name.match(/^PR\s+#?(\d+)\b/i);
  const prNumber = match ? Number(match[1]) : null;
  const historicalPrWorkflow = Number.isInteger(prNumber) && prNumber !== currentPr;
  const item = {
    file: `.github/workflows/${file}`,
    name,
    pr_number: prNumber,
    historical_pr_workflow: historicalPrWorkflow
  };
  workflows.push(item);
  if (historicalPrWorkflow) targets.push(item);
}

if (apply) {
  for (const target of targets) await rm(path.resolve(target.file));
}

const report = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  apply,
  current_pr: currentPr,
  workflow_count_before: workflows.length,
  historical_pr_workflow_count: targets.length,
  workflow_count_after: workflows.length - targets.length,
  deleted: targets,
  retained: workflows.filter((item) => !item.historical_pr_workflow)
};

await mkdir(outputDir, { recursive: true });
await writeFile(path.join(outputDir, 'historical-pr-workflow-prune.json'), `${JSON.stringify(report, null, 2)}\n`);
await writeFile(path.join(outputDir, 'historical-pr-workflow-prune.md'), [
  '# Historical PR Workflow Prune',
  '',
  `- Mode: ${apply ? 'apply' : 'dry-run'}`,
  `- Current PR: #${currentPr}`,
  `- Workflows before: ${report.workflow_count_before}`,
  `- Historical PR-specific workflows: ${report.historical_pr_workflow_count}`,
  `- Workflows after: ${report.workflow_count_after}`,
  '',
  '## Deleted',
  ...(targets.length ? targets.map((item) => `- \`${item.file}\` — ${item.name}`) : ['- None']),
  '',
  '## Retained',
  ...report.retained.map((item) => `- \`${item.file}\` — ${item.name}`)
].join('\n'));

console.log(JSON.stringify({
  apply,
  before: report.workflow_count_before,
  deleted: report.historical_pr_workflow_count,
  after: report.workflow_count_after
}, null, 2));
