# Evidence Archive Payload Verification — Batch 1

Date: 2026-08-01  
Authority PR: #505  
Implementation PR: #506

## Decision

The post-PR #503 review gate is closed only for one bounded archive-payload verification pass over the ten identities previously reviewed without canonical change in PR #405.

The purpose is not to repeat CDX probing. PR #506 must fetch and inspect archived payload bodies and may add exact dated archive URLs only where the body preserves the existing canonical claim scope.

## Fixed identities

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

## Constraints

- exact target set;
- no replacement identities;
- no source replacements;
- no automatic archive promotion;
- no new Evidence or Evidence Relations;
- no asset, organization, relationship, event, deployment, Market Access, route, or UI change;
- canonical counts remain fixed;
- archive coverage may increase by zero to ten only;
- every accepted archive requires an exact timestamp and reviewed payload evidence.

## Exit boundary

After PR #506 merge and production verification, return to `REVIEW GATE`.
