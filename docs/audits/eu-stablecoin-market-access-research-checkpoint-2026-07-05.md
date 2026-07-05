# EU Stablecoin Market Access Research Checkpoint — 2026-07-05

Status: supporting audit — research in progress  
Governing specification: `docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md`  
Working matrix: `data/editorial-research/eu-stablecoin-market-access.json`

## 1. Purpose

This checkpoint records the first reviewed research pass for the planned guide:

```text
/guides/eu-stablecoin-access-after-mica/
```

The guide is not publishable yet. This checkpoint is research material, not a public market-access classification and not a monitoring output.

## 2. Current gate state

```text
minimum target platforms:                    10
platforms with reviewed findings so far:      5
minimum target stable assets:                15
stable assets touched by reviewed findings:  17
function-level matrix complete:              no
ESMA register cross-check started:           yes
Revolut first-party scope confirmed:          no
publication-date current-state recheck:       no
publishable:                                  no
```

The asset count above measures assets touched by reviewed platform findings, not assets with a complete cross-platform access record.

## 3. Reviewed platform findings

### Binance — reviewed

Source:

```text
https://www.binance.com/en/support/announcement/detail/bcaa1f68d6a6450099056ff694ad6c46
```

Scope:

```text
EEA users
```

Reviewed result:

- affected set explicitly includes USDT, FDUSD, TUSD, USDP, DAI, AEUR, XUSD, and PAXG;
- non-MiCA spot pairs became unavailable after the stated March 31, 2025 deadline;
- non-MiCA margin pairs were removed under the March 27, 2025 schedule;
- custody continued;
- deposits and withdrawals continued;
- remaining holdings could still be sold through Convert after spot delisting;
- the source names USDC and EURI as continuing examples.

Important boundary:

The source contains automatic USDC conversion/settlement rules for specified margin contexts. That must not be rewritten as universal automatic conversion of ordinary custody balances.

### Kraken — reviewed

Source:

```text
https://support.kraken.com/articles/stablecoin-offerings-for-eea-clients
```

Scope:

```text
EEA clients
```

Reviewed result:

The page, last updated April 13, 2026 when checked, lists DAI, PYUSD, RLUSD, UST, EURT, USDT, TUSD, USDD, and USDS as delisted in the EEA. The source states that these assets cannot be traded and can only be deposited or withdrawn. It further states that EEA residents cannot trade, buy, or sell them.

Important boundary:

The page supports deposit and withdrawal states. It does not justify inventing margin, Earn, or conversion states.

### Bitstamp — reviewed

Source:

```text
https://blog.bitstamp.net/post/mica-regulation-update-on-select-assets-in-the-eueea/
```

Scope:

```text
Bitstamp Europe S.A. customers in the EU/EEA
```

Reviewed result:

- USDT, DAI, PYUSD, VEUR, VCHF, DGLD, and WBTC had trading disabled before the later custody transition;
- USDT Earn Lending ended April 14, 2025;
- deposits and withdrawals for the affected set halted May 5, 2025;
- automatic conversion started May 6, 2025;
- USDT, DAI, PYUSD, VEUR, VCHF, and DGLD were converted to USDC;
- the article targeted USDC credit on May 8, 2025.

This is currently the clearest reviewed example of a sequence progressing from trading restriction to deposit/withdrawal suspension and then automatic conversion.

### Coinbase — policy direction reviewed, function matrix unresolved

Source:

```text
https://www.reuters.com/technology/coinbase-delist-some-stablecoins-europe-ahead-new-regulations-2024-10-04/
```

Scope:

```text
EEA
```

Reviewed result:

Reuters reported Coinbase's policy direction to restrict services connected with stablecoins that did not meet MiCA requirements by December 30, 2024 and reported transition options toward USDC and EURC.

Important boundary:

This is Tier C evidence. It does not support a complete affected-asset list or function-level matrix. A first-party Coinbase source remains required.

### Bitpanda — public page reviewed, EU/EEA scope unresolved

Sources:

```text
https://www.bitpanda.com/en/prices/tether-usdt
https://support.bitpanda.com/hc/en-us/articles/360019578140-Who-can-use-Bitpanda
```

Reviewed result:

The public USDT product page contains current buy/sell-oriented marketing copy, but it is presented with a Global region selector. The separate account-availability help page shows that services depend on residence and supported countries.

Important boundary:

The public Global product page alone is not sufficient evidence for an EU/EEA USDT function state. The research matrix therefore keeps Bitpanda's USDT function cells `not_confirmed` pending a scoped first-party source.

## 4. Regulatory register checkpoint

Source:

```text
https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/markets-crypto-assets-regulation-mica
```

Reviewed result:

The ESMA MiCA hub separates the interim register into distinct datasets for:

```text
non-ART/EMT crypto-asset white papers
ART issuers
EMT issuers
authorised CASPs
non-compliant entities
```

The page displayed a register update date of 2026-07-03 when checked on 2026-07-05 and states that ESMA publishes the latest interim register version on weekly intervals.

This supports the specification rule that issuer status, token status, CASP authorization, and platform service availability must not be collapsed into one field.

## 5. Immediate unresolved queue

Priority research order:

```text
1. Revolut — first-party scope and deadline confirmation
2. Coinbase — first-party EEA asset/function source
3. Crypto.com — EU/EEA stablecoin restriction or current availability source
4. OKX Europe — EU platform asset list and stablecoin policy
5. Bybit EU — EU asset availability and stablecoin function state
6. Uphold — scoped EU/EEA stablecoin policy
7. Bitpanda — scoped first-party EU/EEA policy rather than Global product copy
```

## 6. Research safety rules carried forward

- Do not convert EEA scope into EU scope.
- Do not infer deposit status from trading status.
- Do not infer withdrawal status from custody status.
- Do not infer universal auto-conversion from a margin-account settlement rule.
- Do not use a Global marketing page to prove EU/EEA service availability.
- Do not use a media report to fill function cells that the report does not explicitly support.
- Keep `not_confirmed` until a source supports the field.

## 7. Next checkpoint condition

The next research checkpoint should be written after at least three additional platform targets have reviewed findings or after a material correction to one of the current five reviewed platform findings.
