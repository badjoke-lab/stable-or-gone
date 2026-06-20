# SOG 70-Record Quality Baseline

Recorded: 2026-06-20

## Purpose

This document records the final repository-quality baseline for the 70-record SOG registry before controlled growth resumes.

Machine-readable source of truth:

```text
docs/migration/registry-v3-baseline.json
```

Validator:

```text
scripts/validate-registry-v3-baseline.mjs
npm run validate:v3-baseline
```

## Canonical counts

| Layer | Count |
|---|---:|
| Stable assets | 70 |
| Organizations | 59 |
| Stablecoin-organization relationships | 72 |
| Classifications | 70 |
| Reserve/redemption profiles | 70 |
| Events | 97 |
| Event v2 details | 97 |
| Evidence | 286 |
| Reserve-report or reserve-context rows | 77 |
| Known unknowns | 153 |
| Regulatory notes | 9 |
| Deployments | 101 |
| Legal profiles | 70 |
| Stable-asset relationships | 4 |
| Reserve components | 102 |
| Income profiles | 70 |

## Coverage baseline

| Layer | Covered assets | Expectation |
|---|---:|---|
| Classifications | 70 / 70 | required |
| Profiles | 70 / 70 | required |
| Relationships | 70 / 70 | required |
| Evidence | 70 / 70 | required |
| Known unknowns | 70 / 70 | required |
| Legal profiles | 70 / 70 | required |
| Reserve components | 70 / 70 | required |
| Income profiles | 70 / 70 | required |
| Deployments | 70 / 70 | optional review, complete at baseline |
| Events | 70 / 70 | optional review, complete at baseline |
| Reserve-report context | 57 / 70 | informational |

Reserve-report context is intentionally not forced to 70/70. Ten records are not applicable by design and three records remain reviewed unresolved source-status items.

## Integrity result

```text
Promoted candidates:             70 / 70
Pending candidates:               0
Critical findings:                0
Warnings:                         0
Canonical name collisions:        0
Alias collision warnings:         0
Stale verification records:       0
All-unknown income profiles:       0
Placeholder reserve rows:         0
```

## Explicit unresolved queues

### Launch date

```text
Total: 31
Category B — partial date only: 5
Category C — boundary, version, or lineage conflict: 23
Category D — adequate primary source absent: 3
```

Source:

```text
data/quality/launch-date-unresolved.json
```

### Terminal date

```text
Total: 6
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

### Reserve-report applicability

```text
Total queue: 13
Not applicable by design: 10
Reviewed source status unresolved: 3
Expected but missing: 0
```

The three reviewed unresolved items are FEI, HUSD, and EURT.

Source:

```text
data/quality/reserve-report-applicability.json
docs/audits/reserve-source-status-review.md
```

## Baseline rules

The baseline validator requires exact agreement among:

- generated registry statistics
- generated integrity audit
- canonical count expectations
- layer coverage expectations
- launch-date queue
- terminal-date queue
- reserve-report applicability queue

Any intentional record growth or quality resolution must update the affected canonical data, generated outputs, queue, and baseline in the same reviewed PR.

The baseline does not require unknown values to be replaced with guesses. Explicit unresolved states are valid when they are machine-readable, evidence-bounded, and validator-enforced.

## Growth boundary

Phase 5 is complete when this baseline and validator pass all repository workflows.

After completion:

- controlled growth from 70 to 75 may begin
- each promoted asset must satisfy all required layers
- the 75-record checkpoint requires full production parity before any 75-to-80 work
- production parity remains deferred while Cloudflare operator access is unavailable

## Deployment classification

No production deployment is required for this baseline. Cloudflare access is not used.
