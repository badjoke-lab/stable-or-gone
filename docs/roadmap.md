# Stable or Gone Roadmap

Updated: 2026-07-17  
Status: canonical execution schedule — PR #408 active review gate

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
PR #407 Visa Stablecoin Platform article and OUSD/VSP private monitoring: complete
PR #408 Post-PR #407 Review Gate: active; complete on merge
PR #409 UI v3 Rebuild A — design contract and failure gates: approved next
REVIEW GATE: mandatory after PR #409
```

## Current authority

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/quality/post-pr407-review-gate-pr408-spec.md
docs/migration/post-pr407-review-gate-pr408.json
docs/migration/visa-open-usd-article-monitoring-pr407-handoff.json
```

## PR #407 reviewed outcome

```text
Article route: /updates/visa-stablecoin-platform-open-usd/
Language: Japanese
Update Feed entries added: 1
Private monitoring subjects: 2
Pending initial baselines: 2
Bounded news queries added: 2
Canonical changes: 0
Public monitoring output: false
Automatic promotion: false
```

The article is an editorial analysis inside the existing Update Feed route family. Open USD and Visa Stablecoin Platform remain private, pending, noncanonical monitoring subjects.

## PR #408 decision

PR #408 authorizes exactly the first implementation step of the reopened UI v3 workstream in Issue #281:

```text
PR #409 — UI v3 Rebuild A: design contract and failure gates
REVIEW GATE
```

PR #409 is specification-and-validation only. It may define the evidence-registry design direction, design tokens, representative desktop/mobile review matrix, mandatory screenshot artifacts, hard failure for skipped visual audits, and explicit owner-approval gates.

It may not change the production shell, templates, CSS, components, routes, canonical data, public machine-readable outputs, or begin PR B.

After PR #409, stop at `REVIEW GATE`.
