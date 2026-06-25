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
Latest merged PR: #135 — Record registry 82 production parity
Latest merged commit: 9e4cde7456ccf83d62d646191809c97031c8529e
Current PR: #139 — Audit DOLA launch boundary
Current phase: bounded existing-record quality audit
Canonical change in this PR: none
Next operation after merge: implement the resolved DOLA launch boundary
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
Recommended canonical DOLA launch_date: 2021-02-25
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
Total unresolved before DOLA implementation: 23
Category B:                                 3
Category C:                                17
Category D:                                 3
```

The audit PR does not alter canonical data. The implementation PR is expected to remove DOLA and produce:

```text
Total unresolved after implementation: 22
Category B:                              3
Category C:                             16
Category D:                              3
```

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

Current bounded launch-date review:

```text
DOLA — audit resolved; canonical implementation pending
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
Phase 1 — DOLA bounded review
1. Complete CI and merge PR #139.
2. Preserve the audit conclusion that public launch is 2021-02-25 and deployment is 2021-02-23.

Phase 2 — DOLA canonical implementation
3. Set DOLA launch_date to 2021-02-25.
4. Add a dated launch event and Event v2 detail.
5. Add first-party launch evidence and on-chain deployment evidence.
6. Update the existing Ethereum deployment record with the 2021-02-23 boundary.
7. Remove DOLA from the unresolved launch queue.
8. Preserve the exact first mint as unresolved unless separately established.
9. Synchronize baselines, generated outputs, counts, README, audits, and roadmap.
10. Run all CI and merge only after every check passes.

Phase 3 — First launch-date quality wave
11. Review USD1.
12. Review MIM.
13. Review mUSD.
14. Review USK.
15. Review VAI.
16. Review VCHF.
17. Review IRON.

Phase 4 — Cross-queue maintenance
18. Recheck HUSD and EURT reserve-source status only when durable product-specific evidence is found.
19. Keep BAC, DSD, ESD, and GYEN terminal dates unresolved until matching end-boundary evidence exists.

Phase 5 — Controlled growth
20. Prepare a reviewed candidate master.
21. Promote no more than five complete stable-asset records per batch.
22. Publish and verify production after each growth batch.
23. Do not allow production to trail `main` by more than one growth batch.

Phase 6 — Normal operating cycle
24. Alternate two or three existing-record quality audits with one growth batch of no more than five records.
25. Insert urgent incident, regulatory, depeg, wind-down, or redemption updates ahead of the routine queue when necessary.
```

## Immediate next work

```text
1. Complete CI and merge PR #139.
2. Report the DOLA audit conclusion and unchanged canonical counts.
3. Open the DOLA canonical implementation PR.
4. Set launch_date only to the audited 2021-02-25 public boundary.
5. Preserve 2021-02-23 as deployment and exact first mint as unresolved.
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

- finish the DOLA bounded audit and canonical implementation first
- promote no more than five complete records per growth batch
- run full CI for every batch
- publish and verify after every growth batch
- alternate growth with existing-record quality work
- keep unreviewed candidates, internal monitoring, and private notes out of public files
