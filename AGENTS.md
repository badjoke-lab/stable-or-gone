# Stable or Gone Agent Instructions

This file is the mandatory entry point for humans, AI agents, and automation working in this repository.

## Required reading order

Before changing code, data, workflows, or documentation, read:

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. the canonical specification and implementation plan for the current work item
6. any audit or baseline named by that work item

For the active UI v2 program, also read in this order:

```text
docs/ui-redesign/master-spec.md
docs/architecture/approved-modern-data-product-ui-v2.md
docs/ui-redesign/implementation-plan.md
docs/public-taxonomy-spec.md
```

For page-specific work, open the approved repository reference image named by the v2 contract before changing layout or visual presentation.

For data work, inspect current generated statistics, the protected baseline, and the integrity audit before editing canonical records.

## Repository source of truth

Repository specifications outrank chat memory, handoff prose, external mock copies, issue discussion, and unmerged drafts.

A decision becomes binding only when the relevant canonical repository document is updated and merged. If implementation conflicts with a canonical specification, treat the implementation as defective until the specification is deliberately changed through review.

The document-authority and change-control rules are in `docs/spec-governance.md`.

## Visual authority

The active visual and page-layout authority is:

```text
docs/architecture/approved-modern-data-product-ui-v2.md
```

`docs/architecture/visual-system-and-mocks-v1.md` is historical and must not override v2.

No agent may:

- invent a new visual direction;
- substitute another logo;
- redesign a page from memory;
- implement mock-only data as canonical data;
- skip the approved page reference;
- alter the PR sequence without updating both the implementation plan and roadmap.

## Current workstream

The approved workstream is the Modern Data Product UI v2 implementation program.

The current step is not maintained independently in this file. Before starting or continuing work, read the `Current position` and `Immediate work` sections of `docs/roadmap.md`, then confirm the same PR item in `docs/ui-redesign/implementation-plan.md`.

As of 2026-06-28, the active scheduled item is PR #210: implement the approved Stablecoins index from `docs/ui-redesign/approved-mocks-v2/02-stablecoin-index.webp`.

Routine growth beyond 92 canonical stable assets is paused until the plan permits it. Do not start Batch 18 or resume the final-eight path to 100 without a deliberate roadmap amendment after the 92-record v2 audit.

Verified emergency repairs may interrupt the sequence only under `docs/deployment-policy.md` and must be recorded in `docs/roadmap.md`.

## Approved UI direction

The approved UI is a dark-navy, bright-blue, search-first modern data product.

The approved desktop reference set covers:

```text
Home
Stablecoins index
Stablecoin detail
Organizations index
Organization detail
Events index
Event detail
Methodology and editorial family
```

The approved brand is the S/G monogram crossed by a horizontal line with a short coral broken segment on the right. The rejected stacked-cube logo must not be used.

Stablecoin and organization identity defaults to ticker or initial badges. Official marks require local storage, source attribution, and verification. Do not hotlink or generate imitation logos.

## Mock-only exclusions

Do not add the following merely because they appear in a reference mock:

- live prices;
- market capitalization;
- circulating supply;
- holder or transfer counts;
- market charts;
- monthly growth deltas;
- saved views;
- watchlists;
- follow buttons;
- user accounts;
- recently viewed history;
- unsupported verification badges;
- transparency or safety scores;
- invented reserve totals;
- invented evidence counts;
- invented relative timestamps;
- unsupported licensing claims.

Only canonical data, approved editorial copy, and separately approved sourced integrations may become public claims.

## Non-negotiable deployment rule

Development and production publication are separate processes.

- GitHub CI success is the completion condition for normal development work.
- A normal pull request must not wait for Cloudflare Pages.
- A normal `main` merge must not trigger or wait for production deployment.
- Production deployment is allowed only through the manual production workflow at a defined publication checkpoint or for an approved emergency.
- Production verification runs only after a deliberate deployment.
- Production success may not be claimed before the deployed commit and public parity are verified.

The canonical policy is `docs/deployment-policy.md`.

## Prohibited behavior

Do not:

- enable automatic Cloudflare production or preview deployments;
- add production deployment commands to normal CI or data workflows;
- use no-op commits to trigger publication;
- retry an obsolete deployment after source changes;
- reduce data, evidence, or validation requirements;
- implement undocumented UI, taxonomy, route, or responsive behavior;
- implement a page without citing its approved v2 reference;
- substitute or regenerate the approved logo outside the approved asset process;
- use externally hosted or unverified coin logos;
- create public filter categories from arbitrary free-text values;
- hide material mobile information through generic numbered-column rules;
- change the approved PR sequence without updating the plan and roadmap;
- use conversation history as a substitute for repository specifications.

## Deployment classifications

Every pull request must use one classification:

1. **No production deployment required** — default for documentation, data, code, validation, and workflow changes.
2. **Publication checkpoint deployment required after explicit approval** — the defined UI v2 release checkpoint.
3. **Emergency production deployment required** — only for verified public breakage, security issues, or materially incorrect public state.

## Current UI v2 gate sequence

```text
92-record canonical checkpoint
→ approved v2 design contract and repository reference assets
→ shared visual foundation and approved brand assets
→ Home
→ Stablecoins index
→ Stablecoin detail
→ Organizations index and detail
→ Events index and detail
→ editorial and project family
→ mobile and accessibility hardening
→ 92-record and all-route UI audit
→ immutable candidate owner approval
→ manual production publication
→ production parity verification
```

## Pull-request discipline

- Start from the latest confirmed `main`.
- Keep each PR within one approved responsibility.
- Cite the exact approved v2 page or component contract.
- Run normal repository validation before merge.
- Remove temporary artifacts unless the active plan explicitly retains them.
- Update `docs/roadmap.md` when current position or sequence changes.
- Update the relevant canonical specification when semantics, routes, information hierarchy, responsive behavior, or machine-readable output change.
- Preserve canonical record-group counts unless an explicit audited migration approves a change.
- State the deployment classification in the PR body.

Every non-trivial PR body must include:

```text
Specification references
Approved v2 page or component reference
Roadmap item
Scope and non-scope
Mock-only exclusions checked
Data-preservation checks
Validation performed
Deployment classification
```

A PR that cannot cite its approved specification section, v2 reference, and roadmap item must be paused.

## Current publication architecture

```text
GitHub Actions builds and validates the repository
→ a manual workflow uploads the prebuilt dist directory with Wrangler
→ production consistency verifies the public origin
```
