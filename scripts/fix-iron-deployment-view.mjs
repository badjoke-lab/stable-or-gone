import fs from 'node:fs';

const path = 'docs/migration/registry-v3-view-67.json';
const view = JSON.parse(fs.readFileSync(path, 'utf8'));
view.minimum_count = 117;
fs.writeFileSync(path, `${JSON.stringify(view, null, 2)}\n`);
