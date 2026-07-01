# UI v3 accessibility, performance, and legacy cleanup audit

Date: 2026-07-02
Roadmap item: PR #272
Status: passed
Contract keywords: performance budgets; representative screenshot regression.

## Scope completed

PR #272 removed only superseded UI v2 presentation assets after every public page family had moved to Editorial Ledger v3 and Gate V3-F had passed.

Removed legacy files:

```text
src/components/PageHero.astro
src/components/MetricCard.astro
src/styles/editorial-v2.css
src/styles/home-v2.css
```

Removed unused compatibility rules:

```text
.page-hero*
.metric-card*
.metric-card__icon
```

The shared layout no longer imports `editorial-v2.css`. `editorial-ledger-v3.css` retains only active generic paper, ink, accent, control, table, and forced-colors rules. `shell.css` now moves directly from active identity badges to the active support banner without the obsolete Hero/KPI block.

## Execution record

```text
Validated head: 9f6fe0442cd6af9c1e377e7a01188b607da956f0
CI workflow run: 28551291012
Cleanup/performance artifact: 8023911796
Cleanup/performance artifact digest: sha256:d0f12d2ff536f5e115eca973da6d0b8eb53d876b088cbf90cb24c7ded8361cd3
Representative screenshot run: 28551291000
Representative screenshot artifact: 8023928006
Representative screenshot artifact digest: sha256:2c02f029b6315d00c82c470d53409d0ed4b3c8d9f8105795b55087168ddd8aaa
```

## Accessibility preservation

The source-level cleanup validator passed with 140 source files scanned and zero failures. It confirmed preservation of:

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

The repository Responsive accessibility contract also passed on the final head.

## Static legacy guard

`scripts/validate-ui-v3-cleanup.mjs` now fails when:

- one of the removed files returns;
- production source references `PageHero`, `MetricCard`, `editorial-v2.css`, `.page-hero`, or `.metric-card`;
- active v3 stylesheets are not loaded;
- required accessibility markers disappear;
- CI no longer runs the cleanup or post-build audit.

The final source scan found none of the prohibited markers.

## Performance budgets and measurements

`scripts/audit-ui-v3-cleanup-performance.mjs` passed after the production build.

| Measurement | Actual | Ceiling |
| --- | ---: | ---: |
| Source CSS total | 128,528 bytes / 19 files | 250,000 bytes |
| Built CSS total | 111,078 bytes / 8 files | 500,000 bytes |
| Largest CSS asset | 50,805 bytes | 220,000 bytes |
| Built JavaScript total | 16,203 bytes / 3 files | 500,000 bytes |
| Largest JavaScript asset | 7,111 bytes | 250,000 bytes |
| Built HTML files | 378 | minimum 350 |
| Required unique routes checked | 12 | 12 |

Largest assets:

```text
dist/_astro/BaseLayout.Cc4yAeYv.css — 50,805 bytes
dist/_astro/index.astro_astro_type_script_index_0_lang.CjE1zJ62.js — 7,111 bytes
```

The post-build audit reported zero failures and zero warnings. It also confirmed:

- no legacy Hero/KPI marker in CSS, JavaScript, or rendered HTML;
- all twelve required unique routes generated;
- a skip link and main landmark on every required route;
- exactly one H1 on every required route;
- 378 generated HTML files.

These budgets are regression ceilings, not broader performance claims. A later PR may tighten them only after recording a replacement measured baseline.

## Representative screenshot regression

The final head reran the PR #271 representative contract:

- 378 public routes discovered;
- twelve unique public pages captured per device;
- three stablecoin, organization, event, and guide details captured per device;
- 24 routes captured on desktop and 24 on mobile;
- 48 full-page images total;
- zero capture failures;
- zero horizontal overflow;
- zero broken images;
- zero unapproved brand assets;
- zero legacy visual markers;
- zero false initial empty states;
- exactly one H1 and one main landmark on each selected page.

Human review covered the unique-page and repeated-detail contact sheets on both desktop and mobile. Hierarchy, clipping, density, controls, tables, disclosures, and approved logo use remained intact.

A pixel comparison against the earlier passing PR #272 capture found **0 changed images out of 48**. The final cleanup was therefore pixel-identical to the already approved rendered state; the deleted selectors and files had no effect on public rendering.

## Workflow result

All twenty pull-request workflows succeeded on the final rendered head, including:

- CI;
- Public consistency;
- Responsive accessibility contract;
- Global shell completion;
- Stablecoin index and dossier contracts;
- Organization index and detail contract;
- Site architecture;
- Registry integrity;
- Representative full-page screenshot capture.

Astro check, production build, deployment output verification, public-layer verification, the source cleanup validator, and the post-build performance audit all passed.

## Preservation

- Canonical stable assets changed: 0.
- Organization, relationship, event, evidence, reserve, deployment, guide, update, and known-unknown records changed: 0.
- Public routes changed: 0.
- Logo assets changed: 0.
- Contact and support destinations changed: 0.
- Machine-readable schema changed: 0.
- Support wallet values changed: 0.

## Result

PR #272 cleanup passed. The superseded production v2 presentation layer is removed, accessibility contracts are preserved, measured performance ceilings are enforced, and the final rendered output is pixel-identical to the approved pre-cleanup state. PR #273 may proceed to exact release-candidate approval, production deployment verification, provenance/parity checks, and UI v3 closure.
