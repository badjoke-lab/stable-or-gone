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
Completed through: PR #272 accessibility, performance, and legacy cleanup
Partial precursor: PR #266 Organization and Event row compaction
Current UI: all page families use Editorial Ledger v3 structures
Active work item: PR #273 production verification and closure
Next after closure: rebuild Growth D from latest main
Canonical stable assets: 98
Growth D PR #251: stale draft; do not merge as-is
Gate V3-A: passed
Gate V3-B: passed
Gate V3-C: passed
Gate V3-D: passed
Gate V3-E: passed
Gate V3-F: passed
Gate V3-G: pending exact release-candidate approval
Gate V3-H: pending production commit and public parity verification
Release candidate: not selected
Production publication: automatic on main
```

The Modern Data Product direction is superseded. Historical v2 documents may remain as history, but production source must not load or reference obsolete v2 Hero/KPI presentation assets.

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

Converted Models, Glossary, and Updates to Reference indexes; Methodology and About to Long-form pages; Contact/Corrections and Support to Utility pages. Preserved correction paths, support values, routes, and data. Passed Gate V3-D.

### PR #270 — mobile and accessibility hardening

Preserved protected information at 320px and 200 percent zoom; added controlled disclosures, Escape focus return, keyboard support, visible focus, target sizing, announcements, long-value wrapping, reduced motion, and forced-colors support. Passed Gate V3-E.

### PR #271 — representative all-family visual audit

Captured 24 representative routes per device, reviewed 48 full-page images, recorded zero rendered failures, and established the continuing desktop/mobile visual-regression contract. Passed Gate V3-F.

## Active sequence

### PR #272 — accessibility, performance, and legacy cleanup — complete

Remove only verified-unused production assets:

```text
src/components/PageHero.astro
src/components/MetricCard.astro
src/styles/editorial-v2.css
```

Remove the obsolete v2 stylesheet import and old `.page-hero` / `.metric-card` compatibility selectors. Keep historical documentation and data validators unless separately proven unused and safe to remove.

Required accessibility preservation:

- skip link and focusable main landmark;
- keyboard focus and Escape return;
- polite copy success/failure announcements;
- 44-pixel target rules;
- 320px and 200 percent zoom information preservation;
- long-value wrapping;
- reduced-motion and forced-colors behavior;
- twenty-five protected mobile table contracts.

Required static and build controls:

- source scan blocks `PageHero`, `MetricCard`, `editorial-v2.css`, `.page-hero`, and `.metric-card` from returning;
- active v3 stylesheet imports and accessibility markers are checked;
- post-build audit checks CSS and JavaScript totals, largest assets, generated route count, required routes, one H1, one main landmark, skip links, and legacy output markers;
- CI uploads JSON and Markdown measurements.

Initial regression ceilings:

```text
source CSS total <= 250,000 bytes
built CSS total <= 500,000 bytes
largest CSS asset <= 220,000 bytes
built JavaScript total <= 500,000 bytes
largest JavaScript asset <= 250,000 bytes
built HTML files >= 350
```

The PR #272 audit recorded 128,528 source-CSS bytes, 111,078 built-CSS bytes, 16,203 built-JavaScript bytes, 378 HTML files, zero warnings, and zero failures. The 48 final images were pixel-identical to the prior passing capture.

Required rendered regression:

- twelve unique pages and four repeated detail families;
- 24 routes per device and 48 full-page images total;
- zero capture, overflow, broken-image, brand, legacy-marker, false-empty-state, H1, or main-landmark failures;
- human review for hierarchy, clipping, density, controls, tables, disclosures, and logo use.

### PR #273 — production verification and closure — active

- select and record the exact release candidate;
- obtain Gate V3-G owner approval;
- verify automatic main deployment for the intended immutable commit;
- verify provenance and machine-readable parity;
- run representative captures against production;
- record Gate V3-H and the production commit;
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
npm run validate:ui-v3-cleanup
npm run validate:active-workstream
npm run validate:mobile-information
npm run check
npm run build
npm run audit:ui-v3-cleanup
npm run verify:consistency
```

## Screenshot rule

Representative capture is the default. Repeated detail families are sampled at three records each rather than exhaustively captured. Full capture remains available for targeted debugging. PR #271 established the baseline; PR #272 must prove that removal of the legacy layer does not change rendered behavior.

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
