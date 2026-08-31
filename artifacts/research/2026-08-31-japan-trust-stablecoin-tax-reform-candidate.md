# Japan trust-type stablecoin tax-reform candidate — 2026-08-31

Status: research candidate / non-canonical

## Signal

On 2026-08-31, Japan's Financial Services Agency published its FY2027 tax-reform requests. The request list includes measures concerning specified trust beneficial interests (trust-type stablecoins).

The reported policy point is a request to exempt trust-type stablecoin transfers from beneficiary-change reporting requirements that are impractical for a transferable payment instrument. This is a tax-reform request, not enacted law and not yet an effective exemption.

## Primary source

- Financial Services Agency, Japan — 「金融庁の令和９年度税制改正要望について」
  - https://www.fsa.go.jp/news/r8/sonota/20260831.html
- FSA FY2027 tax-reform request PDF
  - https://www.fsa.go.jp/news/r8/sonota/fsa_trps_r9.pdf

## Secondary discovery/context

- CoinPost — 「金融庁、信託型ステーブルコインの調書提出免除を要望　2027年度税制改正」
  - https://coinpost.jp/?p=734402

## Canonical boundary

Do not promote this item directly into `data/regulatory-notes.json` as a generic policy note.

The current regulatory-note shape is asset-linked (`stablecoin_id`), while this request applies to a legal class of trust-type stablecoins rather than to every Japanese stable asset. No reviewed evidence in this research item establishes that existing SOG asset `sog_st_jpyr` is itself a qualifying trust-type stablecoin; JPYR must therefore not be linked by inference.

No schema/taxonomy change is proposed here.

## Promotion gate

A canonical regulatory note/event may be created only after one or more existing or newly reviewed SOG assets are source-backed as falling within the relevant Japanese trust-type stablecoin / specified trust beneficial interest regime. The asset linkage, issuer/trust structure, jurisdictional classification, and effective policy status must be evidenced independently.

Track the policy lifecycle separately:

1. FSA tax-reform request — 2026-08-31 — requested/proposed
2. FY2027 tax-reform outline — pending
3. bill / statutory amendment — pending
4. enactment — pending
5. effective date / implementing guidance — pending

Do not describe the exemption as decided, enacted, or effective until primary evidence supports that stage.
