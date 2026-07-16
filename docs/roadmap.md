# Stable or Gone Roadmap

Updated: 2026-07-16  
Status: canonical execution schedule — PR #397 active

Historical roadmap authority through PR #396 remains archived and does not override this file.

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
Archive recorded: 425
Archive not recorded: 134

PR #395 Evidence and Archive Maintenance Batch 6: complete
PR #396 Post-PR #395 Review Gate: complete
PR #397 Evidence Archive Review-History Contract v5 Update: active; complete on merge
PR #398 Evidence Archive Maintenance Queue v6 Refresh: approved next
REVIEW GATE: mandatory after PR #398
```

## Current authority

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/migration/post-pr395-review-gate-pr396.json
docs/roadmap-amendments/2026-07-16-pr397-evidence-archive-review-history-v5-activation.md
docs/quality/evidence-archive-review-history-contract-v5-pr397-spec.md
config/evidence-archive-review-history-v5-pr397.json
```

## History v5 binding inventory

```text
history sources: 6
history events: 60
reviewed Evidence identities: 58
archive present: 45
invalid archive removed: 1
reviewed no-safe-change: 12
reviewed source replacement: 0
reviewed unresolved total: 13
reviewed unresolved suppressed: 13
reviewed reactivated eligible: 0
```

History v5 extends immutable History v4 with the ten reviewed PR #395 outcomes. Nine selected identities are archive-present. `sog_src_makerdao_docs_dai` remains archive-not-recorded under reviewed no-safe-change suppression.

## Required outputs

```text
docs/migration/evidence-archive-review-history-manifest-v5-pr397.json
docs/migration/evidence-archive-review-history-audit-v5-pr397.json
```

## Boundaries

PR #397 is internal history-contract work only. Canonical records, checkpoints, statistics, release baselines, public surfaces, prior history versions, and prior outcomes remain unchanged. Queue v6 is not generated in this PR.

## Next sequence

```text
PR #398 Evidence Archive Maintenance Queue v6 Refresh
REVIEW GATE
```

After PR #398, stop at `REVIEW GATE`. Archive Batch 7 and all other canonical expansion remain unapproved.
