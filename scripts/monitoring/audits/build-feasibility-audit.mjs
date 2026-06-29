import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadRegistryV2Baseline } from '../../load-registry-v2-baseline.mjs';

export const FEASIBILITY_CLASSIFICATIONS = [
  'automatically_monitorable',
  'partially_monitorable',
  'manual_review_only',
  'no_reliable_official_source'
];

const TERMINAL_STATUSES = new Set(['failed', 'discontinued', 'migrated']);
const OFFICIAL_SOURCE_TYPE = /(issuer|reserve|attest|assurance|regulat|protocol|official|legal|audit|court|filing)/i;
const MANUAL_SOURCE_TYPE = /(archive|snapshot|social|tweet|forum|court|filing|pdf|press|news)/i;

function readRows(root, relativePath) {
  const value = JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
  if (Array.isArray(value)) return value;
  if (Array.isArray(value.records)) return value.records;
  throw new Error(`${relativePath}: expected an array or records array`);
}

function loadGroup(root, baseline, group) {
  return (baseline.data_groups?.[group] ?? []).flatMap((relativePath) => readRows(root, relativePath));
}

function normalized(value) {
  return String(value ?? '').trim().toLowerCase();
}

function unique(values) {
  return [...new Set(values.filter(Boolean))].sort();
}

function evidenceIsOfficial(row) {
  const reliability = normalized(row.reliability);
  const sourceType = normalized(row.source_type);
  return reliability === 'high' || OFFICIAL_SOURCE_TYPE.test(sourceType);
}

function parsedHttpsUrl(row) {
  try {
    const url = new URL(row.url);
    return url.protocol === 'https:' ? url : null;
  } catch {
    return null;
  }
}

function evidenceIsCurrentFetchable(row) {
  const url = parsedHttpsUrl(row);
  if (!url) return false;
  if (url.hostname === 'web.archive.org' || url.hostname.endsWith('.archive.org')) return false;
  if (/\.pdf$/i.test(url.pathname)) return false;
  const text = [row.source_type, row.title, row.url].map(normalized).join(' ');
  return !MANUAL_SOURCE_TYPE.test(text);
}

function evidenceFamily(row) {
  const text = [row.claim_scope, row.source_type, row.title, row.url].map(normalized).join(' ');
  if (/(reserve|backing|collateral|attest|assurance|audit)/.test(text)) return 'reserve_assurance';
  if (/(redeem|redemption|mint|issuance|eligibility|fee|terms)/.test(text)) return 'redemption_terms';
  if (/(regulat|license|licence|authority|court|enforcement|filing|notice)/.test(text)) return 'regulatory';
  if (/(migration|migrate|shutdown|sunset|discontinu|retire|termination|rebrand|upgrade|transition|depeg|launch)/.test(text)) return 'issuer_lifecycle';
  if (/(contract|explorer|github|whitepaper|technical|developer|docs|documentation)/.test(text)) return 'technical';
  return 'general_official';
}

function relevantEvidenceFor(stablecoin, organizationIds, evidence) {
  return evidence.filter((row) =>
    row.stablecoin_id === stablecoin.id
    || organizationIds.includes(row.issuer_id)
    || organizationIds.includes(row.organization_id)
  );
}

function buildRecord(stablecoin, evidence, relationships) {
  const relatedRelationships = relationships.filter((row) => row.stablecoin_id === stablecoin.id);
  const organizationIds = unique([
    stablecoin.issuer_id,
    ...relatedRelationships.map((row) => row.organization_id)
  ]);
  const relevantEvidence = relevantEvidenceFor(stablecoin, organizationIds, evidence);
  const officialEvidence = relevantEvidence.filter(evidenceIsOfficial);
  const currentOfficialEvidence = officialEvidence.filter(evidenceIsCurrentFetchable);
  const directCurrentOfficialEvidence = currentOfficialEvidence.filter((row) => row.stablecoin_id === stablecoin.id);
  const currentFamilies = unique(currentOfficialEvidence.map(evidenceFamily));
  const allOfficialFamilies = unique(officialEvidence.map(evidenceFamily));
  const terminal = TERMINAL_STATUSES.has(normalized(stablecoin.status));

  let classification;
  let classificationReason;
  if (!terminal && directCurrentOfficialEvidence.length > 0 && currentFamilies.length >= 2) {
    classification = 'automatically_monitorable';
    classificationReason = 'nonterminal_asset_with_direct_current_official_source_and_multiple_source_families';
  } else if (currentOfficialEvidence.length > 0) {
    classification = 'partially_monitorable';
    classificationReason = terminal
      ? 'terminal_asset_with_current_official_reference_but_limited_monitoring_value'
      : 'current_official_source_exists_but_scope_or_directness_is_incomplete';
  } else if (officialEvidence.length > 0) {
    classification = 'manual_review_only';
    classificationReason = 'official_evidence_exists_only_as_archived_or_manual_review_material';
  } else {
    classification = 'no_reliable_official_source';
    classificationReason = 'canonical_evidence_contains_no_official_source_for_asset_or_related_organization';
  }

  const blockingGaps = [];
  if (officialEvidence.length === 0) blockingGaps.push('official_source_missing');
  if (currentOfficialEvidence.length === 0) blockingGaps.push('current_fetchable_official_source_missing');
  if (directCurrentOfficialEvidence.length === 0) blockingGaps.push('direct_asset_source_missing');
  for (const family of ['reserve_assurance', 'redemption_terms', 'issuer_lifecycle']) {
    if (!currentFamilies.includes(family)) blockingGaps.push(`${family}_coverage_missing`);
  }
  if (terminal) blockingGaps.push('terminal_asset_monitoring_low_priority');

  return {
    stablecoin_id: stablecoin.id,
    name: stablecoin.name,
    symbol: stablecoin.symbol ?? null,
    status: stablecoin.status,
    classification,
    classification_reason: classificationReason,
    related_organization_ids: organizationIds,
    evidence_counts: {
      relevant: relevantEvidence.length,
      official: officialEvidence.length,
      current_fetchable_official: currentOfficialEvidence.length,
      direct_current_official: directCurrentOfficialEvidence.length
    },
    current_source_families: currentFamilies,
    all_official_source_families: allOfficialFamilies,
    blocking_gaps: unique(blockingGaps),
    recommended_next_scope: classification === 'automatically_monitorable'
      ? 'phase_b_source_registration'
      : classification === 'partially_monitorable'
        ? 'manual_source_review_before_registration'
        : classification === 'manual_review_only'
          ? 'retain_manual_review_workflow'
          : 'research_official_source_or_keep_unmonitored',
    canonical_action: 'none'
  };
}

export function buildMonitoringFeasibilityAudit(root = process.cwd()) {
  const baseline = loadRegistryV2Baseline(root);
  const stablecoins = loadGroup(root, baseline, 'stablecoins');
  const evidence = loadGroup(root, baseline, 'evidence');
  const relationships = loadGroup(root, baseline, 'relationships');
  const records = stablecoins
    .map((stablecoin) => buildRecord(stablecoin, evidence, relationships))
    .sort((a, b) => a.stablecoin_id.localeCompare(b.stablecoin_id));

  const classificationCounts = Object.fromEntries(
    FEASIBILITY_CLASSIFICATIONS.map((classification) => [
      classification,
      records.filter((record) => record.classification === classification).length
    ])
  );

  return {
    schema_version: '1.0',
    audit_id: 'sog_monitoring_feasibility_92_v1',
    generated_from: 'canonical_registry_v2',
    record_count: records.length,
    classification_counts: classificationCounts,
    policy: {
      canonical_action: 'none',
      source_registration: false,
      network_access: false,
      public_output: false,
      production_publication: false
    },
    records
  };
}

function reportText(audit) {
  const lines = [
    '# SOG Monitoring Feasibility Audit',
    '',
    '> Generated from canonical Registry v2 data. Classification is operational feasibility, not a quality or risk score.',
    '',
    '## Counts',
    ''
  ];
  for (const classification of FEASIBILITY_CLASSIFICATIONS) {
    lines.push(`- ${classification}: ${audit.classification_counts[classification]}`);
  }
  lines.push('', '## Records', '');
  for (const record of audit.records) {
    lines.push(`- ${record.stablecoin_id} — ${record.name} (${record.symbol ?? 'n/a'}): \`${record.classification}\` — ${record.classification_reason}`);
  }
  lines.push('', 'Canonical action: none. Source registration: false. Public output: false. Production publication: false.', '');
  return lines.join('\n');
}

function main() {
  const root = process.cwd();
  const audit = buildMonitoringFeasibilityAudit(root);
  const outputDirectory = path.join(root, 'data-staging/monitoring-feasibility');
  fs.mkdirSync(outputDirectory, { recursive: true });
  fs.writeFileSync(path.join(outputDirectory, 'monitoring-feasibility.json'), `${JSON.stringify(audit, null, 2)}\n`);
  fs.writeFileSync(path.join(outputDirectory, 'monitoring-feasibility.md'), `${reportText(audit)}\n`);
  console.log(JSON.stringify({
    record_count: audit.record_count,
    classification_counts: audit.classification_counts,
    output_directory: outputDirectory
  }, null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
