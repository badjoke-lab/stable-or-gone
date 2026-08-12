import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const annotateFailure = (error) => {
  const message = String(error?.message ?? error).replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
  console.error(`::error title=Phase D logo result validation::${message}`);
  console.error(error);
};

try {
  await import('./validate-compare-phase-c-result.mjs');

  const resultPath = 'config/compare-logo-phase-d-implementation-result.json';
  const resultSpecPath = 'docs/quality/compare-logo-phase-d-review-result-spec.md';
  const amendmentPath = 'docs/roadmap-amendments/2026-08-12-compare-logo-phase-d-review-result.md';
  const policyPath = 'config/stablecoin-logo-display-policy.json';
  const decisionsPath = 'config/stablecoin-logo-decisions.json';
  const additionsPath = 'config/stablecoin-logo-decisions-additions.json';
  const resolverPath = 'src/utils/stablecoinLogo.ts';
  const readmePath = 'public/stablecoin-logos/README.md';
  const ciPath = '.github/workflows/ci.yml';
  const activePath = 'scripts/validate-active-workstream.mjs';
  const temporaryWorkflowPath = '.github/workflows/phase-d-logo-source-capture.yml';
  const entryPaths = ['AGENTS.md', 'docs/spec-governance.md', 'docs/roadmap.md', 'docs/deployment-policy.md'];

  for (const file of [resultPath, resultSpecPath, amendmentPath, policyPath, decisionsPath, additionsPath, resolverPath, readmePath, ciPath, activePath, ...entryPaths]) {
    if (!fs.existsSync(file)) throw new Error(`Missing Phase D artifact: ${file}`);
  }
  if (fs.existsSync(temporaryWorkflowPath)) throw new Error('Temporary Phase D source/ledger workflow must be removed before merge.');

  const result = JSON.parse(fs.readFileSync(resultPath, 'utf8'));
  const policy = JSON.parse(fs.readFileSync(policyPath, 'utf8'));
  const mainDecisions = JSON.parse(fs.readFileSync(decisionsPath, 'utf8'));
  const additions = JSON.parse(fs.readFileSync(additionsPath, 'utf8'));
  const resolver = fs.readFileSync(resolverPath, 'utf8');
  const readme = fs.readFileSync(readmePath, 'utf8');
  const ci = fs.readFileSync(ciPath, 'utf8');
  const active = fs.readFileSync(activePath, 'utf8').trim();
  const resultSpec = fs.readFileSync(resultSpecPath, 'utf8');
  const amendment = fs.readFileSync(amendmentPath, 'utf8');
  const decisions = [...(mainDecisions.records ?? []), ...(additions.records ?? [])];
  const bySlug = new Map(decisions.map((record) => [record.slug, record]));
  const canonicalHash = 'sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798';
  const promoted = ['mnee', 'usdgo', 'usr'];
  const fallbackSlugs = [
    'acala-ausd', 'avalon-usda', 'bison-bank-eub', 'bison-bank-usb', 'brz', 'chfau', 'coins-phpc',
    'dynamic-set-dollar', 'eurau', 'gbpq', 'plnq', 'poundtoken', 'sekau', 'sofiusd', 'usdh', 'usdy', 'usk', 'vchf'
  ];

  if (active !== "import './validate-compare-logo-phase-d-result.mjs';") throw new Error('Active workstream must point exactly to the Phase D result validator.');
  if (result.result_id !== 'sog_compare_logo_phase_d_implementation_2026_08_12') throw new Error('Unexpected Phase D result id.');
  if (result.parent_authority_id !== 'sog_compare_feedback_logo_maintenance_2026_08_12') throw new Error('Phase D is not bound to the parent Compare/logo authority.');
  if (result.preceding_phase_result !== 'config/compare-phase-c-implementation-result.json') throw new Error('Phase D must cite the merged Phase C result.');
  if (result.entry_main_commit !== 'c24b9ea9f98573a949c91bd512ef1413311226c6') throw new Error('Phase D entry main changed.');
  if (result.phase !== 'D' || result.status !== 'complete_after_merge') throw new Error('Phase D result status changed.');

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
    if (result.canonical_boundary?.[key] !== value) throw new Error(`Canonical Phase D invariant mismatch for ${key}.`);
  }

  if (result.display_result?.canonical_stablecoins !== 119 || result.display_result?.reviewed_dispositions !== 119) throw new Error('Phase D must preserve 119 canonical records and 119 reviewed dispositions.');
  if (result.display_result?.direct_logo_records !== 101 || result.display_result?.neutral_fallback_records !== 18) throw new Error('Phase D public partition must be 101 direct / 18 fallback.');
  if (JSON.stringify([...(result.display_result?.promoted_slugs ?? [])].sort()) !== JSON.stringify([...promoted].sort())) throw new Error('Phase D promoted slug set changed.');
  if (result.display_result?.other_phase_b_fallbacks_preserved !== true || result.display_result?.remote_runtime_image_fetch !== false) throw new Error('Phase D fallback/runtime boundary changed.');

  if (policy.canonical_records !== 119 || policy.direct_logo_records !== 101 || policy.neutral_fallback_records !== 18) throw new Error('Current display policy must be 119 / 101 / 18.');
  if (JSON.stringify([...(policy.neutral_fallback_slugs ?? [])].sort()) !== JSON.stringify([...fallbackSlugs].sort())) throw new Error('Current neutral-fallback population must remain the exact reviewed 18.');

  if (decisions.length !== 119) throw new Error(`Expected exactly 119 reviewed decision records, found ${decisions.length}.`);
  if (new Set(decisions.map((record) => record.slug)).size !== 119) throw new Error('Reviewed decision slugs are not unique.');

  const expectedMarks = {
    mnee: {
      mark_type: 'official_product_mark',
      asset_path: '/stablecoin-logos/mnee.svg',
      source_class: 'official_product_page_asset',
      sha256: 'ddee8994d9b3ac38835ed5f99d01a6f029cc8a997c9096d2b9ee4f9e49808911'
    },
    usdgo: {
      mark_type: 'official_product_mark',
      asset_path: '/stablecoin-logos/usdgo.svg',
      source_class: 'official_product_homepage_inline_svg',
      sha256: 'e75fc78d2b70dd3da4725aed2b1ed3e4f6201c7299a22f737154557b92ce4a84'
    },
    usr: {
      mark_type: 'token_logo',
      asset_path: '/stablecoin-logos/usr.png',
      source_class: 'official_brand_kit_token_asset',
      sha256: '56279ebd60697a49d0c8fa62179a40eb7ba07b26d756729645d331de2addbf16'
    }
  };

  for (const [slug, expected] of Object.entries(expectedMarks)) {
    const record = bySlug.get(slug);
    if (!record) throw new Error(`Missing Phase D decision for ${slug}.`);
    if (record.decision !== 'accepted_local_mark' || record.mark_type !== expected.mark_type || record.asset_path !== expected.asset_path || record.source_class !== expected.source_class) {
      throw new Error(`Phase D decision mismatch for ${slug}.`);
    }
    const localPath = path.join('public', expected.asset_path.replace(/^\//, ''));
    if (!fs.existsSync(localPath)) throw new Error(`Missing local Phase D asset for ${slug}: ${localPath}`);
    const sha = crypto.createHash('sha256').update(fs.readFileSync(localPath)).digest('hex');
    if (sha !== expected.sha256) throw new Error(`Phase D asset SHA-256 mismatch for ${slug}: ${sha}`);
    if (!resolver.includes(`'${slug}': '${expected.asset_path}'`)) throw new Error(`Resolver is missing exact Phase D slug mapping for ${slug}.`);
  }

  for (const oldPath of ['public/stablecoin-logos/usdgo.png', 'public/stablecoin-logos/usr.svg']) {
    if (fs.existsSync(oldPath)) throw new Error(`Superseded Phase D asset must be absent: ${oldPath}`);
  }

  if (!ci.includes('Audit Stablecoin logo disposition coverage') || !ci.includes('node scripts/audit-stablecoin-logo-coverage.mjs')) throw new Error('Core CI is missing the permanent Stablecoin logo disposition gate.');
  if (!/pull_request:\s*\n/.test(ci)) throw new Error('Core CI must continue to run for pull requests without a data-path-only exception.');

  for (const required of ['119 canonical Stablecoin records', '101', '18', 'mnee.svg', 'usdgo.svg', 'usr.png', 'ddee8994', 'e75fc78', '56279ebd', 'permanent core CI gate']) {
    if (!readme.toLowerCase().includes(required.toLowerCase())) throw new Error(`Stablecoin logo README missing Phase D marker: ${required}`);
  }
  const normalizedReadme = readme.replace(/\*\*/g, '');
  if (!normalizedReadme.includes('product illustration') || !normalizedReadme.includes('not imported')) throw new Error('README must preserve the USDGO Phase-B candidate rejection rationale.');

  if (result.source_review_correction?.slug !== 'usdgo' || result.source_review_correction?.phase_d_review_result !== 'rejected_as_product_illustration_not_compact_mark' || result.source_review_correction?.allow_list_expanded !== false) {
    throw new Error('Phase D USDGO source correction record changed.');
  }
  if (result.permanent_growth_gate?.runs_on_every_pull_request !== true || result.permanent_growth_gate?.data_only_growth_can_bypass !== false) throw new Error('Permanent future-growth gate semantics changed.');
  if (result.phase_gate?.phase_e_becomes_next_after_phase_d_merge !== true || result.phase_gate?.additional_logo_promotions_authorized !== false || result.phase_gate?.automatic_continuation_after_closeout !== false) throw new Error('Phase D next-stage boundary changed.');

  for (const requiredText of ['101', '18', 'mnee', 'usdgo', 'usr', 'Phase E', 'canonical delta', 'product illustration']) {
    if (!resultSpec.toLowerCase().includes(requiredText.toLowerCase())) throw new Error(`Phase D result spec missing ${requiredText}.`);
    if (!amendment.toLowerCase().includes(requiredText.toLowerCase())) throw new Error(`Phase D roadmap amendment missing ${requiredText}.`);
  }

  const entryRequired = [
    'MAINTENANCE_AUTHORITY_PHASE_E_NEXT',
    'config/compare-logo-phase-d-implementation-result.json',
    'docs/quality/compare-logo-phase-d-review-result-spec.md',
    'docs/roadmap-amendments/2026-08-12-compare-logo-phase-d-review-result.md',
    '101', '18', 'mnee', 'usdgo', 'usr', canonicalHash
  ];
  for (const entryPath of entryPaths) {
    const text = fs.readFileSync(entryPath, 'utf8');
    for (const requiredText of entryRequired) if (!text.includes(requiredText)) throw new Error(`${entryPath} missing Phase D/Phase E marker: ${requiredText}.`);
    if (!text.includes('Phase E') || !(text.includes('NEXT') || text.includes('next'))) throw new Error(`${entryPath} must establish Phase E as next.`);
    if (!(text.toLowerCase().includes('automatic continuation beyond closeout: false') || text.toLowerCase().includes('no automatic continuation'))) throw new Error(`${entryPath} must disable automatic continuation.`);
  }

  console.log('Phase D reviewed logo import and permanent future-growth gate result: pass');
} catch (error) {
  annotateFailure(error);
  process.exit(1);
}
