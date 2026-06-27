import { cleanPublicText } from '../utils/publicText';

export type StablecoinPublicCopy = Readonly<{
  summary?: string;
}>;

export const stablecoinPublicCopyById: Readonly<Record<string, StablecoinPublicCopy>> = {
  sog_st_usdt: {
    summary: 'A US dollar-pegged stablecoin issued by Tether across multiple blockchains. Its record includes reserves, redemption, regulation, deployments, and documented exercises of issuer-controlled blacklist or freeze authority.'
  },
  sog_st_usdc: {
    summary: 'A US dollar-pegged stablecoin issued by Circle, supported by reserve reports, institutional redemption through Circle Mint, and a documented recovery from the March 2023 depeg.'
  },
  sog_st_dai: {
    summary: 'A decentralized, multi-collateral stablecoin created through MakerDAO and now connected to the wider Sky ecosystem.'
  },
  sog_st_ust: {
    summary: 'An algorithmic stablecoin from the Terra ecosystem that collapsed in May 2022 and did not recover its original function.'
  },
  sog_st_busd: {
    summary: 'A Paxos-issued US dollar stablecoin branded with Binance that entered wind-down after new issuance stopped in 2023.'
  },
  sog_st_frax: {
    summary: 'A stablecoin from the Frax ecosystem that has used a mix of collateral, protocol mechanisms, and market operations over time.'
  },
  sog_st_tusd: {
    summary: 'A US dollar stablecoin associated with TrueUSD, with issuer redemption, attestation, and multi-chain history.'
  },
  sog_st_fdusd: {
    summary: 'A US dollar stablecoin issued by First Digital, with issuer redemption limited to eligible clients and broad exchange use.'
  },
  sog_st_pyusd: {
    summary: 'A US dollar stablecoin launched by PayPal and issued by Paxos, available through PayPal and selected blockchain networks.'
  },
  sog_st_usdd: {
    summary: 'A US dollar-pegged stablecoin associated with TRON DAO Reserve, using crypto reserves and protocol-based stabilization mechanisms.'
  },
  sog_st_gusd: {
    summary: 'A US dollar-backed stablecoin issued by Gemini, with direct redemption through eligible Gemini accounts.'
  },
  sog_st_lusd: {
    summary: 'A crypto-collateralized stablecoin from Liquity V1, distinct from the BOLD stablecoin introduced with Liquity V2.'
  },
  sog_st_crvusd: {
    summary: 'A crypto-collateralized stablecoin from Curve Finance that uses LLAMMA-based lending and liquidation mechanics.'
  },
  sog_st_usde: {
    summary: 'A synthetic dollar from Ethena that uses hedged crypto positions and related reserve assets rather than a simple fiat reserve model.'
  },
  sog_st_susd: {
    summary: 'A synthetic dollar from the Synthetix ecosystem, whose role has changed across Synthetix V2 and V3.'
  },
  sog_st_rlusd: {
    summary: 'A US dollar stablecoin launched by Ripple, with issuer reserve and redemption arrangements tied to Ripple and its service providers.'
  },
  sog_st_eurc: {
    summary: 'A euro-backed stablecoin issued by Circle, with reserve reporting and direct institutional redemption under Circle terms.'
  },
  sog_st_usdp: {
    summary: 'A US dollar stablecoin issued by Paxos, supported by issuer reserve reports and redemption through eligible Paxos accounts.'
  },
  sog_st_usdg: {
    summary: 'A US dollar stablecoin connected to the Global Dollar Network and issued through Paxos-related arrangements.'
  },
  sog_st_usds: {
    summary: 'A US dollar stablecoin in the Sky ecosystem, introduced alongside the transition from MakerDAO branding and products.'
  }
};

export const stablecoinPublicCopyOverrideIds = Object.freeze(Object.keys(stablecoinPublicCopyById).sort());

export function getStablecoinPublicSummary(coin: {
  id: string;
  summary?: string | null;
}): string {
  return stablecoinPublicCopyById[coin.id]?.summary
    ?? cleanPublicText(coin.summary, 'A summary has not yet been added for this stablecoin.');
}
