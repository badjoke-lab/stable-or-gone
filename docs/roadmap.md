# Stable or Gone Roadmap

Updated: 2026-06-28

## Purpose

This is the canonical execution schedule for SOG. Detailed visual rules live in `docs/architecture/approved-modern-data-product-ui-v2.md`. The binding PR order lives in `docs/ui-redesign/implementation-plan.md`.

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

The v2 Modern Data Product contract is authoritative. The v1 visual package is historical.

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
Latest merged UI-program work: PR #209
Latest merged main: 4e07907cf1e796882382e964c2e7852cfed21c07
Current public UI: partial repair implementation, not yet the completed UI v2 release
Gate V2-A: passed
Gate V2-B: passed
Current phase: Phase V2-2 — approved registry pages
Active work: PR #210 — approved Stablecoins index
Next work: PR #211 — approved Stablecoin detail
Approved visual direction: Modern Data Product
Approved desktop reference pages: 8
Routine record growth: paused at 92 assets
Batch 18 selection: prohibited
Automatic production deployment: disabled
Production publication: prohibited until Gate V2-G owner approval
```

## Completed foundations and pages

```text
PR #167–171  documentation, provenance, route parity, and mobile preservation
PR #172–183  public taxonomy and canonical-semantics repair
PR #185–190  information architecture, responsive contracts, and historical v1 mocks
PR #191–201  reusable shell, index, organization, event, and dossier implementation
PR #202–206  emergency build and integrity repairs
PR #207      approved UI v2 contract, eight page references, logo references, schedule, and AGENTS authority
PR #208      approved S/G assets, v2 tokens, shared shell, reusable components, and foundation validator
PR #209      approved Home, cross-registry search, canonical metrics, deterministic selected records, and Home validator
```

PR #207 passed Gate V2-A. PR #208 passed Gate V2-B. PR #209 merged after all 18 pull-request checks passed. No completed v2 PR changed canonical record counts or published production.

## Approved UI v2 reference set

```text
01  Home
02  Stablecoins index
03  Stablecoin detail
04  Organizations index
05  Organization detail
06  Events index
07  Event detail
08  Methodology and editorial family
```

Approved brand and asset rules:

- use the S/G monogram and full lockup;
- preserve the crossing line and coral interruption;
- do not use substitute stacked-cube branding;
- use ticker badges and organization-initial badges by default;
- official marks require reviewed local assets and source records;
- do not hotlink or generate imitation logos.

## Phase sequence

### Phase V2-0 — Documentation and references

```text
PR #207  complete
Gate V2-A passed
```

### Phase V2-1 — Shared visual foundation

```text
PR #208  complete
Gate V2-B passed
```

### Phase V2-2 — Approved registry pages

```text
PR #209  Home — complete
PR #210  Stablecoins index — active
PR #211  Stablecoin detail
PR #212  Organizations index and detail
PR #213  Events index and detail
Gate V2-C
```

### Phase V2-3 — Editorial and project pages

```text
PR #214  Methodology, Guides, Glossary, Models, Updates, About, Corrections, Contact, Support, and data access
Gate V2-D
```

### Phase V2-4 — Mobile and accessibility hardening

```text
PR #215  page-specific mobile transformations, accessibility, interaction, and screenshot alignment
Gate V2-E
```

### Phase V2-5 — Full audit and release candidate

```text
PR #216  92-record, all-organization, all-event, and all-route UI v2 audit
Gate V2-F  audit complete
Gate V2-G  immutable candidate explicitly approved by owner
```

### Phase V2-6 — Deliberate publication

```text
PR #217 or publication report  publish the exact approved candidate
Gate V2-H  production parity verified
```

## Immediate work — PR #210

Reference: `docs/ui-redesign/approved-mocks-v2/02-stablecoin-index.webp`.

Implementation scope:

1. Replace the legacy Stablecoins intro with the approved v2 hero and metric hierarchy.
2. Preserve dynamic counts for all records, active lifecycle records, connected organizations, and source identities.
3. Preserve search across name, symbol, alias, domain, and connected organization.
4. Preserve URL-synchronized state, deterministic parameter order, browser back/forward handling, and clear actions.
5. Preserve six approved taxonomy filters: lifecycle, issuance, asset class, reference, backing, and stabilization.
6. Preserve six sort modes.
7. Preserve nine protected desktop table headers.
8. Add ticker badges to desktop rows and compact cards.
9. Add last-reviewed, event, evidence, and known-unknown context from canonical records.
10. Preserve compact cards for small screens.
11. Preserve the bounded two-to-four-record comparison as secondary historical context, not a ranking or account feature.
12. Add a PR #210-specific validator to full and site builds.
13. Correct `AGENTS.md` so current-work authority comes from this roadmap and the implementation plan.
14. Preserve canonical counts and routes.
15. Do not deploy production.

PR #210 completion criteria:

```text
Approved Stablecoins hierarchy is implemented
Canonical metric cards remain dynamic
Six filters and six sorts remain functional
URL and browser history behavior remains functional
Nine protected headers remain present
Ticker badges and review context are visible
Compact cards preserve protected information
Comparison remains bounded and non-ranking
Mock-only features are absent
PR #210 validator and all repository checks pass
Canonical routes and counts remain unchanged
No production deployment
```

After PR #210 merges, the active item becomes PR #211 and must use `03-stablecoin-detail.webp`.

## Mock-only exclusions

The approved images do not authorize:

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

UI work must not clear these queues through defaults, guesses, hiding, or relabeling.

## Growth policy

Routine growth remains paused at 92 assets until Gate V2-F. The final-eight path to 100 requires a deliberate roadmap decision after the repaired 92-record UI audit.

## Publication policy

```text
Automatic production deployment: disabled
Preview branch deployment: disabled unless separately approved
Normal documentation and implementation PR deployment: none
Emergency publication: deployment policy only
UI v2 publication: one deliberate checkpoint after Gate V2-G
Publication path: manual production workflow
Production branch: main
```

Production success may be stated only after the deployed commit and public parity are verified.

## Completion definition

The v2 program is complete only when all approved page families match their contracts, the approved S/G brand is consistent, canonical semantics and counts remain correct, material mobile information is preserved, evidence and known unknowns remain connected, mock-only values are absent, and the explicitly approved candidate is deliberately published and verified.
