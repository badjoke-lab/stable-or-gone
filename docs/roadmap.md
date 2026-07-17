# Stable or Gone Roadmap

Updated: 2026-07-17  
Status: canonical execution schedule — PR #411 active

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
PR #411 UI v3 Rebuild B — global shell and navigation: active; complete on merge
PR C home and stablecoin register: blocked
REVIEW GATE: mandatory after PR #411
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
docs/quality/post-pr409-review-gate-pr410-spec.md
docs/migration/post-pr409-review-gate-pr410.json
docs/quality/ui-v3-global-shell-navigation-pr411.md
config/ui-v3-global-shell-pr411.json
```

## PR #411 implementation

```text
Shell marker: evidence-registry-pr411
Desktop header rows: 2
Desktop registry search: visible
Navigation groups: Registry / Learn / Project
Utility navigation: Corrections / Support
Mobile menu: search + grouped navigation + utilities
Body minimum: 16px
Table minimum: 14px
Touch target minimum: 44px
Screenshot audit: mandatory
Contact sheet: mandatory
Automated rendering equals owner approval: false
```

The shared shell now prioritizes registry search and evidence-registry navigation. Active routes, mobile disclosure state, keyboard focus, skip navigation, footer grouping, and data-access links are explicit across desktop and mobile.

## Preserved boundaries

```text
Routes changed: 0
Canonical data changed: 0
Public machine-readable data changed: 0
Page templates redesigned: 0
Owner approval records changed: 0
UI completion declared: false
```

Home, register, dossier, events, organizations, guides, and later UI phases remain blocked. After PR #411, stop at `REVIEW GATE`.
