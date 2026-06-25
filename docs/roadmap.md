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
Latest merged PR: #140 — Resolve DOLA launch boundary
Latest merged commit: d7ea9cb79a03bc0911423652926ea9a034ded1f1
Current work: USD1 bounded launch-boundary audit
Canonical launch conclusion: keep launch_date null
Resolved implementation target: normalize deployments and dated introduction/testing events
Next bounded review after USD1 implementation: MIM
```

## USD1 audit checkpoint

Reviewed boundaries:

```text
2025-01-28 04:01:35 UTC — Ethereum contract creation
2025-01-28 04:03:41 UTC — BNB Smart Chain contract creation
March 2025              — early issuance and market-maker testing
2025-03-25              — first-party plans-to-launch announcement
2025-03-28              — BitGo launch-infrastructure article
2025-04-07              — official airdrop test proposed before broader market access
April 2025              — first-party retrospective launch period
current                 — broad availability confirmed by undated current documentation
```

Audit conclusion:

```text
USD1 launch_date remains null.
January 28 is deployment, not public launch.
March 25 is introduction and planned launch, not completed public access.
April 7 is a testing boundary before broader market access.
First-party evidence supports April 2025 only at month level.
```

Audit file:

```text
docs/audits/usd1-launch-boundary-review.md
```

Follow-up canonical implementation must:

- normalize the official Ethereum and BNB Smart Chain contract addresses
- record both January 28 deployment boundaries
- add the March 25 introduction event
- add the April 7 testing event
- preserve the April 2025 best-known range without coercing a day
- keep USD1 in the unresolved launch queue

## Production checkpoint

```text
Result: PASS
Canonical records in production: 82
Production commit: 835a00d5cd2db48c0a0ede3394cf265dec919813
Verification workflow run: 27908380603
Successful verification job: 83360065881
Audit: docs/audits/registry-82-production-parity.md
```

The successful production publication includes the 82-record registry, the GENIUS Act guide, the MiCA guide, the JPYC versus JPYSC guide, related-guide discovery, Updates, sitemap integration, and machine-readable public files.

DOLA and USD1 quality work does not increase the stable-asset count or trigger automatic production publication.

## Current canonical registry

```text
82 stable assets
73 organizations
86 stablecoin-organization relationships
82 classifications
82 reserve/redemption profiles
129 events
129 Event v2 detail records
389 evidence records
389 evidence relation projections
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

USD1 remains in Category C after the bounded audit. The audit resolves deployment and testing chronology but not one day-level public launch.

Remaining Category B records:

```text
BRZ
Berachain HONEY
Anzen USDz
```

Launch-date policy:

- require day-level primary evidence
- do not coerce month or year into a canonical date
- do not use exchange listings as the default launch boundary
- do not substitute a rebrand or later protocol version for the original launch
- preserve predecessor, legacy deployment, testing, and unresolved migration boundaries explicitly
- keep `launch_date: null` when the exact public boundary remains unresolved
- separate contract deployment, introduction, testing, first issuance, and public availability

Next bounded launch-date review after USD1 implementation:

```text
MIM
```

Following quality wave:

```text
mUSD
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
PR #128 — Japan canonical update — merged
PR #129 — Guides framework and GENIUS Act — merged
PR #130 — MiCA — merged
PR #131 — JPYC versus JPYSC — merged
PR #132 — Site-wide guide integration — merged
PR #133 — Completion checkpoint — merged
PR #134 — Publication dates — merged
PR #135 — Registry 82 production parity — merged
PR #136 — Production build metadata repair — merged
PR #137 — Build marker validation repair — merged
PR #138 — Rerun checkout validation repair — merged
PR #139 — DOLA audit — merged
PR #140 — DOLA canonical implementation — merged
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
Phase 1 — USD1 bounded review
1. Complete CI and merge the USD1 audit PR.
2. Preserve launch_date as null.
3. Preserve the distinction between deployment, testing, introduction, issuance, and public availability.

Phase 2 — USD1 canonical quality implementation
4. Normalize Ethereum and BNB Smart Chain addresses.
5. Record both 2025-01-28 deployment boundaries.
6. Add a dated 2025-03-25 introduction event and supporting evidence.
7. Add a dated 2025-04-07 testing event and supporting evidence.
8. Update the USD1 known unknown and queue note without reducing queue counts.
9. Synchronize baselines, generated outputs, README, audits, and roadmap.
10. Run all six CI workflows and merge only after every check passes.

Phase 3 — First launch-date quality wave
11. Audit MIM.
12. Audit mUSD.
13. Audit USK.
14. Audit VAI.
15. Audit VCHF.
16. Audit IRON.

Phase 4 — Cross-queue maintenance
17. Recheck HUSD and EURT reserve-source status only when durable product-specific evidence is found.
18. Keep BAC, DSD, ESD, and GYEN terminal dates unresolved until matching end-boundary evidence exists.

Phase 5 — Controlled growth
19. Prepare a reviewed candidate master.
20. Promote no more than five complete stable-asset records per batch.
21. Publish and verify production after each growth batch.
22. Do not allow production to trail main by more than one growth batch.

Phase 6 — Normal operating cycle
23. Alternate two or three existing-record quality audits with one growth batch of no more than five records.
24. Insert urgent incident, regulatory, depeg, wind-down, or redemption updates ahead of the routine queue when necessary.
```

## Immediate next work

```text
1. Complete CI and merge the USD1 audit PR.
2. Report that canonical launch remains null and queue counts remain 22 / C16.
3. Open the USD1 canonical quality implementation PR.
4. Normalize deployment addresses and dates.
5. Add introduction and testing events without mislabeling them as public launch.
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
