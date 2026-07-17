# Stable or Gone Roadmap

Updated: 2026-07-17  
Status: canonical execution schedule — PR #409 active

## Current position

```text
Canonical stable assets: 112
Organizations: 107
Relationships: 124
Events: 187
Evidence: 559
Evidence Relations: 559
Deployments: 174
Market Access Records: 8
Archive recorded: 430
Archive not recorded: 129
Issue #281 UI v3 rebuild: reopened
PR #408 Post-PR #407 Review Gate: complete
PR #409 UI v3 Rebuild A — design contract and failure gates: active; complete on merge
PR B global shell and navigation: blocked
REVIEW GATE: mandatory after PR #409
```

## Current authority

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/quality/post-pr407-review-gate-pr408-spec.md
docs/migration/post-pr407-review-gate-pr408.json
docs/quality/ui-v3-rebuild-design-contract-pr409.md
config/ui-v3-rebuild-design-contract-pr409.json
```

## Why UI v3 is reopened

The current implementation is technically valid but failed product-design review. The prior direction overemphasized an editorial masthead, used undersized typography, flattened distinct concepts into border-only panels, exposed long data dumps as primary browsing modes, and allowed skipped visual review to coexist with green workflows.

UI v3 is not complete.

## PR #409 design direction

```text
Direction: modern evidence registry
Body minimum: 16px
Dense table minimum: 14px
Touch target minimum: 44px
Primary index initial rows: at most 50
Pagination/bounded rendering required above: 100 rows
Required review widths: 320 / 390 / 768 / 1280 / 1440
Representative capture states: 14
Required owner-approved templates: 6
Skipped visual audit: hard failure
Automated rendering equals approval: false
```

## Required template priorities

- home: search, registry state, recent material changes, issue watch, exploration paths;
- stablecoin register: filters, selected states, chips, result count, sort, clear action, responsive browse and compare states;
- stablecoin dossier: status, redemption, backing/reserves, issuer/control, events, deployments, unresolved questions, evidence, then technical fields;
- events and organizations: bounded rendering, grouping, useful filters, clear severity/type or relationship distinctions;
- guides: reading width, table of contents, callouts, examples, section navigation, and source presentation.

## Visual acceptance boundary

Screenshot artifacts, desktop and mobile captures, a contact sheet, and explicit owner approval are all mandatory. A skipped audit, missing capture, or pending/rejected required approval blocks UI completion.

## Phase sequence

```text
PR A — design contract and failure gates: active
PR B — global shell and navigation: blocked
PR C — home and stablecoin register: blocked
PR D — stablecoin dossier: blocked
PR E — events and organizations: blocked
PR F — guides and secondary pages: blocked
PR G — full visual closure: blocked
```

PR #409 changes no production UI, routes, canonical data, or public machine-readable outputs.

After PR #409, stop at `REVIEW GATE`.
