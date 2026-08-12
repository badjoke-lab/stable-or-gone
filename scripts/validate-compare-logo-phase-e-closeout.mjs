import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const fail = (message) => {
  console.error(`::error title=Phase E Compare/logo closeout validation::${String(message).replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A')}`);
  throw new Error(message);
};

try {
  const closeoutPath = 'config/compare-logo-phase-e-closeout.json';
  const specPath = 'docs/quality/compare-logo-phase-e-closeout-spec.md';
  const amendmentPath = 'docs/roadmap-amendments/2026-08-12-compare-logo-phase-e-closeout.md';
  const policyPath = 'config/stablecoin-logo-display-policy.json';
  const decisionsPath = 'config/stablecoin-logo-decisions.json';
  const additionsPath = 'config/stablecoin-logo-decisions-additions.json';
  const resolverPath = 'src/utils/stablecoinLogo.ts';
  const capturePath = 'scripts/capture-stablecoin-mark-mix.mjs';
  const activePath = 'scripts/validate-active-workstream.mjs';
  const entryPaths = ['AGENTS.md', 'docs/spec-governance.md', 'docs/roadmap.md', 'docs/deployment-policy.md'];
  const requiredFiles = [closeoutPath, specPath, amendmentPath, policyPath, decisionsPath, additionsPath, resolverPath, capturePath, activePath, ...entryPaths];
  for (const file of requiredFiles) if (!fs.existsSync(file)) fail(`Missing closeout artifact: ${file}`);

  const closeout = JSON.parse(fs.readFileSync(closeoutPath, 'utf8'));
  const policy = JSON.parse(fs.readFileSync(policyPath, 'utf8'));
  const mainDecisions = JSON.parse(fs.readFileSync(decisionsPath, 'utf8'));
  const additions = JSON.parse(fs.readFileSync(additionsPath, 'utf8'));
  const decisions = [...(mainDecisions.records ?? []), ...(additions.records ?? [])];
  const resolver = fs.readFileSync(resolverPath, 'utf8');
  const capture = fs.readFileSync(capturePath, 'utf8');
  const active = fs.readFileSync(activePath, 'utf8').trim();
  const spec = fs.readFileSync(specPath, 'utf8');
  const amendment = fs.readFileSync(amendmentPath, 'utf8');
  const canonicalHash = 'sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798';

  if (active !== "import './validate-compare-logo-phase-e-closeout.mjs';") fail('Active workstream must point exactly to the Phase E closeout validator.');
  if (closeout.closeout_id !== 'sog_compare_logo_phase_e_closeout_2026_08_12') fail('Unexpected Phase E closeout id.');
  if (closeout.status !== 'complete_after_merge' || closeout.repository_stage_after_merge !== 'REVIEW_GATE') fail('Phase E must close to REVIEW_GATE.');
  if (closeout.parent_authority_id !== 'sog_compare_feedback_logo_maintenance_2026_08_12') fail('Phase E parent authority mismatch.');
  if (closeout.preceding_phase_result !== 'config/compare-logo-phase-d-implementation-result.json') fail('Phase E must cite the merged Phase D result.');
  if (closeout.verified_main_commit !== 'bb72108ea53d96a69db42d5c8e97df47033be44e') fail('Verified Phase D main commit changed.');
  if (closeout.official_public_origin !== 'https://www.stableorgone.com') fail('Official public origin changed.');

  const production = closeout.production_verification ?? {};
  if (production.run_id !== 31585897410 || production.job_id !== 94079531335 || production.conclusion !== 'success') fail('Pinned exact-main production verification changed.');
  const visual = closeout.exact_main_visual_verification ?? {};
  if (visual.run_id !== 31585897478 || visual.job_id !== 94079532861 || visual.conclusion !== 'success') fail('Pinned exact-main visual verification changed.');
  if (visual.catalog_cards !== 119 || visual.catalog_direct_logos !== 101 || visual.catalog_neutral_fallbacks !== 18) fail('Exact-main catalog partition must remain 119 / 101 / 18.');
  if (visual.broken_images !== 0 || visual.empty_frames !== 0 || visual.failures !== 0) fail('Exact-main catalog must have zero image/frame failures.');

  const expectedCanonical = {
    stable_assets: 119,
    evidence: 585,
    evidence_relations: 585,
    market_access_records: 12,
    archive_recorded: 471,
    archive_not_recorded: 114,
    canonical_hash: canonicalHash,
    canonical_file_count: 466,
    canonical_delta: 0
  };
  for (const [key, value] of Object.entries(expectedCanonical)) {
    if (closeout.canonical_boundary?.[key] !== value) fail(`Canonical closeout invariant mismatch: ${key}`);
  }

  if (policy.canonical_records !== 119 || policy.direct_logo_records !== 101 || policy.neutral_fallback_records !== 18) fail('Current display policy must remain 119 / 101 / 18.');
  if (decisions.length !== 119 || new Set(decisions.map((record) => record.slug)).size !== 119) fail('Reviewed logo dispositions must remain exactly 119 unique records.');

  const marks = {
    mnee: ['/stablecoin-logos/mnee.svg', 'ddee8994d9b3ac38835ed5f99d01a6f029cc8a997c9096d2b9ee4f9e49808911'],
    usdgo: ['/stablecoin-logos/usdgo.svg', 'e75fc78d2b70dd3da4725aed2b1ed3e4f6201c7299a22f737154557b92ce4a84'],
    usr: ['/stablecoin-logos/usr.png', '56279ebd60697a49d0c8fa62179a40eb7ba07b26d756729645d331de2addbf16']
  };
  for (const [slug, [assetPath, expectedSha]] of Object.entries(marks)) {
    if (!resolver.includes(`'${slug}': '${assetPath}'`)) fail(`Resolver lost Phase D mapping for ${slug}.`);
    const local = path.join('public', assetPath.replace(/^\//, ''));
    if (!fs.existsSync(local)) fail(`Missing accepted Phase D asset: ${local}`);
    const sha = crypto.createHash('sha256').update(fs.readFileSync(local)).digest('hex');
    if (sha !== expectedSha) fail(`Accepted Phase D asset hash changed for ${slug}: ${sha}`);
  }

  for (const required of [
    "id: 'phase-e-mnee'", "query: 'mnee'", "record: 'mnee'", "kind: 'logo'",
    "id: 'phase-e-usdgo'", "query: 'usdgo'", "record: 'usdgo'",
    "id: 'phase-e-usr'", "query: 'usr'", "record: 'usr'",
    "id: 'phase-e-fallback'", "query: 'acala'", "record: 'acala-ausd'", "kind: 'fallback'",
    'pageHorizontalOverflow'
  ]) if (!capture.includes(required)) fail(`Targeted Phase E browser regression missing marker: ${required}`);

  const closeoutBoundary = closeout.closeout_boundary ?? {};
  if (closeoutBoundary.canonical_work_authorized_after_merge !== false
    || closeoutBoundary.additional_logo_promotions_authorized !== false
    || closeoutBoundary.archive_work_authorized !== false
    || closeoutBoundary.market_access_work_authorized !== false
    || closeoutBoundary.unrelated_ui_work_authorized !== false
    || closeoutBoundary.automatic_continuation !== false
    || closeoutBoundary.new_work_requires_fresh_reviewed_authority !== true) {
    fail('Phase E closeout boundary changed.');
  }

  for (const text of [spec, amendment]) {
    for (const required of ['REVIEW_GATE', '101', '18', 'mnee', 'usdgo', 'usr', '31585897410', '31585897478', canonicalHash, 'automatic continuation']) {
      if (!text.toLowerCase().includes(required.toLowerCase())) fail(`Closeout document missing marker: ${required}`);
    }
  }

  for (const entryPath of entryPaths) {
    const text = fs.readFileSync(entryPath, 'utf8');
    for (const required of ['Current stage: REVIEW_GATE', 'config/compare-logo-phase-e-closeout.json', '101', '18', canonicalHash]) {
      if (!text.includes(required)) fail(`${entryPath} missing closeout marker: ${required}`);
    }
    if (!text.toLowerCase().includes('automatic continuation') || !text.toLowerCase().includes('false')) fail(`${entryPath} must disable automatic continuation.`);
  }

  console.log('Phase E Compare/logo maintenance closeout: pass');
} catch (error) {
  if (!String(error?.message ?? '').startsWith('Phase E Compare/logo maintenance closeout')) console.error(error);
  process.exit(1);
}
