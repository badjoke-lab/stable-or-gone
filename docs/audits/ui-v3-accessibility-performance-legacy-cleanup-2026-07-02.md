# UI v3 accessibility, performance, and legacy cleanup audit

Date: 2026-07-02
Roadmap item: PR #272
Status: execution pending

## Scope

PR #272 removes only superseded UI v2 presentation assets after every public page family has moved to Editorial Ledger v3 and Gate V3-F has passed.

Removed legacy files:

```text
src/components/PageHero.astro
src/components/MetricCard.astro
src/styles/editorial-v2.css
```

The shared layout no longer imports `editorial-v2.css`. `editorial-ledger-v3.css` retains only active generic paper, ink, accent, control, table, and forced-colors rules; old `.page-hero` and `.metric-card` compatibility overrides are removed.

## Accessibility preservation

The cleanup must preserve:

- skip-link access to `#main-content`;
- one focusable main landmark per page;
- visible keyboard focus;
- Escape close and focus return for controlled disclosures;
- polite success and failure announcements for copy controls;
- 44-pixel interactive targets where required;
- 320-pixel layout support;
- 200 percent zoom information preservation;
- long identifier wrapping;
- reduced-motion behavior;
- forced-colors behavior;
- all twenty-five protected mobile table contracts.

## Static legacy guard

`scripts/validate-ui-v3-cleanup.mjs` must fail when:

- one of the removed files returns;
- source code references `PageHero`, `MetricCard`, `editorial-v2.css`, `.page-hero`, or `.metric-card`;
- active v3 stylesheets are not loaded;
- required accessibility markers disappear;
- CI no longer runs the cleanup or post-build audit.

## Performance budgets

`scripts/audit-ui-v3-cleanup-performance.mjs` runs after the production build and records source and built asset sizes.

Initial performance budgets:

```text
source CSS total: <= 250,000 bytes
built CSS total: <= 500,000 bytes
largest CSS asset: <= 220,000 bytes
built JavaScript total: <= 500,000 bytes
largest JavaScript asset: <= 250,000 bytes
built HTML files: >= 350
```

These are regression ceilings, not performance claims. A later PR may tighten them only after recording a new measured baseline.

The audit also verifies:

- no legacy Hero/KPI marker appears in CSS, JavaScript, or rendered HTML;
- all required unique public routes are generated;
- each required route retains a skip link, main landmark, and exactly one H1;
- JSON and Markdown performance reports are uploaded from CI.

## Representative screenshot regression

PR #272 must rerun the PR #271 representative screenshot regression:

- twelve unique public pages on desktop and mobile;
- three stablecoin, organization, event, and guide details per device;
- 48 full-page images total;
- rendered overflow, broken-image, brand, legacy-marker, empty-state, H1, and main-landmark checks.

The cleanup is not complete until the new rendered audit reports zero failures and image review finds no visible regression caused by removing the v2 layer.

## Preservation

- Canonical stable assets changed: 0.
- Organization, relationship, event, evidence, reserve, deployment, guide, update, and known-unknown records changed: 0.
- Public routes changed: 0.
- Logo assets changed: 0.
- Contact and support destinations changed: 0.
- Machine-readable schema changed: 0.
- Support wallet values changed: 0.

## Completion rule

PR #272 may merge only after:

- the static cleanup validator passes;
- all normal pull-request workflows pass;
- Astro check and the production build pass;
- the post-build performance audit passes and publishes measurements;
- public output and machine-readable parity checks pass;
- the representative desktop/mobile screenshot regression passes;
- the audit record is updated with actual measurements and human review findings.
