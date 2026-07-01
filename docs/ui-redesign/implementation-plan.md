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
Completed through: PR #267 corrective Organizations and Events completion
Partial precursor: PR #266 Organization and Event row compaction
Current UI: shared shell, Home, Stablecoins, Stablecoin dossiers, Organizations, and Events use Editorial Ledger v3
Active work item: PR #268 Guides
Next implementation: PR #269 Reference and utility pages
Closure: PR #273 production verification and closure
Canonical stable assets: 98
Growth D PR #251: stale draft; do not merge as-is
Gate V3-A: passed
Gate V3-B: passed
Gate V3-C: passed
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

The UI may regroup or progressively disclose information. It may not erase protected fields, convert uncertainty into certainty, imply that every connected organization is an issuer, or present events as live alerts.

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

Organizations:

- responsible-body register and record hierarchy;
- category, regulatory character, jurisdiction, roles, connected assets, current and historical relationships;
- material events, evidence, known unknowns, and correction paths;
- no issuer assumption.

Events:

- chronological register and incident/public-record hierarchy;
- ID, date, category, subtype, affected stablecoins and organizations, impact, status effect, recovery, typed detail, evidence, and corrections;
- no alert-dashboard composition.

Indexes and validation:

- preserved search, five filters, sorts, URL state, zero-result behavior, desktop registers, and compact mobile records;
- used six deliberate comparison columns instead of the former eight-column v2 layouts;
- kept all canonical records server-rendered;
- updated organization, interaction, responsive, build, public consistency, and workstream validation for the split component architecture;
- passed all 18 pull-request workflows;
- changed no canonical data, routes, logos, or machine-readable schemas;
- passed Gate V3-C.

## Active sequence

### PR #268 — Guides

- distinct Editorial Article family;
- title, deck, publication and revision dates;
- readable body width and contents navigation;
- restrained notes, quotations, tables, related guides, and glossary assistance;
- published and evergreen routes remain visible;
- article facts and dates remain unchanged.

Acceptance:

- no generic SaaS card stack;
- guide metadata, JSON-LD, sitemap coverage, and related-guide links remain intact;
- desktop and compact reading hierarchy remain deliberate.

### PR #269 — Reference and utility pages

```text
Reference: Models, Glossary, Updates
Long-form: Methodology, About
Utility: Corrections, Support, Contact
```

Use one shared shell but distinct family-level layouts. Do not return to identical card stacks.

### PR #270 — mobile and accessibility hardening

- controlled navigation disclosure;
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
