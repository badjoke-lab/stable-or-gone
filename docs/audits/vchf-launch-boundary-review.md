# VCHF Launch-Boundary Review

Recorded: 2026-06-25

Result: IMPLEMENTED — FINAL CI PENDING

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

```text
launch_date: 2022-12-15
status: active
discontinued_date: null
```

## Implementation result

- launch event and Event v2 launch detail added
- first-party launch and year-end review evidence added
- Ethereum deployment note and evidence updated
- later network launches preserved as separate boundaries
- exact first issuance and the complete deployment map remain unresolved
- VCHF removed from the unresolved launch queue
- queue reduced from 20 to 19 and Category C from 14 to 13
- baselines, generated outputs, README, audits, and roadmap synchronized

Post-implementation counts:

```text
Stable assets:              82
Events:                     138
Event v2 details:           138
Evidence:                   409
Evidence relations:         409
Known unknowns:             202
Launch dates unresolved:     19
```

The next bounded launch review is IRON after all six workflows pass and PR #152 merges.
