# PR #390 Evidence and Archive Maintenance Batch 5 Activation

Date: 2026-07-16  
Status: active bounded canonical maintenance  
Public output: no

## Authority

Merged PR #389 authorizes exactly:

```text
PR #390 Evidence and Archive Maintenance Batch 5
REVIEW GATE
```

## Scope

PR #390 must manually review exactly the ten identities selected by PR #388 Queue v4:

```text
sog_src_fdusd_site
sog_src_frax_docs
sog_src_frax_docs_frax
sog_src_frax_official_site
sog_src_gho_bridge_batch_c
sog_src_gho_facilitators_batch_c
sog_src_gho_gsm_batch_c
sog_src_gho_launch_batch_c
sog_src_gusd_gemini_official
sog_src_lusd_liquity_docs
```

Each identity must receive exactly one reviewed outcome:

```text
dated_exact_archive_added
reviewed_source_replacement
reviewed_no_safe_change
```

A dated archive requires a successful exact-canonical-URL HTTP 200 capture, timestamp, digest, and source-version scope. A source replacement requires reviewed publisher/product identity and claim-scope equivalence. No canonical change is presumed.

## Boundaries

PR #390 may touch only the selected canonical Evidence rows and the deterministic internal maintenance outputs, checkpoints, statistics history, and current release baseline required by accepted reviewed outcomes.

It may not add or remove Evidence identities, alter Evidence Relations, assets, deployments, Market Access records, other canonical record families, or public surfaces. It may not rank, score, recommend, or automatically promote monitoring results.

## Exit condition

PR #390 must record all ten reviewed outcomes, update canonical data only where explicitly justified, and stop at `REVIEW GATE`.