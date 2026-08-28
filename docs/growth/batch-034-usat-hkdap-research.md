# Batch 034 research — USA₮ / HKDAP

Status: reviewed candidate research; not canonical promotion.
Baseline: 122 canonical stable assets.

## USA₮ / USAT

Candidate id: `sog_cand_000123`
Proposed record id: `sog_st_usat`

Reviewed primary material:

- Tether USA₮ launch announcement, 2026-01-27: https://usat.io/news/tether-announces-the-launch-of-usat-the-federally-regulated-dollar-backed-stablecoin-made-in-america/
- USA₮ product site: https://usat.io/

Supported facts:

- official launch date: 2026-01-27
- reference asset: USD
- issuer: Anchorage Digital Bank, N.A.
- Tether Operations is explicitly not the issuer
- product is described as dollar-backed / backed in full by liquid reserves
- product site states 1 USA₮ is redeemable for 1 USD
- status at reviewed date: active

Independent deployment corroboration candidate (not yet accepted as primary issuer evidence):

- Ethereum address reported by multiple exchange/explorer surfaces: `0x07041776f5007ACa2A54844F50503a18A72A8b68`

Do not infer yet:

- unrestricted direct redemption eligibility for every holder
- exact reserve allocation percentages
- reserve segregation / bankruptcy remoteness
- complete mint/burn/admin-role inventory
- additional chain deployments

## HKD At Par / HKDAP

Candidate id: `sog_cand_000124`
Proposed record id: `sog_st_hkdap`

Reviewed primary material:

- Anchorpoint HKDAP product page: https://anchorpoint.hk/HKDAP/
- Anchorpoint transparency page: https://anchorpoint.hk/transparency/
- Anchorpoint whitepaper: https://anchorpoint.hk/hkdap-whitepaper/
- Anchorpoint media/press index: https://anchorpoint.hk/media-press/

Supported facts:

- reference asset: HKD
- issuer: Anchorpoint Financial Limited
- HKMA-licensed regulated HKD-backed stablecoin
- par value / redemption: 1 HKDAP to HKD 1.00
- reserve backing: at least 100% of par value
- reserve structure: high-quality liquid reserve assets held in a trust structure legally segregated from Anchorpoint operational assets, per issuer disclosure
- Beta Access institutional rollout began 2026-08-12
- transparency page reports live circulation, issuance and redemption during Beta Access
- status at reviewed date: active / limited-access Beta phase; canonical status decision must follow existing SOG lifecycle rules

Deployment lead requiring primary-address confirmation before canonical insertion:

- Ethereum mainnet is identified in rollout/test materials; exact canonical token proxy must be confirmed from issuer-controlled material before promotion.

Do not infer yet:

- full retail availability during Beta Access
- audited reserve attestation availability before Full Launch
- exact reserve asset allocation beyond disclosed eligible/high-quality liquid assets
- bankruptcy remoteness beyond the disclosed trust segregation structure
- additional chain deployments

## Duplicate gate

Repository code search on 2026-08-29 returned no exact `USAT/USA₮` or `HKDAP/HKD At Par` canonical matches. This is a candidate-stage signal only; promotion still requires validator-backed id/slug/domain duplicate checks against the full canonical loaders.

## Promotion gate

Neither candidate is promoted by this research file. Promotion requires all existing SOG growth gates, including entity, organization, classification/legal, lifecycle event, evidence, reserve/redemption profile, deployment where verified, income profile, relationship wiring where applicable, generated/runtime parity, count/baseline updates, and green CI.
