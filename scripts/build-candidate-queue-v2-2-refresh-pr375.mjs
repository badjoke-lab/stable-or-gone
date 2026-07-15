import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = process.cwd();
const paths = {
  config: 'config/candidate-queue-v2-2-refresh-pr375.json',
  baseline: 'docs/migration/record-depth-baseline-v2-1-pr372.json',
  sourceQueue: 'docs/migration/tier-a-candidate-queue-v2-1-pr372.json',
  contract: 'config/planning-queue-review-history-v1-pr374.json',
  historyManifest: 'docs/migration/planning-queue-review-history-manifest-pr374.json',
  historyAudit: 'docs/migration/planning-queue-review-history-audit-pr374.json',
  authority: 'docs/migration/post-pr372-review-gate-pr373.json'
};
const outputPaths = {
  queue: 'docs/migration/tier-a-candidate-queue-v2-2-pr375.json',
  delta: 'docs/migration/tier-a-candidate-queue-v2-2-pr375-delta.json'
};
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const serialize = (value) => `${JSON.stringify(value, null, 2)}\n`;
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

export function buildCandidateQueueV22Outputs() {
  const configText = readText(paths.config);
  const config = JSON.parse(configText);
  const baseline = readJson(paths.baseline);
  const sourceQueue = readJson(paths.sourceQueue);
  const contract = readJson(paths.contract);
  const historyManifest = readJson(paths.historyManifest);
  const historyAudit = readJson(paths.historyAudit);
  const authority = readJson(paths.authority);

  if (authority.decisions?.candidate_queue_v2_2_refresh?.pr !== 375) {
    throw new Error('PR #373 does not authorize PR #375');
  }
  if (historyAudit.decision?.next_work_item !== 'PR #375 Candidate Queue v2.2 Refresh') {
    throw new Error('PR #374 audit does not hand off to PR #375');
  }
  if (baseline.baseline_id !== config.expected.source_baseline_id) {
    throw new Error(`Unexpected source baseline ${baseline.baseline_id}`);
  }
  if (sourceQueue.queue_id !== config.expected.source_queue_id) {
    throw new Error(`Unexpected source queue ${sourceQueue.queue_id}`);
  }
  if (contract.contract_id !== config.expected.review_history_contract_id) {
    throw new Error(`Unexpected review-history contract ${contract.contract_id}`);
  }
  if (historyManifest.manifest_id !== config.expected.review_history_manifest_id) {
    throw new Error(`Unexpected review-history manifest ${historyManifest.manifest_id}`);
  }

  const auditBySlug = new Map(historyAudit.current_queue_audit.candidates.map((row) => [row.asset_slug, row]));
  const eligible = [];
  const suppressed = [];
  const reactivated = [];

  for (const candidate of sourceQueue.candidates) {
    const eligibility = auditBySlug.get(candidate.asset_slug);
    if (!eligibility) throw new Error(`Missing review-history audit for ${candidate.asset_slug}`);

    const enriched = {
      ...candidate,
      review_history: {
        contract_id: contract.contract_id,
        manifest_id: historyManifest.manifest_id,
        dimension_eligibility: eligibility.dimension_eligibility,
        eligible_dimension_count: eligibility.eligible_dimension_count,
        suppressed_dimension_count: eligibility.suppressed_dimension_count,
        projected_candidate_state: eligibility.projected_candidate_state
      }
    };

    if (eligibility.projected_v2_2_eligible) {
      eligible.push(enriched);
      if (eligibility.dimension_eligibility.some((row) => row.reactivation_signal_present)) reactivated.push(enriched);
    } else {
      suppressed.push({
        asset_id: candidate.asset_id,
        asset_slug: candidate.asset_slug,
        asset_name: candidate.asset_name,
        symbol: candidate.symbol,
        source_material_dossier_gaps: candidate.material_dossier_gaps,
        suppression_reason: eligibility.projected_candidate_state,
        dimension_eligibility: eligibility.dimension_eligibility,
        latest_review_outcomes: [...new Set(eligibility.dimension_eligibility.map((row) => row.effective_review_outcome))].sort(),
        reactivation_signal_present: false
      });
    }
  }

  eligible.sort((left, right) => left.asset_slug.localeCompare(right.asset_slug));
  suppressed.sort((left, right) => left.asset_slug.localeCompare(right.asset_slug));
  reactivated.sort((left, right) => left.asset_slug.localeCompare(right.asset_slug));

  const sourceDigest = sha256(Object.values(paths).map((file) => `${file}\0${readText(file)}`).join('\0'));
  const generationDigest = sha256(JSON.stringify({
    config: sha256(configText),
    baseline: baseline.generation_digest_sha256,
    sourceQueue: sourceQueue.generation_digest_sha256,
    historyManifest: historyManifest.manifest_digest_sha256,
    eligible,
    suppressed,
    reactivated,
    sourceDigest
  }));

  const queue = {
    schema_version: '2.2',
    queue_id: 'sog_tier_a_candidate_queue_v2_2_pr375',
    status: 'reviewed_internal_non_ranking_history_aware_queue',
    public_output: false,
    asset_rank: false,
    single_composite_score: false,
    review_pr: 375,
    reviewed_at: config.reviewed_at,
    source_baseline_id: baseline.baseline_id,
    source_queue_id: sourceQueue.queue_id,
    source_semantics_contract_id: sourceQueue.source_semantics_contract_id,
    review_history_contract_id: contract.contract_id,
    review_history_manifest_id: historyManifest.manifest_id,
    review_history_audit_id: historyAudit.audit_id,
    queue_order: contract.candidate_policy.queue_order,
    candidate_count: eligible.length,
    candidates: eligible,
    suppressed_candidate_count: suppressed.length,
    reactivated_candidate_count: reactivated.length,
    selection_boundary: {
      canonical_promotion_authorized: false,
      manual_review_required: true,
      existing_assets_only: true,
      public_surface_allowed: false,
      next_dossier_batch_authorized: false,
      review_gate_required: true
    },
    source_digest_sha256: sourceDigest,
    generation_digest_sha256: generationDigest,
    next_work_item: config.next_work_item
  };

  const delta = {
    schema_version: '1.0',
    delta_id: 'sog_tier_a_candidate_queue_v2_2_delta_pr375',
    status: 'reviewed_internal_queue_history_delta',
    public_output: false,
    review_pr: 375,
    reviewed_at: config.reviewed_at,
    source_baseline_id: baseline.baseline_id,
    source_queue_id: sourceQueue.queue_id,
    current_queue_id: queue.queue_id,
    historical_queue_rewritten: false,
    source_candidate_count: sourceQueue.candidate_count,
    current_candidate_count: queue.candidate_count,
    removed_candidate_count: suppressed.length,
    retained_candidate_count: eligible.length,
    reactivated_candidate_count: reactivated.length,
    added_candidate_count: 0,
    removed_asset_slugs: suppressed.map((row) => row.asset_slug),
    retained_asset_slugs: eligible.map((row) => row.asset_slug),
    reactivated_asset_slugs: reactivated.map((row) => row.asset_slug),
    added_asset_slugs: [],
    suppressed_candidates: suppressed,
    review_history_summary: {
      contract_id: contract.contract_id,
      manifest_id: historyManifest.manifest_id,
      history_source_count: historyManifest.counts.history_source_count,
      history_event_count: historyManifest.counts.history_event_count,
      reviewed_asset_count: historyManifest.counts.reviewed_asset_count,
      effective_asset_dimension_count: historyManifest.counts.effective_asset_dimension_count,
      automatic_time_expiry: contract.suppression_policy.automatic_time_expiry,
      accepted_reactivation_triggers: contract.reactivation_policy.accepted_triggers
    },
    boundaries: {
      baseline_recomputed: false,
      canonical_data_changed: false,
      public_surface_changed: false,
      historical_queue_rewritten: false,
      ranking_or_score: false,
      automatic_promotion: false
    },
    source_digest_sha256: sourceDigest,
    generation_digest_sha256: generationDigest,
    next_work_item: config.next_work_item
  };

  return { queue, delta };
}

export function writeCandidateQueueV22Outputs(outputs = buildCandidateQueueV22Outputs()) {
  for (const [key, file] of Object.entries(outputPaths)) {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), serialize(outputs[key]));
  }
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const outputs = buildCandidateQueueV22Outputs();
  if (process.argv.includes('--check')) {
    for (const [key, file] of Object.entries(outputPaths)) {
      if (!fs.existsSync(path.join(root, file)) || readText(file) !== serialize(outputs[key])) {
        console.error(`${file} is not reproducible`);
        process.exit(1);
      }
    }
  } else writeCandidateQueueV22Outputs(outputs);
  console.log(JSON.stringify({
    ok: true,
    queue_id: outputs.queue.queue_id,
    source_candidates: outputs.delta.source_candidate_count,
    current_candidates: outputs.queue.candidate_count,
    suppressed_candidates: outputs.queue.suppressed_candidate_count,
    reactivated_candidates: outputs.queue.reactivated_candidate_count,
    removed_asset_slugs: outputs.delta.removed_asset_slugs,
    next_work_item: outputs.queue.next_work_item
  }, null, 2));
}
