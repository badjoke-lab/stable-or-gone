# Stable or Gone Agent Instructions

This file is the current mandatory authority entry point. Historical authority through PR #394 remains archived and does not override this file.

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
docs/roadmap-amendments/2026-07-16-pr395-evidence-archive-maintenance-batch-6-activation.md
docs/quality/evidence-archive-maintenance-batch-6-pr395-spec.md
config/evidence-archive-maintenance-batch-6-pr395.json
docs/migration/post-pr393-review-gate-pr394.json
docs/migration/evidence-archive-maintenance-queue-v5-pr393.json
docs/migration/evidence-archive-maintenance-queue-v5-pr393-delta.json
```

## Current workstream

```text
Canonical stable assets: 112
Canonical Evidence: 559
Evidence Relations: 559
Archive recorded before PR #395: 416
Archive not recorded before PR #395: 143
Deployments: 174
Market Access Records: 8
PR #394 Post-PR #393 Review Gate: complete
PR #395 Evidence and Archive Maintenance Batch 6: active; complete on merge
REVIEW GATE: mandatory after PR #395
```

PR #395 may review exactly the ten Queue v5 Evidence identities. Canonical writes remain disabled during the probe phase.

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

Allowed reviewed outcomes:

```text
dated_exact_archive_added
reviewed_source_replacement
reviewed_no_safe_change
```

A dated archive requires an exact-canonical-URL HTTP 200 capture, timestamp, digest, and reviewed source-version scope. A source replacement requires reviewed publisher/product identity and claim-scope equivalence. No canonical change is presumed.

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

PR #395 must stop at `REVIEW GATE`.
