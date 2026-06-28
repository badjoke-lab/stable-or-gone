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

The v2 contract controls visual composition and page implementation. The v1 mock package is historical. Reordering or combining work requires this file and `docs/roadmap.md` to change together.

## 2. Current position

```text
Latest merged UI-program PR: #208
Latest merged main: 26c2686549befe9653ce30888ec2394fcfb52e59
Gate V2-A: passed
Gate V2-B: passed
Current phase: V2-2 approved registry pages
Active work: PR #209 Home
Next approved work: PR #210 Stablecoins index
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

Status: merged. Gate V2-A passed.

Completed:

- eight approved desktop page references;
- four approved S/G logo references;
- canonical v2 visual contract;
- replacement PR sequence;
- roadmap and AGENTS authority updates;
- mock-only exclusion policy;
- no application-code or canonical-data change.

### PR #208 — Shared visual foundation

Status: merged. Gate V2-B passed.

Completed:

- local dark/light S/G lockup and monogram assets;
- approved branding in header, footer, and favicon;
- v2 dark-navy, bright-blue, teal, coral, text, border, and semantic tokens;
- shared panel, button, field, chip, badge, hero, metric-card, and banner primitives;
- shared `BrandLockup`, `TickerBadge`, `OrganizationBadge`, `PageHero`, `MetricCard`, and `SupportBanner` components;
- preserved grouped navigation, compact navigation, focus return, reduced motion, forced colors, long-value wrapping, and 44px controls;
- v2 foundation validator in full and site builds;
- no route, canonical-count, or production-deployment change.

## 6. Active registry page work

### PR #209 — Approved Home

Reference: `docs/ui-redesign/approved-mocks-v2/01-home.webp`.

Work:

- replace the legacy Home layout with the approved v2 hero and hierarchy;
- add a static client-side search index covering stablecoins, organizations, and events;
- preserve a non-JavaScript fallback to the Stablecoins search route;
- show dynamic canonical counts for stablecoins, organizations, events, and source identities;
- add the four primary registry entry cards;
- show the three real dated guides already selected by the editorial rule;
- replace raw-array selection with the explicit ordered slug set `usdt`, `usdc`, `dai`, `ust`, `busd`, `frax`, `tusd`, `fdusd`, `pyusd`, and `usdd`;
- show selected records as a desktop table and equivalent compact cards;
- use shared v2 components and the approved support banner;
- add a Home-specific validator to full and site builds.

Non-scope:

- no live prices or market data;
- no market capitalization, supply, holder, or transfer metrics;
- no saved views, watchlists, accounts, follows, or recently viewed history;
- no new canonical records;
- no route or count changes;
- no production publication.

Completion:

```text
Approved Home hierarchy is implemented
Search covers all three record families
Canonical counts remain dynamic
Primary registry and guide destinations are real
Selected records use explicit slug order
Desktop and compact views preserve the same selected-record fields
Search announcements and Escape behavior work
Mock-only features are absent
Home validator and all repository checks pass
Canonical routes and counts remain unchanged
```

Gate V2-C does not pass at PR #209; it requires PRs #209 through #213.

### PR #210 — Stablecoins index

Reference: `docs/ui-redesign/approved-mocks-v2/02-stablecoin-index.webp`.

Implement approved search and filters, URL state, canonical count cards, dense desktop rows, compact record data, ticker badges, lifecycle, issuance, reference target, model, organization, reviewed/change context, and real export access.

Exclude saved views, accounts, watchlists, recent-history features, mock-only comparison tray, and market-data filters.

### PR #211 — Stablecoin detail

Reference: `docs/ui-redesign/approved-mocks-v2/03-stablecoin-detail.webp`.

Implement the record hero, current-state axes, profile summary, organizations and control, reserve/redemption/backing context, deployments, event history, evidence, known unknowns, secondary guides, and all value states.

Exclude synthetic safety, transparency, or overall-assessment scores.

### PR #212 — Organizations index and detail

References:

```text
docs/ui-redesign/approved-mocks-v2/04-organization-index.webp
docs/ui-redesign/approved-mocks-v2/05-organization-detail.webp
```

Implement approved search and filters, organization rows/cards, identity, category, legal form, jurisdiction, functional roles, connected assets/events, current and historical relationships, evidence, source-backed legal context, known unknowns, and guides.

Use organization initials unless a reviewed local official asset exists.

### PR #213 — Events index and detail

References:

```text
docs/ui-redesign/approved-mocks-v2/06-event-index.webp
docs/ui-redesign/approved-mocks-v2/07-event-detail.webp
```

Implement event search and filters, public category/subtype, date, lifecycle impact, affected records, related organizations, typed details, supported timelines, evidence, known unknowns, and guides.

Do not copy sample mock prose into canonical records.

Gate V2-C passes only when PRs #209–#213 merge and protected registry pages satisfy their field contracts.

## 7. Editorial and project pages

### PR #214 — Methodology and editorial family

Reference: `docs/ui-redesign/approved-mocks-v2/08-methodology.webp`.

Apply the editorial shell to Methodology, Guides, Glossary, Models, Updates, About, Corrections, Contact, Support, and data-access entrypoints. Methodology must match actual taxonomy, value states, evidence policy, review process, and public files.

Gate V2-D passes when PR #214 merges.

## 8. Mobile and accessibility

### PR #215 — Mobile, accessibility, and interaction hardening

Produce implementation-derived mobile screenshots and verify controlled navigation, page-specific protected-table transformations, active filters, section navigation, evidence, known unknowns, long values, widths from 320px upward, 200% zoom, keyboard operation, labels, announcements, reduced motion, forced colors, and non-color state communication.

Gate V2-E passes after desktop and mobile review.

## 9. Full audit and release candidate

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

## 10. Deliberate publication

### PR #217 or publication report

After Gate V2-G, publish the exact approved candidate through the manual production workflow, verify the deployed commit, counts, route families, desktop/mobile smoke tests, and machine-readable parity, then commit the publication report.

Gate V2-H passes only after production parity verification.

## 11. Asset, data, growth, and publication policy

Reference images specify composition and hierarchy, not public facts. Use canonical records, approved editorial copy, local reviewed assets, ticker badges, and organization-initial badges. Do not use generated imitation logos, unreviewed hotlinks, invented current values, or account-like features without a separate approved specification.

Routine record growth remains paused at 92 until Gate V2-F. The final-eight path to 100 requires a deliberate roadmap decision after the repaired 92-record audit.

```text
Automatic production deployment: disabled
Normal implementation PR deployment: none
Emergency publication: deployment policy only
UI v2 publication: one deliberate checkpoint after Gate V2-G
Production branch: main
```

## 12. Change control

A design or schedule change must update these files together:

```text
docs/architecture/approved-modern-data-product-ui-v2.md
docs/ui-redesign/implementation-plan.md
docs/roadmap.md
```
