import { loadRegistryV2Baseline } from '../../load-registry-v2-baseline.mjs';
import { readJson, sha256 } from '../core/fs-utils.mjs';

const INFERENCE_RULES = {
  reserve_update: {
    inference_type: 'possible_reserve_or_reserve_report_change',
    claim_scope_hint: 'reserve',
    questions: [
      'Did the source publish a new reserve period, effective date, or composition?',
      'Is the observed language recurring page copy rather than a material change?'
    ]
  },
  assurance_update: {
    inference_type: 'possible_assurance_or_attestation_change',
    claim_scope_hint: 'reserve_history',
    questions: [
      'Is there a new assurance, attestation, examination, or auditor document?',
      'What report period and publication date does the document cover?'
    ]
  },
  issuance_redemption_update: {
    inference_type: 'possible_issuance_or_redemption_change',
    claim_scope_hint: 'redemption_access',
    questions: [
      'Did issuance or redemption terms, access, timing, or eligibility actually change?',
      'Does the source identify an effective date or only describe standing terms?'
    ]
  },
  backing_attestation_update: {
    inference_type: 'possible_backing_attestation_change',
    claim_scope_hint: 'reserve',
    questions: [
      'Is there a new custodian or backing attestation?',
      'Does the source change the asset, custodian, or coverage scope?'
    ]
  }
};

function rowsFromFile(root, relativePath) {
  const value = readJson(root, relativePath);
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.records)) return value.records;
  throw new Error(`${relativePath}: expected array or records array`);
}

function normalizeUrl(value) {
  if (!value) return null;
  try {
    const parsed = new URL(value);
    parsed.hash = '';
    parsed.hostname = parsed.hostname.toLowerCase();
    if (parsed.pathname.length > 1) parsed.pathname = parsed.pathname.replace(/\/+$/, '');
    const entries = [...parsed.searchParams.entries()].sort(([leftKey, leftValue], [rightKey, rightValue]) =>
      leftKey.localeCompare(rightKey) || leftValue.localeCompare(rightValue)
    );
    parsed.search = '';
    for (const [key, item] of entries) parsed.searchParams.append(key, item);
    return parsed.toString();
  } catch {
    return String(value).trim();
  }
}

function loadCanonicalEvidenceIndex(root) {
  const baseline = loadRegistryV2Baseline(root);
  const rows = (baseline.data_groups?.evidence ?? []).flatMap((file) => rowsFromFile(root, file));
  const byUrl = new Map();
  for (const row of rows) {
    const normalized = normalizeUrl(row.url);
    if (!normalized) continue;
    if (!byUrl.has(normalized)) byUrl.set(normalized, []);
    byUrl.get(normalized).push(row.id);
  }
  for (const ids of byUrl.values()) ids.sort();
  return byUrl;
}

function uniqueStrings(values) {
  return [...new Set(values.filter(Boolean))];
}

function duplicateKey(candidate) {
  return candidate.candidate_id || sha256(JSON.stringify({
    observation_id: candidate.observation_id,
    source_id: candidate.source_id,
    affected_stablecoin_ids: [...(candidate.affected_stablecoin_ids ?? [])].sort(),
    affected_organization_ids: [...(candidate.affected_organization_ids ?? [])].sort(),
    signal_types: [...(candidate.signal_types ?? [])].sort()
  }));
}

function buildInferences(signalTypes) {
  return uniqueStrings(signalTypes).map((signalType) => {
    const rule = INFERENCE_RULES[signalType] ?? {
      inference_type: 'possible_source_change',
      claim_scope_hint: 'unknown',
      questions: ['What changed, when did it change, and which canonical record would it affect?']
    };
    return {
      inference_type: rule.inference_type,
      basis_signal_type: signalType,
      status: 'unconfirmed',
      confidence: 'low',
      canonical_action: 'none'
    };
  });
}

function buildQuestions(candidate) {
  const questions = [
    'Did a material source change occur rather than a recurring keyword match?',
    'What effective date, report period, or publication date applies?',
    'Does the finding belong to an existing canonical event, reserve report, profile, or evidence record?',
    'Is a new canonical record needed at all?',
    'Are the configured stablecoin and organization targets complete and correct?'
  ];
  for (const signalType of uniqueStrings(candidate.signal_types ?? [])) {
    questions.push(...(INFERENCE_RULES[signalType]?.questions ?? []));
  }
  return uniqueStrings(questions);
}

function evidenceMatches(observation, evidenceByUrl) {
  const candidates = uniqueStrings([
    normalizeUrl(observation?.source_url),
    normalizeUrl(observation?.final_url)
  ]);
  return uniqueStrings(candidates.flatMap((url) => evidenceByUrl.get(url) ?? [])).sort();
}

function buildEvidenceDraft(candidate, observation, existingEvidenceIds) {
  const claimScopeHints = uniqueStrings((candidate.signal_types ?? []).map((signalType) =>
    INFERENCE_RULES[signalType]?.claim_scope_hint ?? 'unknown'
  )).sort();
  const draftId = `draft_${sha256(`${candidate.candidate_id}|${observation?.body_sha256 ?? 'no-body-hash'}|evidence`).slice(0, 20)}`;
  return {
    draft_id: draftId,
    candidate_id: candidate.candidate_id,
    status: 'draft_needs_human_review',
    draft_action: existingEvidenceIds.length > 0 ? 'link_existing_evidence' : 'create_canonical_evidence_candidate',
    source_url: observation?.source_url ?? candidate.source_url ?? null,
    source_identity: observation?.source_identity ?? null,
    observed_at: observation?.observed_at ?? candidate.created_at ?? null,
    body_sha256: observation?.body_sha256 ?? null,
    affected_stablecoin_ids: [...(candidate.affected_stablecoin_ids ?? [])],
    affected_organization_ids: [...(candidate.affected_organization_ids ?? [])],
    signal_types: [...(candidate.signal_types ?? [])],
    claim_scope_hints: claimScopeHints,
    existing_evidence_ids: existingEvidenceIds,
    canonical_source_type: null,
    canonical_action: 'none',
    review_notes: existingEvidenceIds.length > 0
      ? 'Use or update reviewed canonical evidence only after confirming the source change; do not create a duplicate URL record.'
      : 'Confirm source type, publisher, title, publication date, claim scope, and canonical relations before a separate data PR.'
  };
}

function markdownList(values, fallback = 'None') {
  return values.length > 0 ? values.map((value) => `- ${value}`).join('\n') : `- ${fallback}`;
}

export function buildReviewMaterial(options = {}) {
  const root = options.root ?? process.cwd();
  const official = options.official;
  if (!official) throw new Error('Official-source result is required for review material');
  const createdAt = options.createdAt ?? official.observed_at ?? new Date().toISOString();
  const evidenceByUrl = loadCanonicalEvidenceIndex(root);
  const observations = new Map((official.observations ?? []).map((row) => [row.observation_id, row]));
  const retained = new Map();
  const rejectedDuplicates = [];

  for (const candidate of official.candidates ?? []) {
    const key = duplicateKey(candidate);
    if (retained.has(key)) {
      rejectedDuplicates.push({
        rejected_candidate_id: candidate.candidate_id ?? null,
        retained_candidate_id: retained.get(key).candidate_id ?? null,
        reason: 'exact_private_candidate_duplicate',
        canonical_action: 'none'
      });
      continue;
    }
    retained.set(key, candidate);
  }

  const reviewItems = [];
  const evidenceDrafts = [];
  for (const candidate of retained.values()) {
    const observation = observations.get(candidate.observation_id) ?? null;
    const existingEvidenceIds = evidenceMatches(observation, evidenceByUrl);
    const draft = buildEvidenceDraft(candidate, observation, existingEvidenceIds);
    evidenceDrafts.push(draft);
    reviewItems.push({
      review_id: `review_${sha256(`${candidate.candidate_id}|${observation?.body_sha256 ?? 'no-body-hash'}|review`).slice(0, 20)}`,
      candidate_id: candidate.candidate_id,
      review_status: 'pending_human_decision',
      observed_facts: {
        observation_id: candidate.observation_id,
        source_id: candidate.source_id,
        source_identity: observation?.source_identity ?? null,
        source_url: observation?.source_url ?? candidate.source_url ?? null,
        final_url: observation?.final_url ?? null,
        observed_at: observation?.observed_at ?? candidate.created_at ?? null,
        fetch_status: observation?.fetch_status ?? 'missing_observation',
        http_status: observation?.http_status ?? null,
        content_type: observation?.content_type ?? null,
        etag: observation?.etag ?? null,
        last_modified: observation?.last_modified ?? null,
        body_sha256: observation?.body_sha256 ?? null,
        body_bytes: observation?.body_bytes ?? 0,
        matched_signal_types: [...(observation?.matched_signal_types ?? candidate.signal_types ?? [])],
        matched_keywords: [...(observation?.matched_keywords ?? candidate.matched_keywords ?? [])],
        affected_stablecoin_ids: [...(candidate.affected_stablecoin_ids ?? [])],
        affected_organization_ids: [...(candidate.affected_organization_ids ?? [])]
      },
      inferences: buildInferences(candidate.signal_types ?? []),
      unresolved_questions: buildQuestions(candidate),
      duplicate_review: candidate.duplicate_review ?? null,
      lineage_review: candidate.lineage_review ?? null,
      existing_evidence_matches: existingEvidenceIds,
      evidence_draft_id: draft.draft_id,
      recommended_next_step: 'review_official_source_and_open_separate_data_pr_if_supported',
      canonical_action: 'none'
    });
  }

  const unresolvedQuestionCount = reviewItems.reduce((total, item) => total + item.unresolved_questions.length, 0);
  const reviewMaterial = {
    schema_version: '1.0',
    created_at: createdAt,
    status: 'needs_human_review',
    source_run: {
      monitor: official.monitor,
      observed_at: official.observed_at,
      observation_count: official.observation_count,
      candidate_count: official.candidate_count,
      source_errors: official.source_errors
    },
    counts: {
      candidates_received: official.candidates?.length ?? 0,
      review_items: reviewItems.length,
      evidence_drafts: evidenceDrafts.length,
      rejected_duplicates: rejectedDuplicates.length,
      unresolved_questions: unresolvedQuestionCount
    },
    review_items: reviewItems,
    rejected_duplicates: rejectedDuplicates,
    safety: {
      canonical_action: 'none',
      automatic_pull_request: false,
      automatic_canonical_write: false,
      production_publication: false,
      human_approval_required: true
    }
  };

  const evidenceDraftReport = {
    schema_version: '1.0',
    created_at: createdAt,
    status: 'draft_only',
    draft_count: evidenceDrafts.length,
    drafts: evidenceDrafts,
    policy: {
      human_approval_required: true,
      canonical_action: 'none',
      public_output: false,
      canonical_ids_assigned: false
    }
  };

  return {
    reviewMaterial,
    evidenceDraftReport,
    reviewReport: buildReviewReport(reviewMaterial, evidenceDraftReport),
    prMaterial: buildPrMaterial(reviewMaterial, evidenceDraftReport)
  };
}

export function buildReviewReport(reviewMaterial, evidenceDraftReport) {
  const lines = [
    '# SOG Monitoring Review Report',
    '',
    '## Run',
    '',
    `- Created at: \`${reviewMaterial.created_at}\``,
    `- Source monitor: \`${reviewMaterial.source_run.monitor}\``,
    `- Observations: ${reviewMaterial.source_run.observation_count}`,
    `- Candidates received: ${reviewMaterial.counts.candidates_received}`,
    '',
    '## Review summary',
    '',
    `- Review items: ${reviewMaterial.counts.review_items}`,
    `- Evidence drafts: ${reviewMaterial.counts.evidence_drafts}`,
    `- Rejected duplicates: ${reviewMaterial.counts.rejected_duplicates}`,
    `- Unresolved questions: ${reviewMaterial.counts.unresolved_questions}`,
    '- Human approval required',
    '- Canonical action: none',
    ''
  ];

  lines.push('## Observed facts', '');
  for (const item of reviewMaterial.review_items) {
    const facts = item.observed_facts;
    lines.push(
      `### ${facts.source_identity?.display_name ?? facts.source_id ?? item.candidate_id}`,
      '',
      `- Candidate: \`${item.candidate_id}\``,
      `- Source: ${facts.source_url ?? 'Not recorded'}`,
      `- Observed: \`${facts.observed_at ?? 'unknown'}\``,
      `- Response: \`${facts.fetch_status}\` / ${facts.http_status ?? 'n/a'}`,
      `- Body digest: \`${facts.body_sha256 ?? 'not recorded'}\``,
      `- Stable assets: ${(facts.affected_stablecoin_ids ?? []).join(', ') || 'None'}`,
      `- Organizations: ${(facts.affected_organization_ids ?? []).join(', ') || 'None'}`,
      `- Matched signal types: ${(facts.matched_signal_types ?? []).join(', ') || 'None'}`,
      `- Matched allowlisted keywords: ${(facts.matched_keywords ?? []).join(', ') || 'None'}`,
      ''
    );
  }

  lines.push('## Inferences requiring review', '');
  for (const item of reviewMaterial.review_items) {
    lines.push(`### ${item.candidate_id}`, '');
    for (const inference of item.inferences) {
      lines.push(`- **Unconfirmed / low confidence:** ${inference.inference_type} (signal: \`${inference.basis_signal_type}\`)`);
    }
    if (item.inferences.length === 0) lines.push('- None generated.');
    lines.push('');
  }

  lines.push('## Unresolved questions', '');
  for (const item of reviewMaterial.review_items) {
    lines.push(`### ${item.candidate_id}`, '', markdownList(item.unresolved_questions), '');
  }

  lines.push('## Rejected duplicates', '');
  if (reviewMaterial.rejected_duplicates.length === 0) lines.push('- None.');
  for (const duplicate of reviewMaterial.rejected_duplicates) {
    lines.push(`- Rejected \`${duplicate.rejected_candidate_id ?? 'unknown'}\`; retained \`${duplicate.retained_candidate_id ?? 'unknown'}\`; reason: \`${duplicate.reason}\`.`);
  }
  lines.push('');

  lines.push('## Evidence draft actions', '');
  for (const draft of evidenceDraftReport.drafts) {
    lines.push(
      `- \`${draft.draft_id}\` — \`${draft.draft_action}\` — candidate \`${draft.candidate_id}\` — existing evidence: ${draft.existing_evidence_ids.join(', ') || 'none'}`
    );
  }
  if (evidenceDraftReport.drafts.length === 0) lines.push('- None.');
  lines.push('');

  lines.push(
    '## Human approval checklist',
    '',
    '- [ ] Open and read the official source and any linked period-specific document.',
    '- [ ] Confirm whether a material change occurred.',
    '- [ ] Confirm effective date, report period, and affected canonical records.',
    '- [ ] Check canonical evidence URL and source-identity duplicates.',
    '- [ ] Choose promote, hold, or reject for every review item.',
    '- [ ] Open a separate canonical-data PR only for supported changes.',
    '',
    '## Safety boundary',
    '',
    '- Monitoring output is private review material.',
    '- Inferences are unconfirmed and low confidence.',
    '- Canonical action: none.',
    '- Automatic pull request: false.',
    '- Automatic canonical write: false.',
    '- Production publication: false.',
    ''
  );
  return lines.join('\n');
}

export function buildPrMaterial(reviewMaterial, evidenceDraftReport) {
  const lines = [
    '# DRAFT ONLY — Canonical-data PR material',
    '',
    '> Human approval required. This file is not an opened pull request and does not authorize canonical changes.',
    '',
    '## Candidate scope',
    '',
    `- Review items: ${reviewMaterial.counts.review_items}`,
    `- Evidence drafts: ${reviewMaterial.counts.evidence_drafts}`,
    `- Rejected duplicates: ${reviewMaterial.counts.rejected_duplicates}`,
    '',
    '## Observed source material',
    ''
  ];

  for (const item of reviewMaterial.review_items) {
    const facts = item.observed_facts;
    lines.push(
      `### ${item.candidate_id}`,
      '',
      `- Source: ${facts.source_url ?? 'Not recorded'}`,
      `- Source digest: \`${facts.body_sha256 ?? 'not recorded'}\``,
      `- Signals: ${(facts.matched_signal_types ?? []).join(', ') || 'None'}`,
      `- Stable assets: ${(facts.affected_stablecoin_ids ?? []).join(', ') || 'None'}`,
      `- Organizations: ${(facts.affected_organization_ids ?? []).join(', ') || 'None'}`,
      `- Decision: [ ] promote  [ ] hold  [ ] reject`,
      ''
    );
  }

  lines.push('## Proposed evidence work', '');
  for (const draft of evidenceDraftReport.drafts) {
    lines.push(
      `- \`${draft.draft_id}\`: ${draft.draft_action}; source ${draft.source_url ?? 'not recorded'}; existing evidence ${draft.existing_evidence_ids.join(', ') || 'none'}.`
    );
  }
  if (evidenceDraftReport.drafts.length === 0) lines.push('- None.');

  lines.push(
    '',
    '## Proposed canonical changes',
    '',
    'No canonical change is pre-approved. Replace this section only after human review identifies a supported, separately scoped data change.',
    '',
    '## Data preservation',
    '',
    '- Preserve all canonical record-group counts unless the separate data PR explicitly audits a change.',
    '- Preserve stablecoin, organization, event, evidence, reserve, deployment, and relationship IDs.',
    '- Keep unknown values unknown unless reviewed evidence resolves them.',
    '- Do not copy monitoring candidates or drafts into public output.',
    '',
    '## Validation checklist',
    '',
    '- [ ] Source URL and final URL remain official and allowlisted.',
    '- [ ] Period-specific source and dates are recorded.',
    '- [ ] Duplicate evidence URLs and source identities are resolved.',
    '- [ ] Event, profile, reserve-report, and evidence relations are valid.',
    '- [ ] Full repository validation passes.',
    '- [ ] Canonical/public counts and machine-readable output remain consistent.',
    '',
    '## Human approval',
    '',
    '- [ ] Every candidate has a promote, hold, or reject decision.',
    '- [ ] Every promoted item has a named reviewer and source rationale.',
    '- [ ] A separate canonical-data pull request has been deliberately opened.',
    '',
    '## Deployment classification',
    '',
    '```text',
    'No production deployment required',
    '```',
    ''
  );
  return lines.join('\n');
}
