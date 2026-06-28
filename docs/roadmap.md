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
Latest merged UI-program work: PR #210
Latest merged main: ce3664f4ffa34d0df60b4182b8be821bc13f2945
Current public UI: partial repair implementation, not yet the completed UI v2 release
Gate V2-A: passed
Gate V2-B: passed
Current phase: Phase V2-2 — approved registry pages
Active work: PR #211 — approved Stablecoin detail
Next work: PR #212 — approved Organizations index and detail
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
PR #210      approved Stablecoins index, taxonomy filters, URL state, ticker badges, compact cards, and index validator
```

PR #207 passed Gate V2-A. PR #208 passed Gate V2-B. PRs #209 and #210 each merged after all 18 pull-request checks passed. No completed v2 PR changed canonical record counts or published production.

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
PR #210  Stablecoins index — complete
PR #211  Stablecoin detail — active
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

## Immediate work — PR #211

Reference: `docs/ui-redesign/approved-mocks-v2/03-stablecoin-detail.webp`.

Implementation scope:

1. Replace the legacy detail hero with the approved v2 record hero, ticker badge, lifecycle, issuance, and registry return action.
2. Add six current-state metric cards for lifecycle, reference target, backing model, issuance, primary organization, and last reviewed.
3. Preserve the approved eight-section dossier contract and local navigation.
4. Preserve the identity table and equivalent compact identity cards.
5. Preserve every organization relationship, role, relationship state, governance field, and control-capability summary.
6. Replace the stale mechanics placeholder with the completed mechanics section.
7. Preserve reference, backing, stabilization, redemption/exit, valuation, yield, and classification fields.
8. Preserve reserve components, reserve profile, redemption profile, reserve history, deployments, regulatory notices, model history, issuer-control events, event timeline, evidence, and known unknowns.
9. Split reserve, legal, and unknown sections so DOM order follows the dossier contract.
10. Preserve evidence axes, deployment axes, value states, and record coverage counts.
11. Add Methodology, Corrections, registry, organization, event, guide, and data-manifest destinations.
12. Add a PR #211-specific validator to full and site builds.
13. Remove stale hardcoded current-work text from `AGENTS.md`; roadmap and implementation plan remain authoritative.
14. Preserve all 92 routes and canonical counts.
15. Do not deploy production.

PR #211 completion criteria:

```text
Approved detail hero and current-state hierarchy are implemented
All eight dossier sections remain present and ordered
All current identity, organization, mechanics, deployment, history, evidence, unknown, and further-reading fields remain reachable
Compact identity and organization representations remain available
Reserve, legal, and unknown sections render in the approved order
Stale implementation placeholder text is absent
Synthetic scores and mock-only fields are absent
PR #211 validator and all repository checks pass
All 92 detail routes and canonical counts remain unchanged
No production deployment
```

After PR #211 merges, the active item becomes PR #212 and must use `04-organization-index.webp` and `05-organization-detail.webp`.

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
