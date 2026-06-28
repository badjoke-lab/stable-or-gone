# Stable or Gone UI implementation plan v2

Status: canonical implementation schedule — paused  
Updated: 2026-06-28  
Registry checkpoint: 92 canonical stable assets  
Visual direction: Modern Data Product

## Authority

Every UI pull request must follow `AGENTS.md`, `docs/spec-governance.md`, `docs/deployment-policy.md`, `docs/ui-redesign/master-spec.md`, `docs/architecture/approved-modern-data-product-ui-v2.md`, this plan, `docs/roadmap.md`, and `docs/public-taxonomy-spec.md`.

Reference images control hierarchy, not public facts. Canonical data, reviewed editorial copy, and reviewed local assets are the only allowed public inputs.

## Current position

```text
Completed through: PR #216
UI status: intermediate repository state
Detailed owner visual review: deferred
Gate V2-F: not passed
Release candidate: not selected
Production publication: not authorized
Active repository workstream: docs/quality/non-ui-quality-program.md
```

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
PR #216  owner-review visual mark correction
```

Gate V2-A through Gate V2-E passed. These changes preserved canonical record counts and did not publish production.

## Pause rule

The UI program is not abandoned or completed. It is paused because careful page-by-page owner review is not currently practical. No agent may:

- mark Gate V2-F as passed;
- select a release candidate;
- publish the current UI;
- perform broad visual redesign work without renewed owner review;
- use non-UI work to hide or relabel unresolved UI defects.

Small emergency fixes remain governed by `docs/deployment-policy.md`.

## Deferred all-route audit

When detailed visual review resumes, `docs/roadmap.md` must assign a new PR number. The audit must cover:

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

Gate V2-F passes only when this audit is complete. Gate V2-G requires explicit owner approval of one exact immutable candidate.

## Publication

A later roadmap amendment must define the publication checkpoint after Gate V2-G. Gate V2-H passes only after deployed commit, counts, routes, desktop/mobile smoke tests, and machine-readable parity are verified.

## Prohibited mock-only features

Live prices, market capitalization, supply or holder metrics, market charts, saved views, watchlists, accounts, recent-history features, unsupported verification, synthetic scores, invented reserve totals, invented evidence counts, invented relative timestamps, and unsupported licensing claims remain prohibited without a separate approved specification and source.

## Growth and deployment

Routine record growth remains paused until the active non-UI quality plan and roadmap permit it. Automatic production deployment remains disabled. Normal implementation PRs require no production deployment.
