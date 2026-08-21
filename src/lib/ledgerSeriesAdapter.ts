import { createHash } from 'node:crypto';
import { getStablecoins } from './data/registry';
import { getStablecoinRecordDossier } from './stablecoinRecordData';
import { DATA_SAFETY, PROJECT, getBuildMetadata } from './machine-readable';

export const LEDGER_SERIES_SCHEMA_VERSION = '1.0.0';
export const LEDGER_SERIES_ADAPTER_VERSION = '1.0.0';
export const LEDGER_SERIES_REGISTRY_ID = 'stable-or-gone';

const recordPath = (slug: string) => `/data/series/records/${slug}.json`;
const absolute = (route: string) => `${PROJECT.canonicalOrigin}${route}`;
const REVIEWED_RELATIONSHIP = [
  'predecessor_of',
  'stable-or-gone:stablecoin:sog_st_sai',
  'stable-or-gone:stablecoin:sog_st_dai',
] as const;

function sortedStablecoins() {
  return [...getStablecoins()].sort((left, right) => left.id.localeCompare(right.id));
}

function parseGlobalKey(globalKey: string) {
  const parts = globalKey.split(':');
  if (parts.length !== 3 || parts.some((part) => !part)) {
    throw new Error(`Invalid Ledger Series global key: ${globalKey}`);
  }
  return {
    registry_id: parts[0],
    native_record_type: parts[1],
    native_record_id: parts[2],
  };
}

function relationshipId(relationType: string, sourceGlobalKey: string, targetGlobalKey: string) {
  return `series_rel_${createHash('sha256')
    .update(`${relationType}\n${sourceGlobalKey}\n${targetGlobalKey}`, 'utf8')
    .digest('hex')}`;
}

export function getLedgerSeriesRecordEnvelope(slug: string) {
  const dossier = getStablecoinRecordDossier(slug);
  if (!dossier) return null;

  const stablecoin = dossier.record;
  const globalRecordKey = `${LEDGER_SERIES_REGISTRY_ID}:stablecoin:${stablecoin.id}`;
  const seriesRoute = recordPath(stablecoin.slug);

  return {
    series_schema_version: LEDGER_SERIES_SCHEMA_VERSION,
    object_type: 'record_envelope',
    registry_id: LEDGER_SERIES_REGISTRY_ID,
    global_record_key: globalRecordKey,
    record_key: {
      native_record_type: 'stablecoin',
      native_record_id: stablecoin.id,
      slug: stablecoin.slug,
    },
    urls: {
      human: dossier.canonical_page_url,
      machine: absolute(seriesRoute),
      native_machine: dossier.self_url,
    },
    identity: {
      name: stablecoin.name,
      symbol: stablecoin.symbol ?? null,
      aliases: stablecoin.aliases ?? [],
    },
    current_state: {
      status: stablecoin.lifecycle_status ?? stablecoin.status ?? null,
      native: {
        record: dossier.record,
        related: dossier.related,
        record_counts: dossier.record_counts,
      },
    },
    events: {
      mode: 'inline',
      records: dossier.related.events,
    },
    evidence: {
      mode: 'inline',
      records: dossier.related.evidence,
      relations: dossier.related.evidence_relations,
    },
    relationships: [],
    verification: {
      last_verified_at: stablecoin.last_verified_at ?? null,
      build: dossier.build,
    },
    provenance: {
      canonical_only: dossier.canonical_only === true,
      adapter: {
        id: 'series-adapter-stable-or-gone',
        version: LEDGER_SERIES_ADAPTER_VERSION,
      },
      native_manifest: absolute('/data/manifest.json'),
      native_record: dossier.self_url,
      relationship_boundary: 'native relationships remain preserved inside current_state.native.related; the single reviewed Stage 5 typed relationship is published only as a standalone relationship_record',
    },
  };
}

export function getLedgerSeriesIndex() {
  const records = sortedStablecoins().map((stablecoin) => {
    const envelope = getLedgerSeriesRecordEnvelope(stablecoin.slug);
    if (!envelope) throw new Error(`Missing stablecoin dossier for ${stablecoin.slug}`);
    return {
      global_record_key: envelope.global_record_key,
      native_record_type: 'stablecoin',
      native_record_id: stablecoin.id,
      slug: stablecoin.slug,
      name: stablecoin.name,
      symbol: stablecoin.symbol ?? null,
      status: envelope.current_state.status,
      human_url: envelope.urls.human,
      machine_url: envelope.urls.machine,
      native_machine_url: envelope.urls.native_machine,
    };
  });

  const build = getBuildMetadata();
  return {
    series_schema_version: LEDGER_SERIES_SCHEMA_VERSION,
    object_type: 'record_index',
    registry_id: LEDGER_SERIES_REGISTRY_ID,
    canonical_only: true,
    generated_at: build.generated_at,
    verification: {
      build,
    },
    record_count: records.length,
    record_counts: {
      stablecoins: records.length,
    },
    records,
  };
}

export function getLedgerSeriesRelationships() {
  const index = getLedgerSeriesIndex();
  const availableKeys = new Set(index.records.map((row) => row.global_record_key));
  const relationType: string = REVIEWED_RELATIONSHIP[0];
  const sourceGlobalKey: string = REVIEWED_RELATIONSHIP[1];
  const targetGlobalKey: string = REVIEWED_RELATIONSHIP[2];
  if (!availableKeys.has(sourceGlobalKey) || !availableKeys.has(targetGlobalKey)) {
    throw new Error('Reviewed SOG Stage 5 relationship endpoint is missing from the Stage 3 Series index');
  }
  if (sourceGlobalKey === targetGlobalKey) {
    throw new Error('Reviewed SOG Stage 5 relationship must not be a self-loop');
  }

  return [{
    series_schema_version: LEDGER_SERIES_SCHEMA_VERSION,
    object_type: 'relationship_record',
    id: relationshipId(relationType, sourceGlobalKey, targetGlobalKey),
    relation_type: relationType,
    source: parseGlobalKey(sourceGlobalKey),
    target: parseGlobalKey(targetGlobalKey),
    direction: 'directed',
    provenance: {
      basis: 'native_reviewed_relationship',
      native_evidence_refs: [],
    },
  }];
}

export function getLedgerSeriesRegistryDescriptor() {
  const build = getBuildMetadata();
  const recordCount = getStablecoins().length;
  const relationshipCount = getLedgerSeriesRelationships().length;

  return {
    series_schema_version: LEDGER_SERIES_SCHEMA_VERSION,
    object_type: 'registry_descriptor',
    registry: {
      id: LEDGER_SERIES_REGISTRY_ID,
      native_project_id: PROJECT.projectId,
      name: PROJECT.siteName,
      type: PROJECT.registryType,
      origin: PROJECT.canonicalOrigin,
      repository: 'https://github.com/badjoke-lab/stable-or-gone',
    },
    canonical_only: true,
    native_contract: {
      schema_version: '1.0.0',
      version_url: absolute('/version.json'),
      manifest_url: absolute('/data/manifest.json'),
      stablecoin_dossier_template: absolute('/data/stablecoin/{slug}.json'),
    },
    record_counts: {
      primary_records: recordCount,
      series_records: recordCount,
      relationships: relationshipCount,
    },
    record_types: [
      {
        series_record_type: 'stablecoin',
        native_record_type: 'stablecoin',
        machine_template: '/data/series/records/{slug}.json',
      },
    ],
    routes: {
      descriptor: '/data/series/registry.json',
      index: '/data/series/index.json',
      relationships: '/data/series/relationships.json',
      record_template: '/data/series/records/{slug}.json',
      search: '/stablecoins/',
      compare: '/compare/',
      stats: '/stats/',
    },
    capabilities: {
      record_json: true,
      events: 'inline',
      evidence: 'inline',
      relationships: 'adapter',
      search: true,
      compare: true,
      stats: true,
    },
    verification: {
      build,
    },
    data_safety: {
      canonical_only: DATA_SAFETY.canonical_only,
      includes_unreviewed_candidates: DATA_SAFETY.includes_unreviewed_candidates,
      includes_internal_monitoring: DATA_SAFETY.includes_internal_monitoring,
      includes_private_notes: DATA_SAFETY.includes_private_notes,
      ai_generated_canonical_facts: false,
    },
  };
}
