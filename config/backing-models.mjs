import { publicTaxonomy } from './public-taxonomy.mjs';

const assignmentsByCategory = {
  fiat_and_cash_equivalent: [
    'agora-ausd', 'brz', 'busd', 'eurau', 'eurc', 'eurcv', 'euri', 'eurq', 'eurs', 'eurt',
    'fdusd', 'gusd', 'gyen', 'husd', 'jpyc', 'jpysc', 'pyusd', 'rlusd', 'sofiusd', 'tryb',
    'tusd', 'usat', 'usd1', 'usdc', 'usdg', 'usdgo', 'usdh', 'usdp', 'usdq', 'usdt', 'xsgd'
  ],
  crypto_collateralized: [
    'alusd', 'avalon-usda', 'berachain-honey', 'bold', 'cashio-dollar', 'crvusd', 'dai',
    'dforce-usx', 'djed', 'dola', 'eura', 'fx-protocol-fxusd', 'gho', 'lisusd', 'lusd',
    'mainstreet-msusd', 'mento-dollar', 'mim', 'mountain-usdm', 'origin-dollar', 'qidao-mai',
    'rai', 'sai', 'usdn', 'usds', 'usk', 'vai'
  ],
  tokenized_asset_backed: [
    'anzen-usdz', 'm0-m', 'noble-usdn', 'usd0', 'usdtb', 'usdy', 'usyc'
  ],
  commodity_backed: ['paxg', 'xaut'],
  algorithmic_or_unbacked: ['basis-cash', 'dynamic-set-dollar', 'empty-set-dollar', 'ust'],
  synthetic_or_hedged: ['falcon-usdf', 'spot', 'stables-labs-usdx', 'susd', 'usde', 'usr'],
  hybrid_or_mixed: [
    'acala-ausd', 'fei', 'frax', 'gyroscope-gyd', 'iron', 'musd', 'nuon',
    'solstice-usx', 'united-stables-u', 'usdd'
  ],
  wrapper_or_receipt: ['sdai', 'susde', 'susds'],
  other: [],
  unknown: ['ae-coin', 'vchf']
};

export const publicBackingModelAssignments = Object.fromEntries(
  Object.entries(assignmentsByCategory).flatMap(([category, slugs]) => slugs.map((slug) => [slug, category]))
);

export const publicBackingModelCategories = publicTaxonomy.axes.public_model_category.entries
  .map((entry) => ({
    value: entry.canonical_value,
    public_category: entry.public_category,
    public_label: entry.public_label,
    sort_order: entry.sort_order,
    is_filterable: entry.is_filterable
  }))
  .sort((a, b) => a.sort_order - b.sort_order);

export function getPublicBackingModelCategory(slug) {
  return publicBackingModelAssignments[slug] ?? null;
}

export function getPublicBackingModelDefinition(value) {
  if (!value) return null;
  return publicBackingModelCategories.find((entry) => entry.value === value) ?? null;
}

export function getPublicBackingModelLabel(value, fallback = 'Unknown model') {
  return getPublicBackingModelDefinition(value)?.public_label ?? fallback;
}
