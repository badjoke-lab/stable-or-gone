# PR #395 Evidence and Archive Maintenance Batch 6 Activation

Date: 2026-07-16  
Status: active bounded canonical maintenance  
Public output: no

## Authority

Merged PR #394 authorizes exactly PR #395 over the ten Queue v5 identities, followed by `REVIEW GATE`.

## Reviewed decision

The source probe found exact-canonical-URL HTTP 200 captures for nine identities and no exact capture for the Sky documentation root.

```text
selected: 10
changed: 9
nine exact dated archives
one reviewed no-safe-change
dated_exact_archive_added: 9
reviewed_source_replacement: 0
reviewed_no_safe_change: 1
archive coverage: 416 / 143 -> 425 / 134
```

The live Sky documentation redirect resolves to a legal-document page and is not accepted as a replacement for the Dai documentation claim scope.

## Boundaries

PR #395 may touch only the nine selected canonical Evidence rows receiving `archived_url` values and the deterministic internal maintenance outputs, checkpoints, statistics history, and current release baseline. The no-safe-change row remains canonical-data invariant.

It may not add or remove Evidence identities, alter Evidence Relations, assets, deployments, Market Access records, other canonical record families, or public surfaces. It may not rank, score, recommend, or automatically promote monitoring results.

## Exit condition

PR #395 must apply only the nine reviewed `archived_url` additions, preserve all identity and relation counts, and stop at `REVIEW GATE`. Batch 7 remains unapproved.
