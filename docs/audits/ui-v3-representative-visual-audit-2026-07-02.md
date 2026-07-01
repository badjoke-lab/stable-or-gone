# UI v3 representative visual audit

Date: 2026-07-02
Roadmap item: PR #271
Gate: V3-F
Status: execution pending

## Purpose

This audit verifies the rendered Editorial Ledger UI rather than relying only on source markers. The pull request must build the current site, capture real full-page screenshots from the built output, measure the rendered DOM, and preserve the image artifacts for review.

## Required devices

- desktop: 1440 × 900
- mobile: 393 × 852

Both devices must use representative mode and reduced-motion rendering.

## Required unique pages

The following twelve routes must be captured on both devices:

```text
/
/stablecoins/
/issuers/
/events/
/models/
/guides/
/glossary/
/methodology/
/updates/
/about/
/support/
/contact/
```

## Required repeated-family samples

The audit must select and capture at least:

- three stablecoin detail records;
- three organization detail records;
- three event detail records;
- three guide articles.

Selection uses the existing representative quantile sampler so that short, medium, and long generated pages are included without capturing every repeated detail route.

## Automated rendered checks

Each selected page must satisfy:

- successful HTTP response and screenshot capture;
- exactly one `main` landmark;
- exactly one `h1`;
- no horizontal document overflow beyond a two-pixel rounding tolerance;
- no broken images;
- only approved Stable or Gone brand assets in the shared brand lockup;
- no visible legacy PageHero, MetricCard, blue-purple glow-art, or SaaS-dashboard markers;
- no initially visible false zero-result state on the three registry indexes;
- a non-empty screenshot file above the minimum diagnostic size.

## Human image review

The uploaded desktop and mobile images must also be reviewed for:

- hierarchy and reading order;
- clipped labels or values;
- false empty states that cannot be inferred from source markers;
- unexpected card or dashboard composition;
- logo misuse;
- excessive whitespace or unusable density;
- mobile table and disclosure legibility.

Automated checks are necessary but not sufficient for Gate V3-F.

## Outputs

```text
artifacts/screenshots/manifest.desktop.json
artifacts/screenshots/manifest.mobile.json
artifacts/screenshots/desktop/*.png
artifacts/screenshots/mobile/*.png
artifacts/screenshots-desktop.zip
artifacts/screenshots-mobile.zip
artifacts/screenshots/representative-visual-audit.json
artifacts/screenshots/representative-visual-audit.md
```

## Preservation

- Canonical stable assets changed: 0.
- Organization, relationship, event, evidence, reserve, deployment, guide, update, and known-unknown records changed: 0.
- Public routes changed: 0.
- Logo assets changed: 0.
- Contact and support destinations changed: 0.
- Machine-readable schema changed: 0.

## Gate rule

Gate V3-F remains pending until the pull-request screenshot workflow captures desktop and mobile representatives, the generated audit reports zero failures, the uploaded images receive human review, all normal pull-request workflows pass, and this document records the successful run and reviewed findings.
