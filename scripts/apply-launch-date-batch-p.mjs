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
  const file = 'data/stablecoins-batch-h.json';
  const rows = readJson(file);
  const row = requireRow(rows, 'sog_st_susds', file);
  row.launch_date = '2024-09-18';
  row.last_verified_at = today;
  row.notes = appendNote(row.notes, 'Launch-date Batch P records 2024-09-18 as the Sky Token and Product Launch activation date for sUSDS while preserving its relationship to legacy sDAI.');
  writeJson(file, rows);
}

{
  const file = 'data/stablecoins-batch-f.json';
  const rows = readJson(file);
  const row = requireRow(rows, 'sog_st_usdtb', file);
  row.launch_date = '2024-12-16';
  row.last_verified_at = today;
  row.notes = appendNote(row.notes, 'Launch-date Batch P uses Ethena’s official launch page together with Curve’s dated launch publication to establish 2024-12-16.');
  writeJson(file, rows);
}

// Add a distinct sUSDS launch event; retain the current-model event separately.
{
  const file = 'data/events-batch-h.json';
  const rows = readJson(file);
  appendUnique(rows, {
    id: 'sog_ev_susds_2024_09_launch',
    stablecoin_id: 'sog_st_susds',
    issuer_id: 'sog_issuer_makerdao_sky',
    event_type: 'launch',
    event_date: '2024-09-18',
    title: 'sUSDS activates in the Sky Token and Product Launch',
    description: 'Sky governance launch materials identify September 18, 2024 as the Token and Product Launch date that introduced and initialized sUSDS as the tokenized Sky Savings Rate product. The record remains linked to the continuing Maker/Sky and sDAI lineage.',
    impact_level: 'medium',
    confidence: 'high',
    source_count: 1,
    event_status_effect: 'none',
    recovered: null,
    recovery_date: null,
    failure_mechanism: 'product_launch',
    notes: 'Added in Launch-date Batch P; the existing current-model event remains separate.'
  }, file);
  writeJson(file, rows);
}

// Strengthen the existing USDtb launch event rather than creating a duplicate.
{
  const file = 'data/events-batch-f.json';
  const rows = readJson(file);
  const row = requireRow(rows, 'sog_ev_usdtb_launch', file);
  Object.assign(row, {
    event_type: 'launch',
    event_date: '2024-12-16',
    title: 'Ethena launches USDtb',
    description: 'Ethena launched USDtb on December 16, 2024 with tokenized U.S. Treasury fund products and a stablecoin liquidity reserve as backing. The date is supported by Ethena’s official launch page and Curve’s contemporaneous dated launch publication.',
    impact_level: 'medium',
    confidence: 'high',
    source_count: 4,
    event_status_effect: 'active',
    notes: 'Launch-date Batch P resolves the previous null date using the official launch page and dated ecosystem publication.'
  });
  writeJson(file, rows);
}

// Event details.
{
  const file = 'data/event-details-batch-h.json';
  const rows = readJson(file);
  appendUnique(rows, {
    id: 'sog_ev_susds_2024_09_launch',
    title: 'sUSDS activates in the Sky Token and Product Launch',
    subject_stablecoin_ids: ['sog_st_susds'],
    subject_organization_ids: ['sog_issuer_makerdao_sky'],
    evidence_ids: ['sog_src_susds_launch_activation_2024'],
    event_detail_kind: 'launch',
    launch_detail: {
      summary: 'sUSDS activation during the Sky Token and Product Launch on 2024-09-18.',
      status: 'active',
      related_stablecoin_ids: ['sog_st_sdai', 'sog_st_usds'],
      related_organization_ids: ['sog_issuer_makerdao_sky']
    }
  }, file);
  writeJson(file, rows);
}

{
  const file = 'data/event-details-batch-f.json';
  const rows = readJson(file);
  const row = requireRow(rows, 'sog_ev_usdtb_launch', file);
  row.evidence_ids = [
    'sog_src_usdtb_docs_batch_f',
    'sog_src_usdtb_launch_batch_f',
    'sog_src_usdtb_attestations_batch_f',
    'sog_src_usdtb_curve_launch_2024'
  ];
  row.event_detail_kind = 'launch';
  row.launch_detail = {
    summary: 'Ethena launched USDtb on 2024-12-16 as a treasury-fund-backed digital dollar with a stablecoin liquidity reserve.',
    status: 'active',
    related_organization_ids: ['sog_issuer_ethena_labs']
  };
  writeJson(file, rows);
}

// Primary launch evidence.
{
  const file = 'data/evidence-batch-h.json';
  const rows = readJson(file);
  appendUnique(rows, {
    id: 'sog_src_susds_launch_activation_2024',
    stablecoin_id: 'sog_st_susds',
    issuer_id: 'sog_issuer_makerdao_sky',
    event_id: 'sog_ev_susds_2024_09_launch',
    source_type: 'official_governance_proposal',
    title: 'Sky Protocol Launch Season: Token and Product Launch Parameter Proposal',
    url: 'https://forum.sky.money/t/sky-protocol-launch-season-token-and-product-launch-parameter-proposal/25031',
    publisher: 'Sky Governance',
    published_at: '2024-09-06',
    archived_url: 'https://web.archive.org/web/*/https://forum.sky.money/t/sky-protocol-launch-season-token-and-product-launch-parameter-proposal/25031',
    accessed_at: today,
    reliability: 'high',
    claim_scope: 'susds_product_launch_and_activation_date',
    stablecoin_ids: ['sog_st_susds', 'sog_st_usds', 'sog_st_sdai'],
    organization_ids: ['sog_issuer_makerdao_sky'],
    event_ids: ['sog_ev_susds_2024_09_launch'],
    claim_scopes: ['launch_date', 'product_activation', 'sky_savings_rate', 'lineage'],
    notes: 'Official Sky governance materials describe sUSDS as part of the Token and Product Launch and identify the September 18, 2024 launch date. The evidence preserves the continuing sDAI/USDS/Sky lineage.'
  }, file);
  writeJson(file, rows);
}

{
  const file = 'data/evidence-batch-f.json';
  const rows = readJson(file);
  const existing = requireRow(rows, 'sog_src_usdtb_launch_batch_f', file);
  existing.accessed_at = today;
  existing.notes = 'Official Ethena launch page establishing the product launch, paired with a dated Curve ecosystem publication for the exact 2024-12-16 boundary.';
  existing.claim_scopes = ['launch', 'product_identity', 'launch_date_support'];

  appendUnique(rows, {
    id: 'sog_src_usdtb_curve_launch_2024',
    stablecoin_id: 'sog_st_usdtb',
    issuer_id: 'sog_issuer_ethena_labs',
    event_id: 'sog_ev_usdtb_launch',
    source_type: 'official_ecosystem_publication',
    title: 'Ethena Leverages Curve Finance to Support USDtb Launch',
    url: 'https://news.curve.finance/ethena-usdtb-curve-launch/',
    publisher: 'Curve Finance',
    published_at: '2024-12-16',
    archived_url: 'https://web.archive.org/web/*/https://news.curve.finance/ethena-usdtb-curve-launch/',
    accessed_at: today,
    reliability: 'high',
    claim_scope: 'dated_usdtb_launch_confirmation',
    stablecoin_ids: ['sog_st_usdtb'],
    organization_ids: ['sog_issuer_ethena_labs'],
    event_ids: ['sog_ev_usdtb_launch'],
    claim_scopes: ['launch_date', 'product_launch', 'curve_distribution'],
    notes: 'Contemporaneous Curve publication dated 2024-12-16 states that Ethena launched USDtb and created launch liquidity pools. Used with Ethena’s official launch page.'
  }, file);
  writeJson(file, rows);
}

// Maintain the launch-date review as the live queue.
{
  const file = 'docs/audits/remaining-launch-date-review.md';
  let text = fs.readFileSync(path.join(root, file), 'utf8');
  text = replaceRequired(text,
`Original null-date queue reviewed: 38
Category A identified:              7
Promoted in Launch-date Batch O:     5
Category A remaining:                2
Category B:                           5
Category C:                          23
Category D:                           3
Remaining launch_date null:         33`,
`Original null-date queue reviewed: 38
Category A identified:              7
Promoted in Launch-date Batch O:     5
Promoted in Launch-date Batch P:     2
Category A remaining:                0
Category B:                           5
Category C:                          23
Category D:                           3
Remaining launch_date null:         31`,
'queue summary');
  text = text.replace('| sUSDS | `sog_st_susds` | 2024-09-18 | Sky Launch Season governance and activation materials identify 2024-09-18 as the product activation date. The record must preserve the relationship to sDAI rather than imply an unrelated lineage. | Batch P |', '| sUSDS | `sog_st_susds` | 2024-09-18 | Sky Launch Season governance and activation materials identify 2024-09-18 as the product activation date. The record preserves the relationship to sDAI rather than implying an unrelated lineage. | Promoted in Launch-date Batch P |');
  text = text.replace('| USDtb | `sog_st_usdtb` | 2024-12-16 | Ethena\'s official launch page and contemporaneous ecosystem launch material identify 2024-12-16 as the launch date. The exact publication metadata must be captured in evidence before promotion. | Batch P |', '| USDtb | `sog_st_usdtb` | 2024-12-16 | Ethena\'s official launch page and Curve\'s contemporaneous dated launch publication identify 2024-12-16 as the launch date. | Promoted in Launch-date Batch P |');
  text = replaceRequired(text, '### Launch-date Batch P — next', '### Launch-date Batch P — complete', 'Batch P heading');
  text = replaceRequired(text,
`Original review scope: complete
Records classified: 38 / 38
Canonical launch dates promoted in Batch O: 5
Remaining launch_date null: 33
Remaining category-A records: sUSDS, USDtb
Next work item: Launch-date Batch P`,
`Original review scope: complete
Records classified: 38 / 38
Canonical launch dates promoted in Batch O: 5
Canonical launch dates promoted in Batch P: 2
Remaining launch_date null: 31
Remaining category-A records: none
Next work item: Launch-date unresolved queue freeze`,
'completion state');
  fs.writeFileSync(path.join(root, file), text);
}

fs.writeFileSync(path.join(root, 'docs/audits/launch-date-batch-p-review.md'), `# Launch-date Batch P Review

Updated: 2026-06-19

## Scope

This batch promotes the final two category-A launch dates from the 38-record review while preserving the 70-record canonical checkpoint.

| Asset | Canonical date | Launch boundary | Primary evidence |
|---|---:|---|---|
| sUSDS | 2024-09-18 | Sky Token and Product Launch activation | Sky governance launch proposal and approval trail |
| USDtb | 2024-12-16 | Ethena product launch | Ethena launch page plus Curve’s dated launch publication |

## Boundary decisions

- sUSDS is recorded as a product activation inside the continuing Maker/Sky lineage. The new launch event does not replace the separate current-model event and does not imply that sDAI ceased on the same date.
- USDtb updates the existing launch event rather than creating a duplicate. Ethena’s official page establishes the launch, while the dated Curve publication fixes the exact day.
- Neither date changes the canonical stable-asset count or creates a new issuer record.

## Expected deterministic changes

\`\`\`text
Stable assets:             70 unchanged
Events:                    96 → 97
Event details:             96 → 97
Evidence:                 284 → 286
Missing launch dates:      33 → 31
Critical findings:          0
Warnings:                   0
\`\`\`

## Next work

Launch-date unresolved queue freeze for the remaining category B, C, and D records.
`);

// Advance the roadmap to the post-Batch-P state.
{
  const file = 'docs/roadmap.md';
  let text = fs.readFileSync(path.join(root, file), 'utf8');
  text = replaceRequired(text,
`Latest completed roadmap checkpoint:

\`\`\`text
a486618a5b499aa431c53a6b63b6ffa4015150b7
\`\`\``,
`Latest completed data checkpoint:

\`\`\`text
PR #69 — Launch-date Batch O
Merge: 1b12963bbe7e5d1bb0653842e6b57a86357e63bc
\`\`\``,
'checkpoint');
  text = replaceRequired(text, '96 events\n96 Event v2 detail records\n284 evidence records', '97 events\n97 Event v2 detail records\n286 evidence records', 'registry counts');
  text = replaceRequired(text, 'Missing canonical launch dates:            33', 'Missing canonical launch dates:            31', 'launch queue');
  text = replaceRequired(text,
`PR #55 — Add official USDe launch date
PR #56 — Anchor the 70-to-100 execution roadmap
PR #57 — Audit and classify the remaining launch-date queue`,
`PR #55 — Add official USDe launch date
PR #56 — Anchor the 70-to-100 execution roadmap
PR #57 — Audit and classify the remaining launch-date queue
PR #69 — Complete Launch-date Batch O`,
'completed record work');
  text = replaceRequired(text,
`1. Complete Launch-date Batch O in this change
2. Launch-date Batch P`,
`1. Complete Launch-date Batch P in this change
2. Launch-date unresolved queue freeze`,
'next action');
  text = replaceRequired(text, 'Current remaining queue: **33 records**', 'Current remaining queue: **31 records**', 'Phase 1 queue');
  text = replaceRequired(text, 'Status: **complete in this change**', 'Status: **complete in PR #69**', 'Batch O status');
  text = replaceRequired(text,
`## Launch-date Batch P

Apply the remaining two currently approved category-A dates:`,
`## Launch-date Batch P

Status: **complete in this change**

Apply the remaining two currently approved category-A dates:`,
'Batch P status');
  text = replaceRequired(text,
`Current: Launch-date Batch O — complete in this change
Next:    Launch-date Batch P
Then:    Launch-date unresolved queue freeze
Then:    Historical terminal-date review
Then:    Historical terminal-date resolution or freeze`,
`Current: Launch-date Batch P — complete in this change
Next:    Launch-date unresolved queue freeze
Then:    Historical terminal-date review
Then:    Historical terminal-date resolution or freeze
Then:    Fiat-backed income profiles`,
'immediate work');
  fs.writeFileSync(path.join(root, file), text);
}

console.log('Applied Launch-date Batch P source changes.');
