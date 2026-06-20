# Stable or Gone Roadmap

Updated: 2026-06-20

## Purpose

This file is the canonical execution and recovery schedule for the current SOG development phase.

When work is interrupted or transferred:

1. Confirm the latest merged PR and current `main`.
2. Read **Current position** and **Immediate next work**.
3. Confirm counts and queues in `data/generated/registry-integrity-audit.json`.
4. Check for an existing branch or PR for the named next work item.
5. Resume from the first incomplete item.

Every roadmap-changing PR must update this file before merge. Every merge report must state the merge SHA, data changes, CI result, remaining queues, and next work item.

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
PR #82 — Add Phase 4 reserve context records
Merge: 370e7cff58f0dc0a38f1918dd491915f121889eb
```

Current canonical registry:

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

Current integrity state:

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
All-unknown income profiles:                 0
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
```

Current development stage:

```text
Phase 1 — Launch-date quality work: complete
Phase 2 — Historical terminal-date work: complete
Phase 3 — Income-profile completion: complete
Phase 4A — Reserve-report applicability classification: complete
Phase 4B — Five reviewed primary reserve-context records: complete in PR #82
Phase 4C — FEI / HUSD / EURT source-status review: complete as reviewed unresolved
Phase 5 — Final 70-record quality audit and baseline freeze: next
Phase 6 — Controlled growth to 100: blocked until Phase 5 completes
```

## Immediate next work

```text
1. Open the final 70-record quality audit.
2. Re-run collision, relationship, lifecycle, date, event/evidence, deployment, reserve, income, stats, and freshness checks.
3. Freeze the Registry v3 quality baseline.
4. Keep the 31 launch-date and 6 terminal-date queues explicit.
5. Keep FEI, HUSD, and EURT as reviewed unresolved unless materially better primary evidence appears.
6. Do not begin 70 → 75 growth until the baseline freeze is complete.
```

## Cloudflare and public-parity position

Cloudflare operator access is currently unavailable. Do not attempt:

- production deployment
- dashboard changes
- credential or secret setup
- production parity execution
- deployment polling requiring Cloudflare access

GitHub-only data, validation, documentation, and CI work continues normally. Normal pull requests and `main` merges do not wait for Cloudflare Pages.

Issue #66 remains a deferred production-verification item and does not block the final 70-record repository audit.

Production parity becomes mandatory at growth checkpoints:

```text
70 → 75: full production parity audit before any 75 → 80 work
75 → 80: production parity audit after merge
80 → 85: production parity audit after merge
85 → 90: production parity audit after merge
90 → 95: production parity audit after merge
95 → 100: final full production parity audit
```

## Fixed execution order

```text
Phase 0  Roadmap realignment
Phase 1  Launch-date quality work
Phase 2  Historical terminal-date work
Phase 3  Income-profile completion
Phase 4  Reserve-report applicability and evidence
Phase 5  Final 70-record quality audit and baseline freeze
Phase 6  Controlled growth from 70 to 100 with public-parity gates
Phase 7  Continuous maintenance and growth
```

Large-scale record growth must not start before Phase 5 is complete.

# Phase 0 — Roadmap realignment

Status: **complete in PR #67**

Outcomes:

- named work items are the canonical schedule
- GitHub development is separated from production deployment
- production parity checks occur at count-growth gates
- Issue #66 remains a deferred verification item

# Phase 1 — Launch-date quality work

Status: **complete in PR #74**

Frozen queue:

```text
31 records
Category B — partial date only: 5
Category C — boundary, version, or lineage conflict: 23
Category D — adequate primary source absent: 3
```

Source of truth:

```text
data/quality/launch-date-unresolved.json
```

Rules:

- do not invent day-level precision
- retain `launch_date: null` where the boundary is unresolved
- preserve supported range, rejected shortcut dates, and future review target
- canonical null set must exactly match the queue

# Phase 2 — Historical terminal-date work

Status: **complete in PR #77**

Frozen queue:

```text
BAC
DSD
ESD
GYEN
Mountain USDM
USDN
```

Source of truth:

```text
data/quality/terminal-date-unresolved.json
```

Rules:

- depeg or collapse is not automatically discontinuation
- distinguish mint stop, redemption stop, migration, abandonment, formal shutdown, and last operation
- retain `null` where the terminal boundary is unproven

# Phase 3 — Income-profile completion

Status: **complete in PR #80**

```text
All-unknown income profiles: 41 → 0
Canonical income profiles:   70 unchanged
```

Rules:

- classify mechanics, not live yield or rankings
- issuer reserve earnings are not token-holder income
- external lending, pools, campaigns, wrappers, and savings tokens remain separate

# Phase 4 — Reserve-report applicability and evidence

Status: **complete**

## Phase 4A — Applicability classification

Completed in PR #81.

Initial classification:

```text
report_expected_but_missing: 5
not_applicable_by_design:    10
source_status_unresolved:     3
```

## Phase 4B — Reviewed primary context

Completed in PR #82.

Assets:

```text
NUON
USD0
USR
EURS
USDm
```

Result:

```text
Reserve-report/context records: 72 → 77
Context coverage:               52/70 → 57/70
Expected-but-missing:            5 → 0
Remaining queue:                18 → 13
```

## Phase 4C — Historical source status

Status: **complete as reviewed unresolved**

```text
FEI  — participant-specific FEI-to-DAI execution exists; full final-redemption completion is unproven
HUSD — January 2022 accountant attestation is identified; original signed report is unrecovered
EURT — consolidated Tether reporting exists; EURT-specific reserve and liability scope is unproven
```

Source of truth:

```text
data/quality/reserve-report-applicability.json
docs/audits/reserve-report-applicability-review.md
docs/audits/reserve-source-status-review.md
```

Phase 4 final state:

```text
Applicable missing context:         0
Not-applicable decisions:          10 documented
Reviewed unresolved source status:  3 frozen
Reserve-context coverage:          57 / 70 informational
Placeholder reserve rows:           0
```

# Phase 5 — Final 70-record quality audit and baseline freeze

Status: **next**

Audit all 70 records for:

- ID, name, symbol, alias, and slug collisions
- issuer and organization relationships
- status and lifecycle consistency
- launch and terminal-date consistency
- event and evidence relations
- event `source_count`
- deployment identity and canonicality
- reserve-report applicability
- income-profile classification
- generated statistics and deterministic output
- stale verification dates

Freeze or update:

```text
docs/audits/registry-70-quality-baseline.md
docs/migration/registry-v3-baseline.json
data/generated/registry-stats.json
data/generated/registry-integrity-audit.json
```

Completion conditions:

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

# Phase 6 — Controlled growth from 70 to 100

Status: **blocked until Phase 5 completes**

Default batch size: five canonical assets.

| Growth checkpoint | Required gate |
|---:|---|
| 75 | full production parity audit; block 80 work on failure |
| 80 | production parity audit |
| 85 | production parity audit |
| 90 | production parity audit |
| 95 | production parity audit |
| 100 | final full production parity audit and Issue #66 resolution |

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
