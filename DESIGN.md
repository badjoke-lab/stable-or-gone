# DESIGN.md — Stable or Gone

Status: active UI redesign authority
Updated: 2026-09-09
Authority: `config/ui-redesign-v4-authority.json`
Detailed specification: `docs/UI-REDESIGN-SPEC.md`
Execution schedule: `docs/UI-REDESIGN-SCHEDULE.md`

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

The outgoing Terminal Registry / paper-derived treatments are not the redesign target.

Use a modern stablecoin observatory system:

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

Primary desktop product surfaces are Home, Stablecoin Register, Stablecoin Dossier, Compare, Material Events, Event Detail, Timeline, Stats, Issuer/Organization, Methodology/Data, Access & Regulation, Guides, Updates/Maintenance, and utility/legal surfaces.

Mobile is a first-class layout with bottom navigation, filter drawers, stacked record cards, vertical timelines, swipeable/stacked comparison, and one-chart-per-row analytics where appropriate.

## Data rule

Design never authorizes fabricated facts. All displayed values come from current canonical data or documented deterministic derived rules. Unsupported values remain explicit unknown/not-recorded states.

## Production rule

The existing public UI remains live on `main` until the complete redesign passes `docs/UI-REDESIGN-SCHEDULE.md` Gate 7. The redesign is then merged in one cutover under Gate 8 and production-verified.

## Acceptance

The new UI must pass data integrity, build, machine-readable/public-layer, route/link, responsive overflow, basic accessibility, and representative desktop/mobile browser checks.

Pixel fidelity to the outgoing UI, old UI-v3 layout baselines, and generated SVG mock fidelity are not redesign acceptance criteria.
