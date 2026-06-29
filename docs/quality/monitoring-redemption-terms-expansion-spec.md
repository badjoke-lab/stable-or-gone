# Stable or Gone redemption and terms source expansion

Status: canonical specification  
Updated: 2026-06-29  
Roadmap item: PR #242

## Purpose

PR #242 expands review-only monitoring for issuer redemption, minting, burning, issuance, fees, minimums, customer eligibility, account requirements, jurisdiction restrictions, suspension, and termination terms.

The expansion uses current official HTTPS pages only. Adding a page does not mean every token holder can redeem directly, does not equate a secondary-market sale with issuer redemption, and does not approve any canonical redemption field.

## Added sources

```text
tether-redemption-guide
tether-fees
circle-mint
paxos-stablecoin-terms
gemini-gusd-redemption-support
```

The point-in-time review record is:

```text
scripts/monitoring/sources/redemption-terms-source-review-pr242.json
```

It stores final URLs, final hosts, content types, canonical targets, visible terms, interpretation boundaries, and decisions. It stores no raw response body or normalized page text.

## Signal scope

PR #242 uses the existing signal:

```text
issuance_redemption_update
```

The signal watches visible normalized text for issuance, issued, redemption, redeemed, and circulation language. The reviewed pages also retain terms such as fees, minimums, verified customer, eligibility, jurisdiction, suspension, and termination in the source-review record for human interpretation.

A signal match creates at most a private review candidate after baseline comparison. It does not prove that terms changed or that redemption is available.

## Interpretation boundary

The following are fixed:

```text
direct_redemption_for_every_holder: false
eligibility_must_be_reviewed: true
jurisdiction_must_be_reviewed: true
fees_and_minimums_must_be_reviewed: true
secondary_market_sale_is_not_issuer_redemption: true
```

Circle Mint access, Tether verification, Paxos verified-customer terms, and Gemini platform sale/redemption mechanics must remain distinct. SOG must not collapse these routes into one generic “redeemable” claim.

## Source requirements

Every added source must:

- use HTTPS;
- remain on an allowlisted official host;
- target existing canonical stablecoin and organization IDs;
- have a canonical relationship for every configured stablecoin and organization pair;
- use `issuance_redemption_update` only;
- contain reviewed visible redemption or issuance language;
- receive exactly one matching `pending_initial_acceptance` baseline;
- retain all accepted baseline fields as null.

## Baseline boundary

No live response digest is committed in PR #242.

Each new baseline requires:

```text
status: pending_initial_acceptance
accepted_final_url: null
body_sha256: null
normalized_content_sha256: null
content_type: null
etag: null
last_modified: null
accepted_observed_at: null
accepted_repository_commit: null
accepted_review_reference: null
```

## Prior-source preservation

All nine sources present after PR #241 must remain enabled with matching baseline records. PR #242 may add sources but must not weaken or silently retarget the Phase A or reserve/assurance sources.

## Deterministic validation

CI must prove:

- exactly five reviewed PR #242 sources are added;
- total configured sources and baselines equal 14;
- source IDs and baseline source IDs match exactly;
- prior nine source IDs remain present;
- configured and final URLs use HTTPS;
- configured and final hosts are allowlisted;
- every target ID exists canonically;
- canonical stablecoin-to-organization relationships exist;
- every new source uses only `issuance_redemption_update`;
- reviewed visible terms are non-empty;
- interpretation boundaries keep direct issuer redemption separate from indirect or market exits;
- every new baseline remains pending with null accepted fields;
- canonical stable assets remain 92;
- workflow triggers and permissions remain manual and read-only;
- automatic canonical action, pull requests, public output, and production publication remain prohibited.

## Current-source review limitation

The review record is dated 2026-06-29. Later content, redirect, ownership, access, or terms changes require a new observation and human review. The review record is not a permanent guarantee of eligibility or redemption access.

## Deployment classification

```text
No production deployment required
```
