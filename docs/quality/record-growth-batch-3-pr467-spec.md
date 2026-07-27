# PR #467 Record Growth Batch 3 Specification

Status: reviewed complete — REVIEW GATE
Deployment class: canonical data growth without public-surface expansion

## Authority

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-25-pr466-post-ui-data-growth-review-gate.md
docs/quality/post-ui-data-growth-review-gate-pr466-spec.md
config/post-ui-data-growth-review-gate-pr466.json
docs/migration/post-ui-data-growth-review-gate-pr466.json
data/editorial-research/record-growth-candidate-audit-v2-pr427.json
data/editorial-research/record-growth-batch-3-pr467-source-review.json
```

## Selected records

PR #466 authorizes exactly two records:

```text
Quantoz PLNQ / PLNQ / sog_st_plnq
Quantoz GBPQ / GBPQ / sog_st_gbpq
```

The pair is a coherent Quantoz regulated non-EUR context. The selection is not a ranking, safety judgment, endorsement, or recommendation.

## Entry-gate result

The 2026-07-25 source review confirms:

- Quantoz announced both EMTs as launched on 2026-04-14;
- current PLNQ and GBPQ whitepapers are v1.1 dated 2026-04-30;
- Quantoz publishes exact Ethereum Token IDs for both assets;
- Quantoz Payments B.V. remains listed by De Nederlandsche Bank as an electronic-money institution authorized for issuance, distribution, and redemption;
- Quantoz states that its stablecoins use safeguarded segregated reserves and are redeemable one-to-one;
- no current canonical ID, slug, symbol, name, or contract match exists;
- the existing organization `sog_issuer_quantoz_payments` must be reused.

## Identity and issuer rules

No new Quantoz organization may be created. Each asset is a distinct canonical identity under the existing issuer.

```text
PLNQ Ethereum: 0x00B81d7B21955837890d9346e4978b6b43762b3A
GBPQ Ethereum: 0xb92e69fd39bf33ee1f81e56b0b7933bdc49df46e
```

Only these verified Ethereum deployments are canonicalized in PR #467. Announced future Polygon, Stellar, XRPL, Algorand, or Xahau availability remains a known unknown until an exact active identifier is reviewed.

## Complete-record requirement

Each asset must include all applicable layers:

```text
canonical identity
issuer relationship
lifecycle and classification
reserve and redemption profile
launch event and typed event detail
primary-source Evidence and Evidence Relations
reserve context
known unknowns
verified Ethereum deployment
legal profile
reserve component
income profile
candidate promotion mapping
canonical checkpoint
statistics history
release-integrity baseline
```

A complete record may preserve explicit unknowns. It may not replace missing token-specific reserve allocation, distribution, redemption threshold, fee, or future-network evidence with invented values.

## Reviewed operational meaning

PLNQ is a Polish-złoty-referenced electronic-money token and GBPQ is a British-pound-referenced electronic-money token. Both are recorded as active from the issuer’s 2026-04-14 launch statement, initially issued on Ethereum and initially distributed to institutional clients through Zodia Markets.

The shared reserve model is recorded at the issuer-policy level: cash deposits and government bonds, safeguarded segregated accounts, and reserves described as exceeding circulation. Token-specific monthly allocations must remain unknown unless the reviewed source names the exact asset and period.

Statutory redemption rights are kept separate from direct operational access. The record may state redemption at par against the issuer while preserving onboarding, channel, minimum, fee, and jurisdiction details as terms-dependent or unknown when not established by evidence.

## Expected counts

```text
Stable assets: 114 -> 116
Organizations: 107 -> 107
Relationships: 126 -> 128
Events: 189 -> 191
Evidence: 565 -> 571
Evidence Relations: 565 -> 571
Reserve reports: 122 -> 124
Known unknowns: 331 -> 337
Deployments: 180 -> 182
Legal profiles: 114 -> 116
Stable-asset relationships: 5 -> 5
Reserve components: 147 -> 149
Income profiles: 114 -> 116
Market Access Records: 8 -> 8
Archive recorded: 436 -> 442
Archive not recorded: 129 -> 129
```

## Hard boundaries

PR #467 may not add a third asset, create a second Quantoz organization, canonicalize unverified future networks, add a Market Access Record, publish monitoring material, create a new public route family or UI surface, change metadata semantics, add a ranking or score, make an endorsement or recommendation, or introduce automatic promotion.

It may not rewrite prior statistics snapshots or historical candidate-audit decisions.

## Validation

The dedicated validator must confirm exact selected identities and Ethereum contracts, exact count deltas, complete record families, source and Evidence integrity, issuer reuse, loader and manifest wiring, immutable statistics-history prefix, canonical/public output consistency, and the review-gate exit.

## Exit state

After PR #467, stop at `REVIEW GATE`. No subsequent work item is authorized by this specification.
