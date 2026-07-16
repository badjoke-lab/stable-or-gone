# Stable or Gone Agent Instructions

This file is the current mandatory authority entry point. Historical authority through PR #392 remains archived and does not override this file.

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
docs/roadmap-amendments/2026-07-16-pr393-evidence-archive-maintenance-queue-v5-activation.md
docs/quality/evidence-archive-maintenance-queue-v5-pr393-spec.md
config/evidence-archive-maintenance-queue-v5-pr393.json
config/evidence-archive-review-history-v4-pr392.json
docs/migration/evidence-archive-review-history-manifest-v4-pr392.json
docs/migration/evidence-archive-review-history-audit-v4-pr392.json
docs/migration/post-pr390-review-gate-pr391.json
docs/migration/evidence-archive-maintenance-queue-v4-pr388.json
docs/migration/evidence-archive-maintenance-queue-v5-pr393.json
docs/migration/evidence-archive-maintenance-queue-v5-pr393-delta.json
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
PR #392 Evidence Archive Review-History Contract v4 Update: complete
PR #393 Evidence Archive Maintenance Queue v5 Refresh: active; complete on merge
REVIEW GATE: mandatory after PR #393
```

PR #393 may create internal Queue v5 and delta outputs only. It may change no canonical data, statistics, checkpoints, release baselines, or public surfaces.

## Binding History v4 inventory

```text
history sources: 5
history events: 50
reviewed Evidence identities: 48
archive present: 36
invalid archive removed: 1
reviewed no-safe-change: 11
reviewed source replacement: 0
reviewed unresolved total: 12
reviewed unresolved suppressed: 12
reviewed reactivated eligible: 0
```

## Reviewed Queue v5 result

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

All ten selected rows are ordinary unreviewed archive gaps in selection tier 1. Queue v5 authorizes no canonical change.

## Boundaries

PR #393 may change only internal authority, queue configuration, deterministic builder, versioned Queue v5/delta outputs, validator, active-workstream pointer, and workflow.

It may not change canonical Evidence or Relations, assets, deployments, Market Access records, statistics, checkpoints, release baselines, prior histories/queues/outcomes, or public surfaces.

Not approved:

```text
Evidence and Archive Maintenance Batch 6
Tier A Dossier Deepening Batch 6
Market Access Pilot 3
Record Growth Batch 2
new public page or explorer
ranking, score, or recommendation
automatic monitoring promotion
automatic canonical promotion
```

PR #393 must stop at `REVIEW GATE`.
