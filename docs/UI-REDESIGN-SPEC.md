# SOG UI Redesign Specification

Status: ACTIVE AFTER AUTHORITY MERGE
Authority: `config/ui-redesign-v4-authority.json`
Implementation branch: `ui/sog-redesign-v4`

## Objective

Replace the outgoing public presentation layer with a modern stablecoin observatory while preserving canonical facts, evidence/provenance, public machine-readable outputs, route integrity, and production availability throughout development.

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

## Preserved technical contracts

Preserve current official origin, legacy redirect behavior, canonical/public machine-readable outputs, provenance, stablecoin marks/fallback behavior, deterministic per-asset JSON, Ledger Series projection, search/compare semantics that remain supported, keyboard/focus fundamentals, reduced-motion/forced-colors support, and explicit unknown states.

## Legacy visual audit treatment

The completed UI-v3 remediation remains historical regression context for functional/accessibility/data-safety lessons, but its exact outgoing visual composition is not the redesign target.

Redesign acceptance must not be blocked by obsolete UI-v3 layout baselines, the old UI-repair baseline, generated SVG mock fidelity, or representative visual assertions whose only purpose is preserving the outgoing style.

## Production isolation

The current public UI stays on `main` until the complete redesign is ready. Partial redesign pages must not be merged to `main`.

Before cutover, latest `main` is incorporated into the redesign branch and all critical verification is repeated.
