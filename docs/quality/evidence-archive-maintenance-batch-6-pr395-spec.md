# PR #395 Evidence and Archive Maintenance Batch 6 Specification

Status: active bounded manual review  
Review PR: 395  
Public output: false

## Objective

Review exactly the ten Queue v5 Evidence identities using live-source and exact Wayback CDX probes before any canonical decision.

## Selected identities

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

## Allowed outcomes

```text
dated_exact_archive_added
reviewed_source_replacement
reviewed_no_safe_change
```

## Review phase

The initial workflow records live response, final URL, content identity, and exact-source HTTP 200 Wayback CDX captures. Canonical writes are disabled until a reviewed decision file is committed.

## Boundaries

No new Evidence identities, Evidence Relations, non-Evidence canonical changes, public surfaces, ranking, scoring, recommendation, or automatic promotion. Batch 7 is not authorized.

## Exit condition

Every selected identity receives one reviewed outcome, all accepted changes are reproducible, and PR #395 stops at `REVIEW GATE`.
