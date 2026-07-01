# Stable or Gone Agent Instructions

This file is the mandatory entry point for humans, AI agents, and automation working in this repository.

## Required reading order

Before changing code, data, workflows, or documentation, read:

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. the canonical plan for the active work item
6. the relevant data, monitoring, editorial, or UI specification
7. every queue, validator, audit, fixture, and baseline named by the work item

For the active UI remediation, also read:

```text
docs/ui-redesign/master-spec.md
docs/architecture/approved-editorial-ledger-ui-v3.md
docs/ui-redesign/approved-mocks-v3/README.md
docs/ui-redesign/implementation-plan.md
docs/public-taxonomy-spec.md
DESIGN.md
```

For data work, also read:

```text
docs/stable-asset-scope.md
docs/classification-spec.md
docs/data-model-v3-spec.md
docs/stats-spec.md
docs/migration/registry-v3-baseline.json
```

For monitoring work, also read:

```text
docs/quality/monitoring-pipeline-spec.md
docs/quality/monitoring-official-source-spec.md
docs/quality/monitoring-official-source-schema.md
docs/quality/monitoring-review-material-spec.md
```

## Repository source of truth

Repository specifications outrank chat memory, handoff prose, external mock copies, issue discussion, and unmerged drafts.

A decision becomes binding only when the relevant canonical repository document is updated and merged. If implementation conflicts with a canonical specification, treat the implementation as defective until the specification is deliberately changed through review.

Document authority and change control are defined in `docs/spec-governance.md`.

## Current workstream

The active workstream is the Editorial Ledger UI v3 remediation defined by:

```text
docs/architecture/approved-editorial-ledger-ui-v3.md
docs/ui-redesign/implementation-plan.md
docs/roadmap.md
```

Current position:

```text
Latest completed: PR #263 Editorial Ledger Home
Active: PR #264 Stablecoins register
Next: PR #265 Stablecoin dossier
Canonical stable assets: 98
Growth D PR #251: stale draft; do not merge as-is
Gate V3-A: passed
Gate V3-B: passed
Gate V3-F: not passed
Production publication: automatic on main
```

The former UI v2 Modern Data Product direction is superseded. Its implementation through PR #216 remains an intermediate repository state and may be reused only for data mapping, routes, behavior, accessibility, and approved logo assets where compatible with v3.

The shared shell and Home are now v3. Stablecoins, dossiers, Organizations, Events, Guides, reference pages, and final mobile behavior remain active migration work. Do not treat the current state as redesign completion.

Growth D, the 100-record audit, and non-UI release preparation are paused through the UI v3 closure sequence. Urgent factual corrections, source-backed editorial corrections, verified public breakage, and security fixes may interrupt through a narrow PR.

## Visual authority

The binding visual and page-layout authority is:

```text
docs/architecture/approved-editorial-ledger-ui-v3.md
```

The active reference direction is:

```text
docs/ui-redesign/approved-mocks-v3/README.md
```

The following are historical and must not override v3:

```text
docs/architecture/approved-modern-data-product-ui-v2.md
docs/ui-redesign/approved-mocks-v2/
docs/architecture/visual-system-and-mocks-v1.md
```

No agent may:

- invent another visual direction;
- substitute or generate another logo;
- redesign a page from memory;
- use the rejected dashboard mock direction;
- reintroduce oversized heroes, KPI-card rows, blue-purple glow, or repeated rounded-card composition as defaults;
- implement mock-only data as canonical data;
- alter the active UI sequence without updating the roadmap and implementation plan.

The existing approved S/G production assets must be reused:

```text
public/brand/sog-lockup-on-light.svg
public/brand/sog-lockup-on-dark.svg
public/brand/sog-mark-on-light.svg
public/brand/sog-mark-on-dark.svg
```

Stablecoin identity may use a reviewed local official logo when available and approved; otherwise it uses the existing ticker fallback. Do not hotlink or generate imitation coin or organization logos.

## UI v3 operating rules

- The default public surface is a light paper-like background with dark ink.
- Typography, rules, spacing, columns, and hierarchy replace dashboard panels as the main visual tools.
- Home is a registry front page, not a product landing page.
- Stablecoins use a table-first public register.
- Stablecoin details use a research dossier.
- Organizations use responsible-body records.
- Events use incident/public-record files.
- Guides use a distinct editorial article layout.
- Reference, long-form, and utility page families must not collapse into one generic card template.
- Mobile is a deliberate transformation and must retain protected information.
- Screenshot audit uses representative mode by default; repeated detail templates are sampled rather than exhaustively captured.

## Data and quality rules

- Cite the exact queue, validator, audit, schema, fixture, and baseline used by each PR.
- Keep unknown values unknown unless reviewed evidence supports a canonical value.
- Do not coerce month- or year-level evidence into a day-level date.
- Preserve evidence relations, known unknowns, deployments, source identities, and value states.
- UI work must not clear quality queues through hiding, defaults, or relabeling.
- Monitoring output is candidate material only and must not write directly to canonical public data.
- Monitoring executions remain read-only and may not update their own accepted baseline.
- A baseline change requires a separate human-reviewed repository change.
- Metadata-only changes and fetch failures must not masquerade as content changes.
- Canonical record-group counts remain unchanged unless an explicit audited data PR authorizes a change.
- The old PR #251 must not be merged as-is. Growth D must be rebuilt from the latest main after UI v3 closes.

## Mock-only exclusions

Do not add the following merely because they appear in a mock or design discussion:

- live prices;
- market capitalization;
- circulating supply;
- holder or transfer counts;
- market charts;
- growth deltas;
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
- unsupported licensing or legal claims.

Only canonical data, approved editorial copy, generated canonical counts, and separately approved sourced integrations may become public claims.

## Non-negotiable deployment rule

Development and production publication are connected by the automatic `main` publication workflow.

- GitHub CI success is the completion condition for pull-request development work.
- A normal pull request must not wait for Cloudflare Pages.
- A normal `main` merge triggers the production deployment workflow automatically.
- Ordinary guide, copy, UI, workflow, validation, and reviewed data changes deploy through `.github/workflows/deploy-production.yml` on `main` push.
- Manual deployment is a fallback only for infrastructure interruption or reserved exceptions such as DNS, secrets, Cloudflare account changes, destructive schema migration, mass deletion, major route removal, or emergency rollback.
- Production success may not be claimed before the deployed commit and public parity are verified.

The canonical policy is `docs/deployment-policy.md`.

## Prohibited behavior

Do not:

- enable Cloudflare Pages source-build publication outside the approved GitHub Actions upload path;
- add production deployment commands to pull-request CI or data-only workflows;
- use no-op commits to trigger publication;
- retry an obsolete deployment after source changes;
- reduce data, evidence, or validation requirements;
- invent undocumented taxonomy, route, UI, monitoring, baseline, or missing-value behavior;
- use externally hosted or unverified logos;
- create public filter categories from arbitrary free-text values;
- hide material mobile information through generic numbered-column rules;
- change the approved PR sequence without updating the plan and roadmap;
- use conversation history as a substitute for repository specifications;
- automatically publish monitored candidates into canonical data;
- let a monitoring execution mutate its accepted baseline;
- claim publication before the automatic deployment for the intended `main` commit succeeds.

## Deployment classifications

Every pull request must use one classification:

1. **Automatic production deployment on main** — default for ordinary guide, copy, UI, workflow, validation, and reviewed data changes after merge.
2. **Manual approval required before merge or dispatch** — only for DNS, secret, Cloudflare account, destructive schema migration, mass deletion, or major route-removal work.
3. **Emergency production deployment required** — only for verified public breakage, security issues, materially incorrect public state, or rollback.

## Pull-request discipline

- Start from the latest confirmed `main`.
- Keep each PR within one approved responsibility.
- Cite the exact active plan item and relevant canonical specification.
- Run normal repository validation before merge.
- Remove temporary artifacts unless the active plan explicitly retains them.
- Update `docs/roadmap.md` when current position or sequence changes.
- Update the relevant canonical specification when semantics, routes, information hierarchy, missing-value rules, monitoring behavior, baseline behavior, machine-readable output, or visual authority changes.
- Preserve canonical record-group counts unless an explicit audited data PR approves a change.
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

A PR that cannot cite its approved specification and roadmap item must pause.

## Current publication architecture

```text
GitHub Actions validates pull requests
-> a main push runs the production deployment workflow
-> Wrangler uploads the prebuilt dist directory
-> production consistency verifies the public origin
```
