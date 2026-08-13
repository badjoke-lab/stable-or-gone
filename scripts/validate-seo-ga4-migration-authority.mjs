import fs from 'node:fs';

const authority = JSON.parse(fs.readFileSync('config/seo-ga4-migration-authority.json', 'utf8'));
const quality = fs.readFileSync('docs/quality/seo-ga4-migration-audit-spec.md', 'utf8');
const amendment = fs.readFileSync('docs/roadmap-amendments/2026-08-14-seo-ga4-migration-audit-authority.md', 'utf8');
const origin = fs.readFileSync('config/public-origin.mjs', 'utf8');
const failures = [];
const check = (value, message) => { if (!value) failures.push(message); };

check(authority.authority_id === 'sog_seo_ga4_migration_audit_2026_08_14', 'authority id');
check(authority.status === 'active_after_merge', 'authority status');
check(authority.entry_main_commit === '3c715fa77d9e92d52d7646f6e6e944a43d7f5ea9', 'entry main');
check(authority.official_public_origin === 'https://www.stableorgone.com', 'official origin');
check(authority.legacy_public_origin === 'https://sog.badjoke-lab.com', 'legacy origin');
check(authority.canonical_boundary?.canonical_delta_authorized === 0, 'canonical delta');
check(authority.canonical_boundary?.stable_assets === 119, 'stable assets');
check(authority.canonical_boundary?.evidence === 585, 'evidence');
check(authority.canonical_boundary?.canonical_hash === 'sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798', 'canonical hash');
check(authority.ga4_boundary?.reuse_existing_sog_ga4_property_and_stream === true, 'reuse GA4');
check(authority.ga4_boundary?.create_new_measurement_id_authorized === false, 'new GA4 id forbidden');
check(authority.ga4_boundary?.allowed_build_variable_name === 'PUBLIC_GA_MEASUREMENT_ID', 'GA4 variable');
check(authority.closeout?.restore_stage === 'REVIEW_GATE', 'closeout gate');
check(authority.closeout?.automatic_continuation === false, 'no continuation');
check(origin.includes('https://www.stableorgone.com'), 'public origin source');
check(quality.includes('PUBLIC_GA_MEASUREMENT_ID'), 'quality GA4 variable');
check(quality.includes('301 https://www.stableorgone.com'), 'quality redirect contract');
check(amendment.includes('Phase A') && amendment.includes('Phase D'), 'roadmap phases');

if (failures.length) {
  console.error(JSON.stringify({ ok: false, failures }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, authority_id: authority.authority_id }, null, 2));
