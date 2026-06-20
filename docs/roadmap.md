# Stable or Gone Roadmap

Updated: 2026-06-20

## Purpose

This file is the canonical execution and recovery schedule for the current SOG development phase.

When work is interrupted or transferred, resume in this order:

1. Confirm the latest merged PR and current `main`.
2. Read **Current position** and **Immediate next work**.
3. Open `data/generated/registry-integrity-audit.json` and confirm counts and quality queues.
4. Check whether the named next work item already has an open branch or PR.
5. Continue from the first incomplete named work item.

Every roadmap-changing PR must update this file before merge. After every merge, the implementation report must state the current position, merge SHA, exact data changes, CI result, remaining queues, and next named work item.

## Current position

Repository:

```text
badjoke-lab/stable-or-gone
```

Public site:

```text
https://sog.badjoke-lab.com/
```

Latest completed quality checkpoint:

```text
PR #81 — Classify reserve-report applicability
Merge: bd50ba76b1e9c6cf8a6bb8f21499e2f7443f5a5c
```

Current canonical registry checkpoint after the active Phase 4B branch:

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

Completed record-quality work:

```text
PR #74 — Freeze unresolved launch-date queue
PR #75 — Audit historical terminal-date boundaries
PR #77 — Freeze historical terminal-date queue
PR #78 — Resolve fiat-backed income profiles
PR #79 — Resolve protocol stable-asset mechanics
PR #80 — Complete income-profile classification
PR #81 — Classify reserve-report applicability
```

Current development stage:

```text
Phase 1 — Launch-date quality work: complete in PR #74
Phase 2 — Historical terminal-date work: complete in PR #77
Phase 3 — Income-profile completion: complete in PR #80
Phase 4A — Reserve-report applicability classification: complete in PR #81
Phase 4B — Add five reviewed primary reserve-context records: active
Phase 4C — Investigate FEI / HUSD / EURT source status: next
Phase 5 — Final 70-record quality audit and baseline freeze: pending
```

## Immediate next work

```text
1. Complete and merge Phase 4B for NUON, USD0, USR, EURS, and USDm.
2. Confirm reserve-report/context records 72 → 77.
3. Confirm informational coverage 52/70 → 57/70.
4. Confirm the applicability queue 18 → 13.
5. Investigate FEI, HUSD, and EURT historical source status.
6. Begin the final 70-record quality audit only after Phase 4 is complete.
```

## Cloudflare and public-parity position

All deployment classifications and timing follow `docs/deployment-policy.md`.

Cloudflare operator access is currently unavailable. Do not attempt:

- production deployment
- dashboard changes
- credential or secret setup
- production parity execution
- deployment polling that requires Cloudflare access

GitHub-only data, validation, documentation, and CI work continues normally.

Normal pull requests and normal `main` merges do not wait for Cloudflare Pages. Production verification remains deferred until operator access returns.

Issue #66 remains open as a deferred verification item and does not block 70-record quality work.

Production parity becomes mandatory at record-growth checkpoints:

```text
70 → 75: full production parity audit before any 75 → 80 work
75 → 80: production parity audit after merge
80 → 85: production parity audit after merge
85 → 90: production parity audit after merge
90 → 95: production parity audit after merge
95 → 100: final full production parity audit
```

At every gate verify deployed commit, home counts, manifest counts, detail routes, sitemap counts, canonical metadata, hreflang, OGP, JSON-LD, and obsolete count markers.

## Fixed execution order

```text
Phase 0  Roadmap realignment after emergency repair
Phase 1  Launch-date quality work
Phase 2  Historical terminal-date work
Phase 3  Income-profile completion
Phase 4  Reserve-report applicability and evidence
Phase 5  Final 70-record quality audit and baseline freeze
Phase 6  Controlled growth from 70 to 100 with public-parity gates
Phase 7  Continuous maintenance and growth
```

Large-scale record growth must not start before Phase 5 is complete. Urgent corrections, security fixes, broken-link repairs, status changes, and build repairs may interrupt the order, but the roadmap must be updated before normal work resumes.

# Phase 0 — Roadmap realignment

Status: **complete in PR #67**

Completed outcomes:

- restored named work items as the canonical schedule
- separated GitHub development from production deployment
- moved production parity checks to count-growth gates
- kept Issue #66 as a deferred verification item

# Phase 1 — Launch-date quality work

Status: **complete in PR #74**

Frozen unresolved queue:

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
- retain `launch_date: null` where the exact boundary remains unresolved
- preserve strongest supported range, rejected shortcut dates, and future review target
- canonical null set must exactly match the queue

# Phase 2 — Historical terminal-date work

Status: **complete in PR #77**

Frozen unresolved queue:

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

- a depeg or collapse date is not automatically a discontinuation date
- distinguish mint stop, redemption stop, migration, abandonment, shutdown announcement, and last operational date
- retain `null` where a terminal boundary is not proven

# Phase 3 — Income-profile completion

Status: **complete in PR #80**

```text
All-unknown income profiles: 41 → 0
Canonical income profiles:   70 unchanged
```

Rules:

- classify mechanics, not live yield or rankings
- issuer reserve earnings are not token-holder income
- external lending, pool rewards, campaigns, wrappers, and savings tokens remain separate from base-token mechanics
- a profile may contain unknown fields but cannot remain entirely unknown

# Phase 4 — Reserve-report applicability and evidence

## Phase 4A — Applicability classification

Status: **complete in PR #81**

Initial classification:

```text
report_expected_but_missing: 5
not_applicable_by_design:    10
source_status_unresolved:     3
Total:                       18
```

Source of truth:

```text
data/quality/reserve-report-applicability.json
docs/audits/reserve-report-applicability-review.md
```

## Phase 4B — Add reviewed primary context

Status: **active**

Assets:

```text
NUON
USD0
USR
EURS
USDm
```

Expected result:

```text
Reserve-report/context records: 72 → 77
Context coverage:               52/70 → 57/70
Expected-but-missing queue:      5 → 0
Total remaining queue:          18 → 13
```

Boundaries:

- use only existing reviewed primary disclosures
- do not invent report dates, assurance firms, reserve values, or attestation results
- identify protocol or issuer disclosure separately from independent assurance
- do not create placeholder rows to force 70/70 coverage

## Phase 4C — Resolve historical source status

Status: **next**

Targets:

```text
FEI  — final reserve distribution and redemption execution
HUSD — historical reserve or attestation archive
EURT — product-specific historical reserve or assurance archive
```

Completion rule:

- add a canonical context row only when a durable, product-specific source is recovered
- do not copy another product's assurance coverage
- do not treat governance approval as completed execution
- retain unresolved status when the source boundary remains unproven

Phase 4 completion conditions:

```text
Applicable missing context:        0
Not-applicable decisions:         10 documented
Unresolved source-status records:  3 or fewer, explicitly documented
Critical findings:                 0
Warnings:                          0
Placeholder reserve rows:          0
```

# Phase 5 — Final 70-record quality audit and baseline freeze

Status: **pending**

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
- generated statistics
- deterministic integrity output
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
Unresolved date records:        explicitly documented
Reserve applicability queue:    exact canonical match
Normal CI workflows:            all successful
```

# Phase 6 — Controlled growth from 70 to 100

Status: **blocked until Phase 5 completes**

Default batch size: five canonical assets.

| Growth checkpoint | Required post-merge gate |
|---:|---|
| 75 assets | full production parity audit; block 80 work on failure |
| 80 assets | production parity audit |
| 85 assets | production parity audit |
| 90 assets | production parity audit |
| 95 assets | production parity audit |
| 100 assets | final full production parity audit and Issue #66 resolution |

Every new canonical asset must include, where applicable:

```text
canonical stable-asset record
organization or issuer record
stablecoin-organization relationship
classification
reserve/redemption profile
at least one lifecycle event
event detail
useful evidence records
known unknowns
deployments
legal profile
reserve components
income profile
```

Do not promote simple wrappers, bridged copies, LP tokens, vault shares, test tokens, duplicate chain deployments, or announcement-only projects as separate canonical assets by default.

# Phase 7 — Continuous maintenance and growth

Status: **future**

Default cycle:

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
