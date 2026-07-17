# Stable or Gone Roadmap

Updated: 2026-07-17  
Status: canonical execution schedule — PR #417 active

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
PR #409 UI v3 Rebuild A — design contract and failure gates: complete
PR #410 Post-PR #409 Review Gate: complete
PR #411 UI v3 Rebuild B — global shell and navigation: complete
PR #412 Post-PR #411 Review Gate: complete
PR #413 UI v3 Rebuild C — home and stablecoin register: complete
PR #414 Post-PR #413 Review Gate: complete
PR #415 UI v3 Rebuild D — stablecoin dossier: complete
PR #416 Post-PR #415 Review Gate: complete
PR #417 UI v3 Rebuild E — events and organizations: active; complete on merge
PR F guides and secondary pages: blocked
REVIEW GATE: mandatory after PR #417
```

## Current authority

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/quality/ui-v3-rebuild-design-contract-pr409.md
config/ui-v3-rebuild-design-contract-pr409.json
docs/quality/post-pr411-review-gate-pr412-spec.md
docs/migration/post-pr411-review-gate-pr412.json
docs/quality/ui-v3-home-register-pr413.md
config/ui-v3-home-register-pr413.json
docs/migration/ui-v3-home-register-pr413-handoff.json
docs/quality/post-pr413-review-gate-pr414-spec.md
docs/migration/post-pr413-review-gate-pr414.json
docs/quality/ui-v3-stablecoin-dossier-pr415.md
config/ui-v3-stablecoin-dossier-pr415.json
docs/migration/ui-v3-stablecoin-dossier-pr415-handoff.json
docs/quality/post-pr415-review-gate-pr416-spec.md
docs/migration/post-pr415-review-gate-pr416.json
docs/quality/ui-v3-events-organizations-pr417.md
config/ui-v3-events-organizations-pr417.json
docs/migration/ui-v3-events-organizations-pr417-handoff.json
```

## PR #415 reviewed outcome

```text
Source implementation merge: e4af173ff3560e0474b8282de0ad8da4532d0f4a
Source implementation head: c632a4419da7a6e45645e75f5a3d87985cd0dbe8
Contract/build validation: success
Mandatory desktop/mobile visual audit: success
Visual review run: 29576352130
Visual artifact: 8405201944
Required captures: 6
Completed captures: 6
Visual failures: 0
Horizontal-overflow failures: 0
Routes changed: 0
Canonical data changed: 0
Public machine-readable data changed: 0
Owner approval records changed: 0
```

## PR #416 decision

PR #416 authorizes exactly:

```text
PR #417 — UI v3 Rebuild E: events and organizations
REVIEW GATE
```

Authorized existing route families:

```text
/events/
/event/[id]/
/issuers/
/issuer/[slug]/
```

## PR #417 implementation

### Events

```text
20 records per page with bounded initial SSR
Search, sort, five visible filter groups, selected-state counts, active chips, clear-all, result range/count, pagination, and empty state
Impact/severity and historical lifecycle effect shown separately
Responsive table and compact records
Event detail with taxonomy, recovery, subjects, structured detail, evidence, and corrections
```

### Organizations

```text
20 records per page with bounded initial SSR
Search, sort, five visible filter groups, selected-state counts, active chips, clear-all, result range/count, pagination, and empty state
Organization type, regulatory character, jurisdiction, roles, connected assets, relationship states/counts, evidence, and confidence shown separately
Responsive table and compact records
Organization detail with identity, current/historical relationships, events, evidence, unknowns, and corrections
```

Required representative visual states:

```text
Desktop + mobile: /events/
Desktop + mobile: /event/sog_ev_ust_2022_05_collapse/
Desktop + mobile: /issuers/
Desktop + mobile: /issuer/circle/
```

## Preserved boundaries

```text
Routes changed: 0
Canonical data changed: 0
Public machine-readable data changed: 0
Metadata contract changed: 0
Home/stablecoin register/stablecoin dossier/guide templates changed: 0
Owner approval records changed: 0
UI completion declared: false
```

Automated screenshots remain non-approving. PR #417 may not redesign guides or secondary pages and may not change canonical data, public machine-readable outputs, routes, metadata contracts, or owner-approval records. After PR #417, stop at `REVIEW GATE` before PR F.
