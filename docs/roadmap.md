# Stable or Gone Roadmap

Updated: 2026-07-17  
Status: canonical execution schedule — PR #410 active review gate

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
PR #410 Post-PR #409 Review Gate: active; complete on merge
PR #411 UI v3 Rebuild B — global shell and navigation: approved next
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
docs/migration/ui-v3-rebuild-design-contract-pr409-handoff.json
docs/quality/post-pr409-review-gate-pr410-spec.md
docs/migration/post-pr409-review-gate-pr410.json
```

## PR #409 reviewed outcome

```text
Direction: modern evidence registry
Body minimum: 16px
Dense table minimum: 14px
Touch target minimum: 44px
Required review widths: 320 / 390 / 768 / 1280 / 1440
Representative capture states: 14
Required owner-approved templates: 6
Skipped visual audit: hard failure
Automated rendering equals approval: false
Production UI changes: 0
Canonical changes: 0
```

## PR #410 decision

PR #410 authorizes exactly the shared-shell implementation phase:

```text
PR #411 — UI v3 Rebuild B: global shell and navigation
REVIEW GATE
```

PR #411 may rebuild the shared header, brand presentation, registry search, grouped navigation, mobile menu, page-width and shell surfaces, shared interaction states, and footer. It must preserve all routes, page templates, canonical data, public machine-readable outputs, metadata, and owner-approval states.

Home, register, dossier, events, organizations, guides, and later UI phases remain blocked. After PR #411, stop at `REVIEW GATE`.
