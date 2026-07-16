# PR #403 Evidence Archive Maintenance Queue v7 Specification

Status: active internal queue refresh  
Review PR: 403  
Public output: false

## Objective

Consume completed History v6 and generate a deterministic, non-ranking manual-review queue from current archive gaps.

## Binding input

```text
Canonical Evidence: 559
Archive recorded / not recorded: 430 / 129
History sources / events / identities: 7 / 70 / 68
Reviewed unresolved / suppressed / reactivated: 18 / 18 / 0
```

## Selection

- exclude alias identities;
- exclude Web Archive source URLs;
- exclude rows without source URLs;
- exclude all eighteen reviewed suppressions;
- place reviewed-reactivated identities first, but History v6 contains none;
- use source-priority bucket then Evidence ID ordering;
- select at most ten identities;
- do not rank assets or Evidence.

Expected eligible pool: **78**.  
Expected selected count: **10**.  
Expected selected reactivated count: **0**.

```text
Alias identities excluded: 33
Reviewed suppressions excluded: 18
Added / removed / retained versus Queue v6: 10 / 10 / 0
```

Selected Evidence identities:

```text
sog_src_rai_integrations_batch_b
sog_src_rai_oracle_relayer_batch_b
sog_src_rai_ungovernance_batch_b
sog_src_rlusd_docs
sog_src_rlusd_launch_2024
sog_src_rlusd_ripple_page
sog_src_spot_about_batch_b
sog_src_spot_mint_batch_b
sog_src_spot_site_batch_b
sog_src_spot_v2_rollout_batch_b
```

All ten selected rows are ordinary unreviewed archive gaps in the `official_issuer_protocol_product` priority bucket. No reviewed identity is reactivated.

## Required outputs

```text
docs/migration/evidence-archive-maintenance-queue-v7-pr403.json
docs/migration/evidence-archive-maintenance-queue-v7-pr403-delta.json
```

## Boundaries

PR #403 is an internal manual-review queue only. It may not change canonical records, checkpoints, statistics, release baselines, or public surfaces. It does not authorize Archive Batch 8.

## Exit condition

Queue v7 and its Queue v6 delta regenerate deterministically, contain the ten fixed ordinary unreviewed candidates above, exclude all eighteen suppressions, include no reactivated identity, and stop at `REVIEW GATE`.
