# Stable or Gone UI implementation plan v3

Status: canonical implementation schedule — active  
Updated: 2026-07-01  
Registry checkpoint: 98 canonical stable assets  
Visual direction: Editorial Ledger

## Authority

Every UI pull request must follow:

```text
AGENTS.md
docs/spec-governance.md
docs/deployment-policy.md
docs/ui-redesign/master-spec.md
docs/architecture/approved-editorial-ledger-ui-v3.md
docs/ui-redesign/approved-mocks-v3/README.md
docs/ui-redesign/implementation-plan.md
docs/roadmap.md
docs/public-taxonomy-spec.md
DESIGN.md
```

Reference direction controls hierarchy and visual language, not public facts. Canonical data, approved editorial copy, reviewed local assets, and generated canonical counts are the only allowed public inputs.

## Current position

```text
Completed through: PR #268 Editorial Article Guides
Partial precursor: PR #266 Organization and Event row compaction
Current UI: shared shell, Home, Stablecoins, Stablecoin dossiers, Organizations, Events, and Guides use Editorial Ledger v3
Active work item: PR #269 Reference and utility pages
Next implementation: PR #270 mobile and accessibility hardening
Closure: PR #273 production verification and closure
Canonical stable assets: 98
Growth D PR #251: stale draft; do not merge as-is
Gate V3-A: passed
Gate V3-B: passed
Gate V3-C: passed
Gate V3-D: pending PR #269 validation and merge
Gate V3-F: not passed
Release candidate: not selected
Production publication: automatic on main
```

The Modern Data Product direction is superseded. Remaining v2 implementations may be used only for reusable data mapping, interaction, accessibility, and approved logo behavior.

## Rejected visual patterns

```text
SaaS dashboard
giant hero
KPI card row
blue-purple glow
repeated rounded-card grid
decorative shadow stack
new logo generation
```

## Preservation rules

Every v3 PR must preserve canonical stable assets, organizations, relationships, classifications, reserve and redemption profiles, events and typed details, evidence and evidence relations, reserve reports, known unknowns, regulatory notes, deployments, stable-asset relationships, income profiles, guide metadata, public routes, and machine-readable outputs.

The UI may regroup or progressively disclose information. It may not erase protected fields, convert uncertainty into certainty, imply that every connected organization is an issuer, present events as live alerts, or invent publication states for undated guide records.

## Completed v3 work

### PR #261 — documentation and authority alignment

Established Editorial Ledger authority, superseded v2 visual references, paused Growth D, and preserved canonical data, routes, and logo assets.

### PR #262 — shared Editorial Ledger shell

Added paper, ink, rules, muted dark-red accent, typography, compact navigation, truthful search, structured footer, restrained primitives, and accessibility foundations.

### PR #263 — Editorial Ledger Home

Replaced the marketing landing composition with a registry masthead, canonical summary, material changes, lifecycle counts, recently reviewed records, guides, and reference entrypoints.

### PR #264 — Editorial Ledger Stablecoins register

Implemented a seven-column table-first register, six filters, six sorts, URL-synchronized state, bounded comparison, 20-record pagination, visible range, zero-result handling, and protected compact records.

### PR #265 — Editorial Ledger Stablecoin dossier

Removed PageHero, MetricCards, circular glow art, dark rounded navigation, and repeated gradient panels. Added a ruled masthead, fact ledger, assessment, organizations/control, mechanism, reserve/redemption, deployments/legal context, lifecycle history, evidence, known unknowns, and correction paths without changing canonical data or routes.

### PR #266 — partial Organization and Event row compaction

This merged PR changed only `OrganizationIndexRow.astro` and `EventIndexRow.astro`. It did not complete the four page families and is not Gate V3-C completion.

### PR #267 — corrective Organizations and Events completion

- built responsible-body Organization registers and record files;
- built chronological Event registers and incident/public-record files;
- preserved search, filters, sorts, URL state, zero-result behavior, desktop registers, compact mobile records, relationships, evidence, typed details, value states, and known unknowns;
- passed all 18 workflows and Gate V3-C;
- changed no canonical data, routes, logos, or machine-readable schemas.

### PR #268 — Editorial Article Guides

- replaced the Guides hero, KPI strip, panel grouping, and repeated mini-card archive with an Editorial Ledger index;
- converted all nine guide routes to a shared Editorial Article family;
- added a readable body column, desktop rail, generated on-page contents navigation, mobile contents disclosure, editorial tables, related records, revision history, glossary assistance, methodology access, and correction access;
- applied one masthead and explicit publication-value-state contract to dated and evergreen articles;
- preserved article copy, source URLs, guide metadata, JSON-LD, sitemap coverage, related-guide discovery, and routes;
- connected `validate-ui-v3-guides.mjs` to the normal guide build gate;
- changed no canonical data, routes, logos, or machine-readable schemas.

## Active sequence

### PR #269 — Reference and utility pages

```text
Reference: Models, Glossary, Updates
Long-form: Methodology, About
Utility: Corrections, Support, Contact
```

Requirements:

- use one shared shell but distinct family-level layouts;
- preserve each route, claim, correction path, support function, and machine-readable link;
- do not return to identical card stacks;
- provide deliberate long-form reading width for Methodology and About;
- use indexed, scan-friendly records for Models, Glossary, and Updates;
- use restrained form and action hierarchy for Corrections, Support, and Contact;
- pass Gate V3-D only after every editorial/reference family is complete and validated.

### PR #270 — mobile and accessibility hardening

- controlled navigation and guide contents disclosure;
- compact records or deliberate scroll-preserved tables;
- labels remain attached to values;
- 320px width and 200 percent zoom;
- keyboard-only operation and visible focus;
- result announcements, reduced motion, forced colors, and information parity.

### PR #271 — representative visual audit

Capture desktop and mobile representatives for Home, every unique index/project page, three stablecoin details, three organization details, three event details, three guides, and every unique reference/utility page. Gate V3-F passes only after overflow, false empty states, hierarchy, logo misuse, and remaining SaaS styling are resolved.

### PR #272 — accessibility, performance, and legacy cleanup

Remove unused v2 CSS and obsolete components only after replacements exist. Verify headings, labels, tables, contrast, focus, keyboard operation, reduced motion, forced colors, counts, routes, performance, and build output.

### PR #273 — production verification and closure

- verify automatic main deployment for the intended commit;
- verify provenance and machine-readable parity;
- verify representative production captures;
- record Gate V3-F through Gate V3-H and the immutable production commit;
- do not claim UI v3 completion before Gate V3-H.

## Validation rule

Each implementation PR must run normal repository checks and relevant page-family checks:

```text
npm run validate:ui-v3-foundation
npm run validate:ui-v3-home
npm run validate:ui-v3-stablecoin-index
npm run validate:ui-v3-stablecoin-detail
node scripts/validate-ui-v3-guides.mjs
npm run validate:active-workstream
npm run validate:mobile-information
npm run check
npm run build
npm run verify:consistency
```

## Screenshot rule

Representative capture is the default. Repeated detail families are sampled rather than exhaustively captured. Full capture remains available for targeted debugging.

## Paused non-UI work

Until PR #273 completes:

```text
Growth D to 100 records
100-record registry-wide audit
non-UI release preparation
new stats surface
broad schema work
new logo work
alternative visual directions
```
