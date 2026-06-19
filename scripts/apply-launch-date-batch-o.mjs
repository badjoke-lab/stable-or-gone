import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const today = '2026-06-19';

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
}

function writeJson(relativePath, value) {
  fs.writeFileSync(path.join(root, relativePath), `${JSON.stringify(value, null, 2)}\n`);
}

function appendNote(existing, addition) {
  if (!existing) return addition;
  if (existing.includes(addition)) return existing;
  return `${existing} ${addition}`;
}

function requireRow(rows, id, file) {
  const row = rows.find((item) => item.id === id);
  if (!row) throw new Error(`${file}: missing ${id}`);
  return row;
}

function appendUnique(rows, row, file) {
  if (rows.some((item) => item.id === row.id)) throw new Error(`${file}: duplicate ${row.id}`);
  rows.push(row);
}

function replaceRequired(text, before, after, label) {
  if (!text.includes(before)) throw new Error(`Missing markdown anchor: ${label}`);
  return text.replace(before, after);
}

// Canonical stable-asset dates.
{
  const file = 'data/stablecoins.json';
  const rows = readJson(file);
  const row = requireRow(rows, 'sog_st_crvusd', file);
  row.launch_date = '2023-05-14';
  row.last_verified_at = today;
  row.notes = appendNote(row.notes, 'Launch-date Batch O uses Curve Finance’s official second-anniversary statement to establish 2023-05-14 as the canonical launch date.');
  writeJson(file, rows);
}

{
  const file = 'data/stablecoins-batch-j.json';
  const rows = readJson(file);
  const updates = {
    sog_st_eurcv: ['2023-04-20', 'Launch-date Batch O uses SG-FORGE’s dated launch release for EUR CoinVertible.'],
    sog_st_euri: ['2024-08-26', 'Launch-date Batch O uses Banking Circle’s dated EURI launch announcement.'],
    sog_st_eurq: ['2024-11-18', 'Launch-date Batch O uses Quantoz’s statement that EURQ issuance began on 2024-11-18; later exchange availability remains a separate distribution event.']
  };
  for (const [id, [date, note]] of Object.entries(updates)) {
    const row = requireRow(rows, id, file);
    row.launch_date = date;
    row.last_verified_at = today;
    row.notes = appendNote(row.notes, note);
  }
  writeJson(file, rows);
}

{
  const file = 'data/stablecoins-batch-h.json';
  const rows = readJson(file);
  const row = requireRow(rows, 'sog_st_usdy', file);
  row.launch_date = '2023-09-07';
  row.last_verified_at = today;
  row.notes = appendNote(row.notes, 'Launch-date Batch O uses Ondo’s official introduction dated 2023-09-07; later chain launches remain deployment events.');
  writeJson(file, rows);
}

// Existing crvUSD launch context becomes an exact launch event while retaining its ID.
{
  const file = 'data/events-pr038.json';
  const rows = readJson(file);
  const row = requireRow(rows, 'sog_ev_crvusd_launch_context', file);
  Object.assign(row, {
    event_type: 'launch',
    event_date: '2023-05-14',
    title: 'crvUSD launches',
    description: 'Curve Finance’s official second-anniversary statement identifies May 14, 2023 as the crvUSD launch date. SOG retains the existing event ID and records LLAMMA and collateral mechanics as separate protocol context.',
    impact_level: 'medium',
    event_status_effect: 'none',
    recovered: null,
    recovery_date: null,
    failure_mechanism: 'product_launch',
    confidence: 'high',
    source_count: 2,
    notes: 'Launch-date Batch O replaces the earlier approximate 2023-05-01 context date with Curve’s anniversary-backed date.'
  });
  writeJson(file, rows);
}

// New launch events preserve the existing 2026 status-review and issuer-transition events.
{
  const file = 'data/events-batch-j.json';
  const rows = readJson(file);
  appendUnique(rows, {
    id: 'sog_ev_eurcv_2023_04_launch', stablecoin_id: 'sog_st_eurcv', issuer_id: 'sog_issuer_sg_forge', event_type: 'launch', event_date: '2023-04-20', title: 'SG-FORGE launches EUR CoinVertible', description: 'Societe Generale-FORGE announced the launch of EUR CoinVertible on April 20, 2023. Later regulatory elevation, reserve disclosures, and distribution changes remain separate lifecycle records.', impact_level: 'medium', confidence: 'high', source_count: 1, event_status_effect: 'none', recovered: null, recovery_date: null, failure_mechanism: 'product_launch', notes: 'Official SG-FORGE launch release; added in Launch-date Batch O.'
  }, file);
  appendUnique(rows, {
    id: 'sog_ev_euri_2024_08_launch', stablecoin_id: 'sog_st_euri', issuer_id: 'sog_issuer_banking_circle', event_type: 'launch', event_date: '2024-08-26', title: 'Banking Circle launches EURI', description: 'Banking Circle announced the launch of Eurite EURI on August 26, 2024 as a bank-backed MiCA-compliant euro e-money token.', impact_level: 'medium', confidence: 'high', source_count: 1, event_status_effect: 'none', recovered: null, recovery_date: null, failure_mechanism: 'product_launch', notes: 'Official Banking Circle launch announcement; added in Launch-date Batch O.'
  }, file);
  appendUnique(rows, {
    id: 'sog_ev_eurq_2024_11_launch', stablecoin_id: 'sog_st_eurq', issuer_id: 'sog_issuer_quantoz_payments', event_type: 'launch', event_date: '2024-11-18', title: 'Quantoz begins issuing EURQ', description: 'Quantoz Payments states that it began issuing EURQ and USDQ on November 18, 2024. Later exchange listings are treated as distribution events rather than the canonical launch.', impact_level: 'medium', confidence: 'high', source_count: 1, event_status_effect: 'none', recovered: null, recovery_date: null, failure_mechanism: 'product_launch', notes: 'Official Quantoz issuance-start statement; added in Launch-date Batch O.'
  }, file);
  writeJson(file, rows);
}

{
  const file = 'data/events-batch-h.json';
  const rows = readJson(file);
  appendUnique(rows, {
    id: 'sog_ev_usdy_2023_09_launch', stablecoin_id: 'sog_st_usdy', issuer_id: 'sog_issuer_ondo_global_markets', event_type: 'launch', event_date: '2023-09-07', title: 'Ondo introduces USDY', description: 'Ondo’s official introduction of Ondo US Dollar Yield is dated September 7, 2023. Later network-specific availability is treated as deployment history.', impact_level: 'medium', confidence: 'high', source_count: 1, event_status_effect: 'none', recovered: null, recovery_date: null, failure_mechanism: 'product_launch', notes: 'Official Ondo introduction; added in Launch-date Batch O.'
  }, file);
  writeJson(file, rows);
}

// Event detail records and source relations.
{
  const file = 'data/event-details-v2.json';
  const rows = readJson(file);
  const row = requireRow(rows, 'sog_ev_crvusd_launch_context', file);
  delete row.migration_detail;
  row.evidence_ids = ['sog_src_crvusd_curve_lifecycle_event', 'sog_src_crvusd_anniversary_launch_2025'];
  row.event_detail_kind = 'launch';
  row.launch_detail = { summary: 'crvUSD official launch on 2023-05-14, established from Curve Finance’s second-anniversary statement.', status: 'active' };
  writeJson(file, rows);
}

{
  const file = 'data/event-details-batch-j.json';
  const rows = readJson(file);
  appendUnique(rows, { id: 'sog_ev_eurcv_2023_04_launch', title: 'SG-FORGE launches EUR CoinVertible', subject_stablecoin_ids: ['sog_st_eurcv'], subject_organization_ids: ['sog_issuer_sg_forge'], evidence_ids: ['sog_src_eurcv_launch_2023'], event_detail_kind: 'launch', launch_detail: { summary: 'EUR CoinVertible official launch on 2023-04-20.', status: 'active' } }, file);
  appendUnique(rows, { id: 'sog_ev_euri_2024_08_launch', title: 'Banking Circle launches EURI', subject_stablecoin_ids: ['sog_st_euri'], subject_organization_ids: ['sog_issuer_banking_circle'], evidence_ids: ['sog_src_euri_launch_2024'], event_detail_kind: 'launch', launch_detail: { summary: 'EURI official launch on 2024-08-26.', status: 'active' } }, file);
  appendUnique(rows, { id: 'sog_ev_eurq_2024_11_launch', title: 'Quantoz begins issuing EURQ', subject_stablecoin_ids: ['sog_st_eurq'], subject_organization_ids: ['sog_issuer_quantoz_payments'], evidence_ids: ['sog_src_eurq_issuance_start_2024'], event_detail_kind: 'launch', launch_detail: { summary: 'EURQ issuance began on 2024-11-18.', status: 'active' } }, file);
  writeJson(file, rows);
}

{
  const file = 'data/event-details-batch-h.json';
  const rows = readJson(file);
  appendUnique(rows, { id: 'sog_ev_usdy_2023_09_launch', title: 'Ondo introduces USDY', subject_stablecoin_ids: ['sog_st_usdy'], subject_organization_ids: ['sog_issuer_ondo_global_markets'], evidence_ids: ['sog_src_usdy_launch_2023'], event_detail_kind: 'launch', launch_detail: { summary: 'USDY official introduction on 2023-09-07.', status: 'active' } }, file);
  writeJson(file, rows);
}

// Primary launch evidence.
{
  const file = 'data/evidence-events-pr038.json';
  const rows = readJson(file);
  appendUnique(rows, {
    id: 'sog_src_crvusd_anniversary_launch_2025', stablecoin_id: 'sog_st_crvusd', issuer_id: 'sog_issuer_curve_finance', event_id: 'sog_ev_crvusd_launch_context', source_type: 'official_statement', title: 'crvUSD: 2 Years On', url: 'https://news.curve.finance/crvusd-2-years-on/', publisher: 'Curve Finance', published_at: '2025-05-14', archived_url: 'https://web.archive.org/web/*/https://news.curve.finance/crvusd-2-years-on/', accessed_at: today, reliability: 'high', claim_scope: 'official_launch_date_from_second_anniversary', stablecoin_ids: ['sog_st_crvusd'], organization_ids: ['sog_issuer_curve_finance'], event_ids: ['sog_ev_crvusd_launch_context'], claim_scopes: ['launch_date', 'second_anniversary'], notes: 'Curve’s dated article identifies May 14, 2025 as crvUSD’s second anniversary, establishing May 14, 2023 as the launch date.'
  }, file);
  writeJson(file, rows);
}

{
  const file = 'data/evidence-batch-j.json';
  const rows = readJson(file);
  appendUnique(rows, {
    id: 'sog_src_eurcv_launch_2023', stablecoin_id: 'sog_st_eurcv', issuer_id: 'sog_issuer_sg_forge', event_id: 'sog_ev_eurcv_2023_04_launch', source_type: 'official_launch_announcement', title: 'Societe Generale-FORGE launches CoinVertible', url: 'https://www.sgforge.com/societe-generale-forge-launches-coinvertible-the-first-institutional-stablecoin-deployed-on-a-public-blockchain/', publisher: 'Societe Generale-FORGE', published_at: '2023-04-20', archived_url: 'https://web.archive.org/web/*/https://www.sgforge.com/societe-generale-forge-launches-coinvertible-the-first-institutional-stablecoin-deployed-on-a-public-blockchain/', accessed_at: today, reliability: 'high', claim_scope: 'official_launch_date', stablecoin_ids: ['sog_st_eurcv'], organization_ids: ['sog_issuer_sg_forge'], event_ids: ['sog_ev_eurcv_2023_04_launch'], claim_scopes: ['launch_date', 'product_launch'], notes: 'Dated first-party launch release for EUR CoinVertible.'
  }, file);
  appendUnique(rows, {
    id: 'sog_src_euri_launch_2024', stablecoin_id: 'sog_st_euri', issuer_id: 'sog_issuer_banking_circle', event_id: 'sog_ev_euri_2024_08_launch', source_type: 'official_launch_announcement', title: 'Banking Circle launches EURI', url: 'https://www.bankingcircle.com/banking-circle-launches-the-first-bank-backed-mica-compliant-stablecoin-euri/', publisher: 'Banking Circle', published_at: '2024-08-26', archived_url: 'https://web.archive.org/web/*/https://www.bankingcircle.com/banking-circle-launches-the-first-bank-backed-mica-compliant-stablecoin-euri/', accessed_at: today, reliability: 'high', claim_scope: 'official_launch_date', stablecoin_ids: ['sog_st_euri'], organization_ids: ['sog_issuer_banking_circle'], event_ids: ['sog_ev_euri_2024_08_launch'], claim_scopes: ['launch_date', 'product_launch', 'mica_context'], notes: 'Dated first-party launch announcement for EURI.'
  }, file);
  appendUnique(rows, {
    id: 'sog_src_eurq_issuance_start_2024', stablecoin_id: 'sog_st_eurq', issuer_id: 'sog_issuer_quantoz_payments', event_id: 'sog_ev_eurq_2024_11_launch', source_type: 'official_launch_announcement', title: 'Quantoz Payments issues euro and US dollar stablecoins', url: 'https://www.quantoz.com/blog/quantoz-payments-issues-euro-and-us-dollar-stablecoins', publisher: 'Quantoz Payments', published_at: null, archived_url: 'https://web.archive.org/web/*/https://www.quantoz.com/blog/quantoz-payments-issues-euro-and-us-dollar-stablecoins', accessed_at: today, reliability: 'high', claim_scope: 'official_issuance_start_date', stablecoin_ids: ['sog_st_eurq'], organization_ids: ['sog_issuer_quantoz_payments'], event_ids: ['sog_ev_eurq_2024_11_launch'], claim_scopes: ['launch_date', 'issuance_start'], notes: 'Quantoz states that EURQ and USDQ issuance began on Monday, November 18, 2024; later exchange availability is not used as the launch date.'
  }, file);
  writeJson(file, rows);
}

{
  const file = 'data/evidence-batch-h.json';
  const rows = readJson(file);
  appendUnique(rows, {
    id: 'sog_src_usdy_launch_2023', stablecoin_id: 'sog_st_usdy', issuer_id: 'sog_issuer_ondo_global_markets', event_id: 'sog_ev_usdy_2023_09_launch', source_type: 'official_launch_announcement', title: 'Introducing Ondo US Dollar Yield (USDY)', url: 'https://ondo.finance/blog/introducing-ondo-usd-yield-usdy', publisher: 'Ondo Finance', published_at: '2023-09-07', archived_url: 'https://web.archive.org/web/*/https://ondo.finance/blog/introducing-ondo-usd-yield-usdy', accessed_at: today, reliability: 'high', claim_scope: 'official_product_introduction_date', stablecoin_ids: ['sog_st_usdy'], organization_ids: ['sog_issuer_ondo_global_markets'], event_ids: ['sog_ev_usdy_2023_09_launch'], claim_scopes: ['launch_date', 'product_introduction'], notes: 'Ondo’s official blog index dates the USDY introduction to September 7, 2023. Network-specific launches remain deployment events.'
  }, file);
  writeJson(file, rows);
}

// Maintain the launch-date audit as a historical review plus the live remaining queue.
{
  const file = 'docs/audits/remaining-launch-date-review.md';
  let text = fs.readFileSync(path.join(root, file), 'utf8');
  text = replaceRequired(text, 'Updated: 2026-06-18', 'Updated: 2026-06-19', 'launch review date');
  text = replaceRequired(text,
`Total reviewed: 38
Category A:       7
Category B:       5
Category C:      23
Category D:       3`,
`Original null-date queue reviewed: 38
Category A identified:              7
Promoted in Launch-date Batch O:     5
Category A remaining:                2
Category B:                           5
Category C:                          23
Category D:                           3
Remaining launch_date null:         33`,
'queue summary');
  text = text.replaceAll('| Batch O |', '| Promoted in Launch-date Batch O |');
  text = replaceRequired(text, '### PR #58 — Launch-date Batch O', '### Launch-date Batch O — complete', 'Batch O heading');
  text = replaceRequired(text, '### PR #59 — Launch-date Batch P', '### Launch-date Batch P — next', 'Batch P heading');
  text = replaceRequired(text, '### PR #60 — Launch-date Batch Q and unresolved freeze', '### Launch-date unresolved queue freeze', 'freeze heading');
  text = replaceRequired(text,
`PR #57 review scope: complete
Records classified: 38 / 38
Canonical data changed: no
Launch dates promoted: no
Next PR: #58 Launch-date Batch O`,
`Original review scope: complete
Records classified: 38 / 38
Canonical launch dates promoted in Batch O: 5
Remaining launch_date null: 33
Remaining category-A records: sUSDS, USDtb
Next work item: Launch-date Batch P`,
'completion state');
  fs.writeFileSync(path.join(root, file), text);
}

// Record-specific implementation review.
fs.writeFileSync(path.join(root, 'docs/audits/launch-date-batch-o-review.md'), `# Launch-date Batch O Review

Updated: 2026-06-19

## Scope

This batch promotes five previously reviewed category-A dates without changing the canonical stable-asset count.

| Asset | Canonical date | Launch boundary | Primary evidence |
|---|---:|---|---|
| crvUSD | 2023-05-14 | Curve’s official second-anniversary statement | Curve Finance — crvUSD: 2 Years On |
| EURCV | 2023-04-20 | SG-FORGE product launch | SG-FORGE launch release |
| EURI | 2024-08-26 | Banking Circle product launch | Banking Circle launch announcement |
| EURQ | 2024-11-18 | Quantoz issuance start | Quantoz issuance announcement |
| USDY | 2023-09-07 | Ondo product introduction | Ondo USDY introduction |

## Boundary decisions

- crvUSD uses the date implied directly by Curve’s dated second-anniversary statement, replacing the earlier approximate May 1 context date.
- EURQ uses the issuer’s stated issuance-start date. The November 21 exchange listing is a later distribution event.
- USDY uses the original product introduction. Network-specific launches remain deployments rather than a new canonical launch.
- Existing 2026 status-review events and later issuer-transition events remain intact; new launch events are added separately.

## Expected deterministic changes

\`\`\`text
Stable assets:             70 unchanged
Events:                    92 → 96
Event details:             92 → 96
Evidence:                 279 → 284
Missing launch dates:      38 → 33
Critical findings:          0
Warnings:                   0
\`\`\`

## Next work

Launch-date Batch P for sUSDS and USDtb.
`);

// Advance the canonical roadmap to the post-Batch-O state.
{
  const file = 'docs/roadmap.md';
  let text = fs.readFileSync(path.join(root, file), 'utf8');
  text = replaceRequired(text,
`Current \`main\` checkpoint before this roadmap realignment:

\`\`\`text
d2217291101a94826c968401e16520e35830abae
\`\`\``,
`Latest completed roadmap checkpoint:

\`\`\`text
a486618a5b499aa431c53a6b63b6ffa4015150b7
\`\`\``,
'roadmap checkpoint');
  text = replaceRequired(text, '92 events\n92 Event v2 detail records\n279 evidence records', '96 events\n96 Event v2 detail records\n284 evidence records', 'roadmap counts');
  text = replaceRequired(text, 'Missing canonical launch dates:            38', 'Missing canonical launch dates:            33', 'roadmap launch queue');
  text = replaceRequired(text,
`Current development stage:

\`\`\`text
Roadmap realignment after emergency repair
then Phase 1 — Launch-date quality work
\`\`\``,
`Current development stage:

\`\`\`text
Phase 1 — Launch-date quality work
\`\`\``,
'roadmap stage');
  text = replaceRequired(text,
`Current next action:

\`\`\`text
1. Realign this roadmap and defer Cloudflare production recheck to the count-growth gates
2. Launch-date Batch O
\`\`\``,
`Current next action:

\`\`\`text
1. Complete Launch-date Batch O in this change
2. Launch-date Batch P
\`\`\``,
'roadmap next action');
  text = replaceRequired(text, 'Status: **in progress**', 'Status: **complete in PR #67**', 'Phase 0 status');
  text = replaceRequired(text, 'Current queue: **38 records**', 'Current remaining queue: **33 records**', 'Phase 1 queue');
  text = replaceRequired(text, 'Status: **next after Phase 0**', 'Status: **complete in this change**', 'Batch O status');
  text = replaceRequired(text,
`Current: Roadmap realignment after emergency repair
Next:    Launch-date Batch O
Then:    Launch-date Batch P
Then:    Launch-date unresolved queue freeze
Then:    Historical terminal-date review`,
`Current: Launch-date Batch O — complete in this change
Next:    Launch-date Batch P
Then:    Launch-date unresolved queue freeze
Then:    Historical terminal-date review
Then:    Historical terminal-date resolution or freeze`,
'immediate work');
  fs.writeFileSync(path.join(root, file), text);
}

console.log('Applied Launch-date Batch O source changes.');
