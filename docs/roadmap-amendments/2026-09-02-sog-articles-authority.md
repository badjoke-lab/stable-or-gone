# SOG Articles Authority — 2026-09-02

Status: reviewed authority from REVIEW_GATE

## Purpose

Authorize a bounded public article layer for Stable or Gone (SOG) so evidence-backed stablecoin developments that are not yet eligible for canonical Stablecoin records can be explained publicly without weakening canonical boundaries.

The first implementation target is the 2026-09-01 announcement by a consortium of 21 major financial institutions, including Goldman Sachs and MUFG, to establish a new stablecoin company and target an initial USD-denominated stablecoin launch in H1 2027.

## Authorized scope

This authority permits one additive public route family:

```text
/articles/
/articles/{slug}/
```

It also permits the minimum navigation, metadata, sitemap, and internal-link changes required to expose that route family coherently.

The initial article must distinguish three layers:

1. Confirmed facts supported by primary or high-quality secondary evidence.
2. Explicitly unresolved facts, including company name, token name, issuer identity, chain/deployment, contract address, and actual issuance status until those become public.
3. Clearly labeled analysis or interpretation that must not be presented as issuer motive or canonical fact.

## Canonical boundary

This authority does **not** authorize any change to canonical Stablecoin, Organization, Relationship, Event, Evidence, Evidence Relation, Reserve Report, Known Unknown, Regulatory Note, Deployment, Legal Profile, Reserve Component, Income Profile, Market Access, Archive, or Series records.

```text
canonical delta authorized: 0
schema/taxonomy delta authorized: 0
stable-asset additions/deletions authorized: 0
canonical Evidence additions authorized: 0
canonical Event additions authorized: 0
Series expansion authorized: no
ranking/scoring/recommendation authorized: no
```

The bank-consortium initiative is not a canonical Stablecoin record until a stable asset and its issuer/deployment facts are sufficiently concrete and separately reviewed under the normal record-growth authority.

## Editorial evidence rules

For durable article claims:

- Prefer the consortium or participating institutions' first-party announcement where available.
- Use Reuters or similarly strong reporting for independent confirmation and context.
- Secondary crypto media may be supplementary, not the sole basis for a material claim when primary evidence exists.
- Social-media commentary is not canonical evidence and must not be used as proof of motives, economics, or factual status.
- Planned dates must be written as plans/targets, not as completed launches.
- A planned stablecoin must not be described as existing, issued, live, deployed, or canonical before evidence supports that state.

## Initial article

Working title:

> 21 Financial Institutions Plan Joint Stablecoin Venture, Targeting USD Launch in H1 2027

Required sections:

- What was announced
- From ten banks to a 21-institution venture
- What is confirmed
- What is still unknown
- Why this matters for the stablecoin market
- Bank deposits, reserve income, and control of digital dollars — clearly labeled analysis
- Competition with USDT/USDC and other bank-led initiatives
- MUFG's participation
- SOG classification / registry treatment now
- What would trigger a future canonical review
- Sources

The analysis section may discuss deposit substitution, reserve-income economics, competition with USDT/USDC, tokenized deposits, other bank-led stablecoin initiatives, and consortium-bank incentives only as analysis, with wording that separates inference from stated institutional motives.

## Public presentation rules

Articles are editorial/explanatory surfaces, not canonical registry records. Each article must visibly state its publication/update date and must not imply that publication itself is canonical promotion.

The first implementation should reuse existing SOG layout, typography, metadata, origin, analytics wiring, and responsive behavior. No unrelated redesign is authorized.

## Acceptance criteria

Implementation is acceptable only if:

- `/articles/` and the initial article build successfully;
- official origin remains `https://www.stableorgone.com`;
- canonical hash/count remain unchanged;
- existing Stablecoin, issuer, event, evidence, Compare, Stats, Series, and machine-readable outputs do not regress;
- sitemap/metadata include the new public article route where appropriate;
- article copy clearly distinguishes confirmed facts, unknowns, and analysis;
- no unsupported canonical promotion occurs;
- repository CI passes;
- exact-main production verification is performed after merge because this is a material public-route change.

## Closeout

After the article implementation is merged and exact-main production verification succeeds, synchronize repository status and return the repository to REVIEW_GATE unless a separately reviewed authority is active.

This authority does not create standing permission for canonical stablecoin growth, automated article publication, additional route families, ranking/scoring, or unrelated UI work.
