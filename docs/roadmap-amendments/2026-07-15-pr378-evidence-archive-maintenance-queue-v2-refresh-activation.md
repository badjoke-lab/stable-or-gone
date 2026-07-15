# PR #378 Evidence Archive Maintenance Queue v2 Refresh Activation

Date: 2026-07-15
Status: active authority amendment
Public output: no

## Authority

Merged PR #376 authorized exactly:

```text
PR #377 Evidence Archive Review-History Contract Audit
PR #378 Evidence Archive Maintenance Queue v2 Refresh
REVIEW GATE
```

PR #377 completed the Evidence archive review-history contract and identified ten reviewed unresolved archive gaps that remain suppressed without a reviewed reactivation signal.

## Scope

PR #378 must apply the PR #377 contract to the current canonical Evidence set and generate a fresh bounded internal queue.

Selection must:

- start from archive-not-recorded canonical Evidence identities;
- exclude aliases and Web Archive source URLs;
- exclude the ten reviewed unresolved identities without a reviewed exact-capture or source-replacement signal;
- preserve the PR #365 deterministic priority order;
- select at most ten identities;
- retain review-history provenance on each candidate;
- change no canonical data or public surface;
- stop at `REVIEW GATE`.

## Required outputs

```text
docs/migration/evidence-archive-maintenance-queue-v2-pr378.json
docs/migration/evidence-archive-maintenance-queue-v2-pr378-delta.json
```

## Boundaries

PR #378 generates a review queue only. It does not authorize Evidence and Archive Maintenance Batch 3 canonical changes, automatic capture promotion, source replacement, ranking, scoring, recommendation, or publication.
