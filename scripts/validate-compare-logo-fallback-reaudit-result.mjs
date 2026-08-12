import fs from 'node:fs';

import './validate-compare-logo-maintenance-authority.mjs';

const reviewPath = 'data/editorial-research/compare-logo-fallback-reaudit-2026-08-12.json';
const resultSpecPath = 'docs/quality/compare-logo-fallback-reaudit-review-result-spec.md';
const amendmentPath = 'docs/roadmap-amendments/2026-08-12-compare-logo-fallback-reaudit-review-result.md';

for (const file of [reviewPath, resultSpecPath, amendmentPath]) {
  if (!fs.existsSync(file)) throw new Error(`Missing Phase B review artifact: ${file}`);
}

const review = JSON.parse(fs.readFileSync(reviewPath, 'utf8'));
const expectedSlugs = [
  'acala-ausd', 'avalon-usda', 'bison-bank-eub', 'bison-bank-usb', 'brz', 'chfau', 'coins-phpc',
  'dynamic-set-dollar', 'eurau', 'gbpq', 'mnee', 'plnq', 'poundtoken', 'sekau', 'sofiusd', 'usdgo',
  'usdh', 'usdy', 'usk', 'usr', 'vchf'
];
const expectedDirect = ['mnee', 'usdgo', 'usr'];
const expectedCanonical = {
  stable_assets: 119,
  evidence: 585,
  evidence_relations: 585,
  market_access_records: 12,
  archive_recorded: 471,
  archive_not_recorded: 114,
  canonical_hash: 'sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798',
  canonical_file_count: 466,
  canonical_delta: 0
};

if (review.parent_authority_id !== 'sog_compare_feedback_logo_maintenance_2026_08_12') throw new Error('Phase B result is not bound to the current Compare/logo authority.');
if (review.phase !== 'B' || review.status !== 'review_complete') throw new Error('Phase B result must remain review_complete.');
if (review.population !== 21 || review.records?.length !== 21) throw new Error('Phase B must preserve exactly 21 reviewed fallback records.');
if (JSON.stringify(review.records.map((record) => record.slug).sort()) !== JSON.stringify([...expectedSlugs].sort())) throw new Error('Phase B reviewed population changed.');

const direct = review.records.filter((record) => record.decision === 'direct_logo');
const fallback = review.records.filter((record) => record.decision === 'neutral_fallback');
if (direct.length !== 3 || fallback.length !== 18) throw new Error(`Unexpected Phase B partition: ${direct.length} direct / ${fallback.length} fallback.`);
if (JSON.stringify(direct.map((record) => record.slug).sort()) !== JSON.stringify([...expectedDirect].sort())) throw new Error('Phase B direct-logo allow-list changed.');

const requiredFields = ['slug', 'name', 'symbol', 'decision', 'mark_type', 'source_page', 'source_class', 'identity_basis', 'evidence', 'transformation'];
for (const record of review.records) {
  for (const field of requiredFields) if (record[field] === undefined || record[field] === '') throw new Error(`Missing ${field} on ${record.slug}.`);
  if (!['direct_logo', 'neutral_fallback'].includes(record.decision)) throw new Error(`Invalid decision for ${record.slug}.`);
  if (record.decision === 'direct_logo') {
    if (!record.source_asset_url || !record.proposed_asset_path) throw new Error(`Direct-logo outcome ${record.slug} requires pinned source and proposed local path.`);
    if (record.asset_path !== null) throw new Error(`Phase B must not claim an imported asset for ${record.slug}.`);
  } else if (record.source_asset_url !== null || record.asset_path !== null) {
    throw new Error(`Neutral fallback ${record.slug} must keep source_asset_url and asset_path null.`);
  }
}

if (review.review_result?.direct_logo !== 3 || review.review_result?.neutral_fallback !== 18) throw new Error('Phase B summary changed.');
if (review.review_result?.post_import_expected_direct_logo_records !== 101 || review.review_result?.post_import_expected_neutral_fallback_records !== 18) throw new Error('Phase B post-import expectation changed.');
if (review.review_result?.display_policy_changed_in_this_review !== false || review.review_result?.assets_imported_in_this_review !== false) throw new Error('Phase B must remain review-only.');
if (review.phase_gate?.phase_c_compare_implementation_may_begin !== true || review.phase_gate?.phase_d_logo_import_may_begin_before_phase_c_close !== false) throw new Error('Phase B gate semantics changed.');
if (JSON.stringify([...(review.phase_gate?.phase_d_allowed_direct_logo_slugs ?? [])].sort()) !== JSON.stringify([...expectedDirect].sort())) throw new Error('Phase D allow-list changed.');

for (const [key, value] of Object.entries(expectedCanonical)) if (review.canonical_boundary?.[key] !== value) throw new Error(`Canonical Phase B invariant mismatch for ${key}.`);

const resultSpec = fs.readFileSync(resultSpecPath, 'utf8');
const amendment = fs.readFileSync(amendmentPath, 'utf8');
for (const requiredText of ['mnee', 'usdgo', 'usr', 'Phase C', 'canonical delta']) {
  if (!resultSpec.toLowerCase().includes(requiredText.toLowerCase())) throw new Error(`Review spec missing ${requiredText}.`);
  if (!amendment.toLowerCase().includes(requiredText.toLowerCase())) throw new Error(`Roadmap amendment missing ${requiredText}.`);
}

console.log('Phase B Compare/logo fallback re-audit result: pass');
