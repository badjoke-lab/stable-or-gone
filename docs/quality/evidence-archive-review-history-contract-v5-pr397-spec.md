# PR #397 Evidence Archive Review-History Contract v5 Specification

Status: active internal history refresh  
Review PR: 397  
Public output: false

## Objective

Extend completed History v4 with the ten reviewed PR #395 outcomes, preserve every prior reviewed source unchanged, and hand off only to PR #398 Queue v6.

## Binding inventory

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

PR #395 contributes nine archive-present events and one no-safe-change event. `sog_src_makerdao_docs_dai` is the new suppressed identity. No reviewed source replacement remains archive-not-recorded.

## Inputs

- `docs/migration/post-pr395-review-gate-pr396.json`
- History v4 contract, manifest, and audit
- `docs/migration/evidence-archive-maintenance-outcomes-pr395.json`
- current canonical checkpoint

## Required outputs

```text
docs/migration/evidence-archive-review-history-manifest-v5-pr397.json
docs/migration/evidence-archive-review-history-audit-v5-pr397.json
```

## Resolution rules

- key by `evidence_id`;
- order by reviewed date, PR number, then source order;
- latest reviewed event wins;
- archive-present identities are not eligible;
- invalid-removal and no-safe-change identities remain suppressed;
- source replacement may reactivate only while archive remains absent;
- no review outcome expires automatically.

## Authority

PR #397 may create only the versioned History v5 contract outputs and supporting internal validation material. It may not create Queue v6 inside this PR.

The sole next work item is:

```text
PR #398 Evidence Archive Maintenance Queue v6 Refresh
```

## Prohibited work

- canonical Evidence or Relation changes;
- checkpoint, statistics, release-baseline, or public changes;
- rewriting History v4 or any prior reviewed outcomes;
- Archive Batch 7;
- ranking, scoring, recommendation, or automatic promotion.

## Exit condition

History v5 regenerates deterministically at 6 / 60 / 58, all thirteen reviewed unresolved identities are suppressed, reactivated eligibility is zero, immutable prior blobs pass, and authority stops at PR #398 followed by `REVIEW GATE`.
