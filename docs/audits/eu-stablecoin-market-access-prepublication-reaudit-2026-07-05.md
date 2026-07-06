# EU Stablecoin Market Access Prepublication Re-audit — 2026-07-05

Status: supporting audit — prepublication re-audit  
Governing spec: `docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md`  
Research batch: `data/editorial-research/eu-stablecoin-market-access-reaudit-batch-04.json`

## Decision

The full article evidence set was rechecked after the RLUSD review showed that group authorization, token issuer status, token regulatory path, CASP authorization, and platform access can diverge.

Material results:

```text
RLUSD: four-layer correction required and implemented
OKX: Europe-locale product pages over-interpreted; downgraded
USDG: explicit European MiCA issuance path added
PYUSD / USDP: group-path inheritance warning added
EUROe: decommissioning and redemption-only state added
USDC / USDG: multi-issuance policy caveat added
EURAU / EUROD: regulated euro paths added
Qivalis: future-only and explicitly not live
DAI / USDS: protocol-issued distinction strengthened
EURI / EURCV: historical exchange distribution separated from current access
EMT payment services: additional authorization layer added
```

## Reviewed corrections

### RLUSD

The article now separates Ripple's full EU EMI licence, preliminary condition-dependent MiCA CASP path, RLUSD issuer identity, and platform access. Ripple's public RLUSD terms identify Standard Custody & Trust Company LLC as issuer. Kraken EEA restricts buying, selling, and trading while preserving deposits and withdrawals. Bitpanda exposes a public RLUSD product page, which is not treated as proof of identical availability across every EEA country or account type.

### OKX Europe

The USDT and USDC pages expose buy/sell UI and marketing copy, but also make access conditional on region, supported country, and payment method. They prove a Europe-locale product surface exists; they do not prove uniform EEA-wide availability. The article now removes OKX from the direct A-level function table and keeps it in bounded product-surface context.

### Paxos asset paths

Global Dollar states that USDG is also issued by Paxos Issuance Europe under FIN-FSA supervision and in compliance with MiCA. Paxos's EU page centers USDG and separately lists PYUSD and USDP. Group affiliation is not evidence that every Paxos-associated token shares USDG's European issuance path.

The same Paxos EU page says EUROe is being decommissioned and is in Redemption-Only Mode. The article now uses this as a counterexample showing that regulated infrastructure does not guarantee continued distribution.

### Circle and multi-issuance

Circle's European issuer path for USDC and EURC remains supported. The article now adds the policy caveat that European authorities continue to debate risks from fungible multi-issuance models spanning EU and non-EU issuers.

### EURI and EURCV

Banking Circle's 2024 EURI launch source says EURI was first available through Binance. The article now keeps that as historical distribution context and does not use it as proof of current July 2026 Binance EU availability.

SG-FORGE's July 2024 EURCV source says the token was restructured into a MiCA-compliant EMT and names Bitstamp as a preferred exchange. The article now keeps that statement historical and does not use it as proof of current Bitstamp access.

### EURQ and USDQ

Quantoz describes EURQ and USDQ as Netherlands-minted tokens issued through a European-regulated EMI path, designed for MiCA compliance and backed by segregated reserve assets. The article now states this path explicitly while refusing to infer support by a named exchange from generic partner claims or logos.

### EURAU and EUROD

AllUnity describes EURAU as a MiCAR-compliant euro EMT and states that its website offering is B2B-only, not retail. ODDO BHF describes EUROD as MiCA compliant, with individuals and small businesses accessing it through partner exchange platforms and larger entities using a separate institutional route. ODDO's page showed zero EUROD in circulation as of 2026-06-04. The article now uses these as bounded examples showing that regulatory readiness, retail eligibility, distribution scale, and platform access are separate dimensions.

### Qivalis

Qivalis describes a planned regulated euro stablecoin but explicitly says it does not issue any stablecoins or tokens yet. The article now labels it only as a future pipeline example.

### DAI and USDS

Sky.money describes USDS as the native stablecoin of Sky Protocol and the interface as non-custodial. The article now avoids explaining DAI or USDS restrictions as if a single corporate issuer simply failed to obtain an EMI licence.

### Additional payment-services layer

Recent Bit2Me and Crossmint cases show that some EMT payment or transfer activities can involve a payment-services authorization layer in addition to MiCA/CASP status. The article now adds this as an eighth possible layer rather than implying CASP authorization answers every payments question.

### Gemini and GUSD

Gemini's EEA account closure remains a platform-wide service-state fact. The article keeps it separate from GUSD issuer status.

## Required article work before merge

The re-audit article revisions are implemented. Remaining publication steps are:

```text
1. final source-list and wording review
2. exact-head guide validation
3. exact-head architecture validation
4. exact-head change-history validation
5. exact-head workstream and normal repository CI
6. human review of the final article text
7. merge only after approval
```

Current state:

```text
research re-audit: complete
article revision from re-audit: complete
publication ready: pending exact-head validation and human approval
merge authorized: no
```
