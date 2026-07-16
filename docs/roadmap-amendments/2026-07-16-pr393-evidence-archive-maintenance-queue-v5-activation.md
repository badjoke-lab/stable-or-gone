# PR #393 Evidence Archive Maintenance Queue v5 Activation

Date: 2026-07-16  
Status: active internal queue refresh  
Public output: no

## Authority

Merged PR #391 authorized PR #393 only after completed PR #392 History v4.

## Scope

Queue v5 starts from 143 archive-not-recorded canonical Evidence identities, excludes aliases, Web Archive source URLs, missing URLs, and twelve reviewed suppressions, then applies the existing deterministic non-ranking source-priority order.

History v4 contains no reviewed-reactivated eligible identity. All selected rows therefore begin as ordinary unreviewed archive gaps.

## Boundaries

PR #393 may generate an internal Queue v5 and delta only. It may not change canonical data, checkpoints, statistics, release baselines, prior histories or queues, or public surfaces. Queue candidates authorize no canonical change.

## Exit condition

Select at most ten manual-review candidates and stop at `REVIEW GATE`. Evidence and Archive Maintenance Batch 6 remains unapproved.
