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

Repository specifications outrank chat memory, handoff prose, external mock copies, issue discussion, and unmerged drafts. A decision becomes binding only when the relevant canonical repository document is updated and merged.

## Current workstream

The active workstream is the Editorial Ledger UI v3 remediation defined by:

```text
docs/architecture/approved-editorial-ledger-ui-v3.md
docs/ui-redesign/implementation-plan.md
docs/roadmap.md
```

Current position:

```text
Latest completed: PR #270 mobile and accessibility hardening
Partial precursor: PR #266 Organization and Event row compaction
Active: PR #271 representative all-family visual audit
Next: PR #272 accessibility, performance, and legacy cleanup
Closure: PR #273 production verification and UI v3 closure
Canonical stable assets: 98
Growth D PR #251: stale draft; do not merge as-is
Gate V3-A: passed
Gate V3-B: passed
Gate V3-C: passed
Gate V3-D: passed
Gate V3-E: passed
Gate V3-F: passed
Production publication: automatic on main
```

The former UI v2 Modern Data Product direction is superseded. Its implementation through PR #216 may be reused only for data mapping, routes, behavior, accessibility, and approved logo assets where compatible with v3.

All page families now use Editorial Ledger v3 structures. PR #266 changed only two index-row components and remains a partial precursor. PR #267 completed Organizations and Events. PR #268 completed Guides. PR #269 completed Reference, Long-form, and Utility pages. PR #270 completed mobile and accessibility hardening and passed Gate V3-E. PR #271 completed the rendered desktop/mobile audit and passed Gate V3-F. Cleanup and production closure remain. Do not treat the current state as redesign completion.

Growth D, the 100-record audit, and non-UI release preparation are paused through PR #273. Urgent factual corrections, source-backed editorial corrections, verified public breakage, and security fixes may interrupt through a narrow PR.

## Visual authority

The binding visual and page-layout authority is:

```text
docs/architecture/approved-editorial-ledger-ui-v3.md
```

The active reference direction is:

```text
docs/ui-redesign/approved-mocks-v3/README.md
```

Historical references must not override v3:

```text
docs/architecture/approved-modern-data-product-ui-v2.md
docs/ui-redesign/approved-mocks-v2/
docs/architecture/visual-system-and-mocks-v1.md
```

No agent may:

- invent another visual direction;
- substitute or generate another logo;
- redesign a page from memory;
- use the rejected SaaS dashboard mock direction;
- reintroduce a giant hero, KPI card row, blue-purple glow, or repeated rounded-card composition as defaults;
- implement mock-only data as canonical data;
- alter the active UI sequence without updating the roadmap and implementation plan.

Approved production assets:

```text
public/brand/sog-lockup-on-light.svg
public/brand/sog-lockup-on-dark.svg
public/brand/sog-mark-on-light.svg
public/brand/sog-mark-on-dark.svg
```

Stablecoin identity may use a reviewed local official logo when available; otherwise use the ticker fallback. Do not hotlink or generate imitation coin or organization logos.

## UI v3 operating rules

- The default public surface is a light paper-like background with dark ink.
- Typography, rules, spacing, columns, and hierarchy replace dashboard panels.
- Home is a registry front page, not a product landing page.
- Stablecoins use a table-first public register.
- Stablecoin details use a research dossier.
- Organizations use responsible-body records.
- Events use incident/public-record files.
- Guides use a distinct editorial article layout with explicit publication value states and on-page contents navigation.
- Models, Glossary, and Updates use scan-friendly Reference indexes.
- Methodology and About use the Long-form family with readable width and contents navigation.
- Contact/Corrections and Support use the Utility family and must preserve reporting and payment functions.
- Mobile is a deliberate transformation and must retain protected information.
- Representative screenshot sampling is the default.
- Gate V3-F requires actual desktop and mobile image artifacts plus human review; static source checks alone are insufficient.
- PR #271 established the passing rendered visual regression baseline: 24 routes per device, 48 reviewed full-page images, and zero automated rendered failures.

## Data and quality rules

- Cite the exact queue, validator, audit, schema, fixture, and baseline used by each PR.
- Keep unknown values unknown unless reviewed evidence supports a value.
- Do not coerce month- or year-level evidence into a day-level date.
- Preserve evidence relations, known unknowns, deployments, source identities, and value states.
- UI work must not clear quality queues through hiding, defaults, or relabeling.
- Monitoring output is candidate material only and must not write directly to canonical public data.
- Monitoring executions remain read-only and may not update their own accepted baseline.
- Metadata-only changes and fetch failures must not masquerade as content changes.
- Canonical record-group counts remain unchanged unless an explicit audited data PR authorizes a change.
- Contact paths, wallet assets, networks, addresses, and copy functions must not change during visual or mobile hardening unless explicitly authorized.
- The old PR #251 must not be merged as-is. Growth D must be rebuilt from the latest main after UI v3 closes.

## Mock-only exclusions

Do not add mock-only live prices, market capitalization, circulating supply, holder counts, market charts, growth deltas, saved views, watchlists, accounts, follow buttons, unsupported badges, transparency or safety scores, invented reserve totals, invented evidence counts, invented timestamps, or unsupported legal claims.

Only canonical data, approved editorial copy, generated canonical counts, and separately approved sourced integrations may become public claims.

## Non-negotiable deployment rule

Development and production publication are connected by the automatic `main` publication workflow.

- GitHub CI success is the completion condition for pull-request development work.
- A normal pull request must not wait for Cloudflare Pages.
