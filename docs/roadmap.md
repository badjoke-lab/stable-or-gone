# Stable or Gone Roadmap

Updated: 2026-06-25

## Purpose

This is the canonical execution and recovery schedule for SOG. Every roadmap-changing PR must update this file.

## Current position

```text
Repository: badjoke-lab/stable-or-gone
Public site: https://sog.badjoke-lab.com/
Latest merged PR: #153 — Audit IRON launch boundary
Latest merged commit: 98276eef87b1b334ba3f929000d2903f7723ae79
Current work: IRON canonical implementation
Launch result: launch_date set to 2021-03-06
Terminal state: failed with discontinued_date 2021-06-16
Quality-wave result: first bounded launch-date wave complete
Next phase after merge: cross-queue maintenance, then controlled growth
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

Canonical implementation result:

- 2021-03-06 BSC launch event added
- 2021-05-18 Polygon deployment event added
- June 16 collapse event preserved
- first-party BSC launch, Polygon expansion, and v2 evidence added
- IRON v2 preserved as a later redesigned-product boundary
- BSC deployment and v1/v2 lineage unknowns updated
- IRON removed from the unresolved launch queue
- queue reduced from 19 to 18 and Category C from 13 to 12

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
140 events
140 Event v2 detail records
412 evidence records
412 evidence relation projections
90 reserve-report or reserve-context records
203 known unknowns
9 regulatory notes
117 deployments
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
Missing canonical launch dates:            18
Historical records missing terminal date:   4
Reserve applicability queue:                12
```

## Queue state

### Launch-date queue

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
Phase 1 — Complete the first launch-date quality wave
1. Complete final CI and merge the IRON implementation PR.
2. Preserve BSC launch, Polygon deployment, collapse, and v2 redesign as separate boundaries.
3. Confirm temporary synchronization code is removed.

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
1. Complete final CI and merge the IRON implementation PR.
2. Report the queue reduction to 18 total and Category C 12.
3. Audit HUSD and EURT reserve-source recovery status as the first cross-queue maintenance batch.
4. Recheck BAC, DSD, and ESD terminal dates only if new primary evidence exists.
5. Resume controlled growth after the cross-queue checkpoint.
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
