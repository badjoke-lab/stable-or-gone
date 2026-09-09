# DESIGN.md — Stable or Gone

Status: active post-cutover observatory design authority
Updated: 2026-09-10
Primary analytical specification: `docs/stats-spec.md`

## Product identity

Stable or Gone is a source-backed historical and operational registry for stablecoins and related stable-value assets.

The interface must help a reader answer quickly:

- What is this asset now?
- Can it be issued or redeemed?
- What backs or stabilizes it?
- Who issues, controls, or operates it?
- What material events changed it?
- What evidence supports the record?
- What remains unknown?

## Active visual direction

UI Redesign V4 completed production cutover through PR #636. The modern stablecoin observatory system is now the production design lineage.

Use:

- deep graphite / near-black backgrounds;
- layered dark panels;
- clean sans-serif primary typography;
- monospace restricted to technical metadata;
- semantic green, amber, red, blue, violet and muted states;
- dense but readable data layouts;
- restrained borders and depth;
- clear hierarchy before decoration;
- no globe/Earth hero artwork as an implementation dependency;
- no newspaper/paper visual system;
- no retro-terminal parody;
- no generated SVG mock as visual authority.

## Information architecture

Primary public product surfaces include Home, Stablecoin Register, Stablecoin Dossier, Compare, Material Events, Event Detail, Timeline, Stats, Issuer/Organization, Methodology/Data, Access & Regulation, Guides, Updates, Registry Health/Maintenance, and utility/legal surfaces.

Mobile is a first-class layout with bottom navigation, filter drawers, stacked record cards, vertical timelines, swipeable/stacked comparison, and one major chart or analytical block per row where appropriate.

## Public Stats design rule

`/stats/` is not an exhaustive dump of every registry field and not a second Home page.

It must establish a clear reading sequence:

```text
Executive summary
-> Current lifecycle state
-> Composition
-> Historical failure patterns
-> Change over time
-> Coverage / confidence
-> Drilldown to records
```

Current lifecycle state is the visual centerpiece. Four substantial composition panels are preferable to dozens of equally weighted micro-cards. Historical failure patterns must show exact numerator/denominator context and must not be styled as a predictive risk score.

Corpus-growth and detailed operational quality metrics do not belong in the primary Stats narrative.

## Registry Health / Maintenance design rule

`/maintenance/` is the public-safe operational view of SOG itself.

It should prioritize:

```text
Registry health summary
-> Review freshness
-> Data coverage
-> Aggregate gaps / known unknowns
-> Public integrity checks
-> Reviewed corpus growth
-> Monthly public maintenance log
```

The page is not an admin console. It must not visually imply that internal monitoring queues, candidate rows, or reviewer assignments are public.

Monthly log detail should use progressive disclosure so operations history does not overwhelm the health overview.

## Density and hierarchy

Do not solve every page by creating more cards.

- a dominant analytical question should receive the dominant visual area;
- related measurements may share one structured panel;
- long tails should be truncated or progressively disclosed where exact full data remains available elsewhere;
- charts supplement exact counts rather than replacing them;
- operational detail and public analytical insight must not be mixed merely because both are numerical.

## Data rule

Design never authorizes fabricated facts. All displayed values come from current canonical data, reviewed public maintenance checkpoints, or documented deterministic derived rules.

Unsupported values remain explicit unknown/not-recorded states. Historical failure concentration is descriptive registry context, not a forecast, safety score, risk score, ranking, or investment recommendation.

## Production rule

`main` is the production source and publishes automatically. Significant page-family refinements are developed on an isolated branch, validated, and merged as a complete release unit rather than exposing half of a paired information-architecture change.

For the current Stats / Registry Health split, the implementation branch is `ui/stats-registry-health-20260910` and both routes ship together.

## Acceptance

Changes must pass the relevant canonical/statistics/registry integrity checks, Astro/build checks, machine-readable/public-layer verification, route/link checks, responsive overflow checks, basic accessibility, and representative desktop/mobile inspection.

Pixel fidelity to an older production composition, UI-v3 baselines, or generated mockup imagery is not an acceptance criterion.
