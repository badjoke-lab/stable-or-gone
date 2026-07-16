# PR #400 Evidence and Archive Maintenance Batch 7 Specification

Status: active bounded manual review  
Review PR: 400  
Public output: false

## Objective

Review exactly the ten Queue v6 Evidence identities, probe each canonical source URL and exact Wayback CDX history, then record one reviewed outcome per identity.

## Selected identities

```text
sog_src_nuon_overview_batch_b
sog_src_paxg_allocation_batch_b
sog_src_paxg_launch_batch_b
sog_src_paxg_pricing_batch_b
sog_src_paxg_redemption_batch_b
sog_src_paxos_busd_announcement
sog_src_pyusd_paxos_official
sog_src_pyusd_paxos_page
sog_src_pyusd_paypal_official
sog_src_rai_faq_batch_b
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
- no Batch 8.

PR #400 stops at `REVIEW GATE` after reviewed decisions and any bounded canonical maintenance are complete.
