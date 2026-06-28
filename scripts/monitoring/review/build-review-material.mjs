import crypto from 'node:crypto';

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function proposedClaimScopes(signalTypes) {
  const mapping = {
    reserve_update: ['reserve'],
    assurance_update: ['reserve', 'evidence'],
    issuance_redemption_update: ['issuance', 'redemption'],
    backing_attestation_update: ['backing', 'evidence']
  };
  return [...new Set(signalTypes.flatMap((signalType) => mapping[signalType] ?? ['other']))].sort();
}

function questionsFor(candidate) {
  return [
    'Is the observed content new or materially changed since the last canonical review?',
    'Is there an exact dated report, announcement, or archived snapshot supporting the signal?',
    'Should any canonical entity, event, evidence, reserve, relationship, or deployment field change?',
    'Is an archive snapshot required before using this source?',
    'Should this candidate be rejected because no material change occurred?'
  ].map((question, index) => ({
    question_id: `question_${sha256(`${candidate.candidate_id}|${index}|${question}`).slice(0, 20)}`,
    candidate_id: candidate.candidate_id,
    question,
    status: 'unresolved'
  }));
}

function buildReport(runId, review, prMaterial) {
  const lines = [
    '# SOG Monitoring Review Report',
    '',
    '## Run',
    '',
    `- Run ID: \`${runId}\``,
    `- Candidates: ${review.candidate_inferences.length}`,
    `- Evidence drafts: ${review.evidence_drafts.length}`,
    `- Canonical changes allowed: \`${prMaterial.canonical_changes_allowed}\``,
    '',
    '## Observed facts',
    ''
  ];
  if (review.observed_facts.length === 0) lines.push('- None.');
  for (const fact of review.observed_facts) {
    lines.push(`- **${fact.source_id}** — HTTP ${fact.http_status}; ${fact.matched_signal_types.join(', ') || 'no configured signal'}; observed ${fact.observed_at}.`);
  }
  lines.push('', '## Candidate inferences', '');
  if (review.candidate_inferences.length === 0) lines.push('- None.');
  for (const inference of review.candidate_inferences) lines.push(`- \`${inference.candidate_id}\`: ${inference.statement}`);
  lines.push('', '## Unresolved questions', '');
  if (review.unresolved_questions.length === 0) lines.push('- None.');
  for (const question of review.unresolved_questions) lines.push(`- \`${question.candidate_id}\`: ${question.question}`);
  lines.push('', '## Duplicate and lineage review', '');
  if (review.duplicate_and_lineage_reviews.length === 0) lines.push('- None.');
  for (const row of review.duplicate_and_lineage_reviews) {
    lines.push(`- \`${row.candidate_id}\`: duplicate=${row.duplicate_review.state}; lineage=${row.lineage_review.state}; relationships=${row.lineage_review.relationship_count}.`);
  }
  lines.push('', '## Evidence drafts', '');
  if (review.evidence_drafts.length === 0) lines.push('- None.');
  for (const draft of review.evidence_drafts) lines.push(`- \`${draft.draft_id}\`: ${draft.source_title}; review status=${draft.review_status}.`);
  lines.push('', '## Rejected / no-action items', '');
  if (review.rejected_or_no_action.length === 0) lines.push('- None.');
  for (const row of review.rejected_or_no_action) lines.push(`- \`${row.observation_id}\`: ${row.reason}.`);
  lines.push('', '## Operator checklist', '');
  for (const item of prMaterial.operator_checklist) lines.push(`- [ ] ${item}`);
  lines.push('');
  return lines.join('\n');
}

export function buildReviewMaterial({ runId, createdAt, observations, candidates }) {
  const observationById = new Map(observations.map((row) => [row.observation_id, row]));
  const observedFacts = observations.map((observation) => ({
    fact_id: `fact_${sha256(observation.observation_id).slice(0, 20)}`,
    classification: 'observed_fact',
    observation_id: observation.observation_id,
    source_id: observation.source_id,
    source_url: observation.source_url,
    final_url: observation.final_url,
    observed_at: observation.observed_at,
    fetch_status: observation.fetch_status,
    http_status: observation.http_status,
    content_type: observation.content_type,
    body_sha256: observation.body_sha256,
    body_bytes: observation.body_bytes,
    matched_signal_types: observation.matched_signal_types,
    matched_keywords: observation.matched_keywords
  }));

  const candidateInferences = candidates.map((candidate) => ({
    inference_id: `inference_${sha256(candidate.candidate_id).slice(0, 20)}`,
    candidate_id: candidate.candidate_id,
    classification: 'inference',
    confidence: 'low',
    canonical_status: 'not_assigned',
    requires_human_review: true,
    statement: `The allowlisted official page contains configured terminology for ${candidate.signal_types.join(', ')} and may warrant source review. No material change is established.`
  }));

  const unresolvedQuestions = candidates.flatMap(questionsFor);
  const duplicateAndLineageReviews = candidates.map((candidate) => ({
    candidate_id: candidate.candidate_id,
    duplicate_review: candidate.duplicate_review,
    lineage_review: candidate.lineage_review
  }));

  const evidenceDrafts = candidates.map((candidate) => {
    const observation = observationById.get(candidate.observation_id);
    return {
      draft_id: `draft_${sha256(`${candidate.candidate_id}|${candidate.source_url}`).slice(0, 20)}`,
      candidate_id: candidate.candidate_id,
      review_status: 'unapproved',
      source_url: candidate.source_url,
      source_title: observation?.source_identity?.display_name ?? candidate.source_id,
      source_kind: observation?.source_identity?.source_kind ?? 'official_source',
      accessed_at: candidate.created_at,
      target_stablecoin_ids: candidate.affected_stablecoin_ids,
      target_organization_ids: candidate.affected_organization_ids,
      proposed_reliability: 'high',
      proposed_claim_scopes: proposedClaimScopes(candidate.signal_types),
      notes: 'Monitoring draft only. Confirm exact publication date, claim boundary, archive availability, and material change before canonical use.'
    };
  });

  const candidateObservationIds = new Set(candidates.map((candidate) => candidate.observation_id));
  const rejectedOrNoAction = observations
    .filter((observation) => !candidateObservationIds.has(observation.observation_id))
    .map((observation) => ({
      observation_id: observation.observation_id,
      source_id: observation.source_id,
      reason: observation.fetch_status === 'ok' ? 'No configured signal was detected.' : `Source observation failed: ${observation.error ?? observation.fetch_status}`,
      canonical_action: 'none'
    }));

  const review = {
    schema_version: '1.0',
    run_id: runId,
    created_at: createdAt,
    observed_facts: observedFacts,
    candidate_inferences: candidateInferences,
    unresolved_questions: unresolvedQuestions,
    duplicate_and_lineage_reviews: duplicateAndLineageReviews,
    evidence_drafts: evidenceDrafts,
    rejected_or_no_action: rejectedOrNoAction
  };

  const candidateIds = candidates.map((candidate) => candidate.candidate_id).sort();
  const prMaterial = {
    schema_version: '1.0',
    run_id: runId,
    created_at: createdAt,
    requires_human_approval: true,
    canonical_changes_allowed: false,
    suggested_branch: `review/monitoring-${runId.toLowerCase()}`,
    suggested_title: `Review SOG monitoring candidates: ${createdAt.slice(0, 10)}`,
    suggested_body: [
      'This is review material generated from allowlisted official-source monitoring.',
      '',
      'Monitoring signals are not final SOG classifications.',
      'Any canonical changes require a separate reviewed pull request with source-specific justification.',
      '',
      `Candidates: ${candidateIds.length}`,
      `Run ID: ${runId}`
    ].join('\n'),
    candidate_ids: candidateIds,
    review_files: ['official-source-observations.json', 'monitoring-candidates.json', 'review-material.json', 'review-report.md'],
    operator_checklist: [
      'Confirm each source is still issuer- or protocol-controlled.',
      'Determine whether the observed content is new or materially changed.',
      'Recover exact publication dates and archive snapshots where needed.',
      'Reject duplicates and no-change candidates.',
      'Open a separate canonical-data PR only for approved changes.'
    ]
  };

  return {
    review,
    prMaterial,
    reportMarkdown: buildReport(runId, review, prMaterial)
  };
}
