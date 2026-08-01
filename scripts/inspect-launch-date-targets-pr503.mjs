import fs from 'node:fs';
import path from 'node:path';

const targets = [
  'sog_st_msusd',
  'sog_st_stablesusdx',
  'sog_st_susde',
  'sog_st_usd1',
  'sog_st_usdm',
  'sog_st_usdh'
];
const targetSet = new Set(targets);
const files = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith('.json')) files.push(full);
  }
};
walk('data');

const output = Object.fromEntries(targets.map((id) => [id, {
  canonical_rows: [],
  evidence_rows: [],
  review_dispositions: []
}]));

const visit = (value, file, pointer = '$') => {
  if (Array.isArray(value)) {
    value.forEach((item, index) => visit(item, file, `${pointer}[${index}]`));
    return;
  }
  if (!value || typeof value !== 'object') return;

  const directIds = new Set([
    value.id,
    value.stablecoin_id,
    value.proposed_record_id,
    ...(Array.isArray(value.stablecoin_ids) ? value.stablecoin_ids : []),
    ...(Array.isArray(value.subject_stablecoin_ids) ? value.subject_stablecoin_ids : [])
  ].filter(Boolean));

  for (const id of directIds) {
    if (!targetSet.has(id)) continue;
    if (value.id === id || value.stablecoin_id === id || value.proposed_record_id === id) {
      const picked = {};
      for (const key of ['id','stablecoin_id','proposed_record_id','slug','name','symbol','status','launch_date','last_reviewed','last_verified_at','title','description','event_type','event_date','topic','reason_code','best_known_range','review_note','last_checked_at']) {
        if (value[key] !== undefined) picked[key] = value[key];
      }
      output[id].canonical_rows.push({ file, pointer, row: picked });
    }
    if (typeof value.url === 'string') {
      output[id].evidence_rows.push({
        file,
        pointer,
        id: value.id ?? null,
        title: value.title ?? null,
        source_type: value.source_type ?? value.type ?? null,
        publisher: value.publisher ?? null,
        url: value.url,
        published_at: value.published_at ?? null,
        reliability: value.reliability ?? null,
        claim_scopes: value.claim_scopes ?? [value.claim_scope].filter(Boolean)
      });
    }
    if (typeof value.decision === 'string' || Array.isArray(value.reviewed_sources)) {
      output[id].review_dispositions.push({
        file,
        pointer,
        decision: value.decision ?? null,
        best_known_range: value.best_known_range ?? null,
        reason_code: value.reason_code ?? null,
        review_note: value.review_note ?? null,
        reviewed_sources: value.reviewed_sources ?? []
      });
    }
  }

  for (const [key, child] of Object.entries(value)) visit(child, file, `${pointer}.${key}`);
};

for (const file of files.sort()) {
  let parsed;
  try { parsed = JSON.parse(fs.readFileSync(file, 'utf8')); } catch { continue; }
  visit(parsed, file);
}

for (const id of targets) {
  const dedupe = (rows) => [...new Map(rows.map((row) => [JSON.stringify(row), row])).values()];
  output[id].canonical_rows = dedupe(output[id].canonical_rows);
  output[id].evidence_rows = dedupe(output[id].evidence_rows);
  output[id].review_dispositions = dedupe(output[id].review_dispositions);
}

const report = { generated_at: '2026-08-01', targets, records: output };
fs.mkdirSync('docs/migration', { recursive: true });
fs.writeFileSync('docs/migration/launch-date-target-inspection-pr503.json', `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({
  ok: true,
  counts: Object.fromEntries(targets.map((id) => [id, {
    canonical_rows: output[id].canonical_rows.length,
    evidence_rows: output[id].evidence_rows.length,
    review_dispositions: output[id].review_dispositions.length
  }]))
}, null, 2));
