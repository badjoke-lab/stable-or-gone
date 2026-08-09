# Evidence Archive Payload Verification Batch 2 Candidate Specification

Status: reviewed deterministic candidate preparation  
Recorded: 2026-08-09

## Purpose

Fix the exact ten Evidence identities that enter manual payload review under the merged Evidence Archive Payload Verification Batch 2 review authority.

This is a review artifact only. It does not authorize a canonical `archived_url` mutation.

## Authority

```text
config/evidence-archive-payload-verification-batch-2-review-authority.json
data/editorial-research/evidence-archive-payload-verification-batch-2-candidates-2026-08-09.json
scripts/build-evidence-archive-payload-verification-batch-2-candidates.mjs
scripts/validate-evidence-archive-payload-verification-batch-2-candidates.mjs
```

## Deterministic selection

The generator reloads the current canonical Evidence set, retains only rows without `archived_url`, and reapplies the Queue v7 non-ranking selection semantics.

Exclusions remain:

- missing canonical source URL;
- Evidence alias identities;
- canonical source URLs that are themselves `web.archive.org` URLs;
- review-history identities suppressed without a valid reactivation signal;
- all ten identities reviewed by Payload Verification Batch 1.

Ordering remains:

1. valid reactivated review-history candidates;
2. regulator / court / legal;
3. official issuer / protocol / product;
4. reserve / attestation / audit;
5. high-quality reporting / research;
6. other reviewed source;
7. Evidence ID as deterministic tie-breaker.

The current input is 585 canonical Evidence rows, of which 122 are unarchived. After current exclusions, the eligible pool is 68. The first ten deterministic candidates all fall in `official_issuer_protocol_product` priority rank 2.

Only three of the ten Batch 1 identities appear in the current unarchived input because seven received reviewed archive additions in Batch 1. All ten remain excluded semantically.

## Fixed candidate set

```text
sog_src_susd_legacy_context_batch_a
sog_src_susd_rebuilding_2026
sog_src_susd_roadmap_2026
sog_src_susd_sip_status_2026
sog_src_susd_sip420_2024
sog_src_susd_sip423_2026
sog_src_susd_synthetix_docs
sog_src_susd_v3_faq_batch_a
sog_src_terra_docs
sog_src_tether_transparency
```

## Manual review requirements

Each candidate must be reviewed from its exact canonical source URL. A promotable archive proposal requires a dated Wayback snapshot that returns a usable payload and whose archived payload is independently fetched and supports the canonical claim scope.

Redirect-only results, CDX metadata alone, a replacement target, an unrelated archived page, or a payload that does not preserve the relevant claim scope are insufficient.

A valid review disposition is either:

```text
dated_exact_archive_proposal
reviewed_no_safe_change
```

## Prohibited changes

This candidate-preparation PR may not change:

- canonical Evidence rows;
- canonical `archived_url` values;
- Evidence Relations;
- assets, organizations, relationships, events, deployments, or Market Access Records;
- public routes or machine-readable canonical output;
- UI or CSS.

Automatic archive promotion is prohibited.

## Exit

The candidate set exits to `MANUAL_PAYLOAD_REVIEW` under the existing review-only authority. Any later canonical archive addition requires a separately reviewed and merged implementation authority that binds the exact Evidence IDs, exact dated archive URLs, maximum delta, and validators.
