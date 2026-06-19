# Stable or Gone Roadmap

Updated: 2026-06-19

## Purpose

This file is the canonical execution and recovery schedule for the current SOG development phase.

When work is interrupted or transferred, resume in this order:

1. Confirm the latest merged PR and current `main`.
2. Read **Current position** and **Immediate next work**.
3. Open `data/generated/registry-integrity-audit.json` and confirm counts and quality queues.
4. Check whether the named next work item already has an open branch or PR.
5. Continue from the first incomplete named work item.

Work item names such as `Launch-date Batch O` are canonical. GitHub PR numbers are assigned only when a PR is opened and must not be used as future scheduling identifiers.

Every roadmap-changing PR must update this file before merge. After every merge, the implementation report must state:

- the full schedule
- the current position
- the merged PR and merge SHA
- exact data and coverage changes
- validation and CI results
- remaining queues
- the next named work item

## Current position

Public site:

```text
https://sog.badjoke-lab.com/
```

Repository:

```text
badjoke-lab/stable-or-gone
```

Current `main` checkpoint before this roadmap realignment:

```text
d2217291101a94826c968401e16520e35830abae
```

Current canonical registry checkpoint:

```text
70 stable assets
59 organizations
72 stablecoin-organization relationships
70 classifications
70 reserve/redemption profiles
92 events
92 Event v2 detail records
279 evidence records
72 reserve-report or reserve-context records
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
Reserve-report context coverage:       52 / 70 informational
Missing canonical launch dates:            38
Historical records missing terminal date:   4
All-unknown income profiles:                41
```

Latest completed record-quality work:

```text
PR #55 — Add official USDe launch date
PR #56 — Anchor the 70-to-100 execution roadmap
PR #57 — Audit and classify the remaining launch-date queue
```

Emergency public-consistency repair completed afterward:

```text
PR #59 — Fix public HTML and canonical count consistency
PR #62 — Fix reserve context validator
PR #64 — Refresh Cloudflare Pages deployment
```

Current development stage:

```text
Roadmap realignment after emergency repair
then Phase 1 — Launch-date quality work
```

Current next action:

```text
1. Realign this roadmap and defer Cloudflare production recheck to the count-growth gates
2. Launch-date Batch O
```

## Cloudflare and public-parity position

Issue #66 remains open as a deferred verification item. It no longer blocks 70-record quality work.

The repository build, public consistency validator, production checker, and CI are implemented. The production deployment concern must be rechecked when the public record count changes, because that is the highest-risk point for HTML, JSON, manifest, sitemap, and deployment commit drift.

Required parity gates:

```text
70 → 75: full production parity audit before any 75 → 80 work
75 → 80: production parity audit after merge
80 → 85: production parity audit after merge
85 → 90: production parity audit after merge
90 → 95: production parity audit after merge
95 → 100: final full production parity audit
```

At every gate verify:

- deployed commit matches the latest merged `main`
- home counts match version and manifest counts
- stablecoin, organization, and event list counts match canonical data
- detail-link counts match the registry counts
- sitemap detail-route counts match canonical data
- canonical, hreflang, OGP, and JSON-LD checks pass
- obsolete count markers are absent

If any parity gate fails, the next growth batch is blocked until production matches the canonical repository state.

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

Large-scale record growth must not start before Phase 5 is complete. Urgent corrections, broken-link repairs, current status changes, security fixes, and build repairs may interrupt the order, but the roadmap must be updated before normal work resumes.

# Phase 0 — Roadmap realignment after emergency repair

Target: 2026-06-19

## Roadmap realignment

Status: **in progress**

Scope:

- remove future scheduling dependence on obsolete GitHub PR numbers
- retain named work items as the canonical schedule
- record the emergency public-consistency repair as completed
- move Cloudflare production verification to count-growth gates
- keep Issue #66 open as deferred verification rather than a current blocker
- restore `Launch-date Batch O` as the next data implementation item

Completion conditions:

- this roadmap reflects the current repository and queue state
- Phase 1 through Phase 7 remain explicit
- the public-parity gate is mandatory after every growth checkpoint
- normal CI succeeds

# Phase 1 — Launch-date quality work

Target window: 2026-06-19 to 2026-06-24

Current queue: **38 records**

The objective is not to force all records to have a day-level date. The objective is to distinguish confirmed dates from unresolved dates without inventing precision.

The completed launch-date review classified the queue as:

```text
A. Day-level date supported:                         7
B. Only month or year currently supported:           5
C. Multiple launch definitions or versions exist:   23
D. No adequate primary launch source found:           3
```

## Launch-date Batch O

Status: **next after Phase 0**

Apply the five cleanest category-A dates:

```text
crvUSD   2023-05-14
EURCV    2023-04-20
EURI     2024-08-26
EURQ     2024-11-18
USDY     2023-09-07
```

Each promoted date must update all applicable layers:

```text
canonical stable-asset record
launch event
event detail
evidence and evidence relations
event source_count
registry statistics
integrity audit
remaining-launch-date review
roadmap current position
```

Expected queue result:

```text
Missing canonical launch dates: 38 → 33
Canonical stable-asset count:    70 unchanged
```

## Launch-date Batch P

Apply the remaining two currently approved category-A dates:

```text
sUSDS   2024-09-18
USDtb   2024-12-16
```

These require careful lineage, activation-boundary, and publication-metadata handling.

Expected queue result:

```text
Missing canonical launch dates: 33 → 31
```

## Launch-date unresolved queue freeze

Recheck the remaining category B, C, and D records. Apply an additional day-level date only if newly found primary evidence resolves the exact launch boundary.

Otherwise retain `launch_date: null` and preserve:

- the strongest supported date range
- the unresolved launch definition
- the rejected shortcut dates
- the future review target

Phase completion conditions:

```text
Missing launch dates:            31 unless stronger evidence is found
All remaining null dates:        explicitly classified and documented
Artificial month/year-first date: 0
Critical findings:                0
Warnings:                         0
```

# Phase 2 — Historical terminal-date work

Target window: 2026-06-25 to 2026-06-28

Current queue:

```text
BAC
DSD
ESD
USDN
```

## Historical terminal-date review

For each asset, distinguish:

- depeg start
- protocol or frontend abandonment
- minting stop
- redemption stop
- governance abandonment
- migration or rebrand date
- last confirmed operational date
- first confirmed non-operational date
- formal shutdown announcement

A market collapse date must not automatically become `discontinued_date`.

## Resolve or freeze terminal-date unknowns

Apply exact terminal dates only where supported. Otherwise retain `null` and record:

- last confirmed operational date
- first confirmed inactive date
- missing source or unresolved definition
- future source-review target

Phase completion conditions:

```text
Unexplained terminal-date gaps: 0
Invented shutdown dates:        0
```

# Phase 3 — Income-profile completion

Target window: 2026-06-29 to 2026-07-08

Current queue: **41 all-unknown income profiles**

The objective is to classify mechanics, not to publish live yield figures or rank assets.

## Fiat-backed income profiles

Prioritize issuer-backed assets such as USDT, USDC, PYUSD, FDUSD, RLUSD, EURC, USDP, USDG, TUSD, and GUSD.

Determine:

- whether the base token has native holder yield
- whether reserve income is retained by the issuer
- whether a separate yield-bearing product exists
- whether yield requires an external platform
- whether the correct classification is `none`, `separate_asset`, or `unknown`

## Protocol stablecoin income profiles

Prioritize DAI, LUSD, crvUSD, GHO, FRAX, RAI, BOLD, alUSD, MIM, and similar protocol assets.

Separate:

- base-asset mechanics
- savings or staking modules
- protocol revenue distribution
- collateral yield
- borrowing and redemption fees
- separate wrappers or receipt tokens

## Synthetic and yield-related profiles

Prioritize USDe, sUSDe, sDAI, sUSDS, USD0, USR, sUSD, SPOT, and NUON.

Do not merge temporary campaign rewards, secondary DeFi yield, and native asset income into one field.

## Historical, commodity, and edge profiles

Cover failed, migrated, commodity-backed, and otherwise non-standard assets.

Phase completion target:

```text
All-unknown income profiles: 41 → 0
```

A profile may still contain unknown fields, but it must identify at least one of:

```text
no native yield
separate yield-bearing derivative
protocol-dependent income
historical-only income
not applicable
source unresolved
```

# Phase 4 — Reserve-report applicability and evidence

Target window: 2026-07-09 to 2026-07-12

Current context coverage: **52 / 70**

This layer is informational and is not expected for every asset.

## Classify reserve-report applicability

Classify uncovered records as:

```text
report expected but missing
not applicable by design
source status unresolved
```

Required backing structure remains represented by `reserve_components`, which already covers 70 / 70 assets.

## Add missing applicable reserve evidence

Add only real issuer reports, attestations, audit archives, transparency dashboards, protocol collateral disclosures, or relevant historical reserve-intervention records.

Do not create placeholder reserve-report rows merely to reach 70 / 70.

Phase completion conditions:

- applicability is explicit
- applicable missing evidence is reduced as far as primary sources allow
- informational coverage remains visible
- critical findings remain 0
- warnings remain 0

# Phase 5 — Final 70-record quality audit and baseline freeze

Target window: 2026-07-13 to 2026-07-16

## Final 70-record quality audit

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

## Freeze the 70-record quality baseline

Update or create:

```text
docs/audits/registry-70-quality-baseline.md
docs/migration/registry-v3-baseline.json
data/generated/registry-stats.json
data/generated/registry-integrity-audit.json
```

Phase completion conditions:

```text
Critical findings:              0
Warnings:                       0
Stale verification:             0
Canonical collisions:           0
Alias warnings:                 0
All-unknown income profiles:    0
Unresolved date records:        explicitly documented
Normal CI workflows:            all successful
```

# Phase 6 — Controlled growth from 70 to 100

Target window: 2026-07-17 to 2026-08-10

Default batch size: five canonical assets.

Growth work item names will be assigned when each candidate set is frozen. Names must not conflict with the launch-date batches.

| Growth checkpoint | Target window | Required post-merge gate |
|---:|---|---|
| 75 assets | 2026-07-17 to 2026-07-20 | full production parity audit; block 80 work on failure |
| 80 assets | 2026-07-21 to 2026-07-24 | production parity audit |
| 85 assets | 2026-07-25 to 2026-07-28 | production parity audit |
| 90 assets | 2026-07-29 to 2026-08-01 | production parity audit |
| 95 assets | 2026-08-02 to 2026-08-05 | production parity audit |
| 100 assets | 2026-08-06 to 2026-08-10 | final full production parity audit and Issue #66 resolution |

Complex batches may contain fewer records when they involve collapses, migrations, complex legal structures, disputed identity, or extensive deployment history.

Every new canonical asset must include, where applicable:

```text
canonical stable-asset record
organization or issuer record
stablecoin-organization relationship
classification
reserve/redemption profile
at least one lifecycle event
event detail
at least two useful evidence records
known unknowns
deployments
legal profile
reserve components
income profile
```

Growth priority order:

1. clearly issued and regulated fiat-backed assets
2. historically important failures and shutdowns
3. underrepresented non-USD reference currencies
4. established protocol and synthetic stable assets
5. migrated, rebranded, wound-down, and discontinued assets

Do not promote simple wrappers, bridged copies, LP tokens, vault shares, test tokens, duplicate chain deployments, or announcement-only projects as separate canonical assets by default.

# Phase 7 — Continuous maintenance and growth

Target start: 2026-08-11

Default operating cycle:

```text
Weekly:
- one controlled record-growth PR
- one existing-record enrichment or correction PR

Monthly:
- stale verification audit
- issuer terms and redemption review
- reserve and attestation review
- lifecycle and status review
- generated statistics and integrity refresh
- production parity audit
```

Indicative growth targets:

```text
2026-08-10: 100 canonical assets
2026-09-30: 120–130 canonical assets
2026-12-31: 160–200 canonical assets
```

These are planning targets, not permission to weaken inclusion or evidence standards.

# Validation and merge rules

Every work item in this roadmap must:

- start from the latest confirmed `main`
- keep candidates, canonical data, loaders, validators, baselines, generated output, and documentation synchronized
- run the normal CI suite
- preserve existing IDs, slugs, and public routes unless a dedicated migration approves a change
- avoid fabricated day-level dates, yield values, reserve claims, or current status claims
- remove one-off generation workflows and temporary files before merge
- update this roadmap when the current position, queues, or planned sequence changes

Record-growth work has the additional rule:

```text
merge growth batch
→ wait for or trigger the corresponding production deployment
→ run production consistency
→ proceed only after parity succeeds
```

# Immediate next work

```text
Current: Roadmap realignment after emergency repair
Next:    Launch-date Batch O
Then:    Launch-date Batch P
Then:    Launch-date unresolved queue freeze
Then:    Historical terminal-date review
```
