# PR #405 Evidence and Archive Maintenance Batch 8 Specification

Status: active bounded manual review  
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

## Initial phase

The initial workflow records live response and exact-source CDX evidence. Canonical writes are disabled during this probe phase. Probe rows remain pending manual review and contain no proposed outcome.

## Allowed reviewed outcomes

```text
dated_exact_archive_added
reviewed_source_replacement
reviewed_no_safe_change
```

An archive may be accepted only for an exact canonical source URL HTTP 200 capture with timestamp and digest. Source replacement requires explicit claim-scope and source-version equivalence review. No outcome is presumed.

## Boundaries

- no Evidence identity or Relation changes;
- no non-Evidence canonical change;
- no public-surface change;
- no automatic archive promotion;
- no automatic source replacement;
- no Batch 9.

PR #405 stops at `REVIEW GATE` after reviewed decisions and any bounded canonical maintenance are complete.
