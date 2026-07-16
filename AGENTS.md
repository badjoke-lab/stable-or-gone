# Stable or Gone Agent Instructions

This file is the current mandatory authority entry point. Historical authority through PR #393 remains archived and does not override this file.

## Required reading

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. `docs/post-351-data-growth-operating-spec.md`
6. active roadmap amendment
7. active work-item specification
8. every named handoff, outcome, history contract, manifest, audit, queue, and checkpoint

Current authority:

```text
docs/roadmap-amendments/2026-07-16-pr394-post-pr393-review-gate.md
docs/quality/post-pr393-review-gate-pr394-spec.md
config/post-pr393-review-gate-pr394.json
docs/migration/evidence-archive-maintenance-queue-v5-pr393.json
docs/migration/evidence-archive-maintenance-queue-v5-pr393-delta.json
config/evidence-archive-review-history-v4-pr392.json
docs/migration/evidence-archive-review-history-manifest-v4-pr392.json
docs/migration/evidence-archive-review-history-audit-v4-pr392.json
```

## Current workstream

```text
Canonical stable assets: 112
Canonical Evidence: 559
Evidence Relations: 559
Archive recorded: 416
Archive not recorded: 143
Deployments: 174
Market Access Records: 8
PR #393 Evidence Archive Maintenance Queue v5 Refresh: complete
PR #394 Post-PR #393 Review Gate: active; complete on merge
PR #395 Evidence and Archive Maintenance Batch 6: approved next
REVIEW GATE: mandatory after PR #395
```

PR #394 may record an authority decision only. It may change no canonical data, statistics, checkpoints, release baselines, or public surfaces.

## Binding Queue v5 result

```text
Eligible pool: 98
Selected: 10
Reviewed suppressed excluded: 12
Reviewed reactivated selected: 0
Added / removed / retained versus Queue v4: 10 / 10 / 0
```

Selected Evidence identities:

```text
sog_src_makerdao_docs_dai
sog_src_makerdao_forum_lifecycle_reference
sog_src_mim_2025_postmortem_batch_a
sog_src_mim_docs_batch_a
sog_src_mim_tokenomics_batch_a
sog_src_mstable_withdrawal_batch_d
sog_src_nuon_contracts_batch_b
sog_src_nuon_guarded_launch_batch_b
sog_src_nuon_maxcap_batch_b
sog_src_nuon_minting_batch_b
```

## Approved next sequence

```text
PR #395 Evidence and Archive Maintenance Batch 6
REVIEW GATE
```

PR #395 may review exactly these ten identities and may record only `dated_exact_archive_added`, `reviewed_source_replacement`, or `reviewed_no_safe_change`. No candidate is presumed to change.

Not approved:

```text
Evidence and Archive Maintenance Batch 7
Tier A Dossier Deepening Batch 6
Market Access Pilot 3
Record Growth Batch 2
new public page or explorer
ranking, score, or recommendation
automatic monitoring promotion
automatic canonical promotion
```

PR #394 must stop with authority limited to PR #395 and the following `REVIEW GATE`.
