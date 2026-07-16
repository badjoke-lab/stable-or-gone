# Stable or Gone Agent Instructions

Current mandatory authority: PR #400 Evidence and Archive Maintenance Batch 7.

Current authority:

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/migration/post-pr398-review-gate-pr399.json
docs/roadmap-amendments/2026-07-16-pr400-evidence-archive-maintenance-batch-7-activation.md
docs/quality/evidence-archive-maintenance-batch-7-pr400-spec.md
config/evidence-archive-maintenance-batch-7-pr400.json
docs/migration/evidence-archive-maintenance-queue-v6-pr398.json
```

## Current workstream

```text
Canonical stable assets: 112
Canonical Evidence: 559
Evidence Relations: 559
Archive recorded before PR #400: 425
Archive not recorded before PR #400: 134
Deployments: 174
Market Access Records: 8
PR #399 Post-PR #398 Review Gate: complete
PR #400 Evidence and Archive Maintenance Batch 7: active; complete on merge
REVIEW GATE: mandatory after PR #400
```

PR #400 is bounded to exactly the ten Queue v6 identities. The initial workflow is probe-only and records live response plus exact Wayback CDX history.

Canonical writes remain disabled during the probe phase. Probe rows remain pending manual review and contain no proposed outcome.

Allowed reviewed outcomes are `dated_exact_archive_added`, `reviewed_source_replacement`, or `reviewed_no_safe_change`. No outcome is presumed and automatic promotion is prohibited.

PR #400 must stop at `REVIEW GATE`. Evidence and Archive Maintenance Batch 8 and every unrelated workstream remain unapproved.
