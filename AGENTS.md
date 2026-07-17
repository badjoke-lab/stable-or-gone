# Stable or Gone Agent Instructions

Current mandatory authority: PR #409 UI v3 Rebuild A — design contract and failure gates.

Current authority:

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/quality/post-pr407-review-gate-pr408-spec.md
docs/migration/post-pr407-review-gate-pr408.json
docs/quality/ui-v3-rebuild-design-contract-pr409.md
config/ui-v3-rebuild-design-contract-pr409.json
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
PR #408 Post-PR #407 Review Gate: complete
PR #409 UI v3 Rebuild A — design contract and failure gates: active; complete on merge
PR B global shell and navigation: blocked
REVIEW GATE: mandatory after PR #409
```

PR #409 replaces the failed editorial/newspaper-first direction with a modern evidence-registry contract. It defines typography, density, spacing, surfaces, navigation, interaction, responsive, accessibility, template priorities, fourteen representative desktop/mobile capture states, screenshot/contact-sheet requirements, and explicit owner-approval gates.

A skipped visual audit is a hard failure. Automated rendering or screenshot capture is not owner approval. UI completion may not be declared until all required template approvals are recorded as accepted.

PR #409 may not change production layouts, components, CSS, routes, canonical data, or public machine-readable outputs. It may not begin PR B or pre-authorize later implementation phases.

PR #409 must stop at `REVIEW GATE`. Every unrelated workstream remains unapproved.
