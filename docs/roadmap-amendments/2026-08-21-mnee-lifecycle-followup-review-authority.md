# MNEE Lifecycle Follow-up Review Authority

Status: reviewed authority proposal
Date: 2026-08-21
Scope: bounded source review only

## Purpose

Authorize a bounded SOG review of the current MNEE reserve-attestation and transparency lineage after the currently recorded May 2026 baseline. The purpose is to determine whether later official attestations or issuer disclosures establish a material lifecycle delta that should be reflected in SOG.

## Repository boundary

This authority permits research/review artifacts only.

```text
canonical stable-asset mutation: prohibited
canonical organization mutation: prohibited
canonical event mutation: prohibited
canonical Evidence / Evidence Relation mutation: prohibited
canonical reserve-report mutation: prohibited
canonical Regulatory Note mutation: prohibited
schema/taxonomy mutation: prohibited
public route/UI mutation: prohibited
production/deployment mutation: prohibited
DNS/Cloudflare mutation: prohibited
automatic continuation: prohibited
```

A later canonical implementation requires a separate reviewed authority after this review establishes a material, source-backed delta.

## Review baseline

The review must begin from the current SOG canonical state for MNEE and explicitly identify the latest already-recorded reserve report / attestation date, source URL, and associated Evidence identity before considering any later publication.

Discovery sources may be used to locate candidate material, but canonical conclusions must be based on primary sources from the issuer, reserve attestation provider, regulator, or another first-party authority.

## Review questions

The review must answer:

- What is the latest MNEE reserve-report or attestation date already represented in current SOG canonical data?
- Did MNEE or its attestation provider publish a later official reserve report or attestation after that baseline?
- If yes, does the later publication continue the same attestation lineage or materially change the reserve-report structure, attestor, scope, cadence, asset backing, liabilities, or assurance language?
- Does the later publication justify a new reserve-report record, new Evidence identity/relation, stable-asset update, organization update, Event, or no canonical change?
- Are any gaps, missing periods, superseded documents, or unresolved source links present between the existing baseline and the newest primary source?

## Required output

Create a bounded review artifact under `docs/research/` containing:

- exact current canonical baseline for MNEE
- exact primary-source URLs and publication/reporting dates
- chronology from the current baseline through the newest verified source
- duplicate check against current reserve reports, Evidence, Evidence Relations, organizations and stable assets
- material-delta determination
- proposed canonical shape, if any
- explicit `no_canonical_change` outcome when no later material source-backed delta can be established

## Acceptance

The review passes only if it is source-backed, duplicate-aware, preserves unknowns, and distinguishes publication date from reporting-period date. Missing or inaccessible documents must remain unresolved rather than being inferred from cadence.

## Closeout

After the review artifact is merged, return to `REVIEW_GATE`. If and only if a material canonical delta is supported, create a separate bounded implementation authority. No automatic canonical implementation follows from this authority.
