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

The live and exact-source CDX probe completed for all ten identities. Manual review accepted ten dated exact archive additions and zero reviewed no-safe-change outcomes.

```text
ten dated exact archive additions
zero reviewed source replacements
zero reviewed no-safe-change
```

Every accepted archive is an exact canonical source URL HTTP 200 capture with a reviewed timestamp and digest. The Ampleforth root-domain capture is explicitly limited to the current protocol-era version and must not be used to infer the domain's older unrelated history.

## Canonical effect

```text
Evidence identities: 559 -> 559
Evidence Relations: 559 -> 559
Archive recorded: 430 -> 440
Archive not recorded: 129 -> 119
Assets: 112 -> 112
Deployments: 174 -> 174
Market Access Records: 8 -> 8
```

## Boundaries

- no Evidence identity or Relation changes;
- no non-Evidence canonical change;
- no public-surface change;
- no automatic archive promotion;
- no automatic source replacement;
- no Batch 9.

PR #405 stops at `REVIEW GATE` after the reviewed decisions and bounded canonical maintenance are complete.
