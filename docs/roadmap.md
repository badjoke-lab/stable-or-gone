# Stable or Gone Roadmap

Updated: 2026-06-25

## Purpose

This is the canonical execution and recovery schedule for SOG. Every roadmap-changing PR must update this file.

## Current position

```text
Repository: badjoke-lab/stable-or-gone
Public site: https://sog.badjoke-lab.com/
Latest merged PR: #155 — Recheck HUSD and EURT reserve sources
Latest merged commit: 217d3992431409520f166165b560fd20c46cb7d9
Completed phase: first bounded launch-date quality wave
Current work: HUSD and EURT source-recovery context implementation
Implementation result: three evidence records added; both remain source_status_unresolved
Reserve-report result: no reserve-report rows added; count remains 90
Next phase after merge: terminal queue checkpoint, then controlled growth
```

## Reserve-source audit checkpoint

```text
HUSD
- monthly attestations historically confirmed
- January 2022 Accountant's Attestation identified by a legal study
- original signed report and accountant package not recovered
- exact measurement, supply, reserve-account, and custodian boundaries unresolved
- result: retain source_status_unresolved

EURT
- quarterly Tether reserve and assurance reports exist
- reports cover the Tether Issuer or broader reporting entities
- EURT-specific assets, liabilities, issuer scope, and final reconciliation not separated
- result: retain source_status_unresolved
```

Audit:

```text
docs/audits/husd-eurt-reserve-source-recheck.md
```

Canonical quality implementation result:

- HUSD legal-study evidence added as secondary source-recovery context
- official Tether transparency and relevant-information evidence added as consolidated-scope context
- HUSD and EURT known unknowns and queue notes updated to 2026-06-25
- both records retained as `source_status_unresolved`
- no reserve-report rows added
- reserve-report count remains 90

## Completed launch-date quality wave

```text
DOLA — launch 2021-02-25; PR #140
USD1 — launch unresolved; boundaries normalized; PR #142
MIM — launch unresolved; boundaries normalized; PR #144
mUSD — launch unresolved; boundaries normalized; PR #146
USK — launch 2022-09-12; wind-down normalized; PR #148
VAI — launch 2020-11-24; PR #150
VCHF — launch 2022-12-15; PR #152
IRON — launch 2021-03-06; lineage boundaries normalized; PR #154
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
415 evidence records
415 evidence relation projections
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
  not applicable by design:                 10
  source status unresolved:                  2
  report expected but missing:               0
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

### Reserve-source queue

```text
HUSD — signed historical attestation unrecovered
EURT — product-specific reserve and liability scope unrecovered
```

### Terminal-date queue

```text
Total unresolved: 4
Basis Cash
Dynamic Set Dollar
Empty Set Dollar
GYEN
```

Terminal dates remain null unless matching end-boundary evidence is recovered. GYEN remains open while the documented redemption period continues.

## Full execution sequence

```text
Phase 1 — Complete reserve-source cross-queue maintenance
1. Complete final CI and merge the source-recovery context PR.
2. Keep HUSD and EURT in source_status_unresolved.
3. Keep reserve-report count at 90.
4. Confirm temporary synchronization code is removed.

Phase 2 — Terminal queue checkpoint
6. Recheck BAC, DSD, and ESD only for new primary or authoritative end-boundary evidence.
7. Keep GYEN unresolved while the redemption boundary remains open.
8. Do not force terminal dates from inactive markets, delistings, or later summaries.

Phase 3 — Controlled growth
9. Prepare a reviewed candidate master.
10. Promote no more than five complete stable-asset records per batch.
11. Publish and verify after each growth batch.
12. Do not allow production to trail main by more than one growth batch.

Phase 4 — Normal operating cycle
13. Alternate two or three existing-record quality audits with one growth batch.
14. Insert urgent depeg, incident, regulatory, wind-down, or redemption updates ahead of the routine queue.
```

## Immediate next work

```text
1. Complete final CI and merge the HUSD/EURT source-context implementation PR.
2. Complete the terminal queue checkpoint for BAC, DSD, ESD, and GYEN.
3. Keep terminal dates null without matching end-boundary evidence.
4. Resume controlled growth in batches of no more than five records.
5. Publish and verify after the first growth batch.
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

- complete the reserve-source and terminal cross-queue checkpoints
- promote no more than five complete records per growth batch
- run full CI for every batch
- publish and verify after every growth batch
- alternate growth with existing-record quality work
- keep unreviewed candidates and internal monitoring out of public files
