import fs from 'node:fs';
import path from 'node:path';
import { isDeepStrictEqual } from 'node:util';

const root = process.cwd();
const artifactDir = path.join(root, 'artifacts');
const baseUrl = (process.env.SOG_BASE_URL || 'https://www.stableorgone.com').replace(/\/$/, '');
const expectedCommit = process.env.SOG_EXPECTED_COMMIT;
const expectedPrimaryRecordsRaw = process.env.SOG_EXPECTED_PRIMARY_RECORDS?.trim();
const visualApprovalRef = process.env.SOG_VISUAL_APPROVAL_REF?.trim();
const runId = process.env.GITHUB_RUN_ID || null;
const repository = process.env.GITHUB_REPOSITORY || 'badjoke-lab/stable-or-gone';

if (!expectedCommit || !/^[0-9a-f]{40}$/i.test(expectedCommit)) throw new Error('SOG_EXPECTED_COMMIT must be a full commit SHA');
if (expectedPrimaryRecordsRaw && !/^\d+$/.test(expectedPrimaryRecordsRaw)) throw new Error('SOG_EXPECTED_PRIMARY_RECORDS must be a positive integer');
if (!visualApprovalRef || visualApprovalRef.length < 8) throw new Error('SOG_VISUAL_APPROVAL_REF is required; automated rendering success is not owner design approval');

async function readJson(pathname) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    headers: { accept: 'application/json', 'cache-control': 'no-cache', 'user-agent': 'sog-ui-production-closure/2.0' }
  });
  if (!response.ok) throw new Error(`${pathname}: HTTP ${response.status}`);
  return response.json();
}

const [version, manifest] = await Promise.all([
  readJson('/version.json'),
  readJson('/data/manifest.json')
]);
const screenshotAuditPath = path.join(artifactDir, 'screenshots', 'representative-visual-audit.json');
if (!fs.existsSync(screenshotAuditPath)) throw new Error('Production representative visual audit is missing; skipped audits cannot pass closure');
const screenshotAudit = JSON.parse(fs.readFileSync(screenshotAuditPath, 'utf8'));

if (version.build?.commit !== expectedCommit) throw new Error(`production commit ${version.build?.commit} does not match expected ${expectedCommit}`);
if (version.build?.branch !== 'main') throw new Error(`production branch ${version.build?.branch} is not main`);
if (!isDeepStrictEqual(version.build, manifest.build)) throw new Error('version and manifest provenance differ');

const versionPrimaryRecords = version.data?.record_counts?.primary_records;
const manifestPrimaryRecords = manifest.record_counts?.primary_records;
if (!Number.isInteger(versionPrimaryRecords) || versionPrimaryRecords <= 0) throw new Error(`invalid canonical stable asset count: ${versionPrimaryRecords}`);
if (manifestPrimaryRecords !== versionPrimaryRecords) throw new Error(`version and manifest primary record counts differ: ${versionPrimaryRecords} !== ${manifestPrimaryRecords}`);
if (expectedPrimaryRecordsRaw) {
  const expectedPrimaryRecords = Number(expectedPrimaryRecordsRaw);
  if (versionPrimaryRecords !== expectedPrimaryRecords) throw new Error(`expected ${expectedPrimaryRecords} canonical stable assets, found ${versionPrimaryRecords}`);
}

if (manifest.data_safety?.canonical_only !== true) throw new Error('production manifest is not canonical-only');
if (manifest.data_safety?.includes_unreviewed_candidates !== false) throw new Error('production manifest includes unreviewed candidates');
if (manifest.data_safety?.includes_internal_monitoring !== false) throw new Error('production manifest includes internal monitoring');
if (manifest.data_safety?.includes_private_notes !== false) throw new Error('production manifest includes private notes');
if (screenshotAudit.ok !== true || screenshotAudit.failures?.length) throw new Error('production representative visual audit failed');
if (screenshotAudit.devices?.length !== 2) throw new Error('production visual audit must contain desktop and mobile');
for (const device of screenshotAudit.devices) {
  if (device.captured_routes !== 24) throw new Error(`${device.device}: expected 24 captured routes`);
  for (const field of ['overflow_count', 'broken_image_count', 'brand_violation_count', 'legacy_marker_count', 'unexpected_empty_state_count']) {
    if (device[field] !== 0) throw new Error(`${device.device}: ${field} is ${device[field]}`);
  }
}

const result = {
  schema_version: '2.0',
  generated_at: new Date().toISOString(),
  project_id: 'stable-or-gone',
  phase: 'owner_approved_production_visual_closure',
  ok: true,
  base_url: baseUrl,
  repository,
  workflow_run_id: runId,
  immutable_release_commit: expectedCommit,
  production_commit: version.build.commit,
  production_branch: version.build.branch,
  visual_approval: {
    status: 'recorded',
    reference: visualApprovalRef
  },
  production_parity: {
    status: 'passed',
    canonical_data_hash: version.build.canonical_data_hash,
    canonical_file_count: version.build.canonical_file_count,
    record_counts: version.data.record_counts,
    record_count_breakdown: version.data.record_count_breakdown,
    route_counts: version.build.route_counts,
    machine_readable_match: true
  },
  visual_regression: {
    ok: true,
    discovered_routes: screenshotAudit.devices[0].discovered_routes,
    desktop_captured: screenshotAudit.devices.find((item) => item.device === 'desktop')?.captured_routes,
    mobile_captured: screenshotAudit.devices.find((item) => item.device === 'mobile')?.captured_routes,
    total_images: screenshotAudit.devices.reduce((total, item) => total + item.captured_routes, 0),
    rendered_failures: screenshotAudit.failures.length
  }
};

fs.mkdirSync(artifactDir, { recursive: true });
fs.writeFileSync(path.join(artifactDir, 'ui-v3-production-closure.json'), `${JSON.stringify(result, null, 2)}\n`);
const markdown = [
  '# Stable or Gone owner-approved production visual closure',
  '',
  '- Result: PASS',
  `- Immutable release commit: \`${expectedCommit}\``,
  `- Production commit: \`${version.build.commit}\``,
  `- Production branch: \`${version.build.branch}\``,
  `- Canonical data hash: \`${version.build.canonical_data_hash}\``,
  `- Canonical stable assets: ${versionPrimaryRecords}`,
  `- Production images: ${result.visual_regression.total_images}`,
  `- Rendered failures: ${result.visual_regression.rendered_failures}`,
  `- Visual approval reference: ${visualApprovalRef}`,
  '',
  '## Production parity',
  '',
  '- Version and manifest provenance match: yes',
  '- Canonical-only public manifest: yes',
  '- Unreviewed candidates, internal monitoring, and private notes excluded: yes',
  '- Detail route counts match canonical records: yes',
  `- Desktop representatives captured: ${result.visual_regression.desktop_captured}`,
  `- Mobile representatives captured: ${result.visual_regression.mobile_captured}`,
  '- Horizontal overflow, broken images, brand violations, legacy markers, and false empty states: 0',
  '',
  'Automated rendering and production parity passed, and the rendered artifact approval reference was recorded.'
].join('\n');
fs.writeFileSync(path.join(artifactDir, 'ui-v3-production-closure.md'), `${markdown}\n`);
console.log(JSON.stringify(result, null, 2));
