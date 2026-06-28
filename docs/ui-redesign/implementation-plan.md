# Stable or Gone UI implementation plan v2

Status: canonical implementation schedule  
Updated: 2026-06-28  
Registry checkpoint: 92 canonical stable assets  
Visual direction: Modern Data Product

## 1. Authority

Every UI pull request must cite:

```text
AGENTS.md
docs/spec-governance.md
docs/deployment-policy.md
docs/ui-redesign/master-spec.md
docs/architecture/approved-modern-data-product-ui-v2.md
docs/ui-redesign/implementation-plan.md
docs/roadmap.md
docs/public-taxonomy-spec.md
```

The v2 contract controls composition and page implementation. Reference images specify hierarchy, not public facts. Canonical data, reviewed editorial copy, and local approved assets are the only allowed public inputs.

## 2. Current position

```text
Completed through: PR #215
Current phase: V2-5 full audit and release candidate
Next approved work: PR #216 all-route audit
Stable assets: 92
Organizations: 86
Relationships: 101
Events: 150
Evidence: 455
Source identities: 410
Routine record growth: paused
Production publication: deferred until owner-approved release candidate
```

## 3. Rules for every implementation PR

1. Start from the latest confirmed `main`.
2. Cite the exact v2 page or component contract.
3. Preserve canonical counts unless a separate audited migration approves a change.
4. Use canonical data or approved editorial copy only.
5. Remove mock-only values and unsupported features.
6. Use the approved S/G brand assets.
7. Preserve evidence, evidence relations, known unknowns, deployments, and multiple organization roles.
8. Preserve protected desktop information in compact layouts.
9. Run all existing checks plus the PR-specific validator.
10. Do not publish production during normal implementation PRs.

## 4. Completed implementation

### PR #207 — Contract and schedule

Gate V2-A passed.

### PR #208 — Shared visual foundation

Gate V2-B passed.

### PR #209 — Home

Approved v2 Home, cross-registry search, canonical metrics, deterministic selected records, and Home validation.

### PR #210 — Stablecoins index

Approved hierarchy, six filters, six sorts, URL/history state, protected table, compact cards, ticker badges, and bounded comparison.

### PR #211 — Stablecoin detail

Approved record hero, six metrics, eight-section dossier order, organizations/control, mechanics, reserves, deployments/legal context, history, evidence, known unknowns, compact representations, and correction paths.

### PR #212 — Organizations index and detail

Approved index/detail hierarchy, five filters, five sorts, deterministic initials, taxonomy, jurisdiction, roles, all current/historical relationships, evidence, events, known unknowns, and compact representations.

### PR #213 — Events index and detail

Approved index/detail hierarchy, five filters, four sorts, taxonomy, subjects, structured details, recovery/status effect, evidence relations, value states, and compact representations. Gate V2-C passed.

### PR #214 — Editorial and project family

Guides, Glossary, Models, Methodology, Updates, About, Contact/Corrections, and Support aligned through the shared route-aware editorial layer. Gate V2-D passed.

### PR #215 — Mobile and accessibility hardening

320px-class compact layout, 200% zoom resilience, keyboard focus, 44px targets, long-content wrapping, protected table reachability, compact transformations, reduced motion, forced colors, and print behavior hardened. Gate V2-E passed.

## 5. Visual review checkpoint

After PR #215, the owner performs visual review of the implemented page families. The review may identify corrections to be included before or during PR #216. It does not authorize production publication.

## 6. PR #216 — 92-record and all-route audit

Required work:

```text
all 92 stablecoin routes
all 86 organization routes
all 150 event routes
all editorial/project routes
all machine-readable endpoints
eight approved desktop family comparisons
representative compact/mobile states
320px width
200% zoom
keyboard-only operation
focus and announcements
reduced motion
forced colors
protected information parity
canonical counts and route/output parity
before/after and exception report
```

Gate V2-F passes only when the audit is complete. One exact immutable candidate must then receive explicit owner approval for Gate V2-G.

## 7. Publication

After Gate V2-G, PR #217 or a publication report may publish the exact candidate through the manual production workflow. Gate V2-H passes only after deployed commit, counts, routes, desktop/mobile smoke tests, and machine-readable parity are verified.

## 8. Prohibited mock-only features

```text
live price
market capitalization
circulating supply
holder or transfer counts
market charts
saved views
watchlists
follow buttons
user accounts
recently viewed history
notifications
unsupported verified badges
transparency or safety scores
invented reserve totals
invented evidence counts
invented relative timestamps
unsupported licensing claims
```

Any later proposal requires its own data source, specification, operating-cost review, and schedule amendment.

## 9. Growth and publication policy

Routine record growth remains paused at 92 until Gate V2-F. Automatic production deployment remains disabled. Normal implementation PRs require no production deployment.
