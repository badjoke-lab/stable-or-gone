# VCHF Launch-Boundary Review

Recorded: 2026-06-25

Result: IMPLEMENTED — LAUNCH RESOLVED

Stablecoin: `sog_st_vchf`

Current canonical launch date: `2022-12-15`

## Evidence

VNX published a first-party release on 2022-12-15 stating that it launched VNX Euro and VNX Swiss Franc and that users could trade, deposit, and withdraw the tokens through Emirex.

```text
https://medium.com/@vnx/vnx-launches-europes-first-tokens-referencing-fiat-currencies-with-an-underlying-gold-base-value-26867d197042
```

VNX's year-end review dated 2022-12-27 confirms that VEUR and VCHF launched in December 2022, were issued on Ethereum, and were listed on Emirex.

```text
https://vnx.li/vnxs-recap-of-2022/
```

Later launches on Polygon, Avalanche, Stellar, Solana, Tezos, and other networks are deployment or distribution boundaries rather than the original asset launch.

## Decision

Set VCHF `launch_date` to:

```text
2022-12-15
```

Retain:

```text
status: active
discontinued_date: null
```

## Implementation result

1. Set VCHF `launch_date` to `2022-12-15`.
2. Add a dated launch event and Event v2 launch detail.
3. Add the first-party launch and year-end review evidence.
4. Update the Ethereum deployment note and evidence.
5. Preserve later network launches as separate deployment events.
6. Replace the launch unknown with unresolved exact contract-deployment, first-issuance, and initial-distribution boundaries.
7. Remove VCHF from the unresolved launch queue.
8. Reduce the queue from 20 to 19 and Category C from 14 to 13.
9. Synchronize baselines, generated outputs, README, audits, and roadmap.
