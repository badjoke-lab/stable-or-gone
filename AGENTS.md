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
docs/roadmap-amendments/2026-07-16-pr385-evidence-archive-maintenance-batch-4-activation.md
docs/quality/evidence-archive-maintenance-batch-4-pr385-spec.md
config/evidence-archive-maintenance-batch-4-pr385.json
docs/migration/post-pr383-review-gate-pr384.json
docs/migration/evidence-archive-maintenance-queue-v3-pr383.json
docs/migration/evidence-archive-maintenance-queue-v3-pr383-delta.json
```

## Current workstream

```text
Canonical stable assets: 112
Canonical Evidence: 559
Evidence Relations: 559
Archive recorded before PR #385: 399
Archive not recorded before PR #385: 160
Deployments: 174
Market Access Records: 8
PR #384 Post-PR #383 Review Gate: complete
PR #385 Evidence and Archive Maintenance Batch 4: active; complete on merge
REVIEW GATE: mandatory after PR #385
```

PR #385 may review exactly the ten Queue v3 Evidence identities and may change only those existing canonical Evidence rows through explicit reviewed outcomes.

## Selected Evidence identities

```text
sog_src_eurc_mint_page
sog_src_fdusd_official_site
sog_src_fdusd_site
sog_src_fei_addresses_batch_a
sog_src_fei_final_redemption_batch_a
sog_src_fei_intro_batch_a
sog_src_fei_launch_batch_a
sog_src_fei_tip121c_execution_2022
sog_src_fei_v2_batch_a
sog_src_frax_app
```

## Allowed reviewed outcomes

```text
dated_exact_archive_added
reviewed_source_replacement
reviewed_no_safe_change
```

A dated archive requires an exact-canonical-URL HTTP 200 capture, timestamp, digest, and reviewed source-version scope. A source replacement requires reviewed publisher/product identity and claim-scope equivalence. No canonical change is presumed.

## Boundaries

PR #385 may update only selected Evidence rows and the internal review queue, decisions, outcomes, handoff, same-count checkpoints, stats history, release baseline, validator, and workflow needed to record reviewed maintenance.

It may not add or remove Evidence identities, alter Evidence Relations, assets, deployments, Market Access records, other canonical record families, or public surfaces.

Not approved:

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

PR #385 must stop at `REVIEW GATE`.