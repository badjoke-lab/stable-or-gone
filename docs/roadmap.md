# Stable or Gone Roadmap

Updated: 2026-06-25

## Purpose

This is the canonical execution and recovery schedule for SOG. Every roadmap-changing PR must update this file.

## Current position

```text
Repository: badjoke-lab/stable-or-gone
Public site: https://sog.badjoke-lab.com/
Latest merged PR: #157 — Record terminal-date checkpoint
Latest merged commit: 59d6abc1960578f9f281522e23b7d85a0bfe7c29
Completed phases: launch-date wave, reserve-source checkpoint, and terminal-date checkpoint
Current work: Batch 16 candidate research
Candidate result: 5 accepted candidates; canonical assets remain 82
Next operation after merge: complete full-layer drafts and open the canonical promotion PR
Publication requirement: manual publish and parity verification after canonical promotion
```

## Batch 16 candidate checkpoint

```text
Accepted candidates: 5
Canonical promotions: 0
Canonical stable assets: 82
Target batch: batch_016
```

Selected candidates:

```text
United Stables U
USDGO
SoFiUSD / SOFID
Solstice USX
Origin Dollar / OUSD
```

Identity boundaries:

- Solstice USX is separate from the existing dForce USX record.
- SoFiUSD is the brand and SOFID is the token symbol for one asset.
- Future SoFi tokenized deposits are separate legal products.
- OUSD is separate from wrapped OUSD and other Origin yield products.
- Base U and USDGO are separate from exchange rewards, staking positions, or reserve income.

Deferred from this batch:

- YLDS — official material defines it as a registered fixed-income security rather than a stablecoin; retain for a separate stablecoin-adjacent scope review.
- Blast USDB — bridged and rebasing identity requires a dedicated bridge-liability and underlying-asset review.
- UXD — current backing model and lifecycle require a deeper protocol-state review before promotion.

Research files:

```text
data/candidate-stable-assets-growth-85.json
data/candidate-research-batch-16.json
scripts/validate-batch16-research.mjs
```

## Terminal-date checkpoint

```text
Basis Cash
- no formal shutdown, final mint stop, governance termination, or contract end state recovered
- terminal date remains null

Dynamic Set Dollar
- April 2021 design activity is not final shutdown or executed migration
- terminal date remains null

Empty Set Dollar
- 2021-08-02 migration opening is not final cessation of every V1 claim or contract
- terminal date remains null

GYEN
- orderly wind-down began 2026-05-15
- initial redemption period remains open through 2026-11-11
- terminal date remains null
```

Audit:

```text
docs/audits/terminal-date-checkpoint-2026-06-25.md
```

Queue result:

```text
Terminal-date unresolved: 4
No canonical terminal-date changes
```

## Completed quality checkpoints

### Launch-date wave

```text
DOLA — launch 2021-02-25; PR #140
USD1 — launch unresolved; boundaries normalized; PR #142
MIM — launch unresolved; boundaries normalized; PR #144
mUSD — launch unresolved; boundaries normalized; PR #146
USK — launch 2022-09-12; wind-down normalized; PR #148
VAI — launch 2020-11-24; PR #150
VCHF — launch 2022-12-15; PR #152
IRON — launch 2021-03-06; lineage normalized; PR #154
```

### Reserve-source checkpoint

```text
HUSD — signed historical attestation unrecovered
EURT — product-specific reserve and liability scope unrecovered
Evidence context implementation: PR #156
Reserve-report count remains 90
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

## Remaining quality queues

### Launch dates

```text
Total unresolved: 18
Category B:         3
Category C:        12
Category D:         3
```

Category B:

```text
BRZ
Berachain HONEY
Anzen USDz
```

### Reserve sources

```text
HUSD
EURT
```

### Terminal dates

```text
Basis Cash
Dynamic Set Dollar
Empty Set Dollar
GYEN
```

These queues remain explicit research backlogs. They no longer block controlled record growth.

## Controlled growth sequence

```text
Phase 1 — Candidate master complete
1. Five accepted candidates are fixed in Batch 16 research.
2. Symbol and identity collisions are explicitly disambiguated.
3. Deferred records retain separate scope decisions.

Phase 2 — Full-layer draft
4. Draft stable-asset, organization, relationship, classification, reserve/redemption, event, evidence, deployment, legal, reserve-component, and income-profile layers for all five candidates.
5. Resolve contract, issuer, reserve, redemption, and income boundaries before promotion.
6. Add no placeholder reserve-report rows.
7. Keep unreviewed candidates and private monitoring out of public files.

Phase 3 — Canonical promotion
8. Promote all five only after the complete draft passes review.
9. Run all six workflows and merge only after every check passes.

Phase 4 — Publication checkpoint
10. Manually publish latest main through the approved GitHub Actions workflow.
11. Verify deployed commit, public counts, canonical routes, machine-readable files, sitemap, and consistency.
12. Record production parity before starting the next growth batch.

Phase 5 — Normal operating cycle
13. Alternate one growth batch with two or three existing-record quality audits.
14. Insert urgent incident, depeg, regulatory, wind-down, or redemption changes ahead of the routine queue.
15. Never allow production to trail main by more than one growth batch.
```

## Immediate next work

```text
1. Complete CI and merge the Batch 16 candidate-research PR.
2. Build complete canonical drafts for the five accepted candidates.
3. Resolve all blocking contract, issuer, reserve, redemption, and income boundaries.
4. Implement Batch 16 in one bounded five-record promotion PR.
5. Manually publish and verify production parity after canonical merge.
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

- unresolved quality queues remain explicit but do not block bounded growth
- promote no more than five complete records per growth batch
- run full CI for every batch
- publish and verify after every growth batch
- alternate growth with existing-record quality work
- keep unreviewed candidates and internal monitoring out of public files
