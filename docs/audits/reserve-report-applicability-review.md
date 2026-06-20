# Reserve-report Applicability Review

Updated: 2026-06-20

## Scope

The canonical registry now has reserve-report or reserve-context coverage for 57 of 70 stable assets. This layer remains informational and is not expected for every asset.

Required backing structure remains represented by `reserve_components`, which covers 70 of 70 canonical assets. The reserve-report layer may contain issuer reports, attestations, transparency dashboards, protocol collateral disclosures, or relevant historical reserve-intervention records.

## Current classification

```text
report_expected_but_missing: 0
not_applicable_by_design:    10
source_status_unresolved:     3
Total remaining queue:       13
```

The machine-readable source of truth is:

```text
data/quality/reserve-report-applicability.json
```

## Added primary context

The following five records were promoted from `report_expected_but_missing` into canonical reserve-context coverage:

| Asset | Context added | Boundary |
|---|---|---|
| NUON | Protocol treasury and collateral disclosure | Primary protocol disclosure; not an independent assurance report. |
| USD0 | RWA collateral disclosure | Primary protocol disclosure; no invented report date or reserve value. |
| USR | Collateral-pool disclosure | Primary protocol disclosure; incident evidence remains separate. |
| EURS | Issuer reserve-verification context | Primary issuer description; no invented dated attestation or assurance firm. |
| USDm | Mento Reserve disclosure | Primary protocol reserve documentation; not an independent assurance report. |

Canonical reserve-report/context records increased from 72 to 77. Coverage increased from 52/70 to 57/70.

## Not applicable by design

| Asset | Decision basis |
|---|---|
| MIM | On-chain cauldron collateral and protocol mechanics; no issuer-style periodic report cycle. |
| USDN | Algorithmic backing-ratio and recapitalization mechanics rather than a conventional reporting cycle. |
| RAI | On-chain SAFE collateral and redemption-price mechanics. |
| SPOT | AMPL-derived tranche backing and protocol mint/redemption mechanics. |
| GHO | Facilitators, Aave collateral, and stability modules rather than a centralized reserve issuer. |
| BOLD | Direct on-chain overcollateralization and contract-based redemption. |
| SAI | Retired historical single-collateral predecessor migrated to Multi-Collateral DAI. |
| IRON | Collapsed partially collateralized algorithmic protocol; post-mortem context is appropriate. |
| mUSD | Protocol basket asset now handled through legacy withdrawal paths. |
| alUSD | Yield-backed protocol debt and Transmuter settlement mechanics. |

`not_applicable_by_design` does not mean backing information is absent. These assets retain canonical reserve components and evidence. It means a periodic issuer-style reserve report is not an expected publication for the design or lifecycle state.

## Source status unresolved

| Asset | Missing boundary | Future review target |
|---|---|---|
| FEI | Final protocol-controlled reserve distribution and present redemption execution are not normalized into one durable source package. | Recover final distribution or execution records without treating governance approval as completed execution. |
| HUSD | Historical fiat reserve or attestation archive has not been recovered beyond archived product claims. | Search issuer archives, assurance reports, and preserved transparency pages. |
| EURT | EURT-specific historical reserve or assurance archive is not normalized after redemption ended in November 2025. | Recover a durable product-specific archive without copying USDT coverage onto EURT. |

Unresolved records remain explicit research targets. They are not converted to `not_applicable` merely because a source has not yet been recovered.

## Integrity rules

The validator requires all of the following:

- the queue exactly matches the canonical stable-asset set without reserve-report context
- every record references an existing canonical stable asset
- every classification has at least one existing evidence reference
- category counts match the machine-readable records
- expected, not-applicable, and unresolved decisions use fixed next actions
- records already covered by canonical reserve-report context cannot remain in the queue
- canonical additions require reviewed primary context
- no placeholder reserve-report rows are added to improve the numerical coverage ratio

## Deployment classification

No production deployment is required. Cloudflare access is not used.
