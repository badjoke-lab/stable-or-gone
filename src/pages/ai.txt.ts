import { MAIN_ROUTES, PROJECT, getRecordCountBreakdown, getRecordCounts } from '../lib/machine-readable';

export function GET() {
  const counts = getRecordCounts();
  const breakdown = getRecordCountBreakdown();
  const body = [
    'Stable or Gone',
    '',
    `Purpose: ${PROJECT.description}`,
    `Canonical origin: ${PROJECT.canonicalOrigin}`,
    'Version endpoint: /version.json',
    'Manifest endpoint: /data/manifest.json',
    'LLM guide: /llms.txt',
    `Stablecoins: ${counts.primary_records}`,
    `Organizations: ${breakdown.organizations}`,
    `Events: ${counts.events}`,
    `Evidence records: ${counts.evidence}`,
    '',
    'Important routes:',
    ...MAIN_ROUTES,
    '',
    'Safety note: Public files expose reviewed public registry information only. They do not include unreviewed candidates, internal monitoring output, or non-public review material.',
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
