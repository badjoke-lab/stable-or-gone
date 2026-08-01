import fs from 'node:fs';

const validatorPath = 'scripts/validate-stats-history.mjs';
const scriptPath = 'scripts/extend-stats-history-maintenance-taxonomy.mjs';
const workflowPath = '.github/workflows/pr500-extend-stats-history-taxonomy.yml';
let source = fs.readFileSync(validatorPath, 'utf8');

const replacements = [
  [
    'function orderingFailures(rows) {',
    "const NON_GROWTH_CHECKPOINT_KINDS = new Set(['non_growth_normalization_checkpoint', 'non_growth_maintenance_checkpoint']);\n\nfunction orderingFailures(rows) {"
  ],
  [
    "if (snapshot.checkpoint_kind !== 'non_growth_normalization_checkpoint') issues.push(`${label}: repeated asset_count requires non_growth_normalization_checkpoint kind`);",
    "if (!NON_GROWTH_CHECKPOINT_KINDS.has(snapshot.checkpoint_kind)) issues.push(`${label}: repeated asset_count requires a reviewed non-growth checkpoint kind`);"
  ],
  [
    "if (snapshot.asset_count > previousAssetCount && snapshot.checkpoint_kind === 'non_growth_normalization_checkpoint') {",
    'if (snapshot.asset_count > previousAssetCount && NON_GROWTH_CHECKPOINT_KINDS.has(snapshot.checkpoint_kind)) {'
  ],
  [
    "check(['controlled_growth_checkpoint', 'non_growth_normalization_checkpoint'].includes(snapshot.checkpoint_kind), `${label}: invalid checkpoint_kind`);",
    "check(['controlled_growth_checkpoint', 'non_growth_normalization_checkpoint', 'non_growth_maintenance_checkpoint'].includes(snapshot.checkpoint_kind), `${label}: invalid checkpoint_kind`);"
  ],
  [
    "reviewed_non_growth_checkpoint: 'non_growth_normalization_checkpoint'",
    "reviewed_non_growth_checkpoint: 'non_growth_normalization_checkpoint',\n    reviewed_non_growth_maintenance_checkpoint: 'non_growth_maintenance_checkpoint'"
  ]
];

for (const [anchor, replacement] of replacements) {
  if (!source.includes(anchor)) throw new Error(`missing stats-history validator anchor: ${anchor}`);
  source = source.replace(anchor, replacement);
}

fs.writeFileSync(validatorPath, source);
fs.rmSync(scriptPath, { force: true });
fs.rmSync(workflowPath, { force: true });
console.log('Extended immutable statistics history taxonomy for reviewed non-growth maintenance checkpoints.');
