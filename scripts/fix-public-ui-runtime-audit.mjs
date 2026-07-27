#!/usr/bin/env node
import fs from 'node:fs';

const auditPath = 'scripts/audit-public-typography-enums-direct.mjs';
let source = fs.readFileSync(auditPath, 'utf8');

const replacements = [
  ["const badgeSelector = '.chip, [class*=\"badge\"], [class*=\"status-chip\"], [data-tone]';", "const badgeSelector = '.chip, [class*=\"badge\"], [class*=\"status-chip\"], [data-tone], .home-status-label, .update-feed-category, .ar-chip, .ar-lifecycle';"],
  ["link: resolvedCustomColor('--ui-link-hover')", "link: resolvedCustomColor('--ui-hover')"]
];

for (const [before, after] of replacements) {
  if (source.includes(before)) source = source.replace(before, after);
  else if (!source.includes(after)) throw new Error(`runtime audit marker missing: ${before}`);
}

fs.writeFileSync(auditPath, source);
console.log(JSON.stringify({ auditPath, replacements: replacements.length }, null, 2));
