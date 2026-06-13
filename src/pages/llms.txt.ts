import { MAIN_ROUTES, PROJECT, getRecordCountBreakdown, getRecordCounts } from '../lib/machine-readable';

export function GET() {
  const counts = getRecordCounts();
  const breakdown = getRecordCountBreakdown();
  const body = [
    '# Stable or Gone',
    '',
    PROJECT.description,
    '',
    `Canonical site: ${PROJECT.canonicalOrigin}/`,
    '',
    'Machine-readable files:',
    '- /version.json',
    '- /data/manifest.json',
    '- /ai.txt',
    '',
    'Main routes:',
    ...MAIN_ROUTES.map((route) => `- ${route}`),
    '',
    'Build-time record counts:',
    `- Stablecoins: ${counts.primary_records}`,
    `- Organizations: ${breakdown.organizations}`,
    `- Relationships: ${breakdown.relationships}`,
    `- Events: ${counts.events}`,
    `- Evidence records: ${counts.evidence}`,
    `- Reserve reports: ${breakdown.reserve_reports}`,
    `- Known unknowns: ${breakdown.known_unknowns}`,
    `- Deployments: ${breakdown.deployments}`,
    '',
    'Use notes:',
    '- This is historical reference material, not live market data.',
    '- This is not legal, tax, investment, wallet, issuer, or redemption support.',
    '- Evidence is scoped to the stablecoin, organization, event, and claim it supports.',
    '- Use methodology, event details, evidence tables, reserve reports, and known-unknown records when interpreting entries.',
    '- Public machine-readable files contain reviewed public registry information only.',
    '- Record data may be incomplete or revised.',
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600, must-revalidate',
    },
  });
}
