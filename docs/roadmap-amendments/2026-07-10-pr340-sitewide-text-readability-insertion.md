# PR #340 site-wide text readability insertion

Status: active roadmap amendment  
Updated: 2026-07-10

## Purpose

PR #340 is inserted as a bounded UI-only readability remediation after the representative full-page screenshot review of the current dark visual system.

The insertion keeps the existing dark background, panel surfaces, rules, accent colors, registry data, statistics model, and comparison-readiness work unchanged. It only restructures the site-wide text hierarchy so continuous-reading copy is brighter than tertiary metadata and so the distinction between primary, body, muted, and quiet text is explicit and testable.

PR #338 Comparison Readiness normalization remains a separate open work item. PR #340 must not be used to alter PR #338 data, statistics history, or normalization scope.

## PR #340 boundary

PR #340 may change only:

- text color tokens and their role mapping;
- selectors that assign body, muted, or quiet text roles;
- representative text-contrast audit code;
- GitHub Actions validation for the text-contrast contract;
- documentation describing this insertion.

PR #340 must not change:

- canonical registry records;
- event, evidence, reserve, redemption, deployment, legal-profile, relationship, or known-unknown data;
- deterministic statistics calculations or history snapshots;
- lifecycle or classification semantics;
- Comparison Readiness normalization rows;
- Market Access Record schema or governance.

## Text hierarchy contract

The visual hierarchy is:

1. `ink` — headings, primary labels, canonical values;
2. `body` — prose and explanatory copy intended for continuous reading;
3. `muted` — secondary labels, navigation, notes, table headings, and support text;
4. `quiet` — dates, compact metadata, and tertiary context only.

The representative automated thresholds are:

- body text: at least 9.0:1;
- muted text: at least 7.0:1;
- quiet text: at least 5.5:1.

The representative audit covers desktop and mobile viewports across Home, USDT dossier, the EU MiCA guide, Methodology, About, and Statistics.

## Renumbered sequence

The active sequence after this insertion is:

- PR #338 — Comparison Readiness normalization;
- PR #339 — Japan stablecoin access guide and reviewed research checkpoint;
- PR #340 — site-wide text hierarchy and readability remediation;
- PR #341 — canonical Market Access Record schema and governance;
- PR #342 — facet-freshness derivation contract and validators;
- PR #343 — deterministic comparison projection and machine-readable output;
- PR #344 — `/compare/` v1;
- PR #345 — Compare presets;
- PR #346 — access and regulation index generator;
- PR #347 — Access & Regulation Explorer;
- PR #348 — change-timeline projection;
- PR #349 — Change Timeline UI;
- PR #350 — SOG Registry Update feed and page;
- PR #351 — Monthly Stablecoin Change Log;
- optional PR #352+ — natural-language filter translation or later bounded extensions.

## Exit criteria

PR #340 is complete only when:

1. the readability layer is loaded after the existing visual-system styles;
2. representative prose uses the body role rather than the generic muted role;
3. quiet text remains reserved for tertiary metadata;
4. the representative site-wide contrast audit passes on desktop and mobile;
5. the existing Stats contrast audit remains green;
6. full build, responsive accessibility, representative visual audit, and screenshot capture remain green;
7. no canonical data or statistics-history file changes are present.
