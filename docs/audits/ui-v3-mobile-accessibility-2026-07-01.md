# UI v3 Mobile and Accessibility Hardening Audit

Date: 2026-07-01  
Roadmap item: PR #270  
Gate: V3-E

## Scope

- Expand the responsive contract from eight to eleven Editorial Ledger page families.
- Require compact mobile representations for all 25 protected table kinds.
- Preserve every original server-rendered table and its horizontal-scroll fallback.
- Keep the existing 17 explicit compact representations.
- Generate equivalent compact records for the remaining eight tables from their server-rendered headers and values.
- Add complete identifier copy actions and polite success/failure feedback for generated deployment records.
- Synchronize `aria-expanded` and `aria-controls` for navigation, contents, and native disclosure controls.
- Close open disclosures on Escape and return focus to their trigger.
- Move focus to same-page section targets without trapping it.
- Enforce 320px layout support, 200 percent zoom support, long-value wrapping, minimum 44px targets, reduced motion, forced colors, and text-size adjustment.

## Protected table result

```text
Protected table kinds: 25
Explicit compact representations: 17
Generated compact representations: 8
Pending compact transformations: 0
Full server-rendered tables retained: 25
Horizontal-scroll fallbacks retained: 25
```

The generated representations cover:

- stablecoin record coverage;
- issuer-control events;
- stablecoin event timeline;
- deployments;
- stablecoin evidence sources;
- value-state methodology;
- primary-display relationship methodology;
- evidence-source identity methodology.

## Page-family result

```text
Home
Stablecoin index
Organization index
Event index
Stablecoin dossier
Organization detail
Event detail
Guide index
Guide article
Reference / Long-form
Utility
```

## Preservation

- Canonical stable assets changed: 0.
- Organizations, relationships, events, evidence, reserve reports, deployments, guides, updates, support wallets, and known unknowns changed: 0.
- Public routes changed: 0.
- Contact paths changed: 0.
- Logo assets changed: 0.
- Machine-readable schema changed: 0.

## Validation

- `scripts/validate-ui-v3-mobile-accessibility.mjs`
- `scripts/collect-responsive-accessibility-audit.mjs`
- `scripts/validate-responsive-accessibility-contract.mjs`
- existing mobile table identity, protected-field, CSS preservation, evidence, value-state, and primary-display validators;
- Astro check and production build;
- all existing pull-request workflows.

## Acceptance

Gate V3-E may pass only after all pull-request workflows succeed for the final PR #270 head commit. Representative visual approval remains Gate V3-F and belongs to PR #271.
