import fs from 'node:fs';

const read = (file) => fs.readFileSync(file, 'utf8');
const write = (file, body) => fs.writeFileSync(file, body);
const readJson = (file) => JSON.parse(read(file));
const writeJson = (file, value) => write(file, `${JSON.stringify(value, null, 2)}\n`);
const unique = (values) => [...new Set(values)];

function updateEvidence() {
  const batchNPath = 'data/evidence-batch-n.json';
  const batchN = readJson(batchNPath);
  const rlusd = batchN.find((row) => row.id === 'sog_src_rlusd_japan_launch_sbi_vc_2026');
  if (!rlusd) throw new Error('RLUSD Japan launch Evidence not found');
  rlusd.accessed_at = '2026-07-13';
  rlusd.claim_scope = 'japan_provider_distribution_functions_network_limits_fees_conditions_and_regulatory_classification';
  rlusd.claim_scopes = unique([
    ...(rlusd.claim_scopes ?? []),
    'buy_sell',
    'deposit',
    'withdrawal',
    'external_wallet_transfer',
    'Ethereum_only_platform_transfer_scope',
    'JPY_1_million_buy_sell_limit',
    'JPY_1_million_withdrawal_limit',
    'fee_free_deposit_and_withdrawal_at_reviewed_launch',
    'platform_service_and_reflection_conditions'
  ]);
  rlusd.notes = 'Primary SBI VC Trade RLUSD launch source reused by PR #359. It supports provider-scoped buy/sell, deposit, withdrawal, Ethereum-only external transfer through the withdrawal route, launch-stage limits, fees, service conditions, and SBI VC Trade\'s Japanese Category 4 characterization. It does not establish universal Japan-wide availability, XRPL support through VCTRADE, direct issuer mint or redemption, government guarantee, or recommendation.';
  writeJson(batchNPath, batchN);

  const fsaPath = 'data/evidence-pr356-market-access-pilot-1.json';
  const fsaRows = readJson(fsaPath);
  const fsa = fsaRows.find((row) => row.id === 'sog_src_jfsa_electronic_payment_instrument_register_pr356');
  if (!fsa) throw new Error('JFSA register Evidence not found');
  fsa.accessed_at = '2026-07-13';
  fsa.stablecoin_ids = unique([fsa.stablecoin_id, ...(fsa.stablecoin_ids ?? []), 'sog_st_rlusd']);
  fsa.claim_scopes = unique([
    ...(fsa.claim_scopes ?? []),
    'RLUSD listed among electronic payment instruments handled by SBI VC Trade'
  ]);
  fsa.notes = 'Primary JFSA register snapshot dated 2026-06-24. It supports SBI VC Trade registration and the handled-asset scope for USDC and RLUSD. It does not prove individual platform functions, constitute a value guarantee or recommendation, or establish universal Japan-wide availability.';
  writeJson(fsaPath, fsaRows);
}

const authorityBlock = `
## PR #359 active authority

Current work item:

\`\`\`text
PR #358 Record Growth Batch 1: complete
PR #359 Market Access Pilot 2: active
PR #360 Evidence and Correction Batch: next
\`\`\`

Binding references:

\`\`\`text
docs/roadmap-amendments/2026-07-13-pr359-market-access-pilot-2-activation.md
docs/quality/market-access-pilot-2-pr359-spec.md
config/market-access-pilot-2-pr359.json
docs/market-access-record-spec.md
schemas/market-access-record-v1.schema.json
config/market-access-governance-v1.json
data/editorial-research/japan-stablecoin-market-access-2026.json
docs/migration/record-growth-batch-1-pr358-reviewed-handoff.json
\`\`\`

Exact bounded scope:

\`\`\`text
Japan / SBI VC Trade / VCTRADE
RLUSD / sog_st_rlusd
buy_sell, deposit, withdrawal, external_wallet_transfer
effective_from 2026-06-24
observed_at 2026-07-13
maximum four new records
\`\`\`

PR #359 preserves 112 canonical assets, 557 canonical Evidence identities, and 174 deployments. It expands Market Access from four to eight records by reusing existing canonical source identities. It adds no public product surface, ranking, score, or automatic monitoring promotion.
`;

function advance(body) {
  body = body
    .replaceAll('PR #358 Record Growth Batch 1: active', 'PR #358 Record Growth Batch 1: complete')
    .replaceAll('PR #359 Market Access Pilot 2: next', 'PR #359 Market Access Pilot 2: active')
    .replaceAll('PR #358  Record Growth Batch 1 — active', 'PR #358  Record Growth Batch 1 — complete')
    .replaceAll('PR #359  Market Access Pilot 2 — next', 'PR #359  Market Access Pilot 2 — active')
    .replaceAll('## 10. PR #358 — Record Growth Batch 1 — active', '## 10. PR #358 — Record Growth Batch 1 — complete')
    .replaceAll('## 11. PR #359 — Market Access Pilot 2', '## 11. PR #359 — Market Access Pilot 2 — active');
  if (!body.includes('PR #360 Evidence and Correction Batch: next')) {
    body = body.replace(
      /PR #359 Market Access Pilot 2: active\n```/,
      'PR #359 Market Access Pilot 2: active\nPR #360 Evidence and Correction Batch: next\n```'
    );
  }
  return body;
}

function ensureAuthority(file) {
  let body = advance(read(file));
  if (!body.includes('## PR #359 active authority')) body = `${body.trimEnd()}\n${authorityBlock}\n`;
  if (file === 'README.md') {
    body = body.replace('## Active PR #358 Record Growth Batch 1', '## Completed PR #358 Record Growth Batch 1');
    if (!body.includes('## Active PR #359 Market Access Pilot 2')) {
      body = body.replace('## Post-351 operating mode', '## Active PR #359 Market Access Pilot 2\n\nPR #359 promotes exactly four provider-scoped RLUSD Market Access records for Japan / SBI VC Trade / VCTRADE. Existing canonical Evidence identities are reused and expanded; no duplicate Evidence identity or new public product surface is allowed.\n\n## Post-351 operating mode');
    }
  }
  if (file === 'AGENTS.md' || file === 'docs/spec-governance.md') {
    body = body.replace(
      'Current work-item specification:\n\n```text\ndocs/quality/record-growth-batch-1-pr358-spec.md\n```',
      'Current work-item specification:\n\n```text\ndocs/quality/market-access-pilot-2-pr359-spec.md\n```'
    );
  }
  if (file === 'docs/roadmap.md') {
    body = body.replace('## 3. Completed program through PR #357', '## 3. Completed program through PR #358');
  }
  write(file, body);
}

updateEvidence();
for (const file of ['README.md', 'AGENTS.md', 'docs/spec-governance.md', 'docs/roadmap.md']) ensureAuthority(file);
console.log('PR #359 authority and canonical Evidence scope synchronized.');
