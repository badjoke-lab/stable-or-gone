# Batch 12 Candidate Intake

Updated: 2026-06-20

## Scope

This is a candidate-only intake for controlled growth from 70 toward 75 canonical stable assets.

| Candidate | Proposed ID | Research focus |
|---|---|---|
| M | `sog_st_m0m` | M0 base token, collateral, minters, earning balances, extensions |
| Falcon USD | `sog_st_usdf` | collateral, custody, minting, redemption, sUSDf relationship |
| dForce USX | `sog_st_usx` | historical issuance model, current collateral, deployments, sUSX |
| Anzen USDz | `sog_st_usdz` | RWA structure, valuation, redemption, staked representations |
| Avalon USDa | `sog_st_usda` | BTC collateral, CeDeFi boundary, liquidation, redemption, deployments |

## Identity boundaries

- Use `m0-m` for M because the symbol is too broad for an undisambiguated slug.
- Use issuer-qualified slugs for USDf, USX, USDz, and USDa because these symbols may be reused.
- Do not treat sUSDf, sUSX, staked USDz, or other yield representations as aliases of the base assets.
- Do not treat M0 extension tokens as aliases of M without separate lineage review.

## Promotion requirements

Before promotion, each candidate must establish its canonical identity, issuer and operator entities, launch boundary, lifecycle, mint and redemption rules, collateral or reserves, events, primary evidence, deployments, legal profile, reserve components, income mechanics, known unknowns, and wrapper or successor relationships.

## Impact

```text
Canonical assets:      70 unchanged
Candidate controls:    70 -> 75
Promoted candidates:   70 unchanged
Pending candidates:     0 -> 5
```

Promotion occurs in separate reviewed PRs. Reaching 75 canonical assets triggers the production-parity gate. Cloudflare access is not required for this candidate intake.
