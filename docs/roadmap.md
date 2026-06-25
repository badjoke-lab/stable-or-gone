# Stable or Gone Roadmap

Updated: 2026-06-25

## Purpose

This file is the canonical execution and recovery schedule for SOG.

Resume interrupted work in this order:

1. Confirm the latest merged PR and current `main`.
2. Read **Current position** and **Immediate next work**.
3. Validate `docs/migration/registry-v3-baseline.json`.
4. Check for an existing branch or PR for the named next work item.
5. Resume from the first incomplete item.

Every roadmap-changing PR must update this file. Every merge report must state the merge SHA, data changes, CI result, remaining queues, production status, current position, full execution sequence, and next work item.

## Current position

```text
Repository: badjoke-lab/stable-or-gone
Public site: https://sog.badjoke-lab.com/
Latest merged PR: #142 — Implement USD1 deployment and testing boundaries
Latest merged commit: 39304080bd5bb7019949f4b4ea24c99fe2b50058
Current work: MIM bounded launch-boundary audit
Canonical launch conclusion: keep launch_date null
Resolved implementation target: introduction, deployment, liquidity incentive, and live-protocol chronology
Next bounded review after MIM implementation: mUSD
```

## MIM audit checkpoint

```text
2021-05-05 — official Abracadabra, SPELL, and MIM introduction
2021-05-25 — Ethereum MIM contract creation
late May / early June 2021 — first lending market activation; exact day unresolved
2021-06-02 — MIM/3CRV factory-pool creation
2021-06-05 — LP staking rewards begin
2021-06-11 — first-party proposal documents live public operation
```

Audit conclusion:

```text
MIM launch_date remains null.
May 5 is introduction, not proven public borrowing availability.
May 25 is deployment, not proven public borrowing availability.
June 2 and June 5 are liquidity and incentive boundaries.
The exact first Cauldron, first issuance, and public UI day remain unresolved.
```

Audit file:

```text
docs/audits/mim-launch-boundary-review.md
```

Follow-up implementation:

- preserve the official Ethereum MIM address
- record the 2021-05-25 deployment boundary
- add the 2021-05-05 introduction event
- add the 2021-06-05 liquidity-incentive event
- add first-party evidence that the protocol was already live by 2021-06-11
- preserve a late-May-to-early-June best-known range without coercing a day
- keep MIM in the unresolved launch queue

## Completed quality checkpoints

```text
DOLA
  public launch: 2021-02-25
  Ethereum deployment: 2021-02-23
  exact first mint: unresolved
  implementation PR: #140

USD1
  public launch: null
  Ethereum and BNB deployments: 2025-01-28
  introduction: 2025-03-25
  airdrop testing: 2025-04-07
  best-known range: 2025-04
  implementation PR: #142
```

## Production checkpoint

```text
Result: PASS
Canonical records in production: 82
Production commit: 835a00d5cd2db48c0a0ede3394cf265dec919813
Verification workflow run: 27908380603
Successful verification job: 83360065881
Audit: docs/audits/registry-82-production-parity.md
```

The successful production publication includes the 82-record registry and the three dated guides. DOLA, USD1, and MIM quality work does not increase the stable-asset count or trigger automatic production publication.

## Current canonical registry

```text
82 stable assets
73 organizations
86 stablecoin-organization relationships
82 classifications
82 reserve/redemption profiles
130 events
130 Event v2 detail records
394 evidence records
394 evidence relation projections
90 reserve-report or reserve-context records
200 known unknowns
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
Missing canonical launch dates:            22
Historical records missing terminal date:   4
Reserve applicability queue:                12
  not applicable by design:                 10
  source status unresolved:                  2
  expected but missing:                      0
All-unknown income profiles:                 0
```

## Queue state

### Launch-date queue

```text
Total unresolved: 22
Category B:         3
Category C:        16
Category D:         3
```

MIM remains in Category C. The audit resolves introduction, deployment, liquidity, and live-operation chronology but not one day-level public launch.

Remaining Category B records:

```text
BRZ
Berachain HONEY
Anzen USDz
```

Launch-date policy:

- require day-level primary or on-chain evidence
- do not coerce month or year into a date
- do not use exchange listings as the default launch boundary
- do not substitute contract deployment, testing, liquidity incentives, a rebrand, or a later version for the original launch
- keep `launch_date: null` when the exact public boundary remains unresolved

Next bounded review after MIM implementation:

```text
mUSD
```

Following quality wave:

```text
USK
VAI
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

GYEN remains unresolved while the initial redemption period remains open through 2026-11-11.

### Reserve-report applicability queue

```text
Total uncovered:              12
Not applicable by design:     10
Source status unresolved:      2
Expected but missing:          0
```

Remaining source-status unresolved records:

```text
HUSD — original signed historical attestation not recovered
EURT — product-specific reserve scope not recovered from consolidated Tether reporting
```

## Guide and publication checkpoint

```text
PR #128–#135 — guides and 82-record production checkpoint — merged
PR #136–#138 — production publication-path repairs — merged
PR #139–#140 — DOLA audit and implementation — merged
PR #141–#142 — USD1 audit and implementation — merged
Production publication — PASS
```

Published guide dates:

```text
GENIUS Act and Stablecoins: 2026-06-25
MiCA and Stablecoins:       2026-06-25
JPYC vs JPYSC:              2026-06-25
```

## Full execution sequence

```text
Phase 1 — MIM bounded review
1. Complete CI and merge the MIM audit PR.
2. Preserve launch_date as null.
3. Preserve introduction, deployment, first Cauldron, first issuance, liquidity, incentives, and UI boundaries separately.

Phase 2 — MIM canonical quality implementation
4. Record the 2021-05-25 Ethereum deployment boundary.
5. Add the 2021-05-05 introduction event.
6. Add the 2021-06-05 LP-incentive event.
7. Add the 2021-06-11 live-protocol evidence.
8. Add a launch-specific known unknown and update the queue note without reducing counts.
9. Synchronize baselines, generated outputs, README, audits, and roadmap.
10. Run all six CI workflows and merge only after every check passes.

Phase 3 — Continue launch-date quality wave
11. Audit mUSD.
12. Audit USK.
13. Audit VAI.
14. Audit VCHF.
15. Audit IRON.

Phase 4 — Cross-queue maintenance
16. Recheck HUSD and EURT reserve-source status only when durable product-specific evidence is found.
17. Keep BAC, DSD, ESD, and GYEN terminal dates unresolved until matching end-boundary evidence exists.

Phase 5 — Controlled growth
18. Prepare a reviewed candidate master.
19. Promote no more than five complete stable-asset records per batch.
20. Publish and verify production after each growth batch.
21. Do not allow production to trail main by more than one growth batch.
```

## Immediate next work

```text
1. Complete CI and merge the MIM audit PR.
2. Report that launch_date remains null and queue counts remain 22 / C16.
3. Open the MIM canonical quality implementation PR.
4. Record introduction, deployment, and liquidity-incentive boundaries without labeling them as public launch.
5. Start mUSD only after the MIM implementation passes all six workflows.
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

At each publication checkpoint verify deployed commit, public counts, machine-readable files, canonical routes, guide routes, article metadata, related-guide links, sitemap, structured data, stale count markers, and production consistency.

## Growth policy

The production backlog is cleared at the 82-record checkpoint.

Controlled growth may resume only under these limits:

- finish the first bounded quality wave
- promote no more than five complete records per growth batch
- run full CI for every batch
- publish and verify after every growth batch
- alternate growth with existing-record quality work
- keep unreviewed candidates, internal monitoring, and private notes out of public files
