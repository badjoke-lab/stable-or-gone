# PR #400 Evidence and Archive Maintenance Batch 7 Activation

Status: active bounded manual source review  
Authority source: merged PR #399

## Authorized scope

PR #400 may review exactly the ten Queue v6 identities and no others.

The initial workflow is probe-only. It records live response and exact Wayback CDX results. Canonical writes remain disabled during the probe phase.

## Reviewed outcome boundary

Each selected identity may later receive exactly one reviewed outcome:

```text
dated_exact_archive_added
reviewed_source_replacement
reviewed_no_safe_change
```

No automatic capture promotion or automatic source replacement is permitted.

## Canonical boundary

```text
Assets: 112
Evidence: 559
Evidence Relations: 559
Archive recorded / not recorded before review: 425 / 134
Deployments: 174
Market Access Records: 8
```

No canonical change is allowed until reviewed decisions are committed and strict validation is switched from probe-only to reviewed application.

Batch 8 remains unapproved. After PR #400, stop at `REVIEW GATE`.
