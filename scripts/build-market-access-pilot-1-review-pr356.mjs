import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const configPath = 'config/market-access-pilot-1-pr356.json';
const researchPath = 'data/editorial-research/japan-stablecoin-market-access-2026.json';
const handoffPath = 'docs/migration/tier-a-batch-2-pr355-reviewed-handoff.json';

const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
const readRows = (relativePath) => {
  const parsed = readJson(relativePath);
  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed.records)) return parsed.records;
  throw new Error(`${relativePath}: expected an array or { records: [] }`);
};
const unique = (values) => [...new Set(values.filter((value) => typeof value === 'string' && value.length > 0))].sort();
const normalizeUrl = (raw) => {
  try {
    const url = new URL(raw);
    url.hash = '';
    url.hostname = url.hostname.toLowerCase();
    url.pathname = url.pathname.replace(/\/+$/, '') || '/';
    return url.toString();
  } catch {
    return raw;
  }
};
const digestFiles = (files) => {
  const digest = crypto.createHash('sha256');
  for (const file of [...files].sort()) {
    digest.update(file);
    digest.update('\0');
    digest.update(fs.readFileSync(path.join(root, file)));
    digest.update('\0');
  }
  return digest.digest('hex');
};

const stateMap = {
  available: 'available',
  available_on_supported_network: 'restricted_network_scope',
  available_account_internal: 'account_internal_only',
  unavailable_at_reviewed_launch_stage: 'unavailable',
  not_assessed: 'not_assessed',
};

const functionSignals = {
  buy_sell: ['buy', 'sell', 'trade', 'trading', 'purchase', 'sale', 'availability', 'handling'],
  deposit: ['deposit', 'receive', 'inbound', 'availability', 'handling'],
  withdrawal: ['withdraw', 'withdrawal', 'outbound', 'availability', 'handling'],
  external_wallet_transfer: ['external wallet', 'transfer', 'network', 'ethereum', 'withdrawal', 'availability'],
};

function evidenceText(row) {
  return [
    row.title,
    row.claim_scope,
    ...(row.claim_scopes ?? []),
    row.notes,
  ].filter(Boolean).join(' ').toLowerCase();
}

function candidateConditions(functionName, sourceRow) {
  const conditions = [];
  if (functionName === 'buy_sell') {
    conditions.push({
      type: 'transaction_limit',
      description: 'At the reviewed launch stage, SBI VC Trade announced a JPY 1 million-equivalent limit per buy/sell transaction.',
    });
  }
  if (functionName === 'withdrawal') {
    conditions.push({
      type: 'withdrawal_limit',
      description: 'At the reviewed launch stage, SBI VC Trade announced a JPY 1 million-equivalent limit per withdrawal.',
    });
  }
  if (['deposit', 'withdrawal', 'external_wallet_transfer'].includes(functionName)) {
    conditions.push({
      type: 'network_support',
      description: 'The reviewed launch-stage research records Ethereum as the platform-supported network for USDC.',
    });
  }
  if (sourceRow.platform_limits_note) {
    conditions.push({
      type: 'service_condition',
      description: sourceRow.platform_limits_note,
    });
  }
  return conditions;
}

export function buildMarketAccessPilot1Review() {
  const config = readJson(configPath);
  const research = readJson(researchPath);
  const handoff = readJson(handoffPath);
  const baseline = loadRegistryV2Baseline(root);
  const stablecoins = (baseline.data_groups?.stablecoins ?? []).flatMap(readRows);
  const evidenceFiles = baseline.data_groups?.evidence ?? [];
  const evidence = evidenceFiles.flatMap(readRows);
  const assetIds = new Set(stablecoins.map((row) => row.id));
  const evidenceById = new Map(evidence.map((row) => [row.id, row]));
  const evidenceByExactUrl = new Map();
  const evidenceByNormalizedUrl = new Map();

  for (const row of evidence) {
    if (!row?.id || !row?.url) continue;
    const exactRows = evidenceByExactUrl.get(row.url) ?? [];
    exactRows.push(row);
    evidenceByExactUrl.set(row.url, exactRows);
    const normalized = normalizeUrl(row.url);
    const normalizedRows = evidenceByNormalizedUrl.get(normalized) ?? [];
    normalizedRows.push(row);
    evidenceByNormalizedUrl.set(normalized, normalizedRows);
  }

  const selectedResearchRows = (research.records ?? []).filter((row) => config.source_research_record_ids.includes(row.record_id));
  const sourceRow = selectedResearchRows[0] ?? null;
  if (!sourceRow) throw new Error('Configured source research row was not found.');

  const sourceUrls = unique(sourceRow.source_urls ?? []);
  const dispositions = config.source_url_dispositions ?? {};
  const urlReview = sourceUrls.map((url) => {
    const exactMatches = evidenceByExactUrl.get(url) ?? [];
    const normalizedMatches = evidenceByNormalizedUrl.get(normalizeUrl(url)) ?? [];
    const disposition = dispositions[url] ?? null;
    return {
      url,
      normalized_url: normalizeUrl(url),
      exact_match_ids: unique(exactMatches.map((row) => row.id)),
      normalized_match_ids: unique(normalizedMatches.map((row) => row.id)),
      disposition,
      exact_matches: exactMatches.map((row) => ({
        id: row.id,
        title: row.title ?? null,
        publisher: row.publisher ?? null,
        source_type: row.source_type ?? null,
        claim_scope: row.claim_scope ?? null,
        claim_scopes: [...(row.claim_scopes ?? [])],
        reliability: row.reliability ?? null,
      })),
    };
  });

  const allExactEvidenceIds = unique(urlReview.flatMap((row) => row.exact_match_ids));
  const approvedMap = config.canonical_promotion?.approved_evidence_ids_by_function ?? {};
  const candidates = config.functions.map((functionName) => {
    const sourceState = sourceRow.functions?.[functionName] ?? null;
    const mappedState = stateMap[sourceState] ?? null;
    const signals = functionSignals[functionName] ?? [];
    const signalEvidence = evidence.filter((row) => {
      if (!allExactEvidenceIds.includes(row.id)) return false;
      const text = evidenceText(row);
      return signals.some((signal) => text.includes(signal));
    });
    const approvedEvidenceIds = unique(approvedMap[functionName] ?? []);
    const approvedEvidenceExists = approvedEvidenceIds.every((id) => evidenceById.has(id));
    const approvedEvidenceInSourceSet = approvedEvidenceIds.every((id) => allExactEvidenceIds.includes(id));
    const promotionStatus = approvedEvidenceIds.length > 0 && approvedEvidenceExists && approvedEvidenceInSourceSet
      ? 'approved_candidate_pending_canonical_write'
      : allExactEvidenceIds.length === 0
        ? 'blocked_missing_canonical_evidence'
        : 'manual_function_claim_scope_review_required';

    return {
      function: functionName,
      source_access_state: sourceState,
      mapped_access_state: mappedState,
      source_url_count: sourceUrls.length,
      exact_canonical_evidence_ids: allExactEvidenceIds,
      evidence_with_function_scope_signals: signalEvidence.map((row) => ({
        id: row.id,
        title: row.title ?? null,
        claim_scope: row.claim_scope ?? null,
        claim_scopes: [...(row.claim_scopes ?? [])],
        matching_signals: signals.filter((signal) => evidenceText(row).includes(signal)),
      })),
      approved_evidence_ids: approvedEvidenceIds,
      approved_evidence_exists: approvedEvidenceExists,
      approved_evidence_within_reviewed_source_urls: approvedEvidenceInSourceSet,
      promotion_status: promotionStatus,
      proposed_record: {
        id: `sog_ma_usdc_jp_sbivc_vctrade_${functionName}_20250326`,
        schema_version: '1.0',
        asset_id: 'sog_st_usdc',
        jurisdiction: { country_code: 'JP', subdivision_code: null },
        platform: { organization_id: null, name: 'SBI VC Trade', service: 'VCTRADE' },
        function: functionName,
        access_state: mappedState,
        effective_from: config.effective_from,
        effective_to: null,
        observed_at: config.observed_at,
        date_precision: 'day',
        network_scope: {
          kind: 'specific_networks',
          network_ids: ['ethereum'],
          note: 'Scope reflects the reviewed SBI VC Trade launch-stage USDC support described by the source research row.',
        },
        customer_scope: {
          kind: 'mixed_or_platform_defined',
          note: 'Availability is limited to customers accepted by SBI VC Trade under its account, jurisdiction, eligibility, and compliance rules.',
        },
        conditions: candidateConditions(functionName, sourceRow),
        legal_route: {
          status: 'provider_characterization',
          description: sourceRow.legal_route_description,
        },
        evidence_ids: approvedEvidenceIds,
        confidence: sourceRow.confidence,
        review_status: 'reviewed',
        supersedes_record_ids: [],
        notes: 'Provider-scoped Japan observation. This record does not assert universal Japan-wide availability.',
      },
    };
  });

  const promotionReady = candidates.filter((row) => row.promotion_status === 'approved_candidate_pending_canonical_write');
  const supplementarySourceUrls = urlReview
    .filter((row) => row.exact_match_ids.length === 0 && row.disposition?.status === 'supplementary_not_required_for_promoted_claims')
    .map((row) => ({ url: row.url, ...row.disposition }));
  const unresolvedSourceUrls = urlReview
    .filter((row) => row.exact_match_ids.length === 0 && !row.disposition)
    .map((row) => row.url);

  return {
    schema_version: '1.0',
    review_id: 'sog_market_access_pilot_1_pr356_review',
    status: 'deterministic_internal_candidate_review',
    public_output: false,
    review_pr: 356,
    pilot_id: config.pilot_id,
    source_handoff_id: handoff.handoff_id,
    source_merge_commit: handoff.source_merge_commit,
    source_research_id: research.research_id,
    source_research_record_id: sourceRow.record_id,
    review_cutoff: config.review_cutoff,
    bounded_scope: {
      jurisdiction_codes: config.jurisdictions.map((row) => row.country_code),
      asset_ids: config.assets.map((row) => row.asset_id),
      platforms: config.platforms.map((row) => `${row.name}/${row.service}`),
      functions: [...config.functions],
      excluded_functions: [...config.excluded_functions],
      maximum_canonical_records: config.maximum_canonical_records,
    },
    asset_exists: assetIds.has(sourceRow.asset_id),
    source_url_review: urlReview,
    exact_canonical_evidence_ids: allExactEvidenceIds,
    supplementary_source_urls: supplementarySourceUrls,
    unmatched_source_urls: unresolvedSourceUrls,
    candidate_count: candidates.length,
    promotion_ready_count: promotionReady.length,
    candidates,
    boundaries: config.boundaries,
    input_digest_sha256: digestFiles([configPath, researchPath, handoffPath, ...evidenceFiles]),
  };
}

export const serializeMarketAccessPilot1Review = (report) => `${JSON.stringify(report, null, 2)}\n`;

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const output = process.argv[2] ?? 'artifacts/pr356/market-access-pilot-1-review.json';
  const report = buildMarketAccessPilot1Review();
  fs.mkdirSync(path.dirname(path.resolve(output)), { recursive: true });
  fs.writeFileSync(path.resolve(output), serializeMarketAccessPilot1Review(report));
  console.log(JSON.stringify({
    output,
    candidate_count: report.candidate_count,
    exact_canonical_evidence_ids: report.exact_canonical_evidence_ids,
    supplementary_source_url_count: report.supplementary_source_urls.length,
    unmatched_source_url_count: report.unmatched_source_urls.length,
    promotion_ready_count: report.promotion_ready_count,
    input_digest_sha256: report.input_digest_sha256,
  }, null, 2));
}
