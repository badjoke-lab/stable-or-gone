const LOCAL_STABLECOIN_LOGOS: Readonly<Record<string, string>> = {
  aeur: '/stablecoin-logos/aeur.svg',
  dai: '/stablecoin-logos/dai.svg',
  gusd: '/stablecoin-logos/gusd.svg',
  pax: '/stablecoin-logos/pax.svg',
  paxg: '/stablecoin-logos/paxg.svg',
  tusd: '/stablecoin-logos/tusd.svg',
  usdc: '/stablecoin-logos/usdc.svg',
  usdt: '/stablecoin-logos/usdt.svg'
};

const normalizeLogoKey = (value?: string | null) => String(value ?? '').trim().toLowerCase();

export const resolveStablecoinLogo = ({ slug, symbol }: { slug?: string | null; symbol?: string | null }) => {
  const slugKey = normalizeLogoKey(slug);
  const symbolKey = normalizeLogoKey(symbol);
  return LOCAL_STABLECOIN_LOGOS[slugKey] ?? LOCAL_STABLECOIN_LOGOS[symbolKey] ?? null;
};

export const hasStablecoinLogo = (value: { slug?: string | null; symbol?: string | null }) => Boolean(resolveStablecoinLogo(value));
