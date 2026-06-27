# Stable or Gone UI implementation plan v2

Status: canonical implementation schedule  
Updated: 2026-06-27  
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

The v2 contract controls visual composition and page implementation. The v1 mock package is historical.

The PR order below is binding. Reordering or combining work requires this file and `docs/roadmap.md` to change in the same reviewed PR.

## 2. Current position

```text
Latest merged UI-program PR: #207
Latest merged main: 3df568eab0a179d7690a88efb599156b0d659ab7
Gate V2-A: passed
Current phase: V2-1 shared visual foundation
Active work: PR #208
Next approved work: PR #209 Home
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
4. Preserve canonical counts unless a separate audited data migration approves a change.
5. Use canonical data or approved editorial copy only.
6. Remove mock-only values and features.
7. Use the approved S/G brand assets.
8. Preserve evidence, evidence relations, known unknowns, deployments, and multiple organization roles.
9. Run all existing checks plus new checks introduced by the PR.
10. Update `docs/roadmap.md` when the current position changes.
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

## 5. Completed reset

### PR #207 — Approved v2 contract and schedule

Status: merged. Gate V2-A passed.

Completed:

- eight approved desktop page references;
- four S/G logo references;
- canonical v2 visual contract;
- replacement PR sequence;
- roadmap and AGENTS authority updates;
- mock-only exclusion policy;
- no application-code or canonical-data changes.

## 6. Active foundation work

### PR #208 — Shared visual foundation and approved brand assets

References:

```text
docs/architecture/approved-modern-data-product-ui-v2.md
docs/ui-redesign/approved-mocks-v2/README.md
```

Work:

- create local SVG lockup and monogram assets from the approved S/G references;
- use the lockup in header and footer and the monogram as favicon;
- define the dark-navy, bright-blue, teal, coral, text, border, and semantic tokens;
- add shared panel, button, form-field, chip, table, badge, hero, metric-card, and banner primitives;
- add shared `BrandLockup`, `TickerBadge`, `OrganizationBadge`, `PageHero`, `MetricCard`, and `SupportBanner` components;
- preserve grouped navigation, compact navigation, focus return, reduced motion, forced colors, long-value wrapping, and 44px controls;
- align legacy shared surfaces to v2 tokens without completing page-specific redesigns;
- add a v2 foundation validator to full and site builds.

Not included:

- Home or registry page redesign;
- official coin-logo collection;
- external logo hotlinks;
- new canonical records;
- route or count changes;
- production publication.

Completion:

```text
Approved S/G assets exist locally
Header, footer, and favicon use approved branding
Shared tokens and components exist
V2 validator passes in full and site builds
Accessibility foundations remain valid
Canonical routes and counts are unchanged
All required repository checks pass
```

Gate V2-B passes when PR #208 merges.

## 7. Registry page implementation

### PR #209 — Home

Reference: `01-home.webp`

Implement the approved hero, truthful search, four canonical counts, registry entry cards, real guide cards, deterministic selected records, support banner, and footer composition.

Do not add live market data, invented deltas, unsupported metrics, or array-order selection.

### PR #210 — Stablecoins index

Reference: `02-stablecoin-index.webp`

Implement approved search and filters, URL state, canonical count cards, dense desktop rows, compact mobile-ready record data, ticker badges, lifecycle, issuance, reference target, model, organization, and real export access.

Do not add saved views, accounts, watchlists, recent-history features, or market-data filters.

### PR #211 — Stablecoin detail

Reference: `03-stablecoin-detail.webp`

Implement the record hero, current-state axes, profile summary, organizations and control, reserve/redemption/backing context, deployments, event history, evidence, known unknowns, secondary guides, and all value states.

Do not generate safety, transparency, or overall-assessment scores.

### PR #212 — Organizations index and detail

References: `04-organization-index.webp`, `05-organization-detail.webp`

Implement approved search and filters, organization rows/cards, identity, category, legal form, jurisdiction, functional roles, connected assets/events, current and historical relationships, evidence, source-backed legal context, known unknowns, and guides.

Use organization initials unless a reviewed local official asset exists.

### PR #213 — Events index and detail

References: `06-event-index.webp`, `07-event-detail.webp`

Implement event search and filters, public category/subtype, date, lifecycle impact, affected records, related organizations, typed details, supported timelines, evidence, known unknowns, and guides.

Do not copy sample mock prose into canonical records.

Gate V2-C passes when PRs #209–#213 merge and protected registry pages satisfy their field contracts.

## 8. Editorial and project pages

### PR #214 — Methodology and editorial family

Reference: `08-methodology.webp`

Apply the editorial shell to Methodology, Guides, Glossary, Models, Updates, About, Corrections, Contact, Support, and data-access entrypoints. Methodology must match actual taxonomy, value states, evidence policy, review process, and public files.

Gate V2-D passes when PR #214 merges.

## 9. Mobile and accessibility

### PR #215 — Mobile, accessibility, and interaction hardening

Produce implementation-derived mobile screenshots and verify controlled navigation, protected-table transformations, active filters, section navigation, evidence, known unknowns, long values, widths from 320px upward, 200% zoom, keyboard operation, labels, announcements, reduced motion, forced colors, and non-color state communication.

Gate V2-E passes after desktop and mobile review.

## 10. Full audit and release candidate

### PR #216 — 92-record and all-route audit

Audit every stablecoin, organization, event, and public route for identity, taxonomy, relationships, reserves, deployments, events, evidence, known unknowns, value states, desktop/mobile layout, metadata, and machine-readable parity.

Required artifacts:

- eight approved desktop reference comparisons;
- core mobile screenshots;
- before/after report;
- 92-record audit matrix;
- organization and event route audit;
- build and output diagnostics.

Gate V2-F passes when the audit is complete. Gate V2-G passes only after explicit owner approval of one immutable candidate commit.

## 11. Deliberate publication

### PR #217 or publication report

After Gate V2-G, publish the exact approved candidate through the manual production workflow, verify the deployed commit, counts, route families, desktop/mobile smoke tests, and machine-readable parity, then commit the publication report.

Gate V2-H passes only after production parity verification.

## 12. Asset and data policy

Reference images specify composition and hierarchy, not public facts.

Use canonical records, approved editorial copy, local reviewed assets, ticker badges, and organization-initial badges. Do not use generated imitation logos, unreviewed hotlinks, invented current values, or account-like features without a separate approved specification.

## 13. Growth and publication policy

Routine record growth remains paused at 92 until Gate V2-F. The final-eight path to 100 requires a deliberate roadmap decision after the repaired 92-record audit.

```text
Automatic production deployment: disabled
Normal implementation PR deployment: none
Emergency publication: deployment policy only
UI v2 publication: one deliberate checkpoint after Gate V2-G
Production branch: main
```

## 14. Change control

A design or schedule change must update these files together:

```text
docs/architecture/approved-modern-data-product-ui-v2.md
docs/ui-redesign/implementation-plan.md
docs/roadmap.md
```
