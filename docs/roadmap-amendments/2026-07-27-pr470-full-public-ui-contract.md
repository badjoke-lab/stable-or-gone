# Roadmap amendment — PR #470 full public UI contract

Date: 2026-07-27  
Status: owner-directed active remediation  
Authority: `docs/ui-v3-remediation-authority.md`

## Reason

The accepted UI V3 regression baseline remained technically valid, but later review found that its implementation still depended on a large multi-generation CSS cascade and inconsistent page-family presentation.

The merged `main` baseline after PR #472 contained:

```text
CSS files: 78
CSS source bytes: 649,819
CSS source lines: 19,796
!important declarations: 4,905
shared built CSS bundle: 199,266 bytes
```

Exhaustive screenshot success did not prove that page families shared one maintainable visual contract. It proved only that the existing rendered pages passed the configured capture, color, readability, overflow, and empty-state checks.

## Authorization

Authorize one bounded material UI work item:

```text
PR #470 — Full Public UI Contract
PRODUCTION VISUAL VERIFICATION
```

PR #470 replaces the accumulated public CSS cascade with one physical stylesheet and one import while retaining the accepted dark registry direction.

It applies the same shell, typography roles, interaction palette, status badges, page mastheads, section rhythm, tables, mobile records, disclosures, and responsive behavior to every existing public route family.

## Required route families

```text
Home
Stablecoin index and pagination
Stablecoin detail
Event index and pagination
Event detail
Organization index and pagination
Organization detail
Guides and guide articles
Methodology and About
Glossary and Models
Timeline
Statistics
Compare
Access and Regulation
Maintenance
Update feed and update articles
Contact, Support, and 404
Shared header, navigation, search, footer, forms, tables, badges, and mobile records
```

## Preserved boundaries

- no canonical record or count change;
- no route addition or removal;
- no sitemap, metadata, JSON, manifest, or machine-readable semantic change;
- no Market Access or monitoring publication change;
- no ranking, score, safety claim, or recommendation;
- PR #472's simplified Event hierarchy and visible mobile Evidence remain preserved;
- `docs/ui-v3-remediation-authority.md` remains the minimum regression contract.

## Exit gate

- exactly one physical public CSS file;
- exactly one CSS import;
- zero Astro style blocks;
- zero inline style attributes;
- no phase, correction, final-override, or legacy stylesheet entrypoint;
- no `!important` declarations in the public stylesheet;
- all public routes build;
- all public routes pass desktop and mobile capture, computed-color, readability, hierarchy, overflow, image, empty-state, and runtime UI-contract checks;
- representative pages from every route family are inspected directly on desktop and mobile;
- production deployment and deployed-commit parity are verified after merge.

## Workstream ordering

PR #467 remains a separately authorized canonical data-growth item and must not be mixed into PR #470. It remains paused until PR #470 is merged and production-verified.

