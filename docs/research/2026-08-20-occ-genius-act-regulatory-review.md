# OCC GENIUS Act Regulatory Review Result

Status: reviewed research result
Date: 2026-08-20
Authority: `docs/roadmap-amendments/2026-08-20-occ-genius-act-regulatory-review-authority.md`
Outcome: `no_canonical_change`

## Question reviewed

A 2026-08-20 social-media post stated that the U.S. Office of the Comptroller of the Currency (OCC) had announced that it would establish a regulatory framework for cryptocurrency stablecoin issuers. This review checked whether that claim corresponded to a new OCC stablecoin-issuer rule, final rule, NPR, guidance, chartering standard, or other material regulatory action dated 2026-08-20.

The social-media post is treated only as discovery input and is not canonical evidence.

## Primary-source chronology

### 2026-03-02 — core GENIUS Act implementation NPR

OCC Bulletin 2026-3 and the related Federal Register notice proposed the core OCC implementation framework for the GENIUS Act. The proposal covers activities, reserve assets, redemption, risk management, audits/reporting/supervision, transition of certain state-qualified issuers into the federal framework, custody, issuer applications/registrations, foreign issuers, revocation, and capital/operational backstop requirements.

Primary sources:

- https://www.occ.gov/news-issuances/bulletins/2026/bulletin-2026-3.html
- https://www.occ.gov/news-issuances/federal-register/2026/91fr10202.pdf

### 2026-06-11 — reporting forms and instructions proposal

OCC Bulletin 2026-24 proposed weekly and quarterly reporting forms for permitted payment stablecoin issuers and foreign payment stablecoin issuers under OCC jurisdiction.

Primary source:

- https://www.occ.gov/news-issuances/bulletins/2026/bulletin-2026-24.html

### 2026-06-22 — customer identification program proposal

The interagency proposed rule published on 2026-06-22 contains customer-identification-program requirements for permitted payment stablecoin issuers, including written CIP and risk-based identity-verification requirements.

Primary source:

- https://www.occ.gov/news-issuances/federal-register/2026/91fr37234.pdf

### 2026-06-24 — AML/CFT and sanctions compliance proposal

OCC Bulletin 2026-28 / Federal Register publication proposed BSA, AML/CFT, and sanctions compliance standards for OCC-supervised permitted payment stablecoin issuers.

Primary sources:

- https://www.occ.gov/news-issuances/bulletins/2026/bulletin-2026-28.html
- https://www.occ.gov/news-issuances/federal-register/2026/91fr37840.pdf

### 2026-08-20 — current-index check

The OCC 2026 Proposed Issuances index was checked specifically for a material stablecoin action dated 2026-08-20. As of this review, the stablecoin-related entries shown by the OCC remain the March GENIUS Act implementation NPR and the June reporting/CIP/AML-CFT proposals. The August entries visible in that index concern other subjects.

Current index:

- https://www.occ.gov/topics/laws-and-regulations/occ-regulations/proposed-issuances/occ-proposed-issuances-2026.html

No new OCC stablecoin-issuer rule, final rule, NPR, guidance, or equivalent material action dated 2026-08-20 was established by this review.

## Material-delta determination

`no_canonical_change`

The 2026-08-20 social-media claim is best treated as a restatement or delayed reporting of the already-existing 2026 OCC GENIUS Act implementation sequence unless a later primary source establishes a distinct August action.

Creating a new canonical Event or Regulatory Note dated 2026-08-20 would duplicate earlier rulemaking and would incorrectly convert a social-media report date into a regulator action date.

## SOG duplicate and scope review

### Canonical Regulatory Notes

The current `data/regulatory-notes.json` contains nine reviewed notes covering Tether/CFTC, MakerDAO/Sky lifecycle context, BUSD/Paxos and exchange phase-out context, UST/SEC and post-collapse context, and USDC/SVB operational context. It does not contain an OCC GENIUS Act note that would make an August duplicate appropriate.

This absence does not itself justify adding a generic issuer-regulation note: the March/June OCC framework is sector-level regulatory context and is not evidence that any particular SOG stable asset is approved, legal in all U.S. contexts, available, safe, or OCC-supervised.

### Canonical legacy aggregate Events

The current `data/events.json` legacy aggregate contains only the reviewed USDC 2023 depeg, UST 2022 collapse, and BUSD 2023 wind-down entries. No August 2026 OCC event exists there.

### Existing public regulatory coverage

SOG already has a published GENIUS Act guide lineage. PR #129 / commit `7cc7a2fe2465b56f5d9dfd1e422ad1f6292af076` introduced `/guides/genius-act-stablecoins/`, and the guide already cites OCC Bulletin 2026-3 among its primary regulatory sources. Its catalog entry was originally marked `informationCurrentThrough: 2026-06-25`.

The present authority prohibits public/UI changes, so this review does not revise that guide. A later maintenance authority may update the guide's current-through date and add the June reporting/CIP/AML-CFT sources if desired.

### Organizations and stable assets

The OCC rules apply to categories of permitted payment stablecoin issuers and foreign payment stablecoin issuers subject to OCC jurisdiction. This review does not establish that a specific SOG issuer or stable asset is currently an OCC-supervised PPSI, nor does it support a blanket asset-level regulatory-status change.

No issuer or stable-asset canonical mutation is justified from the 2026-08-20 post.

## Canonical-shape decision

No new canonical shape is authorized or proposed from this signal.

```text
new Event: no
new Regulatory Note: no
new Evidence identity/relation: no
stable-asset mutation: no
organization mutation: no
Market Access mutation: no
schema/taxonomy mutation: no
```

If a future official OCC action materially changes the framework, it should be reviewed on its own regulator action date and then evaluated for one of the existing SOG record families without generalizing sector-level rules into unsupported asset-level claims.

## Follow-up monitoring

Future monitoring should re-open this subject only on a material primary-source change, for example:

- final OCC GENIUS Act regulations;
- a distinct new OCC stablecoin issuer NPR or guidance;
- OCC approval/registration/supervision evidence for a named issuer;
- a material amendment to reserve, redemption, reporting, CIP, AML/CFT, sanctions, capital, custody, or transition requirements.

Social-media repetition alone is not sufficient.

## Closeout

This bounded review is complete. No canonical, schema, public, UI, production, DNS, Cloudflare, or deployment changes were made.

Return SOG to `REVIEW_GATE`. Any future guide maintenance or canonical implementation requires a separate reviewed authority.