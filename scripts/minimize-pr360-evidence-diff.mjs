import {execFileSync} from 'node:child_process';
import fs from 'node:fs';

const outcomes = JSON.parse(fs.readFileSync('docs/migration/evidence-correction-outcomes-pr360.json','utf8'));
const expectedArchives = new Map(outcomes.outcomes
  .filter((row) => row.new_value?.archived_url)
  .map((row) => [row.evidence_id, row.new_value.archived_url]));
const removeArchive = new Set(outcomes.outcomes
  .filter((row) => row.new_value?.archived_url === null)
  .map((row) => row.evidence_id));

function rowsOf(value, file) {
  const rows = Array.isArray(value) ? value : value.records;
  if (!Array.isArray(rows)) throw new Error(`${file}: expected array or {records: []}`);
  return rows;
}

for (const file of outcomes.changed_files) {
  const baseText = execFileSync('git', ['show', `origin/main:${file}`], {encoding:'utf8'});
  const baseValue = JSON.parse(baseText);
  const rows = rowsOf(baseValue, file);
  for (const row of rows) {
    if (expectedArchives.has(row.id)) row.archived_url = expectedArchives.get(row.id);
    if (removeArchive.has(row.id)) delete row.archived_url;
  }
  let output;
  const compactRows = /^\s*\{"id"/m.test(baseText);
  if (Array.isArray(baseValue) && compactRows) {
    output = `[\n${rows.map((row) => `  ${JSON.stringify(row)}`).join(',\n')}\n]\n`;
  } else if (!Array.isArray(baseValue) && compactRows) {
    output = `${JSON.stringify({...baseValue, records: rows}, null, 2)}\n`;
  } else {
    output = `${JSON.stringify(Array.isArray(baseValue) ? rows : {...baseValue, records: rows}, null, 2)}\n`;
  }
  fs.writeFileSync(file, output);
}

console.log(JSON.stringify({ok:true, files:outcomes.changed_files}, null, 2));
