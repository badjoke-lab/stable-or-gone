export const eventPublicCopy: Record<string, { title?: string; description: string }> = {
  sog_ev_usdc_2023_03_depeg: {
    description: 'USDC traded below one US dollar after Circle disclosed that part of its reserves was held at Silicon Valley Bank. The peg recovered after federal banking measures and the reopening of normal operations.'
  },
  sog_ev_ust_2022_05_collapse: {
    description: 'UST lost its US dollar peg during the Terra and LUNA crisis in May 2022 and did not return as a functioning stablecoin. USTC continued trading afterward, but the original peg and redemption function did not recover.'
  },
  sog_ev_busd_2023_02_wind_down: {
    description: 'Paxos announced that it would stop issuing new BUSD and end its relationship with Binance for the product. Redemptions continued during the wind-down period.'
  },
  sog_ev_usdt_2021_10_cftc_order: {
    description: 'The CFTC issued an order concerning Tether statements about USDT reserves and related Bitfinex matters.'
  },
  sog_ev_usdt_2021_02_nyag_settlement: {
    description: 'The New York Attorney General announced a settlement involving Bitfinex and Tether entities, including requirements connected to reserve and transaction reporting.'
  },
  sog_ev_usdt_2026_06_12_tron_blacklist: {
    title: 'Tether blacklists a TRON address holding approximately 72 million USDT',
    description: 'Tether was reported to have blacklisted a TRON address holding 72,030,295.55 USDT after a wider 120,271,055.092505 USDT flow. The blacklist transaction hash, legal basis, requesting authority, source incident, and final outcome remain unresolved.'
  },
  sog_ev_usdc_2023_03_operations_reopen: {
    title: 'USDC operations reopen after the March 2023 banking weekend',
    description: 'Circle resumed normal operations after federal measures addressing the banking crisis. This marked the operational recovery phase of the March 2023 USDC depeg.'
  },
  sog_ev_dai_2019_11_multi_collateral_launch: {
    description: 'MakerDAO launched Multi-Collateral Dai, allowing additional collateral types and replacing the earlier single-collateral system.'
  },
  sog_ev_dai_2020_03_black_thursday: {
    title: 'Dai and MakerDAO during Black Thursday',
    description: 'The March 2020 market crash caused severe stress in MakerDAO, including liquidation problems and undercollateralized debt. Dai and the protocol continued operating after emergency changes.'
  },
  sog_ev_dai_2024_08_sky_transition: {
    title: 'MakerDAO introduces the Sky brand and USDS',
    description: 'The MakerDAO ecosystem introduced the Sky brand, USDS, and related products. DAI continued to exist alongside the newer Sky offerings.'
  },
  sog_ev_ust_2022_05_lfg_intervention: {
    title: 'Luna Foundation Guard deploys reserves during the UST collapse',
    description: 'Luna Foundation Guard used reserve assets during the UST crisis in an attempt to support the peg. The intervention did not restore UST as a functioning stablecoin.'
  },
  sog_ev_ust_2022_05_chain_halt: {
    title: 'Terra blockchain halted during the UST collapse',
    description: 'Validators halted and later restarted the Terra blockchain during the collapse. The interruption formed part of the wider failure of the original Terra and UST system.'
  },
  sog_ev_ust_2023_02_sec_charges: {
    description: 'The SEC charged Terraform Labs and Do Kwon following the collapse of the Terra ecosystem and UST.'
  },
  sog_ev_busd_2023_08_binance_phaseout: {
    title: 'Binance begins phasing out BUSD support',
    description: 'Binance announced that support for BUSD would be removed gradually across its products, separate from redemption arrangements offered by Paxos.'
  },
  sog_ev_fdusd_2023_launch_context: {
    title: 'First Digital launches FDUSD',
    description: 'First Digital introduced FDUSD as a US dollar stablecoin issued through FD121, with reserve reporting and client eligibility requirements.'
  },
  sog_ev_fdusd_2023_binance_adoption_context: {
    title: 'Binance expands support for FDUSD during the BUSD wind-down',
    description: 'As BUSD support was reduced, Binance increased the visibility and use of FDUSD across selected products and trading pairs.'
  },
  sog_ev_pyusd_2023_08_launch: {
    description: 'PayPal launched PayPal USD, a US dollar stablecoin issued by Paxos and made available through PayPal services and Ethereum.'
  },
  sog_ev_pyusd_2024_05_solana: {
    description: 'PayPal and Paxos expanded PYUSD to the Solana blockchain in addition to its existing Ethereum deployment.'
  },
  sog_ev_usdd_2022_05_launch: {
    title: 'TRON DAO Reserve launches USDD',
    description: 'USDD launched as a US dollar-pegged stablecoin associated with TRON DAO Reserve and a crypto-reserve stabilization model.'
  },
  sog_ev_gusd_2018_launch: {
    title: 'Gemini launches Gemini Dollar',
    description: 'Gemini launched Gemini Dollar as a US dollar-backed stablecoin on Ethereum, with minting and redemption through eligible Gemini accounts.'
  },
  sog_ev_lusd_liquity_v1_context: {
    title: 'Liquity V1 launches with LUSD',
    description: 'Liquity launched its original borrowing protocol with LUSD, a crypto-collateralized stablecoin backed by positions in the protocol.'
  },
  sog_ev_crvusd_launch_context: {
    title: 'Curve launches crvUSD',
    description: 'Curve introduced crvUSD with its LLAMMA lending and soft-liquidation design for supported crypto collateral.'
  },
  sog_ev_usde_launch_context: {
    title: 'Ethena launches USDe',
    description: 'Ethena launched USDe as a synthetic dollar supported by hedged crypto positions, custody arrangements, and minting and redemption rules.'
  },
  sog_ev_susd_synthetix_lifecycle_context: {
    title: 'sUSD across Synthetix V2 and V3',
    description: 'sUSD has served as a synthetic dollar within Synthetix, with its role and backing mechanics changing as the protocol moved from V2 toward V3.'
  },
  sog_ev_gho_2023_07_launch: {
    title: 'Aave DAO launches GHO on Ethereum',
    description: 'Aave governance launched GHO on Ethereum with the Aave V3 Ethereum Pool and FlashMinter as the initial facilitators. Later facilitators, stability modules, and canonical bridges extend the system without changing the canonical GHO identity.'
  },
  sog_ev_bold_2025_05_live: {
    title: 'Liquity V2 brings BOLD live',
    description: 'Liquity V2 introduced BOLD as an Ethereum-native stablecoin backed by WETH, wstETH, and rETH branches, with borrower-set interest rates and direct protocol redemption.'
  },
  sog_ev_usd0_2024_launch_phase: {
    title: 'Usual introduces the RWA-backed USD0 stablecoin',
    description: 'Usual introduced USD0 as a stablecoin collateralized by short-duration tokenized sovereign assets, with direct primary-market and indirect protocol or market issuance and redemption paths.'
  },
  sog_ev_usr_2026_03_unauthorized_mint: {
    title: 'Unauthorized USR minting incident restricts Resolv operations',
    description: 'Resolv reported unauthorized USR minting on 22 March 2026, paused most operations, and began containment and recovery. The protocol reported that the collateral pool remained intact; the final recovery and restart state remains unresolved.'
  }
};
