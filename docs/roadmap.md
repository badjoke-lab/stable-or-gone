# Stable or Gone Roadmap

Updated: 2026-06-25

## Purpose

This is the canonical execution and recovery schedule for SOG. Every roadmap-changing PR must update this file.

## Current position

```text
Repository: badjoke-lab/stable-or-gone
Public site: https://sog.badjoke-lab.com/
Latest merged PR: #149 — Audit VAI launch boundary
Latest merged commit: 2ce768064623dee173594c11dd3f57a469420a76
Current work: VAI canonical implementation
Launch result: launch_date set to 2020-11-24
Current-state result: status active; discontinued_date null
Next bounded review after merge: VCHF
```

## VAI audit checkpoint

```text
2020-10-17 — Venus alpha testnet launched; VAI minting still described as future beta functionality
2020-11-24 — Venus mainnet launched and public VAI minting became available
exact VAI contract deployment — unresolved in the reviewed source set
exact first VAI mint — unresolved
2023 — VAI Peg Stability Module introduced through later governance and deployment work
current — collateralized VAI borrowing is restricted to eligible Prime users; PSM and market routes remain separate
```

Decision:

```text
launch_date: 2020-11-24
status: active
discontinued_date: null
```

Audit:

```text
docs/audits/vai-launch-boundary-review.md
```

Canonical implementation result:

- 2020-11-24 public launch event added
- first-party testnet and mainnet evidence added
- exact deployment and first mint preserved as known unknowns
- later stability-fee and PSM changes remain separate from launch
- BNB Chain deployment note and evidence updated
- VAI removed from the unresolved launch queue
- queue reduced from 21 to 20 and Category C from 15 to 14

## Completed quality checkpoints

```text
DOLA — public launch 2021-02-25; implementation PR #140
USD1 — launch null; deployment/introduction/testing normalized; PR #142
MIM — launch null; introduction/deployment/liquidity/live-operation normalized; PR #144
mUSD — launch null; contract verification/mainnet candidate/security boundary normalized; PR #146
USK — public launch 2022-09-12; repayment-only wind-down normalized; PR #148
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
137 events
137 Event v2 detail records
407 evidence records
407 evidence relation projections
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
Missing canonical launch dates:            20
Historical records missing terminal date:   4
Reserve applicability queue:                12
  not applicable by design:                 10
  source status unresolved:                  2
  expected but missing:                      0
```

## Queue state

### Launch-date queue

```text
Total unresolved: 20
Category B:         3
Category C:        14
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
VCHF
```

Following quality wave:

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

USK does not enter the terminal-date queue until a final end boundary is established. Its current state is an active wind-down with repayment available.

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
Phase 1 — VAI audit
1. Complete CI and merge the VAI audit PR.
2. Preserve testnet, mainnet launch, first mint, stability-fee, PSM, and current-access boundaries separately.

Phase 2 — VAI canonical implementation
3. Set launch_date to 2020-11-24.
4. Retain status active and discontinued_date null.
5. Add the launch event and Event v2 launch detail.
6. Add first-party testnet and mainnet evidence.
7. Update the launch known unknown and BNB Chain deployment note.
8. Remove VAI from the unresolved launch queue.
9. Synchronize baselines, generated outputs, README, audits, and roadmap.
10. Run all six workflows and merge only after every check passes.

Phase 3 — Continue launch-date quality wave
11. Audit VCHF.
12. Audit IRON.

Phase 4 — Cross-queue maintenance
13. Recheck HUSD and EURT only when durable product-specific evidence appears.
14. Keep BAC, DSD, ESD, and GYEN terminal dates unresolved until matching evidence exists.
15. Revisit USK terminal status only when the repayment and network end boundary is documented.

Phase 5 — Controlled growth
16. Promote no more than five complete records per batch.
17. Publish and verify after each growth batch.
18. Do not allow production to trail main by more than one growth batch.
```

## Immediate next work

```text
1. Complete final CI and merge the VAI implementation PR.
2. Report the queue reduction to 20 total and Category C 14.
3. Start the bounded VCHF launch-boundary audit.
4. Separate issuer announcement, token issuance, chain deployment, and public availability.
5. Do not substitute a later listing or chain expansion for original launch.
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
