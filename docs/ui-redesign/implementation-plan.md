# Stable or Gone UI implementation plan v2

Status: canonical implementation schedule  
Updated: 2026-06-28  
Registry checkpoint: 92 canonical stable assets  
Visual direction: Modern Data Product

## 1. Authority

Every UI pull request must read and cite:

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

The v2 contract controls visual composition and page implementation. The v1 mock package is historical. Reordering or combining work requires this file and `docs/roadmap.md` to change together.

## 2. Current position

```text
Latest merged UI-program PR: #209
Latest merged main: 4e07907cf1e796882382e964c2e7852cfed21c07
Gate V2-A: passed
Gate V2-B: passed
Current phase: V2-2 approved registry pages
Active work: PR #210 Stablecoins index
Next approved work: PR #211 Stablecoin detail
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
3. Cite the numbered PR item below.
4. Preserve canonical counts unless a separate audited migration approves a change.
5. Use canonical data or approved editorial copy only.
6. Remove mock-only values and unsupported features.
7. Use the approved S/G brand assets.
8. Preserve evidence, evidence relations, known unknowns, deployments, and multiple organization roles.
9. Run all existing checks plus new checks introduced by the PR.
10. Update `docs/roadmap.md` when current position changes.
11. Do not publish production during normal implementation PRs.

## 4. Gates

```text
V2-A  design contract, reference assets, and schedule merged
V2-B  shared visual foundation complete
V2-C  approved registry page families complete
V2-D  editorial and project pages aligned
V2-E  mobile and accessibility hardening complete
V2-F  92-record and all-route audit complete
V2-G  one immutable candidate approved by the owner
V2-H  deliberate production publication verified
```

## 5. Completed work

### PR #207 — Approved v2 contract and schedule

Merged. Gate V2-A passed.

### PR #208 — Shared visual foundation

Merged. Gate V2-B passed.

### PR #209 — Approved Home

Merged at `4e07907cf1e796882382e964c2e7852cfed21c07`.

Completed:

- approved v2 Home hierarchy;
- static search across stablecoins, organizations, and events;
- dynamic canonical metrics;
- real registry and guide entry cards;
- explicit slug-ordered selected records;
- desktop table and equivalent compact cards;
- Home validator in full and site builds;
- all 18 pull-request checks passed;
- no canonical-count, route, or deployment change.

## 6. Active registry page work

### PR #210 — Approved Stablecoins index

Reference: `docs/ui-redesign/approved-mocks-v2/02-stablecoin-index.webp`.

Work:

- replace the legacy index composition with the approved v2 `PageHero` and metric-card hierarchy;
- retain dynamic canonical counts for records, active lifecycle records, connected organizations, and source identities;
- preserve search across names, symbols, aliases, domains, and organizations;
- preserve URL-synchronized state and back/forward navigation;
- preserve the six approved taxonomy filter groups: lifecycle, issuance, asset class, reference, backing, and stabilization;
- preserve six sort modes;
- preserve nine protected desktop columns;
- add ticker badges to desktop rows and compact cards;
- add last-reviewed, event, evidence, and known-unknown context without inventing values;
- preserve compact record cards with all protected fields;
- retain the existing bounded two-to-four-record comparison as a secondary historical context tool, not a ranking or mock-style account tray;
- add a v2 Stablecoins-index validator to full and site builds;
- make `AGENTS.md` defer current-work authority to the roadmap and implementation plan.

Non-scope:

- no live price or market data;
- no market capitalization, supply, holder, or transfer metrics;
- no saved views, accounts, watchlists, follows, or recent-history features;
- no new export unless a verified public export already exists;
- no new canonical records;
- no route or count changes;
- no production publication.

Completion:

```text
Approved Stablecoins index hierarchy is implemented
Canonical metric cards are dynamic
Six taxonomy filters and six sort modes remain functional
URL synchronization and browser history remain functional
Nine protected desktop columns remain present
Ticker badges and review context are visible
Compact cards preserve protected information
Comparison remains bounded and explicitly non-ranking
Mock-only features are absent
V2 Stablecoins validator and all repository checks pass
Canonical routes and counts remain unchanged
```

Gate V2-C does not pass at PR #210; it requires PRs #209 through #213.

### PR #211 — Stablecoin detail

Reference: `docs/ui-redesign/approved-mocks-v2/03-stablecoin-detail.webp`.

Implement the record hero, current-state axes, profile summary, organizations and control, reserve/redemption/backing context, deployments, event history, evidence, known unknowns, secondary guides, and all value states. Exclude synthetic safety, transparency, or overall-assessment scores.

### PR #212 — Organizations index and detail

References:

```text
docs/ui-redesign/approved-mocks-v2/04-organization-index.webp
docs/ui-redesign/approved-mocks-v2/05-organization-detail.webp
```

Implement approved search and filters, organization rows/cards, identity, category, legal form, jurisdiction, functional roles, connected assets/events, current and historical relationships, evidence, source-backed legal context, known unknowns, and guides. Use initials unless a reviewed local official asset exists.

### PR #213 — Events index and detail

References:

```text
docs/ui-redesign/approved-mocks-v2/06-event-index.webp
docs/ui-redesign/approved-mocks-v2/07-event-detail.webp
```

Implement event search and filters, public category/subtype, date, lifecycle impact, affected records, related organizations, typed details, supported timelines, evidence, known unknowns, and guides. Do not copy sample mock prose into canonical records.

Gate V2-C passes only when PRs #209–#213 merge and protected registry pages satisfy their field contracts.

## 7. Remaining phases

### PR #214 — Methodology and editorial family

Reference: `docs/ui-redesign/approved-mocks-v2/08-methodology.webp`. Gate V2-D passes when this family is aligned.

### PR #215 — Mobile, accessibility, and interaction hardening

Produce implementation-derived screenshots and verify 320px upward, 200% zoom, keyboard operation, labels, announcements, reduced motion, forced colors, protected information, and page-specific compact transformations. Gate V2-E requires review.

### PR #216 — 92-record and all-route audit

Audit every stablecoin, organization, event, and route. Produce eight approved desktop comparisons, core mobile screenshots, a before/after report, the 92-record matrix, organization/event route audits, and build/output diagnostics. Gate V2-F passes after audit; Gate V2-G requires explicit owner approval of one immutable candidate.

### PR #217 or publication report

After Gate V2-G, publish the exact candidate through the manual workflow and verify deployed commit, counts, routes, desktop/mobile smoke tests, and machine-readable parity. Gate V2-H passes only after production verification.

## 8. Asset, data, growth, and publication policy

Reference images specify composition and hierarchy, not public facts. Use canonical records, approved editorial copy, local reviewed assets, ticker badges, and organization-initial badges. Do not use generated imitation logos, unreviewed hotlinks, invented current values, or account-like features without a separate approved specification.

Routine record growth remains paused at 92 until Gate V2-F. The final-eight path to 100 requires a deliberate roadmap decision after the repaired 92-record audit.

```text
Automatic production deployment: disabled
Normal implementation PR deployment: none
Emergency publication: deployment policy only
UI v2 publication: one deliberate checkpoint after Gate V2-G
Production branch: main
```

## 9. Change control

A design or schedule change must update these files together:

```text
docs/architecture/approved-modern-data-product-ui-v2.md
docs/ui-redesign/implementation-plan.md
docs/roadmap.md
```
