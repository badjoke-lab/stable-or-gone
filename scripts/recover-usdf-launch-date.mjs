import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
const writeJson = (relativePath, value, compact = false) => {
  const serialized = compact ? `${JSON.stringify(value)}\n` : `${JSON.stringify(value, null, 2)}\n`;
  fs.writeFileSync(path.join(root, relativePath), serialized);
};
const requireRow = (rows, predicate, label) => {
  const row = rows.find(predicate);
  if (!row) throw new Error(`Missing ${label}`);
  return row;
};
const replaceRequired = (text, from, to, label = from) => {
  if (!text.includes(from)) throw new Error(`Missing text for replacement: ${label}`);
  return text.replace(from, to);
};

const stablecoinsPath = 'data/stablecoins-batch-l.json';
const eventsPath = 'data/events-batch-l.json';
const detailsPath = 'data/event-details-batch-l.json';
const evidencePath = 'data/evidence-batch-l-b.json';
const queuePath = 'data/quality/launch-date-unresolved.json';
const v2BaselinePath = 'docs/migration/registry-v2-baseline.json';
const v3BaselinePath = 'docs/migration/registry-v3-baseline.json';
const qualityBaselinePath = 'docs/audits/registry-80-quality-baseline.md';
const roadmapPath = 'docs/roadmap.md';
const auditPath = 'docs/audits/launch-date-category-b-follow-up.md';

const stablecoins = readJson(stablecoinsPath);
const usdf = requireRow(stablecoins, (row) => row.id === 'sog_st_usdf', 'Falcon USDf stablecoin');
if (usdf.launch_date !== null && usdf.launch_date !== '2025-04-30') {
  throw new Error(`Unexpected existing USDf launch_date: ${usdf.launch_date}`);
}
usdf.launch_date = '2025-04-30';
usdf.last_verified_at = '2026-06-22';
usdf.notes = "Batch L. Launch date recovered from Falcon Finance's official public-launch announcement dated 2025-04-30; base USDf remains separate from yield-bearing sUSDf.";
writeJson(stablecoinsPath, stablecoins, true);

const events = readJson(eventsPath);
const usdfEvent = requireRow(events, (row) => row.id === 'sog_ev_usdf_launch_batch_l', 'Falcon USDf launch event');
usdfEvent.event_date = '2025-04-30';
usdfEvent.description = 'Falcon Finance opened the protocol to public access on 2025-04-30, making core USDf minting and redemption functions available to users.';
usdfEvent.confidence = 'high';
usdfEvent.source_count = 5;
usdfEvent.notes = "Day-level boundary follows Falcon Finance's dated official public-launch announcement; the earlier closed beta is not treated as unrestricted public launch.";
writeJson(eventsPath, events, true);

const details = readJson(detailsPath);
const usdfDetail = requireRow(details, (row) => row.id === 'sog_ev_usdf_launch_batch_l', 'Falcon USDf event detail');
const sourceId = 'sog_src_usdf_public_launch_2025';
if (!usdfDetail.evidence_ids.includes(sourceId)) usdfDetail.evidence_ids.push(sourceId);
usdfDetail.launch_detail.summary = 'Falcon Finance opened USDf minting and redemption to public access on 2025-04-30 after an earlier closed beta.';
writeJson(detailsPath, details, true);

const evidence = readJson(evidencePath);
if (!evidence.some((row) => row.id === sourceId)) {
  const usxIndex = evidence.findIndex((row) => row.id === 'sog_src_usx_launch_batch_l');
  const source = {
    id: sourceId,
    stablecoin_id: 'sog_st_usdf',
    issuer_id: 'sog_issuer_falcon_finance',
    source_type: 'official_blog',
    title: 'Falcon Finance Opens to the Public and Launches “Falcon Miles” Points Program',
    url: 'https://falcon.finance/news/falcon-finance-opens-to-the-public-and-launches-falcon-miles-points-program/',
    publisher: 'Falcon Finance',
    published_at: '2025-04-30',
    archived_url: 'https://web.archive.org/web/*/https://falcon.finance/news/falcon-finance-opens-to-the-public-and-launches-falcon-miles-points-program/',
    accessed_at: '2026-06-22',
    reliability: 'high',
    claim_scope: 'launch',
    stablecoin_ids: ['sog_st_usdf'],
    organization_ids: ['sog_issuer_falcon_finance'],
    claim_scopes: ['launch_date', 'public_access', 'minting', 'redemption', 'closed_beta_boundary'],
    event_ids: ['sog_ev_usdf_launch_batch_l']
  };
  if (usxIndex === -1) evidence.push(source);
  else evidence.splice(usxIndex, 0, source);
}
writeJson(evidencePath, evidence, true);

const queue = readJson(queuePath);
queue.source_review = auditPath;
queue.records = queue.records.filter((row) => row.stablecoin_id !== 'sog_st_usdf');
queue.expected_total = queue.records.length;
queue.category_counts = Object.fromEntries(['B', 'C', 'D'].map((category) => [
  category,
  queue.records.filter((row) => row.category === category).length
]));
if (queue.expected_total !== 37 || queue.category_counts.B !== 8 || queue.category_counts.C !== 26 || queue.category_counts.D !== 3) {
  throw new Error(`Unexpected queue result: ${JSON.stringify(queue.category_counts)} / ${queue.expected_total}`);
}
writeJson(queuePath, queue);

const v2 = readJson(v2BaselinePath);
v2.minimum_counts.evidence = 328;
v2.minimum_counts.evidence_relations = 328;
writeJson(v2BaselinePath, v2);

const v3 = readJson(v3BaselinePath);
v3.expected_counts.evidence = 328;
v3.quality.launch_date_unresolved = 37;
writeJson(v3BaselinePath, v3);

let qualityBaseline = fs.readFileSync(path.join(root, qualityBaselinePath), 'utf8');
qualityBaseline = replaceRequired(qualityBaseline, '| evidence | 327 |', '| evidence | 328 |');
qualityBaseline = replaceRequired(qualityBaseline, '- Launch-date unresolved: 38', '- Launch-date unresolved: 37');
qualityBaseline = qualityBaseline.replace(
  '## Promotion boundary',
  '## Launch-date follow-up\n\nFalcon USDf now has the reviewed public-launch date `2025-04-30`, backed by Falcon Finance’s dated first-party announcement. The earlier closed beta remains separate from unrestricted public access.\n\n## Promotion boundary'
);
fs.writeFileSync(path.join(root, qualityBaselinePath), qualityBaseline);

let roadmap = fs.readFileSync(path.join(root, roadmapPath), 'utf8');
roadmap = replaceRequired(roadmap, '327 evidence records', '328 evidence records');
roadmap = replaceRequired(roadmap, 'Missing canonical launch dates:            38', 'Missing canonical launch dates:            37');
roadmap = replaceRequired(roadmap, 'Prioritize the 38-record launch-date queue', 'Prioritize the 37-record launch-date queue');
roadmap = replaceRequired(roadmap, '38 unresolved canonical records', '37 unresolved canonical records');
roadmap = roadmap.replace(
  'Source: `data/quality/launch-date-unresolved.json`\n\nUnsupported day-level precision remains forbidden.',
  'Source: `data/quality/launch-date-unresolved.json`\n\nResolved in the 80-record quality follow-up:\n\n```text\nFalcon USDf — 2025-04-30 public launch\n```\n\nUnsupported day-level precision remains forbidden.'
);
fs.writeFileSync(path.join(root, roadmapPath), roadmap);

const audit = `# Launch-Date Category B Follow-Up

Recorded: 2026-06-22

## Scope

Re-review the nine Category B launch-date records present after Batch M without coercing month- or year-only evidence into day-level dates.

## Result

- Falcon USDf is promoted from unresolved Category B to canonical launch date \`2025-04-30\`.
- The unresolved launch-date queue changes from 38 to 37.
- Category B changes from 9 to 8.
- Category C remains 26.
- Category D remains 3.
- No other launch date is changed.

## Falcon USDf boundary

Primary source:

\`\`\`text
https://falcon.finance/news/falcon-finance-opens-to-the-public-and-launches-falcon-miles-points-program/
\`\`\`

Falcon Finance published the announcement on 2025-04-30 and states that the protocol officially launched for public access. The same announcement says public access includes the core minting and redemption functions and identifies USDf as the protocol synthetic dollar that users can mint with supported collateral.

SOG therefore uses 2025-04-30 as the unrestricted public-launch boundary. The earlier closed beta is preserved as pre-launch context and is not treated as the canonical public launch.

## Records kept unresolved

The following Category B records remain null because reviewed first-party evidence still supports only a month or year:

\`\`\`text
BRZ — 2019
EURS — 2018
Mountain Protocol USDM — 2023
USD0 — 2024-05
USR — 2024-09
Anzen USDz — 2024-06
Avalon USDa — 2024-11
Berachain HONEY — 2025
\`\`\`

## Coupled updates

- stablecoin launch date and verification note
- launch event date, confidence, source count, and boundary note
- Event v2 evidence relation and launch summary
- one new first-party evidence record
- launch-date unresolved queue
- Registry v2 and v3 baselines
- generated stats and integrity audit
- 80-record quality baseline and roadmap

## Production status

No Cloudflare action, production deployment, or public parity assertion is performed. The 80-record production checkpoint remains pending.
`;
fs.writeFileSync(path.join(root, auditPath), audit);

console.log('Prepared Falcon USDf launch-date recovery.');
