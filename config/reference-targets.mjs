export const referenceComparisonCategories = [
  { value: 'usd', public_label: 'US dollar', sort_order: 10 },
  { value: 'eur', public_label: 'Euro', sort_order: 20 },
  { value: 'jpy', public_label: 'Japanese yen', sort_order: 30 },
  { value: 'other_fiat', public_label: 'Other fiat currency', sort_order: 40 },
  { value: 'gold', public_label: 'Gold', sort_order: 50 },
  { value: 'floating_protocol', public_label: 'Floating protocol target', sort_order: 60 },
  { value: 'indexed_or_inflation_linked', public_label: 'Indexed or inflation-linked target', sort_order: 70 }
];

export const referenceTargets = {
  USD: {
    reference_kind: 'fiat',
    comparison_category: 'usd',
    public_label: 'US dollar',
    methodology_description: 'Targets a US dollar reference value unless the record documents a different target value.'
  },
  EUR: {
    reference_kind: 'fiat',
    comparison_category: 'eur',
    public_label: 'Euro',
    methodology_description: 'Targets a euro reference value.'
  },
  JPY: {
    reference_kind: 'fiat',
    comparison_category: 'jpy',
    public_label: 'Japanese yen',
    methodology_description: 'Targets a Japanese yen reference value.'
  },
  AED: {
    reference_kind: 'fiat',
    comparison_category: 'other_fiat',
    public_label: 'UAE dirham',
    methodology_description: 'Targets a UAE dirham reference value.'
  },
  BRL: {
    reference_kind: 'fiat',
    comparison_category: 'other_fiat',
    public_label: 'Brazilian real',
    methodology_description: 'Targets a Brazilian real reference value.'
  },
  CHF: {
    reference_kind: 'fiat',
    comparison_category: 'other_fiat',
    public_label: 'Swiss franc',
    methodology_description: 'Targets a Swiss franc reference value.'
  },
  SGD: {
    reference_kind: 'fiat',
    comparison_category: 'other_fiat',
    public_label: 'Singapore dollar',
    methodology_description: 'Targets a Singapore dollar reference value.'
  },
  TRY: {
    reference_kind: 'fiat',
    comparison_category: 'other_fiat',
    public_label: 'Turkish lira',
    methodology_description: 'Targets a Turkish lira reference value.'
  },
  GOLD: {
    reference_kind: 'commodity',
    comparison_category: 'gold',
    public_label: 'Gold',
    methodology_description: 'Uses a gold-denominated reference rather than a fiat currency target.'
  },
  RAI_REDEMPTION_PRICE: {
    reference_kind: 'floating',
    comparison_category: 'floating_protocol',
    public_label: 'Floating protocol redemption price',
    methodology_description: 'Uses a protocol redemption price that can move instead of targeting a fixed fiat value.'
  },
  AMPL_CPI_ADJUSTED_TARGET: {
    reference_kind: 'index',
    comparison_category: 'indexed_or_inflation_linked',
    public_label: 'CPI-adjusted AMPL target',
    methodology_description: 'Uses an indexed stable-value target derived from the AMPL system and its CPI-adjusted methodology.'
  },
  USD_WITH_TRUFLATION_LINKED_REBASE: {
    reference_kind: 'fiat',
    comparison_category: 'indexed_or_inflation_linked',
    public_label: 'US dollar with Truflation-linked rebase',
    methodology_description: 'Uses a US dollar reference while a Truflation-linked positive rebase changes balances over time.'
  }
};

export function getReferenceTargetDefinition(value) {
  if (!value) return null;
  return referenceTargets[value] ?? null;
}

export function getReferenceComparisonCategory(value) {
  return getReferenceTargetDefinition(value)?.comparison_category ?? null;
}

export function getReferenceComparisonCategoryLabel(value, fallback = 'Unknown reference category') {
  const category = referenceComparisonCategories.find((item) => item.value === value);
  return category?.public_label ?? fallback;
}
