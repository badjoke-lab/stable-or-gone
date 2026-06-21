# Stable or Gone Roadmap

Updated: 2026-06-21

## Purpose

This file is the canonical execution and recovery schedule for SOG.

Resume interrupted work in this order:

1. Confirm the latest merged PR and current `main`.
2. Read **Current position** and **Immediate next work**.
3. Validate `docs/migration/registry-v3-baseline.json`.
4. Check for an existing branch or PR for the named next work item.
5. Resume from the first incomplete item.

Every roadmap-changing PR must update this file. Every merge report must state the merge SHA, data changes, CI result, remaining queues, production status, and next work item.

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
PR #86 — Review Batch 12 promotion boundaries
Merge: 55c63806e59e7268c5bea7cb4caeaab76cacacf1
```

Active work:

```text
PR #87 — Promote Batch L current stable assets
Branch: batch-l-current-stable-assets
Target: 70 → 75 canonical stable assets
```

Batch L assets:

```text
M
Falcon USD (USDf)
dForce USX
Anzen USDz
Avalon USDa
```

Expected canonical registry after PR #87:

```text
75 stable assets
64 organizations
77 stablecoin-organization relationships
75 classifications
75 reserve/redemption profiles
102 events
102 Event v2 detail records
306 evidence records
82 reserve-report or reserve-context records
173 known unknowns
9 regulatory notes
106 deployments
75 legal profiles
4 stable-asset relationships
107 reserve components
75 income profiles
```

Expected quality baseline after PR #87:

```text
Candidate promotions:                    75 / 75
Pending candidates:                       0
Critical findings:                        0
Warnings:                                 0
Stale verification records:               0
Required-layer coverage:              75 / 75
Event coverage:                        75 / 75
Deployment coverage:                   75 / 75
Reserve-report context coverage:       62 / 75 informational
Missing canonical launch dates:            34
Historical records missing terminal date:   6
Reserve applicability queue:                13
All-unknown income profiles:                 0
```

Machine-readable baseline:

```text
docs/migration/registry-v3-baseline.json
scripts/validate-registry-v3-baseline.mjs
```

## Immediate next work

```text
1. Complete final zero-warning CI for PR #87.
2. Merge PR #87 into main.
3. Wait for the single Cloudflare production deployment from main.
4. Verify the deployed commit and 75-record production counts.
5. Verify all five new detail routes, sitemap entries, manifest counts, metadata, and machine-readable files.
6. Record the 75-record production-parity result.
7. Do not begin 75 → 80 growth until production parity passes.
```

## Cloudflare production configuration

Cloudflare operator access is restored. The Pages project is configured as follows:

```text
Production branch: main
Automatic production deployment: enabled
Preview branch deployments: disabled
Build cache: enabled
Build command: npm run build
Output directory: dist
Build watch paths: *
```

This means work-branch pushes do not consume Pages preview builds. A successful merge to `main` triggers one production deployment.

## Production-parity gates

| Canonical count | Required gate |
|---:|---|
| 75 | full production parity before any 75 → 80 work |
| 80 | production parity after merge |
| 85 | production parity after merge |
| 90 | production parity after merge |
| 95 | production parity after merge |
| 100 | final full production parity and Issue #66 resolution |

At each gate verify:

- deployed commit
- home-page and Registry v3 counts
- machine-readable manifest counts
- canonical detail routes
- sitemap route count
- canonical metadata and hreflang
- OGP and JSON-LD
- obsolete count markers
- production error state

## Completed quality checkpoints

```text
PR #74 — Freeze unresolved launch-date queue
PR #75 — Audit historical terminal-date boundaries
PR #77 — Freeze historical terminal-date queue
PR #78 — Resolve fiat-backed income profiles
PR #79 — Resolve protocol stable-asset mechanics
PR #80 — Complete income-profile classification
PR #81 — Classify reserve-report applicability
PR #82 — Add Phase 4 reserve context records
PR #83 — Freeze reviewed reserve source status
PR #84 — Establish the 70-record quality baseline
PR #85 — Prepare Batch 12 candidate intake
PR #86 — Review Batch 12 promotion boundaries
```

## Phase status

```text
Phase 1 — Launch-date quality work: complete
Phase 2 — Historical terminal-date work: complete
Phase 3 — Income-profile completion: complete
Phase 4 — Reserve-report applicability and evidence: complete
Phase 5 — 70-record quality audit and baseline: complete
Phase 6A — Controlled growth from 70 to 75: active in PR #87
Phase 6B — 75-record production parity: next
Phase 6C — Growth from 75 to 80: blocked until parity passes
```

## Launch-date queue

Status after Batch L:

```text
34 unresolved records
Category B: partial date only
Category C: boundary, version, or lineage conflict
Category D: adequate primary source absent
```

Source:

```text
data/quality/launch-date-unresolved.json
```

USDf, USDz, and USDa are added as partial-date records. Unsupported day-level precision remains forbidden.

## Terminal-date queue

```text
6 unresolved records
BAC
DSD
ESD
GYEN
Mountain USDM
USDN
```

Source:

```text
data/quality/terminal-date-unresolved.json
```

A depeg, migration start, last commit, or retrospective source date is not automatically a terminal date.

## Reserve-report applicability

```text
Reserve-context rows after Batch L:    82
Context coverage after Batch L:     62/75 informational
Expected but missing:                   0
Not applicable by design:              10
Reviewed source-status unresolved:      3
Placeholder reserve rows:               0
```

The reviewed unresolved records remain FEI, HUSD, and EURT.

Sources:

```text
data/quality/reserve-report-applicability.json
docs/audits/reserve-report-applicability-review.md
docs/audits/reserve-source-status-review.md
```

## Controlled-growth rules

Default batch size is five canonical assets.

Every promoted asset must include the applicable:

- canonical stable-asset record
- organization and relationship
- classification
- reserve and redemption profile
- event and Event v2 detail
- primary evidence
- explicit known unknowns
- deployment identity
- legal profile
- reserve component
- income profile
- candidate promotion record

Do not promote simple wrappers, bridged copies, LP tokens, vault shares, test tokens, duplicate deployments, or announcement-only projects as separate canonical assets by default.

Any intentional count or queue change must update canonical data, generated outputs, integrity audit, and Registry v3 baseline in one reviewed PR.

## Continuous maintenance after parity

```text
Weekly:
- one controlled growth PR
- one existing-record enrichment or correction PR

Monthly:
- stale verification audit
- source-link and archive check
- generated statistics and integrity review

At every count checkpoint:
- production parity audit
- public metadata and route-count verification
```
