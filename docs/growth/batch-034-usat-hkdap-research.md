# Batch 034 research — HKDAP / MGUSD

Status: reviewed candidate research; canonical promotion pending full CI.
Baseline: 122 canonical stable assets.

## Duplicate rejection — USA₮ / USAT

USA₮ was initially selected as `sog_cand_000123`, then rejected after the canonical loaders exposed an existing record in `data/stablecoins-batch-p.json` (`sog_st_usat`) and existing issuer relationship `sog_rel_usat_issuer_batch_p`.

The duplicate validator and primary-display relationship audit correctly surfaced the conflict. Batch 034 does not add a second USA₮ record and does not weaken duplicate validation.

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
- status at reviewed date: active / limited-access Beta phase

Do not infer:

- unrestricted retail availability during Beta Access
- audited reserve attestations before Full Launch
- exact reserve asset allocation beyond the issuer disclosure
- bankruptcy remoteness beyond the disclosed trust segregation structure
- exact canonical token proxy until confirmed by issuer-controlled material

## MGUSD

Candidate id: `sog_cand_000125`
Proposed record id: `sog_st_mgusd`

Reviewed primary material:

- MoneyGram launch announcement, 2026-06-02: https://www.prnewswire.com/news-releases/moneygram-launches-mgusd-a-stablecoin-to-power-its-own-global-network-302787799.html
- MoneyGram newsroom index: https://corporate.moneygram.com/news-categories/press-release

Supported facts:

- official launch date: 2026-06-02
- reference asset: USD
- issuer: Bridge, a Stripe company, described by MoneyGram as the regulated, GENIUS Act-ready issuer
- launch network: Stellar
- M0 provides mint/burn smart-contract infrastructure
- Fireblocks provides wallet infrastructure
- launched in the U.S. market with plans to scale globally
- MoneyGram states customers can hold a stable dollar-denominated balance and convert into local currency through supported MoneyGram services

Do not infer:

- reserve composition or allocation
- reserve ownership, segregation or assurance history
- unrestricted direct issuer redemption
- holder claim structure
- exact Stellar asset identifier
- current issuer/control role assignments beyond the reviewed launch disclosure

## Promotion gate

Batch 034 targets HKDAP and MGUSD only. Promotion requires the existing SOG gates: canonical entity and issuer relationship, classification/legal profile, lifecycle event, primary evidence, reserve/redemption state including explicit unknowns, verified deployment scope, income profile, known-unknowns, runtime parity, baseline/checkpoint updates, deterministic generated outputs and green CI.
