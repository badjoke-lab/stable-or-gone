# Post-PR #531 Authority Package

The current authority package is intentionally split by responsibility:

```text
docs/roadmap-amendments/2026-08-08-post-pr531-authority-reconciliation.md
  current state, sequence, schedule, and planning boundary

docs/quality/post-pr531-authority-reconciliation-spec.md
  authority assertions and preservation rules

docs/quality/guide-readability-remediation-2026-08-08-spec.md
  immediate public-UI remediation contract

docs/quality/guide-readability-remediation-2026-08-08-visual-findings.md
  direct production visual finding that triggered the remediation

config/post-pr531-authority-reconciliation.json
  machine-readable current authority and schedule

docs/migration/post-pr531-authority-reconciliation.json
  transition from stale documented authority to current verified authority

scripts/validate-post-pr531-authority-reconciliation.mjs
  active machine validation of the authority package
```

Read these only after `AGENTS.md`, `docs/spec-governance.md`, `docs/roadmap.md`, and `docs/deployment-policy.md`.
