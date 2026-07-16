# Stable or Gone Roadmap

Updated: 2026-07-16  
Status: canonical execution schedule — PR #394 review gate active

Historical roadmap authority through PR #393 remains archived and does not override this file.

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
Archive recorded: 416
Archive not recorded: 143

PR #393 Evidence Archive Maintenance Queue v5 Refresh: complete
PR #394 Post-PR #393 Review Gate: active; complete on merge
PR #395 Evidence and Archive Maintenance Batch 6: approved next
REVIEW GATE: mandatory after PR #395
```

## Current authority

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-16-pr394-post-pr393-review-gate.md
docs/quality/post-pr393-review-gate-pr394-spec.md
config/post-pr393-review-gate-pr394.json
docs/migration/evidence-archive-maintenance-queue-v5-pr393.json
docs/migration/evidence-archive-maintenance-queue-v5-pr393-delta.json
config/evidence-archive-review-history-v4-pr392.json
docs/migration/evidence-archive-review-history-manifest-v4-pr392.json
docs/migration/evidence-archive-review-history-audit-v4-pr392.json
```

## Queue v5 review finding

```text
Eligible pool: 98
Selected: 10
Reviewed suppressed excluded: 12
Reviewed reactivated selected: 0
Added / removed / retained versus Queue v4: 10 / 10 / 0
```

All selected identities are unique ordinary unreviewed archive gaps. Their source types and publishers make them suitable for one bounded manual source/archive review.

## Approved next sequence

```text
PR #395 Evidence and Archive Maintenance Batch 6
REVIEW GATE
```

PR #395 may review exactly the ten Queue v5 identities. Allowed outcomes are:

```text
dated_exact_archive_added
reviewed_source_replacement
reviewed_no_safe_change
```

No candidate is presumed to change. PR #395 must update `AGENTS.md` and this roadmap before changing canonical Evidence.

## Deferred and not approved

```text
Evidence and Archive Maintenance Batch 7
Tier A Dossier Deepening Batch 6
Market Access Pilot 3
Record Growth Batch 2
new public page or explorer
asset or Evidence ranking
automatic monitoring promotion
automatic canonical promotion
```

## Next gate

After PR #395, stop at `REVIEW GATE`. No later archive batch or other canonical expansion is authorized before that review.
