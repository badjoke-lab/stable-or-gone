import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const json = (file) => JSON.parse(read(file));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const authority = json('config/russia-usdt-regulation-guide-authority-2026-08-11.json');
const checkpoint = json('docs/migration/current-canonical-checkpoint.json');
const amendment = read('docs/roadmap-amendments/2026-08-11-russia-usdt-regulation-guide-authority.md');
const spec = read('docs/quality/russia-usdt-regulation-guide-authority-2026-08-11-spec.md');
const marketAccessSpec = read('docs/market-access-record-spec.md');
const agents = read('AGENTS.md');
const governance = read('docs/spec-governance.md');
const roadmap = read('docs/roadmap.md');
const deployment = read('docs/deployment-policy.md');
const active = read('scripts/validate-active-workstream.mjs').trim();

expect(authority.status === 'public_guide_update_authorized_canonical_preserved', 'authority status changed');
expect(authority.entry_main_commit === '6bac1ebc75bd178bfb8ca5d47460ea39c4a6e59e', 'authority entry main changed');
expect(authority.date === '2026-08-11', 'authority date changed');
expect(authority.authorized_public_files.length === 3, 'authorized public file count changed');
expect(authority.authorized_public_files.includes('src/pages/guides/russia-stablecoin-rules-2026/index.astro'), 'Russia guide not authorized');
expect(authority.authorized_public_files.includes('src/pages/guides/global-stablecoin-regulation-2026/index.astro'), 'global guide not authorized');
expect(authority.authorized_public_files.includes('src/data/guideCatalog.ts'), 'guide catalog not authorized');
expect(authority.source_boundary.discovery_only_not_canonical.includes('https://x.com/WatcherGuru/status/2087169960627892669'), 'Watcher.Guru discovery boundary missing');
expect(authority.market_access_v1_decision.canonical_promotion_authorized === false, 'Market Access promotion unexpectedly authorized');
expect(authority.market_access_v1_decision.market_access_records_before === 12, 'Market Access baseline changed');
expect(authority.market_access_v1_decision.market_access_records_after === 12, 'Market Access post-authority count changed');
expect(authority.canonical_boundary.canonical_delta === 0, 'canonical delta is not zero');
expect(authority.canonical_boundary.evidence === 585, 'Evidence baseline changed');
expect(authority.canonical_boundary.evidence_relations === 585, 'Evidence Relation baseline changed');
expect(authority.canonical_boundary.market_access_records === 12, 'Market Access baseline changed');
expect(authority.canonical_boundary.canonical_hash === 'sha256:f386c1043ca5e83cafbd88e99746d0609aab0154ed48de1970677758a66ed5fa', 'canonical hash boundary changed');
expect(authority.canonical_boundary.canonical_file_count === 466, 'canonical file count boundary changed');
expect(authority.prohibited.includes('change USDT lifecycle status'), 'USDT status preservation missing');
expect(authority.prohibited.includes('state that Russia permanently whitelisted exactly BTC ETH and USDT'), 'permanent-whitelist prohibition missing');

expect(marketAccessSpec.includes('asset\nx jurisdiction\nx platform/service\nx function'), 'Market Access platform/function unit changed');
expect(marketAccessSpec.includes('A platform observation must not be generalized into a jurisdiction-wide claim.'), 'Market Access jurisdiction-wide inference guard missing');
expect(amendment.includes('No canonical Market Access promotion is authorized.'), 'roadmap amendment missing Market Access no-promotion decision');
expect(spec.includes('not a permanent statutory whitelist'), 'quality spec missing whitelist qualification');
expect(spec.includes('No canonical Market Access row may be created from this review.'), 'quality spec missing Market Access no-go');

for (const text of [agents, governance, roadmap, deployment]) {
  expect(text.includes('Russia USDT Regulation Guide'), 'forward governance missing Russia USDT authority');
  expect(text.includes('Evidence Archive Payload Verification Batch 2'), 'forward governance missing preserved Evidence Archive lane');
  expect(text.includes('Market Access Records: 12'), 'forward governance missing Market Access baseline');
  expect(text.includes('canonical delta: 0') || text.includes('Canonical delta: 0') || text.includes('Expected canonical delta: 0'), 'forward governance missing zero canonical delta');
}

expect(checkpoint.counts.assets === 119, 'canonical assets changed');
expect(checkpoint.counts.evidence === 585, 'canonical Evidence changed');
expect(checkpoint.counts.evidence_relations === 585, 'canonical Evidence Relations changed');
expect(checkpoint.counts.market_access_records === 12, 'canonical Market Access changed');
expect(checkpoint.canonical_hash === 'sha256:f386c1043ca5e83cafbd88e99746d0609aab0154ed48de1970677758a66ed5fa', 'checkpoint canonical hash changed');
expect(active === "import './validate-russia-usdt-regulation-guide-authority.mjs';", 'active validator is not wired to Russia USDT authority');

if (failures.length) {
  console.error('Russia USDT regulation guide authority validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Russia USDT regulation guide authority validation passed.');
