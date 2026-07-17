# Stable or Gone Agent Instructions

Current mandatory authority: PR #412 Post-PR #411 Review Gate.

Current authority:

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

## Current workstream

```text
Canonical stable assets: 112
Canonical Evidence: 559
Evidence Relations: 559
Archive recorded: 430
Archive not recorded: 129
Deployments: 174
Market Access Records: 8
Issue #281 UI v3 rebuild: reopened
PR #411 UI v3 Rebuild B — global shell and navigation: complete
PR #412 Post-PR #411 Review Gate: active; complete on merge
PR #413 UI v3 Rebuild C — home and stablecoin register: approved next
PR D stablecoin dossier: blocked
REVIEW GATE: mandatory after PR #413
```

PR #412 confirms the shared evidence-registry shell passed contract/build validation and the mandatory desktop/mobile visual audit. Automated screenshots remain non-approving: all owner-approval states stay pending.

PR #412 authorizes exactly PR #413. PR #413 may redesign only `/` and `/stablecoins/`, including product-entry search, registry state, recent changes, issue watch, exploration paths, visible filters, active chips, result/sort state, compare state, responsive table/cards, and bounded rendering.

PR #413 may not redesign dossiers, events, organizations, guides, or secondary pages. It may not change routes, canonical data, public machine-readable outputs, metadata contracts, or owner-approval records. It must stop at `REVIEW GATE`; every unrelated workstream remains unapproved.
