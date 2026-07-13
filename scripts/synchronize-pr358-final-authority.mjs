import fs from 'node:fs';

const files = ['README.md', 'AGENTS.md', 'docs/spec-governance.md', 'docs/roadmap.md'];
const replaceRequired = (body, from, to, file) => {
  if (!body.includes(from)) throw new Error(`${file}: missing authority anchor: ${from.slice(0, 100)}`);
  return body.replace(from, to);
};

for (const file of files) {
  let body = fs.readFileSync(file, 'utf8');
  body = body.replaceAll('Canonical stable assets: 110', 'Canonical stable assets: 112');

  if (!body.includes('docs/roadmap-amendments/2026-07-13-pr358-record-growth-batch-1-activation.md')) {
    body = body.replace(
      'docs/roadmap-amendments/2026-07-13-pr357-tier-a-batch-3-activation.md',
      'docs/roadmap-amendments/2026-07-13-pr357-tier-a-batch-3-activation.md\ndocs/roadmap-amendments/2026-07-13-pr358-record-growth-batch-1-activation.md'
    );
  }
}

let readme = fs.readFileSync('README.md', 'utf8').replaceAll('Canonical stable assets: 110', 'Canonical stable assets: 112');
readme = replaceRequired(
  readme,
  'docs/quality/tier-a-dossier-batch-3-pr357-spec.md\nconfig/tier-a-dossier-batch-3-pr357.json\ndocs/migration/market-access-pilot-1-pr356-reviewed-handoff.json',
  'docs/quality/tier-a-dossier-batch-3-pr357-spec.md\nconfig/tier-a-dossier-batch-3-pr357.json\ndocs/roadmap-amendments/2026-07-13-pr358-record-growth-batch-1-activation.md\ndocs/quality/record-growth-batch-1-pr358-spec.md\nconfig/record-growth-batch-1-pr358.json\ndocs/migration/tier-a-batch-3-pr357-reviewed-handoff.json\ndocs/migration/market-access-pilot-1-pr356-reviewed-handoff.json',
  'README.md'
);
readme = replaceRequired(
  readme,
  '## Active PR #358 Record Growth Batch 1\n\nPR #358 is bounded to full-record review of StraitsX USD (XUSD) and USDB. Candidate selection remains noncanonical until duplicate, evidence, organization, profile, deployment, event, and known-unknown requirements are satisfied.',
  '## Active PR #358 Record Growth Batch 1\n\nPR #358 has promoted complete reviewed records for StraitsX USD (XUSD) and Blast USDB on its branch. The current branch checkpoint contains 112 canonical assets, 557 Evidence records, 174 deployments, full v2/v3 coverage, and four preserved Market Access Records. Merge remains blocked until deterministic statistics history and all release/CI contracts are green.',
  'README.md'
);
fs.writeFileSync('README.md', readme);

let agents = fs.readFileSync('AGENTS.md', 'utf8').replaceAll('Canonical stable assets: 110', 'Canonical stable assets: 112');
if (!agents.includes('docs/roadmap-amendments/2026-07-13-pr358-record-growth-batch-1-activation.md')) {
  agents = agents.replace(
    'docs/roadmap-amendments/2026-07-13-pr357-tier-a-batch-3-activation.md',
    'docs/roadmap-amendments/2026-07-13-pr357-tier-a-batch-3-activation.md\ndocs/roadmap-amendments/2026-07-13-pr358-record-growth-batch-1-activation.md'
  );
}
if (!agents.includes('docs/migration/tier-a-batch-3-pr357-reviewed-handoff.json')) {
  agents = agents.replace(
    'docs/migration/market-access-pilot-1-pr356-reviewed-handoff.json',
    'docs/migration/market-access-pilot-1-pr356-reviewed-handoff.json\ndocs/migration/tier-a-batch-3-pr357-reviewed-handoff.json'
  );
}
agents = agents.replace('## 8. Completed PR #355, completed PR #356, and active PR #357 rules', '## 8. Completed PR #355–#357 and active PR #358 rules');
fs.writeFileSync('AGENTS.md', agents);

let governance = fs.readFileSync('docs/spec-governance.md', 'utf8').replaceAll('Canonical stable assets: 110', 'Canonical stable assets: 112');
if (!governance.includes('docs/roadmap-amendments/2026-07-13-pr358-record-growth-batch-1-activation.md')) {
  governance = governance.replace(
    'docs/roadmap-amendments/2026-07-13-pr357-tier-a-batch-3-activation.md',
    'docs/roadmap-amendments/2026-07-13-pr357-tier-a-batch-3-activation.md\ndocs/roadmap-amendments/2026-07-13-pr358-record-growth-batch-1-activation.md'
  );
}
if (!governance.includes('docs/migration/tier-a-batch-3-pr357-reviewed-handoff.json')) {
  governance = governance.replace(
    'docs/migration/market-access-pilot-1-pr356-reviewed-handoff.json',
    'docs/migration/market-access-pilot-1-pr356-reviewed-handoff.json\ndocs/migration/tier-a-batch-3-pr357-reviewed-handoff.json'
  );
}
governance = governance.replace('### Active PR #357 Tier A Dossier Deepening — Batch 3', '### Completed PR #357 Tier A Dossier Deepening — Batch 3');
governance = governance.replace('The selected assets are AUDD, FEI, HUSD, MIM, and NZDS. Changes are limited to authorized dossier dimensions and must preserve 110 assets and four canonical Market Access Records.', 'The selected assets were AUDD, FEI, HUSD, MIM, and NZDS. PR #357 preserved 110 assets and four canonical Market Access Records before handing off to PR #358.');
if (!governance.includes('### Active PR #358 Record Growth Batch 1')) {
  governance = governance.replace(
    '### Completed derived-surface semantics',
    '### Active PR #358 Record Growth Batch 1\n\n```text\ndocs/roadmap-amendments/2026-07-13-pr358-record-growth-batch-1-activation.md\ndocs/quality/record-growth-batch-1-pr358-spec.md\nconfig/record-growth-batch-1-pr358.json\ndocs/migration/tier-a-batch-3-pr357-reviewed-handoff.json\n```\n\nThe active branch promotes complete reviewed XUSD and USDB records, advances the canonical checkpoint from 110 to 112 assets, preserves four Market Access Records, prohibits automatic promotion and thin records, and adds no new public product surface.\n\n### Completed derived-surface semantics'
  );
}
fs.writeFileSync('docs/spec-governance.md', governance);

let roadmap = fs.readFileSync('docs/roadmap.md', 'utf8').replaceAll('Canonical stable assets: 110', 'Canonical stable assets: 112');
if (!roadmap.includes('docs/roadmap-amendments/2026-07-13-pr358-record-growth-batch-1-activation.md')) {
  roadmap = roadmap.replace(
    'docs/roadmap-amendments/2026-07-13-pr357-tier-a-batch-3-activation.md',
    'docs/roadmap-amendments/2026-07-13-pr357-tier-a-batch-3-activation.md\ndocs/roadmap-amendments/2026-07-13-pr358-record-growth-batch-1-activation.md'
  );
}
roadmap = roadmap.replace(
  'docs/quality/tier-a-dossier-batch-3-pr357-spec.md\nconfig/tier-a-dossier-batch-3-pr357.json\ndocs/migration/market-access-pilot-1-pr356-reviewed-handoff.json',
  'docs/quality/tier-a-dossier-batch-3-pr357-spec.md\nconfig/tier-a-dossier-batch-3-pr357.json\ndocs/quality/record-growth-batch-1-pr358-spec.md\nconfig/record-growth-batch-1-pr358.json\ndocs/migration/tier-a-batch-3-pr357-reviewed-handoff.json\ndocs/migration/market-access-pilot-1-pr356-reviewed-handoff.json'
);
roadmap = roadmap.replace('## 3. Completed program through PR #357', '## 3. Completed program through PR #357 and active PR #358 growth');
roadmap = roadmap.replace('controlled growth from 100 to 110 assets', 'controlled growth from 100 to 112 assets');
roadmap = replaceRequired(
  roadmap,
  'Current reviewed canonical checkpoint after PR #356:\n\n```text\n110 stable assets\n551 evidence records\n551 evidence relations\n110 legal profiles\n4 canonical Market Access Records\n```',
  'Current reviewed branch checkpoint in PR #358:\n\n```text\n112 stable assets\n557 evidence records\n557 evidence relations\n112 legal profiles\n174 deployments\n4 canonical Market Access Records\n```',
  'docs/roadmap.md'
);
if (!roadmap.includes('## 5. PR #358 Record Growth Batch 1 — active')) {
  roadmap = roadmap.replace(
    '## 5. PR #353 historical planning foundation — complete and immutable',
    '## 5. PR #358 Record Growth Batch 1 — active\n\nPR #358 promotes complete reviewed records for StraitsX USD (XUSD) and Blast USDB. The branch advances canonical counts to 112 assets and 557 Evidence records while preserving four Market Access Records and adding no new public product surface. Merge requires all deterministic statistics, release-integrity, immutable-history, build, and public-safety checks to pass.\n\n## 6. PR #353 historical planning foundation — complete and immutable'
  );
  roadmap = roadmap.replace('## 6. PR #354 Tier A Dossier Batch 1 — complete', '## 7. PR #354 Tier A Dossier Batch 1 — complete');
}
fs.writeFileSync('docs/roadmap.md', roadmap);

console.log(JSON.stringify({ok: true, canonical_assets: 112, active_workstream: 'PR #358 Record Growth Batch 1', next_workstream: 'PR #359 Market Access Pilot 2', files}, null, 2));
