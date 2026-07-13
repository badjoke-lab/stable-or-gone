import fs from 'node:fs';

const files = [
  'README.md',
  'AGENTS.md',
  'docs/spec-governance.md',
  'docs/roadmap.md'
];

const replacements = [
  ['current USD reserve-backed institutional stablecoins', 'current USD payment stablecoins with distinct stabilization models'],
  ['current regulated bank and payment stablecoins', 'current USD payment stablecoins with distinct stabilization models'],
  ['Global Dollar (USDG) and World Liberty Financial USD1 (USD1)', 'StraitsX USD (XUSD) and USDB'],
  ['Global Dollar / USDG / sog_st_usdg', 'StraitsX USD / XUSD / sog_st_xusd'],
  ['World Liberty Financial USD1 / USD1 / sog_st_usd1', 'USDB / USDB / sog_st_usdb'],
  ['Global Dollar / USDG / proposed ID sog_st_usdg', 'StraitsX USD / XUSD / proposed ID sog_st_xusd'],
  ['World Liberty Financial USD1 / USD1 / proposed ID sog_st_usd1', 'USDB / USDB / proposed ID sog_st_usdb'],
  ['SoFiUSD / SoFiUSD / sog_st_sofiusd', 'USDB / USDB / sog_st_usdb'],
  ['SoFiUSD / SoFiUSD / proposed ID sog_st_sofiusd', 'USDB / USDB / proposed ID sog_st_usdb'],
  ['StraitsX USD (XUSD) and SoFiUSD', 'StraitsX USD (XUSD) and USDB'],
  ['bounded USDG/USD1 full-record growth batch', 'bounded XUSD/USDB full-record growth batch'],
  ['bounded XUSD/SoFiUSD full-record growth batch', 'bounded XUSD/USDB full-record growth batch'],
  ['sog_cand_pr358_usdg', 'sog_cand_pr358_xusd'],
  ['sog_cand_pr358_usd1', 'sog_cand_pr358_usdb'],
  ['sog_cand_pr358_sofiusd', 'sog_cand_pr358_usdb'],
  ['sog_st_usdg', 'sog_st_xusd'],
  ['sog_st_usd1', 'sog_st_usdb'],
  ['sog_st_sofiusd', 'sog_st_usdb'],
  ['global-dollar-usdg', 'straitsx-usd-xusd'],
  ['world-liberty-financial-usd1', 'blast-usdb'],
  ['sofiusd', 'blast-usdb']
];

for (const file of files) {
  let body = fs.readFileSync(file, 'utf8');
  for (const [from, to] of replacements) body = body.split(from).join(to);
  fs.writeFileSync(file, body);
}

console.log(JSON.stringify({
  ok: true,
  files,
  context_group: 'current_usd_payment_stablecoins_with_distinct_stabilization_models',
  selected_candidates: ['sog_cand_pr358_xusd', 'sog_cand_pr358_usdb'],
  proposed_asset_ids: ['sog_st_xusd', 'sog_st_usdb']
}, null, 2));
