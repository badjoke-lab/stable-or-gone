import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const reportPath = 'docs/audits/registry-70-final-audit.md';
const jsonPath = 'data/generated/registry-integrity-audit.json';
const critical = [];
const warnings = [];
const observations = [];

const absolute = (relativePath) => path.join(root, relativePath);
const readJson = (relativePath) => JSON.parse(fs.readFileSync(absolute(relativePath), 'utf8'));
const serialize = (value) => `${JSON.stringify(value, null, 2)}\n`;
const normalize = (value) => String(value ?? '').normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, '');
const dateValue = (value) => value ? Date.parse(`${value}T00:00:00Z`) : Number.NaN;
const loadFiles = (files = []) => files.flatMap((file) => {
  const rows = readJson(file);
  if (!Array.isArray(rows)) throw new Error(`${file} must contain an array`);
  return rows.map((row) => ({ ...row, __source_file: file }));
});
const groupBy = (rows, keyFn) => {
  const map = new Map();
  for (const row of rows) {
    const key = keyFn(row);
    if (!key) continue;
    const list = map.get(key) ?? [];
    list.push(row);
    map.set(key, list);
  }
  return map;
};
const duplicateValues = (rows, field, transform = (value) => value) =>
  [...groupBy(rows, (row) => row[field] ? transform(row[field]) : null).entries()].filter(([, items]) => items.length > 1);
const coveredIds = (rows, stablecoinIds) => {
  const result = new Set();
  for (const row of rows) {
    const candidates = [];
    if (typeof row.id === 'string' && stablecoinIds.has(row.id)) candidates.push(row.id);
    if (typeof row.stablecoin_id === 'string') candidates.push(row.stablecoin_id);
    if (Array.isArray(row.stablecoin_ids)) candidates.push(...row.stablecoin_ids);
    if (Array.isArray(row.subject_stablecoin_ids)) candidates.push(...row.subject_stablecoin_ids);
    for (const id of candidates) if (stablecoinIds.has(id)) result.add(id);
  }
  return result;
};
const validateIds = (owner, ids, known, label) => {
  for (const id of ids ?? []) if (!known.has(id)) critical.push(`${owner} references missing ${label} ${id}`);
};

const baseline = readJson('docs/migration/registry-v2-baseline.json');
const foundation = readJson('docs/migration/registry-v3-foundation.json');
const incomeManifest = readJson('docs/migration/registry-v3-income-profiles.json');
const candidateContract = readJson('docs/growth/candidate-master-70.json');
const generatedStats = readJson('data/generated/registry-stats.json');
const auditDate = baseline.captured_at;
const groups = Object.fromEntries(Object.entries(baseline.data_groups).map(([name, files]) => [name, loadFiles(files)]));
const v3 = Object.fromEntries(Object.entries(foundation.data_groups).map(([name, files]) => [name, loadFiles(files)]));
const incomeProfiles = loadFiles(incomeManifest.data_files);
const candidatesBase = loadFiles(candidateContract.candidate_files);
const promotionFiles = fs.readdirSync(absolute('data'))
  .filter((name) => /^candidate-promotions-batch-[a-z0-9-]+\.json$/.test(name))
  .sort()
  .map((name) => `data/${name}`);
const promotionRows = loadFiles(promotionFiles);
const promotionByCandidate = new Map();
for (const row of promotionRows) {
  if (promotionByCandidate.has(row.candidate_id)) critical.push(`Duplicate promotion patch for ${row.candidate_id}`);
  promotionByCandidate.set(row.candidate_id, row);
}
const candidates = candidatesBase.map((row) => ({ ...row, ...(promotionByCandidate.get(row.candidate_id) ?? {}) }));

const stablecoins = groups.stablecoins;
const organizations = groups.organizations;
const relationships = groups.relationships;
const classifications = groups.classifications;
const profiles = groups.profiles;
const events = groups.events;
const eventDetails = groups.event_details;
const evidence = groups.evidence;
const reserveReports = groups.reserve_reports;
const knownUnknowns = groups.known_unknowns;
const deployments = groups.deployments;
const legalProfiles = v3.legal_profiles;
const reserveComponents = v3.reserve_components;
const assetRelationships = v3.stable_asset_relationships;

const stablecoinIds = new Set(stablecoins.map((row) => row.id));
const organizationIds = new Set(organizations.map((row) => row.id));
const eventIds = new Set(events.map((row) => row.id));
const evidenceIds = new Set(evidence.map((row) => row.id));

const uniqueChecks = [
  ['stablecoin id', stablecoins, 'id'], ['stablecoin slug', stablecoins, 'slug'],
  ['organization id', organizations, 'id'], ['organization slug', organizations, 'slug'],
  ['relationship id', relationships, 'id'], ['event id', events, 'id'],
  ['evidence id', evidence, 'id'], ['reserve report id', reserveReports, 'id'],
  ['known unknown id', knownUnknowns, 'id'], ['deployment id', deployments, 'id'],
  ['legal profile id', legalProfiles, 'id'], ['reserve component id', reserveComponents, 'id'],
  ['income profile id', incomeProfiles, 'id']
];
for (const [label, rows, field] of uniqueChecks) {
  for (const [value, items] of duplicateValues(rows, field)) {
    critical.push(`Duplicate ${label} ${value}: ${items.map((row) => row.__source_file).join(', ')}`);
  }
}
for (const [key, items] of duplicateValues(stablecoins, 'name', normalize)) {
  critical.push(`Canonical-name collision ${key}: ${items.map((row) => `${row.id} (${row.name})`).join(', ')}`);
}

const identityOwners = new Map();
for (const coin of stablecoins) {
  for (const value of [coin.name, ...(coin.aliases ?? [])]) {
    const key = normalize(value);
    if (!key || key.length < 4 || key === normalize(coin.symbol)) continue;
    const owners = identityOwners.get(key) ?? new Set();
    owners.add(coin.id);
    identityOwners.set(key, owners);
  }
}
for (const [key, owners] of identityOwners) {
  if (owners.size > 1) warnings.push(`Name/alias token ${key} is shared by ${[...owners].join(', ')}`);
}

const classificationById = new Map(classifications.map((row) => [row.id, row]));
const compatibility = {
  active: new Set(['active']), limited: new Set(['restricted']), impaired: new Set(['restricted', 'suspended']),
  discontinued: new Set(['winding_down', 'inactive', 'terminated']), failed: new Set(['collapsed']),
  rebranded: new Set(['rebranded']), migrated: new Set(['migrated']), unknown: new Set(['unknown'])
};
for (const coin of stablecoins) {
  const classification = classificationById.get(coin.id);
  if (!classification) critical.push(`${coin.id} has no classification`);
  else if (coin.status && classification.lifecycle_status && !compatibility[coin.status]?.has(classification.lifecycle_status)) {
    critical.push(`${coin.id} legacy status ${coin.status} conflicts with lifecycle ${classification.lifecycle_status}`);
  }
}

const relationByStablecoin = groupBy(relationships, (row) => row.stablecoin_id);
for (const row of relationships) {
  if (!stablecoinIds.has(row.stablecoin_id)) critical.push(`${row.id} references missing stablecoin ${row.stablecoin_id}`);
  if (!organizationIds.has(row.organization_id)) critical.push(`${row.id} references missing organization ${row.organization_id}`);
  validateIds(row.id, row.evidence_ids, evidenceIds, 'evidence');
}
for (const coin of stablecoins) {
  const rows = relationByStablecoin.get(coin.id) ?? [];
  if (!rows.length) critical.push(`${coin.id} has no organization relationship`);
  if (coin.issuer_id && !rows.some((row) => row.organization_id === coin.issuer_id)) {
    critical.push(`${coin.id} issuer_id ${coin.issuer_id} is absent from relationships`);
  }
}

const eventDetailById = new Map(eventDetails.map((row) => [row.id, row]));
for (const event of events) {
  const detail = eventDetailById.get(event.id);
  if (!detail) critical.push(`${event.id} has no Event v2 detail`);
  validateIds(event.id, event.subject_stablecoin_ids, stablecoinIds, 'stablecoin');
  validateIds(event.id, event.subject_organization_ids, organizationIds, 'organization');
  validateIds(event.id, event.evidence_ids, evidenceIds, 'evidence');
}
for (const detail of eventDetails) {
  if (!eventIds.has(detail.id)) critical.push(`${detail.id} is an orphan event detail`);
  validateIds(detail.id, detail.subject_stablecoin_ids, stablecoinIds, 'stablecoin');
  validateIds(detail.id, detail.subject_organization_ids, organizationIds, 'organization');
  validateIds(detail.id, detail.evidence_ids, evidenceIds, 'evidence');
}

const evidenceByStablecoin = new Map();
for (const row of evidence) {
  const stablecoinRefs = [...new Set([row.stablecoin_id, ...(row.stablecoin_ids ?? [])].filter(Boolean))];
  const organizationRefs = [...new Set([row.issuer_id, ...(row.organization_ids ?? [])].filter(Boolean))];
  const eventRefs = [...new Set([row.event_id, ...(row.event_ids ?? [])].filter(Boolean))];
  validateIds(row.id, stablecoinRefs, stablecoinIds, 'stablecoin');
  validateIds(row.id, organizationRefs, organizationIds, 'organization');
  validateIds(row.id, eventRefs, eventIds, 'event');
  try { new URL(row.url); } catch { critical.push(`${row.id} has invalid URL ${row.url}`); }
  for (const id of stablecoinRefs) evidenceByStablecoin.set(id, (evidenceByStablecoin.get(id) ?? 0) + 1);
}
for (const coin of stablecoins) if (!(evidenceByStablecoin.get(coin.id) > 0)) critical.push(`${coin.id} has no direct evidence coverage`);

for (const event of events) {
  const direct = evidence.filter((row) => row.event_id === event.id || row.event_ids?.includes(event.id)).map((row) => row.id);
  const detailed = eventDetailById.get(event.id)?.evidence_ids ?? [];
  const actual = new Set([...direct, ...detailed]).size;
  if (Number.isInteger(event.source_count) && actual !== event.source_count) {
    warnings.push(`${event.id} source_count=${event.source_count}, linked evidence=${actual}`);
  }
}

const allCoverage = {
  classifications: coveredIds(classifications, stablecoinIds),
  profiles: coveredIds(profiles, stablecoinIds),
  relationships: coveredIds(relationships, stablecoinIds),
  evidence: new Set(evidenceByStablecoin.keys()),
  reserve_reports: coveredIds(reserveReports, stablecoinIds),
  known_unknowns: coveredIds(knownUnknowns, stablecoinIds),
  deployments: coveredIds(deployments, stablecoinIds),
  events: coveredIds(events, stablecoinIds),
  legal_profiles: coveredIds(legalProfiles, stablecoinIds),
  reserve_components: coveredIds(reserveComponents, stablecoinIds),
  income_profiles: coveredIds(incomeProfiles, stablecoinIds)
};
const requiredCoverage = new Set([
  'classifications', 'profiles', 'relationships', 'evidence', 'known_unknowns',
  'legal_profiles', 'reserve_components', 'income_profiles'
]);
const informationalCoverage = new Set(['reserve_reports']);
const coverageExpectation = (label) => requiredCoverage.has(label)
  ? 'required'
  : informationalCoverage.has(label)
    ? 'informational'
    : 'optional_review';
for (const [label, covered] of Object.entries(allCoverage)) {
  for (const id of covered) if (!stablecoinIds.has(id)) critical.push(`${label} contains orphan ${id}`);
  const missing = [...stablecoinIds].filter((id) => !covered.has(id));
  if (requiredCoverage.has(label)) {
    for (const id of missing) critical.push(`${label} coverage is missing ${id}`);
  } else if (missing.length && informationalCoverage.has(label)) {
    observations.push(`${label} context coverage is ${covered.size}/${stablecoinIds.size}; this publication-specific layer is informational and is not expected for every asset. Missing: ${missing.join(', ')}.`);
  } else if (missing.length) {
    warnings.push(`${label} coverage ${covered.size}/${stablecoinIds.size}; missing ${missing.join(', ')}`);
  }
  const statsCoverage = generatedStats.coverage?.[label];
  if (statsCoverage && (statsCoverage.covered !== covered.size || statsCoverage.total !== stablecoinIds.size)) {
    critical.push(`Generated stats coverage.${label}=${statsCoverage.covered}/${statsCoverage.total}, actual=${covered.size}/${stablecoinIds.size}`);
  }
}

for (const row of deployments) {
  if (!stablecoinIds.has(row.stablecoin_id)) critical.push(`${row.id} deployment references missing stablecoin ${row.stablecoin_id}`);
  validateIds(row.id, row.evidence_ids, evidenceIds, 'evidence');
}
for (const row of reserveReports) {
  if (row.stablecoin_id && !stablecoinIds.has(row.stablecoin_id)) critical.push(`${row.id} reserve report references missing stablecoin ${row.stablecoin_id}`);
  try { if (row.url) new URL(row.url); } catch { critical.push(`${row.id} has invalid URL ${row.url}`); }
}
for (const row of knownUnknowns) {
  if (row.stablecoin_id && !stablecoinIds.has(row.stablecoin_id)) critical.push(`${row.id} known unknown references missing stablecoin ${row.stablecoin_id}`);
}
for (const row of legalProfiles) validateIds(row.id, row.evidence_ids, evidenceIds, 'evidence');
for (const row of reserveComponents) {
  if (!stablecoinIds.has(row.stablecoin_id)) critical.push(`${row.id} reserve component references missing stablecoin ${row.stablecoin_id}`);
  validateIds(row.id, row.evidence_ids, evidenceIds, 'evidence');
}
for (const row of incomeProfiles) validateIds(row.id, row.evidence_ids, evidenceIds, 'evidence');
for (const row of assetRelationships) {
  if (!stablecoinIds.has(row.from_asset_id)) critical.push(`${row.id} references missing from asset ${row.from_asset_id}`);
  if (!stablecoinIds.has(row.to_asset_id)) critical.push(`${row.id} references missing to asset ${row.to_asset_id}`);
  validateIds(row.id, row.evidence_ids, evidenceIds, 'evidence');
}

const canonicalById = new Map(stablecoins.map((row) => [row.id, row]));
const promoted = candidates.filter((row) => row.status === 'promoted');
const promotedByRecord = new Map();
for (const row of promoted) {
  if (promotedByRecord.has(row.proposed_record_id)) critical.push(`Multiple promoted candidates map to ${row.proposed_record_id}`);
  promotedByRecord.set(row.proposed_record_id, row);
  const coin = canonicalById.get(row.proposed_record_id);
  if (!coin) critical.push(`${row.candidate_id} is promoted but canonical record ${row.proposed_record_id} is missing`);
  else {
    if (coin.slug !== row.slug) critical.push(`${row.candidate_id} slug differs from canonical ${coin.slug}`);
    if (normalize(coin.name) !== normalize(row.name)) critical.push(`${row.candidate_id} name differs from canonical ${coin.name}`);
    if (normalize(coin.symbol) !== normalize(row.symbol)) critical.push(`${row.candidate_id} symbol differs from canonical ${coin.symbol}`);
  }
}
for (const coin of stablecoins) if (!promotedByRecord.has(coin.id)) critical.push(`${coin.id} has no promoted Candidate Master entry`);
if (promoted.length !== stablecoins.length) critical.push(`Promoted candidate count ${promoted.length} differs from canonical count ${stablecoins.length}`);

const expectedCounts = {
  stablecoins: stablecoins.length, organizations: organizations.length, relationships: relationships.length,
  classifications: classifications.length, profiles: profiles.length, events: events.length,
  event_details: eventDetails.length, evidence: evidence.length, reserve_reports: reserveReports.length,
  known_unknowns: knownUnknowns.length, regulatory_notes: groups.regulatory_notes.length,
  deployments: deployments.length, legal_profiles: legalProfiles.length,
  stable_asset_relationships: assetRelationships.length, reserve_components: reserveComponents.length,
  income_profiles: incomeProfiles.length
};
for (const [key, actual] of Object.entries(expectedCounts)) {
  if (generatedStats.registry?.[key] !== actual) critical.push(`Generated stats ${key}=${generatedStats.registry?.[key]}, actual=${actual}`);
  if (baseline.minimum_counts?.[key] !== undefined && actual < baseline.minimum_counts[key]) {
    critical.push(`Baseline minimum ${key}=${baseline.minimum_counts[key]} exceeds actual=${actual}`);
  }
}
if (generatedStats.baseline_id !== baseline.baseline_id) {
  critical.push(`Generated stats baseline_id ${generatedStats.baseline_id} differs from ${baseline.baseline_id}`);
}

const now = dateValue(auditDate);
const stale = stablecoins.filter((row) => !Number.isFinite(dateValue(row.last_verified_at)) || now - dateValue(row.last_verified_at) > 365 * 86400000);
const missingLaunch = stablecoins.filter((row) => !row.launch_date);
const terminalLifecycleStatuses = new Set(['collapsed', 'inactive', 'terminated', 'migrated', 'rebranded']);
const missingEnd = stablecoins.filter((row) => {
  const lifecycle = classificationById.get(row.id)?.lifecycle_status;
  return terminalLifecycleStatuses.has(lifecycle) && !row.discontinued_date;
});
const unknownIncome = incomeProfiles.filter((row) => [row.availability, row.source, row.accrual, row.rate].every((value) => value === 'unknown'));
const sortedIds = (rows) => rows.map((row) => row.id).sort();
const staleIds = sortedIds(stale);
const missingLaunchIds = sortedIds(missingLaunch);
const missingEndIds = sortedIds(missingEnd);
const unknownIncomeIds = sortedIds(unknownIncome);
observations.push(`${stale.length} records have missing or older-than-one-year last_verified_at values: ${staleIds.join(', ') || 'none'}.`);
observations.push(`${missingLaunch.length} records have no launch_date: ${missingLaunchIds.join(', ') || 'none'}.`);
observations.push(`${missingEnd.length} historical-side records have no discontinued_date: ${missingEndIds.join(', ') || 'none'}.`);
observations.push(`${unknownIncome.length} income profiles remain entirely unknown: ${unknownIncomeIds.join(', ') || 'none'}.`);

const summary = {
  audited_at: auditDate,
  baseline_id: baseline.baseline_id,
  counts: expectedCounts,
  coverage: Object.fromEntries(Object.entries(allCoverage).map(([label, covered]) => [label, {
    covered: covered.size,
    total: stablecoinIds.size,
    required: requiredCoverage.has(label),
    expectation: coverageExpectation(label)
  }])),
  candidate_promotions: { total: candidates.length, promoted: promoted.length, pending: candidates.length - promoted.length },
  identity: {
    canonical_name_collisions: critical.filter((value) => value.startsWith('Canonical-name collision')).length,
    alias_collision_warnings: warnings.filter((value) => value.startsWith('Name/alias token')).length
  },
  quality: {
    stale_or_missing_last_verified: stale.length,
    stale_or_missing_last_verified_ids: staleIds,
    missing_launch_date: missingLaunch.length,
    missing_launch_date_ids: missingLaunchIds,
    historical_missing_discontinued_date: missingEnd.length,
    historical_missing_discontinued_date_ids: missingEndIds,
    all_unknown_income_profiles: unknownIncome.length,
    all_unknown_income_profile_ids: unknownIncomeIds,
    reserve_report_context_coverage: {
      covered: allCoverage.reserve_reports.size,
      total: stablecoinIds.size
    }
  },
  findings: { critical, warnings, observations }
};

const section = (title, rows, empty) => [`## ${title}`, '', ...(rows.length ? rows.map((row) => `- ${row}`) : [`- ${empty}`]), ''].join('\n');
const markdown = [
  '# SOG 70-Record Final Registry Audit', '',
  `- Audited at: ${auditDate}`,
  `- Baseline: \`${baseline.baseline_id}\``,
  `- Canonical stable assets: **${stablecoins.length}**`,
  `- Promoted candidates: **${promoted.length} / ${candidates.length}**`,
  `- Critical findings: **${critical.length}**`,
  `- Warnings: **${warnings.length}**`, '',
  '## Scope', '',
  '- Canonical identity uniqueness and candidate-to-record mapping',
  '- Legacy status and Registry v2 lifecycle compatibility',
  '- Organization, event, evidence, deployment, and Registry v3 references',
  '- Full-record coverage across required Registry v2/v3 layers',
  '- Required, optional-review, and informational coverage visibility',
  '- Generated registry statistics consistency',
  '- Date freshness and explicit known-unknown inventory', '',
  '## Registry Counts', '',
  '| Layer | Count |', '|---|---:|',
  ...Object.entries(expectedCounts).map(([key, value]) => `| ${key} | ${value} |`), '',
  '## Coverage', '',
  '| Layer | Covered | Expectation |', '|---|---:|---|',
  ...Object.entries(allCoverage).map(([label, covered]) => `| ${label} | ${covered.size} / ${stablecoinIds.size} | ${coverageExpectation(label)} |`), '',
  section('Critical Findings', critical, 'None.'),
  section('Warnings', warnings, 'None.'),
  section('Quality Observations', observations, 'None.'),
  '## Result', '',
  critical.length === 0 && warnings.length === 0
    ? 'The 70-record canonical registry passes the cross-layer integrity audit with no critical findings or warnings. Informational coverage metrics remain visible without implying universal applicability.'
    : critical.length === 0
      ? 'The 70-record canonical registry passes the cross-layer integrity audit. Warnings remain non-blocking review queues and do not represent broken references or duplicate canonical identities.'
      : 'The registry does not pass the final audit until all critical findings are resolved.', ''
].join('\n');

const expectedJson = serialize(summary);
const expectedMarkdown = markdown.endsWith('\n') ? markdown : `${markdown}\n`;
const checkOnly = process.argv.includes('--check');
if (checkOnly) {
  const currentJson = fs.existsSync(absolute(jsonPath)) ? fs.readFileSync(absolute(jsonPath), 'utf8') : '';
  const currentMarkdown = fs.existsSync(absolute(reportPath)) ? fs.readFileSync(absolute(reportPath), 'utf8') : '';
  if (currentJson !== expectedJson || currentMarkdown !== expectedMarkdown) {
    console.error('Registry integrity audit outputs are stale or missing.');
    process.exit(1);
  }
} else {
  fs.mkdirSync(path.dirname(absolute(jsonPath)), { recursive: true });
  fs.mkdirSync(path.dirname(absolute(reportPath)), { recursive: true });
  fs.writeFileSync(absolute(jsonPath), expectedJson);
  fs.writeFileSync(absolute(reportPath), expectedMarkdown);
}

console.log(`Registry integrity audit: ${critical.length} critical, ${warnings.length} warnings, ${observations.length} observations.`);
if (critical.length) process.exit(1);
