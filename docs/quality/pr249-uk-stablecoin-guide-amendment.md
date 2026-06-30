# PR #249 UK stablecoin capital-rules guide amendment

Status: canonical implementation plan  
Updated: 2026-06-30  
Roadmap item: PR #249

## Purpose

This amendment records the owner-requested editorial interruption before Growth C. It authorizes one dated UK stablecoin regulation guide inside the existing `Learn / Guides / Regulation` structure.

PR #249 is an editorial interruption and changes no canonical registry count. It does not create a new guide category, top-level route family, registry record type, UI direction, or publication authority.

## Approved route and placement

```text
Index: /guides/
Category: regulation
Article: /guides/uk-stablecoin-capital-rules-2026/
Homepage: replace the JPYC vs JPYSC featured card with the UK guide
```

The JPYC vs JPYSC guide remains published in the existing asset-comparisons section. The homepage continues to show exactly three guide cards.

## Editorial scope

The guide must:

- explain the reported reduction of a key FCA issuer-capital coefficient from 2% to 1%;
- state that issuer capital is not the same as backing assets;
- distinguish backing, liquidity, safeguarding, redemption, and corporate loss-absorbing capital;
- separate the FCA regime from the Bank of England systemic-stablecoin regime;
- state that the reported FCA issuer rule is not a worldwide 1% standard for USDT, USDC, or every existing stablecoin;
- identify which claims are confirmed by official primary sources and which still rely on reporting pending direct verification of controlling final FCA text;
- use existing Guide article components, editorial styling, metadata, sitemap generation, related-record links, and revision-history behavior.

## Source hierarchy

Use sources in this order:

1. final FCA policy statements and Handbook text when directly available;
2. Bank of England policy statements and draft/final Code of Practice;
3. UK legislation and HM Treasury material;
4. FCA preparation and authorization pages;
5. reliable reporting for newly announced details not yet located in controlling primary text.

The 1% figure may be described as a reported final policy outcome until the controlling FCA policy statement or Handbook provision is directly verified. The guide must not present a simplified example as a complete firm-level capital calculation.

## Data preservation

PR #249 must not change canonical stablecoin, organization, relationship, classification, reserve/redemption profile, event, event-detail, evidence, evidence-relation, reserve-context, known-unknown, regulatory-note, deployment, legal-profile, stable-asset-relationship, reserve-component, or income-profile records.

Expected stable-asset count remains:

```text
96
```

A public update-history entry and guide-to-record discovery links are editorial navigation metadata, not canonical stablecoin claims.

## Sequence amendment

PR #233 originally authorized work through PR #263. This amendment inserts PR #249 and shifts the remaining numbered sequence by one without changing its substantive responsibilities:

```text
PR #247-#248 reviewed growth from 92 to 96 — complete
PR #249 UK stablecoin capital-rules guide
PR #250 Growth C: 96 -> 98
PR #251 Growth D: 98 -> 100
PR #252-#259 100-record quality audit
PR #260-#264 non-UI release preparation
```

No growth PR may contain more than two new stable assets. Production publication is governed by `docs/deployment-policy.md` and is not deferred by the growth sequence or PR #264.

## Validation

PR #249 must pass:

- guide catalog and page existence validation;
- dated-guide metadata and revision-history validation;
- homepage featured-guide validation;
- guide-to-stablecoin relationship validation;
- route inventory and site-architecture validation;
- sitemap inclusion through the existing guide catalog;
- Astro check and full repository build;
- canonical record-count and generated-output preservation checks.

## Deployment classification

```text
Automatic production deployment on main
```

The guide is published by setting `publishedAt` in `src/data/guideCatalog.ts`; after merge, the automatic `main` deployment workflow publishes and verifies the route under `docs/deployment-policy.md`.
