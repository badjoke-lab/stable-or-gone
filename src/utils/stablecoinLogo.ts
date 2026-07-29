const LOGOS_BY_SLUG: Readonly<Record<string, string>> = {
  aeur: '/stablecoin-logos/aeur.svg',
  dai: '/stablecoin-logos/dai.svg',
  dola: '/stablecoin-logos/dola.svg',
  eurc: '/stablecoin-logos/eurc.svg',
  eurt: '/stablecoin-logos/eurt.svg',
  fdusd: '/stablecoin-logos/fdusd.svg',
  fei: '/stablecoin-logos/fei.svg',
  frax: '/stablecoin-logos/frax.svg',
  gho: '/stablecoin-logos/gho.svg',
  gusd: '/stablecoin-logos/gusd.svg',
  gyen: '/stablecoin-logos/gyen.svg',
  husd: '/stablecoin-logos/husd.svg',
  iron: '/stablecoin-logos/iron.svg',
  ist: '/stablecoin-logos/ist.svg',
  lusd: '/stablecoin-logos/lusd.svg',
  mim: '/stablecoin-logos/mim.svg',
  ousd: '/stablecoin-logos/ousd.svg',
  pax: '/stablecoin-logos/pax.svg',
  paxg: '/stablecoin-logos/paxg.svg',
  pyusd: '/stablecoin-logos/pyusd.svg',
  rai: '/stablecoin-logos/rai.svg',
  sai: '/stablecoin-logos/sai.svg',
  susd: '/stablecoin-logos/susd.svg',
  tryb: '/stablecoin-logos/tryb.svg',
  tusd: '/stablecoin-logos/tusd.svg',
  usdc: '/stablecoin-logos/usdc.svg',
  usdd: '/stablecoin-logos/usdd.svg',
  usde: '/stablecoin-logos/usde.svg',
  usdt: '/stablecoin-logos/usdt.svg',
  vai: '/stablecoin-logos/vai.svg',
  xaut: '/stablecoin-logos/xaut.svg',
  xsgd: '/stablecoin-logos/xsgd.svg'
};

// Symbol fallback is intentionally allow-listed. Ambiguous corpus symbols such as
// USX, USDX, and USDN must never resolve to a logo by symbol alone.
const LOGOS_BY_AUDITED_UNIQUE_SYMBOL: Readonly<Record<string, string>> = {
  aeur: LOGOS_BY_SLUG.aeur,
  dai: LOGOS_BY_SLUG.dai,
  dola: LOGOS_BY_SLUG.dola,
  eurc: LOGOS_BY_SLUG.eurc,
  eurt: LOGOS_BY_SLUG.eurt,
  fdusd: LOGOS_BY_SLUG.fdusd,
  fei: LOGOS_BY_SLUG.fei,
  frax: LOGOS_BY_SLUG.frax,
  gho: LOGOS_BY_SLUG.gho,
  gusd: LOGOS_BY_SLUG.gusd,
  gyen: LOGOS_BY_SLUG.gyen,
  husd: LOGOS_BY_SLUG.husd,
  iron: LOGOS_BY_SLUG.iron,
  ist: LOGOS_BY_SLUG.ist,
  lusd: LOGOS_BY_SLUG.lusd,
  mim: LOGOS_BY_SLUG.mim,
  ousd: LOGOS_BY_SLUG.ousd,
  paxg: LOGOS_BY_SLUG.paxg,
  pyusd: LOGOS_BY_SLUG.pyusd,
  rai: LOGOS_BY_SLUG.rai,
  sai: LOGOS_BY_SLUG.sai,
  susd: LOGOS_BY_SLUG.susd,
  tryb: LOGOS_BY_SLUG.tryb,
  tusd: LOGOS_BY_SLUG.tusd,
  usdc: LOGOS_BY_SLUG.usdc,
  usdd: LOGOS_BY_SLUG.usdd,
  usde: LOGOS_BY_SLUG.usde,
  usdp: LOGOS_BY_SLUG.pax,
  usdt: LOGOS_BY_SLUG.usdt,
  vai: LOGOS_BY_SLUG.vai,
  xaut: LOGOS_BY_SLUG.xaut,
  xsgd: LOGOS_BY_SLUG.xsgd
};

const normalizeLogoKey = (value?: string | null) => String(value ?? '').trim().toLowerCase();

export const LOCAL_STABLECOIN_LOGO_COUNT = Object.keys(LOGOS_BY_SLUG).length;

export const resolveStablecoinLogo = ({ slug, symbol }: { slug?: string | null; symbol?: string | null }) => {
  const slugKey = normalizeLogoKey(slug);
  const symbolKey = normalizeLogoKey(symbol);
  return LOGOS_BY_SLUG[slugKey] ?? LOGOS_BY_AUDITED_UNIQUE_SYMBOL[symbolKey] ?? null;
};

export const hasStablecoinLogo = (value: { slug?: string | null; symbol?: string | null }) => Boolean(resolveStablecoinLogo(value));
