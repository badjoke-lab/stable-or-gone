# Stable or Gone UI implementation plan v3

Status: canonical implementation schedule — active  
Updated: 2026-07-02  
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
Completed through: PR #270 mobile and accessibility hardening
Partial precursor: PR #266 Organization and Event row compaction
Current UI: all page families use Editorial Ledger v3 structures
Active work item: PR #271 representative all-family visual audit
Next implementation: PR #272 accessibility, performance, and legacy cleanup
Closure: PR #273 production verification and closure
Canonical stable assets: 98
Growth D PR #251: stale draft; do not merge as-is
Gate V3-A: passed
Gate V3-B: passed
Gate V3-C: passed
Gate V3-D: passed
Gate V3-E: passed
Gate V3-F: pending PR #271 rendered audit and human image review
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

Every v3 PR must preserve canonical stable assets, organizations, relationships, classifications, reserve and redemption profiles, events and typed details, evidence and evidence relations, reserve reports, known unknowns, regulatory notes, deployments, stable-asset relationships, income profiles, guide metadata, public routes, contact paths, support wallet records, and machine-readable outputs.

The UI may regroup or progressively disclose information. It may not erase protected fields, convert uncertainty into certainty, imply that every connected organization is an issuer, present events as live alerts, invent publication states, add a duplicate corrections route, or alter payment addresses through styling work.

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

Added the ruled research dossier hierarchy while preserving canonical data, routes, evidence, relationships, events, reserve/redemption details, value states, and known unknowns.

### PR #266 — partial Organization and Event row compaction

This merged PR changed only two row components and was not Gate V3-C completion.

### PR #267 — corrective Organizations and Events completion

Built responsible-body Organization registers and records plus chronological Event registers and incident/public-record files. Preserved interaction, responsive records, relationships, evidence, typed details, value states, and known unknowns. Passed Gate V3-C.

### PR #268 — Editorial Article Guides

Converted the guide archive and all nine routes to a shared Editorial Article family with readable columns, generated contents navigation, mobile disclosure, editorial tables, related records, revision history, explicit publication states, and normal build validation.

### PR #269 — Reference, Long-form, and Utility pages

- converted Models, Glossary, and Updates into scan-friendly Reference indexes;
- converted Methodology and About into Long-form pages with readable width and generated contents navigation;
- converted Contact/Corrections and Support into Utility pages with clear action hierarchy;
- retained `/contact/` as the canonical corrections route;
- preserved Google Form and GitHub paths, support assets, networks, addresses, copy controls, fallback behavior, warnings, update records, and routes;
- passed all 18 workflows and Gate V3-D.

### PR #270 — mobile and accessibility hardening

- tested and protected all page families at 320px width and 200 percent zoom;
- preserved labels, values, protected fields, and twenty-five table contracts;
- added controlled navigation and contents disclosure, Escape focus return, keyboard support, visible focus, 44px targets, result and copy announcements, long-value wrapping, reduced motion, and forced-colors coverage;
- passed all 18 workflows, Astro check, production build, output verification, public-layer verification, and Gate V3-E.

## Active sequence

### PR #271 — representative all-family visual audit

Required captures on desktop and mobile:

- Home;
- all twelve unique index, reference, long-form, and utility routes;
- three stablecoin details;
- three organization details;
- three event details;
- three guide articles.

Required rendered checks:

- successful response and non-empty screenshot;
- exactly one `main` and one `h1`;
- no horizontal document overflow;
- no broken images;
- approved Stable or Gone brand assets only;
- no visible legacy PageHero, MetricCard, blue-purple glow, or SaaS-dashboard markers;
- no false initial zero-result state on registry indexes.

Required human review:

- hierarchy and reading order;
- clipped labels, values, or controls;
- false empty states;
- remaining card/dashboard composition;
- logo misuse;
- excessive whitespace or unusable density;
- mobile table and disclosure legibility.

Gate V3-F passes only after the automated desktop/mobile audit reports zero failures, the uploaded image artifacts receive human review, and all normal pull-request workflows succeed.

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
node scripts/validate-ui-v3-reference-utility.mjs
node scripts/validate-ui-v3-representative-visual-audit.mjs
npm run validate:active-workstream
npm run validate:mobile-information
npm run check
npm run build
npm run verify:consistency
```

## Screenshot rule

Representative capture is the default. Repeated detail families are sampled at three records each rather than exhaustively captured. Full capture remains available for targeted debugging. PR #271 and later visual changes must run both desktop and mobile captures from the built output.

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
