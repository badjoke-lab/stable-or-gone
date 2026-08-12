import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const json = (relative) => JSON.parse(read(relative));
const failures = [];
const requireValue = (ok, message) => { if (!ok) failures.push(message); };

const authority = json('config/compare-logo-maintenance-authority.json');
const displayPolicy = json('config/stablecoin-logo-display-policy.json');
const amendment = read('docs/roadmap-amendments/2026-08-12-compare-logo-maintenance-authority.md');
const quality = read('docs/quality/compare-logo-maintenance-spec.md');
const operating = read('docs/quality/stablecoin-logo-disposition-operating-spec.md');
const agents = read('AGENTS.md');
const governance = read('docs/spec-governance.md');
const roadmap = read('docs/roadmap.md');
const deployment = read('docs/deployment-policy.md');
const active = read('scripts/validate-active-workstream.mjs');

requireValue(authority.authority_id === 'sog_compare_feedback_logo_maintenance_2026_08_12', 'unexpected authority id');
requireValue(authority.status === 'active_after_merge', 'authority must be active_after_merge');
requireValue(authority.entry_main_commit === 'e28e60beeea07a0a6dfd7af217d2c3b9ac616bbd', 'entry main commit changed');
requireValue(authority.canonical_delta_authorized === 0, 'canonical delta must remain zero');
requireValue(authority.canonical_baseline?.stable_assets === 119, 'stable-asset baseline must remain 119');
requireValue(authority.canonical_baseline?.evidence === 585, 'Evidence baseline must remain 585');
requireValue(authority.canonical_baseline?.evidence_relations === 585, 'Evidence Relation baseline must remain 585');
requireValue(authority.canonical_baseline?.market_access === 12, 'Market Access baseline must remain 12');
requireValue(authority.canonical_baseline?.archive_recorded === 471 && authority.canonical_baseline?.archive_not_recorded === 114, 'archive baseline must be post-PR552 471 / 114');
requireValue(authority.canonical_baseline?.canonical_hash === 'sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798', 'canonical hash must be post-PR552 hash');
requireValue(authority.canonical_baseline?.canonical_file_count === 466, 'canonical file count changed');
requireValue(authority.entry_review_gate?.source_closeout === 'config/post-pr552-evidence-archive-batch2-closeout.json', 'entry closeout must be post-PR552');
requireValue(authority.entry_review_gate?.automatic_continuation === false, 'entry REVIEW_GATE automatic continuation must be false');

const fallback = authority.required_workstreams?.fallback_logo_reaudit;
requireValue(fallback?.baseline_canonical_records === 119, 'logo baseline canonical record count must be 119');
requireValue(fallback?.baseline_direct_logo_records === 98, 'direct logo baseline must be 98');
requireValue(fallback?.baseline_neutral_fallback_records === 21, 'fallback baseline must be 21');
requireValue(Array.isArray(fallback?.fallback_slugs) && fallback.fallback_slugs.length === 21, 'authority must freeze exactly 21 fallback slugs');
requireValue(new Set(fallback?.fallback_slugs ?? []).size === 21, 'fallback slugs must be unique');
requireValue(displayPolicy.canonical_records === 119, 'display policy canonical records must be 119 at entry');
requireValue(displayPolicy.direct_logo_records === 98, 'display policy direct logos must be 98 at entry');
requireValue(displayPolicy.neutral_fallback_records === 21, 'display policy fallbacks must be 21 at entry');
requireValue(JSON.stringify([...(displayPolicy.neutral_fallback_slugs ?? [])].sort()) === JSON.stringify([...(fallback?.fallback_slugs ?? [])].sort()), 'authority fallback population must exactly match current display policy');

const differences = authority.required_workstreams?.compare_difference_feedback;
requireValue(differences?.required === true, 'Compare difference feedback must be required');
requireValue(differences?.required_feedback?.includes('show_explicit_nothing_to_hide_message_when_enabled_and_no_matching_rows_exist'), 'no-op feedback requirement missing');
requireValue(differences?.required_tests?.includes('toggle_changes_row_count_for_a_selection_with_matching_rows'), 'matching-row removal test missing');
requireValue(differences?.required_tests?.includes('toggle_noop_state_reports_nothing_to_hide_for_a_selection_where_all_rows_differ'), 'all-different no-op test missing');

const marks = authority.required_workstreams?.compare_mark_display;
requireValue(marks?.required === true, 'Compare mark display must be required');
requireValue(/Reuse StablecoinMark output/.test(marks?.implementation_constraint ?? ''), 'Compare must reuse StablecoinMark output');
requireValue(/remote runtime image fetching/i.test(marks?.implementation_constraint ?? ''), 'remote-runtime prohibition missing from Compare mark contract');

const growth = authority.required_workstreams?.future_record_growth_logo_gate;
requireValue(growth?.required === true && growth?.permanent === true, 'future record-growth logo gate must be permanent');
requireValue(growth?.blocking_validation?.includes('logo_decision_count_matches_canonical_stablecoin_count'), 'decision-count merge gate missing');
requireValue(growth?.blocking_validation?.includes('canonical_stablecoin_data_changes_trigger_logo_coverage_validation'), 'canonical data trigger gate missing');

for (const [name, text] of [
  ['roadmap amendment', amendment],
  ['quality spec', quality],
  ['logo operating spec', operating]
]) {
  requireValue(/119/.test(text) && /98/.test(text) && /21/.test(text), `${name} must bind the 119 / 98 / 21 logo baseline`);
}

requireValue(/471/.test(amendment) && /114/.test(amendment) && amendment.includes('4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798'), 'roadmap amendment must bind the post-PR552 canonical baseline');
requireValue(/Hide matching rows/.test(quality), 'quality spec must define clear matching-row wording');
requireValue(/no matching rows to hide/i.test(quality), 'quality spec must require explicit no-op feedback');
requireValue(/StablecoinMark/.test(quality) && /stablecoinLogo/.test(quality), 'quality spec must bind existing mark system');
requireValue(/every new canonical stablecoin/i.test(operating), 'operating spec must apply to every new canonical stablecoin');
requireValue(/must not merge/i.test(operating), 'operating spec must define blocking merge gates');

for (const [name, text] of [
  ['AGENTS.md', agents],
  ['docs/spec-governance.md', governance],
  ['docs/roadmap.md', roadmap],
  ['docs/deployment-policy.md', deployment]
]) {
  requireValue(text.includes('config/compare-logo-maintenance-authority.json'), `${name} must cite the active Compare/logo authority`);
  requireValue(text.includes('docs/quality/compare-logo-maintenance-spec.md'), `${name} must cite the Compare/logo quality spec`);
  requireValue(text.includes('docs/quality/stablecoin-logo-disposition-operating-spec.md'), `${name} must cite the permanent logo disposition spec`);
  requireValue(text.includes('sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798'), `${name} must preserve the post-PR552 canonical hash`);
}

requireValue(active.trim() === "import './validate-compare-logo-maintenance-authority.mjs';", 'validate-active-workstream must point to Compare/logo authority validator');

if (failures.length) {
  console.error(JSON.stringify({ ok: false, failures }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  authority_id: authority.authority_id,
  canonical_delta_authorized: authority.canonical_delta_authorized,
  canonical_baseline: {
    archive_recorded: authority.canonical_baseline.archive_recorded,
    archive_not_recorded: authority.canonical_baseline.archive_not_recorded,
    canonical_hash: authority.canonical_baseline.canonical_hash
  },
  logo_baseline: {
    canonical_records: fallback.baseline_canonical_records,
    direct_logos: fallback.baseline_direct_logo_records,
    neutral_fallbacks: fallback.baseline_neutral_fallback_records
  },
  entry_review_gate: authority.entry_review_gate
}, null, 2));
