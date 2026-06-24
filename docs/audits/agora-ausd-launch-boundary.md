# Agora AUSD launch-boundary audit

Recorded: 2026-06-24

## Decision

- Canonical asset: `sog_st_agoraausd`
- Canonical launch date: retain `null`
- Launch-date queue category: retain Category C
- Earliest recovered current Ethereum contract boundary: `2024-07-07`
- Exact first production mint, approved-customer access, and broad public-availability boundary: unresolved
- Network launches are separate deployment events and must not replace the original asset launch boundary

The recovered evidence separates the pre-launch announcement, Ethereum contract deployment, first confirmed later network availability, and multi-network distribution period. It does not recover one day-level first-party boundary that safely represents the original public launch of AUSD.

The canonical `launch_date` must therefore remain `null`.

## Recovered boundaries

### 1. Funding and pre-launch announcement — 2024-04-02

Agora's official seed-round announcement dated 2024-04-02 states that AUSD would launch soon. This is a prospective product announcement and cannot be treated as an effective launch.

```text
https://www.agora.finance/press/agora-raises-12-million-seed-round
```

The announcement is useful for establishing that AUSD had not yet reached the reviewed public-launch boundary on that date.

### 2. Sui pre-announcement — 2024-05-29

The Sui Foundation announced the upcoming addition of AUSD and described an expected June release. It also referred to planned Ethereum, Arbitrum, and Optimism availability.

```text
https://blog.sui.io/agora-ausd-stablecoin-coming-to-sui/
```

This is another prospective network and ecosystem announcement, not proof that AUSD was already publicly live.

### 3. Ethereum production-contract creation — 2024-07-07

Agora's current official contract documentation identifies the canonical Ethereum AUSD address as:

```text
0x00000000eFE302BEAA2b3e6e1b18d08D69a9012a
```

The verified Ethereum creation transaction records creation of that AUSD token contract on 2024-07-07 at 22:28:59 UTC:

```text
Tx:      0xa892144a2bdb59bf3598e9e879c3863658bba90688de211bc538c38e6c3a6ed5
Block:   20259635
Created: 2024-07-07 22:28:59 UTC
```

This establishes the current Ethereum production-contract deployment boundary. It does **not** by itself establish:

- the first production mint
- the first approved-customer mint or redemption
- the first secondary-market acquisition route
- the first generally available interface
- the first unrestricted public availability

Contract deployment must therefore remain separate from canonical public launch.

### 4. Sui public availability with prior Ethereum and Avalanche activity — 2024-09-05

The Sui Foundation announced AUSD live on Sui on 2024-09-05 and stated that AUSD had already achieved activity on Ethereum and Avalanche, with nearly USD 60 million minted.

```text
https://blog.sui.io/agora-ausd-live-on-sui/
```

This proves that AUSD was in production and circulating before or by 2024-09-05. It does not identify the exact original day on which Ethereum or Avalanche users first obtained AUSD.

The Sui date is a network deployment and distribution boundary, not the original AUSD launch date.

### 5. Confirmed multi-network live state — 2024-10-09

A Wormhole Foundation release dated 2024-10-09 states that AUSD was live on Ethereum, Avalanche, and Sui and had surpassed USD 65 million in total value locked.

```text
https://www.prnewswire.com/news-releases/agora-selects-wormhole-as-core-interoperability-provider-for-ausd-302271571.html
```

This confirms a mature multi-network distribution state. It is later than the unresolved original launch and must not be substituted for it.

### 6. Injective deployment — 2024-10-31

Injective announced native AUSD integration on 2024-10-31 and described prior AUSD supply across Ethereum, Avalanche, and Sui.

```text
https://injective.com/blog/en/agora-launches-ausd-on-injective/
```

The Injective date is another network rollout event. It does not establish the original asset launch.

## Why the date remains unresolved

At least five separate lifecycle boundaries exist:

1. prospective product announcement on 2024-04-02
2. prospective Sui and network announcement on 2024-05-29
3. current Ethereum contract creation on 2024-07-07
4. first production mint and approved-customer access, not yet recovered
5. confirmed public and multi-network availability by 2024-09-05 and 2024-10-09

The current evidence does not recover:

- an official dated statement that AUSD was publicly launched on 2024-07-07
- the earliest successful mint transaction
- whether the earliest mint was deployment seeding, controlled testing, approved-customer issuance, or broader production issuance
- the first public liquidity-pool activation
- the first day on which a non-approved holder could acquire AUSD
- the first issuer interface or institutional issuance opening

Secondary sources that label the Ethereum contract-deployment date as the AUSD launch do not override the absence of a first-party day-level public-launch statement.

## Identity and network boundaries

- This record covers Agora Bermuda Limited's AUSD only.
- The same deterministic EVM address appearing on supported networks does not make every network activation one launch event.
- Ethereum contract creation, Avalanche availability, Sui launch, Injective launch, and later network additions are separate deployment boundaries.
- Issuer mint and redemption access for approved customers is separate from public secondary-market availability.
- LayerZero, Wormhole, bridge, OFT, and native-mint representations require deployment-level normalization rather than silent identity merging.

## Canonical implications

For the next synchronized canonical-quality update:

1. Keep `data/stablecoins-batch-f.json` launch date as `null`.
2. Keep `sog_st_agoraausd` in `data/quality/launch-date-unresolved.json` as Category C.
3. Preserve `launch_boundary_conflict` as the reason code.
4. Normalize the Ethereum deployment address to `0x00000000eFE302BEAA2b3e6e1b18d08D69a9012a` in a separate synchronized implementation PR.
5. Record 2024-07-07 only as the current Ethereum production-contract deployment boundary.
6. Add the Ethereum creation transaction as on-chain evidence when deployment normalization is implemented.
7. Preserve 2024-09-05 as the Sui public deployment boundary, not as the original AUSD launch.
8. Do not use the 2024-10-09 Wormhole release or 2024-10-31 Injective release as the original launch date.
9. Keep the network and representation map as an active known unknown until native, deterministic, bridged, and winding-down deployments are normalized.

## Remaining source work

- Recover the earliest successful AUSD mint on Ethereum.
- Determine whether that mint was internal seeding, controlled production, or approved-customer issuance.
- Recover a first-party dated statement that explicitly declares AUSD live or publicly available.
- Recover the earliest Ethereum and Avalanche liquidity-pool creation and first meaningful public trading activity.
- Recover archived issuer application or documentation showing the first day mint and redemption opened to approved customers.
- Normalize every current official contract address and determine native versus cross-chain representation.
- Resolve the exact Solana mint address and historical Solana availability claimed by the existing deployment record.
- Record the Injective wind-down and LayerZero migration separately if supported by current first-party evidence.

## Do not assert

- Do not set `2024-04-02` from the funding announcement.
- Do not set an expected June 2024 date from the Sui pre-announcement.
- Do not set `2024-07-07` as canonical public launch merely because the Ethereum token contract was created.
- Do not set `2024-09-05` from the Sui network launch as the original AUSD launch.
- Do not set `2024-10-09` or `2024-10-31` from later multi-network or Injective announcements.
- Do not describe direct issuer minting and redemption as universally permissionless.
- Do not merge native, bridged, OFT, or winding-down deployments without deployment-specific evidence.

## Primary and supporting sources

- Agora seed and pre-launch announcement: `https://www.agora.finance/press/agora-raises-12-million-seed-round`
- Agora official contract documentation: `https://docs.agora.finance/developer/contracts`
- Ethereum AUSD contract: `https://etherscan.io/address/0x00000000eFE302BEAA2b3e6e1b18d08D69a9012a`
- Ethereum creation transaction: `https://etherscan.io/tx/0xa892144a2bdb59bf3598e9e879c3863658bba90688de211bc538c38e6c3a6ed5`
- Sui AUSD pre-announcement: `https://blog.sui.io/agora-ausd-stablecoin-coming-to-sui/`
- Sui AUSD live announcement: `https://blog.sui.io/agora-ausd-live-on-sui/`
- Wormhole interoperability release: `https://www.prnewswire.com/news-releases/agora-selects-wormhole-as-core-interoperability-provider-for-ausd-302271571.html`
- Injective AUSD release: `https://injective.com/blog/en/agora-launches-ausd-on-injective/`

## Production status

This audit changes no canonical stable-asset, event, evidence, deployment, generated, Cloudflare, or public-production data. Deployment classification: **No production deployment required**.
