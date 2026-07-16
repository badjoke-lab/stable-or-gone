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
8. every named queue, history contract, audit, outcome, and checkpoint

Current authority:

```text
docs/roadmap-amendments/2026-07-16-pr380-evidence-archive-maintenance-batch-3-activation.md
docs/quality/evidence-archive-maintenance-batch-3-pr380-spec.md
config/evidence-archive-maintenance-batch-3-pr380.json
docs/migration/post-pr378-review-gate-pr379.json
docs/migration/evidence-archive-maintenance-queue-v2-pr378.json
```

## Current workstream

```text
Canonical stable assets: 112
Canonical Evidence: 559
Evidence Relations: 559
Archive recorded: 390
Archive not recorded: 169
PR #379 Post-PR #378 Review Gate: complete
PR #380 Evidence and Archive Maintenance Batch 3: active; complete on merge
REVIEW GATE: mandatory after PR #380
```

## Exact PR #380 scope

PR #380 must review exactly these ten existing Evidence identities:

```text
sog_src_bold_technical_batch_c
sog_src_circle_transparency
sog_src_circle_usdc_product
sog_src_crvusd_curve_docs
sog_src_crvusd_curve_lifecycle_event
sog_src_dai_whitepaper_pr354
sog_src_eurc_circle_page
sog_src_eurc_developer_docs
sog_src_eurc_launch_2022
sog_src_eurc_mint_page
```

No identity may be substituted. Every identity must receive exactly one reviewed outcome:

```text
dated_exact_archive_added
reviewed_source_replacement
reviewed_no_safe_change
```

A canonical archive may be added only after a successful exact-source dated capture is verified. A source replacement requires reviewed claim-scope and source-version equivalence. Queue presence does not presume a canonical change.

## Boundaries

PR #380 may update only the ten selected Evidence records and the internal authority, queue, outcomes, handoff, validators, checkpoints, statistics, and workflow files required to validate those reviewed changes.

It may not add or remove Evidence identities, change Evidence Relations, assets, deployments, Market Access records, rankings, scores, recommendations, monitoring promotion, or public navigation/surfaces.

Not approved before the next review gate:

```text
Evidence and Archive Maintenance Batch 4
Tier A Dossier Deepening Batch 6
Market Access Pilot 3
Record Growth Batch 2
new public page or explorer
```

Every non-trivial PR must state specification references, roadmap item, scope, non-goals, named inputs, preservation, validation, and deployment classification. Work after PR #380 must pause at `REVIEW GATE`.
