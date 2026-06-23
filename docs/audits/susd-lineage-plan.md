# sUSD launch and lineage audit

Recorded: 2026-06-23

## Decision

- eUSD predecessor release: 2018-04-11
- eUSD hard closure: 2018-06-29
- Canonical current-asset launch: nUSD on 2018-06-11
- Current identity: sUSD
- nUSD-to-sUSD rebrand announcement: 2018-11-30
- Contract continuity: no address change for the rebrand

## Boundary

eUSD was an ETH-backed trial predecessor and was phased out before the HAV-backed nUSD system became the production stablecoin. nUSD launched on Ethereum mainnet on June 11, 2018. During the Havven-to-Synthetix transition, nUSD was renamed sUSD without a contract-address change; the December 7 Synth launch confirmed that sUSD had been live since June as nUSD.

## Registry treatment

The sUSD record uses 2018-06-11 as its canonical launch date. eUSD is recorded as a separate predecessor lifecycle event, not as an alias or the current asset launch. nUSD is retained as an alias and the 2018 rename is a separate rebrand event. Later V2/V3, debt-pool, 420 Pool, depeg, and SIP-423 events remain independent lifecycle layers.
