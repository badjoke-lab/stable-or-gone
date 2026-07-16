# PR #393 Evidence Archive Maintenance Queue v5 Activation

Date: 2026-07-16  
Status: active internal queue refresh  
Public output: no

## Authority

Merged PR #391 authorized PR #393 only after completed PR #392 History v4.

## Scope

Queue v5 starts from 143 archive-not-recorded canonical Evidence identities, excludes aliases, Web Archive source URLs, missing URLs, and twelve reviewed suppressions, then applies the existing deterministic non-ranking source-priority order.

History v4 contains no reviewed-reactivated eligible identity. All selected rows therefore begin as ordinary unreviewed archive gaps.

## Deterministic result

```text
Eligible pool: 98
Selected: 10
Reviewed reactivated selected: 0
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

All ten are ordinary unreviewed archive gaps and authorize no canonical change.

## Boundaries

PR #393 may generate an internal Queue v5 and delta only. It may not change canonical data, checkpoints, statistics, release baselines, prior histories or queues, or public surfaces. Queue candidates authorize no canonical change.

## Exit condition

Queue v5 is fixed at ten manual-review candidates and must stop at `REVIEW GATE`. Evidence and Archive Maintenance Batch 6 remains unapproved.
