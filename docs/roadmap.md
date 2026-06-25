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
Latest merged PR: #139 — Audit DOLA launch boundary
Latest merged commit: 4cb2f9f27ba8aef40794f25d8eb331bc5f2eaa97
Current PR: #140 — Resolve DOLA launch boundary
Current phase: canonical quality implementation
Canonical result: DOLA launch fixed to 2021-02-25
Next bounded work after merge: USD1 launch-boundary audit
```

## DOLA audit checkpoint

The bounded review separates the following boundaries:

```text
2021-02-23 — canonical Ethereum token contract creation
2021-02-25 — Anchor public launch under the protocol now called Frontier
2021-02-25 — original public DOLA issuance boundary supported by first-party documentation
exact first mint — unresolved
late 2022 — FiRM launch and backing-model transition
```

Audit conclusion:

```text
Canonical DOLA launch_date: 2021-02-25
Contract deployment remains a separate 2021-02-23 boundary
FiRM is a later protocol/model boundary, not the original DOLA launch
```

Audit file:

```text
docs/audits/dola-launch-boundary-review.md
```

## Production checkpoint

```text
Result: PASS
Canonical records: 82
Production commit: 835a00d5cd2db48c0a0ede3394cf265dec919813
Verification workflow run: 27908380603
Successful verification job: 83360065881
Audit: docs/audits/registry-82-production-parity.md
```

The successful production publication includes the 82-record registry, the GENIUS Act guide, the MiCA guide, the JPYC versus JPYSC guide, related-guide discovery, Updates, sitemap integration, and machine-readable public files.

PR #140 is a quality-only change and does not increase the stable-asset count or trigger automatic production publication.

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

DOLA is no longer in the queue. Its public launch is fixed to 2021-02-25 while exact first mint remains a known unknown.

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
- preserve predecessor, legacy deployment, and unresolved migration boundaries explicitly
- keep `launch_date: null` when the exact public boundary remains unresolved
- separate contract deployment from public availability
- preserve exact first mint as unresolved when the canonical public launch can be established independently

Next bounded launch-date review:

```text
USD1
```

Following quality wave:

```text
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
Production publication — PASS
```

Published guide dates:

```text
GENIUS Act and Stablecoins: 2026-06-25
MiCA and Stablecoins:       2026-06-25
JPYC vs JPYSC:              2026-06-25
```

Publication-path repair history:

```text
PR #136 — Fix production build commit metadata — merged
PR #137 — Align build marker validation with deployment source — merged
PR #138 — Verify rerun builds against checked-out commit — merged
```

## Full execution sequence

```text
Phase 1 — Complete DOLA implementation
1. Synchronize baselines, generated outputs, README, audits, and roadmap.
2. Remove temporary synchronization workflow changes and helper script.
3. Run all six CI workflows.
4. Merge PR #140 only after every check passes.

Phase 2 — First launch-date quality wave
5. Audit USD1 introduction, contract deployment, first issuance, testing, and public availability boundaries.
6. Implement a date only if day-level primary or on-chain evidence supports the selected public boundary.
7. Review MIM, mUSD, USK, VAI, VCHF, and IRON.

Phase 3 — Cross-queue maintenance
8. Recheck HUSD and EURT reserve-source status only when durable product-specific evidence is found.
9. Keep BAC, DSD, ESD, and GYEN terminal dates unresolved until matching end-boundary evidence exists.

Phase 4 — Controlled growth
10. Prepare a reviewed candidate master.
11. Promote no more than five complete stable-asset records per batch.
12. Publish and verify production after each growth batch.
13. Do not allow production to trail main by more than one growth batch.

Phase 5 — Normal operating cycle
14. Alternate two or three existing-record quality audits with one growth batch of no more than five records.
15. Insert urgent incident, regulatory, depeg, wind-down, or redemption updates ahead of the routine queue when necessary.
```

## Immediate next work

```text
1. Complete final CI and merge PR #140.
2. Report DOLA implementation counts and queue reduction.
3. Start the bounded USD1 launch-boundary audit.
4. Do not force a USD1 date from the March 2025 month-level range alone.
5. Separate introduction, deployment, first issuance, testing, and public availability.
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

- finish the DOLA implementation and first bounded quality wave
- promote no more than five complete records per growth batch
- run full CI for every batch
- publish and verify after every growth batch
- alternate growth with existing-record quality work
- keep unreviewed candidates, internal monitoring, and private notes out of public files
