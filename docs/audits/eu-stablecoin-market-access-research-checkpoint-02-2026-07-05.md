# EU Stablecoin Market Access Research Checkpoint 02 — 2026-07-05

Status: supporting audit — research in progress  
Governing specification: `docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md`  
Core matrix: `data/editorial-research/eu-stablecoin-market-access.json`  
Context batch: `data/editorial-research/eu-stablecoin-market-access-context-batch-02.json`

## 1. Result of this checkpoint

The breadth gate has advanced from five platforms with reviewed findings to ten platforms with either reviewed stablecoin-access findings or reviewed CASP/service context.

```text
platform breadth target:                     10
reviewed findings/context after batch 02:    10
platform breadth gate:                       met
function-level matrix complete:              no
Revolut USDT policy scope confirmed:         no
publication-date current-state recheck:       no
article publishable:                         no
```

Meeting the ten-platform breadth target does not make the article publishable. Several platforms currently have only licensing or service-context evidence, not a scoped stablecoin function matrix.

## 2. Critical correction to the Binance interpretation

The first research checkpoint correctly recorded Binance's 2025 EEA stablecoin-specific policy, including separate treatment of spot, margin, custody, deposits, withdrawals, and Convert.

A later current-state check found that this historical policy cannot be presented as the complete July 2026 EU access state.

High-quality reporting around the end of the MiCA transition period states that Binance had not secured the required EU MiCA authorization by the July 1, 2026 transition point and that affected EU customers entered a wind-down/exit-only service state rather than normal service.

Therefore the article must present two distinct layers:

```text
2025: Binance stablecoin-specific EEA restrictions
2026-07: broader Binance EU service interruption / wind-down context
```

The article must not show the 2025 Binance table as if it were a fully current July 2026 EU retail-access table.

Reviewed context sources:

```text
https://www.ft.com/content/c1765ad5-022c-4bc3-9295-ef80791a2977
https://www.ft.com/content/e19a0352-f76d-4293-870b-9ed5e01050fd
https://www.reuters.com/business/finance/binance-set-lose-eu-licence-bid-permission-offer-services-bloc-sources-say-2026-06-16/
```

## 3. Additional platform context

### OKX Europe

Reviewed evidence supports a licensed EU service context after the transition period. Stablecoin-specific function states remain unresolved.

Do not infer from licence status that USDT, USDC, USDG, deposit, withdrawal, custody, Earn, or conversion functions are available.

### Crypto.com

Reviewed reporting establishes a Malta MiCA licence in the 2025 rollout context. Current stablecoin-specific EU/EEA function evidence is still required.

### Bybit EU

Reviewed reporting describes EU passported service expansion and a Spain launch after Austrian authorization. The source supports general service context, not a stablecoin-by-stablecoin matrix.

### Revolut

CySEC's current regulated-entity page confirms:

```text
legal entity: Revolut Digital Assets (Europe) Ltd
licence number: CASP001/25
registration date: 2025-10-20
approved trade name: Revolut
```

The regulator page lists service categories including custody, trading-platform operation, exchange for funds, crypto-to-crypto exchange, placing, and transfer services, plus cross-border service states.

This resolves the CASP legal-entity layer. It does not resolve the reported USDT phase-out details. The research still needs first-party or directly reviewable customer-notice evidence for:

```text
purchase stop
deposit stop
withdrawal deadline
custody deadline
automatic conversion rule
conversion destination/base-currency treatment
customer cohort/geographic scope
```

Official regulator source:

```text
https://www.cysec.gov.cy/en-GB/entities/Crypto-Assets-Entities-%28MiCAR%29/MiCAR-CASPs/Licensees-%28Article-63%29/101097/
```

### Gemini

Gemini is added as an additional researched platform beyond the initial ten-platform priority list. Reviewed reporting supports a Malta MiCA licence and EU passporting context. Stablecoin-specific function states, including GUSD treatment, remain unresolved.

## 4. Current platform research status

```text
Binance       stablecoin policy reviewed + current EU service context reviewed
Kraken        stablecoin function policy reviewed
Bitstamp      stablecoin function policy reviewed
Coinbase      policy direction reviewed; first-party function source missing
Bitpanda      public product page reviewed; EU/EEA scope unresolved
OKX Europe    licensed service context reviewed; function matrix missing
Crypto.com    licensing context reviewed; function matrix missing
Bybit EU      EU service context reviewed; function matrix missing
Revolut       official CASP legal entity reviewed; USDT policy details unresolved
Gemini        additional licensed platform context reviewed; function matrix missing
```

## 5. Why the article remains blocked

The main remaining problem is no longer platform breadth. It is evidence depth.

The article cannot be published until the research can safely distinguish, for the platforms used in the comparative matrix:

```text
buy
sell
spot trading
margin
earn
deposit
withdraw
custody
convert
automatic conversion
```

A platform licence is not a stablecoin availability matrix. A product marketing page is not proof of EU/EEA scope. A media report is not permission to fill function cells it does not explicitly support.

## 6. Next research priority

```text
1. Revolut — first-party or directly reviewable USDT customer notice
2. Coinbase — first-party EEA stablecoin restriction/function source
3. OKX Europe — scoped stablecoin asset and function source
4. Crypto.com — current EU/EEA stablecoin policy source
5. Bybit EU — stablecoin-specific EU function source
6. Bitpanda — scoped EU/EEA policy source
7. Gemini — EU stablecoin and GUSD treatment source
8. Uphold — scoped EU/EEA policy or explicit exclusion from the article matrix
```

## 7. Next checkpoint trigger

Write checkpoint 03 when either:

```text
three additional platform function matrices are materially resolved
or
Revolut's USDT scope and schedule are confirmed/corrected
or
one current platform policy materially contradicts an existing matrix row
```
