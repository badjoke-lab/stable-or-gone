import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadRegistryV2Baseline } from '../load-registry-v2-baseline.mjs';

const root = process.cwd();
const CONTRACT_PATH = 'data/quality/change-timeline-contract-v1.json';
const V3_FOUNDATION_PATH = 'docs/migration/registry-v3-foundation.json';
const MARKET_ACCESS_PATH = 'data/market-access-records-v1.json';

const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const validDay = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
const uniqueSorted = (values) => [...new Set(values.filter(Boolean))].sort();
const sourcePriority = {
  canonical_event: 1,
  regulatory_note: 2,
  market_access_record: 3,
  legal_classification: 4,
  organization_relationship: 5,
  stable_asset_identity: 6
};

function countBy(items, getter) {
  const counts = new Map();
  for (const item of items) {
    for (const value of uniqueSorted([].concat(getter(item) ?? []).filter(Boolean))) {
      counts.set(String(value), (counts.get(String(value)) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([value, item_count]) => ({ value, item_count }))
    .sort((left, right) => right.item_count - left.item_count || left.value.localeCompare(right.value));
}

function normalizeAssetRefs(assetIds, assetById) {
  return uniqueSorted(assetIds).map((id) => {
    const asset = assetById.get(id);
    return {
      asset_id: id,
      slug: asset?.slug ?? null,
      name: asset?.name ?? null,
      symbol: asset?.symbol ?? null
    };
  });
}

function normalizeOrganizationRefs(orgIds, organizationById) {
  return uniqueSorted(orgIds).map((id) => ({
    organization_id: id,
    name: organizationById.get(id)?.name ?? null
  }));
}

export function buildChangeTimelineProjection() {
  const contract = readJson(CONTRACT_PATH);
  const baseline = loadRegistryV2Baseline(root);
  const v3Foundation = readJson(V3_FOUNDATION_PATH);
  const marketAccessRecords = readJson(MARKET_ACCESS_PATH);

  const sourceFiles = new Set([CONTRACT_PATH, V3_FOUNDATION_PATH, MARKET_ACCESS_PATH]);
  for (const files of Object.values(baseline.data_groups ?? {})) for (const file of files ?? []) sourceFiles.add(file);
  for (const files of Object.values(v3Foundation.data_groups ?? {})) for (const file of files ?? []) sourceFiles.add(file);

  const group = (name) => (baseline.data_groups?.[name] ?? []).flatMap((file) => readJson(file));
  const v3Group = (name) => (v3Foundation.data_groups?.[name] ?? []).flatMap((file) => readJson(file));

  const assets = group('stablecoins');
  const organizations = group('organizations');
  const events = group('events');
  const eventDetails = group('event_details');
  const relationships = group('relationships');
  const regulatoryNotes = group('regulatory_notes');
  const legalProfiles = v3Group('legal_profiles');

  const assetById = new Map(assets.map((row) => [row.id, row]));
  const organizationById = new Map(organizations.map((row) => [row.id, row]));
  const eventDetailById = new Map(eventDetails.map((row) => [row.id, row]));
  const items = [];

  const pushItem = (item) => {
    if (!validDay(item.date)) return;
    const assetIds = uniqueSorted(item.asset_ids ?? []);
    const organizationIds = uniqueSorted(item.organization_ids ?? []);
    items.push({
      item_id: item.item_id,
      date: item.date,
      year: item.date.slice(0, 4),
      date_kind: item.date_kind,
      date_semantics: item.date_semantics,
      boundary_kind: item.boundary_kind,
      source_family: item.source_family,
      source_record_id: item.source_record_id,
      change_type: item.change_type,
      asset_ids: assetIds,
      assets: normalizeAssetRefs(assetIds, assetById),
      organization_ids: organizationIds,
      organizations: normalizeOrganizationRefs(organizationIds, organizationById),
      jurisdiction_tokens: uniqueSorted(item.jurisdiction_tokens ?? []),
      title: item.title,
      summary: item.summary ?? null,
      confidence: item.confidence ?? null,
      metadata: item.metadata ?? {}
    });
  };

  for (const asset of assets) {
    if (!validDay(asset.launch_date)) continue;
    pushItem({
      item_id: `sog_tl_asset_${asset.id}_launch_date`,
      date: asset.launch_date,
      date_kind: 'asset_launch_date',
      date_semantics: 'canonical_asset_launch_date',
      boundary_kind: 'milestone',
      source_family: 'stable_asset_identity',
      source_record_id: asset.id,
      change_type: 'asset_launch',
      asset_ids: [asset.id],
      organization_ids: [],
      title: `${asset.name} launch date`,
      summary: 'Canonical stable-asset identity record launch date.',
      confidence: null,
      metadata: {}
    });
  }

  for (const event of events) {
    const detail = eventDetailById.get(event.id) ?? {};
    const assetIds = uniqueSorted([event.stablecoin_id, ...(detail.subject_stablecoin_ids ?? [])]);
    const organizationIds = uniqueSorted([event.issuer_id, ...(detail.subject_organization_ids ?? [])]);

    if (validDay(event.event_date)) {
      pushItem({
        item_id: `sog_tl_event_${event.id}_event_date`,
        date: event.event_date,
        date_kind: 'event_date',
        date_semantics: 'canonical_event_subject_date',
        boundary_kind: 'milestone',
        source_family: 'canonical_event',
        source_record_id: event.id,
        change_type: event.event_type ?? 'unknown_event_type',
        asset_ids: assetIds,
        organization_ids: organizationIds,
        title: event.title ?? detail.title ?? event.id,
        summary: event.description ?? null,
        confidence: event.confidence ?? null,
        metadata: {
          impact_level: event.impact_level ?? null,
          event_status_effect: event.event_status_effect ?? null,
          recovered: event.recovered ?? null,
          failure_mechanism: event.failure_mechanism ?? null,
          event_detail_kind: detail.event_detail_kind ?? null
        }
      });
    }

    if (validDay(event.recovery_date)) {
      pushItem({
        item_id: `sog_tl_event_${event.id}_recovery_date`,
        date: event.recovery_date,
        date_kind: 'event_recovery_date',
        date_semantics: 'canonical_event_recovery_date',
        boundary_kind: 'milestone',
        source_family: 'canonical_event',
        source_record_id: event.id,
        change_type: 'event_recovery',
        asset_ids: assetIds,
        organization_ids: organizationIds,
        title: `Recovery milestone — ${event.title ?? detail.title ?? event.id}`,
        summary: event.description ?? null,
        confidence: event.confidence ?? null,
        metadata: {
          source_event_type: event.event_type ?? null,
          event_status_effect: event.event_status_effect ?? null,
          recovered: event.recovered ?? null
        }
      });
    }
  }

  for (const relationship of relationships) {
    const asset = assetById.get(relationship.stablecoin_id);
    const organization = organizationById.get(relationship.organization_id);
    const assetName = asset?.name ?? relationship.stablecoin_id;
    const organizationName = organization?.name ?? relationship.organization_id;
    const role = relationship.role ?? 'relationship';

    if (validDay(relationship.start_date)) {
      pushItem({
        item_id: `sog_tl_relationship_${relationship.id}_start_date`,
        date: relationship.start_date,
        date_kind: 'relationship_start_date',
        date_semantics: 'organization_relationship_effective_start',
        boundary_kind: 'start',
        source_family: 'organization_relationship',
        source_record_id: relationship.id,
        change_type: 'organization_relationship_start',
        asset_ids: [relationship.stablecoin_id],
        organization_ids: [relationship.organization_id],
        title: `${organizationName} ${role.replaceAll('_', ' ')} relationship begins for ${assetName}`,
        summary: relationship.notes ?? null,
        confidence: null,
        metadata: {
          role,
          relationship_status: relationship.status ?? null
        }
      });
    }

    if (validDay(relationship.end_date)) {
      pushItem({
        item_id: `sog_tl_relationship_${relationship.id}_end_date`,
        date: relationship.end_date,
        date_kind: 'relationship_end_date',
        date_semantics: 'organization_relationship_effective_end',
        boundary_kind: 'end',
        source_family: 'organization_relationship',
        source_record_id: relationship.id,
        change_type: 'organization_relationship_end',
        asset_ids: [relationship.stablecoin_id],
        organization_ids: [relationship.organization_id],
        title: `${organizationName} ${role.replaceAll('_', ' ')} relationship ends for ${assetName}`,
        summary: relationship.notes ?? null,
        confidence: null,
        metadata: {
          role,
          relationship_status: relationship.status ?? null
        }
      });
    }
  }

  for (const legal of legalProfiles) {
    const asset = assetById.get(legal.id);
    for (const [index, classification] of (legal.classifications ?? []).entries()) {
      const jurisdiction = classification.jurisdiction ?? null;
      const classificationName = classification.classification ?? 'unclassified';
      const titleBase = `${asset?.name ?? legal.id} legal classification: ${classificationName.replaceAll('_', ' ')}`;

      if (validDay(classification.effective_from)) {
        pushItem({
          item_id: `sog_tl_legal_${legal.id}_${index}_effective_from`,
          date: classification.effective_from,
          date_kind: 'legal_effective_from',
          date_semantics: 'legal_classification_effective_start',
          boundary_kind: 'start',
          source_family: 'legal_classification',
          source_record_id: legal.id,
          change_type: 'legal_classification_start',
          asset_ids: [legal.id],
          organization_ids: legal.claim_against_organization_ids ?? [],
          jurisdiction_tokens: [jurisdiction],
          title: `${titleBase} begins`,
          summary: classification.notes ?? null,
          confidence: classification.confidence ?? null,
          metadata: {
            classification: classificationName,
            jurisdiction,
            authority_or_basis: classification.authority_or_basis ?? null
          }
        });
      }

      if (validDay(classification.effective_to)) {
        pushItem({
          item_id: `sog_tl_legal_${legal.id}_${index}_effective_to`,
          date: classification.effective_to,
          date_kind: 'legal_effective_to',
          date_semantics: 'legal_classification_effective_end',
          boundary_kind: 'end',
          source_family: 'legal_classification',
          source_record_id: legal.id,
          change_type: 'legal_classification_end',
          asset_ids: [legal.id],
          organization_ids: legal.claim_against_organization_ids ?? [],
          jurisdiction_tokens: [jurisdiction],
          title: `${titleBase} ends`,
          summary: classification.notes ?? null,
          confidence: classification.confidence ?? null,
          metadata: {
            classification: classificationName,
            jurisdiction,
            authority_or_basis: classification.authority_or_basis ?? null
          }
        });
      }
    }
  }

  for (const note of regulatoryNotes) {
    if (!validDay(note.note_date)) continue;
    const assetIds = uniqueSorted([note.stablecoin_id, ...(note.stablecoin_ids ?? [])]);
    const assetNames = normalizeAssetRefs(assetIds, assetById).map((row) => row.name ?? row.asset_id).join(', ');
    pushItem({
      item_id: `sog_tl_regulatory_${note.id}_note_date`,
      date: note.note_date,
      date_kind: 'regulatory_note_date',
      date_semantics: 'canonical_regulatory_note_subject_date',
      boundary_kind: 'milestone',
      source_family: 'regulatory_note',
      source_record_id: note.id,
      change_type: note.note_type ?? 'regulatory_note',
      asset_ids: assetIds,
      organization_ids: note.organization_ids ?? [],
      jurisdiction_tokens: [note.jurisdiction],
      title: `${assetNames || 'Stable asset'} — ${(note.note_type ?? 'regulatory note').replaceAll('_', ' ')}`,
      summary: note.summary ?? null,
      confidence: note.confidence ?? null,
      metadata: {
        note_type: note.note_type ?? null,
        jurisdiction: note.jurisdiction ?? null,
        authority_or_source: note.authority_or_source ?? null
      }
    });
  }

  for (const access of marketAccessRecords) {
    const asset = assetById.get(access.asset_id);
    const platformName = access.platform?.name ?? 'platform';
    const functionName = access.function ?? 'function';
    const accessState = access.access_state ?? 'unknown';
    const jurisdiction = access.jurisdiction?.country_code ?? null;
    const titleBase = `${asset?.name ?? access.asset_id} ${functionName.replaceAll('_', ' ')} access ${accessState.replaceAll('_', ' ')} on ${platformName}`;

    if (validDay(access.effective_from)) {
      pushItem({
        item_id: `sog_tl_market_access_${access.id}_effective_from`,
        date: access.effective_from,
        date_kind: 'market_access_effective_from',
        date_semantics: 'market_access_effective_start',
        boundary_kind: 'start',
        source_family: 'market_access_record',
        source_record_id: access.id,
        change_type: 'market_access_state_start',
        asset_ids: [access.asset_id],
        organization_ids: [access.platform?.organization_id].filter(Boolean),
        jurisdiction_tokens: [jurisdiction],
        title: `${titleBase} begins`,
        summary: access.notes ?? null,
        confidence: access.confidence ?? null,
        metadata: {
          jurisdiction: access.jurisdiction,
          platform: access.platform,
          function: functionName,
          access_state: accessState,
          observed_at: access.observed_at ?? null
        }
      });
    }

    if (validDay(access.effective_to)) {
      pushItem({
        item_id: `sog_tl_market_access_${access.id}_effective_to`,
        date: access.effective_to,
        date_kind: 'market_access_effective_to',
        date_semantics: 'market_access_effective_end',
        boundary_kind: 'end',
        source_family: 'market_access_record',
        source_record_id: access.id,
        change_type: 'market_access_state_end',
        asset_ids: [access.asset_id],
        organization_ids: [access.platform?.organization_id].filter(Boolean),
        jurisdiction_tokens: [jurisdiction],
        title: `${titleBase} ends`,
        summary: access.notes ?? null,
        confidence: access.confidence ?? null,
        metadata: {
          jurisdiction: access.jurisdiction,
          platform: access.platform,
          function: functionName,
          access_state: accessState,
          observed_at: access.observed_at ?? null
        }
      });
    }
  }

  items.sort((left, right) =>
    right.date.localeCompare(left.date)
    || (sourcePriority[left.source_family] ?? 99) - (sourcePriority[right.source_family] ?? 99)
    || left.item_id.localeCompare(right.item_id)
  );

  const filters = {
    source_family: countBy(items, (item) => item.source_family),
    date_kind: countBy(items, (item) => item.date_kind),
    boundary_kind: countBy(items, (item) => item.boundary_kind),
    change_type: countBy(items, (item) => item.change_type),
    asset_slug: countBy(items, (item) => item.assets.map((asset) => asset.slug).filter(Boolean)),
    year: countBy(items, (item) => item.year),
    jurisdiction: countBy(items, (item) => item.jurisdiction_tokens)
  };

  const summary = {
    item_count: items.length,
    asset_count_with_items: new Set(items.flatMap((item) => item.asset_ids)).size,
    organization_count_with_items: new Set(items.flatMap((item) => item.organization_ids)).size,
    source_family_counts: Object.fromEntries(filters.source_family.map((row) => [row.value, row.item_count])),
    date_kind_counts: Object.fromEntries(filters.date_kind.map((row) => [row.value, row.item_count])),
    earliest_date: items.at(-1)?.date ?? null,
    latest_date: items[0]?.date ?? null
  };

  const digest = crypto.createHash('sha256');
  for (const file of [...sourceFiles].sort()) {
    digest.update(file);
    digest.update('\0');
    digest.update(readText(file));
    digest.update('\0');
  }

  return {
    schema_version: '1.0',
    projection_id: contract.contract_id,
    status: 'public_canonical_projection',
    generated_at: '2026-07-10',
    data_safety: contract.data_safety,
    projection_rules: contract.projection_rules,
    item_count: items.length,
    input_digest_sha256: digest.digest('hex'),
    summary,
    filters,
    items
  };
}

export function serializeChangeTimelineProjection(projection) {
  return `${JSON.stringify(projection, null, 2)}\n`;
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const projection = buildChangeTimelineProjection();
  const serialized = serializeChangeTimelineProjection(projection);
  const outputPath = process.argv[2];
  if (outputPath) {
    fs.mkdirSync(path.dirname(path.join(root, outputPath)), { recursive: true });
    fs.writeFileSync(path.join(root, outputPath), serialized);
    console.log(outputPath);
  } else {
    process.stdout.write(serialized);
  }
}
