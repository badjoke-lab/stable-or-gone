import fs from 'node:fs';

const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const writePretty = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
const writeCompactArray = (file, rows) => fs.writeFileSync(file, `[\n${rows.map((row) => `  ${JSON.stringify(row)}`).join(',\n')}\n]\n`);
const find = (rows, id, file) => {
  const row = rows.find((item) => item.id === id);
  if (!row) throw new Error(`${file}: missing ${id}`);
  return row;
};
const appendUnique = (rows, row, file) => {
  if (rows.some((item) => item.id === row.id)) throw new Error(`${file}: duplicate ${row.id}`);
  rows.push(row);
};

const evidenceFile = 'data/evidence-batch-a.json';
const evidence = read(evidenceFile);
appendUnique(evidence, {
  id: 'sog_src_fei_tip121c_execution_2022',
  stablecoin_id: 'sog_st_fei',
  issuer_id: 'sog_issuer_fei_protocol',
  event_id: 'sog_ev_fei_2022_09_final_redemption',
  source_type: 'governance_proposal',
  title: 'TIP-121c: Start FEI and TRIBE Redemption',
  url: 'https://www.tally.xyz/gov/fei/proposal/64863446409291443125870692229577565231046239594774676712611109555958259692263?govId=eip155%3A1%3A0x0BEF27FEB58e857046d630B2c03dFb7bae567494',
  publisher: 'Fei Protocol governance via Tally',
  published_at: '2022-09-22',
  archived_url: null,
  accessed_at: '2026-06-23',
  reliability: 'high',
  claim_scope: 'fei_executed_final_redemption_and_one_to_one_dai_backing_package',
  stablecoin_ids: ['sog_st_fei'],
  organization_ids: ['sog_issuer_fei_protocol'],
  event_ids: ['sog_ev_fei_2022_09_final_redemption'],
  claim_scopes: ['executed_governance_package', 'one_to_one_dai_backing', 'zero_fee_fei_redemption', 'final_redemption_context'],
  notes: 'Tally marks the on-chain proposal Executed. The proposal transferred 51,450,791 DAI to an immutable zero-fee FEI-to-DAI wrapper and directed existing PSM DAI to maintain complete 1:1 backing against circulating FEI. This proves historical execution, not present interface availability or universal holder completion.'
}, evidenceFile);
writeCompactArray(evidenceFile, evidence);

const reserveFile = 'data/reserve-reports-extra.json';
const reserve = read(reserveFile);
appendUnique(reserve, {
  id: 'sog_rr_fei_tip121c_execution_2022',
  stablecoin_id: 'sog_st_fei',
  issuer_id: 'sog_issuer_fei_protocol',
  report_date: '2022-09-22',
  period_covered: 'executed TIP-121c final-redemption and DAI-backing package proposed on 2022-09-22',
  publisher: 'Fei Protocol governance via Tally',
  report_type: 'executed_governance_reserve_and_redemption_package',
  asset_categories: ['dai_backing', 'protocol_controlled_value', 'final_redemption'],
  url: 'https://www.tally.xyz/gov/fei/proposal/64863446409291443125870692229577565231046239594774676712611109555958259692263?govId=eip155%3A1%3A0x0BEF27FEB58e857046d630B2c03dFb7bae567494',
  archived_url: null,
  confidence: 'high',
  notes: 'Historical execution context. Tally marks TIP-121c Executed and records 51,450,791 DAI transferred to an immutable zero-fee FEI-to-DAI wrapper, plus existing PSM DAI assigned to maintain complete 1:1 backing against circulating FEI. SOG does not infer current route availability, universal redemption, or completion of every residual PCV distribution.'
}, reserveFile);
writeCompactArray(reserveFile, reserve);

const queueFile = 'data/quality/reserve-report-applicability.json';
const queue = read(queueFile);
queue.classified_at = '2026-06-23';
queue.source_review = 'docs/audits/reserve-report-applicability-81-review.md';
queue.source_status_review = 'docs/audits/reserve-source-status-review.md';
queue.records = queue.records.filter((row) => row.stablecoin_id !== 'sog_st_fei');
queue.expected_total = queue.records.length;
queue.category_counts.source_status_unresolved = queue.records.filter((row) => row.applicability === 'source_status_unresolved').length;
queue.category_counts.not_applicable_by_design = queue.records.filter((row) => row.applicability === 'not_applicable_by_design').length;
queue.category_counts.report_expected_but_missing = queue.records.filter((row) => row.applicability === 'report_expected_but_missing').length;
if (queue.expected_total !== 12) throw new Error(`unexpected reserve queue total ${queue.expected_total}`);
if (queue.category_counts.source_status_unresolved !== 2) throw new Error('unexpected unresolved source count');
writePretty(queueFile, queue);

const eventsFile = 'data/events-batch-a.json';
const events = read(eventsFile);
const feiEvent = find(events, 'sog_ev_fei_2022_09_final_redemption', eventsFile);
feiEvent.source_count = 2;
feiEvent.notes = 'The event date remains the on-chain proposal date. Tally now confirms the TIP-121c package was executed; the exact execution timestamp, current route availability, and completion of every residual PCV distribution remain separate review topics.';
writePretty(eventsFile, events);

const detailsFile = 'data/event-details-batch-a.json';
const details = read(detailsFile);
const feiDetail = find(details, 'sog_ev_fei_2022_09_final_redemption', detailsFile);
feiDetail.evidence_ids = ['sog_src_fei_final_redemption_batch_a', 'sog_src_fei_tip121c_execution_2022'];
feiDetail.redemption_change_detail = {
  summary: 'Executed TIP-121c established an immutable zero-fee FEI-to-DAI wrapper and assigned DAI to maintain complete 1:1 backing against circulating FEI as part of the Tribe DAO wind-down.'
};
writeCompactArray(detailsFile, details);

const unknownsFile = 'data/known-unknowns-batch-a.json';
const unknowns = read(unknownsFile);
const currentRedemption = find(unknowns, 'sog_unk_fei_current_redemption_availability', unknownsFile);
currentRedemption.last_checked_at = '2026-06-23';
currentRedemption.description = 'TIP-121c historical execution is confirmed, but the present operational availability of FEI final-redemption contracts and interfaces has not been independently confirmed.';
currentRedemption.notes = 'Executed historical governance proves activation of the 1:1 DAI redemption package; it does not prove that current interfaces remain available or that every holder has redeemed.';
const executionTimeline = find(unknowns, 'sog_unk_fei_final_execution_timeline', unknownsFile);
executionTimeline.last_checked_at = '2026-06-23';
executionTimeline.description = 'Tally confirms TIP-121c was executed, but the exact execution timestamp and the completion dates of later residual PCV distributions have not yet been normalized.';
executionTimeline.notes = 'The recorded event date remains the proposal date; historical execution status is now canonical reserve/redemption context.';
const usdnTransition = find(unknowns, 'sog_unk_usdn_xtn_effective_transition_date', unknownsFile);
usdnTransition.last_checked_at = '2026-06-23';
usdnTransition.topic = 'external_rebrand_completion';
usdnTransition.description = 'SOG uses 2023-01-31 as the on-chain USDN-to-XTN identity-change boundary, but the dates when every external exchange, wallet, and data provider completed the staged rebrand remain unresolved.';
usdnTransition.notes = 'Do not reinterpret later external ticker updates as the canonical on-chain transition boundary.';
writeCompactArray(unknownsFile, unknowns);

const v2File = 'docs/migration/registry-v2-baseline.json';
const v2 = read(v2File);
v2.baseline_id = 'sog_registry_v2_post_fei_reserve_context_2026_06_23';
v2.captured_at = '2026-06-23';
v2.source_commit = 'resolve-fei-reserve-context';
v2.minimum_counts.evidence = 339;
v2.minimum_counts.evidence_relations = 334;
v2.minimum_counts.reserve_reports = 89;
writePretty(v2File, v2);

const v3File = 'docs/migration/registry-v3-baseline.json';
const v3 = read(v3File);
v3.baseline_id = 'sog_registry_v3_quality_81_fei_reserve_context_2026_06_23';
v3.recorded_at = '2026-06-23';
v3.data_checkpoint_commit = 'resolve-fei-reserve-context';
v3.expected_counts.evidence = 339;
v3.expected_counts.reserve_reports = 89;
v3.expected_coverage.reserve_reports = 69;
v3.quality.reserve_report_applicability_queue = 12;
v3.quality.reserve_report_not_applicable_by_design = 10;
v3.quality.reserve_report_source_status_unresolved = 2;
v3.quality.reserve_report_expected_but_missing = 0;
v3.audit_report = 'docs/audits/reserve-report-applicability-81-review.md';
writePretty(v3File, v3);

const sourceStatus = `# Reserve Source-status Review\n\nUpdated: 2026-06-23\n\n## Result\n\nThe 81-record registry has 69 assets with canonical reserve/report context and 12 classified uncovered assets. FEI moved from source-status unresolved into canonical historical reserve/redemption context after recovery of the executed on-chain TIP-121c package.\n\n\`\`\`text\nFEI resolved into canonical context: 1\nSource-status records remaining: 2\nHUSD: original signed attestation unrecovered\nEURT: product-specific reserve scope unrecovered\n\`\`\`\n\n## FEI — resolved\n\nTally marks the on-chain TIP-121c proposal as Executed. The proposal states that 51,450,791 DAI was transferred to an immutable zero-fee FEI-to-DAI wrapper and that all DAI from the existing PSM would be transferred to maintain complete 1:1 backing against changing circulating FEI. This is sufficient for a historical reserve/redemption execution context row.\n\nThe following remain separate known unknowns and do not block the historical context row:\n\n- the exact execution timestamp rather than the proposal date\n- present interface or contract availability\n- universal holder completion\n- completion dates for every residual PCV distribution\n\n## HUSD — retained unresolved\n\nMonthly attestations and a January 2022 Accountant's Attestation are historically identified, but the original signed report, accountant package, measurement boundary, reserve comparison, and durable archive remain unrecovered. Secondary descriptions do not justify a canonical report row.\n\n## EURT — retained unresolved\n\nTether consolidated reports cover group assets and aggregate digital-token liabilities, but the reviewed reports do not separately identify EURT reserve assets, EURT liabilities, the EURT issuer boundary, or a final product-specific reconciliation. Consolidated Tether reporting is not copied into the EURT record without explicit product scope.\n\n## Reopen rule\n\nHUSD or EURT may leave source-status unresolved only when materially better primary evidence recovers the missing product-specific boundary.\n\n## Production status\n\nNo Cloudflare action or production deployment is performed.\n`;
fs.writeFileSync('docs/audits/reserve-source-status-review.md', sourceStatus);

const audit = `# Reserve-report Applicability Review — 81-record Registry\n\nRecorded: 2026-06-23\n\n## Result\n\n\`\`\`text\nCanonical stable assets:             81\nReserve/report context coverage:     69\nApplicability ledger records:        12\nNot applicable by design:            10\nSource status unresolved:             2\nExpected but missing:                  0\nPlaceholder reserve rows:              0\n\`\`\`\n\n## Newly resolved\n\n### FEI\n\nThe executed TIP-121c governance package is now canonical historical reserve/redemption context. Tally records the proposal as Executed and describes an immutable zero-fee FEI-to-DAI wrapper funded with 51,450,791 DAI, plus existing PSM DAI assigned to maintain complete 1:1 backing against circulating FEI.\n\nThis resolution is deliberately narrow. It records historical execution and backing structure, not current interface availability, universal redemption completion, or completion of every residual PCV distribution.\n\n## Decisions upheld\n\nThe following ten assets remain not applicable by design because backing is represented by on-chain collateral, protocol accounting, historical migration, algorithmic mechanics, or legacy exits rather than an issuer-style periodic reserve-report cycle:\n\n- MIM\n- USDN\n- RAI\n- SPOT\n- GHO\n- BOLD\n- SAI\n- IRON\n- mUSD\n- alUSD\n\nHUSD and EURT remain source-status unresolved. Neither is classified as expected-but-missing because a reviewed historical or consolidated source trail exists, while the product-specific primary boundary required for a canonical row remains unrecovered.\n\n## Queue effect\n\n- applicability ledger: \`13 → 12\`\n- source-status unresolved: \`3 → 2\`\n- reserve/report records: \`88 → 89\`\n- reserve/report coverage: \`68 / 81 → 69 / 81\`\n- evidence: \`338 → 339\`\n\n## Integrity policy\n\nThe applicability ledger must continue to equal the exact set of canonical assets without reserve/report context. No placeholder row may be added merely to increase coverage. Required backing structure remains represented separately by complete reserve-component coverage.\n\n## Production status\n\nNo Cloudflare action, production deployment, or public parity assertion is performed.\n`;
fs.writeFileSync('docs/audits/reserve-report-applicability-81-review.md', audit);

console.log('Applied FEI reserve context and reduced applicability queue to 12');
