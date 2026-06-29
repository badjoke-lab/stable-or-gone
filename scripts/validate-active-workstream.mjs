import fs from 'node:fs';
import './validate-launch-date-pr220-review.mjs';
import './validate-terminal-relationship-review.mjs';
import './validate-evidence-reliability-pr223.mjs';
import './validate-direct-workflow-placeholders-pr224.mjs';
import './validate-evidence-traceability-pr225.mjs';
import './validate-deployment-canonicality-pr226.mjs';
import './validate-deployment-canonicality-pr227.mjs';
import './validate-deployment-source-status-pr229.mjs';

const documents = {
  roadmap: fs.readFileSync('docs/roadmap.md', 'utf8'),
  program: fs.readFileSync('docs/quality/non-ui-quality-program.md', 'utf8'),
  governance: fs.readFileSync('docs/spec-governance.md', 'utf8'),
  agents: fs.readFileSync('AGENTS.md', 'utf8'),
  review: fs.readFileSync('docs/quality/monitoring-review-material-spec.md', 'utf8'),
  baseline: fs.readFileSync('docs/quality/monitoring-baseline-spec.md', 'utf8'),
  change: fs.readFileSync('docs/quality/monitoring-change-detection-spec.md', 'utf8'),
  baselineUpdate: fs.readFileSync('docs/quality/monitoring-baseline-update-spec.md', 'utf8'),
  classification: fs.readFileSync('docs/quality/monitoring-observation-classification-spec.md', 'utf8')
};

const required = {
  roadmap: [
    'Latest completed: PR #237',
    'Active: PR #238',
    'Next: PR #239',
    'Stable assets: 92',
    'Gate V2-F: not passed',
    'Record growth: authorized after PR #246 candidate audit',
    'Production publication: deferred',
    'PR #237 observation change classification and comparison traceability',
    'Metadata-only candidate count: 0',
    'Prior and observed digests recorded: true',
    'PR #263 non-UI release-candidate material'
  ],
  program: [
    'Growth is allowed only through PR #246-#250',
    'No growth PR may contain more than two new stable assets',
    'Production publication remains deferred through PR #263',
    'After PR #263, continuation stops'
  ],
  governance: [
    'An accepted monitoring baseline is a repository-reviewed comparison point',
    'Monitoring executions remain read-only',
    'PR #263 does not authorize publication'
  ],
  agents: [
    'Growth beyond 92 assets is permitted only after PR #246',
    'Production publication remains prohibited through PR #263'
  ],
  review: [
    'observed_facts',
    'inferences',
    'unresolved_questions',
    'Human approval required',
    'Automatic pull request: false'
  ],
  baseline: [
    'A baseline is not canonical evidence',
    'pending_initial_acceptance',
    'Monitoring execution may read this file but may not modify it'
  ],
  change: [
    'baseline-aware review candidate generation',
    'An unchanged source must create zero candidates',
    'metadata_changed',
    'content_changed',
    'fetch_failed',
    'normalized_content_sha256',
    'No candidate authorizes canonical data'
  ],
  baselineUpdate: [
    'The flow produces a proposal bundle',
    'accept',
    'hold',
    'reject',
    'repository_baseline_written: false',
    'The proposal is not self-applying',
    'No production deployment required'
  ],
  classification: [
    'metadata_changed',
    'normalized_content_same_metadata_differs',
    'A metadata-only observation creates zero content-change candidates',
    'The count total must equal `observation_count`',
    'No production deployment required'
  ]
};

for (const [documentName, phrases] of Object.entries(required)) {
  for (const phrase of phrases) {
    if (!documents[documentName].includes(phrase)) throw new Error(`${documentName} missing: ${phrase}`);
  }
}

console.log('Active workstream validation passed: PR #237 is complete and PR #238 is active.');