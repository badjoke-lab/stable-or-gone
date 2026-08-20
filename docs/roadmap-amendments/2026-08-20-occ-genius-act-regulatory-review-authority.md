# OCC GENIUS Act Regulatory Review Authority

Status: reviewed authority proposal
Date: 2026-08-20
Scope: bounded source review only

## Purpose

Authorize a bounded SOG review of the 2026 U.S. Office of the Comptroller of the Currency (OCC) GENIUS Act implementation sequence after a social-media claim on 2026-08-20 described a newly established regulatory framework for cryptocurrency stablecoin issuers.

The review must distinguish a genuinely new 2026-08-20 OCC action from earlier official rulemaking and must not manufacture a duplicate regulatory event.

## Repository boundary

This authority permits research/review artifacts only.

```text
canonical stable-asset mutation: prohibited
canonical organization mutation: prohibited
canonical event mutation: prohibited
canonical Evidence / Evidence Relation mutation: prohibited
canonical Regulatory Note mutation: prohibited
schema/taxonomy mutation: prohibited
public route/UI mutation: prohibited
production/deployment mutation: prohibited
DNS/Cloudflare mutation: prohibited
automatic continuation: prohibited
```

A later canonical implementation requires a separate reviewed authority after this review establishes a material, source-backed delta.

## Primary-source baseline

Review at minimum these OCC materials as one regulatory sequence:

1. OCC Bulletin 2026-3 / Federal Register publication dated 2026-03-02: GENIUS Act implementation NPR covering activities, reserve assets, redemption, risk management, audits/reporting/supervision, custody, applications/registrations, foreign issuers, revocation, capital and operational backstop.
2. OCC Bulletin 2026-24 dated 2026-06-11: proposed weekly and quarterly reporting forms for permitted payment stablecoin issuers and foreign payment stablecoin issuers.
3. OCC June 2026 customer-identification rulemaking for permitted payment stablecoin issuers.
4. OCC Bulletin 2026-28 / Federal Register publication dated 2026-06-24: AML/CFT and sanctions compliance risk-management NPR.
5. OCC 2026 proposed-issuances index and current 2026 bulletin/news-release indexes, checked specifically for any material action dated 2026-08-20.

Social-media posts are discovery inputs only and are not sufficient canonical evidence.

## Review questions

The review must answer:

- Did the OCC issue a new stablecoin-issuer rule, final rule, NPR, guidance, chartering standard, or other material regulatory action on 2026-08-20?
- If yes, what changed relative to the March and June 2026 proposals?
- If no, is the 2026-08-20 claim a restatement or delayed reporting of the existing GENIUS Act implementation framework?
- Which existing SOG regulatory/event records already represent this sequence?
- Would any source-backed delta justify a new Event, Regulatory Note, Evidence identity/relation, or update to an existing record?
- Which stable assets/issuers are directly in scope, without generalizing issuer-level regulation into unsupported asset-level approval, legality, availability, or safety claims?

## Required output

Create a bounded review artifact under `docs/research/` containing:

- exact primary-source URLs and dates
- March/June/August chronology
- duplicate check against current SOG canonical Events, Evidence, Regulatory Notes, organizations and stable assets
- material-delta determination
- proposed canonical shape, if any
- explicit `no_canonical_change` outcome when no new material OCC action can be established

## Acceptance

The review passes only if it is source-backed, duplicate-aware, and preserves unknowns. A social post alone cannot justify a canonical event. Existing March/June rulemaking must not be duplicated as an August event merely because it was reported again on 2026-08-20.

## Closeout

After the review artifact is merged, return to `REVIEW_GATE`. If and only if a material canonical delta is supported, create a separate bounded implementation authority. No automatic canonical implementation follows from this authority.
