# Stable or Gone next-growth candidate audit

Status: canonical implementation specification — PR #329  
Updated: 2026-07-08

## Purpose

PR #329 creates the reviewed candidate allocation for controlled growth from 100 to 110 canonical stable assets.

The current candidate master reached a closed 100-candidate / 100-promoted / zero-pending state. Therefore PR #329 does not consume a pre-existing pending queue. It creates a new reviewed research allocation for candidate IDs `sog_cand_000101` through `sog_cand_000110`.

Candidate selection is not canonical promotion.

## Starting boundary

```text
canonical stable assets: 100
candidate-control rows before PR #329 allocation: 100
promoted candidate-control rows: 100
pending candidate-control rows: 0
```

The audited 100-asset canonical checkpoint remains authoritative until PR #330 begins controlled promotion.

## Selected candidates

```text
sog_cand_000101  EURe / Monerium
sog_cand_000102  poundtoken / GBPT
sog_cand_000103  StablR Euro / EURR
sog_cand_000104  StablR USD / USDR
sog_cand_000105  PHPC / Coins.ph
sog_cand_000106  StraitsX Indonesian Rupiah / XIDR
sog_cand_000107  CAD Coin / CADC
sog_cand_000108  ZARP Stablecoin / ZARP
sog_cand_000109  AUDD
sog_cand_000110  NZD Stablecoin / NZDS
```

## Controlled growth allocation

```text
PR #330  100 -> 102: EURe, GBPT
PR #331  102 -> 104: EURR, StablR USDR
PR #332  104 -> 106: PHPC, XIDR
PR #333  106 -> 108: CADC, ZARP
PR #334  108 -> 110: AUDD, NZDS
```

Each growth PR may promote exactly two allocated candidates and all required supporting records. No growth PR may substitute an unallocated identity merely to preserve a numeric target.

## Selection rationale

The allocation deliberately broadens dimensions that remain thinner than USD-denominated protocol stablecoins:

- regulated euro electronic-money tokens;
- GBP coverage;
- PHP and IDR regional-fiat coverage;
- CAD, ZAR, AUD, and NZD regional-fiat coverage;
- regulated issuer and reserve-assurance models;
- a current incident/recovery lineage that must be recorded without hiding restricted state.

This is a coverage decision, not a market-cap ranking or recommendation.

## Required candidate dimensions

Every selected candidate must document:

- candidate ID;
- proposed stablecoin ID;
- proposed slug;
- canonical display name;
- symbol and aliases;
- proposed organization identity;
- proposed lifecycle status;
- launch date and explicit precision, including unknown;
- mechanism and stabilization model;
- reserve applicability;
- redemption model;
- lifecycle decision;
- deployment scope;
- historical value;
- value contribution;
- event plan;
- at least three official HTTPS evidence leads;
- duplicate review;
- explicit blocking unknowns;
- target growth PR;
- target batch;
- selection decision.

## Identity and duplicate boundary

PR #329 must prove that proposed stablecoin IDs and slugs do not already exist in canonical stable-asset records.

Name, alias, and symbol similarity does not automatically mean duplicate identity. It must be explicitly represented in `duplicate_review`. Examples include generic stablecoin symbols such as USDR and issuer-specific naming collisions.

A wrapper, bridged representation, chain deployment, rebrand continuation, migration continuation, or yield receipt must not be promoted as a separate asset merely to fill the allocation.

## Evidence boundary

Every candidate requires at least three official HTTPS evidence leads.

An evidence lead is research input only. It is not canonical evidence until the assigned growth PR verifies:

- final URL or archived URL;
- title;
- publisher;
- publication date when applicable;
- exact claim scope;
- reliability;
- relationship to the proposed canonical record.

A candidate may be held or rejected during its assigned growth PR if official evidence does not support the proposed lifecycle, reserve, redemption, identity, or deployment claims.

## Incident-state boundary

StablR EURR and StablR USDR are selected because the candidate audit identified a material 2026 cybersecurity incident and recovery-process history on official issuer surfaces.

Their proposed `restricted` status is a research hypothesis for promotion review. The assigned growth PR must determine current mint, redeem, transfer, recovery, and reserve state from official evidence. It must not silently publish them as ordinary active assets solely because product pages remain online.

## Date boundary

Unknown dates remain `null` with explicit `launch_date_precision: unknown`.

Growth PRs may increase precision only with official dated evidence. Contract creation time, exchange listing time, market-database dates, secondary reporting, and first observed market price must not be silently substituted for launch date.

## Promotion boundary

PR #329 retains this policy:

```text
manual_review_required: true
candidate_selection_is_not_canonical_promotion: true
canonical_write_allowed: false
public_output: false
production_publication: false
```

PR #329 may not:

- add canonical stablecoin records;
- add canonical organization records;
- add canonical events or evidence;
- add canonical deployments;
- change public record counts;
- append a statistics-history checkpoint;
- publish candidate research.

## Deterministic validation

CI must prove:

- exactly ten candidate IDs exist;
- IDs are exactly `sog_cand_000101` through `sog_cand_000110`;
- proposed stablecoin IDs are unique;
- proposed slugs are unique;
- target batches are exactly `batch_022` through `batch_026`;
- each batch contains exactly two candidates;
- PR allocation is exactly #330 through #334;
- count transitions are continuous from 100 to 110;
- every growth PR contains exactly two candidate IDs;
- all selected candidate IDs appear exactly once in the growth plan;
- every candidate has at least three official HTTPS evidence leads;
- all required research dimensions exist;
- blocking unknowns are non-empty;
- duplicate review is explicit;
- no proposed ID or slug already exists in the canonical 100-asset baseline;
- canonical stablecoin count remains 100;
- policy forbids canonical write and public output.

## Workstream transition

```text
PR #328 statistics analysis expansion: complete
PR #329 next-growth candidate audit: active
PR #330 100 -> 102 controlled growth: next
```

## Completion condition

PR #329 is complete when:

- the ten-candidate audit is merged;
- deterministic candidate-audit validation passes;
- canonical data validation passes;
- the audited 100-asset checkpoint remains unchanged;
- no canonical record or public route is changed;
- PR #330 has an exact two-candidate allocation and may begin only after PR #329 merges.

## Deployment classification

```text
No production deployment required
```
