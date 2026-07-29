#!/usr/bin/env node
import fs from 'node:fs';

const targetPath = 'scripts/capture-site-screenshots.mjs';
const workflowPath = '.github/workflows/apply-logo-screenshot-routes.yml';
const scriptPath = 'scripts/apply-logo-screenshot-routes.mjs';

const replaceRequired = (source, before, after, label) => {
  if (source.includes(after)) return source;
  if (!source.includes(before)) throw new Error(`${label} marker missing`);
  return source.replace(before, after);
};

let source = fs.readFileSync(targetPath, 'utf8');
source = replaceRequired(
  source,
  "const DETAIL_FAMILIES = [\n  ['stablecoin-detail', '/stablecoin/'],\n  ['issuer-detail', '/issuer/'],\n  ['event-detail', '/event/'],\n  ['guide-detail', '/guides/']\n];",
  "const DETAIL_FAMILIES = [\n  ['stablecoin-detail', '/stablecoin/'],\n  ['issuer-detail', '/issuer/'],\n  ['event-detail', '/event/'],\n  ['guide-detail', '/guides/']\n];\nconst REQUIRED_REPRESENTATIVE_ROUTES = [\n  '/stablecoin/usdt/',\n  '/stablecoin/usdc/',\n  '/stablecoin/dai/'\n];",
  'representative logo routes constant'
);
source = replaceRequired(
  source,
  "  return { routes: [...new Set(selected)].sort(), families };",
  "  const requiredRoutes = REQUIRED_REPRESENTATIVE_ROUTES.filter((route) => routes.includes(route));\n  return { routes: [...new Set([...selected, ...requiredRoutes])].sort(), families };",
  'representative route merge'
);

fs.writeFileSync(targetPath, source);
for (const file of [scriptPath, workflowPath]) {
  if (fs.existsSync(file)) fs.rmSync(file);
}
console.log(JSON.stringify({ targetPath, requiredRoutes: 3 }, null, 2));
