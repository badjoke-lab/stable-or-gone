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

PR #390 manually reviews exactly the ten identities selected by PR #388 Queue v4:

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

## Reviewed decision

The source probe found at least one exact-canonical-URL HTTP 200 capture for each of the ten identities. Manual review accepted ten exact dated archives.

```text
selected: 10
changed: 10
ten exact dated archives
dated_exact_archive_added: 10
reviewed_source_replacement: 0
reviewed_no_safe_change: 0
archive coverage: 406 / 153 -> 416 / 143
```

Every accepted archive is bound to the recorded timestamp, digest, canonical URL, and reviewed source-version scope in `config/evidence-archive-maintenance-batch-5-pr390-decisions.json`.

## Boundaries

PR #390 may touch only the selected canonical Evidence rows and the deterministic internal maintenance outputs, checkpoints, statistics history, and current release baseline required by accepted reviewed outcomes.

It may not add or remove Evidence identities, alter Evidence Relations, assets, deployments, Market Access records, other canonical record families, or public surfaces. It may not rank, score, recommend, or automatically promote monitoring results.

## Exit condition

PR #390 must apply only the ten reviewed `archived_url` additions, preserve all identity and relation counts, and stop at `REVIEW GATE`.
