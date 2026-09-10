# SOG UI Redesign Specification

Status: IMPLEMENTED — PRODUCTION LINEAGE
Authority: `config/ui-redesign-v4-authority.json`
Completed implementation branch: `ui/sog-redesign-v4`
Cutover PR: #636
Cutover merge: `60940f0c1ad1d69961e839fa4979a7c4e29d91af`

## Objective

Replace the outgoing public presentation layer with a modern stablecoin observatory while preserving canonical facts, evidence/provenance, public machine-readable outputs, route integrity, and production availability throughout development.

This objective was completed in the V4 production cutover. The rules below remain the enduring design and data-safety contract unless superseded by a reviewed later specification.

## Visual system

- near-black / graphite foundation with layered dark surfaces;
- clean sans-serif primary typography;
- monospace only for technical metadata, identifiers, dates, symbols, and code;
- green / amber / red / blue / violet semantic states;
- restrained borders, depth, and glow;
- high information density without unreadable compression;
- no globe/Earth hero dependency;
- no paper/newspaper treatment;
- no retro-terminal parody;
- generated SVG mockups are not a design source of truth.

## Required desktop surfaces

1. Home / Overview
2. Stablecoin Register
3. Stablecoin Detail / Dossier
4. Compare
5. Material Events
6. Event Detail
7. Timeline
8. Registry Statistics
9. Issuer / Organization Detail
10. Methodology / Data
11. Access & Regulation
12. Guides / Articles
13. Updates / Maintenance
14. Support / Contact / About / legal / utility / 404 states

These surface families were completed in the V4 release. Later reviewed refinements, including the Public Stats / Registry Health split, may improve their information architecture without reopening the original V4 implementation branch.

## Mobile contract

Mobile is designed with each surface, not after desktop completion.

Required patterns include bottom navigation for primary destinations, sticky search/filter entry points, filter drawers/bottom sheets, stacked registry records instead of squeezed wide tables, vertical timelines, swipeable or stacked compare views, one-chart-per-row statistics, and progressive disclosure on dossiers while lifecycle and key state remain visible near the top.

## Data-display rules

- Production UI uses current canonical data; mockup numbers are placeholders only.
- No market cap, price, backing, access, reserve, lifecycle, regulatory, evidence-coverage, or similar value may be invented.
- Derived labels require deterministic documented rules.
- Missing values render as an approved unknown/not-recorded state.
- The UI adapts to canonical data; canonical facts are not edited to make a target design look complete.

## Surface hierarchy

### Home

Current registry/state summary, lifecycle distribution, recent material changes, representative records, and direct routes to registry/events/compare/stats/reference.

### Register

Search, sorting, pagination, compare selection, and filters backed by current canonical fields. Desktop may use dense table structures; mobile uses compact record cards and a filter drawer.

### Dossier

Order of comprehension:

1. identity + lifecycle;
2. redemption / exit state;
3. backing / stabilization;
4. access / deployments when supportable;
5. issuer / control;
6. events / lifecycle history;
7. reserve information;
8. deployments;
9. evidence;
10. regulatory notes;
11. known unknowns.

### Compare

Only canonical or deterministically derived fields. Unsupported values remain unknown or absent.

### Events / Event Detail

Chronology, affected records, evidence linkage, and before/after state only when evidence supports the transition.

### Timeline

A primary history surface: horizontal/hybrid on desktop; vertical chronology on mobile.

### Stats

Charts derive exclusively from canonical records and documented aggregation rules. No fabricated market dashboard metrics.

The current post-cutover Stats and Registry Health hierarchy is further governed by `docs/stats-spec.md`.

## Preserved technical contracts

Preserve current official origin, legacy redirect behavior, canonical/public machine-readable outputs, provenance, stablecoin marks/fallback behavior, deterministic per-asset JSON, Ledger Series projection, search/compare semantics that remain supported, keyboard/focus fundamentals, reduced-motion/forced-colors support, and explicit unknown states.

## Legacy visual audit treatment

The completed UI-v3 remediation remains historical regression context for functional/accessibility/data-safety lessons, but its exact outgoing visual composition is not the production design target.

Acceptance must not be blocked by obsolete UI-v3 layout baselines, the old UI-repair baseline, generated SVG mock fidelity, or representative visual assertions whose only purpose is preserving the outgoing style.

## Production lineage

The original V4 production-isolation rule was satisfied before cutover. V4 is now live production lineage rather than an unfinished branch release.

```text
Cutover PR: #636
Cutover merge: 60940f0c1ad1d69961e839fa4979a7c4e29d91af
Production branch: main
```

Future substantial UI releases should use appropriate isolation and production verification, but must not treat `ui/sog-redesign-v4` as the active implementation branch.
