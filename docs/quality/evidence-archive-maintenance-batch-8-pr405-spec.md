# PR #405 Evidence and Archive Maintenance Batch 8 Specification

Status: active reviewed bounded maintenance  
Review PR: 405  
Public output: false

## Objective

Review exactly the ten Queue v7 Evidence identities, probe each canonical source URL and exact Wayback CDX history, then record one reviewed outcome per identity.

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

## Reviewed application

The live and exact-source CDX probe completed for all ten identities. Manual review recorded ten reviewed no-safe-change outcomes and no canonical archive additions.

```text
zero dated exact archive additions
zero reviewed source replacements
ten reviewed no-safe-change
```

Exact-source CDX metadata establishes that captures exist, but it does not establish that each archived payload preserves the canonical claim scope. This bounded pass did not independently inspect the archived payload contents. No archive may be promoted from metadata alone. The Ampleforth root domain also contains substantial unrelated historical archive material and requires especially careful payload review.

## Canonical effect

```text
Evidence identities: 559 -> 559
Evidence Relations: 559 -> 559
Archive recorded: 430 -> 430
Archive not recorded: 129 -> 129
Assets: 112 -> 112
Deployments: 174 -> 174
Market Access Records: 8 -> 8
```

## Boundaries

- no canonical Evidence field change;
- no Evidence identity or Relation changes;
- no non-Evidence canonical change;
- no public-surface change;
- no automatic archive promotion;
- no automatic source replacement;
- no Batch 9.

PR #405 stops at `REVIEW GATE` after the reviewed decisions and no-safe-change handoff are complete.
