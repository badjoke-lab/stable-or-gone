# Evidence Archive Payload Verification Batch 2 Review Result Specification

Status: reviewed complete  
Recorded: 2026-08-09

## Purpose

Record the completed manual payload review for the ten deterministic Evidence Archive Payload Verification Batch 2 candidates fixed by PR #538 under the review-only authority merged by PR #537.

This specification records proposals only. It does not authorize any canonical `archived_url` mutation.

## Inputs

```text
config/evidence-archive-payload-verification-batch-2-review-authority.json
data/editorial-research/evidence-archive-payload-verification-batch-2-candidates-2026-08-09.json
data/editorial-research/evidence-archive-payload-verification-batch-2-review-2026-08-09.json
config/evidence-archive-payload-verification-batch-1.json
docs/migration/evidence-archive-maintenance-queue-v7-pr403.json
```

Network-review evidence is retained in GitHub Actions artifacts from the exact-source Wayback probe, long-form probe, and unresolved retry runs named by the review artifact.

## Review method

For every candidate:

1. start from the exact canonical source URL;
2. use Wayback CDX only to discover candidate capture timestamps;
3. independently fetch the dated raw replay payload with redirects disabled;
4. record HTTP status, payload bytes, and SHA-256;
5. extract and inspect readable payload text;
6. compare the archived body to the existing canonical claim scope or source role;
7. accept only an exact-source HTTP-200 payload that preserves that scope.

CDX metadata, redirect-only replays, trailing-slash normalization targets, replacement URLs, unrelated bodies, and snapshots that do not preserve the canonical source role are insufficient.

## Result

```text
targets reviewed: 10
dated exact archive proposals: 8
reviewed no safe change: 2
canonical archive additions authorized: 0
canonical Evidence changes: 0
public-output changes: 0
```

### Dated exact archive proposals

```text
sog_src_susd_legacy_context_batch_a -> 20250720161454
sog_src_susd_rebuilding_2026        -> 20260514190950
sog_src_susd_roadmap_2026           -> 20260427180444
sog_src_susd_sip_status_2026        -> 20251117181931
sog_src_susd_synthetix_docs         -> 20251014024417
sog_src_susd_v3_faq_batch_a         -> 20250430131854
sog_src_terra_docs                   -> 20210903073902
sog_src_tether_transparency          -> 20220712233033
```

The exact archive URLs, HTTP-200 payload sizes, SHA-256 digests, markers, and review reasons are bound in `data/editorial-research/evidence-archive-payload-verification-batch-2-review-2026-08-09.json`.

### Reviewed no-safe-change

`sog_src_susd_sip420_2024` remains unchanged because the exact canonical no-slash replay returned HTTP 302 for all reviewed captures and redirected to the normalized trailing-slash replay. Redirect-only or normalized replacement targets are prohibited by the review contract.

`sog_src_susd_sip423_2026` remains unchanged because the dedicated retry found zero HTTP-200 CDX captures for the exact canonical URL, exact-match canonical query, and trailing-slash discovery query. The live source is not a dated archived payload.

## Canonical boundary

This review-result PR may not modify:

- canonical Evidence rows or `archived_url` values;
- Evidence Relations;
- assets, organizations, relationships, events, deployments, or Market Access Records;
- canonical/public machine-readable output;
- routes, UI, or CSS.

The current canonical state remains:

```text
Evidence: 585
Evidence Relations: 585
Archive recorded: 463
Archive not recorded: 122
Market Access Records: 12
Canonical hash: sha256:f386c1043ca5e83cafbd88e99746d0609aab0154ed48de1970677758a66ed5fa
Canonical file count: 466
```

## Next boundary

The review exits to `REVIEW GATE` with an eight-row implementation proposal.

Before any of those archive URLs can be written into canonical Evidence, a **separately reviewed and merged implementation authority** must bind:

- the exact eight Evidence IDs;
- the exact eight dated archive URLs;
- maximum archive-recorded delta `+8`;
- maximum archive-not-recorded delta `-8`;
- unchanged Evidence and Evidence Relation counts;
- canonical/public validation and production verification requirements.

No automatic continuation is authorized.
