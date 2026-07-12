import fs from 'node:fs';

const files = [
  'scripts/validate-record-growth-batch-1-selection-pr358.mjs',
  'scripts/check-workstream-118.mjs',
  '.github/workflows/pr358-record-growth-batch-1.yml',
  'README.md',
  'AGENTS.md',
  'docs/spec-governance.md',
  'docs/roadmap.md'
];

const replacements = [
  ['current_usd_reserve_backed_institutional_stablecoins', 'current_regulated_bank_and_payment_stablecoins'],
  ['current USD reserve-backed institutional stablecoins', 'current regulated bank and payment stablecoins'],
  ['sog_cand_pr358_usdg', 'sog_cand_pr358_xusd'],
  ['sog_cand_pr358_usd1', 'sog_cand_pr358_sofiusd'],
  ['sog_st_usdg', 'sog_st_xusd'],
  ['sog_st_usd1', 'sog_st_sofiusd'],
  ['global-dollar-usdg', 'straitsx-usd-xusd'],
  ['world-liberty-financial-usd1', 'sofiusd'],
  ['Global Dollar / USDG / proposed ID sog_st_xusd', 'StraitsX USD / XUSD / proposed ID sog_st_xusd'],
  ['World Liberty Financial USD1 / USD1 / proposed ID sog_st_sofiusd', 'SoFiUSD / SoFiUSD / proposed ID sog_st_sofiusd'],
  ['Global Dollar / USDG / sog_st_xusd', 'StraitsX USD / XUSD / sog_st_xusd'],
  ['World Liberty Financial USD1 / USD1 / sog_st_sofiusd', 'SoFiUSD / SoFiUSD / sog_st_sofiusd'],
  ['Global Dollar (USDG) and World Liberty Financial USD1 (USD1)', 'StraitsX USD (XUSD) and SoFiUSD'],
  ["['USDG', 'USD1']", "['XUSD', 'SoFiUSD']"],
  ["['Global Dollar', 'USDG', 'World Liberty Financial USD1', 'USD1']", "['StraitsX USD', 'XUSD', 'SoFiUSD']"],
  ['`USDG`', '`XUSD`'],
  ['`USD1`', '`SoFiUSD`']
];

for (const file of files) {
  let body = fs.readFileSync(file, 'utf8');
  for (const [from, to] of replacements) body = body.split(from).join(to);
  fs.writeFileSync(file, body);
}

console.log(JSON.stringify({
  ok: true,
  files,
  selected_candidates: ['sog_cand_pr358_xusd', 'sog_cand_pr358_sofiusd'],
  proposed_asset_ids: ['sog_st_xusd', 'sog_st_sofiusd']
}, null, 2));
