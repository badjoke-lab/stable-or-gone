import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildReviewedRecordDepthBaseline } from './build-reviewed-record-depth-baseline-pr353.mjs';
import { loadStatsInput } from '../stats/load-stats-input.mjs';

const root = process.cwd();
const paths = {
  config: 'config/tier-a-dossier-batch-3-pr357.json',
  queue: 'docs/migration/tier-a-candidate-queue-pr353.json',
  summary: 'docs/migration/record-depth-baseline-pr353-summary.json',
  pr356Handoff: 'docs/migration/market-access-pilot-1-pr356-reviewed-handoff.json',
  checkpoint: 'docs/migration/current-canonical-checkpoint.json'
};

const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const unique = (values) => [...new Set(values.filter(Boolean))].sort();
const digestFiles = (files) => {
  const digest = crypto.createHash('sha256');
  for (const file of [...files].sort()) {
    digest.update(file);
    digest.update('\0');
    digest.update(readText(file));
    digest.update('\0');
  }
  return digest.digest('hex');
};

function referencesAsset(row, assetId) {
  return row?.stablecoin_id === assetId
    || row?.asset_id === assetId
    || row?.id === assetId
    || (row?.stablecoin_ids ?? []).includes(assetId)
    || row?.from_asset_id === assetId
    || row?.to_asset_id === assetId;
}

function compactEvidence(row) {
  return {
    id: row.id,
    source_type: row.source_type ?? null,
    title: row.title ?? null,
    publisher: row.publisher ?? null,
    published_at: row.published_at ?? null,
    reliability: row.reliability ?? null,
    claim_scope: row.claim_scope ?? null,
    claim_scopes: [...(row.claim_scopes ?? [])],
    archived: Boolean(row.archived_url || String(row.url ?? '').includes('web.archive.org'))
  };
}

export function buildTierABatch3CurrentAudit() {
  const config = readJson(paths.config);
  const queue = readJson(paths.queue);
  const summary = readJson(paths.summary);
  const pr356Handoff = readJson(paths.pr356Handoff);
  const checkpoint = readJson(paths.checkpoint);
  const baseline = buildReviewedRecordDepthBaseline();
  const input = loadStatsInput(root);
  const baselineBySlug = new Map(baseline.assets.map((row) => [row.asset_slug, row]));
  const queueBySlug = new Map(queue.candidates.map((row) => [row.asset_slug, row]));
  const stablecoinById = new Map(input.stablecoins.map((row) => [row.id, row]));
  const profileById = new Map(input.profiles.map((row) => [row.id, row]));
  const legalById = new Map(input.legal_profiles.map((row) => [row.id, row]));
  const classificationById = new Map(input.classifications.map((row) => [row.id, row]));
  const organizationById = new Map(input.organizations.map((row) => [row.id, row]));

  const assets = config.selected_assets.map((selected) => {
    const asset = stablecoinById.get(selected.asset_id) ?? null;
    const profile = profileById.get(selected.asset_id) ?? null;
    const legal = legalById.get(selected.asset_id) ?? null;
    const classification = classificationById.get(selected.asset_id) ?? null;
    const planning = baselineBySlug.get(selected.asset_slug) ?? null;
    const queueRow = queueBySlug.get(selected.asset_slug) ?? null;
    const events = input.events.filter((row) => referencesAsset(row, selected.asset_id));
    const eventIds = new Set(events.map((row) => row.id));
    const eventDetails = input.event_details.filter((row) => eventIds.has(row.id) || eventIds.has(row.event_id));
    const evidence = input.evidence.filter((row) => referencesAsset(row, selected.asset_id));
    const relationships = input.relationships.filter((row) => referencesAsset(row, selected.asset_id));
    const organizationIds = unique(relationships.map((row) => row.organization_id));
    const organizations = organizationIds.map((id) => organizationById.get(id)).filter(Boolean);
    const knownUnknowns = input.known_unknowns.filter((row) => referencesAsset(row, selected.asset_id));
    const regulatoryNotes = input.regulatory_notes.filter((row) => referencesAsset(row, selected.asset_id));
    const dimensionStates = Object.fromEntries((planning?.dimension_states ?? []).map((row) => [row.dimension_id, row.state]));

    return {
      asset_id: selected.asset_id,
      asset_slug: selected.asset_slug,
      asset_name: queueRow?.asset_name ?? asset?.name ?? null,
      symbol: queueRow?.symbol ?? asset?.symbol ?? null,
      target_dimensions: [...selected.target_dimensions],
      current_target_states: Object.fromEntries(selected.target_dimensions.map((dimension) => [dimension, dimensionStates[dimension] ?? null])),
      canonical_asset: asset ? {
        lifecycle_status: classification?.lifecycle_status ?? asset.lifecycle_status ?? asset.status ?? null,
        launch_date: asset.launch_date ?? null,
        terminal_date: asset.terminal_date ?? asset.end_date ?? null,
        issuer_organization_ids: unique([
          ...(asset.issuer_organization_ids ?? []),
          asset.issuer_id
        ]),
        last_verified_at: asset.last_verified_at ?? null
      } : null,
      redemption_profile: profile?.redemption_profile ? {
        status: profile.redemption_profile.status ?? null,
        settlement_asset: profile.redemption_profile.settlement_asset ?? null,
        eligible_parties: profile.redemption_profile.eligible_parties ?? null,
        retail_access: profile.redemption_profile.retail_access ?? null,
        institutional_access: profile.redemption_profile.institutional_access ?? null,
        minimum_amount_text: profile.redemption_profile.minimum_amount_text ?? null,
        fee_text: profile.redemption_profile.fee_text ?? null,
        settlement_time_text: profile.redemption_profile.settlement_time_text ?? null,
        jurisdiction_restrictions: [...(profile.redemption_profile.jurisdiction_restrictions ?? [])],
        as_of_date: profile.redemption_profile.as_of_date ?? null,
        confidence: profile.redemption_profile.confidence ?? null,
        evidence_ids: [...(profile.redemption_profile.evidence_ids ?? [])]
      } : null,
      legal_profile: legal ? {
        classifications: (legal.classifications ?? []).map((entry) => ({
          classification: entry.classification ?? null,
          jurisdiction: entry.jurisdiction ?? null,
          confidence: entry.confidence ?? null,
          evidence_ids: [...(entry.evidence_ids ?? [])]
        })),
        holder_claim_type: legal.holder_claim_type ?? null,
        claim_against_organization_ids: [...(legal.claim_against_organization_ids ?? [])],
        reserve_ownership: legal.reserve_ownership ?? null,
        reserve_segregation: legal.reserve_segregation ?? null,
        bankruptcy_remoteness: legal.bankruptcy_remoteness ?? null,
        licensed_or_regulated_as: [...(legal.licensed_or_regulated_as ?? [])],
        evidence_ids: [...(legal.evidence_ids ?? [])]
      } : null,
      events: events.map((row) => ({
        id: row.id,
        event_type: row.event_type ?? null,
        event_date: row.event_date ?? null,
        title: row.title ?? null,
        confidence: row.confidence ?? null,
        evidence_ids: [...(row.evidence_ids ?? [])]
      })),
      event_detail_count: eventDetails.length,
      relationships: relationships.map((row) => ({
        id: row.id,
        organization_id: row.organization_id ?? null,
        role: row.role ?? null,
        start_date: row.start_date ?? null,
        end_date: row.end_date ?? null,
        confidence: row.confidence ?? null,
        evidence_ids: [...(row.evidence_ids ?? [])]
      })),
      organizations: organizations.map((row) => ({
        id: row.id,
        name: row.name ?? row.canonical_name ?? null,
        organization_type: row.organization_type ?? row.type ?? null,
        jurisdiction: row.jurisdiction ?? row.country_or_origin ?? null
      })),
      evidence: evidence.map(compactEvidence),
      known_unknowns: knownUnknowns.map((row) => ({
        id: row.id,
        field: row.field ?? row.field_path ?? null,
        severity: row.severity ?? null,
        status: row.status ?? null,
        note: row.note ?? row.description ?? null
      })),
      regulatory_notes: regulatoryNotes.map((row) => ({
        id: row.id,
        jurisdiction: row.jurisdiction ?? null,
        status: row.status ?? null,
        note: row.note ?? row.summary ?? null,
        evidence_ids: [...(row.evidence_ids ?? [])]
      })),
      current_counts: {
        events: events.length,
        event_details: eventDetails.length,
        relationships: relationships.length,
        organizations: organizations.length,
        evidence: evidence.length,
        known_unknowns: knownUnknowns.length,
        regulatory_notes: regulatoryNotes.length
      },
      audit_flags: {
        canonical_asset_present: Boolean(asset),
        all_target_dimensions_currently_usable_or_strong: selected.target_dimensions.every((dimension) => ['usable', 'strong'].includes(dimensionStates[dimension])),
        no_events_for_event_target: selected.target_dimensions.includes('events') && events.length === 0,
        no_relationships_for_relationship_target: selected.target_dimensions.includes('organization_relationships') && relationships.length === 0,
        no_evidence: evidence.length === 0,
        redemption_evidence_missing: selected.target_dimensions.includes('redemption') && (profile?.redemption_profile?.evidence_ids ?? []).length === 0,
        legal_evidence_missing: selected.target_dimensions.includes('legal_profile') && (legal?.evidence_ids ?? []).length === 0
      }
    };
  });

  return {
    schema_version: '1.0',
    report_id: 'sog_tier_a_dossier_batch_3_pr357_current_audit',
    status: 'deterministic_internal_prechange_audit',
    public_output: false,
    review_pr: 357,
    source_baseline_id: summary.baseline_id,
    source_baseline_input_digest_sha256: summary.input_digest_sha256,
    source_queue_id: queue.baseline_id,
    prior_work_item_handoff_id: pr356Handoff.handoff_id,
    prior_work_item_merge_commit: pr356Handoff.source_merge_commit,
    current_canonical_checkpoint_id: checkpoint.checkpoint_id,
    current_canonical_counts: {
      assets: checkpoint.asset_count,
      evidence: checkpoint.expected_counts.evidence,
      market_access_records: checkpoint.expected_counts.market_access_records
    },
    selected_asset_count: assets.length,
    selected_asset_slugs: assets.map((row) => row.asset_slug),
    current_baseline_input_digest_sha256: baseline.input_digest_sha256,
    current_baseline_summary: baseline.summary,
    selected_assets: assets,
    constraints: {
      canonical_asset_count_expected: 110,
      market_access_record_count_expected: 4,
      new_canonical_assets_allowed: false,
      new_public_surface_allowed: false,
      asset_rank: false,
      single_composite_score: false
    },
    input_digest_sha256: digestFiles(Object.values(paths))
  };
}

export const serializeTierABatch3CurrentAudit = (report) => `${JSON.stringify(report, null, 2)}\n`;

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const outputPath = process.argv[2];
  const serialized = serializeTierABatch3CurrentAudit(buildTierABatch3CurrentAudit());
  if (outputPath) {
    fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });
    fs.writeFileSync(path.resolve(outputPath), serialized);
    console.log(outputPath);
  } else {
    process.stdout.write(serialized);
  }
}
