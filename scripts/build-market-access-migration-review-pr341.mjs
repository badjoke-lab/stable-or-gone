import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
const baseline = loadRegistryV2Baseline(root);
const research = readJson('data/editorial-research/japan-stablecoin-market-access-2026.json');
const governance = readJson('config/market-access-governance-v1.json');

const readGroup = (name) => (baseline.data_groups?.[name] ?? []).flatMap(readJson);
const stablecoins = readGroup('stablecoins');
const evidence = readGroup('evidence');
const assetIds = new Set(stablecoins.map((row) => row.id));
const evidenceByUrl = new Map();
for (const row of evidence) {
  if (!row?.url || !row?.id) continue;
  const existing = evidenceByUrl.get(row.url) ?? [];
  existing.push(row.id);
  evidenceByUrl.set(row.url, existing);
}

const stateMap = {
  available: 'available',
  available_on_supported_network: 'restricted_network_scope',
  available_account_internal: 'account_internal_only',
  unavailable_at_reviewed_launch_stage: 'unavailable',
  not_assessed: 'not_assessed'
};

const records = [];
for (const sourceRow of research.records ?? []) {
  const sourceUrls = [...new Set(sourceRow.source_urls ?? [])];
  const matchedEvidenceIds = [...new Set(sourceUrls.flatMap((url) => evidenceByUrl.get(url) ?? []))].sort();
  const unmatchedSourceUrls = sourceUrls.filter((url) => !evidenceByUrl.has(url));

  for (const [functionName, sourceState] of Object.entries(sourceRow.functions ?? {})) {
    const mappedState = stateMap[sourceState] ?? null;
    const migrationStatus = matchedEvidenceIds.length === 0
      ? 'blocked_missing_canonical_evidence'
      : 'review_required_claim_scope_check';

    records.push({
      source_research_id: research.research_id,
      source_record_id: sourceRow.record_id,
      asset_id: sourceRow.asset_id,
      asset_exists: assetIds.has(sourceRow.asset_id),
      jurisdiction_code: sourceRow.jurisdiction_code,
      platform: sourceRow.platform,
      platform_service: sourceRow.platform_service,
      effective_from: sourceRow.effective_date,
      function: functionName,
      source_access_state: sourceState,
      mapped_access_state: mappedState,
      source_url_count: sourceUrls.length,
      matched_canonical_evidence_ids: matchedEvidenceIds,
      matched_canonical_evidence_count: matchedEvidenceIds.length,
      unmatched_source_urls: unmatchedSourceUrls,
      migration_status: migrationStatus,
      automatic_promotion: false,
      required_next_review: matchedEvidenceIds.length === 0
        ? 'create_or_link_canonical_evidence_records_then_review_claim_scope'
        : 'review_function_specific_claim_scope_against_canonical_evidence'
    });
  }
}

const statusCounts = Object.fromEntries(
  [...new Set(records.map((row) => row.migration_status))]
    .sort()
    .map((status) => [status, records.filter((row) => row.migration_status === status).length])
);

const output = {
  schema_version: '1.0',
  review_id: 'sog_market_access_migration_review_pr341_2026_07_10',
  generated_at: '2026-07-10',
  source_research_id: research.research_id,
  governance_id: governance.governance_id,
  canonical_action: 'none',
  source_research_record_count: (research.records ?? []).length,
  flattened_candidate_count: records.length,
  promotion_ready_count: 0,
  migration_status_counts: statusCounts,
  review_note: 'URL matching only identifies existing canonical evidence records. Function-specific claim scope still requires manual review before any canonical promotion.',
  records
};

const outputPath = path.join(root, 'artifacts/market-access-migration-review-pr341.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify({
  output: 'artifacts/market-access-migration-review-pr341.json',
  source_research_record_count: output.source_research_record_count,
  flattened_candidate_count: output.flattened_candidate_count,
  promotion_ready_count: output.promotion_ready_count,
  migration_status_counts: output.migration_status_counts
}, null, 2));
