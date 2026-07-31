import fs from 'node:fs';

const baseUrl = (process.env.SOG_BASE_URL || 'https://www.stableorgone.com').replace(/\/$/, '');
const attempts = Number(process.env.SOG_SMOKE_ATTEMPTS || 20);
const delayMs = Number(process.env.SOG_SMOKE_DELAY_MS || 15000);
const audited100 = JSON.parse(fs.readFileSync('docs/migration/audited-100-asset-canonical-checkpoint.json', 'utf8'));
const currentCheckpoint = JSON.parse(fs.readFileSync('docs/migration/current-canonical-checkpoint.json', 'utf8'));
const releaseBaseline = JSON.parse(fs.readFileSync('docs/migration/registry-release-integrity-baseline.json', 'utf8'));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function checkOnce() {
  const response = await fetch(`${baseUrl}/version.json`, {
    headers: { accept: 'application/json', 'cache-control': 'no-cache' },
  });
  if (!response.ok) throw new Error(`version.json returned HTTP ${response.status}`);
  const version = await response.json();
  const build = version.build ?? {};
  const publicCounts = version.data?.record_counts ?? {};
  const breakdown = version.data?.record_count_breakdown ?? {};
  const expected = currentCheckpoint.expected_counts ?? {};
  const expectedV2 = releaseBaseline.expected_v2_counts ?? {};
  const expectedRoutes = releaseBaseline.expected_route_counts ?? {};
  const failures = [];
  const check = (condition, message) => { if (!condition) failures.push(message); };

  check(publicCounts.primary_records === currentCheckpoint.asset_count, `production primary_records expected ${currentCheckpoint.asset_count}, found ${publicCounts.primary_records}`);
  check(publicCounts.events === expected.events, `production events expected ${expected.events}, found ${publicCounts.events}`);
  check(publicCounts.evidence === expected.evidence, `production evidence expected ${expected.evidence}, found ${publicCounts.evidence}`);
  check(breakdown.organizations === expected.organizations, `production organizations expected ${expected.organizations}, found ${breakdown.organizations}`);
  check(breakdown.relationships === expected.relationships, `production relationships expected ${expected.relationships}, found ${breakdown.relationships}`);
  check(breakdown.reserve_reports === expected.reserve_reports, `production reserve_reports expected ${expected.reserve_reports}, found ${breakdown.reserve_reports}`);
  check(breakdown.known_unknowns === expected.known_unknowns, `production known_unknowns expected ${expected.known_unknowns}, found ${breakdown.known_unknowns}`);
  check(breakdown.regulatory_notes === expected.regulatory_notes, `production regulatory_notes expected ${expected.regulatory_notes}, found ${breakdown.regulatory_notes}`);
  check(breakdown.deployments === expected.deployments, `production deployments expected ${expected.deployments}, found ${breakdown.deployments}`);

  for (const [name, count] of Object.entries(expectedV2)) {
    check(build.canonical_record_counts?.[name] === count, `production canonical count mismatch: ${name}; expected ${count}, found ${build.canonical_record_counts?.[name]}`);
  }
  for (const [name, count] of Object.entries(expectedRoutes)) {
    check(build.route_counts?.[name] === count, `production route count mismatch: ${name}; expected ${count}, found ${build.route_counts?.[name]}`);
  }

  check(publicCounts.primary_records >= audited100.v2_groups.stablecoins.record_count, 'production regressed below audited 100-asset checkpoint');
  check(publicCounts.events >= audited100.v2_groups.events.record_count, 'production event count regressed below audited 100-asset checkpoint');
  check(publicCounts.evidence >= audited100.v2_groups.evidence.record_count, 'production evidence count regressed below audited 100-asset checkpoint');
  check(breakdown.organizations >= audited100.v2_groups.organizations.record_count, 'production organization count regressed below audited 100-asset checkpoint');
  check(breakdown.deployments >= audited100.v2_groups.deployments.record_count, 'production deployment count regressed below audited 100-asset checkpoint');

  if (failures.length) throw new Error(failures.join('; '));

  return {
    ok: true,
    audited_floor_checkpoint_id: audited100.checkpoint_id,
    current_checkpoint_id: currentCheckpoint.checkpoint_id,
    production_commit: build.commit,
    production_primary_records: publicCounts.primary_records,
    production_events: publicCounts.events,
    production_evidence: publicCounts.evidence,
    production_organizations: breakdown.organizations,
    production_deployments: breakdown.deployments,
    route_counts: build.route_counts,
  };
}

let lastError;
for (let attempt = 1; attempt <= attempts; attempt += 1) {
  try {
    const result = await checkOnce();
    console.log(JSON.stringify({ ...result, attempt }, null, 2));
    process.exit(0);
  } catch (error) {
    lastError = error;
    console.error(`Production checkpoint parity attempt ${attempt}/${attempts} failed: ${error.message}`);
    if (attempt < attempts) await sleep(delayMs);
  }
}
throw lastError;
