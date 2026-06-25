# Stable or Gone Roadmap

Updated: 2026-06-25

## Purpose

This is the canonical execution and recovery schedule for SOG. Every roadmap-changing PR must update this file.

## Current position

```text
Repository: badjoke-lab/stable-or-gone
Public site: https://sog.badjoke-lab.com/
Latest merged PR: #147 — Audit USK launch and wind-down boundaries
Latest merged commit: 2ce73c1233b459a2c32762d4b5eaff320b5ffcbf
Current work: USK canonical implementation
Launch result: launch_date set to 2022-09-12
Current-state result: status limited; discontinued_date null; repayment-only wind-down recorded
Next bounded review after merge: VAI
```

## USK audit checkpoint

```text
2022-08-08 — USK design and planned launch announced
2022-08-19 — minting and liquidation workflow documented before launch
2022-09-10 — first-party article explicitly describes the launch as upcoming
2022-09-12 — Team Kujira states USK and ORCA launched that day
2025-06-30 — Rujira transition announces USK wind-down
2025-06-30 state — new debt disabled; existing positions repayment-only
final terminal date — unresolved
```

Decision:

```text
launch_date: 2022-09-12
status: limited
discontinued_date: null
```

Audit:

```text
docs/audits/usk-launch-and-winddown-review.md
```

Canonical implementation result:

- 2022-09-12 launch event added
- 2025-06-30 wind-down and repayment-only event added
- first-party pre-launch, launch, and wind-down evidence added
- existing limited-status event and record notes updated
- final terminal date and successor-liability boundaries preserved as known unknowns
- USK removed from the unresolved launch queue
- queue reduced from 22 to 21 and Category C from 16 to 15

## Completed quality checkpoints

```text
DOLA — public launch 2021-02-25; implementation PR #140
USD1 — launch null; deployment/introduction/testing normalized; PR #142
MIM — launch null; introduction/deployment/liquidity/live-operation normalized; PR #144
mUSD — launch null; contract verification/mainnet candidate/security boundary normalized; PR #146
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
136 events
136 Event v2 detail records
405 evidence records
405 evidence relation projections
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
Missing canonical launch dates:            21
Historical records missing terminal date:   4
Reserve applicability queue:                12
  not applicable by design:                 10
  source status unresolved:                  2
  expected but missing:                      0
```

## Queue state

### Launch-date queue

```text
Total unresolved: 21
Category B:         3
Category C:        15
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
VAI
```

Following quality wave:

```text
VCHF
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
Phase 1 — USK audit
1. Complete CI and merge the USK audit PR.
2. Preserve launch, wind-down, repayment-only, successor, and terminal boundaries separately.

Phase 2 — USK canonical implementation
3. Set launch_date to 2022-09-12.
4. Retain status limited and discontinued_date null.
5. Add launch and wind-down events plus Event v2 details.
6. Add first-party evidence and update known unknowns.
7. Remove USK from the unresolved launch queue.
8. Synchronize baselines, generated outputs, README, audits, and roadmap.
9. Run all six workflows and merge only after every check passes.

Phase 3 — Continue launch-date quality wave
10. Audit VAI.
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
1. Complete final CI and merge the USK implementation PR.
2. Report the queue reduction to 21 total and Category C 15.
3. Start the bounded VAI launch-boundary audit.
4. Separate Venus protocol launch, first VAI issuance, stability-fee activation, and PSM boundaries.
5. Do not substitute later feature activation for original public launch.
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
