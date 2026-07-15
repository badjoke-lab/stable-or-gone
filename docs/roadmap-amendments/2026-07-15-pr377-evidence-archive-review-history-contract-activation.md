# PR #377 Evidence Archive Review-History Contract Audit Activation

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

## Scope

PR #377 must inventory archive-maintenance outcomes from PR #360 and PR #365 by canonical Evidence identity and define deterministic queue eligibility.

The contract must:

- resolve history by Evidence ID;
- use the latest reviewed event as effective;
- distinguish archive present, invalid archive removed, and no-safe-change outcomes;
- suppress reviewed unresolved archive gaps until a reviewed exact capture or reviewed source replacement signal exists;
- prohibit automatic time expiry;
- prohibit queue presence, HTTP-status change, or unreviewed capture results as reactivation signals;
- change no canonical data and generate no archive queue.

## Expected inventory

```text
history sources: 2
history events: 20
reviewed Evidence identities: 20
archive present: 10
invalid archive removed: 1
reviewed no-safe-change: 9
currently reviewed unresolved archive gaps: 10
```

## Required outputs

```text
docs/migration/evidence-archive-review-history-manifest-pr377.json
docs/migration/evidence-archive-review-history-audit-pr377.json
```

## Boundaries

PR #377 changes no canonical Evidence, archive URL, source identity, public surface, historical outcome, ranking, score, recommendation, or automatic promotion rule. PR #378 is the only authorized consumer before the next review gate.
