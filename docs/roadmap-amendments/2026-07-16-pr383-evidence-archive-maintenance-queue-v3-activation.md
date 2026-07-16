# PR #383 Evidence Archive Maintenance Queue v3 Activation

Date: 2026-07-16  
Status: active internal queue refresh  
Public output: no

## Authority

Merged PR #381 and PR #382 authorize exactly:

```text
PR #383 Evidence Archive Maintenance Queue v3 Refresh
REVIEW GATE
```

## Scope

PR #383 must consume the reviewed history v2 contract, manifest, and audit. It must start from the current 160 archive-not-recorded canonical Evidence identities, exclude aliases, Web Archive source URLs, missing source URLs, and ten reviewed suppressed identities, and include reviewed reactivated identities under the explicit v2 rule.

The sole reviewed reactivated identity is:

```text
sog_src_eurc_mint_page
```

The queue must preserve the existing deterministic non-ranking priority order and select at most ten manual-review candidates.

## Boundaries

PR #383 may change only internal authority, queue configuration, deterministic builder, queue/delta outputs, validator, and workflow files.

It may not change canonical Evidence, Evidence Relations, assets, deployments, Market Access records, statistics, public outputs, rankings, scores, recommendations, or historical reviewed queues/outcomes.

## Exit condition

PR #383 must emit a deterministic fresh queue and delta, change no canonical/public data, and stop at `REVIEW GATE`.
