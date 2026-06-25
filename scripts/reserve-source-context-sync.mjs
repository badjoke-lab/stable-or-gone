import fs from 'node:fs';

const readJson = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));
const writeJson = (path, value) => fs.writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
const requireRow = (rows, id, path) => {
  const row = rows.find((item) => item.id === id);
  if (!row) throw new Error(`${path}: missing ${id}`);
  return row;
};
const ensureAbsent = (rows, id, path) => {
  if (rows.some((item) => item.id === id)) throw new Error(`${path}: duplicate ${id}`);
};

const evidencePath = 'data/evidence-batch-n.json';
const evidence = readJson(evidencePath);
const additions = [
  {
    id: 'sog_src_husd_legal_attestation_status_2026',
    stablecoin_id: 'sog_st_husd',
    issuer_id: 'sog_issuer_stable_universal',
    event_id: null,
    source_type: 'research_report',
    title: 'The Private Law of Stablecoins — HUSD reserve-account analysis',
    url: 'https://arizonastatelawjournal.org/wp-content/uploads/2023/08/54.4_Bruce_Publication.pdf',
    publisher: 'Arizona State Law Journal',
    published_at: null,
    archived_url: 'https://web.archive.org/web/*/https://arizonastatelawjournal.org/wp-content/uploads/2023/08/54.4_Bruce_Publication.pdf',
    accessed_at: '2026-06-25',
    reliability: 'high',
    claim_scope: 'historical_attestation_existence_and_source_status',
    stablecoin_ids: ['sog_st_husd'],
    organization_ids: ['sog_issuer_stable_universal'],
    event_ids: [],
    claim_scopes: ['january_2022_attestation', 'reserve_account_language', 'source_no_longer_public'],
    notes: 'The legal study identifies Stable Universal Ltd.’s January 2022 Accountant’s Attestation: Reserve Accounts Report and states that the report is no longer publicly available. It is secondary source-recovery context, not a substitute for the missing signed attestation.'
  },
  {
    id: 'sog_src_eurt_tether_transparency_scope_2026',
    stablecoin_id: 'sog_st_eurt',
    issuer_id: 'sog_issuer_tether',
    event_id: null,
    source_type: 'official_documentation',
    title: 'Tether reports and reserves transparency page',
    url: 'https://tether.to/transparency/?tab=reports',
    publisher: 'Tether',
    published_at: null,
    archived_url: 'https://web.archive.org/web/*/https://tether.to/transparency/?tab=reports',
    accessed_at: '2026-06-25',
    reliability: 'high',
    claim_scope: 'consolidated_reserve_reporting_scope',
    stablecoin_ids: ['sog_st_eurt'],
    organization_ids: ['sog_issuer_tether'],
    event_ids: [],
    claim_scopes: ['quarterly_reserve_reports', 'issuer_total_assets', 'issuer_total_liabilities', 'non_product_specific_scope'],
    notes: 'Official reporting context confirms quarterly reserve and assurance reporting but does not separately reconcile EURT assets and liabilities.'
  },
  {
    id: 'sog_src_eurt_relevant_information_scope_2026',
    stablecoin_id: 'sog_st_eurt',
    issuer_id: 'sog_issuer_tether',
    event_id: null,
    source_type: 'official_documentation',
    title: 'Tether International relevant information document',
    url: 'https://tether.to/public/Relevant_Information_Document_-_Tether_International%2C_S.A._de_C.V..pdf',
    publisher: 'Tether International',
    published_at: null,
    archived_url: 'https://web.archive.org/web/*/https://tether.to/public/Relevant_Information_Document_-_Tether_International%2C_S.A._de_C.V..pdf',
    accessed_at: '2026-06-25',
    reliability: 'high',
    claim_scope: 'reporting_entity_and_scope_limitations',
    stablecoin_ids: ['sog_st_eurt'],
    organization_ids: ['sog_issuer_tether'],
    event_ids: [],
    claim_scopes: ['reserve_report_scope', 'reporting_entities', 'assets_and_liabilities', 'non_issuing_entities'],
    notes: 'Official document states that reserve-report information may include assets and liabilities of entities that do not issue or redeem Tether Tokens. This prevents treating the package as an automatic EURT-specific final reconciliation.'
  }
];
for (const row of additions) {
  ensureAbsent(evidence, row.id, evidencePath);
  evidence.push(row);
}
writeJson(evidencePath, evidence);

const husdUnknownPath = 'data/known-unknowns-batch-d.json';
const husdUnknowns = readJson(husdUnknownPath);
const husdReserve = requireRow(husdUnknowns, 'sog_unk_husd_reserve_redemption_outcome_batch_d', husdUnknownPath);
husdReserve.topic = 'signed_attestation_reserve_and_redemption_outcome';
husdReserve.description = 'Monthly HUSD attestations and a January 2022 Reserve Accounts Report are historically identified, but the original signed report, measurement boundary, token-supply comparison, reserve-account balance, remaining liabilities, redemption availability, and final backing disposition remain unrecovered.';
husdReserve.last_checked_at = '2026-06-25';
husdReserve.notes = 'The legal-study description is retained as source-recovery context and does not support a canonical reserve-report row.';
const husdIssuer = requireRow(husdUnknowns, 'sog_unk_husd_final_issuer_state_batch_d', husdUnknownPath);
husdIssuer.last_checked_at = '2026-06-25';
writeJson(husdUnknownPath, husdUnknowns);

const eurtUnknownPath = 'data/known-unknowns-batch-e.json';
const eurtUnknowns = readJson(eurtUnknownPath);
const eurtReserve = requireRow(eurtUnknowns, 'sog_ku_eurt_final_reserve_disposition_batch_e', eurtUnknownPath);
eurtReserve.topic = 'product_specific_reserve_liability_and_final_disposition';
eurtReserve.description = 'Tether publishes consolidated reserve and assurance reports, but reviewed official material does not separately reconcile EURT reserve assets, EURT liabilities, the applicable EURT issuer boundary, unredeemed supply, or final holder outcomes after redemption ended.';
eurtReserve.last_checked_at = '2026-06-25';
eurtReserve.notes = 'Consolidated Tether reporting must not be copied into a product-specific EURT reserve-report row without explicit scope.';
const eurtSupply = requireRow(eurtUnknowns, 'sog_ku_eurt_remaining_supply_batch_e', eurtUnknownPath);
eurtSupply.last_checked_at = '2026-06-25';
writeJson(eurtUnknownPath, eurtUnknowns);

const queuePath = 'data/quality/reserve-report-applicability.json';
const queue = readJson(queuePath);
queue.classified_at = '2026-06-25';
queue.source_review = 'docs/audits/husd-eurt-reserve-source-recheck.md';
const husdQueue = queue.records.find((row) => row.stablecoin_id === 'sog_st_husd');
if (!husdQueue) throw new Error(`${queuePath}: missing HUSD`);
husdQueue.evidence_ids = ['sog_src_husd_background_batch_d', 'sog_src_husd_depeg_batch_d', 'sog_src_husd_legal_attestation_status_2026'];
husdQueue.review_note = 'Monthly attestations and a January 2022 Reserve Accounts Report are historically identified, but the signed report, accountant package, measurement boundary, supply comparison, reserve balance, and durable primary archive remain unrecovered. Secondary legal analysis confirms source loss but cannot substitute for the report.';
husdQueue.next_action = 'retain_unresolved_until_primary_report_recovered';
const eurtQueue = queue.records.find((row) => row.stablecoin_id === 'sog_st_eurt');
if (!eurtQueue) throw new Error(`${queuePath}: missing EURT`);
eurtQueue.evidence_ids = ['sog_src_eurt_legal_batch_e', 'sog_src_eurt_history_batch_e', 'sog_src_eurt_tether_transparency_scope_2026', 'sog_src_eurt_relevant_information_scope_2026'];
eurtQueue.review_note = 'Tether publishes quarterly consolidated reserve and assurance reports, but reviewed official material does not separately identify EURT assets, EURT liabilities, the EURT issuer boundary, or a final product-specific reconciliation after redemption ended.';
eurtQueue.next_action = 'retain_unresolved_until_product_specific_scope_recovered';
writeJson(queuePath, queue);
