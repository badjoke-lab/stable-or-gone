# Stable or Gone Agent Instructions

This file is the mandatory entry point for humans, AI agents, and automation working in this repository.

## Required reading order

Before changing code, data, workflows, or documentation, read:

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. the canonical plan for the active work item
6. the relevant data or UI specification
7. any queue, validator, audit, and baseline named by the work item

For the active non-UI quality program, also read:

```text
docs/quality/non-ui-quality-program.md
docs/stable-asset-scope.md
docs/classification-spec.md
docs/data-model-v3-spec.md
docs/stats-spec.md
docs/migration/registry-v3-baseline.json
```

For later UI work, read:

```text
docs/ui-redesign/master-spec.md
docs/architecture/approved-modern-data-product-ui-v2.md
docs/ui-redesign/implementation-plan.md
docs/public-taxonomy-spec.md
```

For data work, inspect current generated statistics, the protected baseline, the integrity audit, and the exact quality queue before editing canonical records.

## Repository source of truth

Repository specifications outrank chat memory, handoff prose, external mock copies, issue discussion, and unmerged drafts.

A decision becomes binding only when the relevant canonical repository document is updated and merged. If implementation conflicts with a canonical specification, treat the implementation as defective until the specification is deliberately changed through review.

The document-authority and change-control rules are in `docs/spec-governance.md`.

## Current workstream

The active workstream is the non-UI quality program in:

```text
docs/quality/non-ui-quality-program.md
```

Before starting or continuing work, read the `Current position` and `Immediate work` sections of `docs/roadmap.md`, then confirm the same PR item in the active implementation plan.

The UI program is paused after PR #216 because detailed owner visual review is temporarily unavailable. The current UI is an intermediate repository state. Gate V2-F is not passed, no release candidate is selected, and production publication is not authorized.

Routine growth beyond 92 canonical stable assets is paused. Do not start Batch 18 or resume a final-eight path without a deliberate roadmap amendment.

## Non-UI quality rules

- Cite the exact queue, validator, audit, schema, and baseline used by each PR.
- Keep unknown values unknown unless reviewed evidence supports a canonical value.
- Do not coerce month- or year-level evidence into a day-level date.
- Do not use exchange listing, rebrand, migration start, testnet, or guarded access as a default launch boundary.
- Do not use depeg, last commit, last website capture, or migration opening as a default terminal boundary.
- Preserve evidence relations, known unknowns, deployments, and source identities.
- Monitoring output is candidate material only and must not write directly to canonical public data.
- A quality PR may validly preserve a queue item after strengthening its source trail.

## Visual authority

The active visual and page-layout authority remains:

```text
docs/architecture/approved-modern-data-product-ui-v2.md
```

`docs/architecture/visual-system-and-mocks-v1.md` is historical and must not override v2.

No agent may:

- invent a new visual direction;
- substitute another logo;
- redesign a page from memory;
- implement mock-only data as canonical data;
- alter the UI pause or PR sequence without updating the roadmap and relevant plan.

Stablecoin identity uses a reviewed local official logo when available and approved; otherwise it uses the ticker fallback. Organizations and events do not use initials or circular letter fallbacks. Do not hotlink or generate imitation logos.

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
- invent undocumented taxonomy, route, UI, monitoring, or missing-value behavior;
- use externally hosted or unverified coin logos;
- create public filter categories from arbitrary free-text values;
- hide material mobile information through generic numbered-column rules;
- change the approved PR sequence without updating the plan and roadmap;
- use conversation history as a substitute for repository specifications;
- automatically publish monitored candidates into canonical data.

## Deployment classifications

Every pull request must use one classification:

1. **No production deployment required** — default for documentation, data, validation, workflow, monitoring-candidate, and non-emergency code changes.
2. **Publication checkpoint deployment required after explicit approval** — only for a defined public release.
3. **Emergency production deployment required** — only for verified public breakage, security issues, or materially incorrect public state.

## Pull-request discipline

- Start from the latest confirmed `main`.
- Keep each PR within one approved responsibility.
- Cite the exact active plan item and relevant canonical specification.
- Run normal repository validation before merge.
- Remove temporary artifacts unless the active plan explicitly retains them.
- Update `docs/roadmap.md` when current position or sequence changes.
- Update the relevant canonical specification when semantics, routes, information hierarchy, missing-value rules, monitoring behavior, or machine-readable output change.
- Preserve canonical record-group counts unless an explicit audited migration approves a change.
- State the deployment classification in the PR body.

Every non-trivial PR body must include:

```text
Specification references
Roadmap item
Scope and non-scope
Data-preservation checks
Validation performed
Deployment classification
```

A PR that cannot cite its approved specification and roadmap item must be paused.

## Current publication architecture

```text
GitHub Actions builds and validates the repository
→ a manual workflow uploads the prebuilt dist directory with Wrangler
→ production consistency verifies the public origin
```
