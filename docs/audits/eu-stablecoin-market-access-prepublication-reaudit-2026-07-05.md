# EU Stablecoin Market Access Prepublication Re-audit — 2026-07-05

Status: supporting audit — prepublication re-audit  
Governing spec: `docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md`  
Research batch: `data/editorial-research/eu-stablecoin-market-access-reaudit-batch-04.json`

## Decision

The full article evidence set was rechecked after the RLUSD review showed that group authorization, token issuer status, token regulatory path, CASP authorization, and platform access can diverge.

Material results:

```text
RLUSD: four-layer correction required and implemented
OKX: Europe-locale product pages over-interpreted; downgrade required
USDG: explicit European MiCA issuance path omitted
PYUSD / USDP: must not inherit USDG's EU path by group association
EUROe: decommissioning and redemption-only state omitted
USDC / USDG: multi-issuance policy debate needs a caveat
EURAU / EUROD: regulated euro paths omitted
Qivalis: future-only; official site says no token is issued yet
DAI / USDS: protocol-issued distinction needs stronger explanation
EURI / EURCV: historical exchange distribution is not current access
EMT payment services: additional authorization layer omitted
```

## Reviewed corrections

### RLUSD

The article now separates Ripple's full EU EMI licence, preliminary condition-dependent MiCA CASP path, RLUSD issuer identity, and platform access. Ripple's public RLUSD terms identify Standard Custody & Trust Company LLC as issuer. Kraken EEA restricts buying, selling, and trading while preserving deposits and withdrawals. Bitpanda exposes a public RLUSD product page, which is not treated as proof of identical availability across every EEA country or account type.

### OKX Europe

The USDT and USDC pages expose buy/sell UI and marketing copy, but also make access conditional on region, supported country, and payment method. They prove a Europe-locale product surface exists; they do not prove uniform EEA-wide availability. OKX must be removed from the direct A-level function comparison or clearly downgraded to bounded product-surface context.

### Paxos asset paths

Global Dollar states that USDG is also issued by Paxos Issuance Europe under FIN-FSA supervision and in compliance with MiCA. Paxos's EU page centers USDG and separately lists PYUSD and USDP. Group affiliation is not evidence that every Paxos-associated token shares USDG's European issuance path.

The same Paxos EU page says EUROe is being decommissioned and is in Redemption-Only Mode. Regulated infrastructure does not guarantee continued distribution.

### Circle and multi-issuance

Circle's European issuer path for USDC and EURC remains supported. The policy picture is not fully settled: European authorities continue to debate risks from fungible multi-issuance models spanning EU and non-EU issuers. The article needs this caveat.

### EURI and EURCV

Banking Circle's 2024 EURI launch source says EURI was first available through Binance. That historical launch channel is not proof of current July 2026 Binance EU availability.

SG-FORGE's July 2024 EURCV source says the token was restructured into a MiCA-compliant EMT and names Bitstamp as a preferred exchange. That historical distribution reference does not prove current Bitstamp access.

### EURQ and USDQ

Quantoz describes EURQ and USDQ as Netherlands-minted tokens issued through a European-regulated EMI path, designed for MiCA compliance and backed by segregated reserve assets. The article should strengthen this issuer-path description without inferring support by a named exchange from generic partner claims or logos.

### EURAU and EUROD

AllUnity describes EURAU as a MiCAR-compliant euro EMT and states that its website offering is B2B-only, not retail. ODDO BHF describes EUROD as MiCA compliant, with individuals and small businesses accessing it through partner exchange platforms and larger entities using a separate institutional route. ODDO's page showed zero EUROD in circulation as of 2026-06-04. Regulatory readiness, retail eligibility, distribution scale, and platform access are separate dimensions.

### Qivalis

Qivalis describes a planned regulated euro stablecoin but explicitly says it does not issue any stablecoins or tokens yet. It may be mentioned only as a future pipeline example.

### DAI and USDS

Sky.money describes USDS as the native stablecoin of Sky Protocol and the interface as non-custodial. Platform restrictions on DAI or USDS should not be explained as if a single corporate issuer simply failed to obtain an EMI licence.

### Additional payment-services layer

Recent Bit2Me and Crossmint cases show that some EMT payment or transfer activities can involve a payment-services authorization layer in addition to MiCA/CASP status. The article should add this as an eighth possible layer rather than implying CASP authorization answers every payments question.

### Gemini and GUSD

Gemini's EEA account closure is a platform-wide service-state fact. It must not be rewritten as a GUSD issuer-status conclusion.

## Required article work before merge

```text
1. keep RLUSD four-layer correction
2. downgrade OKX direct availability interpretation
3. make USDG European issuance path explicit
4. separate USDG from PYUSD/USDP group association
5. add EUROe redemption-only counterexample
6. add multi-issuance policy caveat
7. clarify historical EURI and EURCV exchange references
8. strengthen EURQ/USDQ issuer path
9. add EURAU and EUROD bounded examples
10. keep Qivalis future-only
11. strengthen DAI/USDS protocol distinction
12. add payment-services authorization layer
13. keep Gemini platform exit separate from GUSD issuer status
14. rerun source review and exact-head CI
```

Current state:

```text
research re-audit: complete
article revision from re-audit: incomplete
publication ready: no
```
