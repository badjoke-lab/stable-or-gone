import { CANONICAL_DATA_SOURCE, DATA_SCHEMA_VERSION, MAIN_ROUTES, PROJECT, getRecordCountBreakdown, getRecordCounts } from '../lib/machine-readable';

export function GET() {
  const counts = getRecordCounts();
  const breakdown = getRecordCountBreakdown();
  const body = [
    'Stable or Gone',
    '',
    `Purpose: ${PROJECT.description}`,
    `Canonical origin: ${PROJECT.canonicalOrigin}`,
    `Data schema: ${DATA_SCHEMA_VERSION}`,
    `Canonical runtime loader: ${CANONICAL_DATA_SOURCE.runtime_loader}`,
    'Canonical-only public data: true',
    'Version endpoint: /version.json',
    'Manifest endpoint: /data/manifest.json',
    'LLM guide: /llms.txt',
    'Sitemap: /sitemap-index.xml',
    `Stablecoins: ${counts.primary_records}`,
    `Organizations: ${breakdown.organizations}`,
    `Relationships: ${breakdown.relationships}`,
    `Reserve and redemption profiles: ${breakdown.reserve_redemption_profiles}`,
    `Events: ${counts.events}`,
    `Evidence records: ${counts.evidence}`,
    `Reserve reports: ${breakdown.reserve_reports}`,
    `Known unknowns: ${breakdown.known_unknowns}`,
    `Regulatory notes: ${breakdown.regulatory_notes}`,
    `Deployments: ${breakdown.deployments}`,
    '',
    'Important routes:',
    ...MAIN_ROUTES,
    '',
    'Safety note: Public files expose reviewed public registry information only. They do not include unreviewed candidates, internal monitoring output, staging data, or non-public review material.',
    'Interpretation note: This registry is not live market data, investment advice, legal advice, tax advice, wallet support, issuer support, or redemption support.',
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=300, must-revalidate',
    },
  });
}
