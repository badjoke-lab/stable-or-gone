import fs from 'node:fs';

const annotateFailure = (error) => {
  const message = String(error?.message ?? error).replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
  console.error(`::error title=Phase C result validation::${message}`);
  console.error(error);
};

try {
  await import('./validate-compare-logo-fallback-reaudit-result.mjs');

  const resultPath = 'config/compare-phase-c-implementation-result.json';
  const resultSpecPath = 'docs/quality/compare-phase-c-review-result-spec.md';
  const amendmentPath = 'docs/roadmap-amendments/2026-08-12-compare-phase-c-review-result.md';
  const sourcePath = 'src/components/StablecoinComparisonSource.astro';
  const pagePath = 'src/pages/stablecoins/index.astro';
  const enhancementPath = 'src/scripts/stablecoin-comparison-phase-c.ts';
  const auditPath = 'scripts/audit-stablecoin-comparison-phase-c.mjs';
  const workflowPath = '.github/workflows/stablecoin-compare-matrix-visual.yml';

  for (const file of [resultPath, resultSpecPath, amendmentPath, sourcePath, pagePath, enhancementPath, auditPath, workflowPath]) {
    if (!fs.existsSync(file)) throw new Error(`Missing historical Phase C artifact: ${file}`);
  }

  const result = JSON.parse(fs.readFileSync(resultPath, 'utf8'));
  const source = fs.readFileSync(sourcePath, 'utf8');
  const page = fs.readFileSync(pagePath, 'utf8');
  const enhancement = fs.readFileSync(enhancementPath, 'utf8');
  const audit = fs.readFileSync(auditPath, 'utf8');
  const workflow = fs.readFileSync(workflowPath, 'utf8');
  const resultSpec = fs.readFileSync(resultSpecPath, 'utf8');
  const amendment = fs.readFileSync(amendmentPath, 'utf8');
  const expectedDirect = ['mnee', 'usdgo', 'usr'];
  const canonicalHash = 'sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798';

  if (result.result_id !== 'sog_compare_phase_c_implementation_2026_08_12') throw new Error('Unexpected Phase C result id.');
  if (result.parent_authority_id !== 'sog_compare_feedback_logo_maintenance_2026_08_12') throw new Error('Phase C is not bound to the Compare/logo authority.');
  if (result.phase !== 'C' || result.status !== 'complete_after_merge') throw new Error('Historical Phase C result status changed.');
  if (result.entry_main_commit !== 'dc1f2925f6dbd40c50267a2de2b4f85e2fe580b5') throw new Error('Phase C entry main changed.');
  if (result.implementation?.matching_row_control_label !== 'Hide matching rows') throw new Error('Phase C control label changed.');
  if (result.implementation?.no_op_message !== 'All displayed attributes already differ. Nothing to hide.') throw new Error('Phase C no-op message changed.');
  if (result.implementation?.mark_display !== 'clone_pre_rendered_existing_StablecoinMark_output_from_comparison_source') throw new Error('Phase C mark reuse contract changed.');
  if (result.implementation?.remote_runtime_image_fetch !== false || result.implementation?.compare_only_logo_mapping !== false) throw new Error('Phase C must not add remote runtime fetches or a Compare-only logo map.');

  if (!source.includes("import StablecoinMark from './StablecoinMark.astro';") || !source.includes('data-comparison-source-mark') || !source.includes('<StablecoinMark')) throw new Error('Comparison source no longer pre-renders StablecoinMark.');
  if (!page.includes('<span>Hide matching rows</span>') || !page.includes('data-comparison-feedback') || !page.includes("import '../../scripts/stablecoin-comparison-phase-c';")) throw new Error('Stablecoin page lost Phase C feedback wiring.');
  if (!enhancement.includes('cloneNode(true)') || !enhancement.includes('data-comparison-header-mark') || !enhancement.includes('All displayed attributes already differ. Nothing to hide.')) throw new Error('Phase C enhancement script lost required behavior.');
  if (!audit.includes('matchingCase') || !audit.includes('allDifferentCase') || !audit.includes('restoredRowCount') || !audit.includes("markKind === 'logo'") || !audit.includes("markKind === 'fallback'")) throw new Error('Phase C browser audit lost a required deterministic case.');
  if (!workflow.includes('Audit Phase C matching-row feedback and Stablecoin marks') || !workflow.includes('audit-stablecoin-comparison-phase-c.mjs')) throw new Error('Compare visual workflow lost the Phase C browser audit.');

  if (result.public_logo_boundary?.public_direct_logo_records !== 98 || result.public_logo_boundary?.public_neutral_fallback_records !== 21) throw new Error('Historical Phase C 98 / 21 public baseline changed.');
  if (result.public_logo_boundary?.phase_c_imported_assets !== false || result.public_logo_boundary?.phase_c_changed_display_policy !== false) throw new Error('Phase C historical boundary must remain import-free.');
  if (JSON.stringify([...(result.public_logo_boundary?.phase_d_allowed_direct_logo_slugs ?? [])].sort()) !== JSON.stringify([...expectedDirect].sort())) throw new Error('Historical Phase D allow-list changed.');

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
  for (const [key, value] of Object.entries(expectedCanonical)) if (result.canonical_boundary?.[key] !== value) throw new Error(`Canonical Phase C invariant mismatch for ${key}.`);

  if (result.phase_gate?.phase_d_becomes_next_after_phase_c_merge !== true || result.phase_gate?.phase_e_may_begin_before_phase_d_close !== false) throw new Error('Historical Phase C gate semantics changed.');
  for (const requiredText of ['Hide matching rows', 'Nothing to hide', 'mnee', 'usdgo', 'usr', 'Phase D', 'canonical delta']) {
    if (!resultSpec.toLowerCase().includes(requiredText.toLowerCase())) throw new Error(`Phase C result spec missing ${requiredText}.`);
    if (!amendment.toLowerCase().includes(requiredText.toLowerCase())) throw new Error(`Phase C roadmap amendment missing ${requiredText}.`);
  }

  console.log('Historical Phase C Compare feedback and mark implementation result: pass');
} catch (error) {
  annotateFailure(error);
  process.exit(1);
}
