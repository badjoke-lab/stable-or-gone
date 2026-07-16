# Stable or Gone Agent Instructions

This file is the current mandatory authority entry point. Historical authority through PR #366 remains archived and does not override this file.

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
docs/roadmap-amendments/2026-07-16-pr388-evidence-archive-maintenance-queue-v4-activation.md
docs/quality/evidence-archive-maintenance-queue-v4-pr388-spec.md
config/evidence-archive-maintenance-queue-v4-pr388.json
config/evidence-archive-review-history-v3-pr387.json
docs/migration/evidence-archive-review-history-manifest-v3-pr387.json
docs/migration/evidence-archive-review-history-audit-v3-pr387.json
docs/migration/post-pr385-review-gate-pr386.json
docs/migration/evidence-archive-maintenance-queue-v3-pr383.json
docs/migration/evidence-archive-maintenance-queue-v4-pr388.json
docs/migration/evidence-archive-maintenance-queue-v4-pr388-delta.json
```

## Current workstream

```text
Canonical stable assets: 112
Canonical Evidence: 559
Evidence Relations: 559
Archive recorded: 406
Archive not recorded: 153
Deployments: 174
Market Access Records: 8
PR #387 Evidence Archive Review-History Contract v3 Update: complete
PR #388 Evidence Archive Maintenance Queue v4 Refresh: active; complete on merge
REVIEW GATE: mandatory after PR #388
```

PR #388 may generate internal Queue v4 and delta outputs only. It may change no canonical data, statistics, checkpoints, release baselines, or public surfaces.

## Binding History v3 inventory

```text
history sources: 4
history events: 40
reviewed Evidence identities: 39
archive present: 26
invalid archive removed: 1
reviewed no-safe-change: 11
reviewed source replacement: 1
reviewed unresolved total: 13
reviewed unresolved suppressed: 12
reviewed reactivated eligible: 1
```

## Reviewed Queue v4 result

```text
Eligible pool: 108
Selected: 10
Reviewed suppressed excluded: 12
Reviewed reactivated selected: 1
Added / removed / retained versus Queue v3: 9 / 9 / 1
```

Selected Evidence identities:

```text
sog_src_fdusd_site
sog_src_frax_docs
sog_src_frax_docs_frax
sog_src_frax_official_site
sog_src_gho_bridge_batch_c
sog_src_gho_facilitators_batch_c
sog_src_gho_gsm_batch_c
sog_src_gho_launch_batch_c
sog_src_gusd_gemini_official
sog_src_lusd_liquity_docs
```

`sog_src_fdusd_site` is the sole reviewed-reactivated identity and is selection tier 0. The remaining nine identities are ordinary unreviewed archive gaps. Every selected row remains pending manual review and authorizes no canonical change.

## Boundaries

PR #388 may change only internal authority, queue configuration, deterministic builder, versioned Queue v4/delta outputs, validator, and workflow files.

It may not change canonical Evidence, Evidence Relations, assets, deployments, Market Access records, statistics, checkpoints, release baselines, prior queues, history versions, reviewed outcomes, or public surfaces.

Not approved before the next review gate:

```text
Evidence and Archive Maintenance Batch 5
Tier A Dossier Deepening Batch 6
Market Access Pilot 3
Record Growth Batch 2
new public page or explorer
ranking, score, or recommendation
automatic monitoring promotion
automatic canonical promotion
```

Every non-trivial PR must state specification references, roadmap item, scope, non-goals, named inputs, preservation, validation, and deployment classification. PR #388 must stop at `REVIEW GATE`.