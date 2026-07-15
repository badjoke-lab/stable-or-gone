import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = process.cwd();
const paths = {
  config: 'config/planning-dimension-semantics-pr367.json',
  contract: 'config/planning-dimension-semantics-v2.json',
  reviewGate: 'docs/migration/post-pr365-review-gate-pr366.json',
  v1Summary: 'docs/migration/record-depth-baseline-pr363-summary.json',
  agentsArchive: 'docs/archive/AGENTS-through-pr366.md',
  roadmapArchive: 'docs/archive/roadmap-through-pr366.md'
};
const outputPath = 'docs/migration/planning-dimension-semantics-audit-pr367.json';
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const serialize = (value) => `${JSON.stringify(value, null, 2)}\n`;
const sha256 = (text) => crypto.createHash('sha256').update(text).digest('hex');
function gitBlobSha(text) {
  const bytes = Buffer.from(text, 'utf8');
  return crypto.createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
}

export function buildPlanningDimensionSemanticsAudit() {
  const config = readJson(paths.config);
  const contractText = readText(paths.contract);
  const contract = JSON.parse(contractText);
  const reviewGate = readJson(paths.reviewGate);
  const v1 = readJson(paths.v1Summary);
  const dimension = new Map(v1.summary.dimension_states.map((row) => [row.dimension_id, row.state_counts]));

  return {
    schema_version: '1.0',
    audit_id: 'sog_planning_dimension_semantics_audit_pr367_2026_07_15',
    status: 'reviewed_complete',
    public_output: false,
    review_pr: 367,
    reviewed_at: config.reviewed_at,
    source_review_gate_id: reviewGate.report_id,
    source_checkpoint: reviewGate.source_checkpoint,
    historical_v1_boundary: {
      baseline_id: v1.baseline_id,
      asset_count: v1.asset_count,
      dimension_count: v1.dimension_count,
      cell_count: v1.cell_count,
      state_counts: v1.summary.state_counts,
      canonical_market_access_absent: dimension.get('canonical_market_access').absent,
      regulatory_notes_absent: dimension.get('regulatory_notes').absent,
      deployment_partial: dimension.get('deployment').partial,
      facet_freshness_support_partial: dimension.get('facet_freshness_support').partial,
      rewritten: false
    },
    approved_contract: {
      contract_id: contract.contract_id,
      contract_sha256: sha256(contractText),
      planning_states: contract.planning_states.length,
      applicability_states: contract.applicability_states.length,
      observation_states: contract.observation_states.length,
      dimensions: contract.dimensions.length,
      dimension_classes: contract.dimension_classes,
      default_queue_roles: contract.default_queue_roles
    },
    binding_decisions: [
      'Preserve all v1 planning files as immutable historical checkpoints.',
      'Keep the six planning quality states and add orthogonal applicability and observation/source-support axes.',
      'Treat regulatory_notes and canonical_market_access as scoped observational dimensions rather than universal dossier requirements.',
      'Treat reserve_structure, redemption, and facet_freshness_support as conditional structural dimensions.',
      'Map an explicit source-supported redemption status of not_applicable to planning not_applicable rather than partial.',
      'Keep deployment and facet freshness gaps in maintenance workflows, not the default dossier queue.',
      'Keep comparison_readiness diagnostic and non-ranking.',
      'Require PR #368 to recompute the 112-asset baseline before PR #369 selects any asset.'
    ],
    semantic_safety: {
      not_applicable_counts_as_gap: false,
      absent_asserts_real_world_nonexistence: false,
      unobserved_is_negative_claim: false,
      source_unavailable_authorizes_fabrication: false,
      ranking_or_composite_score: false,
      automatic_promotion: false
    },
    archive_preservation: {
      agents_archive: paths.agentsArchive,
      agents_git_blob_sha: gitBlobSha(readText(paths.agentsArchive)),
      roadmap_archive: paths.roadmapArchive,
      roadmap_git_blob_sha: gitBlobSha(readText(paths.roadmapArchive)),
      archives_are_historical_only: true
    },
    boundaries: {
      canonical_data_changed: false,
      baseline_recomputed: false,
      historical_v1_rewritten: false,
      public_surface_changed: false
    },
    next_work_item: {
      pr: 368,
      work_item: 'Record Depth Baseline v2 Refresh',
      requires_merged_contract_id: contract.contract_id,
      canonical_data_change_allowed: false,
      public_surface_allowed: false
    }
  };
}

export function writePlanningDimensionSemanticsAudit(report = buildPlanningDimensionSemanticsAudit()) {
  fs.mkdirSync(path.dirname(path.join(root, outputPath)), { recursive: true });
  fs.writeFileSync(path.join(root, outputPath), serialize(report));
  return outputPath;
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const report = buildPlanningDimensionSemanticsAudit();
  const serialized = serialize(report);
  if (process.argv.includes('--check')) {
    if (readText(outputPath) !== serialized) {
      console.error(`${outputPath} is not reproducible`);
      process.exit(1);
    }
  } else {
    writePlanningDimensionSemanticsAudit(report);
  }
  console.log(JSON.stringify({
    ok: true,
    audit_id: report.audit_id,
    dimensions: report.approved_contract.dimensions,
    dimension_classes: report.approved_contract.dimension_classes,
    next_pr: report.next_work_item.pr
  }, null, 2));
}
