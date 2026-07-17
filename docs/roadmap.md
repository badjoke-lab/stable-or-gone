# Stable or Gone Roadmap

Updated: 2026-07-17  
Status: canonical execution schedule — PR #412 active review gate

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
PR #412 Post-PR #411 Review Gate: active; complete on merge
PR #413 UI v3 Rebuild C — home and stablecoin register: approved next
PR D stablecoin dossier: blocked
REVIEW GATE: mandatory after PR #413
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
docs/quality/ui-v3-global-shell-navigation-pr411.md
config/ui-v3-global-shell-pr411.json
docs/migration/ui-v3-global-shell-navigation-pr411-handoff.json
docs/quality/post-pr411-review-gate-pr412-spec.md
docs/migration/post-pr411-review-gate-pr412.json
```

## PR #411 reviewed outcome

```text
Shell marker: evidence-registry-pr411
Contract/build validation: success
Mandatory desktop/mobile visual audit: success
Visual review run: 29559515009
Routes changed: 0
Canonical data changed: 0
Public machine-readable data changed: 0
Owner approval records changed: 0
Automated rendering equals owner approval: false
```

The shared shell now prioritizes registry search and grouped evidence-registry navigation. The artifact review established render and overflow safety; it did not accept any owner visual-approval gate.

## PR #412 decision

PR #412 authorizes exactly:

```text
PR #413 — UI v3 Rebuild C: home and stablecoin register
REVIEW GATE
```

The home page may become a direct product entrypoint with prominent search, current registry state, recent changes, issue watch, and exploration routes. The stablecoin register may add visible filters and selected states, active chips, clear-all, result and sort state, compare selection, responsive table/cards, and bounded rendering with an initial maximum of 50 records.

Dossiers, events, organizations, guides, routes, metadata contracts, canonical data, public machine-readable outputs, and owner-approval records remain blocked. After PR #413, stop at `REVIEW GATE`.
