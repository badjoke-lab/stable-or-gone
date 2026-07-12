import crypto from 'node:crypto';

const LIFECYCLE_GROUPS = {
  operating: ['active'],
  constrained: ['restricted', 'suspended', 'winding_down'],
  historical_non_failure: ['inactive', 'terminated', 'migrated', 'rebranded'],
  failed: ['collapsed'],
  other: ['announced', 'unknown']
};

const UNKNOWN_TEXT = new Set(['', 'unknown', 'source_review_needed', 'not_recorded', 'not_known', 'unclear', null, undefined]);

const sortObject = (value) => Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)));
const pct = (count, denominator) => denominator ? Number(((count / denominator) * 100).toFixed(2)) : 0;

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function dist(values, denominator = values.length) {
  const counts = {};
  for (const value of values) {
    const key = value === null || value === undefined || value === '' ? 'unknown' : String(value);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return Object.fromEntries(Object.entries(sortObject(counts)).map(([key, count]) => [key, { count, percentage: pct(count, denominator) }]));
}

function multiDist(rows, getValues, denominator) {
  const values = [];
  for (const row of rows) for (const value of getValues(row) ?? []) values.push(value ?? 'unknown');
  return dist(values, denominator);
}

function coverage(count, denominator) {
  return { count, denominator, percentage: pct(count, denominator) };
}

function median(values) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : Number(((sorted[mid - 1] + sorted[mid]) / 2).toFixed(2));
}

function yearOf(value) {
  if (!value || !/^\d{4}/.test(value)) return 'unknown';
  return value.slice(0, 4);
}

function lifecycleGroup(status) {
  for (const [group, statuses] of Object.entries(LIFECYCLE_GROUPS)) if (statuses.includes(status)) return group;
  return 'other';
}

function lifecycleTransitions(statuses) {
  const count = (status) => statuses.filter((value) => value === status).length;
  return {
    migrations: count('migrated'),
    rebrands: count('rebranded'),
    orderly_wind_downs: count('winding_down'),
    terminations: count('terminated'),
    inactive_unresolved: count('inactive'),
    collapses: count('collapsed')
  };
}

function recencyBand(dateValue, generatedAt) {
  if (!dateValue || !Number.isFinite(Date.parse(dateValue))) return 'unknown';
  const days = Math.max(0, Math.floor((Date.parse(generatedAt) - Date.parse(dateValue)) / 86_400_000));
  if (days <= 30) return '0_30_days';
  if (days <= 90) return '31_90_days';
  if (days <= 180) return '91_180_days';
  if (days <= 365) return '181_365_days';
  return '366_plus_days';
}

function eventYears(events) {
  const byYear = new Map();
  for (const event of events) {
    const year = yearOf(event.event_date);
    const bucket = byYear.get(year) ?? { total: 0, event_types: {} };
    bucket.total += 1;
    bucket.event_types[event.event_type ?? 'unknown'] = (bucket.event_types[event.event_type ?? 'unknown'] ?? 0) + 1;
    byYear.set(year, bucket);
  }
  return Object.fromEntries([...byYear.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([year, row]) => [year, { total: row.total, event_types: sortObject(row.event_types) }]));
}

function deploymentStats(deployments) {
  const chains = new Map();
  for (const deployment of deployments) {
    const chain = deployment.chain || 'unknown';
    const row = chains.get(chain) ?? { deployment_count: 0, asset_ids: new Set() };
    row.deployment_count += 1;
    if (deployment.stablecoin_id) row.asset_ids.add(deployment.stablecoin_id);
    chains.set(chain, row);
  }
  const byChain = Object.fromEntries([...chains.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([chain, row]) => [chain, { asset_count: row.asset_ids.size, deployment_count: row.deployment_count }]));
  return {
    total_deployments: deployments.length,
    assets_with_deployments: new Set(deployments.map((row) => row.stablecoin_id).filter(Boolean)).size,
    by_chain: byChain,
    canonicality: dist(deployments.map((row) => row.canonicality ?? 'unknown')),
    deployment_type: dist(deployments.map((row) => row.deployment_type ?? 'unknown')),
    verification_status: dist(deployments.map((row) => row.verification_status ?? 'unknown')),
    control_capability_knowledge: {
      freeze_capability_known: deployments.filter((row) => row.freeze_capability !== undefined && row.freeze_capability !== null && row.freeze_capability !== 'unknown').length,
      blacklist_capability_known: deployments.filter((row) => row.blacklist_capability !== undefined && row.blacklist_capability !== null && row.blacklist_capability !== 'unknown').length,
      control_capability_unknown: deployments.filter((row) => ['unknown', null, undefined].includes(row.control_capability)).length
    }
  };
}

function organizationStats(organizations, relationships) {
  const roles = {};
  for (const relationship of relationships) {
    const role = relationship.role ?? 'unknown';
    const bucket = roles[role] ?? { relationship_count: 0, organization_ids: new Set(), asset_ids: new Set() };
    bucket.relationship_count += 1;
    if (relationship.organization_id) bucket.organization_ids.add(relationship.organization_id);
    if (relationship.stablecoin_id) bucket.asset_ids.add(relationship.stablecoin_id);
    roles[role] = bucket;
  }
  return {
    total_organizations: organizations.length,
    total_relationships: relationships.length,
    by_role: Object.fromEntries(Object.entries(roles).sort(([a], [b]) => a.localeCompare(b)).map(([role, row]) => [role, {
      relationship_count: row.relationship_count,
      organization_count: row.organization_ids.size,
      asset_count: row.asset_ids.size
    }]))
  };
}

function qualityStats(input, generatedAt) {
  const total = input.stablecoins.length;
  const assetIds = new Set(input.stablecoins.map((row) => row.id));
  const evidenceCounts = new Map([...assetIds].map((id) => [id, 0]));
  for (const row of input.evidence) if (evidenceCounts.has(row.stablecoin_id)) evidenceCounts.set(row.stablecoin_id, evidenceCounts.get(row.stablecoin_id) + 1);
  const evidenceDepth = [...evidenceCounts.values()];
  const deploymentAssets = new Set(input.deployments.map((row) => row.stablecoin_id).filter(Boolean));
  const relationshipAssets = new Set(input.stable_asset_relationships.flatMap((row) => [row.from_asset_id, row.to_asset_id]).filter(Boolean));
  const componentAssets = new Set(input.reserve_components.map((row) => row.stablecoin_id).filter(Boolean));
  const archiveEvidence = input.evidence.filter((row) => row.archived_url || String(row.url ?? '').includes('web.archive.org')).length;
  const highSeverityUnknowns = input.known_unknowns.filter((row) => ['high', 'critical'].includes(row.severity)).length;
  const highSeverityUnknownAssets = new Set(input.known_unknowns.filter((row) => ['high', 'critical'].includes(row.severity)).map((row) => row.stablecoin_id).filter(Boolean)).size;

  return {
    coverage: {
      classification: coverage(new Set(input.classifications.map((row) => row.id)).size, total),
      reserve_redemption_profile: coverage(new Set(input.profiles.map((row) => row.id)).size, total),
      legal_profile: coverage(new Set(input.legal_profiles.map((row) => row.id)).size, total),
      deployment: coverage(deploymentAssets.size, total),
      stable_asset_relationship: coverage(relationshipAssets.size, total),
      reserve_component: coverage(componentAssets.size, total),
      archive_evidence: coverage(archiveEvidence, input.evidence.length)
    },
    evidence_per_asset: {
      average: Number((evidenceDepth.reduce((sum, value) => sum + value, 0) / total).toFixed(2)),
      median: median(evidenceDepth),
      distribution: dist(evidenceDepth.map((count) => count === 0 ? '0' : count === 1 ? '1' : count <= 4 ? '2_4' : '5_plus'), total)
    },
    known_unknowns: {
      total: input.known_unknowns.length,
      high_or_critical_count: highSeverityUnknowns,
      assets_with_high_or_critical: highSeverityUnknownAssets
    },
    verification_recency: dist(input.stablecoins.map((row) => recencyBand(row.last_verified_at, generatedAt)), total),
    typed_event_details: coverage(new Set(input.event_details.map((row) => row.id)).size, input.events.length)
  };
}

export function buildStatsModel(input, options = {}) {
  const generatedAt = options.generatedAt ?? `${input.checkpoint.recorded_at}T00:00:00.000Z`;
  const registryVersion = options.registryVersion ?? input.checkpoint.source_commit;
  const totalAssets = input.stablecoins.length;
  const classificationById = new Map(input.classifications.map((row) => [row.id, row]));
  const stablecoinById = new Map(input.stablecoins.map((row) => [row.id, row]));
  const lifecycleStatuses = input.classifications.map((row) => row.lifecycle_status ?? 'unknown');
  const lifecycleGroups = lifecycleStatuses.map(lifecycleGroup);
  const failedIds = new Set(input.classifications.filter((row) => lifecycleGroup(row.lifecycle_status ?? 'unknown') === 'failed').map((row) => row.id));
  const failedClassifications = input.classifications.filter((row) => failedIds.has(row.id));
  const collapseYearByAsset = {};
  for (const event of input.events.filter((row) => row.event_type === 'collapse' && failedIds.has(row.stablecoin_id))) collapseYearByAsset[event.stablecoin_id] = yearOf(event.event_date);

  const depegDetails = input.event_details.filter((row) => row.event_detail_kind === 'depeg');
  const legalClassifications = input.legal_profiles.flatMap((row) => (row.classifications ?? []).map((entry) => entry.classification ?? 'unknown'));
  const profileById = new Map(input.profiles.map((row) => [row.id, row]));

  const stats = {
    schema_version: '1.0',
    generated_at: generatedAt,
    registry_version: registryVersion,
    checkpoint_id: input.checkpoint.checkpoint_id,
    totals: {
      assets: totalAssets,
      organizations: input.organizations.length,
      relationships: input.relationships.length,
      events: input.events.length,
      evidence: input.evidence.length,
      reserve_reports: input.reserve_reports.length,
      known_unknowns: input.known_unknowns.length,
      regulatory_notes: input.regulatory_notes.length,
      deployments: input.deployments.length,
      market_access_records: input.market_access_records.length,
      legal_profiles: input.legal_profiles.length,
      stable_asset_relationships: input.stable_asset_relationships.length,
      reserve_components: input.reserve_components.length,
      income_profiles: input.income_profiles.length
    },
    lifecycle: {
      groups: dist(lifecycleGroups, totalAssets),
      statuses: dist(lifecycleStatuses, totalAssets),
      transitions: lifecycleTransitions(lifecycleStatuses),
      group_definitions: LIFECYCLE_GROUPS
    },
    classification: {
      asset_class: dist(input.classifications.map((row) => row.asset_class ?? 'unknown'), totalAssets),
      reference_target: dist(input.classifications.map((row) => row.reference_target ?? row.peg_reference?.kind ?? 'unknown'), totalAssets),
      fiat_currency: dist(input.classifications.filter((row) => (row.reference_target ?? row.peg_reference?.kind) === 'fiat').map((row) => row.peg_reference?.asset ?? 'unknown')),
      backing_type: multiDist(input.classifications, (row) => row.backing_types?.length ? row.backing_types : ['unknown'], totalAssets),
      stabilization_mechanism: dist(input.classifications.map((row) => row.stabilization_mechanism ?? 'unknown'), totalAssets),
      governance_model: dist(input.classifications.map((row) => row.governance_model ?? 'unknown'), totalAssets),
      legal_classification: dist(legalClassifications, input.legal_profiles.length)
    },
    issuance: {
      status: dist(input.classifications.map((row) => row.issuance_status ?? 'unknown'), totalAssets)
    },
    redemption: {
      status: dist(input.profiles.map((row) => row.redemption_profile?.status ?? 'unknown'), totalAssets),
      retail_access: dist(input.profiles.map((row) => row.redemption_profile?.retail_access ?? 'unknown'), totalAssets),
      institutional_access: dist(input.profiles.map((row) => row.redemption_profile?.institutional_access ?? 'unknown'), totalAssets),
      minimum_amount_knowledge: dist(input.profiles.map((row) => UNKNOWN_TEXT.has(row.redemption_profile?.minimum_amount_text) || String(row.redemption_profile?.minimum_amount_text ?? '').toLowerCase().includes('source review') ? 'unknown' : 'recorded'), totalAssets),
      jurisdiction_restrictions: dist(input.profiles.map((row) => Array.isArray(row.redemption_profile?.jurisdiction_restrictions) && row.redemption_profile.jurisdiction_restrictions.length > 0 ? 'recorded' : 'none_recorded'), totalAssets),
      holder_claim_type: dist(input.legal_profiles.map((row) => row.holder_claim_type ?? 'unknown'), totalAssets)
    },
    yield: {
      availability: dist(input.income_profiles.map((row) => row.availability ?? 'unknown'), totalAssets),
      source: dist(input.income_profiles.map((row) => row.source ?? 'unknown'), totalAssets),
      accrual: dist(input.income_profiles.map((row) => row.accrual ?? 'unknown'), totalAssets),
      rate_type: dist(input.income_profiles.map((row) => row.rate ?? 'unknown'), totalAssets)
    },
    events: {
      by_year: eventYears(input.events),
      by_type: dist(input.events.map((row) => row.event_type ?? 'unknown')),
      detail_kind: dist(input.event_details.map((row) => row.event_detail_kind ?? 'unknown')),
      depeg_outcomes: dist(depegDetails.map((row) => row.depeg_detail?.recovery_status ?? 'unknown'))
    },
    failures: {
      count: failedIds.size,
      by_stabilization_mechanism: dist(failedClassifications.map((row) => row.stabilization_mechanism ?? 'unknown'), failedIds.size),
      by_backing_type: multiDist(failedClassifications, (row) => row.backing_types?.length ? row.backing_types : ['unknown'], failedIds.size),
      by_governance_model: dist(failedClassifications.map((row) => row.governance_model ?? 'unknown'), failedIds.size),
      by_launch_year: dist([...failedIds].map((id) => yearOf(stablecoinById.get(id)?.launch_date)), failedIds.size),
      by_collapse_year: dist([...failedIds].map((id) => collapseYearByAsset[id] ?? 'unknown'), failedIds.size)
    },
    deployments: deploymentStats(input.deployments),
    organizations: organizationStats(input.organizations, input.relationships),
    data_quality: qualityStats(input, generatedAt),
    methodology: {
      denominators: {
        assets: totalAssets,
        organizations: input.organizations.length,
        events: input.events.length,
        evidence: input.evidence.length,
        deployments: input.deployments.length,
        market_access_records: input.market_access_records.length,
        legal_profiles: input.legal_profiles.length,
        income_profiles: input.income_profiles.length
      },
      multi_select_dimensions: ['classification.backing_type', 'failures.by_backing_type', 'organizations.by_role'],
      excluded_live_metrics: ['price', 'market_cap', 'apy', 'yield_ranking', 'safety_score', 'risk_score'],
      unknown_values_preserved: true,
      candidate_monitoring_private_inputs_excluded: true
    }
  };

  stats.input_digest_sha256 = sha256(JSON.stringify({
    checkpoint: input.checkpoint.canonical_content_sha256,
    totals: stats.totals,
    lifecycle_statuses: [...lifecycleStatuses].sort(),
    classification_ids: input.classifications.map((row) => row.id),
    event_ids: input.events.map((row) => row.id),
    evidence_ids: input.evidence.map((row) => row.id),
    deployment_ids: input.deployments.map((row) => row.id),
    market_access_record_ids: input.market_access_records.map((row) => row.id),
    legal_profile_ids: input.legal_profiles.map((row) => row.id),
    income_profile_ids: input.income_profiles.map((row) => row.id)
  }));

  for (const [id] of profileById) if (!classificationById.has(id)) throw new Error(`Profile without classification: ${id}`);
  return stats;
}

export { LIFECYCLE_GROUPS };
