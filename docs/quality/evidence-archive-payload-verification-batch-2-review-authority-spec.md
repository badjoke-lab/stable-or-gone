# Evidence Archive Payload Verification Batch 2 — Review Authority

Status: review-only authority  
Recorded: 2026-08-09

## Purpose

Authorize a bounded second payload-verification review without authorizing canonical mutation.

The review must reuse the Evidence Archive Queue v7 non-ranking selection semantics and the Batch 1 payload-verification acceptance requirements. The current 122 archive-not-recorded Evidence identities are the candidate universe. The ten Evidence identities reviewed in Batch 1 are excluded before selecting the next bounded set.

## Selection contract

1. Load current canonical Evidence identities.
2. Keep only rows with no recorded `archived_url` and a canonical source URL.
3. Apply the Queue v7 exclusions for alias identities, source URLs that are already Wayback URLs, and review-history identities suppressed without an accepted reactivation signal.
4. Exclude all ten Evidence identities reviewed in Payload Verification Batch 1.
5. Apply the Queue v7 deterministic non-ranking order:
   - reactivated tier first;
   - regulator / court / legal;
   - official issuer / protocol / product;
   - reserve / attestation / audit;
   - high-quality reporting / research;
   - other reviewed source;
   - Evidence ID as the final deterministic tie-breaker.
6. Select exactly ten candidates if at least ten eligible identities remain.

The selection is a maintenance queue, not a ranking or safety score.

## Manual payload review

For each selected Evidence identity, the reviewer must start from the exact canonical source URL and inspect a dated archive payload. A candidate may be marked `dated_exact_archive_added` only when the dated Wayback URL returns the archived payload and the payload independently preserves the claim scope supported by the canonical source.

A redirect-only result, CDX metadata only, a loosely related page, a replacement target, or a payload whose claim scope cannot be verified is insufficient. `reviewed_no_safe_change` is a valid result and must be preferred to unsupported archive promotion.

## Review-only boundary

This authority permits deterministic candidate generation, internal/editorial review artifacts, manual source and archive-payload inspection, dispositions, and a bounded implementation proposal.

It does **not** permit changes to canonical `archived_url`, source URLs, Evidence identities, Evidence Relations, assets, organizations, events, deployments, Market Access Records, public routes, or material UI.

No automatic archive promotion is allowed. No ranking, score, recommendation, or implied safety conclusion is allowed.

## Implementation handoff

If the review identifies one or more exact dated archive payloads that satisfy the acceptance requirements, canonical promotion requires a new separately reviewed and merged implementation authority. That authority must bind the exact Evidence IDs, exact dated archive URLs, maximum delta, canonical count preservation rules, and validation.

The review exits to `REVIEW GATE` whether the result is promotable, mixed, or entirely `reviewed_no_safe_change`.
