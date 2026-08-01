import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { generateStats } from './build-stats.mjs';
import { generateCurrentHistorySnapshot } from './stats/build-history-snapshot.mjs';

const root = process.cwd();
const decisionPath = 'config/evidence-archive-payload-verification-batch-1-pr506-decisions.json';
const authorityPath = 'config/evidence-archive-payload-verification-batch-1.json';
const checkpointPath = 'docs/migration/current-canonical-checkpoint.json';
const statsCheckpointPath = 'docs/migration/current-stats-history-checkpoint.json';
const statsHistoryPath = 'data/stats-history.json';
const releaseBaselinePath = 'docs/migration/registry-release-integrity-baseline.json';
const sourceReviewPath = 'data/editorial-research/evidence-archive-payload-verification-batch-1-pr506-source-review.json';
const outcomesPath = 'docs/migration/evidence-archive-payload-verification-batch-1-pr506-outcomes.json';
const handoffPath = 'docs/migration/evidence-archive-payload-verification-batch-1-pr506-handoff.json';
const canonicalCheckpointId = 'sog_pr506_evidence_archive_payload_verification_117_2026_08_01';
const statsCheckpointId = 'sog_stats_pr506_evidence_archive_payload_verification_2026_08_01';
const registryVersion = 'pr506-evidence-archive-payload-verification-batch-1';
const expected = {
  assets: 117,
  organizations: 108,
  relationships: 129,
  events: 192,
  evidence: 579,
  evidence_relations: 579,
  reserve_reports: 125,
  known_unknowns: 342,
  regulatory_notes: 9,
  deployments: 184,
  market_access_records: 8,
  detail_routes: 417,
  metadata_checked_routes: 417,
  archive_index_count: 457,
  archive_not_recorded_count: 122
};

const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const writeJson = (file, value) => {
  const full = path.join(root, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, `${JSON.stringify(value, null, 2)}\n`);
};
const writeText = (file, value) => fs.writeFileSync(path.join(root, file), value.endsWith('\n') ? value : `${value}\n`);
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const replaceOnce = (text, from, to, label) => {
  if (!text.includes(from)) throw new Error(`Missing ${label}: ${from}`);
  return text.replace(from, to);
};

function validateDecisionFile(authority, decisionFile) {
  if (authority.authority_pr !== 505 || authority.implementation_pr !== 506) throw new Error('PR #505/#506 authority mismatch');
  if (decisionFile.authority_pr !== 505 || decisionFile.implementation_pr !== 506) throw new Error('Decision PR sequence mismatch');
  if (decisionFile.status !== 'reviewed_complete') throw new Error('Decision file is not reviewed complete');
  const expectedIds = authority.target_evidence_ids;
  const decisions = decisionFile.decisions ?? [];
  if (decisions.length !== 10 || decisionFile.target_count !== 10) throw new Error('Decision count changed');
  if (JSON.stringify(decisions.map((row) => row.evidence_id)) !== JSON.stringify(expectedIds)) throw new Error('Decision target order changed');
  const accepted = decisions.filter((row) => row.outcome === 'dated_exact_archive_added');
  const noSafe = decisions.filter((row) => row.outcome === 'reviewed_no_safe_change');
  if (accepted.length !== 7 || noSafe.length !== 3) throw new Error('Reviewed outcome counts changed');
  for (const row of decisions) {
    if (!['dated_exact_archive_added', 'reviewed_no_safe_change'].includes(row.outcome)) throw new Error(`${row.evidence_id}: invalid outcome`);
    if (!row.canonical_url?.startsWith('https://')) throw new Error(`${row.evidence_id}: invalid canonical URL`);
    if (row.outcome === 'dated_exact_archive_added') {
      if (!/^\d{14}$/.test(row.capture_timestamp)) throw new Error(`${row.evidence_id}: invalid capture timestamp`);
      const expectedArchive = `https://web.archive.org/web/${row.capture_timestamp}/${row.canonical_url}`;
      if (row.archived_url !== expectedArchive) throw new Error(`${row.evidence_id}: archive URL mismatch`);
      if (row.fetch_status !== 200 || !Number.isInteger(row.payload_bytes) || row.payload_bytes <= 0) throw new Error(`${row.evidence_id}: reviewed payload is not HTTP 200 with body`);
      if (!/^[a-f0-9]{64}$/.test(row.payload_sha256)) throw new Error(`${row.evidence_id}: payload digest missing`);
      if (!Array.isArray(row.payload_markers) || row.payload_markers.length < 2) throw new Error(`${row.evidence_id}: payload markers incomplete`);
    }
    if (!row.review_reason) throw new Error(`${row.evidence_id}: review reason missing`);
  }
  if (decisionFile.archive_index_count_before !== 450 || decisionFile.archive_index_count_after !== 457) throw new Error('Archive recorded transition changed');
  if (decisionFile.archive_not_recorded_count_before !== 129 || decisionFile.archive_not_recorded_count_after !== 122) throw new Error('Archive missing transition changed');
  return { decisions, accepted, noSafe };
}

function updateEvidenceFiles(decisions) {
  const byFile = new Map();
  for (const decision of decisions) {
    if (!byFile.has(decision.source_file)) byFile.set(decision.source_file, []);
    byFile.get(decision.source_file).push(decision);
  }
  const changedFiles = [];
  for (const [file, fileDecisions] of byFile) {
    const rows = readJson(file);
    if (!Array.isArray(rows)) throw new Error(`${file}: Evidence file must be an array`);
    const decisionById = new Map(fileDecisions.map((row) => [row.evidence_id, row]));
    const found = new Set();
    const next = rows.map((row) => {
      const decision = decisionById.get(row.id);
      if (!decision) return row;
      found.add(row.id);
      if (row.url !== decision.canonical_url) throw new Error(`${row.id}: canonical URL changed before PR #506`);
      if (String(row.archived_url ?? '').trim()) throw new Error(`${row.id}: archive already recorded before PR #506`);
      if (decision.outcome === 'dated_exact_archive_added') return { ...row, archived_url: decision.archived_url };
      return row;
    });
    if (found.size !== fileDecisions.length) throw new Error(`${file}: not every target Evidence row was found`);
    writeJson(file, next);
    if (fileDecisions.some((row) => row.outcome === 'dated_exact_archive_added')) changedFiles.push(file);
  }
  return changedFiles.sort();
}

function loadAllEvidence() {
  const rows = [];
  for (const name of fs.readdirSync(path.join(root, 'data')).filter((name) => /^evidence.*\.json$/.test(name)).sort()) {
    const value = readJson(path.join('data', name));
    if (!Array.isArray(value)) continue;
    rows.push(...value);
  }
  return rows;
}

function verifyEvidencePartition(decisions) {
  const rows = loadAllEvidence();
  if (rows.length !== expected.evidence) throw new Error(`Evidence count ${rows.length} != ${expected.evidence}`);
  const archived = rows.filter((row) => String(row.archived_url ?? '').trim()).length;
  const missing = rows.length - archived;
  if (archived !== expected.archive_index_count || missing !== expected.archive_not_recorded_count) {
    throw new Error(`Archive partition ${archived}/${missing} != ${expected.archive_index_count}/${expected.archive_not_recorded_count}`);
  }
  const byId = new Map(rows.map((row) => [row.id, row]));
  for (const decision of decisions) {
    const row = byId.get(decision.evidence_id);
    if (!row) throw new Error(`${decision.evidence_id}: missing after write`);
    if (row.url !== decision.canonical_url) throw new Error(`${decision.evidence_id}: source URL changed`);
    if (decision.outcome === 'dated_exact_archive_added' && row.archived_url !== decision.archived_url) throw new Error(`${decision.evidence_id}: accepted archive not written`);
    if (decision.outcome === 'reviewed_no_safe_change' && String(row.archived_url ?? '').trim()) throw new Error(`${decision.evidence_id}: no-safe-change gained archive`);
  }
  return { rows, archived, missing };
}

function buildCheckpoint(base, accepted, noSafe) {
  const checkpoint = structuredClone(base);
  checkpoint.status = 'reviewed_non_growth_checkpoint';
  checkpoint.checkpoint_id = canonicalCheckpointId;
  checkpoint.checkpoint_kind = 'non_growth_evidence_archive_checkpoint';
  checkpoint.recorded_at = '2026-08-01';
  checkpoint.source_commit = registryVersion;
  checkpoint.source_checkpoint_id = base.checkpoint_id;
  checkpoint.previous_checkpoint_id = base.checkpoint_id;
  checkpoint.maintenance_pr = 506;
  checkpoint.authority_pr = 505;
  checkpoint.asset_count = expected.assets;
  checkpoint.counts = { ...checkpoint.counts, archive_index_count: expected.archive_index_count, archive_not_recorded_count: expected.archive_not_recorded_count };
  checkpoint.evidence_quality = {
    ...checkpoint.evidence_quality,
    archive_index_count: expected.archive_index_count,
    archive_not_recorded_count: expected.archive_not_recorded_count,
    selected_for_review: 10,
    canonical_changes: accepted.length,
    dated_exact_archive_added: accepted.length,
    reviewed_no_safe_change: noSafe.length,
    new_evidence_records: 0,
    source_replacements: 0
  };
  checkpoint.maintenance_outcome = {
    changed_evidence_ids: accepted.map((row) => row.evidence_id),
    dated_archive_added_evidence_ids: accepted.map((row) => row.evidence_id),
    reviewed_no_safe_change_evidence_ids: noSafe.map((row) => row.evidence_id),
    source_replacement_evidence_ids: []
  };
  checkpoint.notes = `Current deterministic canonical checkpoint after PR #506 Evidence Archive Payload Verification Batch 1. Seven exact dated archived payloads were accepted after body-level claim-scope review and three targets remained without a safe archive. Archive coverage is 457 of 579. Canonical identities, Evidence Relations, all non-Evidence record counts, routes, and public-surface boundaries remain unchanged.`;
  return checkpoint;
}

function buildStatsCheckpoint(base) {
  return {
    ...base,
    status: 'reviewed_non_growth_checkpoint',
    checkpoint_id: statsCheckpointId,
    checkpoint_kind: 'non_growth_evidence_archive_checkpoint',
    recorded_at: '2026-08-01',
    registry_version: registryVersion,
    asset_count: expected.assets,
    source_checkpoint_id: base.checkpoint_id,
    canonical_checkpoint_id: canonicalCheckpointId,
    previous_history_checkpoint_id: base.checkpoint_id,
    maintenance_pr: 506,
    authority_pr: 505,
    notes: 'Reviewed forward same-count statistics checkpoint for PR #506. It records archive coverage 457 of 579 while preserving every canonical record count and public-surface boundary.'
  };
}

function buildReleaseBaseline(base) {
  return {
    ...base,
    status: 'current',
    baseline_id: 'sog_release_integrity_pr506_117_assets_2026_08_01',
    recorded_at: '2026-08-01',
    source_checkpoint_commit: registryVersion,
    evidence_quality: {
      ...base.evidence_quality,
      archive_index_count: expected.archive_index_count,
      archive_not_recorded_count: expected.archive_not_recorded_count,
      selected_for_review: 10,
      canonical_change_assets: 7,
      reviewed_no_safe_change_assets: 3,
      new_evidence_records: 0
    },
    source_pr: 506,
    source_commit: registryVersion,
    captured_at: '2026-08-01'
  };
}

function buildSourceReview(decisionFile) {
  return {
    schema_version: '1.0',
    review_id: 'sog_evidence_archive_payload_verification_batch_1_pr506_source_review_2026_08_01',
    status: 'reviewed_complete',
    public_output: false,
    authority_pr: 505,
    implementation_pr: 506,
    reviewed_at: '2026-08-01',
    method: 'Exact canonical-source Wayback CDX lookup, independent HTTP payload retrieval, payload digest recording, extracted-text inspection, and manual claim-scope comparison.',
    acceptance_rule: 'HTTP 200 exact-source dated payload must visibly preserve the existing canonical claim scope; CDX metadata, redirect shells, generic frames, future-only text, and unrelated bodies are insufficient.',
    target_count: 10,
    dated_exact_archive_added_count: 7,
    reviewed_no_safe_change_count: 3,
    decisions: decisionFile.decisions,
    probe_artifacts: [
      'GitHub Actions artifact pr506-wayback-payload-review (run 30690021238)',
      'GitHub Actions matrix artifacts pr506-wayback-gap-retry-* (run 30690380298)'
    ],
    next_boundary: 'REVIEW_GATE'
  };
}

function updateAuthorityDocs() {
  let agents = readText('AGENTS.md');
  agents = replaceOnce(agents, 'Archive recorded: 450', 'Archive recorded: 457', 'AGENTS current archive recorded');
  agents = replaceOnce(agents, 'Archive not recorded: 129', 'Archive not recorded: 122', 'AGENTS current archive missing');
  agents = replaceOnce(agents, 'Current production checkpoint: 4ac32bc2476e04bb28142ef75cf421149c441542', 'Current production checkpoint: 58db65bf6c888d48ea53b0d3e4350e3b2a0fc176', 'AGENTS production checkpoint');
  agents = replaceOnce(agents, '13. PR #505 authorizes one bounded archived-payload verification pass over ten PR #405 Evidence identities; implementation is reserved for PR #506.', '13. PR #505 authorized one bounded archived-payload verification pass over ten PR #405 Evidence identities.\n14. PR #506 reviewed all ten archived payload boundaries, accepted seven exact dated archives, preserved three gaps, and is under review.');
  agents = agents.replace('14. `docs/ui-v3-remediation-authority.md` remains the regression-protection contract for material public UI work.', '15. `docs/ui-v3-remediation-authority.md` remains the regression-protection contract for material public UI work.');
  agents = replaceOnce(agents, 'PR #505 Evidence Archive Payload Verification — Batch 1 authorization: active\nPR #506 Evidence Archive Payload Verification — Batch 1: reserved implementation', 'PR #505 Evidence Archive Payload Verification — Batch 1 authorization: complete and production-verified\nPR #506 Evidence Archive Payload Verification — Batch 1: implementation under review', 'AGENTS workstream');
  const section = `\n## PR #506 reviewed archive-payload result\n\nPR #506 reviewed all ten fixed identities. Seven exact dated Wayback payloads preserve the canonical claim scope and are added as canonical \`archived_url\` values. Three targets remain without a safe archive.\n\n\`\`\`text\ndated exact archives added: 7\nreviewed no safe change: 3\nEvidence identities: 579\nEvidence Relations: 579\nArchive recorded: 457\nArchive not recorded: 122\n\`\`\`\n\nThe three preserved gaps are the broad RLUSD product page, the SPOT mint-guide placeholder, and the ampleforth.org root whose sampled historical bodies are unrelated or pre-SPOT. Source URLs, Evidence identities, Evidence Relations, non-Evidence canonical records, routes, and UI remain unchanged.\n\nAfter PR #506 merge and production verification, stop at REVIEW GATE. No later archive batch is authorized automatically.\n`;
  agents = replaceOnce(agents, '\n## PR #505 authorized archive-payload review\n', section + '\n## PR #505 authorized archive-payload review\n', 'AGENTS PR506 section');
  writeText('AGENTS.md', agents);

  let roadmap = readText('docs/roadmap.md');
  roadmap = replaceOnce(roadmap, 'Status: PR #505 Evidence Archive Payload Verification — Batch 1 authorized; PR #506 reserved', 'Status: PR #506 Evidence Archive Payload Verification — Batch 1 under review; exit boundary REVIEW GATE', 'roadmap status');
  roadmap = replaceOnce(roadmap, 'Archive recorded: 450', 'Archive recorded: 457', 'roadmap current archive recorded');
  roadmap = replaceOnce(roadmap, 'Archive not recorded: 129', 'Archive not recorded: 122', 'roadmap current archive missing');
  roadmap = replaceOnce(roadmap, 'Current production checkpoint: 4ac32bc2476e04bb28142ef75cf421149c441542', 'Current production checkpoint: 58db65bf6c888d48ea53b0d3e4350e3b2a0fc176', 'roadmap production checkpoint');
  roadmap = replaceOnce(roadmap, 'PR #505 Evidence Archive Payload Verification — Batch 1 authorization: active\nPR #506 Evidence Archive Payload Verification — Batch 1: reserved implementation', 'PR #505 Evidence Archive Payload Verification — Batch 1 authorization: complete and production-verified\nPR #506 Evidence Archive Payload Verification — Batch 1: implementation under review', 'roadmap acceptance list');
  const roadmapSection = `\n## PR #506 reviewed item\n\n\`\`\`text\nEvidence Archive Payload Verification — Batch 1\nAuthority PR: #505\nImplementation PR: #506\nTargets reviewed: 10\nDated exact archives added: 7\nReviewed no safe change: 3\nArchive coverage: 457 / 579\n\`\`\`\n\nEvery accepted archive is an exact canonical-source HTTP-200 Wayback body with a timestamped URL, payload digest, and manual claim-scope review. The RLUSD product page, SPOT mint-guide placeholder, and ampleforth.org root remain without a canonical archive because the reviewed bodies did not preserve their current claim scopes.\n\nPR #506 changes no Evidence identity or Relation, source URL, asset, organization, relationship, event, deployment, Market Access record, route family, or material UI. After merge and production verification, return to REVIEW GATE.\n`;
  roadmap = replaceOnce(roadmap, '\n## PR #500 completed item\n', roadmapSection + '\n## PR #500 completed item\n', 'roadmap PR506 section');
  writeText('docs/roadmap.md', roadmap);

  let governance = readText('docs/spec-governance.md');
  governance = replaceOnce(governance, 'PR #505 Evidence Archive Payload Verification — Batch 1 authorization; PR #506 implementation reserved', 'PR #506 Evidence Archive Payload Verification — Batch 1 implementation under review', 'governance current item');
  const oldDecision = `PR #505 Evidence Archive Payload Verification — Batch 1 authorization\nimplementation PR: #506\nexact target count: 10\nsource checkpoint: PR #405 reviewed-no-safe-change identities\nallowed outcomes: dated_exact_archive_added or reviewed_no_safe_change\nmaximum archive additions: 10\nsource replacement: prohibited\nreplacement targets: prohibited\nnew Evidence identities or Relations: prohibited\nnext boundary after PR #506: REVIEW GATE`;
  const newDecision = `PR #506 Evidence Archive Payload Verification — Batch 1 implementation under review\nexact target count: 10\ndated exact archives added: 7\nreviewed no safe change: 3\narchive coverage after: 457 of 579\nsource replacement: 0\nnew Evidence identities or Relations: 0\nnon-Evidence canonical changes: 0\nnext boundary after PR #506: REVIEW GATE`;
  governance = replaceOnce(governance, oldDecision, newDecision, 'governance reviewed decision');
  governance = governance.replace(/## 19\. Review gate[\s\S]*$/, `## 19. Review gate\n\nPR #506 is the current implementation under review. Before merge and production acceptance, review:\n\n\`\`\`text\nall ten payload dispositions\nseven accepted exact timestamps and payload digests\nthree preserved no-safe-change gaps\narchive transition 450/129 -> 457/122\nEvidence identity and Relation preservation\ncanonical count and route parity\nproduction parity\n\`\`\`\n\nAfter PR #506 merge and production verification, the repository returns to REVIEW GATE. Only a later separate reviewed decision may authorize another work item.\n`);
  writeText('docs/spec-governance.md', governance);
}

const authority = readJson(authorityPath);
const decisionFile = readJson(decisionPath);
const { decisions, accepted, noSafe } = validateDecisionFile(authority, decisionFile);
const changedEvidenceFiles = updateEvidenceFiles(decisions);
const partition = verifyEvidencePartition(decisions);

const baseCheckpoint = readJson(checkpointPath);
const baseStatsCheckpoint = readJson(statsCheckpointPath);
const baseHistory = readJson(statsHistoryPath);
const baseReleaseBaseline = readJson(releaseBaselinePath);
const checkpoint = buildCheckpoint(baseCheckpoint, accepted, noSafe);
const statsCheckpoint = buildStatsCheckpoint(baseStatsCheckpoint);
const releaseBaseline = buildReleaseBaseline(baseReleaseBaseline);
const sourceReview = buildSourceReview(decisionFile);

writeJson(checkpointPath, checkpoint);
writeJson(statsCheckpointPath, statsCheckpoint);
writeJson(releaseBaselinePath, releaseBaseline);
writeJson(sourceReviewPath, sourceReview);

const stats = generateStats({ root });
const snapshot = generateCurrentHistorySnapshot({ root });
const history = structuredClone(baseHistory);
history.snapshots = [...(history.snapshots ?? []).filter((row) => row.checkpoint_id !== snapshot.checkpoint_id), snapshot];
writeJson(statsHistoryPath, history);

const outcomes = {
  schema_version: '1.0',
  outcome_id: 'sog_evidence_archive_payload_verification_batch_1_pr506_outcomes_2026_08_01',
  status: 'reviewed_bounded_maintenance',
  public_output: false,
  authority_pr: 505,
  implementation_pr: 506,
  selected_count: 10,
  changed_count: 7,
  dated_archive_added_count: 7,
  reviewed_no_safe_change_count: 3,
  canonical_evidence_count_after: expected.evidence,
  evidence_relation_count_after: expected.evidence_relations,
  archive_index_count_before: 450,
  archive_index_count_after: partition.archived,
  archive_not_recorded_count_before: 129,
  archive_not_recorded_count_after: partition.missing,
  changed_files: changedEvidenceFiles,
  outcomes: decisions.map((row) => ({
    evidence_id: row.evidence_id,
    source_file: row.source_file,
    decision: row.outcome,
    canonical_url: row.canonical_url,
    archived_url: row.archived_url ?? null,
    capture_timestamp: row.capture_timestamp ?? row.reviewed_capture_timestamp ?? null,
    payload_sha256: row.payload_sha256 ?? row.reviewed_payload_sha256 ?? null,
    reason: row.review_reason,
    remaining_uncertainty: row.remaining_uncertainty ?? null
  })),
  constraints: decisionFile.constraints,
  next_boundary: 'REVIEW_GATE'
};
writeJson(outcomesPath, outcomes);

const handoffBase = {
  schema_version: '1.0',
  handoff_id: 'sog_evidence_archive_payload_verification_batch_1_pr506_handoff_2026_08_01',
  status: 'reviewed_complete_pending_merge_and_production',
  authority_pr: 505,
  implementation_pr: 506,
  canonical_checkpoint_id: canonicalCheckpointId,
  stats_checkpoint_id: statsCheckpointId,
  outcome_id: outcomes.outcome_id,
  source_review_id: sourceReview.review_id,
  canonical_counts: expected,
  evidence_quality: {
    archive_recorded: partition.archived,
    archive_not_recorded: partition.missing,
    selected: 10,
    changed: 7,
    dated_archive_added: 7,
    reviewed_no_safe_change: 3
  },
  changed_evidence_ids: accepted.map((row) => row.evidence_id),
  reviewed_no_safe_change_evidence_ids: noSafe.map((row) => row.evidence_id),
  stats_input_digest_sha256: stats.input_digest_sha256,
  stats_model_sha256: sha256(JSON.stringify(stats)),
  stats_snapshot_sha256: snapshot.snapshot_sha256,
  boundaries: {
    new_or_removed_evidence_identity: false,
    evidence_relation_change: false,
    source_replacement: false,
    non_evidence_canonical_change: false,
    market_access_change: false,
    public_route_change: false,
    material_ui_change: false,
    automatic_continuation: false
  },
  next_work_item: 'REVIEW_GATE'
};
writeJson(handoffPath, { ...handoffBase, handoff_sha256: sha256(JSON.stringify(handoffBase)) });

updateAuthorityDocs();
writeText('scripts/validate-active-workstream.mjs', "import './validate-evidence-archive-payload-verification-pr506.mjs';\n");

console.log(JSON.stringify({
  ok: true,
  accepted: accepted.length,
  reviewed_no_safe_change: noSafe.length,
  archive_recorded: partition.archived,
  archive_not_recorded: partition.missing,
  changed_evidence_files: changedEvidenceFiles,
  canonical_checkpoint_id: canonicalCheckpointId,
  stats_checkpoint_id: statsCheckpointId,
  snapshot_sha256: snapshot.snapshot_sha256
}, null, 2));
