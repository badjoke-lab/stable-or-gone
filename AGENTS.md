# Stable or Gone Agent Instructions

Current mandatory authority: PR #416 Post-PR #415 Review Gate.

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
docs/migration/ui-v3-home-register-pr413-handoff.json
docs/quality/post-pr413-review-gate-pr414-spec.md
docs/migration/post-pr413-review-gate-pr414.json
docs/quality/ui-v3-stablecoin-dossier-pr415.md
config/ui-v3-stablecoin-dossier-pr415.json
docs/migration/ui-v3-stablecoin-dossier-pr415-handoff.json
docs/quality/post-pr415-review-gate-pr416-spec.md
docs/migration/post-pr415-review-gate-pr416.json
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
PR #415 UI v3 Rebuild D — stablecoin dossier: complete
PR #416 Post-PR #415 Review Gate: active; complete on merge
PR #417 UI v3 Rebuild E — events and organizations: approved next
PR F guides and secondary pages: blocked
REVIEW GATE: mandatory after PR #417
```

PR #416 binds PR #415 merge commit `e4af173ff3560e0474b8282de0ad8da4532d0f4a`, implementation head `c632a4419da7a6e45645e75f5a3d87985cd0dbe8`, and successful visual review run `29576352130`. All six USDC, UST, and BUSD desktop/mobile dossier states passed with zero visual failures and exact viewport/scroll widths. Automated rendering remains non-approving: owner-approved desktop templates remain 0, owner-approved mobile templates remain 0, and UI completion remains false.

PR #417 may redesign only the existing `/events/`, `/event/[id]/`, `/issuers/`, and `/issuer/[slug]/` route families. Events must prioritize severity, type, lifecycle context, filters, bounded rendering, and responsive records. Organizations must prioritize role, connected assets, relationship type, filters, bounded rendering, and explicit organization-to-stablecoin relationship views.

PR #417 must capture desktop and mobile states for `/events/`, `/event/sog_ev_ust_2022_05_collapse/`, `/issuers/`, and `/issuer/circle/`. It may not redesign home, stablecoin register, stablecoin dossier, guides, or secondary pages. It may not change routes, canonical data, public machine-readable outputs, metadata contracts, or owner-approval records. Automated captures do not constitute owner approval. PR #417 must stop at `REVIEW GATE`; PR F and every later workstream remain unapproved.
