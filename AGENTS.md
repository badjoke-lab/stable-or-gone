# Stable or Gone Agent Instructions

Current mandatory authority: PR #413 UI v3 Rebuild C — home and stablecoin register.

Current authority:

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
PR #412 Post-PR #411 Review Gate: complete
PR #413 UI v3 Rebuild C — home and stablecoin register: active; complete on merge
PR D stablecoin dossier: blocked
REVIEW GATE: mandatory after PR #413
```

PR #413 is bounded to `/` and `/stablecoins/`. The home page may provide a compact product entrypoint, canonical cross-registry search, registry totals, lifecycle state, separate material-event and publication histories, known-unknown issue watch, exploration routes, recently reviewed records, and reviewed guides.

The stablecoin register may expose visible filters and selected states, active chips, clear-all, result range/count, sorting, URL state, bounded pagination, responsive table/cards, comparison state, and explicit no-result behavior. Page size remains 20, below the authorized maximum of 50, and the 112-record register remains bounded.

PR #413 may not redesign dossiers, events, organizations, guides, or secondary pages. It may not change routes, canonical data, public machine-readable outputs, metadata contracts, or owner-approval records. Automated captures do not constitute owner approval. PR #413 must stop at `REVIEW GATE`; every unrelated workstream remains unapproved.
