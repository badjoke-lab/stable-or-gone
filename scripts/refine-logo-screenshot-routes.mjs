#!/usr/bin/env node
import fs from 'node:fs';

const targetPath = 'scripts/capture-site-screenshots.mjs';
const workflowPath = '.github/workflows/refine-logo-screenshot-routes.yml';
const scriptPath = 'scripts/refine-logo-screenshot-routes.mjs';

const replaceRequired = (source, before, after, label) => {
  if (source.includes(after)) return source;
  if (!source.includes(before)) throw new Error(`${label} marker missing`);
  return source.replace(before, after);
};

let source = fs.readFileSync(targetPath, 'utf8');
source = replaceRequired(
  source,
  "    const shouldSample = family.forced || familyRoutes.length > 8;\n    const chosen = shouldSample ? quantileSample(entries, samplesPerFamily) : entries;",
  "    const shouldSample = family.forced || familyRoutes.length > 8;\n    const chosen = family.name === 'stablecoin-detail'\n      ? entries.filter((entry) => REQUIRED_REPRESENTATIVE_ROUTES.includes(entry.route))\n      : shouldSample ? quantileSample(entries, samplesPerFamily) : entries;",
  'bounded stablecoin representative family'
);
source = replaceRequired(
  source,
  "  const requiredRoutes = REQUIRED_REPRESENTATIVE_ROUTES.filter((route) => routes.includes(route));\n  return { routes: [...new Set([...selected, ...requiredRoutes])].sort(), families };",
  "  return { routes: [...new Set(selected)].sort(), families };",
  'remove additive representative routes'
);

fs.writeFileSync(targetPath, source);
for (const file of [scriptPath, workflowPath]) {
  if (fs.existsSync(file)) fs.rmSync(file);
}
console.log(JSON.stringify({ targetPath, stablecoinDetailSamples: 3 }, null, 2));
