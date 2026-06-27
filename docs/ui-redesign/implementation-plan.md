# Stable or Gone UI implementation plan v2

Status: canonical implementation schedule  
Updated: 2026-06-27  
Current registry checkpoint: 92 canonical stable assets  
Approved visual direction: Modern Data Product

## 1. Purpose

This file is the binding execution order for completing the approved SOG UI redesign.

The earlier repair program successfully established data integrity, taxonomy, route, responsive, and evidence-preservation foundations. It did not produce a visually approved final interface. The partial production UI merged through PR #201 is therefore treated as reusable implementation work, not as the accepted redesign release.

No UI work may be reordered, combined, skipped, or published without updating this file and `docs/roadmap.md` in the same pull request.

## 2. Required authority

Every UI implementation PR must read and cite:

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

Additional architecture documents remain binding where they do not conflict with the approved v2 visual contract.

The v2 visual contract supersedes `docs/architecture/visual-system-and-mocks-v1.md` for visual composition and page implementation. The v1 document remains historical.

## 3. Current position

```text
Repository: badjoke-lab/stable-or-gone
Latest merged repair hotfix: PR #206
Canonical stable assets: 92
Canonical organizations: 86
Canonical relationships: 101
Canonical events: 150
Canonical evidence: 455
Public source identities: 410
Current phase: approved UI v2 documentation reset
Active work: PR #207 — freeze approved UI v2 contract and replacement schedule
Routine record growth: paused
Batch 18 selection: prohibited
Automatic production deployment: disabled
Production publication: prohibited until the final approved checkpoint
```

## 4. What is already complete

The following foundations remain valid and must not be weakened:

```text
PR #167–171  documentation and production-integrity repair
PR #172–183  public taxonomy and canonical-semantics repair
PR #185–190  information architecture, responsive contracts, and v1 mock package
PR #191–201  partial shell, index, event, organization, and dossier implementation
PR #202–206  emergency build and validation repairs
```

Reusable completed work includes:

- canonical/public taxonomy mapping;
- explicit primary display relationships;
- source identity and evidence relation preservation;
- value-state semantics;
- grouped navigation architecture;
- stablecoin, organization, and event search/filter foundations;
- stablecoin dossier field ownership;
- route and machine-readable parity validation;
- mobile information-preservation checks;
- production provenance and integrity validation.

These foundations do not authorize the current visual presentation as the completed new UI.

## 5. Binding rules

Every PR must:

1. start from the latest confirmed `main`;
2. cite the exact v2 page or component contract being implemented;
3. cite its numbered work item in this plan;
4. preserve canonical counts unless a separately audited data migration approves a change;
5. use only canonical or approved editorial data;
6. exclude mock-only values and unsupported functionality;
7. keep the approved S/G logo and prohibit substitute branding;
8. preserve evidence, evidence relations, known unknowns, deployments, and multiple organization roles;
9. run all existing validation and any new checks introduced by the PR;
10. state a deployment classification;
11. avoid production deployment unless this plan marks the publication checkpoint;
12. update `docs/roadmap.md` when current position changes.

## 6. Phase gates

```text
Gate V2-A — approved v2 design contract and schedule merged
Gate V2-B — shared visual foundation and brand assets complete
Gate V2-C — all eight approved desktop page families implemented
Gate V2-D — remaining editorial pages aligned
Gate V2-E — mobile, accessibility, and interaction hardening complete
Gate V2-F — 92-record and all-route UI audit complete
Gate V2-G — immutable release candidate approved by the owner
Gate V2-H — deliberate production publication and parity verification
```

A failed gate blocks dependent work. It does not permit weakening a validator or hiding canonical information.

# Phase V2-0 — Documentation and approved references

## PR #207 — Freeze approved UI v2 contract and replacement schedule

### Work

- add `docs/architecture/approved-modern-data-product-ui-v2.md`;
- store the eight approved desktop reference images in the repository;
- store approved S/G logo reference images;
- mark the v1 visual package as historical for new implementation;
- replace this implementation schedule;
- update `docs/roadmap.md` current position and full PR sequence;
- update `AGENTS.md` required reading and authority rules;
- define mock-only exclusions and asset-identity rules;
- prohibit further UI work that does not cite the v2 contract.

### Completion criteria

```text
Eight approved page references are present
Approved S/G logo references are present
V2 contract is canonical
Implementation plan and roadmap agree
AGENTS.md requires the v2 contract
No production code or canonical data changes
No production deployment
```

### Deployment classification

No production deployment required.

### Gate V2-A

Passes when PR #207 merges.

# Phase V2-1 — Shared visual foundation

## PR #208 — Implement v2 visual foundation and approved brand assets

### Work

- create production SVG versions of the approved S/G lockup and monogram;
- add stable asset paths and accessibility labels;
- replace all rejected stacked-cube branding;
- define final dark-navy, surface, line, text, blue accent, and semantic-state tokens;
- implement shared typography, spacing, radius, focus, form, button, chip, panel, and table primitives;
- implement ticker and organization-initial badges;
- implement shared header, grouped navigation, footer, support banner, and page hero;
- keep decorative hero illustrations optional and non-semantic.

### Non-scope

- no page-specific full redesign;
- no official coin-logo collection;
- no new canonical data;
- no production publication.

### Completion criteria

```text
Approved S/G branding appears in shell
No substitute logo remains
Shared tokens and primitives are reusable
Contrast and keyboard focus pass
Canonical routes and counts remain unchanged
Full build passes
```

### Gate V2-B

Passes when PR #208 merges.

# Phase V2-2 — Approved registry pages

## PR #209 — Implement approved home page

Reference: `01-home.webp`

### Work

- implement the approved hero and product statement;
- add truthful registry-wide or widest-supported search;
- show canonical counts for stablecoins, organizations, events, and source identities;
- implement primary registry entry cards;
- implement guide cards from real guide records;
- implement a selected-record section with an explicit deterministic selection rule;
- implement the approved support banner and footer composition.

### Required exclusions

- no invented growth deltas;
- no unsupported metrics;
- no live market data;
- no featured selection based on raw array order.

## PR #210 — Implement approved Stablecoins index

Reference: `02-stablecoin-index.webp`

### Work

- apply approved search and filter composition;
- preserve URL-synchronized filter state;
- use approved public taxonomy only;
- show canonical count cards;
- implement dense desktop rows and compact mobile-ready record data;
- show ticker badges, lifecycle, issuance, reference target, model, organization, and reviewed/change context;
- preserve real export access where available.

### Required exclusions

- saved views;
- user watchlists;
- recently viewed history;
- account-dependent behavior;
- mock-only comparison tray in the initial v2 release;
- market-cap or price filters.

## PR #211 — Implement approved Stablecoin detail

Reference: `03-stablecoin-detail.webp`

### Work

- implement approved record hero with ticker badge;
- implement current-state summary axes;
- implement profile summary;
- implement organizations and control relationships;
- implement reserve, redemption, and backing context without synthetic scoring;
- implement deployments;
- implement event presentation;
- implement evidence and known unknowns as first-class sections;
- keep guides secondary;
- preserve all eight value states.

### Completion criteria

- every current dossier field has a visible destination or deliberate progressive-disclosure destination;
- multiple organizations and roles remain visible;
- no overall safety or transparency score is generated;
- no unsupported reserve amount is invented.

## PR #212 — Implement approved Organizations index and detail

References:

```text
04-organization-index.webp
05-organization-detail.webp
```

### Work

- implement search and approved organization filters;
- implement organization list rows/cards;
- implement organization identity, category, legal form, jurisdiction, functional role, and connected records;
- implement current and historical relationships;
- implement connected stablecoins and events;
- implement evidence, regulatory/legal context, known unknowns, and related guides;
- use organization-initial badges unless a reviewed official local asset exists.

### Required exclusions

- no generic `Verified` badge without a canonical verification meaning;
- no assumption that every organization is an issuer;
- no unsupported licensing conclusion.

## PR #213 — Implement approved Events index and detail

References:

```text
06-event-index.webp
07-event-detail.webp
```

### Work

- implement event search and approved filters;
- implement public category, subtype, date, lifecycle impact, affected records, and related organization presentation;
- implement typed detail sections;
- implement multi-moment timeline only when supported by canonical detail data;
- implement source evidence, known unknowns, and related guides.

### Required exclusions

- no invented market-loss figure;
- no unsupported legal-liability statement;
- no mock prose copied into canonical records;
- no internal overlay names as public labels.

### Gate V2-C

Passes when PRs #209–#213 merge and all five registry page families match the approved composition and canonical field contracts.

# Phase V2-3 — Editorial and project pages

## PR #214 — Align Methodology and the editorial/project family

Reference: `08-methodology.webp`

### Routes and families

```text
Methodology
Guides and guide detail
Glossary
Models
Updates
About
Corrections
Contact
Support
Data access entrypoints
```

### Work

- implement shared editorial shell and on-page navigation;
- implement modular explanatory cards where appropriate;
- align Methodology with the actual canonical model, taxonomy, value states, evidence policy, review process, and public files;
- preserve long-form readability for Guides and policy pages;
- keep Corrections and data access visible;
- keep Support secondary.

### Completion criteria

- editorial pages visibly belong to the approved v2 system;
- guide prose does not replace canonical evidence;
- updates use meaningful change types;
- methodology matches actual validators and data structures.

### Gate V2-D

Passes when PR #214 merges.

# Phase V2-4 — Mobile, accessibility, and interaction hardening

## PR #215 — Complete mobile and accessibility implementation

### Work

- produce implementation-derived mobile reference screenshots;
- implement controlled compact navigation;
- transform each protected table using its page-specific contract;
- preserve active filters and clear actions;
- implement long-record section navigation;
- verify evidence, known unknowns, contracts, URLs, and long titles;
- verify 320, 360, 390, 768, 820, 1024, and 1280+ widths;
- verify 200% zoom and text spacing;
- verify keyboard operation, focus return, labels, announcements, reduced motion, forced colors, and non-color states;
- fix layout drift against the approved desktop references.

### Completion criteria

```text
No material field is hidden
No page depends only on uncontrolled horizontal scrolling
44px targets pass
Keyboard and screen-reader contracts pass
Mobile screenshots are reviewed
Desktop screenshots remain aligned
```

### Gate V2-E

Passes when PR #215 merges.

# Phase V2-5 — Full audit and release candidate

## PR #216 — Audit all records, routes, and outputs under UI v2

### Audit scope

For all 92 stable assets, all organizations, all events, and all public route families verify:

```text
identity
lifecycle
issuance
reference target
model/backing category
organization relationships
reserve and redemption
income/yield where applicable
legal and regulatory context
deployments
events
evidence and evidence relations
known unknowns
value states
mobile layout
desktop layout
metadata
machine-readable parity
```

Also verify:

- canonical counts;
- route counts;
- sitemap;
- canonical URLs and JSON-LD;
- version and manifest;
- search and filter URLs;
- output provenance;
- no stale page family;
- no mock-only values;
- no rejected logo or v1 visual remnants on protected routes.

### Required artifacts

```text
desktop screenshots for all eight approved page references
mobile screenshots for core page families
before/after visual comparison report
92-record audit matrix
organization and event route audit
build and public-output diagnostics
```

### Completion criteria

- all validators pass on one immutable candidate commit;
- the owner reviews the candidate screenshots;
- unresolved material visual defects block release;
- no production publication occurs without explicit approval.

### Gates V2-F and V2-G

Gate V2-F passes when the audit is complete.  
Gate V2-G passes only after explicit owner approval of the immutable release candidate.

# Phase V2-6 — Deliberate production publication

## PR #217 or publication report — Publish the approved UI v2 candidate

This step begins only after Gate V2-G.

### Work

- publish the exact approved candidate commit through the manual production workflow;
- verify deployed commit and build provenance;
- verify public counts and route families;
- verify desktop and mobile smoke tests;
- verify machine-readable parity;
- record the publication report.

### Completion criteria

```text
deployed commit equals approved candidate
all canonical and route counts match
no stale page family remains
approved S/G logo is present
v2 page families are live
machine-readable parity passes
production report is committed
```

### Deployment classification

Publication checkpoint deployment required after explicit approval.

### Gate V2-H

Passes only after production parity verification.

## 7. Mock and asset policy

The approved reference images are visual specifications, not data sources.

Implementation must use:

- canonical records;
- approved taxonomy mappings;
- approved editorial copy;
- local reviewed assets;
- deterministic ticker/initial badges as the default.

Implementation must not use:

- generated imitation coin logos;
- unreviewed third-party logo hotlinks;
- mock-only counts or metrics;
- invented current data;
- account-like features not separately approved.

## 8. Growth policy

Routine growth remains paused at 92 assets until Gate V2-F passes.

The final eight-record path to 100 is not part of the visual implementation PR sequence above. After the repaired 92-record UI audit, the roadmap must deliberately decide whether to resume the existing 100-record release path. No record may be added merely to complete a visual release.

## 9. Publication policy

```text
Automatic production deployment: disabled
Preview branch deployment: disabled unless separately approved
Normal implementation PR deployment: none
Emergency publication: only under deployment policy
UI v2 publication: one deliberate checkpoint after Gate V2-G
Production branch: main
```

## 10. Schedule change control

A schedule or design-direction change requires the same PR to update:

```text
docs/architecture/approved-modern-data-product-ui-v2.md
docs/ui-redesign/implementation-plan.md
docs/roadmap.md
```

A PR that cannot cite its approved v2 page contract and schedule item must be paused.
