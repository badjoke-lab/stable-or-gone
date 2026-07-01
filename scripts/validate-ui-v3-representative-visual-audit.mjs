import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const capture = read('scripts/capture-site-screenshots.mjs');
const audit = read('scripts/audit-representative-visuals.mjs');
const workflow = read('.github/workflows/capture-screenshots.yml');
const routes = JSON.parse(read('config/public-routes.json')).routes;
const auditDoc = read('docs/audits/ui-v3-representative-visual-audit-2026-07-02.md');
const failures = [];
const check = (value, message) => { if (!value) failures.push(message); };

check(routes.length === 12, 'the unique representative route list must contain twelve routes');
for (const route of ['/', '/stablecoins/', '/issuers/', '/events/', '/models/', '/guides/', '/glossary/', '/methodology/', '/updates/', '/about/', '/support/', '/contact/']) check(routes.includes(route), `unique route missing: ${route}`);
for (const marker of [
  "['stablecoin-detail', '/stablecoin/']",
  "['issuer-detail', '/issuer/']",
  "['event-detail', '/event/']",
  "['guide-detail', '/guides/']",
  "samples-per-family', '3'",
  'measurePage',
  'horizontalOverflowPx',
  'brokenImages',
  'brandViolations',
  'legacyVisualMarkers',
  'unexpectedEmptyStates',
  "schema_version: '2.0'"
]) check(capture.includes(marker), `capture contract marker missing: ${marker}`);
for (const marker of [
  "const DEVICES = ['desktop', 'mobile']",
  "const REQUIRED_FAMILIES = ['stablecoin-detail', 'issuer-detail', 'event-detail', 'guide-detail']",
  "gate: 'V3-F'",
  'required unique route not captured',
  'needs at least three representatives',
  'horizontal overflow on',
  'broken images on',
  'unapproved brand asset',
  'legacy visual marker',
  'false initial empty state',
  'representative-visual-audit.json',
  'representative-visual-audit.md'
]) check(audit.includes(marker), `audit contract marker missing: ${marker}`);
for (const marker of ['pull_request:', 'CAPTURE_DEVICE', "'all'", "'representative'", 'audit-representative-visuals.mjs', 'representative-visual-audit.json', 'representative-visual-audit.md']) check(workflow.includes(marker), `screenshot workflow marker missing: ${marker}`);
for (const marker of ['Roadmap item: PR #271', 'Gate V3-F', 'desktop', 'mobile', 'three stablecoin', 'three organization', 'three event', 'three guide', 'Canonical stable assets changed: 0']) check(auditDoc.includes(marker), `visual audit document missing: ${marker}`);

const result = { schema_version: '1.0', ok: failures.length === 0, gate: 'V3-F', unique_routes: routes.length, repeated_families: 4, samples_per_family: 3, failures };
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
