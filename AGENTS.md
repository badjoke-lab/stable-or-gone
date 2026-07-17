# Stable or Gone Agent Instructions

Current mandatory authority: PR #410 Post-PR #409 Review Gate.

Current authority:

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/quality/ui-v3-rebuild-design-contract-pr409.md
config/ui-v3-rebuild-design-contract-pr409.json
docs/migration/ui-v3-rebuild-design-contract-pr409-handoff.json
docs/quality/post-pr409-review-gate-pr410-spec.md
docs/migration/post-pr409-review-gate-pr410.json
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
PR #409 UI v3 Rebuild A — design contract and failure gates: complete
PR #410 Post-PR #409 Review Gate: active; complete on merge
PR #411 UI v3 Rebuild B — global shell and navigation: approved next
PR C home and stablecoin register: blocked
REVIEW GATE: mandatory after PR #411
```

PR #410 authorizes exactly PR #411. PR #411 may rebuild the shared header, brand presentation, registry search, grouped navigation, mobile menu, page-width and shell surfaces, shared interaction states, and footer.

PR #411 may not redesign the home page, stablecoin register, stablecoin dossier, events, organizations, guides, or any other page template. It may not change routes, canonical data, public machine-readable outputs, or owner-approval records. Screenshot capture does not constitute owner approval.

PR #411 must stop at `REVIEW GATE`. Every unrelated workstream remains unapproved.
