import fs from 'node:fs';
import './validate-launch-date-pr220-review.mjs';
import './validate-terminal-relationship-review.mjs';
import './validate-evidence-reliability-pr223.mjs';
import './validate-direct-workflow-placeholders-pr224.mjs';
import './validate-evidence-traceability-pr225.mjs';
import './validate-deployment-canonicality-pr226.mjs';
import './validate-deployment-canonicality-pr227.mjs';
import './validate-deployment-source-status-pr229.mjs';
import './validate-current-monitoring-configuration.mjs';
import './validate-current-coverage.mjs';
import './validate-final-eight-candidate-audit-pr246.mjs';
import './validate-batch18-growth-a.mjs';
import './validate-batch19-growth-b.mjs';
import './validate-batch20-growth-c.mjs';
import './validate-ui-v3-foundation.mjs';
import './validate-ui-v3-home.mjs';
import './validate-ui-v3-stablecoin-index.mjs';
import './validate-ui-v3-stablecoin-dossier.mjs';
import './validate-organization-index-detail-implementation.mjs';
import './validate-ui-v3-guides.mjs';
import './validate-ui-v3-reference-utility.mjs';
import './validate-ui-v3-representative-visual-audit.mjs';
import './validate-ui-v3-cleanup.mjs';
import './validate-ui-v3-production-closure.mjs';

const roadmap = fs.readFileSync('docs/roadmap.md', 'utf8');
const program = fs.readFileSync('docs/quality/non-ui-quality-program.md', 'utf8');
const governance = fs.readFileSync('docs/spec-governance.md', 'utf8');
const agents = fs.readFileSync('AGENTS.md', 'utf8');
const design = fs.readFileSync('DESIGN.md', 'utf8');
const uiPlan = fs.readFileSync('docs/ui-redesign/implementation-plan.md', 'utf8');
const uiV3 = fs.readFileSync('docs/architecture/approved-editorial-ledger-ui-v3.md', 'utf8');
const uiV2 = fs.readFileSync('docs/architecture/approved-modern-data-product-ui-v2.md', 'utf8');
const mocksV3 = fs.readFileSync('docs/ui-redesign/approved-mocks-v3/README.md', 'utf8');
const dossierAudit = fs.readFileSync('docs/audits/ui-v3-stablecoin-dossier-2026-07-01.md', 'utf8');
const correctiveAudit = fs.readFileSync('docs/audits/ui-v3-organizations-events-corrective-2026-07-01.md', 'utf8');
const guideAudit = fs.readFileSync('docs/audits/ui-v3-guides-2026-07-01.md', 'utf8');
const referenceAudit = fs.readFileSync('docs/audits/ui-v3-reference-utility-2026-07-01.md', 'utf8');
const visualAudit = fs.readFileSync('docs/audits/ui-v3-representative-visual-audit-2026-07-02.md', 'utf8');
const cleanupAudit = fs.readFileSync('docs/audits/ui-v3-accessibility-performance-legacy-cleanup-2026-07-02.md', 'utf8');
const closureAudit = fs.readFileSync('docs/audits/ui-v3-production-closure-2026-07-02.md', 'utf8');

for (const phrase of [
  'Latest completed: PR #272 — accessibility, performance, and legacy cleanup',
  'Partial precursor: PR #266',
  'Active: PR #273 — production verification and UI v3 closure',
  'Next after UI closure: rebuild Growth D from latest main',
  'Canonical stable assets: 98',
  'Open stale draft: PR #251 — Growth D; do not merge as-is',
  'Active workstream: UI remediation',
  'Gate V3-A: passed',
  'Gate V3-B: passed',
  'Gate V3-C: passed',
  'Gate V3-D: passed',
  'Gate V3-E: passed',
  'Gate V3-F: passed',
  'Gate V3-G: pending exact release-candidate approval',
  'Gate V3-H: pending production commit and public parity verification',
  'PR #271 — representative all-family visual audit — complete',
  'PR #272 — accessibility, performance, and legacy cleanup — complete',
  'PR #273 — production verification and UI v3 closure — active',
  'Growth D to 100 records'
]) {
  if (!roadmap.includes(phrase)) throw new Error(`roadmap missing: ${phrase}`);
}

for (const [document, phrase] of [
  [program, 'Status: canonical implementation schedule — paused'],
  [program, 'Growth D PR #251: stale draft; do not merge as-is'],
  [program, 'No growth PR may contain more than two new stable assets'],
  [program, 'After UI v3 closes through PR #273'],
  [governance, 'the binding workstream is the Editorial Ledger UI v3 remediation'],
  [governance, 'Monitoring executions remain read-only'],
  [governance, 'PR #251 is a stale Growth D draft and must not be merged as-is'],
  [agents, 'Latest completed: PR #272 accessibility, performance, and legacy cleanup'],
  [agents, 'Partial precursor: PR #266 Organization and Event row compaction'],
  [agents, 'Active: PR #273 production verification and UI v3 closure'],
  [agents, 'Next after closure: rebuild Growth D from latest main'],
  [agents, 'Closure: PR #273 production verification and UI v3 closure'],
  [agents, 'Gate V3-F: passed'],
  [agents, 'Gate V3-G: pending exact release-candidate approval'],
  [agents, 'Gate V3-H: pending production commit and public parity verification'],
  [agents, 'scripts/validate-ui-v3-cleanup.mjs'],
  [agents, 'scripts/audit-ui-v3-cleanup-performance.mjs'],
  [agents, 'A normal pull request must not wait for Cloudflare Pages'],
  [agents, 'The old PR #251 must not be merged as-is'],
  [design, 'Status: canonical design overview'],
  [design, 'Visual family: Editorial Ledger'],
  [design, 'public/brand/sog-lockup-on-light.svg'],
  [uiPlan, 'Status: canonical implementation schedule — active'],
  [uiPlan, 'Completed through: PR #272 accessibility, performance, and legacy cleanup'],
  [uiPlan, 'Active work item: PR #273 production verification and closure'],
  [uiPlan, 'Next after closure: rebuild Growth D from latest main'],
  [uiPlan, 'Gate V3-F: passed'],
  [uiPlan, 'source CSS total <= 250,000 bytes'],
  [uiPlan, '48 full-page images total'],
  [uiV3, 'Status: canonical visual and page-implementation contract'],
  [uiV3, 'The default public surface is light, not dark'],
  [uiV3, 'do not create a new logo'],
  [uiV2, 'Status: historical plan — superseded'],
  [mocksV3, 'Status: canonical reference description'],
  [dossierAudit, 'Roadmap item: PR #265'],
  [dossierAudit, 'Canonical data changes: 0'],
  [correctiveAudit, 'Merged PR #266 changed only the Organization and Event row components'],
  [correctiveAudit, 'Canonical stable assets changed: 0'],
  [guideAudit, 'Roadmap item: PR #268'],
  [guideAudit, 'Guide article copy and source URLs changed: 0'],
  [referenceAudit, 'Roadmap item: PR #269'],
  [referenceAudit, '`/contact/` remains the canonical Corrections and submissions route'],
  [visualAudit, 'Roadmap item: PR #271'],
  [visualAudit, 'Gate V3-F passed'],
  [visualAudit, 'total full-page images reviewed: 48'],
  [cleanupAudit, 'Roadmap item: PR #272'],
  [cleanupAudit, 'Status: passed'],
  [cleanupAudit, 'Source CSS total | 128,528 bytes'],
  [cleanupAudit, '0 changed images out of 48'],
  [closureAudit, 'Roadmap item: PR #273'],
  [closureAudit, 'Gate V3-G'],
  [closureAudit, 'Gate V3-H'],
  [closureAudit, 'The PR head becomes the release candidate'],
  [closureAudit, 'exact immutable commit'],
  [closureAudit, 'Production representative screenshots'],
  [closureAudit, 'Canonical stable assets changed: 0']
]) {
  if (!document.includes(phrase)) throw new Error(`active workstream document missing: ${phrase}`);
}

for (const source of [agents, roadmap, uiPlan]) {
  for (const phrase of ['SaaS dashboard', 'giant hero', 'KPI card row', 'blue-purple glow']) {
    if (!source.toLowerCase().includes(phrase.toLowerCase())) throw new Error(`rejected visual guard missing: ${phrase}`);
  }
}

console.log('Current workstream valid: PR #272 cleanup is complete, PR #273 exact-head production closure is active, 98 canonical assets are preserved, and Gate V3-G/V3-H remain pending until the exact head is public and verified.');
