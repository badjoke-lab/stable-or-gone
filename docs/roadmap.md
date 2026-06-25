# Stable or Gone Roadmap

Updated: 2026-06-25

## Purpose

This is the canonical execution and recovery schedule for SOG. Every roadmap-changing PR must update this file.

## Current position

```text
Repository: badjoke-lab/stable-or-gone
Public site: https://sog.badjoke-lab.com/
Latest merged PR: #151 — Audit VCHF launch date
Latest merged commit: 4cfbf3ced51c82b96c66adcedce0ae06e1ecbde0
Current work: VCHF canonical implementation
Launch result: launch_date set to 2022-12-15
Current-state result: status active; discontinued_date null
Next bounded review after merge: IRON
```

## VCHF audit checkpoint

```text
2022-12-15 — VNX launches VEUR and VCHF with trading, deposit, and withdrawal access on Emirex
2022-12-27 — VNX year-end review confirms December launch and Ethereum issuance
2023 onward — Polygon, Avalanche, Stellar, Solana, Tezos, and other network expansions
exact first VCHF issuance transaction — unresolved
complete multichain contract map — unresolved
```

Decision:

```text
launch_date: 2022-12-15
status: active
discontinued_date: null
```

Audit:

```text
docs/audits/vchf-launch-boundary-review.md
```

Canonical implementation result:

- 2022-12-15 launch event and Event v2 launch detail added
- first-party launch and year-end review evidence added
- Ethereum deployment note and evidence updated
- later chain launches preserved as deployment boundaries
- exact first issuance and distribution retained as known unknowns
- VCHF removed from the unresolved launch queue
- queue reduced from 20 to 19 and Category C from 14 to 13

## Completed quality checkpoints

```text
DOLA — public launch 2021-02-25; implementation PR #140
USD1 — launch null; deployment/introduction/testing normalized; PR #142
MIM — launch null; introduction/deployment/liquidity/live-operation normalized; PR #144
mUSD — launch null; contract verification/mainnet candidate/security boundary normalized; PR #146
USK — public launch 2022-09-12; repayment-only wind-down normalized; PR #148
VAI — public launch 2020-11-24; implementation PR #150
```

## Production checkpoint

```text
Result: PASS
Canonical records in production: 82
Production commit: 835a00d5cd2db48c0a0ede3394cf265dec919813
Verification workflow run: 27908380603
Successful verification job: 83360065881
```

Quality-only work after the checkpoint does not trigger automatic production publication.

## Current canonical registry

```text
82 stable assets
73 organizations
86 stablecoin-organization relationships
82 classifications
82 reserve/redemption profiles
138 events
138 Event v2 detail records
409 evidence records
409 evidence relation projections
90 reserve-report or reserve-context records
202 known unknowns
9 regulatory notes
116 deployments
82 legal profiles
4 stable-asset relationships
115 reserve components
82 income profiles
```

Machine-readable source of truth:

```text
docs/migration/registry-v3-baseline.json
```

## Current quality baseline

```text
Candidate promotions:                    82 / 82 controlled
Pending candidates:                       0
Critical findings:                        0
Blocking warnings:                        0
Integrity audit warnings:                  3 non-blocking source-count mismatches
Stale verification records:               0
Required-layer coverage:              82 / 82
Event coverage:                        82 / 82
Deployment coverage:                   82 / 82
Reserve-report context coverage:       70 / 82 informational
Missing canonical launch dates:            19
Historical records missing terminal date:   4
Reserve applicability queue:                12
  not applicable by design:                 10
  source status unresolved:                  2
  expected but missing:                      0
```

## Queue state

### Launch-date queue

```text
Total unresolved: 19
Category B:         3
Category C:        13
Category D:         3
```

Remaining Category B records:

```text
BRZ
Berachain HONEY
Anzen USDz
```

Next bounded review:

```text
IRON
```

### Terminal-date queue

```text
Total unresolved: 4
Basis Cash
Dynamic Set Dollar
Empty Set Dollar
GYEN
```

### Reserve-report applicability queue

```text
Total uncovered:              12
Not applicable by design:     10
Source status unresolved:      2
Expected but missing:          0
```

Source-status unresolved:

```text
HUSD
EURT
```

## Full execution sequence

```text
Phase 1 — VCHF audit
1. Complete final CI and merge the VCHF implementation PR.
2. Preserve original launch and later chain-expansion boundaries separately.
3. Confirm temporary synchronization code is removed.

Phase 3 — Complete the first launch-date quality wave
11. Audit IRON.
12. Implement the IRON result if supported.

Phase 4 — Cross-queue maintenance
13. Recheck HUSD and EURT only when durable product-specific evidence appears.
14. Keep BAC, DSD, ESD, and GYEN terminal dates unresolved until matching evidence exists.
15. Perform separate current-state reviews for assets with newly effective operational restrictions.

Phase 5 — Controlled growth
16. Promote no more than five complete records per batch.
17. Publish and verify after each growth batch.
18. Do not allow production to trail main by more than one growth batch.
```

## Immediate next work

```text
1. Complete final CI and merge the VCHF implementation PR.
2. Report the queue reduction to 19 total and Category C 13.
3. Start the bounded IRON launch-boundary audit.
4. Separate BSC launch, Polygon deployment, staged minting, and public availability.
5. Complete the first launch-date quality wave before controlled growth resumes.
```

## Production policy

Normal pull requests and normal `main` merges complete through GitHub CI and do not publish to Cloudflare.

```text
Automatic production deployment: disabled
Preview branch deployments: disabled
Publication path: manual GitHub Actions workflow only
Manual production publication activation — PASS
Deployment workflow run: 27908380603
Pages project: stable-or-gone
Production branch: main
Latest successful job: 83360065881
```

The production path remains:

```text
latest main
→ approved manual GitHub Actions job
→ latest main checkout
→ npm run build
→ prebuilt dist upload with Wrangler
→ deployed commit verification
→ production consistency verification
```

## Growth policy

- finish the first bounded quality wave
- promote no more than five complete records per growth batch
- run full CI for every batch
- publish and verify after every growth batch
- alternate growth with existing-record quality work
- keep unreviewed candidates, internal monitoring, and private notes out of public files
