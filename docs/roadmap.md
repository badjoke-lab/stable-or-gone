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

Repository:

```text
badjoke-lab/stable-or-gone
```

Public site:

```text
https://sog.badjoke-lab.com/
```

Latest merged checkpoint:

```text
PR #138 — Verify rerun builds against checked-out commit
Merge: 835a00d5cd2db48c0a0ede3394cf265dec919813
```

Current implementation checkpoint:

```text
PR #135 — Audit registry 82 production parity
Status: PASS recorded; pending final CI and merge
Production commit: 835a00d5cd2db48c0a0ede3394cf265dec919813
Verification workflow run: 27908380603
Successful verification job: 83360065881
Next bounded work after merge: DOLA launch-boundary audit
```

Current gate state:

```text
82-record GitHub canonical baseline: complete
82-record production publication: PASS
82-record production parity: PASS
Three dated guides production publication: PASS
Controlled record growth: eligible to resume only after PR #135 merges
Next work: existing-record quality audit for DOLA
```

## Recent execution history

```text
PR #104 — Record sUSD severe depeg and SIP-423 proposal
PR #105 — Document EURA launch and rebrand
PR #107 — Resolve lisUSD and HAY lineage
PR #108 — Resolve sUSD launch lineage
PR #109 — Resolve Nuon v1 and v2 lineage
PR #110 — Record Category C lineage checkpoint
PR #112 — Resolve SPOT launch and protocol versions
PR #113 — Resolve fxUSD launch and V2 lineage
PR #114 — Resolve MAI and miMATIC launch lineage
PR #116 — Audit Stables Labs USDX launch boundary
PR #118 — Audit Ethena product activation boundary
PR #120 — Audit Savings DAI launch boundary
PR #122 — Audit Agora AUSD launch boundary
PR #123 — Normalize Agora AUSD Ethereum deployment
PR #124 — Audit Basis Cash launch and terminal boundaries
PR #125 — Resolve Basis Cash launch lineage
PR #126 — Audit Cashio Dollar launch boundary
PR #127 — Resolve Cashio Dollar launch boundary
PR #128 — Add JPYSC and Japan stablecoin events
PR #129 — Add dated Guides framework and GENIUS Act guide
PR #130 — Add MiCA and Stablecoins guide
PR #131 — Add JPYC versus JPYSC comparison guide
PR #132 — Integrate dated guides site-wide
PR #133 — Finalize guide sequence roadmap checkpoint
PR #134 — Set dated guide publication dates
PR #136 — Fix production build commit metadata
PR #137 — Align build marker validation with deployment source
PR #138 — Verify rerun builds against checked-out commit
PR #135 — Record registry 82 production parity — pending merge
```

## Production checkpoint

```text
Result: PASS
Canonical records: 82
Production commit: 835a00d5cd2db48c0a0ede3394cf265dec919813
Workflow run: 27908380603
Successful job: 83360065881
Audit: docs/audits/registry-82-production-parity.md
```

The successful job completed:

- latest `main` checkout
- source commit recording
- full repository build
- Cloudflare Pages upload
- deployed-production verification
- deployment summary

The production publication includes:

- the 82-record canonical registry
- the GENIUS Act guide
- the MiCA guide
- the JPYC versus JPYSC guide
- site-wide related-guide discovery
- Updates and sitemap integration
- machine-readable public files

## Current canonical registry

```text
82 stable assets
73 organizations
86 stablecoin-organization relationships
82 classifications
82 reserve/redemption profiles
128 events
128 Event v2 detail records
386 evidence records
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
Missing canonical launch dates:            23
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
Total unresolved: 23
Category B:         3
Category C:        17
Category D:         3
```

Remaining Category B records:

```text
BRZ
Berachain HONEY
Anzen USDz
```

Completed bounded lineage records:

```text
EURA   — agEUR launch separated from EURA rebrand
lisUSD — HAY launch separated from lisUSD rebrand
sUSD   — eUSD predecessor separated from nUSD launch and sUSD rebrand
Nuon   — Arbitrum v1 launch separated from Base v2 relaunch
SPOT   — original launch separated from later protocol versions
fxUSD  — public availability separated from announcement, seeding, and V2 upgrade
MAI    — Polygon public launch fixed while rename and V2 activation remain unresolved
USDX   — Ethereum production contracts fixed to 2024-03-18 while later access boundaries remain unresolved
sUSDe  — current contract deployment fixed to 2023-11-14 while activation boundaries remain separate
sDAI   — Ethereum contract deployment fixed to 2023-01-17 and public Spark availability fixed to 2023-05-09
AUSD   — Ethereum production contract fixed to 2024-07-07 while public launch remains unresolved
BAC    — original public launch fixed to 2020-11-30; V2 activation fixed to 2021-04-26
CASH   — public mint, redemption, liquidity, and swap availability fixed to 2021-11-09
JPYSC  — restricted account-internal launch fixed to 2026-06-24; external circulation remains unresolved
```

Launch-date policy:

- require day-level primary evidence
- do not coerce month or year into a canonical date
- do not use exchange listings as the default launch boundary
- do not substitute a rebrand or later protocol version for the original launch
- preserve predecessor, legacy deployment, and unresolved migration boundaries explicitly
- keep `launch_date: null` when the exact public boundary remains unresolved

Next bounded launch-date review:

```text
DOLA
```

First quality wave after DOLA:

```text
USD1
MIM
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

GYEN remains in an active wind-down and is not assigned a final terminal date while the initial redemption period remains open through 2026-11-11.

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

## Guide expansion checkpoint

```text
PR #128 — JPYC, JPYSC, and RLUSD Japan canonical update — merged
PR #129 — Guides framework + GENIUS Act — merged
PR #130 — MiCA — merged
PR #131 — JPYC versus JPYSC — merged
PR #132 — Site-wide guide integration — merged
PR #133 — Completion checkpoint — merged
PR #134 — Publication dates — merged
Production publication — PASS
```

Published guide dates:

```text
GENIUS Act and Stablecoins: 2026-06-25
MiCA and Stablecoins:       2026-06-25
JPYC vs JPYSC:              2026-06-25
```

Guide rules:

- use `/guides/` rather than adding another top-level navigation item
- keep new guide URLs flat under `/guides/<slug>/`
- display `Information current through` from the final primary-source review date
- display `Last updated` only after a meaningful later revision
- record factual corrections explicitly as `Correction`
- compare representative assets under the same fields without declaring unconfirmed winners

## Full execution sequence

```text
Phase 1 — Close production checkpoint
1. Complete CI and merge PR #135.
2. Confirm roadmap and audit point to production commit 835a00d5cd2db48c0a0ede3394cf265dec919813.

Phase 2 — Resume interrupted quality work
3. Audit DOLA announcement, contract deployment, first mint, redemption, liquidity, and public-access boundaries.
4. Add a canonical DOLA launch date only if day-level primary or on-chain public evidence supports it.
5. Preserve `launch_date: null` and close the bounded audit if the public boundary remains unresolved.
6. Continue the first quality wave: USD1, MIM, mUSD, USK, VAI, VCHF, and IRON.

Phase 3 — Cross-queue maintenance
7. Recheck HUSD and EURT reserve-source status only when durable product-specific evidence is found.
8. Keep BAC, DSD, ESD, and GYEN terminal dates unresolved until matching end-boundary evidence exists.

Phase 4 — Controlled growth
9. Prepare a reviewed candidate master.
10. Promote no more than five complete stable-asset records per batch.
11. Publish and verify production after each growth batch.
12. Do not allow production to trail `main` by more than one growth batch.

Phase 5 — Normal operating cycle
13. Alternate two or three existing-record quality audits with one growth batch of no more than five records.
14. Insert urgent incident, regulatory, depeg, wind-down, or redemption updates ahead of the routine queue when necessary.
15. Update regulatory guides only when a material legal, licensing, transition, or implementation change is supported by primary sources.
```

## Immediate next work

```text
1. Complete CI and merge PR #135.
2. Report the 82-record production checkpoint as complete.
3. Start a bounded DOLA launch-boundary audit.
4. Do not force a DOLA date without day-level evidence.
5. After DOLA, continue USD1, MIM, mUSD, USK, VAI, VCHF, and IRON.
```

## Production policy

Normal pull requests and normal `main` merges complete through GitHub CI and do not publish to Cloudflare.

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

At each publication checkpoint verify:

- deployed commit
- public counts
- machine-readable files
- canonical routes
- guide routes and article metadata
- stablecoin related-guide links
- sitemap
- metadata and structured data
- stale count markers
- production consistency

Manual publication configuration:

```text
Pages project: stable-or-gone
Production branch: main
Automatic production deployment: disabled
Preview branch deployments: disabled
Publication path: approved manual GitHub Actions workflow
Latest successful workflow run: 27908380603
Latest successful job: 83360065881
```

## Growth policy

The production backlog is cleared at the 82-record checkpoint.

After PR #135 merges, controlled growth may resume only under these limits:

- finish the DOLA bounded quality audit first
- promote no more than five complete records per growth batch
- run full CI for every batch
- publish and verify after every growth batch
- alternate growth with existing-record quality work
- keep unreviewed candidates, internal monitoring, and private notes out of public files
