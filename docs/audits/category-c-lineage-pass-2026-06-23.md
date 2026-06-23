# Category C lineage pass checkpoint

Recorded: 2026-06-23

## Scope

This bounded pass reviewed four launch-date records whose canonical launch boundary depended on predecessor, rename, or protocol-version lineage rather than a simple first listing date.

## Completed records

### EURA

- Canonical launch: agEUR mainnet launch on 2021-11-03
- Rebrand: agEUR to EURA on 2024-03-14
- Treatment: one continuous asset and token identity; agEUR remains an alias
- Merged in PR #105
- Merge: 0b0ce68a76cc402537447c9e912c71a1963b1f38

### lisUSD

- Canonical launch: HAY mainnet launch on 2022-08-19
- Rebrand: HAY to lisUSD on 2024-02-05
- Treatment: one continuous BNB Chain asset identity; HAY remains an alias
- Current proxy normalized: 0x0782b6d8c4551b9760e74c0545a9bcd90bdc41e5
- Merged in PR #107
- Merge: a8a6916798452f69969ac7c8a8924022b2324bd0

### sUSD

- eUSD predecessor release: 2018-04-11
- eUSD closure: 2018-06-29
- Canonical current-asset launch: nUSD mainnet launch on 2018-06-11
- Rebrand: nUSD to sUSD announced on 2018-11-30 without a contract-address change
- Treatment: eUSD is a separate predecessor; nUSD remains an alias of the current sUSD lineage
- Merged in PR #108
- Merge: 6e33457c4a3ebd92fad38a253a0750bf6ebc1520

### Nuon

- Canonical branded-asset launch: Nuon v1 on Arbitrum on 2023-02-02
- v2 guarded phase on Base: 2025-02-28
- v2 public opening on Base: 2025-03-03
- Treatment: one branded lineage with separate v1 and v2 contracts and deployments
- Unresolved: token swap, holder migration, v1 redemption path, and final v1 shutdown
- Merged in PR #109
- Merge: 732dd3719b64538ea96a041860be5aaaa1b86ce7

## Result

- Resolved launch dates: 4
- Unresolved launch-date queue: 33 to 29
- Category C unresolved: 27 to 23
- No month-level or year-level date was coerced into a canonical day
- Rebrands and v2 relaunches were not substituted for original asset launches
- Predecessor and legacy deployments remain explicit where continuity is incomplete

## Current registry checkpoint

- 81 stable assets
- 119 events
- 119 Event v2 details
- 363 evidence records
- 198 known unknowns
- 114 deployments
- 29 unresolved launch dates
- 4 unresolved historical terminal dates
- 12 reserve-applicability queue records

## Next bounded work

Review SPOT as the next high-value Category C version-boundary case. The audit must distinguish initial SPOT launch, v1-to-v2 protocol changes, current token and bond contracts, and collateral-rotation history. No launch date should be assigned until a day-level first-party production boundary is recovered.

## Production status

No Cloudflare, production deployment, or public-site parity action was performed in this pass. GitHub canonical quality work remains ahead of the last verified production checkpoint.
