# Stable or Gone UI implementation plan v2

Status: canonical implementation schedule  
Updated: 2026-06-28  
Registry checkpoint: 92 canonical stable assets  
Visual direction: Modern Data Product

## Authority

Every UI pull request must follow `AGENTS.md`, `docs/spec-governance.md`, `docs/deployment-policy.md`, `docs/ui-redesign/master-spec.md`, `docs/architecture/approved-modern-data-product-ui-v2.md`, this plan, `docs/roadmap.md`, and `docs/public-taxonomy-spec.md`.

Reference images control hierarchy, not public facts. Canonical data, reviewed editorial copy, and reviewed local assets are the only allowed public inputs.

## Current position

```text
Completed through: PR #215
Active work: PR #216 visual mark correction
Next approved work: PR #217 all-route audit
Stable assets: 92
Organizations: 86
Relationships: 101
Events: 150
Evidence: 455
Source identities: 410
Routine record growth: paused
Production publication: deferred
```

## Rules for every implementation PR

1. Start from the latest confirmed `main`.
2. Preserve canonical counts unless an audited migration approves a change.
3. Use canonical data or approved editorial copy only.
4. Preserve evidence, evidence relations, known unknowns, deployments, and multiple organization roles.
5. Preserve protected desktop information in compact layouts.
6. Run all existing checks and the relevant shared validator.
7. Do not publish production during normal implementation work.

## Completed implementation

```text
PR #207  contract, references, schedule, and governance
PR #208  shared visual foundation and S/G brand system
PR #209  Home
PR #210  Stablecoins index
PR #211  Stablecoin detail
PR #212  Organizations index and detail
PR #213  Events index and detail
PR #214  Methodology and editorial/project family
PR #215  mobile, accessibility, interaction, and compact-layout hardening
```

Gate V2-A through Gate V2-E passed. These changes preserved canonical record counts and did not publish production.

## PR #216 — Visual mark correction

Owner review found excessive circular letter marks outside stablecoin identity.

Required work:

```text
preserve stablecoin ticker marks as the no-logo fallback
preserve reviewed local official-logo requirements
remove metric-card letter marks from presentation
remove Home destination letter marks from presentation
stop rendering organization initials and ORG hero marks
stop rendering event EVT and year hero marks
stop rendering Stablecoins-index hero letters
preserve the non-letter Home hero illustration
collapse unused hero visual columns
change circular filter counts to rounded rectangles
extend existing mobile/accessibility validation
preserve data, routes, filters, sorts, counts, and production state
```

PR #216 does not pass Gate V2-F.

## PR #217 — 92-record and all-route audit

Required coverage:

```text
all 92 stablecoin routes
all 86 organization routes
all 150 event routes
all editorial and project routes
all machine-readable endpoints
eight approved desktop family comparisons
representative compact and mobile states
320px width
200 percent zoom
keyboard-only operation
focus and announcements
reduced motion
forced colors
protected information parity
canonical counts and route/output parity
before/after and exception report
```

Gate V2-F passes only when the audit is complete. Gate V2-G requires explicit owner approval of one exact immutable candidate.

## Publication

After Gate V2-G, PR #218 or a publication report may publish the exact candidate through the manual production workflow. Gate V2-H passes only after deployed commit, counts, routes, desktop/mobile smoke tests, and machine-readable parity are verified.

## Prohibited mock-only features

Live prices, market capitalization, supply or holder metrics, market charts, saved views, watchlists, accounts, recent-history features, unsupported verification, synthetic scores, invented reserve totals, invented evidence counts, invented relative timestamps, and unsupported licensing claims remain prohibited without a separate approved specification and source.

## Growth and publication policy

Routine record growth remains paused at 92 until Gate V2-F. Automatic production deployment remains disabled. Normal implementation PRs require no production deployment.
