import { publicTaxonomy, taxonomyLabel } from '../../config/public-taxonomy.mjs';

export function formatTaxonomyLabel(axis: string, value?: string | null, fallback = 'Unknown'): string {
  return taxonomyLabel(axis, value, fallback) ?? fallback;
}

export function formatLifecycleLabel(value?: string | null): string {
  return formatTaxonomyLabel('lifecycle_status', value, 'Unknown');
}

export function formatIssuanceLabel(value?: string | null): string {
  return formatTaxonomyLabel('issuance_status', value, 'Unknown');
}

export function getTaxonomyCategory(axis: string, value?: string | null): string | null {
  if (!value) return null;
  const definition = publicTaxonomy.axes[axis];
  if (!definition) return null;
  return definition.entries.find((entry) => entry.canonical_value === value || entry.legacy_aliases.includes(value))?.public_category ?? null;
}

export function lifecycleChipClass(value?: string | null): string {
  return `chip ${value ?? 'unknown'}`;
}
