# Reserve-report Applicability Review

Updated: 2026-06-20

## Scope

The canonical registry contains reserve-report or reserve-context coverage for 52 of 70 stable assets. This review classifies the remaining 18 records without creating placeholder rows or treating publication-specific reserve coverage as universally required.

Required backing structure remains represented by `reserve_components`, which covers 70 of 70 canonical assets. The reserve-report layer remains informational and may contain issuer reports, attestations, transparency dashboards, protocol collateral disclosures, or relevant historical reserve-intervention records.

## Classification result

```text
report_expected_but_missing: 5
not_applicable_by_design:    10
source_status_unresolved:     3
Total classified:            18
```

The machine-readable source of truth is:

```text
data/quality/reserve-report-applicability.json
```

## Report or disclosure expected but missing

| Asset | Decision basis | Next action |
|---|---|---|
| NUON | Current documentation describes collateral, treasury strategies, and the MaxCap risk layer. | Add a primary protocol collateral or treasury context row. |
| USD0 | Active RWA and government-securities collateral is central to the product design. | Add the existing primary collateral disclosure as canonical context. |
| USR | Active managed collateral pools and separate risk-bearing layers require transparency context. | Add a current primary collateral disclosure, preserving incident context separately. |
| EURS | Active fiat-backed issuer materials explicitly describe reserve verification. | Add a current transparency, attestation, or verification context row. |
| USDm | Mento publishes primary Reserve and reserve-liquidity documentation. | Promote that source into the canonical reserve-context layer. |

These records are not assigned invented report dates, assurance firms, or reserve values. The next PR should add only sources that already exist and can be represented accurately.

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

`not_applicable_by_design` does not mean that backing information is absent. These assets retain canonical reserve components and evidence. It means that a periodic issuer-style reserve report is not an expected publication for the asset design or lifecycle state.

## Source status unresolved

| Asset | Missing boundary | Future review target |
|---|---|---|
| FEI | Final protocol-controlled reserve distribution and present redemption execution are not normalized into one durable source package. | Recover final distribution or execution records without treating governance approval as completed execution. |
| HUSD | Historical fiat reserve or attestation archive has not been recovered beyond archived product claims. | Search issuer archives, assurance reports, and preserved transparency pages. |
| EURT | EURT-specific historical reserve or assurance archive is not normalized after redemption ended in November 2025. | Recover a durable product-specific report archive without copying USDT coverage onto EURT. |

Unresolved records remain explicit research targets. They are not converted to `not_applicable` merely because a source has not yet been recovered.

## Integrity rules

The validator requires all of the following:

- the queue exactly matches the canonical stable-asset set without reserve-report context
- every record references an existing canonical stable asset
- every classification has at least one existing evidence reference
- category counts match the machine-readable records
- expected, not-applicable, and unresolved decisions use fixed next actions
- records already covered by canonical reserve-report context cannot remain in the queue
- no placeholder reserve-report rows are added to improve the numerical coverage ratio

## Deployment classification

No production deployment is required. Cloudflare access is not used.
