# Reserve-report Applicability Review

Updated: 2026-06-20

## Scope

The canonical registry has reserve-report or reserve-context coverage for 57 of 70 stable assets. This layer remains informational and is not expected for every asset.

Required backing structure remains represented by `reserve_components`, which covers 70 of 70 canonical assets. The reserve-report layer may contain issuer reports, attestations, transparency dashboards, protocol collateral disclosures, or relevant historical reserve-intervention records.

## Current classification

```text
report_expected_but_missing: 0
not_applicable_by_design:    10
source_status_unresolved:     3
Total remaining queue:       13
```

Sources of truth:

```text
data/quality/reserve-report-applicability.json
docs/audits/reserve-source-status-review.md
```

## Added primary context

The following five records were promoted from `report_expected_but_missing` into canonical reserve-context coverage in Phase 4B:

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

Phase 4C completed a targeted source review and froze all three records as reviewed unresolved items.

| Asset | Confirmed in review | Missing boundary |
|---|---|---|
| FEI | Governance design plus an Aave-specific FEI-to-DAI execution path. | Full final-redemption completion, final PCV distribution, universal execution, and present availability are not proven. |
| HUSD | Monthly attestations were announced and a January 2022 accountant report is identified by a legal study. | The original signed report and durable public archive are not recovered. |
| EURT | Tether consolidated reserve reporting and EURT redemption termination are confirmed. | No reviewed report separately proves EURT reserve assets, liabilities, issuer scope, or final reconciliation. |

These records are not unreviewed gaps. They remain explicit research targets that may be reopened only when materially better primary evidence appears.

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

## Phase 4 result

```text
Applicable missing context:        0
Not-applicable decisions:         10 documented
Reviewed unresolved source status: 3 frozen
Reserve-context coverage:         57 / 70 informational
Placeholder reserve rows:          0
```

Phase 4 is complete. The next work item is the final 70-record quality audit and baseline freeze.

## Deployment classification

No production deployment is required. Cloudflare access is not used.
