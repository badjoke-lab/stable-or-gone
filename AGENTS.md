# Stable or Gone Agent Instructions

Current mandatory authority: PR #420 Post-PR #419 Review Gate.

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
docs/quality/ui-v3-events-organizations-pr417.md
config/ui-v3-events-organizations-pr417.json
docs/migration/ui-v3-events-organizations-pr417-handoff.json
docs/quality/post-pr417-review-gate-pr418-spec.md
docs/migration/post-pr417-review-gate-pr418.json
docs/quality/ui-v3-guides-secondary-pages-pr419.md
config/ui-v3-guides-secondary-pages-pr419.json
docs/migration/ui-v3-guides-secondary-pages-pr419-handoff.json
docs/quality/post-pr419-review-gate-pr420-spec.md
docs/migration/post-pr419-review-gate-pr420.json
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
PR #419 UI v3 Rebuild F — guides and secondary pages: complete
PR #420 Post-PR #419 Review Gate: active; complete on merge
PR #421 UI v3 Rebuild G — full visual closure: approved next
Owner review: mandatory after PR #421
UI completion: false
```

PR #420 binds PR #419 merge commit `5e5857f2e0bd39b24dfc9afaef62cc9e9fa27eb7`, implementation head `87fd5d9539b87c8cee46870b60eb745644129467`, and successful visual review run `29599351044`. All sixteen guide and secondary-page desktop/mobile states passed with zero visual failures and zero horizontal-overflow failures. Automated rendering remains non-approving: owner-approved desktop templates remain 0, owner-approved mobile templates remain 0, and UI completion remains false.

PR #421 is non-production full visual closure. It may capture the fourteen design-contract owner-review states, build the final contact sheet and owner-review worksheet, verify merge lineage and protected boundaries, and report `AWAITING OWNER REVIEW`. It may not redesign production UI unless a hard visual gate fails, and any repair must be isolated and recaptured.

PR #421 may not change routes, canonical data, public machine-readable outputs, metadata contracts, or owner-approval records. Automated captures do not constitute owner approval. It may not mark a template accepted or declare UI completion without an explicit owner decision for every required desktop and mobile template state.
