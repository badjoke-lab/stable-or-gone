# Batch D review

Status: implementation complete, pending CI and merge

## Assets

- SAI — historical predecessor to current DAI; migrated
- HUSD — discontinued after severe October 2022 depeg and exchange delisting; final issuer and redemption disposition remains uncertain
- IRON — failed after the June 2021 bank run and TITAN collapse
- mUSD — limited legacy basket-backed stablecoin with residual withdrawal and contract-exit paths

## Identity boundaries

- SAI is not an alias of current DAI.
- HUSD issuer, custodian, exchange-distribution, and final-liability roles are not collapsed into one unsupported claim.
- Polygon and BNB Chain IRON representations remain one entity for v0, with deployment identity explicit where verified.
- mUSD is separate from imUSD and later mStable yield products.

## Promotion totals

- stable assets: 36
- organizations: 29
- relationships: 36
- events: 44
- evidence: 169
- known unknowns: 89
- deployments: 56

## Review rules

- archived primary material is preferred for historical product claims
- current redemption is not inferred from historical terms
- secondary market pages do not prove reserve sufficiency
- unresolved lifecycle or liability questions remain known unknowns
