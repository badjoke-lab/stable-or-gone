# Stable or Gone Roadmap

Updated: 2026-06-27

## Purpose

This is the canonical execution schedule for SOG.

Detailed audits belong in `docs/audits/`. Canonical visual and page decisions belong in `docs/architecture/`. The binding UI sequence belongs in `docs/ui-redesign/implementation-plan.md`.

## Required authority

```text
AGENTS.md
docs/spec-governance.md
docs/deployment-policy.md
docs/ui-redesign/master-spec.md
docs/architecture/approved-modern-data-product-ui-v2.md
docs/ui-redesign/implementation-plan.md
docs/public-taxonomy-spec.md
docs/architecture/site-architecture-v1.md
docs/architecture/stablecoin-dossier-hierarchy-v1.md
docs/architecture/index-interaction-contract-v1.md
docs/architecture/meaningful-change-history-v1.md
docs/architecture/responsive-accessibility-v1.md
```

`docs/architecture/visual-system-and-mocks-v1.md` is historical for new visual implementation. The v2 Modern Data Product contract is authoritative.

## Registry checkpoint

```text
Stable assets:                 92
Organizations:                 86
Organization relationships:   101
Events:                       150
Canonical evidence records:   455
Public source identities:      410
Evidence relations:            455
Known unknowns:                253
Deployments:                   130
Reserve components:            125
```

Canonical count source: `docs/migration/registry-v3-baseline.json`.

## Current position

```text
Repository: badjoke-lab/stable-or-gone
Public site: https://sog.badjoke-lab.com/
Latest merged UI-program work: PR #207
Latest merged main: 3df568eab0a179d7690a88efb599156b0d659ab7
Current public UI: partial repair implementation, not accepted as completed UI v2
Gate V2-A: passed
Current phase: Phase V2-1 — shared visual foundation
Active work: PR #208 — approved brand assets, v2 tokens, shared shell, primitives, and validation
Next work after Gate V2-B: PR #209 — approved Home page
Approved visual direction: Modern Data Product
Approved desktop reference pages: 8
Routine record growth: paused at 92 assets
Batch 18 selection: prohibited
Automatic production deployment: disabled
Production publication: prohibited until Gate V2-G owner approval
```

## Why the schedule was reset

The earlier program repaired data semantics, route integrity, evidence handling, responsive foundations, and several page functions, but implementation advanced before the owner approved a final visual direction.

Therefore:

- PRs #191–#201 remain reusable functional work;
- the live site is not the completed new UI;
- the v1 mock package no longer controls visual implementation;
- the owner-approved eight-page Modern Data Product set controls the redesign;
- every remaining UI PR must cite the v2 contract, exact reference page, and this schedule.

## Preserved completed foundations

### Documentation and integrity

```text
PR #167  documentation reset
PR #168  repair baseline and defect inventory
PR #169  generated build provenance
PR #170  route, sitemap, canonical, JSON-LD, and output parity
PR #171  mobile information preservation
```

### Taxonomy and canonical semantics

```text
PR #172  public-value registry
PR #173  lifecycle and issuance normalization
PR #174  reference-target and peg normalization
PR #175  backing and stabilization normalization
PR #176  event category and subtype normalization
PR #177  organization classification normalization
PR #178  evidence reliability, provenance, and type separation
PR #179  deployment status and verification-state separation
PR #180  value-state semantics
PR #181  explicit primary display relationships
PR #182  evidence-source identity deduplication with claim preservation
PR #183  record-specific public-copy migration and 92-record completion matrix
```

### Information architecture and partial implementation

```text
PR #185  site architecture and route roles
PR #186  stablecoin dossier hierarchy and field matrix
PR #187  index interaction contract
PR #188  meaningful public change-history contract
PR #189  responsive and accessibility contract
PR #190  v1 visual system and generated mocks — historical for new visual work
PR #191  grouped navigation shell
PR #195  layout wiring
PR #196  stablecoin index implementation
PR #198  organization index and detail completion
PR #199  event index and detail implementation
PR #200  stablecoin identity section
PR #201  organizations and control section
```

### Emergency build repairs

```text
PR #202  Cloudflare install and UI-validator repair
PR #203  UI validation after organization-component split
PR #204  reserve applicability action normalization
PR #205  Batch 13 stage-gate correction
PR #206  production integrity-audit alignment
```

### Approved v2 reset

```text
PR #207  approved UI v2 contract, eight page references, logo references, schedule, and AGENTS authority
Gate V2-A passed
```

## Approved UI v2 reference set

```text
01  Home
02  Stablecoins index
03  Stablecoin detail
04  Organizations index
05  Organization detail
06  Events index
07  Event detail
08  Methodology / editorial family
```

Approved branding:

- S/G monogram;
- horizontal line crossing the mark;
- short coral broken segment at the right;
- full Stable or Gone lockup for desktop surfaces;
- monogram for compact surfaces;
- no stacked-cube substitute.

Approved identity-asset policy:

- ticker badges are the default stablecoin identity;
- organization-initial badges are the default organization identity;
- official marks require local storage and source verification;
- no hotlinking or generated imitation logos.

## UI v2 phase sequence

### Phase V2-0 — Documentation and reference freeze

```text
PR #207  approved UI v2 contract, reference assets, schedule, and AGENTS update
Gate V2-A passed
```

### Phase V2-1 — Shared visual foundation

```text
PR #208  production logo assets, design tokens, shared shell, primitives, and v2 validator
Gate V2-B
```

### Phase V2-2 — Approved registry pages

```text
PR #209  Home
PR #210  Stablecoins index
PR #211  Stablecoin detail
PR #212  Organizations index and detail
PR #213  Events index and detail
Gate V2-C
```

### Phase V2-3 — Editorial and project family

```text
PR #214  Methodology, Guides, Glossary, Models, Updates, About, Corrections, Contact, Support, and data access
Gate V2-D
```

### Phase V2-4 — Mobile, accessibility, and interaction hardening

```text
PR #215  mobile transformations, accessibility, interaction, and screenshot alignment
Gate V2-E
```

### Phase V2-5 — Full audit and release candidate

```text
PR #216  92-record, all-organization, all-event, all-route UI v2 audit
Gate V2-F  audit complete
Gate V2-G  immutable candidate explicitly approved by owner
```

### Phase V2-6 — Deliberate publication

```text
PR #217 or publication report  publish the exact approved candidate
Gate V2-H  production parity verified
```

## Immediate work — PR #208

Specification references:

```text
docs/architecture/approved-modern-data-product-ui-v2.md
docs/ui-redesign/approved-mocks-v2/README.md
docs/ui-redesign/implementation-plan.md
```

Implementation scope:

1. Create local SVG lockup and monogram assets from the approved S/G references.
2. Apply the approved S/G lockup to the shared header and footer.
3. Use the S/G monogram as the SVG favicon.
4. Define v2 dark-navy, bright-blue, teal, coral, text, border, and semantic tokens.
5. Add shared panel, button, field, chip, ticker-badge, organization-badge, hero, metric-card, and support-banner primitives.
6. Map legacy shared surfaces onto the new token family without redesigning page-specific layouts.
7. Add reusable `BrandLockup`, `TickerBadge`, `OrganizationBadge`, `PageHero`, `MetricCard`, and `SupportBanner` components.
8. Add a v2 foundation validator and run it in full and site builds.
9. Preserve all routes, canonical counts, evidence, known unknowns, and existing interaction contracts.
10. Do not redesign Home or registry pages in this PR.
11. Do not add official coin-logo dependencies.
12. Do not deploy production.

PR #208 completion criteria:

```text
Approved S/G assets exist locally
Header, footer, and favicon use approved branding
Rejected substitute branding is absent from production sources
V2 token contract and shared components exist
Shared shell remains keyboard and forced-colors compatible
V2 validator passes in npm run build and build:site
All canonical counts and routes are unchanged
No page-specific full redesign
No production deployment
```

After PR #208 merges, the active item becomes PR #209 — implement the approved Home page using `01-home.webp` and canonical data only.

## Mock-only exclusions

The approved mock images do not authorize:

```text
live price
market capitalization
circulating supply
holder or transfer counts
market charts
monthly growth deltas
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

Any later proposal for these features requires its own data source, specification, operating-cost review, and schedule amendment.

## Preserved quality queues

```text
Missing canonical launch dates:           20
Historical terminal dates unresolved:      4
Historical relationship end dates:         7
Reserve applicability queue:               12
Public duplicate evidence URL groups:       0
Evidence reliability values unknown:       36
Direct workflow placeholders retained:    112
Deployment canonicality not recorded:      67
Deployment verification not recorded:     130
Deployment source review needed:           15
```

Queues may be reduced only through source-backed review. UI work must not clear them by defaulting, guessing, hiding, or relabeling them as known.

## Growth policy

Routine growth remains paused at 92 assets until Gate V2-F passes.

The existing final-eight path to 100 remains deferred. After the 92-record v2 audit, the roadmap must deliberately decide whether growth resumes. The UI release does not require thin records or unsupported additions merely to reach 100.

## Publication policy

```text
Automatic production deployment: disabled
Preview branch deployments: disabled unless separately approved
Routine documentation and implementation PR deployment: none
Verified emergency publication: allowed only under deployment policy
UI v2 release: one deliberate publication after Gate V2-G
Publication path: manual production workflow
Production branch: main
```

Production success may be stated only after the deployed commit and public parity are verified.

## Completion definition

The v2 redesign program is complete only when:

- all approved page families visibly match the v2 composition and hierarchy;
- the approved S/G logo is used consistently;
- no rejected substitute branding remains;
- all canonical taxonomy axes remain consistent;
- every stablecoin, organization, event, and route passes the v2 audit;
- no material mobile information is suppressed;
- evidence identities, evidence relations, and known unknowns remain visible and connected;
- mock-only values are absent;
- production identifies one approved source commit and canonical data hash;
- HTML, sitemap, metadata, machine-readable files, and canonical counts agree;
- production publication is explicitly approved and documented.
