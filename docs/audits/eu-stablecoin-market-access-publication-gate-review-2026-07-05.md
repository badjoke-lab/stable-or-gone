# EU Stablecoin Market Access Publication Gate Review — 2026-07-05

Status: supporting audit — publication gate review  
Governing specification: `docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md`  
Target route: `/guides/eu-stablecoin-access-after-mica/`

## 1. Decision

The guide may proceed to reviewed implementation with a deliberately bounded comparison structure.

```text
platform breadth floor:                         pass
stable-asset breadth floor:                     pass
function-level claim separation:                pass for claims selected for publication
region/legal-entity scope preservation:         pass
major platform source hierarchy:                pass with documented Tier C current-service exceptions
ESMA/register cross-check:                      pass
Revolut conservative treatment:                 pass
source-list review:                             pass
current service context vs historical policy:   pass
publication-date current-state recheck:         pass on 2026-07-05
publication gate:                               pass
```

The gate passes because the article is not required to invent a complete matrix for every researched platform. The specification requires function-level separation for the comparative claims actually used. The publication design therefore limits direct function comparisons to evidence-supported rows and treats platform-wide service state and general service context as separate sections.

## 2. Evidence presentation contract

The article must preserve three evidence layers.

### A. Asset-specific function evidence

Use for direct function comparisons where the reviewed source supports the function:

```text
Binance 2025 EEA stablecoin policy
Kraken EEA delisted stablecoin policy
Bitstamp Europe staged restriction and conversion policy
OKX Europe USDT and USDC buy/sell pages
Coinbase Germany USDT, DAI, and PYUSD tradability pages
```

### B. Current platform-wide service-state evidence

Use to explain current access context, not to fabricate coin-specific rows:

```text
Binance 2026 EU wind-down/service interruption context
Gemini EEA customer-account closure effective 2026-04-06
Uphold Europe temporary service restrictions after the 2026-07-01 transition point, with withdrawal availability stated
```

### C. General service/licensing context

Use only as bounded context:

```text
Crypto.com Europe current general service and legal-entity context
Bybit EU general product/function context
OKX Europe general EEA service context beyond the asset-specific USDT/USDC buy/sell pages
Revolut official CASP legal-entity context
```

## 3. Current-state recheck

The publication review rechecked the principal sources used for current claims on 2026-07-05.

Rechecked first-party or regulator surfaces:

```text
Kraken EEA stablecoin offerings page
Bitstamp EU/EEA MiCA asset transition notice
Binance 2025 EEA non-MiCA stablecoin notice
OKX Europe USDT buy/sell page
OKX Europe USDC buy/sell page
OKX EEA help material
Crypto.com EEA page
Bybit EU starter guide
Gemini UK/EEA/Australia closure notice surface
Uphold Europe transition notice
Coinbase Germany USDT page
Coinbase Germany DAI page
Coinbase Germany PYUSD page
ESMA MiCA register hub
CySEC Revolut CASP register entry
```

Current Binance EU service context is supported by high-quality reporting because a stable first-party public policy page describing the complete July 2026 wind-down state was not available in the reviewed source set. The article must identify this as current service context reported by high-quality reporting and keep it separate from the official 2025 stablecoin-specific policy.

## 4. Revolut decision

A renewed search for a public first-party Revolut page confirming the reported USDT purchase stop, deposit stop, withdrawal deadline, custody deadline, and automatic-conversion treatment did not produce a usable first-party policy source.

The article may still use the Revolut development as the narrative entry point because the governing specification explicitly allows conservative reported treatment when first-party public material remains unavailable.

Required wording boundary:

```text
reported from customer-notice coverage
not presented as a worldwide Revolut policy
not used to populate a complete function table
official CASP legal entity kept separate from reported token-policy details
```

## 5. Final article table design

The guide must not publish one false universal matrix with identical columns for every platform.

Approved publication structure:

```text
Table 1 — what each access function means
Table 2 — reviewed asset-specific function examples
Table 3 — current platform-wide service-state context
Table 4 — asset-level patterns across USDT, DAI, PYUSD, RLUSD, USDC, EURC, and selected regulated distribution paths
```

Table 2 must leave unsupported cells out or mark them explicitly as not confirmed. Table 3 must not masquerade as asset-specific support.

## 6. Source-list review

The final source list should prioritize:

```text
ESMA MiCA register hub and official guidance
platform first-party policy/help/product pages
issuer first-party regulatory/product pages for expansion-path examples
CySEC register for Revolut legal-entity context
Reuters and Financial Times only where first-party public material is incomplete or current service context requires secondary reporting
```

The article must not use social posts, screenshots, forums, or search snippets as final evidence.

## 7. Revision policy

The article must publish with:

```text
publishedAt: 2026-07-05
informationCurrentThrough: 2026-07-05
updatedAt: null
revisions: []
```

Future material market-access changes require reviewed source confirmation, an editorial revision PR, `updatedAt` change, and a revision-history entry. Monitoring output alone never edits the guide.

## 8. Deployment classification

The gate review itself requires no production deployment. The guide implementation follows normal merged guide publication policy through `main`.
