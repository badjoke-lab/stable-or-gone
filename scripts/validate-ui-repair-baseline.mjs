import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const errors = [];
const read = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
const check = (condition, message) => { if (!condition) errors.push(message); };
const recordsFromJson = (relativePath) => {
  const value = read(relativePath);
  if (Array.isArray(value)) return value;
  if (Array.isArray(value.records)) return value.records;
  throw new Error(`${relativePath}: expected an array or { records: [] }`);
};

const repair = read('docs/ui-redesign/repair-baseline.json');
const registryV3 = read('docs/migration/registry-v3-baseline.json');
const stats = read(repair.canonical.stats);
const audit = read(repair.canonical.integrity_audit);
const registryV2 = loadRegistryV2Baseline(root);
const group = (name) => (registryV2.data_groups?.[name] ?? []).flatMap(recordsFromJson);
const canonicalCount = (counts, key) => counts?.[key] ?? (key === 'evidence_relations' ? counts?.evidence : undefined);

check(repair.schema_version === '1.0', 'repair baseline schema_version must be 1.0');
check(repair.baseline_id === 'sog_ui_repair_baseline_2026_06_26', 'unexpected repair baseline id');
check(/^\d{4}-\d{2}-\d{2}$/.test(repair.recorded_at ?? ''), 'repair baseline recorded_at must be YYYY-MM-DD');
check(Array.isArray(repair.governing_documents) && repair.governing_documents.length >= 6, 'governing document list is incomplete');

for (const [key, expected] of Object.entries(repair.canonical.counts)) {
  check(canonicalCount(stats.registry, key) === expected, `generated stats count mismatch: ${key}`);
  check(canonicalCount(audit.counts, key) === expected, `integrity audit count mismatch: ${key}`);
  check(canonicalCount(registryV3.expected_counts, key) === expected, `Registry v3 baseline count mismatch: ${key}`);
}

for (const [key, expected] of Object.entries(repair.canonical.coverage)) {
  const statsCovered = stats.coverage?.[key]?.covered;
  const auditCovered = audit.coverage?.[key]?.covered;
  check(statsCovered === expected || auditCovered === expected, `coverage mismatch: ${key}`);
}

const routeCounts = repair.generated_expectations.detail_routes;
check(routeCounts.stablecoins === repair.canonical.counts.stablecoins, 'stablecoin route expectation must match canonical count');
check(routeCounts.organizations === repair.canonical.counts.organizations, 'organization route expectation must match canonical count');
check(routeCounts.events === repair.canonical.counts.events, 'event route expectation must match canonical count');
check(routeCounts.total === routeCounts.stablecoins + routeCounts.organizations + routeCounts.events, 'detail route total mismatch');

const sitemapCounts = repair.generated_expectations.sitemap_detail_urls;
check(sitemapCounts.stablecoins === routeCounts.stablecoins, 'sitemap stablecoin count must match route expectation');
check(sitemapCounts.organizations === routeCounts.organizations, 'sitemap organization count must match route expectation');
check(sitemapCounts.events === routeCounts.events, 'sitemap event count must match route expectation');
check(sitemapCounts.total === routeCounts.total, 'sitemap total must match detail route total');

const primary = repair.generated_expectations.machine_readable_primary_counts;
check(primary.primary_records === repair.canonical.counts.stablecoins, 'machine-readable primary count mismatch');
check(primary.events === repair.canonical.counts.events, 'machine-readable event count mismatch');
check(primary.evidence === repair.canonical.counts.evidence, 'machine-readable evidence count mismatch');

const production = repair.production_snapshot;
check(production.status === 'split_generation', 'initial production snapshot must record split_generation');
check(production.html.home.stablecoins !== repair.canonical.counts.stablecoins, 'HTML snapshot must preserve the observed canonical mismatch');
check(production.machine_readable.stablecoins !== production.html.home.stablecoins, 'machine-readable and HTML snapshot layers must remain distinct');
check(Boolean(production.machine_readable.build_commit), 'production machine-readable build commit missing');
check(Boolean(production.machine_readable.generated_at), 'production machine-readable generated_at missing');
check(production.sitemap.verification_state === 'not_captured_in_initial_external_snapshot', 'initial sitemap verification state changed unexpectedly');

const stablecoins = group('stablecoins');
const stablecoinById = new Map(stablecoins.map((row) => [row.id, row]));
check(stablecoins.length === repair.canonical.counts.stablecoins, `runtime baseline stablecoin count ${stablecoins.length} does not match repair baseline`);

for (const representative of repair.representative_records ?? []) {
  const row = stablecoinById.get(representative.id);
  check(Boolean(row), `representative record missing: ${representative.id}`);
  if (row) check(row.slug === representative.slug, `representative slug mismatch: ${representative.id}`);
  check(Array.isArray(representative.coverage_tags) && representative.coverage_tags.length > 0, `representative tags missing: ${representative.id}`);
}

const representedTags = new Set((repair.representative_records ?? []).flatMap((row) => row.coverage_tags ?? []));
for (const tag of repair.required_representative_tags ?? []) {
  check(representedTags.has(tag), `required representative tag is uncovered: ${tag}`);
}

const defects = repair.known_defects ?? [];
const defectIds = new Set();
for (const defect of defects) {
  check(/^SOG-UI-\d{3}$/.test(defect.id ?? ''), `invalid defect id: ${defect.id}`);
  check(!defectIds.has(defect.id), `duplicate defect id: ${defect.id}`);
  defectIds.add(defect.id);
  check(['blocker', 'high', 'medium', 'low'].includes(defect.severity), `invalid severity: ${defect.id}`);
  check(defect.status === 'confirmed', `baseline defect must be confirmed: ${defect.id}`);
  check(Boolean(defect.title && defect.evidence), `defect title or evidence missing: ${defect.id}`);
  check(Array.isArray(defect.target_prs) && defect.target_prs.length > 0, `target PR mapping missing: ${defect.id}`);
}

for (const required of ['SOG-UI-001', 'SOG-UI-008', 'SOG-UI-011', 'SOG-UI-012']) {
  check(defectIds.has(required), `required blocking defect missing: ${required}`);
}

if (errors.length > 0) {
  console.error('UI repair baseline validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  baseline_id: repair.baseline_id,
  canonical_counts: repair.canonical.counts,
  detail_routes: routeCounts,
  confirmed_defects: defects.length,
  representative_records: repair.representative_records.length,
  production_snapshot_status: production.status
}, null, 2));
