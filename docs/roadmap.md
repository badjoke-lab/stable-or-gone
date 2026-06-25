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
PR #133 — Finalize guide sequence roadmap checkpoint
Merge: 15e29c4b5477abf3782b2eaf6180a2afa6af4397
```

Current implementation checkpoint:

```text
PR #134 — Set dated guide publication dates
Status: in review
Publication date candidate: 2026-06-25
Scope: GENIUS Act, MiCA, and JPYC versus JPYSC
Required next operation after merge: manual production publication from latest main
```

Recent lineage, incident, launch, and guide work:

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
```

Current blocker:

```text
82-record GitHub canonical baseline: complete
82-record production publication: pending
82-record production parity: pending
Controlled record growth: paused until production parity can be restored
Japan/regulation guide implementation and GitHub integration: complete
Guide publication metadata: active in PR #134
```

Latest verified production checkpoint:

```text
75-record production parity: PASS
Verification workflow run: 27905696588
Audit: docs/audits/registry-75-production-parity.md
```

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
USDX   — Ethereum production contracts fixed to 2024-03-18 while public launch and approved-access boundaries remain unresolved
sUSDe  — current contract deployment fixed to 2023-11-14 while stealth activity, public mainnet, staking access, and reward payout remain separate unresolved boundaries
sDAI   — Ethereum contract deployment fixed to 2023-01-17 and public Spark availability fixed to 2023-05-09
AUSD   — Ethereum production contract fixed to 2024-07-07 while first mint, approved access, and public launch remain unresolved
BAC    — original public launch fixed to 2020-11-30; V2 activation fixed to 2021-04-26; terminal date remains unresolved
CASH   — public mint, redemption, liquidity, and swap availability fixed to 2021-11-09; exact Solana mint remains unresolved
JPYSC  — restricted account-internal launch fixed to 2026-06-24; external transfer and public-chain circulation remain unresolved
```

Policy:

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

## Guide expansion sequence

```text
PR #128 — JPYC, JPYSC, and RLUSD Japan canonical update — merged
PR #129 — Guides framework + GENIUS Act — merged
PR #130 — MiCA — merged
PR #131 — JPYC versus JPYSC — merged
PR #132 — Site-wide guide integration — merged
PR #133 — Completion checkpoint — merged
PR #134 — Publication dates — in review
```

Completed integration coverage:

```text
homepage: featured dated-guide discovery
stablecoin records: mapped related-guide cards and subjectOf metadata
Updates: dated guide expansion entry
sitemap: guide routes generated from the shared catalog
validation: catalog/page/canonical/home/relationship/update checks in the main build
```

Guide rules:

- use `/guides/` rather than adding another top-level navigation item
- keep new guide URLs flat under `/guides/<slug>/`
- set `Published` only at the production publication checkpoint
- display `Information current through` from the final primary-source review date
- display `Last updated` only after a meaningful later revision
- record factual corrections explicitly as `Correction`
- compare representative assets under the same fields without declaring unconfirmed winners

## Full execution sequence after PR #134

```text
Phase 1 — Production publication
1. Merge PR #134 after all checks pass.
2. Manually run the production publication workflow from latest main.
3. Verify deployed commit, 82-record counts, three dated guide routes, related-guide links, Updates, sitemap, metadata, and machine-readable files.
4. Record PASS or failure details in the production parity audit.

Phase 2 — Production checkpoint
5. Add and merge the 82-record production parity audit PR.
6. Remove the controlled-growth pause only after parity is PASS.

Phase 3 — Resume interrupted quality work
7. Audit DOLA launch boundaries without forcing a date.
8. Implement a canonical DOLA launch date only if day-level primary or on-chain public evidence supports it; otherwise preserve null and close the bounded audit.
9. Continue the first launch-date quality wave: USD1, MIM, mUSD, USK, VAI, VCHF, and IRON.

Phase 4 — Cross-queue maintenance
10. Recheck HUSD and EURT reserve-source status only when durable product-specific evidence is found.
11. Keep BAC, DSD, ESD, and GYEN terminal dates unresolved until matching end-boundary evidence exists.

Phase 5 — Controlled growth
12. Prepare a reviewed candidate master.
13. Promote no more than five complete stable-asset records per batch.
14. Publish and verify production after each growth batch so production never trails main by more than one batch.

Phase 6 — Normal operating cycle
15. Alternate two or three existing-record quality audits with one growth batch of no more than five records.
16. Insert urgent incident, regulatory, depeg, wind-down, or redemption updates ahead of the routine queue when needed.
```

## Immediate next work

```text
1. Complete CI and merge PR #134.
2. Do not start DOLA or controlled record growth before production publication and parity verification.
3. Manually publish latest main after PR #134 merges.
4. Verify the production checkpoint and record it in a dedicated audit PR.
5. Resume at DOLA only after production parity is PASS.
```

## Production policy

Normal pull requests and normal `main` merges complete through GitHub CI and do not publish to Cloudflare.

The production path remains:

```text
latest main
→ manual GitHub Actions dispatch
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

## Manual publication configuration

```text
Pages project: stable-or-gone
Production branch: main
Automatic production deployment: disabled
Preview branch deployments: disabled
Publication path: manual GitHub Actions workflow only
Deployment workflow run: 27908380603
Manual production publication activation — PASS
```

Normal pull requests and normal merges must not invoke the production deployment workflow.

## Growth policy

Controlled record growth remains paused while the public site is behind the canonical GitHub baseline.

No further routine growth batch begins until a manual publication and parity audit can be completed from the latest merged `main`.

After parity is restored, quality corrections and controlled growth resume in the alternating cycle defined above.
