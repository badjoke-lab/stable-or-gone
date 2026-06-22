import fs from 'node:fs';

const file = 'data/generated/registry-stats.json';
const stats = JSON.parse(fs.readFileSync(file, 'utf8'));
stats.baseline_id = 'sog_registry_v2_post_category_b_launch_dates_2026_06_22';
stats.registry.events = 111;
stats.registry.event_details = 111;
stats.registry.evidence = 337;
fs.writeFileSync(file, `${JSON.stringify(stats, null, 2)}\n`);
console.log('Category B registry stats synchronized');
