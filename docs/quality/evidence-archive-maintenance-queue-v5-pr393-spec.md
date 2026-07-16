# PR #393 Evidence Archive Maintenance Queue v5 Specification

Status: active internal queue refresh  
Review PR: 393  
Public output: false

## Objective

Generate a fresh non-ranking manual-review queue from the current 143 archive-not-recorded canonical Evidence identities under the completed History v4 suppression and reactivation contract.

## Required inputs

```text
config/evidence-archive-maintenance-queue-v5-pr393.json
config/evidence-archive-review-history-v4-pr392.json
docs/migration/evidence-archive-review-history-manifest-v4-pr392.json
docs/migration/evidence-archive-review-history-audit-v4-pr392.json
docs/migration/post-pr390-review-gate-pr391.json
docs/migration/current-canonical-checkpoint.json
docs/migration/evidence-archive-maintenance-queue-v4-pr388.json
```

## Input boundary

```text
Canonical Evidence: 559
Archive recorded: 416
Archive not recorded: 143
History sources / events / identities: 5 / 50 / 48
Reviewed unresolved suppressed: 12
Reviewed reactivated eligible: 0
```

## Selection rule

Start from archive-not-recorded canonical identities, then exclude aliases, Web Archive source URLs, missing source URLs, and all twelve History v4 suppressions. No tier-0 reviewed-reactivated identity exists. Sort remaining ordinary unreviewed gaps by the existing source-priority bucket and Evidence ID, then select at most ten.

This is a deterministic non-ranking work queue. It does not score or recommend Evidence.

## Deterministic result

```text
Eligible pool: 98
Selected: 10
Selected reviewed-reactivated: 0
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

All ten are ordinary unreviewed archive gaps in selection tier 1.

## Required outputs

```text
docs/migration/evidence-archive-maintenance-queue-v5-pr393.json
docs/migration/evidence-archive-maintenance-queue-v5-pr393-delta.json
```

## Boundaries

PR #393 may create only the Queue v5 contract, builder, versioned queue/delta, authority, validator, active-workstream pointer, and workflow. It may not change canonical data, checkpoints, statistics, release baselines, prior histories or queues, or public surfaces. It does not authorize Batch 6.

## Exit condition

Queue v5 contains exactly the ten reviewed deterministic candidates, all History v4 suppressions are excluded, no reviewed-reactivated identity is selected, all boundaries pass, and the next work item is `REVIEW GATE`.
