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
config/evidence-archive-maintenance-batch-7-pr400-decisions.json
docs/migration/evidence-archive-maintenance-batch-7-pr400-review-queue.json
```

## Current workstream

```text
Canonical stable assets: 112
Canonical Evidence: 559
Evidence Relations: 559
Archive recorded before PR #400: 425
Archive not recorded before PR #400: 134
Archive recorded after reviewed decisions: 430
Archive not recorded after reviewed decisions: 129
Deployments: 174
Market Access Records: 8
PR #399 Post-PR #398 Review Gate: complete
PR #400 Evidence and Archive Maintenance Batch 7: active; complete on merge
REVIEW GATE: mandatory after PR #400
```

## Reviewed outcomes

```text
selected: 10
changed: 5
dated_exact_archive_added: 5
reviewed_source_replacement: 0
reviewed_no_safe_change: 5
```

Five selected canonical Evidence rows receive reviewed exact dated archives. Five selected rows remain completely unchanged under reviewed no-safe-change decisions. Evidence identities, Evidence Relations, assets, deployments, Market Access records, other canonical record families, and public surfaces remain unchanged.

Every accepted archive is backed by an exact canonical source URL HTTP 200 CDX capture, timestamp, digest, and reviewed claim scope. No source replacement is accepted.

PR #400 must stop at `REVIEW GATE`. Evidence and Archive Maintenance Batch 8 and every unrelated workstream remain unapproved.
