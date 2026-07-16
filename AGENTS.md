# Stable or Gone Agent Instructions

Current mandatory authority: PR #405 Evidence and Archive Maintenance Batch 8.

Current authority:

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/migration/post-pr403-review-gate-pr404.json
docs/roadmap-amendments/2026-07-16-pr405-evidence-archive-maintenance-batch-8-activation.md
docs/quality/evidence-archive-maintenance-batch-8-pr405-spec.md
config/evidence-archive-maintenance-batch-8-pr405.json
docs/migration/evidence-archive-maintenance-queue-v7-pr403.json
```

## Current workstream

```text
Canonical stable assets: 112
Canonical Evidence: 559
Evidence Relations: 559
Archive recorded before PR #405: 430
Archive not recorded before PR #405: 129
Deployments: 174
Market Access Records: 8
PR #404 Post-PR #403 Review Gate: complete
PR #405 Evidence and Archive Maintenance Batch 8: active; complete on merge
REVIEW GATE: mandatory after PR #405
```

PR #405 is bounded to exactly the ten Queue v7 identities. The initial workflow is probe-only and records live response plus exact Wayback CDX history.

Canonical writes remain disabled during the probe phase. Probe rows remain pending manual review and contain no proposed outcome.

Allowed reviewed outcomes are `dated_exact_archive_added`, `reviewed_source_replacement`, or `reviewed_no_safe_change`. No outcome is presumed and automatic promotion is prohibited.

PR #405 must stop at `REVIEW GATE`. Evidence and Archive Maintenance Batch 9 and every unrelated workstream remain unapproved.
