# SOG Reviewed Lifecycle Follow-up Batch Authority

Status: active after merge  
Date: 2026-08-19  
Authority: `config/lifecycle-followup-batch-authority.json`

## Purpose

Activate AI-era execution schedule item 8 as a bounded reviewed lane after Ledger Series Phase 3 closeout.

The lane is for evidence-backed lifecycle follow-up on existing canonical Stablecoins. It may investigate Issue #559 StaX, but discovery/watchlist material is not evidence and this authority does not permit a new Stablecoin addition.

## Scope

- review existing canonical assets for new or missing lifecycle evidence;
- cover depeg, regulatory action, redemption/recovery/compensation, migration/discontinuation, and last-verification changes when supported;
- create reviewed canonical event/evidence or conservative existing-asset field updates where justified;
- investigate StaX from Issue #559 for identity, issuer, chain/contract, mint/redeem, reserve model, redemption rights, launch date, current status, primary sources, independent evidence, and duplicate/alias/migration overlap;
- keep unsupported states explicitly unknown or unchanged;
- use normal reviewed PRs and CI; material public changes require exact-main production verification.

## Explicit boundaries

This authority does not authorize:

- adding or deleting a Stablecoin entity;
- schema/taxonomy changes;
- Market Access mutation;
- archive-program expansion;
- new search/filter, Compare, Stats, or route-family expansion;
- unrelated UI/CSS work;
- ranking, scoring, recommendation, or AI-generated canonical classification;
- DNS/Cloudflare mutation;
- new GA4 identity creation or Measurement ID guessing/hardcoding.

If StaX becomes public-quality and non-duplicate, stop and create a separate reviewed authority before canonical addition.

## Entry state

```text
main: 3f93b5d09f283d0524d4ec0377c160e26fe080e4
stable assets: 119
events: 194
evidence: 585
canonical hash: sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798
open PRs at authority preparation: 0
open research issue: #559 StaX
```

## Execution order

```text
authority merge
-> current canonical / Issue #559 audit
-> bounded follow-up candidate selection
-> source + duplicate review
-> reviewed lifecycle batch PRs for existing assets
-> separate authority if a new Stablecoin addition is justified
-> exact-main production verification where material
-> closeout and REVIEW_GATE restoration
```

## Closeout

Automatic continuation is false. After the bounded lane is complete, repository state returns to `REVIEW_GATE`.
