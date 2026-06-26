import fs from 'node:fs';
import path from 'node:path';
import { publicTaxonomy } from '../config/public-taxonomy.mjs';

const root = process.cwd();
const output = path.join(root, 'data/generated/public-taxonomy-registry.json');
const value = {
  ...publicTaxonomy,
  generated_at: new Date().toISOString(),
  axis_counts: Object.fromEntries(Object.entries(publicTaxonomy.axes).map(([axis, definition]) => [axis, definition.entries.length])),
  legacy_rule_counts: Object.fromEntries(Object.entries(publicTaxonomy.legacy_value_rules).map(([axis, rules]) => [axis, rules.length]))
};

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(value, null, 2)}\n`);
console.log(JSON.stringify({ ok: true, registry_id: value.registry_id, axes: Object.keys(value.axes).length }, null, 2));
