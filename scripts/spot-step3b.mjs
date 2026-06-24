import fs from 'node:fs';
const file = 'data/deployments-batch-b.json';
const rows = JSON.parse(fs.readFileSync(file, 'utf8'));
const row = rows.find((item) => item.id === 'sog_dep_spot_base');
if (!row) throw new Error('missing sog_dep_spot_base');
row.canonicality = 'canonical_bridge';
row.origin_deployment_id = 'sog_dep_spot_ethereum';
fs.writeFileSync(file, `${JSON.stringify(rows, null, 2)}\n`);
