# Stable or Gone Roadmap

Updated: 2026-06-25

## Purpose

This is the canonical execution and recovery schedule for SOG. Every roadmap-changing PR must update this file.

## Current position

```text
Repository: badjoke-lab/stable-or-gone
Public site: https://sog.badjoke-lab.com/
Latest merged PR: #152 — Implement VCHF launch date
Latest merged commit: 1582f2844b5390d161e6454fb00d14d540f3f37d
Current work: IRON bounded launch and lineage audit
Launch conclusion: set launch_date to 2021-03-06
Terminal state: retain failed and discontinued_date 2021-06-16
Next operation after audit: IRON canonical implementation
Next phase after IRON: cross-queue maintenance, then controlled growth
```

## IRON audit checkpoint

```text
2021-03-06 — original IRON protocol launch on Binance Smart Chain
2021-05-18 — Polygon deployment with a separate IRON/TITAN token set
2021-06-16 — Polygon IRON bank run and terminal failure of the original design
June 2021 — rebuilding announcement says the stablecoin would be redesigned from scratch
2021-08-25 — redesigned IRON v2 launch
```

Decision:

```text
launch_date: 2021-03-06
status: failed
discontinued_date: 2021-06-16
```

Audit:

```text
docs/audits/iron-launch-boundary-review.md
```

Implementation requirements:

- add the 2021-03-06 BSC launch event
- add the 2021-05-18 Polygon deployment event
- preserve the June 16 collapse event
- add first-party BSC launch and Polygon expansion evidence
- preserve IRON v2 as a later redesigned-product boundary
- update known unknowns for BSC identity, first mint, Polygon deployment, and v1/v2 continuity
- remove IRON from the unresolved launch queue
- reduce the queue from 19 to 18 and Category C from 13 to 12

## Completed quality checkpoints

```text
DOLA — launch 2021-02-25; PR #140
USD1 — launch unresolved; boundaries normalized; PR #142
MIM — launch unresolved; boundaries normalized; PR #144
mUSD — launch unresolved; boundaries normalized; PR #146
USK — launch 2022-09-12; wind-down normalized; PR #148
VAI — launch 2020-11-24; PR #150
VCHF — launch 2022-12-15; PR #152
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
Critical findings:                        0
Blocking warnings:                        0
Integrity audit warnings:                  3 non-blocking source-count mismatches
Required-layer coverage:              82 / 82
Event coverage:                        82 / 82
Deployment coverage:                   82 / 82
Missing canonical launch dates:            19
Historical records missing terminal date:   4
Reserve applicability queue:                12
```

## Queue state

### Launch-date queue

```text
Total unresolved before IRON implementation: 19
Category B:                                  3
Category C:                                 13
Category D:                                  3
```

Expected after IRON implementation:

```text
Total unresolved: 18
Category B:         3
Category C:        12
Category D:         3
```

Remaining Category B records:

```text
BRZ
Berachain HONEY
Anzen USDz
```

### Terminal-date queue

```text
Total unresolved: 4
Basis Cash
Dynamic Set Dollar
Empty Set Dollar
GYEN
```

### Reserve-source queue

```text
HUSD
EURT
```

## Full execution sequence

```text
Phase 1 — IRON audit
1. Complete CI and merge the IRON audit PR.
2. Preserve BSC launch, Polygon deployment, collapse, and v2 redesign as separate boundaries.

Phase 2 — IRON canonical implementation
3. Set launch_date to 2021-03-06.
4. Retain failed status and discontinued_date 2021-06-16.
5. Add BSC launch and Polygon deployment events plus Event v2 details.
6. Add first-party launch and expansion evidence.
7. Update deployments and known unknowns.
8. Remove IRON from the unresolved launch queue.
9. Synchronize baselines, generated outputs, README, audits, and roadmap.
10. Run all six workflows and merge only after every check passes.

Phase 3 — Cross-queue maintenance
11. Recheck HUSD and EURT only when durable product-specific reserve evidence appears.
12. Keep BAC, DSD, ESD, and GYEN terminal dates unresolved until matching evidence exists.
13. Review newly effective operational restrictions separately from launch dates.

Phase 4 — Controlled growth
14. Prepare a reviewed candidate master.
15. Promote no more than five complete records per batch.
16. Publish and verify after each growth batch.
17. Do not allow production to trail main by more than one growth batch.
```

## Immediate next work

```text
1. Complete CI and merge the IRON audit PR.
2. Open the IRON canonical implementation PR.
3. Set launch_date only to the original 2021-03-06 BSC boundary.
4. Keep Polygon deployment, June collapse, and August v2 redesign separate.
5. Complete the first launch-date quality wave, then move to cross-queue maintenance.
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
```

## Growth policy

- finish the first bounded quality wave
- promote no more than five complete records per growth batch
- run full CI for every batch
- publish and verify after every growth batch
- alternate growth with existing-record quality work
- keep unreviewed candidates and internal monitoring out of public files
