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
config/evidence-archive-maintenance-batch-8-pr405-decisions.json
docs/migration/evidence-archive-maintenance-queue-v7-pr403.json
docs/migration/evidence-archive-maintenance-batch-8-pr405-review-queue.json
docs/migration/evidence-archive-maintenance-outcomes-pr405.json
docs/migration/evidence-archive-maintenance-batch-8-pr405-reviewed-handoff.json
```

## Current workstream

```text
Canonical stable assets: 112
Canonical Evidence: 559
Evidence Relations: 559
Archive recorded after reviewed decisions: 430
Archive not recorded after reviewed decisions: 129
Deployments: 174
Market Access Records: 8
PR #404 Post-PR #403 Review Gate: complete
PR #405 Evidence and Archive Maintenance Batch 8: active; complete on merge
dated_exact_archive_added: 0
reviewed_source_replacement: 0
reviewed_no_safe_change: 10
REVIEW GATE: mandatory after PR #405
```

PR #405 remains bounded to exactly the ten Queue v7 identities. The completed live and exact-CDX probe was manually reviewed. Exact-source capture metadata existed for every row, but archived payload contents were not independently inspected against their claim scopes during this bounded pass. Therefore all ten identities received `reviewed_no_safe_change`; no archive was promoted from metadata alone.

No canonical Evidence field, Evidence identity, Relation, non-Evidence canonical record, Market Access record, ranking, or public surface changed. Automatic promotion remains prohibited.

PR #405 must stop at `REVIEW GATE`. Evidence and Archive Maintenance Batch 9 and every unrelated workstream remain unapproved.
