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
Latest merged UI-program PR: #210
Latest merged main: ce3664f4ffa34d0df60b4182b8be821bc13f2945
Gate V2-A: passed
Gate V2-B: passed
Current phase: V2-2 approved registry pages
Active work: PR #211 Stablecoin detail
Next approved work: PR #212 Organizations index and detail
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

Merged at `4e07907cf1e796882382e964c2e7852cfed21c07` after all 18 checks passed.

### PR #210 — Approved Stablecoins index

Merged at `ce3664f4ffa34d0df60b4182b8be821bc13f2945` after all 18 checks passed.

Completed:

- approved v2 index hierarchy and metric cards;
- six reviewed taxonomy filters and six sort modes;
- URL and browser-history state;
- nine protected desktop headers;
- ticker badges, reviewed context, compact cards, and bounded comparison;
- Stablecoins-index validator in full and site builds;
- no canonical-count, route, or deployment change.

## 6. Active registry page work

### PR #211 — Approved Stablecoin detail

Reference: `docs/ui-redesign/approved-mocks-v2/03-stablecoin-detail.webp`.

Work:

- replace the legacy detail hero with the approved v2 record hero;
- show ticker badge, lifecycle, issuance, canonical ID, and registry return action;
- add six current-state metric cards for lifecycle, reference target, backing model, issuance, primary organization, and last reviewed;
- preserve the approved eight-section dossier contract and local navigation;
- preserve the identity table and equivalent compact cards;
- preserve all current, ended, and unknown-state organization relationships, roles, governance, display selection, and control capability context;
- replace stale placeholder copy with the completed mechanics section;
- preserve reference, backing, stabilization, exit, valuation, yield, and classification fields;
- preserve reserve components, reserve profile, redemption profile, reserve history, deployments, regulatory notices, model history, issuer-control events, event timeline, evidence, known unknowns, and record coverage;
- split value-state rendering into `reserves`, `legal`, and `unknowns` modes so DOM order follows the dossier contract;
- preserve all deployment, evidence, mobile, and value-state axes;
- add registry, organization, event, guide, Methodology, Corrections, and data-manifest destinations;
- add a v2 Stablecoin-detail validator to full and site builds;
- remove the last hardcoded current-step statement from `AGENTS.md`.

Non-scope:

- no live price or market data;
- no market capitalization, supply, holder, or transfer metrics;
- no synthetic safety, transparency, or overall-assessment fields;
- no saved views, accounts, watchlists, follows, or recent-history features;
- no new canonical records;
- no route or count changes;
- no production publication.

Completion:

```text
Approved detail hero and six current-state cards are implemented
All eight dossier sections remain present and ordered
Identity, organization, mechanics, deployment, history, evidence, unknown, and further-reading fields remain reachable
Compact identity and organization representations remain available
Reserve, legal, and unknown sections render in approved order
Stale implementation placeholder text is absent
Synthetic scores and mock-only fields are absent
V2 Stablecoin-detail validator and all repository checks pass
All 92 detail routes and canonical counts remain unchanged
```

Gate V2-C does not pass at PR #211; it requires PRs #209 through #213.

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
