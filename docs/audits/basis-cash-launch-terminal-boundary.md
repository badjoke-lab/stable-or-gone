# Basis Cash launch and terminal-boundary audit

Recorded: 2026-06-24

## Decision

- Canonical asset: `sog_st_bac`
- Canonical launch date: `2020-11-30`
- Launch-date queue action: remove from Category C
- Canonical terminal date: retain `null`
- Terminal-date queue action: retain unresolved
- Canonical Ethereum BAC contract: `0x3449fc1cd036255ba1eb19d65ff4ba2b8903a69a`
- Contract-creation transaction: `0x19fa45dacde46f73af21893c7649c48eebc05feec8811ac9848931106fc6c947`
- Basis Cash V2 activation on 2021-04-26: protocol-version event, not a new BAC asset launch

The reviewed evidence supports 2020-11-30 as the original public launch boundary for Basis Cash. The official pre-launch guide described the distribution and application flow, the canonical BAC contract and creation transaction anchor the production deployment, and contemporaneous reporting states that the contracts opened to users on 2020-11-30.

The reviewed evidence does not support a day-level final shutdown, mint-disable, governance termination, redemption termination, or contract end state. BAC's failure as a stable asset and its loss of practical protocol relevance must remain separate from a fabricated terminal date.

## Recovered boundaries

### 1. Official distribution guide — 2020-11-17

Basis Cash published its official distribution guide on 2020-11-17. The guide described:

- a total initial distribution of 50,000 BAC
- five daily distribution periods of 10,000 BAC
- five stablecoin liquidity pools
- use of the Basis Cash application to deposit liquidity-provider tokens and claim BAC

```text
https://basiscash.medium.com/basis-cash-the-roadmap-ahead-3a2b2a3c4b1a
```

The guide establishes the intended public distribution design and near-term launch process. It is a pre-launch instruction boundary, not by itself the effective launch date.

### 2. Public contract opening and original BAC launch — 2020-11-30

Contemporaneous reporting published on 2020-11-30 states that Basis Cash smart contracts opened to users early that day. This matches the official distribution chronology and the canonical Ethereum deployment lineage.

SOG therefore uses:

```text
2020-11-30
```

as the canonical public launch date for the original BAC stable asset.

This boundary represents the opening of the public protocol and initial distribution system, not a later exchange listing, price observation, V2 upgrade, or retrospective project-history date.

### 3. Canonical BAC Ethereum contract

The reviewed canonical BAC contract is:

```text
Contract: 0x3449fc1cd036255ba1eb19d65ff4ba2b8903a69a
Tx:       0x19fa45dacde46f73af21893c7649c48eebc05feec8811ac9848931106fc6c947
Chain:    Ethereum
```

The contract lineage supports the original production deployment and distinguishes BAC from the related Basis Bond (`BAB`) and Basis Share (`BAS`) mechanism tokens.

Contract creation is supporting evidence for the launch chronology. The public-opening evidence is still necessary because deployment alone does not prove general availability.

### 4. Official retrospective confirmation — 2021-02-02

The official Basis Cash V2 migration plan published on 2021-02-02 states that approximately two months had passed since Basis Cash launched. This is consistent with the 2020-11-30 public-launch boundary.

The same document discusses:

- migration of Basis Share liquidity
- BAC liquidity and incentive changes
- transition planning for V2

It does not redefine the original BAC launch.

### 5. Basis Cash V2 activation — 2021-04-26

Basis Cash announced that V2 became live at 00:00 UTC on 2021-04-26.

This is a later protocol-version boundary. It must be recorded separately because:

- the original BAC asset and public protocol already existed
- V2 changed protocol architecture and incentives
- V2 did not make 2021-04-26 the original BAC launch date
- migration and liquidity changes do not automatically create a separate canonical stable asset

### 6. Peg failure and practical collapse

BAC failed to restore durable dollar parity and the three-token seigniorage system ceased to function as a relevant stable asset system.

That supports:

```text
status: failed
```

It does not establish a final day-level terminal boundary.

The following must remain separate:

- first material depeg
- prolonged loss of peg relevance
- last meaningful liquidity
- last governance or repository activity
- minting or protocol-function disablement
- final contract or token termination

### 7. Continuing contract-level activity

The canonical BAC token contract remains deployed and token transfers can still occur. Continuing ERC-20 transferability does not mean Basis Cash remains an active stablecoin protocol, but it prevents SOG from treating an assumed last market or development date as a final contract termination.

No reviewed source establishes:

- a formal shutdown announcement
- a final migration deadline
- revocation of all mint or protocol roles
- a final redemption or conversion deadline
- disabling of the BAC token contract
- a final end block for the original protocol

The canonical `discontinued_date` must remain `null`.

## Identity and version boundaries

- BAC is the canonical stable asset.
- BAB and BAS are related mechanism tokens, not aliases of BAC.
- Original Basis Cash and Basis Cash V2 belong to one protocol lineage unless future contract evidence requires a split.
- The 2021-04-26 V2 activation is a protocol upgrade event.
- A V2 launch must not replace the original 2020-11-30 BAC launch.
- Peg failure and practical irrelevance do not equal exact token or contract termination.

## Canonical implications

The synchronized implementation should:

1. Set `data/stablecoins-batch-k.json` launch date to `2020-11-30`.
2. Keep `discontinued_date: null`.
3. Remove `sog_st_bac` from `data/quality/launch-date-unresolved.json`.
4. Retain `sog_st_bac` in `data/quality/terminal-date-unresolved.json`.
5. Add a dedicated launch event dated `2020-11-30`.
6. Add Event v2 launch detail.
7. Add first-party pre-launch/distribution evidence.
8. Add canonical Ethereum contract and creation-transaction evidence.
9. Add contemporaneous public-opening evidence.
10. Normalize the Ethereum deployment contract address.
11. Preserve the existing collapse event separately from launch and V2.
12. Record the 2021-04-26 V2 activation as a separate protocol-version event if implemented in this pass.
13. Update the terminal known unknown without inventing a shutdown date.
14. Synchronize generated statistics, integrity audit, Registry v2/v3 baselines, README, launch review, terminal review, and roadmap.

## Remaining unknowns

- exact deployment timestamp of every BAC, BAB, BAS, boardroom, treasury, oracle, and distribution contract
- first successful public BAC claim transaction
- complete V1-to-V2 contract and liquidity migration map
- exact date on which minting or expansion became practically inactive
- exact date of last functioning contraction or expansion epoch
- any formal governance, administrator, or contract termination action
- final economic liabilities or residual holder routes
- final contract-level end state, if one ever occurs

These unknowns do not block the reviewed original launch date.

## Do not assert

- Do not use 2020-11-17 as the launch merely because the guide was published.
- Do not use an exchange listing as the original launch.
- Do not use 2021-04-26 V2 activation as the original BAC launch.
- Do not use the first depeg, price low, last repository commit, last website capture, or negligible-liquidity date as the terminal date.
- Do not classify continuing ERC-20 transferability as evidence that the stablecoin protocol remains active.
- Do not merge BAC, BAB, and BAS into one canonical token identity.

## Primary and supporting sources

- Official Basis Cash repository: `https://github.com/Basis-Cash/basis-cash-protocol`
- Official Basis Cash documentation archive: `https://docs.basis.cash/`
- Official distribution guide, 2020-11-17: `https://basiscash.medium.com/basis-cash-the-roadmap-ahead-3a2b2a3c4b1a`
- Official V2 migration plan, 2021-02-02
- Official Basis Cash roadmap, 2021-02-28
- Official Basis Cash V2 live announcement, 2021-04-26
- Canonical BAC contract: `https://etherscan.io/address/0x3449fc1cd036255ba1eb19d65ff4ba2b8903a69a`
- Contract creation transaction: `https://etherscan.io/tx/0x19fa45dacde46f73af21893c7649c48eebc05feec8811ac9848931106fc6c947`
- Contemporaneous public-opening report, 2020-11-30

## Production status

This audit changes no canonical stable-asset, event, evidence, deployment, generated, Cloudflare, or public-production data. Deployment classification: **No production deployment required**.
