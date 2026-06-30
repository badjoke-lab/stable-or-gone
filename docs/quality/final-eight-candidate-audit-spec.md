# Stable or Gone final-eight candidate audit

Status: canonical specification  
Updated: 2026-06-30  
Roadmap item: PR #246, corrected by PR #247, sequence amended by PR #249

## Purpose

PR #246 created the reviewed eight-candidate growth allocation from 92 to 100 stable assets. PR #247 corrected the set after five proposed candidates were found to be already canonical. PR #249 changes only the remaining PR numbers; it does not change candidate identity, evidence standards, batches, or count transitions.

Selection is a research decision until the assigned growth PR promotes a candidate with all required canonical supporting records.

## Corrected selected candidates

```text
sog_cand_000093 Inter Stable Token / IST
sog_cand_000094 NEAR USN
sog_cand_000095 Kava USDX
sog_cand_000096 Bean
sog_cand_000097 UXD
sog_cand_000098 Dollar on Chain / DoC
sog_cand_000099 Mento Euro / EURm
sog_cand_000100 Web 3 Dollar / USD3
```

Rejected as already canonical during the correction audit:

```text
DOLA
Origin Dollar / OUSD
Venus VAI
Djed
Berachain HONEY
```

## Growth allocation

```text
PR #247 92 -> 94: IST, NEAR USN — complete
PR #248 94 -> 96: Kava USDX, Bean — complete
PR #249 editorial guide: no canonical growth
PR #250 96 -> 98: UXD, Dollar on Chain
PR #251 98 -> 100: Mento Euro, Web 3 Dollar
```

Each growth PR remains limited to two stable assets and all required supporting records. PR #249 is not a growth PR and may not alter candidate status or canonical records.

## Selection dimensions

Every selected candidate must document:

- proposed candidate, stablecoin, slug, and organization identities;
- canonical name, symbol, aliases, and disambiguation decision;
- proposed status and lifecycle decision;
- launch date and explicit precision, including unknown;
- mechanism and stabilization model;
- reserve applicability;
- redemption model;
- deployment scope;
- historical value and coverage contribution;
- planned events;
- at least three official evidence leads;
- canonical duplicate review;
- unresolved blocking questions;
- target growth PR.

## Identity rules

Generic names and symbols use disambiguated slugs and IDs where collision risk exists. A disambiguated slug does not change the canonical display name or symbol. A wrapper, bridged representation, deployment, rebrand continuation, or migration continuation must not be promoted as a separate asset merely to fill the remaining allocation.

## Status boundary

Proposed status is not canonical status until the assigned growth PR verifies identity, lifecycle, events, evidence, deployments, and all applicable supporting record groups. A candidate may still be held or rejected if later review finds a duplicate, identity conflict, insufficient evidence, or unsupported lifecycle claim.

## Date boundary

Day precision is allowed only when an official dated source supports the exact day. Month or year precision must remain explicit. Unknown launch dates remain null rather than being inferred from contract age, exchange listings, market databases, testnet activity, or secondary reporting.

## Evidence boundary

Each candidate requires at least three official HTTPS source leads. A lead is not canonical evidence until its title, publisher, publication date when applicable, final or archived URL, claim scope, reliability, and relationship to the proposed record are verified.

## Promotion boundary

The candidate audit and PR #249 editorial amendment retain these rules:

```text
manual_review_required: true
candidate_selection_is_not_canonical_promotion: true
canonical_write_allowed: false
public_output: false
production_publication: false
```

## Deterministic validation

CI must prove:

- exactly eight candidate IDs exist from `sog_cand_000093` through `sog_cand_000100`;
- the corrected identities are unique against canonical name, slug, alias, symbol, domain, issuer, and lineage checks;
- the first four corrected candidates are promoted through PR #248 and the remaining four are not yet canonical;
- PR #250 and PR #251 each contain exactly two remaining candidates;
- count transitions are continuous from 92 to 100 with PR #249 remaining 96 to 96;
- each candidate contains the required research dimensions and official evidence leads;
- blocking unknowns remain explicit;
- canonical records and public output are not changed by selection or sequence metadata alone.

## Deployment classification

```text
No production deployment required
```
