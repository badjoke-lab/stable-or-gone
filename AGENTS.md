# Stable or Gone Agent Instructions

This file is the current mandatory authority entry point. Historical authority through PR #389 remains archived and does not override this file.

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
docs/roadmap-amendments/2026-07-16-pr390-evidence-archive-maintenance-batch-5-activation.md
docs/quality/evidence-archive-maintenance-batch-5-pr390-spec.md
config/evidence-archive-maintenance-batch-5-pr390.json
config/evidence-archive-maintenance-batch-5-pr390-decisions.json
docs/migration/post-pr388-review-gate-pr389.json
docs/migration/evidence-archive-maintenance-queue-v4-pr388.json
docs/migration/evidence-archive-maintenance-queue-v4-pr388-delta.json
docs/migration/evidence-archive-maintenance-batch-5-pr390-review-queue.json
```

## Current workstream

```text
Canonical stable assets: 112
Canonical Evidence: 559
Evidence Relations: 559
Archive recorded before PR #390: 406
Archive not recorded before PR #390: 153
Archive recorded: 416
Archive not recorded: 143
Archive recorded after reviewed decisions: 416
Archive not recorded after reviewed decisions: 143
Deployments: 174
Market Access Records: 8
PR #389 Post-PR #388 Review Gate: complete
PR #390 Evidence and Archive Maintenance Batch 5: active; complete on merge
REVIEW GATE: mandatory after PR #390
```

PR #390 may change exactly the ten Queue v4 Evidence rows and only by adding the reviewed exact dated archive URL to each row.

## Reviewed outcomes

```text
selected: 10
changed: 10
dated_exact_archive_added: 10
reviewed_source_replacement: 0
reviewed_no_safe_change: 0
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

Every accepted archive is backed by an exact-canonical-URL HTTP 200 CDX capture, timestamp, digest, and reviewed source-version scope. No source replacement or inferred promotion is allowed.

## Boundaries

PR #390 may update only the selected canonical Evidence rows and the internal review queue, decisions, outcomes, handoff, same-count checkpoints, statistics history, release baseline, validator, and workflow required to record the reviewed maintenance.

It may not add or remove Evidence identities, alter Evidence Relations, assets, deployments, Market Access records, other canonical record families, or public surfaces.

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

PR #390 must stop at `REVIEW GATE`.
