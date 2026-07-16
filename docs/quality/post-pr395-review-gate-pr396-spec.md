# PR #396 Post-PR #395 Review Gate Specification

Status: active mandatory review gate  
Review PR: 396  
Public output: false

## Objective

Review completed PR #395 Batch 6, project the required History v5 state, and authorize only a History v5 refresh followed by Queue v6 generation.

## Deterministic review finding

```text
Canonical Evidence / Relations: 559 / 559
Archive recorded / not recorded: 425 / 134
PR #395 selected / changed: 10 / 9
PR #395 exact archives / no-safe-change: 9 / 1
History v5 sources / events / identities: 6 / 60 / 58
Effective archive-present / invalid-removed / no-safe-change / source-replacement: 45 / 1 / 12 / 0
Reviewed unresolved / suppressed / reactivated: 13 / 13 / 0
```

History v4 is stale because it excludes PR #395. `sog_src_makerdao_docs_dai` becomes a reviewed no-safe-change suppression.

## Authority decision

PR #396 authorizes exactly:

```text
PR #397 Evidence Archive Review-History Contract v5 Update
PR #398 Evidence Archive Maintenance Queue v6 Refresh
REVIEW GATE
```

PR #397 and PR #398 are internal-only and may not change canonical or public data. PR #398 may select at most ten manual-review candidates but may not authorize canonical maintenance.

## Prohibited work

- Evidence and Archive Maintenance Batch 7;
- canonical Evidence or relation changes;
- dossier, Market Access, growth, ranking, scoring, recommendation, or public-page work;
- automatic monitoring or canonical promotion;
- rewrite of prior reviewed outcomes, histories, queues, checkpoints, or release baselines.

## Required output

```text
docs/migration/post-pr395-review-gate-pr396.json
```

## Exit condition

The review report is deterministic, all canonical/release/build boundaries pass, and authority stops after PR #398 at `REVIEW GATE`.
