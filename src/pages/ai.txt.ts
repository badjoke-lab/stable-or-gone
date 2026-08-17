import { MAIN_ROUTES, PROJECT, getRecordCountBreakdown, getRecordCounts, getRegistryV3Summary } from '../lib/machine-readable';

export function GET() {
  const counts = getRecordCounts();
  const breakdown = getRecordCountBreakdown();
  const registryV3 = getRegistryV3Summary();
  const body = [
    'Stable or Gone',
    '',
    `Purpose: ${PROJECT.description}`,
    `Canonical origin: ${PROJECT.canonicalOrigin}`,
    'Version endpoint: /version.json',
    'Manifest endpoint: /data/manifest.json',
    'Stablecoin record template: /data/stablecoin/{slug}.json',
    'Current statistics endpoint: /data/stats.json',
    'Statistics history endpoint: /data/stats-history.json',
    'LLM guide: /llms.txt',
    `Stablecoins: ${counts.primary_records}`,
    `Organizations: ${breakdown.organizations}`,
    `Events: ${counts.events}`,
    `Evidence records: ${counts.evidence}`,
    `Registry v3 legal profiles: ${registryV3.record_counts.legal_profiles}`,
    `Registry v3 reserve components: ${registryV3.record_counts.reserve_components}`,
    `Registry v3 income profiles: ${registryV3.record_counts.income_profiles}`,
    '',
    'Per-record note: /data/stablecoin/{slug}.json exposes a deterministic canonical-only dossier for the matching /stablecoin/{slug}/ record, including related reviewed lifecycle and provenance records. Unknown or unrecorded values are preserved rather than inferred.',
    '',
    'Important routes:',
    ...MAIN_ROUTES,
    '',
    'Statistics note: Current statistics are deterministic derived output from reviewed canonical registry inputs. History contains reviewed append-only checkpoints rather than every deployment build.',
    'Statistics safety note: Unknown states are preserved and live price, market cap, APY, safety-score, and risk-score data are excluded.',
    'Safety note: Public files expose reviewed public registry information only. They do not include unreviewed candidates, internal monitoring output, or non-public review material.',
    'Registry note: Registry v3 is exposed as an additive reviewed summary while the existing v2 public contract remains compatible during the parity phase.',
    'Interpretation note: This registry is not live market data, investment advice, legal advice, tax advice, wallet support, issuer support, or redemption support.',
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600, must-revalidate',
    },
  });
}