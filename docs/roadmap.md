# Stable or Gone Roadmap

Updated: 2026-06-18

## Purpose of this file

This is the canonical execution and recovery document for the current SOG development phase.

When work is interrupted or transferred, resume in this order:

1. Read **Current position**.
2. Confirm the latest merged PR and current `main`.
3. Open `data/generated/registry-integrity-audit.json` and confirm its counts and queues.
4. Check whether the next planned PR already exists.
5. Continue from the first incomplete roadmap item.

Every future roadmap PR must update this file before merge when it changes the current position, queue counts, planned order, or completion status.

After every merge, the implementation report must state:

- the full schedule
- the current position
- what the merge changed
- validation and CI results
- the next PR to start

## Current position

Public site:

```text
https://sog.badjoke-lab.com/
```

Repository:

```text
badjoke-lab/stable-or-gone
```

Current canonical checkpoint:

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

Latest completed record-quality PR:

```text
PR #55 — Add official USDe launch date
```

Current development stage:

```text
70-record quality completion before 70 → 100 record growth
```

Current next action:

```text
PR #56 — Store and anchor this roadmap
PR #57 — Audit and classify the remaining 38 launch-date gaps
```

## Completed major phases

- Registry v2 normalization
- Registry v3 additive implementation and 70-record coverage
- controlled growth from 20 to 70 canonical assets
- Batch K historical-failure promotion
- 70-record cross-layer integrity audit
- event coverage completion at 70 / 70
- deployment coverage completion at 70 / 70
- reserve-report coverage semantics clarified as informational
- integrity audit converted into a deterministic CI check
- machine-readable quality queues added
- launch-date strengthening through PRs #51–#55

## Fixed execution order

```text
Phase 0  Roadmap anchoring
Phase 1  Launch-date quality work
Phase 2  Historical terminal-date work
Phase 3  Income-profile completion
Phase 4  Reserve-report applicability and evidence
Phase 5  Final 70-record quality audit and baseline freeze
Phase 6  Controlled growth from 70 to 100
Phase 7  Continuous maintenance and growth
```

Large-scale record growth must not start before Phase 5 is complete. Urgent corrections, broken-link repairs, current status changes, security fixes, and build repairs may interrupt the order, but the roadmap must be updated before normal work resumes.

# Phase 0 — Roadmap anchoring

Target: 2026-06-18

## PR #56 — Store the 70-to-100 roadmap

Status: **in progress**

Scope:

- replace the obsolete 40-record roadmap with the current 70-record plan
- record the current registry checkpoint and quality queues
- define the fixed PR order through 100 records
- define the recovery procedure
- require this file to be updated as part of future roadmap work

Completion conditions:

- `docs/roadmap.md` contains the current checkpoint
- planned PR order is explicit
- current and next work items are explicit
- normal CI succeeds

# Phase 1 — Launch-date quality work

Target window: 2026-06-18 to 2026-06-28

Current queue: **38 records**

The objective is not to force all records to have a day-level date. The objective is to distinguish confirmed dates from unresolved dates without inventing precision.

## PR #57 — Audit the remaining launch-date queue

Classify every remaining record as:

```text
A. Day-level date confirmed by primary evidence
B. Only month or year can be confirmed
C. Multiple plausible launch definitions or dates exist
D. No adequate primary source has been found
```

For every record, review:

- issuer announcement date
- public availability date
- first mint or issuance date
- protocol mainnet date
- exchange availability date
- migration or rebrand date
- difference between announcement and operational launch

Outputs:

```text
docs/audits/remaining-launch-date-review.md
```

The review must record accepted sources, rejected date candidates, uncertainty reasons, and the recommended treatment.

## PR #58 — Launch-date Batch O

Apply four to six category-A dates.

Each promoted date must update all applicable layers:

```text
canonical stable-asset record
event
event detail
evidence
registry statistics
integrity audit
record-specific review note
```

## PR #59 — Launch-date Batch P

Apply the next four to six category-A dates using the same evidence and validation standard.

## PR #60 — Launch-date Batch Q and unresolved queue freeze

Apply the remaining safe day-level dates and freeze the unresolved set.

For categories B, C, and D, retain `launch_date: null` unless the schema is deliberately extended later. Record the reason and the strongest known date range instead of inserting an artificial first day of a month or year.

Phase completion target:

```text
Missing launch dates: 38 → 25 or fewer where evidence supports it
All remaining null dates: explicitly classified and documented
Critical findings: 0
Warnings: 0
```

The numeric target must not override source quality.

# Phase 2 — Historical terminal-date work

Target window: 2026-06-29 to 2026-07-02

Current queue:

```text
BAC
DSD
ESD
USDN
```

## PR #61 — Historical terminal-date review

For each asset, distinguish:

- depeg start
- protocol or frontend abandonment
- minting stop
- redemption stop
- governance abandonment
- migration or rebrand date
- first confirmed non-operational date
- formal shutdown announcement

A market collapse date must not automatically become `discontinued_date`.

## PR #62 — Resolve or freeze terminal-date unknowns

Apply exact terminal dates only where supported. Otherwise retain `null` and record:

- last confirmed operational date
- first confirmed inactive date
- missing source or unresolved definition
- future source-review target

Phase completion condition:

```text
No unexplained terminal-date gaps
No invented shutdown dates
```

# Phase 3 — Income-profile completion

Target window: 2026-07-03 to 2026-07-12

Current queue: **41 all-unknown income profiles**

The objective is to classify mechanics, not to publish live yield figures or rank assets.

## PR #63 — Fiat-backed income profiles

Prioritize issuer-backed assets such as USDT, USDC, PYUSD, FDUSD, RLUSD, EURC, USDP, USDG, TUSD, and GUSD.

Determine:

- whether the base token has native holder yield
- whether reserve income is retained by the issuer
- whether a separate yield-bearing product exists
- whether yield requires an external platform
- whether the correct classification is `none`, `separate_asset`, or `unknown`

## PR #64 — Protocol stablecoin income profiles

Prioritize DAI, LUSD, crvUSD, GHO, FRAX, RAI, BOLD, alUSD, MIM, and similar protocol assets.

Separate:

- base-asset mechanics
- savings or staking modules
- protocol revenue distribution
- collateral yield
- borrowing and redemption fees
- separate wrappers or receipt tokens

## PR #65 — Synthetic and yield-related profiles

Prioritize USDe, sUSDe, sDAI, sUSDS, USD0, USR, sUSD, SPOT, and NUON.

Do not merge temporary campaign rewards, secondary DeFi yield, and native asset income into one field.

## PR #66 — Historical, commodity, and edge profiles

Cover failed, migrated, commodity-backed, and otherwise non-standard assets.

Phase completion target:

```text
All-unknown income profiles: 41 → 0
```

A profile may still contain unknown fields, but it must at least identify one of:

```text
no native yield
separate yield-bearing derivative
protocol-dependent income
historical-only income
not applicable
source unresolved
```

# Phase 4 — Reserve-report applicability and evidence

Target window: 2026-07-13 to 2026-07-16

Current context coverage: **52 / 70**

This layer is informational and is not expected for every asset.

## PR #67 — Classify reserve-report applicability

Classify the uncovered records as:

```text
report expected but missing
not applicable by design
source status unresolved
```

Required backing structure remains represented by `reserve_components`, which already covers 70 / 70 assets.

## PR #68 — Add missing applicable reserve evidence

Add only real issuer reports, attestations, audit archives, transparency dashboards, protocol collateral disclosures, or relevant historical reserve-intervention records.

Do not create placeholder reserve-report rows merely to reach 70 / 70.

Phase completion conditions:

- applicability is explicit
- applicable missing evidence is reduced as far as primary sources allow
- informational coverage remains visible
- critical findings remain 0
- warnings remain 0

# Phase 5 — Final 70-record quality audit and baseline freeze

Target window: 2026-07-17 to 2026-07-20

## PR #69 — Final 70-record quality audit

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

## PR #70 — Freeze the 70-record quality baseline

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

Target window: 2026-07-21 to 2026-08-10

Default batch size: five canonical assets.

| Planned PR | Target checkpoint | Target window |
|---|---:|---|
| PR #71 | 75 assets | 2026-07-21 to 2026-07-23 |
| PR #72 | 80 assets | 2026-07-24 to 2026-07-26 |
| PR #73 | 85 assets | 2026-07-27 to 2026-07-29 |
| PR #74 | 90 assets | 2026-07-30 to 2026-08-02 |
| PR #75 | 95 assets | 2026-08-03 to 2026-08-06 |
| PR #76 | 100 assets | 2026-08-07 to 2026-08-10 |

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
```

Indicative growth targets:

```text
2026-08-10: 100 canonical assets
2026-09-30: 120–130 canonical assets
2026-12-31: 160–200 canonical assets
```

These are planning targets, not permission to weaken inclusion or evidence standards.

# Validation and merge rules

Every PR in this roadmap must:

- start from the latest confirmed `main`
- keep candidates, canonical data, loaders, validators, baselines, generated output, and documentation synchronized
- run the normal CI suite
- preserve existing IDs, slugs, and public routes unless a dedicated migration approves a change
- avoid fabricated day-level dates, yield values, reserve claims, or current status claims
- remove one-off generation workflows and temporary files before merge
- update this roadmap when the current position or planned sequence changes

After merge, report:

```text
1. full schedule
2. current position
3. merged PR and merge SHA
4. exact data and coverage changes
5. CI result
6. remaining queues
7. next PR
```

# Immediate next work

```text
Current: PR #56 — roadmap anchoring
Next:    PR #57 — audit and classify the remaining 38 launch-date gaps
Then:    PR #58 — Launch-date Batch O
```
