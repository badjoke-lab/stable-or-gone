import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';
import { getEventStatusEffectCategory, getPublicEventCategory } from '../config/event-taxonomy.mjs';

const root = process.cwd();
const absolute = (file) => path.join(root, file);
const readJson = (file) => JSON.parse(fs.readFileSync(absolute(file), 'utf8'));
const readRows = (file) => {
  const value = readJson(file);
  const rows = Array.isArray(value) ? value : value.records;
  if (!Array.isArray(rows)) throw new Error(`${file}: expected array or records array`);
  return rows.map((row, index) => ({ ...row, __file: file, __index: index }));
};
const loadFiles = (files = []) => files.flatMap(readRows);
const unique = (values) => [...new Set((values ?? []).filter(Boolean))].sort();
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
const countBy = (values) => Object.fromEntries([...values.reduce((map, raw) => {
  const key = raw === null || raw === undefined || raw === '' ? 'unknown' : String(raw);
  map.set(key, (map.get(key) ?? 0) + 1);
  return map;
}, new Map()).entries()].sort(([a], [b]) => a.localeCompare(b)));
const isDay = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value ?? ''));
const compareDay = (left, right) => String(left).localeCompare(String(right));

const baseline = loadRegistryV2Baseline(root);
const stablecoins = loadFiles(baseline.data_groups?.stablecoins);
const classifications = loadFiles(baseline.data_groups?.classifications);
const eventsBase = loadFiles(baseline.data_groups?.events);
const eventDetails = loadFiles(baseline.data_groups?.event_details);
const relationships = loadFiles(baseline.data_groups?.relationships);
const profiles = loadFiles(baseline.data_groups?.profiles);
const launchQueue = readJson('data/quality/launch-date-unresolved.json');
const terminalQueue = readJson('data/quality/terminal-date-unresolved.json');

const detailById = new Map(eventDetails.map((row) => [row.id, row]));
const events = eventsBase.map((row) => ({ ...row, ...(detailById.get(row.id) ?? {}) }));
const stablecoinById = new Map(stablecoins.map((row) => [row.id, row]));
const classificationById = new Map(classifications.map((row) => [row.id, row]));
const profileById = new Map(profiles.map((row) => [row.id, row]));
const eventsByStablecoin = groupBy(events, (row) => row.stablecoin_id ?? row.subject_stablecoin_ids?.[0]);
const relationshipsByStablecoin = groupBy(relationships, (row) => row.stablecoin_id);

const critical = [];
const warnings = [];
const observations = [];
const invalidDates = [];
const launchAfterTerminal = [];
const recoveryBeforeEvent = [];
const relationshipStartAfterEnd = [];
const activeRelationshipWithEnd = [];
const endedRelationshipWithoutEnd = [];
const preLaunchEvents = [];
const postTerminalEvents = [];
const launchEventBoundaryDifferences = [];
const terminalEventBoundaryDifferences = [];
const terminalAssetsWithoutBoundaryEvent = [];
const migrationAssetsWithoutMigrationEvent = [];
const relationshipBoundaryWarnings = [];
const windDownAnnouncementEqualsTerminalDate = [];
const redemptionDeadlineLikeEvents = [];
const lifecycleStatusConflicts = [];

const recordDate = (owner, field, value) => {
  if (value === null || value === undefined || value === '') return;
  if (!isDay(value)) {
    invalidDates.push({ owner, field, value });
    critical.push(`${owner}: ${field} must be YYYY-MM-DD when recorded, got ${value}`);
  }
};

for (const coin of stablecoins) {
  recordDate(coin.id, 'launch_date', coin.launch_date);
  recordDate(coin.id, 'discontinued_date', coin.discontinued_date);
  if (coin.launch_date && coin.discontinued_date && isDay(coin.launch_date) && isDay(coin.discontinued_date) && compareDay(coin.launch_date, coin.discontinued_date) > 0) {
    launchAfterTerminal.push({ stablecoin_id: coin.id, launch_date: coin.launch_date, discontinued_date: coin.discontinued_date });
    critical.push(`${coin.id}: launch_date ${coin.launch_date} is after discontinued_date ${coin.discontinued_date}`);
  }
}

for (const event of events) {
  const stablecoinId = event.stablecoin_id ?? event.subject_stablecoin_ids?.[0] ?? null;
  recordDate(event.id, 'event_date', event.event_date);
  const recoveryDate = event.depeg_detail?.recovery_date ?? event.recovery_date;
  recordDate(event.id, 'recovery_date', recoveryDate);
  const effectiveDate = event.regulatory_detail?.effective_date;
  const resolutionDate = event.regulatory_detail?.resolution_date;
  recordDate(event.id, 'regulatory_effective_date', effectiveDate);
  recordDate(event.id, 'regulatory_resolution_date', resolutionDate);
  if (event.event_date && recoveryDate && isDay(event.event_date) && isDay(recoveryDate) && compareDay(recoveryDate, event.event_date) < 0) {
    recoveryBeforeEvent.push({ event_id: event.id, event_date: event.event_date, recovery_date: recoveryDate });
    critical.push(`${event.id}: recovery date precedes event date`);
  }
  if (effectiveDate && resolutionDate && isDay(effectiveDate) && isDay(resolutionDate) && compareDay(resolutionDate, effectiveDate) < 0) {
    critical.push(`${event.id}: regulatory resolution date precedes effective date`);
  }
  if (!stablecoinId || !stablecoinById.has(stablecoinId) || !event.event_date || !isDay(event.event_date)) continue;
  const coin = stablecoinById.get(stablecoinId);
  const category = getPublicEventCategory(event.event_type);
  if (coin.launch_date && isDay(coin.launch_date) && compareDay(event.event_date, coin.launch_date) < 0) {
    preLaunchEvents.push({ event_id: event.id, stablecoin_id: stablecoinId, event_type: event.event_type, category, event_date: event.event_date, launch_date: coin.launch_date });
  }
  if (coin.discontinued_date && isDay(coin.discontinued_date) && compareDay(event.event_date, coin.discontinued_date) > 0) {
    postTerminalEvents.push({ event_id: event.id, stablecoin_id: stablecoinId, event_type: event.event_type, category, event_date: event.event_date, discontinued_date: coin.discontinued_date });
  }
  if (category === 'launch' && coin.launch_date && isDay(coin.launch_date) && event.event_date !== coin.launch_date) {
    launchEventBoundaryDifferences.push({ event_id: event.id, stablecoin_id: stablecoinId, event_date: event.event_date, launch_date: coin.launch_date, event_type: event.event_type });
  }
  if (['wind_down_announced', 'wind_down'].includes(event.event_type) && coin.discontinued_date && event.event_date === coin.discontinued_date) {
    windDownAnnouncementEqualsTerminalDate.push({ event_id: event.id, stablecoin_id: stablecoinId, event_date: event.event_date, event_type: event.event_type });
  }
  const titleText = `${event.title ?? ''} ${event.description ?? ''}`.toLowerCase();
  if (event.event_type === 'wind_down_and_final_redemption' || titleText.includes('final redemption') || titleText.includes('redemption deadline')) {
    redemptionDeadlineLikeEvents.push({ event_id: event.id, stablecoin_id: stablecoinId, event_date: event.event_date, event_type: event.event_type });
  }
}

for (const relationship of relationships) {
  recordDate(relationship.id, 'relationship_start_date', relationship.start_date);
  recordDate(relationship.id, 'relationship_end_date', relationship.end_date);
  if (relationship.start_date && relationship.end_date && isDay(relationship.start_date) && isDay(relationship.end_date) && compareDay(relationship.start_date, relationship.end_date) > 0) {
    relationshipStartAfterEnd.push(relationship.id);
    critical.push(`${relationship.id}: relationship start date is after end date`);
  }
  if (relationship.status === 'active' && relationship.end_date) {
    activeRelationshipWithEnd.push(relationship.id);
    critical.push(`${relationship.id}: active relationship has an end date`);
  }
  if (relationship.status === 'ended' && !relationship.end_date) endedRelationshipWithoutEnd.push(relationship.id);
  const coin = stablecoinById.get(relationship.stablecoin_id);
  if (!coin) continue;
  if (relationship.start_date && coin.discontinued_date && isDay(relationship.start_date) && isDay(coin.discontinued_date) && compareDay(relationship.start_date, coin.discontinued_date) > 0) {
    relationshipBoundaryWarnings.push({ relationship_id: relationship.id, stablecoin_id: coin.id, kind: 'start_after_terminal', relationship_date: relationship.start_date, asset_boundary: coin.discontinued_date });
  }
  if (relationship.end_date && coin.launch_date && isDay(relationship.end_date) && isDay(coin.launch_date) && compareDay(relationship.end_date, coin.launch_date) < 0) {
    relationshipBoundaryWarnings.push({ relationship_id: relationship.id, stablecoin_id: coin.id, kind: 'end_before_launch', relationship_date: relationship.end_date, asset_boundary: coin.launch_date });
  }
}

const terminalLegacyStatuses = new Set(['failed', 'discontinued', 'migrated', 'rebranded']);
const lifecycleCompatibility = {
  failed: new Set(['collapsed']),
  discontinued: new Set(['winding_down', 'inactive', 'terminated']),
  migrated: new Set(['migrated']),
  rebranded: new Set(['rebranded'])
};

for (const coin of stablecoins) {
  const classification = classificationById.get(coin.id);
  if (!classification) {
    critical.push(`${coin.id}: lifecycle classification missing`);
    continue;
  }
  const allowed = lifecycleCompatibility[coin.status];
  if (allowed && !allowed.has(classification.lifecycle_status)) {
    const conflict = { stablecoin_id: coin.id, legacy_status: coin.status, lifecycle_status: classification.lifecycle_status };
    lifecycleStatusConflicts.push(conflict);
    critical.push(`${coin.id}: legacy status ${coin.status} conflicts with lifecycle ${classification.lifecycle_status}`);
  }

  const coinEvents = eventsByStablecoin.get(coin.id) ?? [];
  const terminalEvents = coinEvents.filter((event) => ['terminated', 'collapsed', 'migrated', 'rebranded'].includes(getEventStatusEffectCategory(event.event_status_effect)));
  const migrationEvents = coinEvents.filter((event) => getPublicEventCategory(event.event_type) === 'migration');

  if (coin.discontinued_date && isDay(coin.discontinued_date)) {
    const exactMatches = terminalEvents.filter((event) => event.event_date === coin.discontinued_date);
    if (terminalEvents.length && exactMatches.length === 0) {
      terminalEventBoundaryDifferences.push({
        stablecoin_id: coin.id,
        discontinued_date: coin.discontinued_date,
        terminal_events: terminalEvents.map((event) => ({ id: event.id, event_type: event.event_type, event_date: event.event_date, status_effect: event.event_status_effect }))
      });
    }
    if (terminalLegacyStatuses.has(coin.status) && terminalEvents.length === 0) terminalAssetsWithoutBoundaryEvent.push(coin.id);
  }

  if (['migrated', 'rebranded'].includes(coin.status) && migrationEvents.length === 0) migrationAssetsWithoutMigrationEvent.push(coin.id);
}

const nullLaunchIds = stablecoins.filter((row) => row.launch_date === null).map((row) => row.id).sort();
const launchQueueIds = unique((launchQueue.records ?? []).map((row) => row.stablecoin_id));
const launchQueueMissing = nullLaunchIds.filter((id) => !launchQueueIds.includes(id));
const launchQueueExtra = launchQueueIds.filter((id) => !nullLaunchIds.includes(id));
if (launchQueueMissing.length) critical.push(`null launch-date assets missing from queue: ${launchQueueMissing.join(', ')}`);
if (launchQueueExtra.length) critical.push(`launch queue contains assets with resolved dates: ${launchQueueExtra.join(', ')}`);

const currentTerminalNullIds = stablecoins
  .filter((row) => terminalLegacyStatuses.has(row.status) && row.discontinued_date === null)
  .map((row) => row.id)
  .sort();
const terminalQueueIds = unique((terminalQueue.records ?? []).map((row) => row.stablecoin_id));
const terminalQueueMissing = currentTerminalNullIds.filter((id) => !terminalQueueIds.includes(id));
const terminalQueueExtra = terminalQueueIds.filter((id) => !currentTerminalNullIds.includes(id));
if (terminalQueueMissing.length) critical.push(`terminal null-boundary assets missing from queue: ${terminalQueueMissing.join(', ')}`);
if (terminalQueueExtra.length) critical.push(`terminal queue contains assets outside current terminal-null set: ${terminalQueueExtra.join(', ')}`);

const endedWithoutEndSorted = [...endedRelationshipWithoutEnd].sort();
for (const id of endedWithoutEndSorted) warnings.push(`${id}: ended relationship retains unresolved end date`);
for (const row of terminalEventBoundaryDifferences) warnings.push(`${row.stablecoin_id}: terminal event dates do not exactly match canonical discontinued_date ${row.discontinued_date}`);
for (const id of terminalAssetsWithoutBoundaryEvent) warnings.push(`${id}: terminal asset has a canonical discontinued_date but no terminal-status event row`);
for (const id of migrationAssetsWithoutMigrationEvent) warnings.push(`${id}: migrated/rebranded asset has no migration-category event row`);
for (const row of windDownAnnouncementEqualsTerminalDate) warnings.push(`${row.stablecoin_id}: ${row.event_type} date equals canonical discontinued_date and requires boundary semantics review`);

observations.push(`Audited ${stablecoins.length} assets, ${events.length} events, ${relationships.length} organization relationships, ${classifications.length} lifecycle classifications, and ${profiles.length} profiles.`);
observations.push(`${nullLaunchIds.length} assets retain unresolved launch dates and ${currentTerminalNullIds.length} terminal-status assets retain unresolved terminal dates.`);
observations.push(`${preLaunchEvents.length} events precede canonical launch dates and ${postTerminalEvents.length} events follow canonical terminal dates; these remain visible chronology contexts rather than automatic errors.`);
observations.push(`${redemptionDeadlineLikeEvents.length} events contain final-redemption or redemption-deadline semantics and require separation from product terminal boundaries.`);

const report = {
  schema_version: '1.0',
  audit_id: 'sog_registry_100_lifecycle_boundary_pr302',
  baseline_id: baseline.baseline_id,
  audited_counts: {
    stable_assets: stablecoins.length,
    classifications: classifications.length,
    profiles: profiles.length,
    events: events.length,
    relationships: relationships.length
  },
  canonical_date_integrity: {
    invalid_dates: invalidDates,
    launch_after_terminal: launchAfterTerminal,
    recovery_before_event: recoveryBeforeEvent,
    relationship_start_after_end: relationshipStartAfterEnd,
    active_relationship_with_end: activeRelationshipWithEnd
  },
  unresolved_queues: {
    null_launch_assets: nullLaunchIds,
    launch_queue_ids: launchQueueIds,
    launch_queue_missing: launchQueueMissing,
    launch_queue_extra: launchQueueExtra,
    terminal_null_assets: currentTerminalNullIds,
    terminal_queue_ids: terminalQueueIds,
    terminal_queue_missing: terminalQueueMissing,
    terminal_queue_extra: terminalQueueExtra,
    ended_relationships_without_end_date: endedWithoutEndSorted
  },
  lifecycle_consistency: {
    status_conflicts: lifecycleStatusConflicts,
    terminal_assets_without_boundary_event: terminalAssetsWithoutBoundaryEvent.sort(),
    migration_assets_without_migration_event: migrationAssetsWithoutMigrationEvent.sort()
  },
  chronology_review: {
    pre_launch_events: preLaunchEvents,
    post_terminal_events: postTerminalEvents,
    launch_event_boundary_differences: launchEventBoundaryDifferences,
    terminal_event_boundary_differences: terminalEventBoundaryDifferences,
    relationship_boundary_warnings: relationshipBoundaryWarnings,
    wind_down_announcement_equals_terminal_date: windDownAnnouncementEqualsTerminalDate,
    redemption_deadline_like_events: redemptionDeadlineLikeEvents
  },
  distributions: {
    legacy_status: countBy(stablecoins.map((row) => row.status)),
    lifecycle_status: countBy(classifications.map((row) => row.lifecycle_status)),
    event_category: countBy(events.map((row) => getPublicEventCategory(row.event_type))),
    event_status_effect_category: countBy(events.map((row) => getEventStatusEffectCategory(row.event_status_effect))),
    relationship_status: countBy(relationships.map((row) => row.status ?? 'unknown'))
  },
  findings: { critical, warnings, observations },
  result: critical.length === 0 ? 'pass_with_review_queues' : 'fail'
};

const lines = [
  '# SOG 100-Record Lifecycle and Relationship Boundary Audit',
  '',
  `- Audit ID: \`${report.audit_id}\``,
  `- Stable assets: **${stablecoins.length}**`,
  `- Events: **${events.length}**`,
  `- Relationships: **${relationships.length}**`,
  `- Critical findings: **${critical.length}**`,
  `- Review warnings: **${warnings.length}**`,
  '',
  '## Canonical Date Integrity',
  '',
  `- Invalid recorded dates: ${invalidDates.length}`,
  `- Launch after terminal: ${launchAfterTerminal.length}`,
  `- Recovery before event: ${recoveryBeforeEvent.length}`,
  `- Relationship start after end: ${relationshipStartAfterEnd.length}`,
  `- Active relationships with end dates: ${activeRelationshipWithEnd.length}`,
  '',
  '## Unresolved Boundary Queues',
  '',
  `- Null launch-date assets: ${nullLaunchIds.length}`,
  `- Launch queue missing: ${launchQueueMissing.length}`,
  `- Launch queue extra: ${launchQueueExtra.length}`,
  `- Terminal-null assets: ${currentTerminalNullIds.length}`,
  `- Terminal queue missing: ${terminalQueueMissing.length}`,
  `- Terminal queue extra: ${terminalQueueExtra.length}`,
  `- Ended relationships without exact end date: ${endedWithoutEndSorted.length}`,
  '',
  '## Chronology Review',
  '',
  `- Pre-launch events: ${preLaunchEvents.length}`,
  `- Post-terminal events: ${postTerminalEvents.length}`,
  `- Launch-event boundary differences: ${launchEventBoundaryDifferences.length}`,
  `- Terminal-event boundary differences: ${terminalEventBoundaryDifferences.length}`,
  `- Relationship boundary warnings: ${relationshipBoundaryWarnings.length}`,
  `- Wind-down announcement equals terminal date: ${windDownAnnouncementEqualsTerminalDate.length}`,
  `- Redemption-deadline-like events: ${redemptionDeadlineLikeEvents.length}`,
  '',
  '## Critical Findings',
  '',
  ...(critical.length ? critical.map((message) => `- ${message}`) : ['- None.']),
  '',
  '## Review Warnings',
  '',
  ...(warnings.length ? warnings.map((message) => `- ${message}`) : ['- None.']),
  '',
  '## Observations',
  '',
  ...observations.map((message) => `- ${message}`),
  '',
  '## Result',
  '',
  critical.length === 0
    ? 'PASS. Recorded date ordering, lifecycle classification, unresolved boundary queues, event chronology, and relationship periods are structurally consistent. Review queues remain explicit where one historical boundary must not be substituted for another.'
    : 'FAIL. Critical lifecycle or boundary findings must be resolved before PR #302 can close.',
  ''
];

const jsonPath = 'data/generated/registry-lifecycle-boundary-audit.json';
const markdownPath = 'docs/audits/registry-100-lifecycle-boundary-audit.md';
fs.mkdirSync(path.dirname(absolute(jsonPath)), { recursive: true });
fs.mkdirSync(path.dirname(absolute(markdownPath)), { recursive: true });
fs.writeFileSync(absolute(jsonPath), `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(absolute(markdownPath), lines.join('\n'));

console.log(JSON.stringify({
  audit_id: report.audit_id,
  result: report.result,
  stable_assets: stablecoins.length,
  events: events.length,
  relationships: relationships.length,
  critical: critical.length,
  warnings: warnings.length,
  null_launch_assets: nullLaunchIds.length,
  terminal_null_assets: currentTerminalNullIds.length,
  launch_queue_missing: launchQueueMissing.length,
  terminal_queue_missing: terminalQueueMissing.length
}, null, 2));

if (critical.length) process.exit(1);
