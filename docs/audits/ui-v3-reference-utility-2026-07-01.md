# UI v3 Reference, Long-form, and Utility audit

Date: 2026-07-01  
Roadmap item: PR #269

## Page families

### Reference

- `/models/`
- `/glossary/`
- `/updates/`

These routes use scan-friendly Editorial Ledger indexes, ruled records, desktop tables where exact comparison matters, and compact mobile representations.

### Long-form

- `/methodology/`
- `/about/`

These routes use a readable article column, desktop contents rail, generated on-page table of contents, mobile disclosure behavior, editorial tables, and restrained project navigation.

### Utility

- `/contact/`
- `/support/`

`/contact/` remains the canonical Corrections and submissions route. No separate `/corrections/` route is introduced. Google Form and GitHub reporting paths remain distinct. `/support/` preserves all wallet records, networks, addresses, copy controls, fallback copy behavior, warnings, and correction links.

## Removed composition

- legacy hero panels;
- KPI stats panels;
- repeated rounded mini-card defaults;
- dark gradient Contact emphasis;
- dark wallet cards and glow-like utility styling;
- generic identical composition across reference, long-form, and utility pages.

## Preservation

- Canonical stable assets changed: 0.
- Organizations, relationships, events, evidence, reserves, deployments, guides, updates, and known-unknown records changed: 0.
- Public routes changed: 0.
- Contact URLs changed: 0.
- Support wallet assets, networks, and addresses changed: 0.
- Logo assets changed: 0.
- Machine-readable schema changed: 0.

## Validation

`scripts/validate-ui-v3-reference-utility.mjs` is invoked by the existing guide validation gate used by normal production builds. It verifies page-family routing, shared mastheads, reference indexes, long-form contents navigation, protected methodology and about sections, Contact reporting paths, Support wallet and copy behavior, responsive treatment, and prohibited v2 decoration.

## Acceptance

Gate V3-D may pass only after Astro check, production build, site architecture, responsive accessibility, public consistency, and all existing pull-request workflows succeed for the final PR #269 head commit.
