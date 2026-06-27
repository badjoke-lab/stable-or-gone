export type StablecoinPublicCopy = {
  summary: string;
};

export const stablecoinPublicCopy: Readonly<Record<string, StablecoinPublicCopy>>;
export const stablecoinPublicCopySlugs: readonly string[];
export function getStablecoinPublicSummary(slug: string, canonicalSummary?: string | null): string;
