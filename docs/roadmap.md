# Stable or Gone Roadmap

Updated: 2026-07-16  
Status: canonical execution schedule — PR #405 active

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
Archive recorded before PR #405: 430
Archive not recorded before PR #405: 129
PR #404 Post-PR #403 Review Gate: complete
PR #405 Evidence and Archive Maintenance Batch 8: active; complete on merge
REVIEW GATE: mandatory after PR #405
```

## Current authority

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/migration/post-pr403-review-gate-pr404.json
docs/roadmap-amendments/2026-07-16-pr405-evidence-archive-maintenance-batch-8-activation.md
docs/quality/evidence-archive-maintenance-batch-8-pr405-spec.md
config/evidence-archive-maintenance-batch-8-pr405.json
docs/migration/evidence-archive-maintenance-queue-v7-pr403.json
```

## Selected identities

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

## Initial phase

The initial workflow is probe-only. It records live response and exact Wayback CDX evidence for the ten canonical source URLs. Canonical writes are disabled until reviewed decisions are committed.

Allowed reviewed outcomes are exact dated archive addition, reviewed source replacement, or reviewed no-safe-change. No outcome is presumed.

## Boundaries

No Evidence identity, Evidence Relation, non-Evidence canonical record, checkpoint, statistics, release-baseline, or public-surface change is allowed during the probe phase. Automatic promotion is prohibited.

Batch 9 and all unrelated workstreams remain unapproved.

After PR #405, stop at `REVIEW GATE`.
