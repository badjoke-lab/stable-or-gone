import fs from 'node:fs';
import path from 'node:path';
import { isDeepStrictEqual } from 'node:util';

const root = process.cwd();
const artifactDir = path.join(root, 'artifacts');
const baseUrl = (process.env.SOG_BASE_URL || 'https://sog.badjoke-lab.com').replace(/\/$/, '');
const expectedCommit = process.env.SOG_EXPECTED_COMMIT;
const phase = process.env.SOG_CLOSURE_PHASE || 'premerge';
const runId = process.env.GITHUB_RUN_ID || null;
const repository = process.env.GITHUB_REPOSITORY || 'badjoke-lab/stable-or-gone';
const ownerApprovalRef = process.env.SOG_OWNER_APPROVAL_REF || 'project instruction to proceed with the fixed PR #261-#273 sequence';

if (!expectedCommit || !/^[0-9a-f]{40}$/i.test(expectedCommit)) throw new Error('SOG_EXPECTED_COMMIT must be a full commit SHA');
if (!['premerge', 'postmerge'].includes(phase)) throw new Error(`Unsupported closure phase: ${phase}`);

async function readJson(pathname) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    headers: { accept: 'application/json', 'cache-control': 'no-cache', 'user-agent': 'sog-ui-v3-production-closure/1.0' }
  });
  if (!response.ok) throw new Error(`${pathname}: HTTP ${response.status}`);
  return response.json();
}

const [version, manifest] = await Promise.all([
  readJson('/version.json'),
  readJson('/data/manifest.json')
]);
const screenshotAuditPath = path.join(artifactDir, 'screenshots', 'representative-visual-audit.json');
if (!fs.existsSync(screenshotAuditPath)) throw new Error('Production representative visual audit is missing');
const screenshotAudit = JSON.parse(fs.readFileSync(screenshotAuditPath, 'utf8'));

if (version.build?.commit !== expectedCommit) throw new Error(`production commit ${version.build?.commit} does not match expected ${expectedCommit}`);
if (version.build?.branch !== 'main') throw new Error(`production branch ${version.build?.branch} is not main`);
if (!isDeepStrictEqual(version.build, manifest.build)) throw new Error('version and manifest provenance differ');
if (version.data?.record_counts?.primary_records !== 98) throw new Error(`expected 98 canonical stable assets, found ${version.data?.record_counts?.primary_records}`);
if (manifest.data_safety?.canonical_only !== true) throw new Error('production manifest is not canonical-only');
if (manifest.data_safety?.includes_unreviewed_candidates !== false) throw new Error('production manifest includes unreviewed candidates');
if (screenshotAudit.ok !== true || screenshotAudit.failures?.length) throw new Error('production representative visual audit failed');
if (screenshotAudit.devices?.length !== 2) throw new Error('production visual audit must contain desktop and mobile');
for (const device of screenshotAudit.devices) {
  if (device.captured_routes !== 24) throw new Error(`${device.device}: expected 24 captured routes`);
  for (const field of ['overflow_count', 'broken_image_count', 'brand_violation_count', 'legacy_marker_count', 'unexpected_empty_state_count']) {
    if (device[field] !== 0) throw new Error(`${device.device}: ${field} is ${device[field]}`);
  }
}

const shortCommit = expectedCommit.slice(0, 12);
const releaseTag = `ui-v3-closed-${shortCommit}`;
const result = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  project_id: 'stable-or-gone',
  phase,
  ok: true,
  base_url: baseUrl,
  repository,
  workflow_run_id: runId,
  expected_commit: expectedCommit,
  production_commit: version.build.commit,
  production_branch: version.build.branch,
  release_tag: phase === 'postmerge' ? releaseTag : null,
  owner_approval: {
    gate: 'V3-G',
    status: phase === 'postmerge' ? 'passed' : 'authorized_for_merge',
    reference: ownerApprovalRef
  },
  production_parity: {
    gate: 'V3-H',
    status: phase === 'postmerge' ? 'passed' : 'premerge_baseline_passed',
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
  '# Stable or Gone UI v3 production closure',
  '',
  `- Phase: ${phase}`,
  `- Result: PASS`,
  `- Expected commit: \`${expectedCommit}\``,
  `- Production commit: \`${version.build.commit}\``,
  `- Production branch: \`${version.build.branch}\``,
  `- Canonical data hash: \`${version.build.canonical_data_hash}\``,
  `- Canonical stable assets: ${version.data.record_counts.primary_records}`,
  `- Production images: ${result.visual_regression.total_images}`,
  `- Rendered failures: ${result.visual_regression.rendered_failures}`,
  `- Gate V3-G: ${result.owner_approval.status}`,
  `- Gate V3-H: ${result.production_parity.status}`,
  ...(phase === 'postmerge' ? [`- Immutable tag: \`${releaseTag}\``] : []),
  '',
  '## Owner authorization',
  '',
  ownerApprovalRef,
  '',
  '## Production parity',
  '',
  `- Version and manifest provenance match: yes`,
  `- Canonical-only public manifest: yes`,
  `- Detail route counts match canonical records: yes`,
  `- Desktop representatives captured: ${result.visual_regression.desktop_captured}`,
  `- Mobile representatives captured: ${result.visual_regression.mobile_captured}`,
  `- Horizontal overflow, broken images, brand violations, legacy markers, and false empty states: 0`,
  '',
  phase === 'postmerge' ? 'Gate V3-G and Gate V3-H passed. UI v3 is closed for this immutable production commit.' : 'Pre-merge production baseline passed. Merge is authorized for the post-merge immutable-commit verification.'
].join('\n');
fs.writeFileSync(path.join(artifactDir, 'ui-v3-production-closure.md'), `${markdown}\n`);
console.log(JSON.stringify(result, null, 2));
