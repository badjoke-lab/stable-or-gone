import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const paths = {
  contract: 'config/evidence-archive-review-history-v6-pr402.json',
  authority: 'docs/migration/post-pr400-review-gate-pr401.json',
  pr400Outcomes: 'docs/migration/evidence-archive-maintenance-outcomes-pr400.json',
  priorContract: 'config/evidence-archive-review-history-v5-pr397.json',
  priorManifest: 'docs/migration/evidence-archive-review-history-manifest-v5-pr397.json',
  priorAudit: 'docs/migration/evidence-archive-review-history-audit-v5-pr397.json',
  checkpoint: 'docs/migration/current-canonical-checkpoint.json'
};
const outputPaths = {
  manifest: 'docs/migration/evidence-archive-review-history-manifest-v6-pr402.json',
  audit: 'docs/migration/evidence-archive-review-history-audit-v6-pr402.json'
};

const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const serialize = (value) => `${JSON.stringify(value, null, 2)}\n`;
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const rows = (value, file) => {
  const result = Array.isArray(value) ? value : value?.records ?? value?.evidence ?? value?.items;
  if (!Array.isArray(result)) throw new Error(`${file}: invalid rows`);
  return result;
};
const countBy = (items, key) => items.reduce((acc, item) => ({
  ...acc,
  [item[key]]: (acc[item[key]] ?? 0) + 1
}), {});

function sourceRow(id, pr, reviewedAt, file) {
  return {
    source_id: id,
    review_pr: pr,
    reviewed_at: reviewedAt,
    path: file,
    content_sha256: sha256(readText(file))
  };
}

function currentEvidenceById() {
  const baseline = loadRegistryV2Baseline(root);
  const map = new Map();
  for (const file of baseline.data_groups?.evidence ?? []) {
    for (const row of rows(readJson(file), file)) map.set(row.id, { ...row, __source_file: file });
  }
  return map;
}

function buildPr400Events(source, sourceOrderStart) {
  let sourceOrder = sourceOrderStart;
  return source.outcomes.map((row) => {
    const reviewOutcome = row.decision === 'dated_archive_added' || row.decision === 'dated_exact_archive_added'
      ? 'reviewed_archive_present'
      : row.decision === 'reviewed_source_replacement'
        ? 'reviewed_source_replacement'
        : 'reviewed_no_safe_change';
    return {
      event_id: `pr400:${row.evidence_id}:${reviewOutcome}`,
      evidence_id: row.evidence_id,
      review_outcome: reviewOutcome,
      review_pr: 400,
      reviewed_at: '2026-07-16',
      source_id: source.outcome_id,
      source_order: sourceOrder++,
      before_url: row.previous_url ?? null,
      after_url: row.new_url ?? row.previous_url ?? null,
      before_archived_url: row.previous_archived_url ?? null,
      after_archived_url: row.new_archived_url ?? null,
      decision: row.decision,
      correction_type: reviewOutcome === 'reviewed_archive_present'
        ? 'archive_supplementation'
        : reviewOutcome === 'reviewed_source_replacement'
          ? 'source_identity_maintenance'
          : null,
      capture_timestamp: row.capture_timestamp ?? null,
      capture_digest: row.capture_digest ?? null,
      reason: row.reason ?? null,
      remaining_uncertainty: row.remaining_uncertainty ?? null,
      automatic_time_expiry: false
    };
  });
}

function effectiveRows(events, currentById, contract) {
  const byId = new Map();
  for (const event of events) byId.set(event.evidence_id, event);
  return [...byId.values()].map((event) => {
    const current = currentById.get(event.evidence_id) ?? null;
    const currentArchivedUrl = String(current?.archived_url ?? '').trim() || null;
    let eligibilityState;
    let candidateEligible = false;
    let signalPresent = false;
    let signalType = null;

    if (currentArchivedUrl) {
      eligibilityState = 'not_eligible_archive_present';
    } else if (event.review_outcome === 'reviewed_source_replacement') {
      eligibilityState = 'reactivated_reviewed_source_replacement';
      candidateEligible = true;
      signalPresent = true;
      signalType = 'reviewed_source_replacement';
    } else if (event.review_outcome === 'reviewed_archive_removed_invalid') {
      eligibilityState = 'suppressed_reviewed_invalid_archive_removed';
    } else if (event.review_outcome === 'reviewed_no_safe_change') {
      eligibilityState = 'suppressed_reviewed_no_safe_change';
    } else {
      eligibilityState = 'not_eligible_archive_present';
    }

    return {
      evidence_id: event.evidence_id,
      current_source_file: current?.__source_file ?? null,
      current_url: current?.url ?? null,
      current_archived_url: currentArchivedUrl,
      effective_review_outcome: event.review_outcome,
      eligibility_state_without_new_signal: eligibilityState,
      candidate_eligible_under_contract: candidateEligible,
      effective_review_pr: event.review_pr,
      effective_reviewed_at: event.reviewed_at,
      effective_source_id: event.source_id,
      automatic_time_expiry: contract.suppression_policy.automatic_time_expiry,
      reactivation_required: currentArchivedUrl == null,
      reactivation_signal_present: signalPresent,
      reactivation_signal_type: signalType
    };
  }).sort((left, right) => left.evidence_id.localeCompare(right.evidence_id));
}

export function buildEvidenceArchiveReviewHistoryV6Outputs() {
  const contract = readJson(paths.contract);
  const authority = readJson(paths.authority);
  const pr400 = readJson(paths.pr400Outcomes);
  const priorContract = readJson(paths.priorContract);
  const priorManifest = readJson(paths.priorManifest);
  const priorAudit = readJson(paths.priorAudit);
  const checkpoint = readJson(paths.checkpoint);

  if (authority.decisions?.evidence_archive_review_history_contract_v6?.pr !== 402) {
    throw new Error('PR #401 does not authorize PR #402');
  }
  if (authority.decisions?.evidence_archive_review_history_contract_v6?.decision !== 'approved_internal') {
    throw new Error('PR #401 History v6 decision changed');
  }
  if (authority.activation_rule !== 'PR #402 must update AGENTS.md and docs/roadmap.md before generating History v6 outputs.') {
    throw new Error('PR #401 activation rule changed');
  }
  if (priorContract.contract_id !== 'sog_evidence_archive_review_history_v5_pr397') throw new Error('Unexpected prior contract');
  if (priorManifest.manifest_id !== 'sog_evidence_archive_review_history_manifest_v5_pr397') throw new Error('Unexpected prior manifest');
  if (priorAudit.audit_id !== 'sog_evidence_archive_review_history_audit_v5_pr397_2026_07_16') throw new Error('Unexpected prior audit');
  if (pr400.outcome_id !== 'sog_evidence_archive_maintenance_outcomes_pr400_2026_07_16') throw new Error('Unexpected PR #400 outcomes');
  if (pr400.outcomes.length !== 10) throw new Error('PR #400 outcome count changed');

  const priorEvents = priorManifest.history_events.map((row) => ({ ...row }));
  const nextSourceOrder = priorEvents.reduce((max, row) => Math.max(max, Number(row.source_order ?? -1)), -1) + 1;
  const events = [...priorEvents, ...buildPr400Events(pr400, nextSourceOrder)]
    .sort((left, right) => left.reviewed_at.localeCompare(right.reviewed_at)
      || left.review_pr - right.review_pr
      || left.source_order - right.source_order
      || left.evidence_id.localeCompare(right.evidence_id));

  const currentById = currentEvidenceById();
  const effective = effectiveRows(events, currentById, contract);
  const outcomeCounts = countBy(effective, 'effective_review_outcome');
  const unresolved = effective.filter((row) => row.current_archived_url == null);
  const suppressed = unresolved.filter((row) => row.eligibility_state_without_new_signal.startsWith('suppressed_'));
  const reactivated = unresolved.filter((row) => row.candidate_eligible_under_contract);
  const sources = [
    ...priorManifest.sources.map((row) => ({ ...row })),
    sourceRow(pr400.outcome_id, 400, '2026-07-16', paths.pr400Outcomes)
  ];

  const sourceDigest = sha256(Object.values(paths).map((file) => `${file}\0${readText(file)}`).join('\0'));
  const manifestDigest = sha256(JSON.stringify({
    contractId: contract.contract_id,
    sources,
    events,
    effective,
    sourceDigest
  }));

  const manifest = {
    schema_version: '6.0',
    manifest_id: 'sog_evidence_archive_review_history_manifest_v6_pr402',
    status: 'reviewed_internal_complete_archive_review_history_manifest',
    public_output: false,
    review_pr: 402,
    reviewed_at: contract.reviewed_at,
    contract_id: contract.contract_id,
    prior_manifest_id: priorManifest.manifest_id,
    history_resolution: contract.history_resolution,
    sources,
    counts: {
      history_source_count: sources.length,
      history_event_count: events.length,
      reviewed_evidence_identity_count: effective.length,
      effective_archive_present_count: outcomeCounts.reviewed_archive_present ?? 0,
      effective_archive_removed_invalid_count: outcomeCounts.reviewed_archive_removed_invalid ?? 0,
      effective_no_safe_change_count: outcomeCounts.reviewed_no_safe_change ?? 0,
      effective_source_replacement_count: outcomeCounts.reviewed_source_replacement ?? 0,
      current_archive_not_recorded_count: checkpoint.evidence_quality.archive_not_recorded_count,
      current_reviewed_unresolved_total_count: unresolved.length,
      current_reviewed_suppressed_count: suppressed.length,
      current_reviewed_reactivated_eligible_count: reactivated.length
    },
    history_events: events,
    effective_evidence_identities: effective,
    source_digest_sha256: sourceDigest,
    manifest_digest_sha256: manifestDigest
  };

  const audit = {
    schema_version: '6.0',
    audit_id: 'sog_evidence_archive_review_history_audit_v6_pr402_2026_07_16',
    status: 'reviewed_complete',
    public_output: false,
    review_pr: 402,
    reviewed_at: contract.reviewed_at,
    contract_id: contract.contract_id,
    source_manifest_id: manifest.manifest_id,
    prior_audit_id: priorAudit.audit_id,
    source_checkpoint: {
      canonical_evidence_count: checkpoint.expected_counts.evidence,
      evidence_relation_count: 559,
      archive_recorded: checkpoint.evidence_quality.archive_index_count,
      archive_not_recorded: checkpoint.evidence_quality.archive_not_recorded_count
    },
    suppression_policy: contract.suppression_policy,
    reactivation_policy: contract.reactivation_policy,
    reviewed_unresolved: {
      total_count: unresolved.length,
      suppressed_count: suppressed.length,
      reactivated_eligible_count: reactivated.length,
      suppressed_evidence_ids: suppressed.map((row) => row.evidence_id),
      reactivated_eligible_evidence_ids: reactivated.map((row) => row.evidence_id),
      rows: unresolved
    },
    findings: [
      'Archive review history contains 70 reviewed events from seven reviewed source batches across 68 canonical Evidence identities.',
      'Fifty effective identities currently have recorded exact archives.',
      'Eighteen reviewed unresolved identities remain suppressed: one invalid archive removal and seventeen no-safe-change outcomes.',
      'PR #400 contributes five exact archive additions and five new no-safe-change suppressions.',
      'No reviewed source replacement remains archive-not-recorded or eligible for queue reactivation.',
      'No review outcome expires automatically with time and no unreviewed signal promotes canonical data.'
    ],
    decision: {
      contract_complete: true,
      approved_manifest: outputPaths.manifest,
      next_work_item: contract.next_work_item,
      archive_queue_generation_allowed_in_pr402: false,
      canonical_data_change_allowed: false,
      public_surface_change_allowed: false,
      review_gate_after_pr403: true
    },
    boundaries: {
      canonical_data_changed: false,
      public_surface_changed: false,
      archive_queue_generated: false,
      historical_outcomes_rewritten: false,
      ranking_or_score: false,
      automatic_promotion: false
    },
    manifest_digest_sha256: manifestDigest,
    source_digest_sha256: sourceDigest
  };

  const actual = {
    history_source_count: manifest.counts.history_source_count,
    history_event_count: manifest.counts.history_event_count,
    reviewed_evidence_identity_count: manifest.counts.reviewed_evidence_identity_count,
    effective_archive_present_count: manifest.counts.effective_archive_present_count,
    effective_archive_removed_invalid_count: manifest.counts.effective_archive_removed_invalid_count,
    effective_no_safe_change_count: manifest.counts.effective_no_safe_change_count,
    effective_source_replacement_count: manifest.counts.effective_source_replacement_count,
    current_archive_not_recorded_count: manifest.counts.current_archive_not_recorded_count,
    current_reviewed_unresolved_total_count: manifest.counts.current_reviewed_unresolved_total_count,
    current_reviewed_suppressed_count: manifest.counts.current_reviewed_suppressed_count,
    current_reviewed_reactivated_eligible_count: manifest.counts.current_reviewed_reactivated_eligible_count,
    current_reviewed_reactivated_evidence_ids: reactivated.map((row) => row.evidence_id)
  };
  if (JSON.stringify(actual) !== JSON.stringify(contract.expected)) {
    throw new Error(`History v6 output differs from contract: ${JSON.stringify(actual)}`);
  }

  return { manifest, audit };
}

export function writeEvidenceArchiveReviewHistoryV6Outputs(outputs = buildEvidenceArchiveReviewHistoryV6Outputs()) {
  for (const [key, file] of Object.entries(outputPaths)) {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), serialize(outputs[key]));
  }
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const outputs = buildEvidenceArchiveReviewHistoryV6Outputs();
  if (process.argv.includes('--check')) {
    for (const [key, file] of Object.entries(outputPaths)) {
      if (!fs.existsSync(path.join(root, file)) || readText(file) !== serialize(outputs[key])) {
        console.error(`${file} is not reproducible`);
        process.exit(1);
      }
    }
  } else {
    writeEvidenceArchiveReviewHistoryV6Outputs(outputs);
  }
  console.log(JSON.stringify({
    ok: true,
    manifest_id: outputs.manifest.manifest_id,
    history_sources: outputs.manifest.counts.history_source_count,
    history_events: outputs.manifest.counts.history_event_count,
    reviewed_evidence_identities: outputs.manifest.counts.reviewed_evidence_identity_count,
    effective_outcomes: {
      archive_present: outputs.manifest.counts.effective_archive_present_count,
      archive_removed_invalid: outputs.manifest.counts.effective_archive_removed_invalid_count,
      no_safe_change: outputs.manifest.counts.effective_no_safe_change_count,
      source_replacement: outputs.manifest.counts.effective_source_replacement_count
    },
    reviewed_unresolved_total: outputs.audit.reviewed_unresolved.total_count,
    reviewed_suppressed: outputs.audit.reviewed_unresolved.suppressed_count,
    reviewed_reactivated_eligible: outputs.audit.reviewed_unresolved.reactivated_eligible_count,
    next_work_item: outputs.audit.decision.next_work_item
  }, null, 2));
}
