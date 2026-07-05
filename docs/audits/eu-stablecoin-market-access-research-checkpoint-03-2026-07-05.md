# EU Stablecoin Market Access Research Checkpoint 03 — 2026-07-05

Status: supporting audit — research checkpoint  
Governing specification: `docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md`  
Prior matrix: `data/editorial-research/eu-stablecoin-market-access.json`  
Prior context batch: `data/editorial-research/eu-stablecoin-market-access-context-batch-02.json`  
Checkpoint 03 batch: `data/editorial-research/eu-stablecoin-market-access-function-batch-03.json`

## 1. Purpose

This checkpoint records additional first-party and regulator-backed findings needed before the planned guide:

```text
/guides/eu-stablecoin-access-after-mica/
```

The article is still not publishable. Checkpoint 03 improves current-state and function-level evidence, but the publication-date recheck, final source-list review, and conservative Revolut treatment are still pending.

## 2. Gate state after checkpoint 03

```text
platform breadth floor:                     met
stable-asset breadth floor:                 met
function-level evidence depth:              improved
current platform service-state coverage:    improved
Revolut first-party USDT policy confirmed:  no
publication-date current-state recheck:      no
article source-list review complete:         no
article publishable:                         no
```

The article remains blocked. The next work is not to invent missing function cells; it is to define which comparative claims can be supported by the reviewed evidence, perform a final current-state recheck, and complete source-list review.

## 3. OKX Europe — asset-specific evidence added

Reviewed sources:

```text
https://www.okx.com/en-eu/help
https://www.okx.com/en-eu/buy-usdt
https://www.okx.com/en-eu/buy-usdc
https://www.okx.com/en-eu/help/okx-beginners-guide-eea
```

Result:

- the Europe-locale USDT page explicitly presents USDT buy and sell flows;
- the Europe-locale USDC page explicitly presents USDC buy and sell flows;
- EEA help material establishes broader current service context;
- the pages do not justify inventing asset-specific deposit, withdrawal, custody, spot, margin, Earn, or Convert states.

The checkpoint therefore records buy/sell evidence for USDT and USDC and leaves unsupported function cells `not_confirmed`.

## 4. Crypto.com Europe — current service context, not a stablecoin matrix

Reviewed source:

```text
https://crypto.com/eea
```

Result:

The official regional page supports current Europe/EEA service context, including EUR deposit and general crypto buy/sell/trade functionality. It also identifies the European legal entity and current CASP service categories.

Boundary:

The page does not establish stablecoin-by-stablecoin function states. No USDT, USDC, DAI, deposit, withdrawal, custody, or conversion matrix is inferred from the general service page.

## 5. Bybit EU — general product context only

Reviewed source:

```text
https://www.bybit.eu/en-EU/help-center/article/Everything-You-Need-to-Know-to-Get-Started-on-Bybit
```

Result:

The official Bybit EU guide supports general context for:

```text
crypto deposit
fiat buy/sell
spot trading
Earn
```

Boundary:

The guide does not establish asset-specific stablecoin states. The checkpoint does not infer USDT, USDC, DAI, deposit, withdrawal, custody, or conversion states for individual assets.

## 6. Gemini — current EEA closure context supersedes licensing-only treatment

Reviewed source:

```text
https://support.gemini.com/hc/en-gb
```

Result:

Gemini's official support surface states that all customer accounts in the UK, EEA, and Australia are closed effective 2026-04-06.

This materially changes the current-state interpretation. Earlier licensing context remains historical, but Gemini must not be presented as a currently available EEA platform in the access article.

The checkpoint records this as a platform-wide service-state change. It does not fabricate GUSD or third-party stablecoin rows.

## 7. Uphold Europe — transition restrictions with withdrawal availability

Reviewed source:

```text
https://uphold.com/en-eu
```

Result:

The current Europe page states that the MiCAR application remains under active review and that temporary service restrictions apply after the July 1, 2026 transition point. The same notice states that customer assets remain secure and can be withdrawn at any time.

Boundary:

The checkpoint records:

```text
platform service state: temporary_service_restrictions
general withdrawal state: available
other functions: restricted_or_not_confirmed
stablecoin-specific matrix: not_confirmed
```

Marketing content lower on the page is not used to override the current restriction notice or infer stablecoin-specific trading, purchase, staking, or conversion states.

## 8. Coinbase Germany — first-party member-state tradability evidence

Reviewed sources:

```text
https://www.coinbase.com/en-de/price/tether
https://www.coinbase.com/en-de/price/dai
https://www.coinbase.com/en-de/price/paypal-usd
```

Result:

The Germany-locale product pages state that the following are not tradable on Coinbase:

```text
USDT
DAI
PYUSD
```

Boundary:

This is Germany-specific first-party evidence. It is not generalized to every EEA member state. Deposit, withdrawal, custody, and conversion states remain unresolved because the pages do not safely establish those functions.

## 9. Revolut — legal-entity layer confirmed, USDT policy layer still unresolved

Checkpoint 02 already recorded the CySEC CASP entry for:

```text
Revolut Digital Assets (Europe) Ltd
```

Checkpoint 03 did not locate a first-party public Revolut page confirming the reported USDT schedule for:

```text
purchase stop
deposit stop
withdrawal deadline
custody deadline
automatic conversion rule
conversion destination or base-currency treatment
customer cohort or exact geographic scope
```

Therefore the article must continue to treat the USDT change as reported from a customer notice or secondary reporting unless first-party evidence becomes available before publication.

## 10. What checkpoint 03 changes in the article design

The article should no longer be organized as a single flat table that pretends every researched platform exposes the same evidence depth.

The reviewed evidence supports three distinct presentation layers:

```text
A. asset-specific function evidence
   examples: Binance 2025 policy, Kraken, Bitstamp, OKX Europe buy/sell pages, Coinbase Germany tradability pages

B. current platform-wide service-state evidence
   examples: Binance 2026 wind-down context, Gemini EEA closure, Uphold temporary restrictions

C. general service/licensing context without stablecoin matrix support
   examples: Crypto.com Europe, Bybit EU, some OKX service pages
```

The article may compare A-level rows directly. B-level findings should explain current platform access context. C-level findings should not be presented as stablecoin function rows.

## 11. Remaining publication work

Before article implementation:

```text
1. define the final comparative table from A-level evidence only
2. use B-level service-state findings as current platform context
3. use C-level findings only as bounded context, not function claims
4. perform publication-date current-state recheck for every major platform claim
5. review the final source list
6. recheck whether first-party Revolut policy material has appeared
7. update information-current-through date only after the recheck
```

## 12. Monitoring implications carried forward

Checkpoint 03 confirms that later monitoring cannot watch only stablecoin delisting pages. The approved monitoring extension must also detect:

```text
platform-wide service closure
wind-down or exit-only state
temporary transition restrictions
regional or member-state policy changes
asset-specific buy/sell/tradability changes
withdrawal-only survival during broader restrictions
legal-entity or authorization changes
```

These remain review candidates only. No monitored change updates the public article automatically.
