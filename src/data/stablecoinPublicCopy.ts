export type StablecoinPublicCopy = {
  summary: string;
};

export const stablecoinPublicCopy: Readonly<Record<string, StablecoinPublicCopy>> = Object.freeze({
  usdt: {
    summary: 'A US dollar-pegged stablecoin issued by Tether across multiple blockchains. Its record includes reserves, redemption, regulation, deployments, and documented exercises of issuer-controlled blacklist or freeze authority.'
  },
  usdc: {
    summary: 'A US dollar-pegged stablecoin issued by Circle, supported by reserve reports, institutional redemption through Circle Mint, and a documented recovery from the March 2023 depeg.'
  },
  dai: {
    summary: 'A decentralized, multi-collateral stablecoin created through MakerDAO and now connected to the wider Sky ecosystem.'
  },
  ust: {
    summary: 'An algorithmic stablecoin from the Terra ecosystem that collapsed in May 2022 and did not recover its original function.'
  },
  busd: {
    summary: 'A Paxos-issued US dollar stablecoin branded with Binance that entered wind-down after new issuance stopped in 2023.'
  },
  frax: {
    summary: 'A stablecoin from the Frax ecosystem that has used a mix of collateral, protocol mechanisms, and market operations over time.'
  },
  tusd: {
    summary: 'A US dollar stablecoin associated with TrueUSD, with issuer redemption, attestation, and multi-chain history.'
  },
  fdusd: {
    summary: 'A US dollar stablecoin issued by First Digital, with issuer redemption limited to eligible clients and broad exchange use.'
  },
  pyusd: {
    summary: 'A US dollar stablecoin launched by PayPal and issued by Paxos, available through PayPal services and selected blockchain networks.'
  },
  usdd: {
    summary: 'A US dollar-pegged stablecoin associated with TRON DAO Reserve, using crypto reserves and protocol-based stabilization mechanisms.'
  },
  gusd: {
    summary: 'A US dollar-backed stablecoin issued by Gemini, with direct redemption through eligible Gemini accounts.'
  },
  lusd: {
    summary: 'A crypto-collateralized stablecoin from Liquity V1, distinct from the BOLD stablecoin introduced with Liquity V2.'
  },
  crvusd: {
    summary: 'A crypto-collateralized stablecoin from Curve Finance that uses LLAMMA-based lending and liquidation mechanics.'
  },
  usde: {
    summary: 'A synthetic dollar from Ethena that uses hedged crypto positions and related reserve assets rather than a simple fiat reserve model.'
  },
  susd: {
    summary: 'A synthetic dollar from the Synthetix ecosystem, whose role has changed across Synthetix V2 and V3.'
  },
  rlusd: {
    summary: 'A US dollar stablecoin launched by Ripple, with issuer reserve and redemption arrangements tied to Ripple and its service providers.'
  },
  eurc: {
    summary: 'A euro-backed stablecoin issued by Circle, with reserve reporting and direct institutional redemption under Circle terms.'
  },
  usdp: {
    summary: 'A US dollar stablecoin issued by Paxos, supported by issuer reserve reports and redemption through eligible Paxos accounts.'
  },
  usdg: {
    summary: 'A US dollar stablecoin connected to the Global Dollar Network and issued through Paxos-related arrangements.'
  },
  usds: {
    summary: 'A US dollar stablecoin in the Sky ecosystem, introduced alongside the transition from MakerDAO branding and products.'
  }
});

export function getStablecoinPublicSummary(slug: string, canonicalSummary?: string | null): string {
  const curated = stablecoinPublicCopy[slug]?.summary;
  if (curated) return curated;
  const canonical = canonicalSummary?.trim();
  return canonical && canonical.length > 0 ? canonical : 'A summary has not yet been added for this stablecoin.';
}
