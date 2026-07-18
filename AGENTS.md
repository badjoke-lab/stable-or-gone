# Stable or Gone Agent Instructions

Current mandatory authority: PR #421 UI v3 Rebuild G — full visual closure.

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
docs/quality/ui-v3-full-visual-closure-pr421.md
config/ui-v3-full-visual-closure-pr421.json
docs/migration/ui-v3-full-visual-closure-pr421.json
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
PR #420 Post-PR #419 Review Gate: complete
PR #421 UI v3 Rebuild G — full visual closure: active
Exit state: AWAITING OWNER REVIEW
Owner-approved desktop templates: 0
Owner-approved mobile templates: 0
UI completion: false
```

PR #421 is the final non-production visual-closure phase. It captures the fourteen design-contract owner-review states across home, stablecoin register default/filtered/empty states, USDC dossier, event register, organization register, and the representative MiCA guide. It builds the final machine manifest, contact sheet, and owner-review worksheet and verifies all implementation merge commits and protected boundaries.

PR #421 may not redesign production UI unless a required closure state fails a hard gate. Any repair must be isolated, justified by the failure, and recaptured. It may not change routes, canonical data, public machine-readable outputs, metadata contracts, or the owner-approval register.

Automated capture does not constitute owner approval. PR #421 may reach `AWAITING OWNER REVIEW`, but it may not mark a template accepted, declare UI completion, or close Issue #281 without an explicit owner decision for every required desktop and mobile template state. No later implementation phase is authorized.
