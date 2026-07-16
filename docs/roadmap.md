# Stable or Gone Roadmap

Updated: 2026-07-15  
Status: canonical execution schedule — PR #379 review gate active

Historical roadmap authority through PR #366 remains archived and does not override this file.

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
Archive recorded: 390
Archive not recorded: 169

PR #377 Evidence Archive Review-History Contract Audit: complete
PR #378 Evidence Archive Maintenance Queue v2 Refresh: complete
PR #379 Post-PR #378 Review Gate: active; complete on merge
```

## Current authority

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-15-pr379-post-pr378-review-gate.md
docs/quality/post-pr378-review-gate-pr379-spec.md
config/post-pr378-review-gate-pr379.json
```

## Completed sequence reviewed

```text
PR #377  Evidence Archive Review-History Contract Audit — complete
PR #378  Evidence Archive Maintenance Queue v2 Refresh — complete
PR #379  REVIEW GATE — active
```

## PR #378 output recovery

PR #378 computed the correct queue values, but the required queue and delta files were omitted from the merged file set. PR #379 deterministically regenerates and commits those two internal outputs from the merged builder and immutable inputs before completing the review gate. Canonical data, public surfaces, and PR #378 selection semantics remain unchanged.

## Fresh bounded queue

```text
canonical Evidence: 559
archive recorded: 390
archive not recorded: 169
reviewed unresolved suppressed: 10
reviewed reactivated: 0
fresh selected candidates: 10
maximum selected candidates: 10
```

The queue is deterministic, internal, non-ranking, and manual-review-only. The selected Evidence identities are fixed by the PR #378 builder and may not be substituted.

## Review decision under consideration

PR #379 may authorize exactly:

```text
PR #380 Evidence and Archive Maintenance Batch 3
REVIEW GATE
```

PR #380 must review all ten selected identities and assign exactly one outcome per identity:

```text
dated_exact_archive_added
reviewed_source_replacement
reviewed_no_safe_change
```

A dated archive may be added only after exact canonical source capture is verified. A source replacement requires reviewed claim-scope and source-version equivalence. No canonical change is presumed from queue selection.

## Validation boundary

PR #379 must prove:

- deterministic recovery of the two omitted PR #378 outputs;
- exact PR #378 queue identity and selected count;
- exact ten reviewed-history suppressions and zero reviewed reactivation;
- exact PR #360 and PR #365 prior yield;
- bounded PR #380 authority for only the selected ten identities;
- no current canonical or public change;
- no new public surface or automatic promotion;
- next work item after PR #380 is `REVIEW GATE`.

## Deferred and not approved

```text
Evidence and Archive Maintenance Batch 4
Tier A Dossier Deepening Batch 6
Market Access Pilot 3
Record Growth Batch 2
new public page or explorer
asset or Evidence ranking
automatic monitoring promotion
automatic canonical promotion
```

## Next gate

After PR #380, stop and review actual archive yield, source replacements, no-safe-change outcomes, remaining archive backlog, Market Access breadth, monitoring usefulness, monthly maintenance burden, and verified external usage evidence.
