# Stable or Gone Roadmap

Updated: 2026-06-20

## Purpose

This file is the canonical execution and recovery schedule for SOG.

Resume interrupted work in this order:

1. Confirm the latest merged PR and current `main`.
2. Read **Current position** and **Immediate next work**.
3. Validate `docs/migration/registry-v3-baseline.json`.
4. Check for an existing branch or PR for the next named work item.
5. Resume from the first incomplete item.

Every roadmap-changing PR must update this file. Every merge report must state the merge SHA, data changes, CI result, remaining queues, and next work item.

## Current position

Repository:

```text
badjoke-lab/stable-or-gone
```

Public site:

```text
https://sog.badjoke-lab.com/
```

Latest quality checkpoint:

```text
PR #84 — Establish the 70-record quality baseline
Status: active; becomes complete on merge
```

Canonical registry baseline:

```text
70 stable assets
59 organizations
72 stablecoin-organization relationships
70 classifications
70 reserve/redemption profiles
97 events
97 Event v2 detail records
286 evidence records
77 reserve-report or reserve-context records
153 known unknowns
9 regulatory notes
101 deployments
70 legal profiles
4 stable-asset relationships
102 reserve components
70 income profiles
```

Quality baseline:

```text
Candidate promotions:                    70 / 70
Pending candidates:                       0
Critical findings:                        0
Warnings:                                 0
Stale verification records:               0
Required-layer coverage:              70 / 70
Event coverage:                        70 / 70
Deployment coverage:                   70 / 70
Reserve-report context coverage:       57 / 70 informational
Missing canonical launch dates:            31
Historical records missing terminal date:   6
Reserve applicability queue:                13
All-unknown income profiles:                 0
```

Machine-readable baseline:

```text
docs/migration/registry-v3-baseline.json
scripts/validate-registry-v3-baseline.mjs
```

Completed quality checkpoints:

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
```

Current development stage:

```text
Phase 1 — Launch-date quality work: complete
Phase 2 — Historical terminal-date work: complete
Phase 3 — Income-profile completion: complete
Phase 4 — Reserve-report applicability and evidence: complete
Phase 5 — Final 70-record quality audit and baseline: complete on PR #84 merge
Phase 6A — Controlled growth from 70 to 75: next
Phase 6B — Growth beyond 75: blocked until production parity succeeds
```

## Immediate next work

After PR #84 merges:

```text
1. Prepare one controlled five-asset candidate batch for 70 → 75.
2. Apply duplicate, lineage, issuer, event, evidence, deployment, legal, reserve, and income checks.
3. Promote only reviewed canonical assets.
4. Update the Registry v3 baseline in the same growth PR.
5. Stop at 75 records if Cloudflare access is still unavailable.
6. Run full production parity before any 75 → 80 work.
```

## Cloudflare and public-parity position

Cloudflare operator access is currently unavailable. Do not attempt:

- production deployment
- dashboard changes
- credential or secret setup
- production parity execution
- deployment polling requiring Cloudflare access

GitHub-only data, validation, documentation, CI, and the 70-to-75 growth batch may continue.

Issue #66 remains a deferred production-verification item. It does not block the 70-record baseline or preparation of the first growth batch, but no 75-to-80 work may begin until production parity is completed.

Production parity gates:

```text
75 records: full production parity; block 75 → 80 on failure or unavailable access
80 records: production parity after merge
85 records: production parity after merge
90 records: production parity after merge
95 records: production parity after merge
100 records: final full production parity and Issue #66 resolution
```

## Fixed execution order

```text
Phase 0  Roadmap realignment
Phase 1  Launch-date quality work
Phase 2  Historical terminal-date work
Phase 3  Income-profile completion
Phase 4  Reserve-report applicability and evidence
Phase 5  Final 70-record quality audit and baseline
Phase 6  Controlled growth from 70 to 100 with public-parity gates
Phase 7  Continuous maintenance and growth
```

# Phase 1 — Launch-date quality work

Status: **complete in PR #74**

```text
31 unresolved records
Category B — partial date only: 5
Category C — boundary, version, or lineage conflict: 23
Category D — adequate primary source absent: 3
```

Source: `data/quality/launch-date-unresolved.json`

Do not invent day-level precision or coerce month/year evidence into a canonical date.

# Phase 2 — Historical terminal-date work

Status: **complete in PR #77**

```text
6 unresolved records
BAC
DSD
ESD
GYEN
Mountain USDM
USDN
```

Source: `data/quality/terminal-date-unresolved.json`

Depeg, migration start, last commit, and retrospective source date are not default terminal dates.

# Phase 3 — Income-profile completion

Status: **complete in PR #80**

```text
All-unknown income profiles: 41 → 0
Canonical income profiles:   70 unchanged
```

Classify mechanics rather than live yield. External lending, pools, wrappers, and issuer reserve earnings remain separate from base-token holder income.

# Phase 4 — Reserve-report applicability and evidence

Status: **complete in PR #83**

```text
Canonical reserve-context rows:        77
Reserve-context coverage:            57/70 informational
Expected but missing:                    0
Not applicable by design:               10
Reviewed source-status unresolved:       3
Placeholder reserve rows:                0
```

The three reviewed unresolved items are FEI, HUSD, and EURT.

Sources:

```text
data/quality/reserve-report-applicability.json
docs/audits/reserve-report-applicability-review.md
docs/audits/reserve-source-status-review.md
```

# Phase 5 — Final 70-record quality audit and baseline

Status: **complete on PR #84 merge**

Sources:

```text
docs/migration/registry-v3-baseline.json
docs/audits/registry-70-quality-baseline.md
scripts/validate-registry-v3-baseline.mjs
```

Completion requirements:

```text
Critical findings:              0
Warnings:                       0
Stale verification:             0
Canonical collisions:           0
Alias warnings:                 0
All-unknown income profiles:    0
Unresolved queues:              explicit and exact
Normal CI workflows:            all successful
```

Any intentional record growth or queue resolution must update the canonical data, generated outputs, and baseline in one reviewed PR.

# Phase 6 — Controlled growth from 70 to 100

Status: **Phase 6A may begin after PR #84; later growth is gated**

Default batch size: five canonical assets.

| Checkpoint | Required gate |
|---:|---|
| 75 | full production parity; block further growth if unavailable or failing |
| 80 | production parity after merge |
| 85 | production parity after merge |
| 90 | production parity after merge |
| 95 | production parity after merge |
| 100 | final full parity and Issue #66 resolution |

Every new canonical asset must include the applicable entity, organization, relationship, classification, profile, event, evidence, unknowns, deployment, legal, reserve-component, and income layers.

Do not promote simple wrappers, bridged copies, LP tokens, vault shares, test tokens, duplicate deployments, or announcement-only projects as separate canonical assets by default.

# Phase 7 — Continuous maintenance and growth

Status: **future**

```text
Weekly:
- one controlled record-growth PR
- one existing-record enrichment or correction PR

Monthly:
- stale verification audit
- source-link and archive check
- generated statistics and integrity review

At every growth checkpoint:
- production parity audit
- public metadata and route-count verification
```
