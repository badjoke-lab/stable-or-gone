import { getGuide } from './guideCatalog';

export interface StablecoinGuideLink {
  href: string;
  title: string;
  summary: string;
}

const guideCoverage: Record<string, string[]> = {
  'japan-stablecoin-access-usdc-rlusd-jpysc': ['usdc', 'rlusd', 'jpysc'],
  'eu-stablecoin-access-after-mica': ['usdt', 'usdc', 'eurc', 'dai', 'pyusd', 'rlusd', 'tusd', 'fdusd', 'usdp', 'gusd', 'usdd', 'usds', 'eurt', 'euri', 'eurcv', 'eurq', 'usdq', 'usdg'],
  'genius-act-stablecoins': ['usdc', 'usdt', 'pyusd', 'rlusd', 'usdg', 'dai', 'usds'],
  'mica-stablecoins': ['usdc', 'eurc', 'usdt', 'euri', 'eurcv', 'eurq', 'rlusd', 'dai', 'usds', 'frax'],
  'uk-stablecoin-capital-rules-2026': ['usdc', 'usdt', 'pyusd', 'rlusd', 'dai', 'usds'],
  'open-usd-reserve-revenue-model': ['usdc', 'usdt', 'pyusd', 'rlusd', 'usdg'],
  'jpyc-vs-jpysc': ['jpyc', 'jpysc', 'gyen']
};

export function getRelatedGuidesForStablecoin(stablecoinSlug: string): StablecoinGuideLink[] {
  return Object.entries(guideCoverage)
    .filter(([, stablecoinSlugs]) => stablecoinSlugs.includes(stablecoinSlug))
    .map(([guideSlug]) => {
      const guide = getGuide(guideSlug);
      return {
        href: `/guides/${guide.slug}/`,
        title: guide.title,
        summary: guide.summary
      };
    });
}

export const stablecoinGuideCoverage = guideCoverage;
