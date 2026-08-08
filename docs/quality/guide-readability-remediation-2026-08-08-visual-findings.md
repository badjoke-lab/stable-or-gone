# Guide Readability Remediation — Production Visual Findings

Date: 2026-08-08  
Status: blocking input to `docs/quality/guide-readability-remediation-2026-08-08-spec.md`

## Reviewed production routes

```text
https://www.stableorgone.com/
https://www.stableorgone.com/guides/global-stablecoin-regulation-2026/
https://www.stableorgone.com/guides/uk-stablecoin-capital-rules-2026/
```

## Finding

The home page remains structurally usable, but the Research & Guides secondary composition is visibly unbalanced because a three-item set is rendered as a two-column grid with an orphaned half-width final card.

Both the new global 2026 regulation guide and the pre-existing UK stablecoin guide exhibit the same Guide-system failure. This demonstrates a shared layout/style defect rather than a problem isolated to the PR #531 article content.

Observed shared defects:

- persistent desktop left TOC rail reduces useful reading and table width;
- the article body remains constrained to a narrow maximum despite data-heavy tables;
- primary sections can visually read like small metadata labels because `.bar` remains a monospace overline treatment when promoted to an `h2`;
- repeated full panel borders make the article resemble an audit form or spreadsheet rather than readable research;
- long tables become excessively narrow and vertically deep;
- the contextual Guide support callout and generic footer support callout duplicate the same action;
- the contextual support callout can occupy the narrow left grid column instead of the article width;
- the resulting full-page composition is unnecessarily long and visually dense.

## Decision

These are blocking product-design defects under `docs/ui-v3-remediation-authority.md`.

Automated screenshot generation, color/contrast checks, geometry checks, build success, and workflow success are not sufficient acceptance evidence when direct artifact review has identified a blocking defect.

The repair must be shared-system work and must be visually re-reviewed at desktop and mobile widths before merge and again after production deployment where required by the active deployment policy.
