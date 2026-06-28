# Reserve-report applicability review

Status: supporting audit  
Date: 2026-06-28  
Roadmap item: PR #222

## Scope

This review covers the twelve stable assets without a canonical reserve-report row. The question is whether an issuer-style periodic reserve report applies to the product design and, where it applies historically, whether a durable product-specific primary report can support a canonical row.

## Result

```text
Reserve applicability total: 12
Not applicable by design: 10
Source status unresolved: 2
Report expected but missing: 0
```

No reserve-report row is added. No placeholder row is created.

## Not applicable by design

The following assets use protocol collateral, algorithmic, debt, basket, tranche, or facilitator mechanics rather than an issuer-style periodic reserve-report cycle:

```text
sog_st_mim
sog_st_usdn
sog_st_rai
sog_st_spot
sog_st_gho
sog_st_bold
sog_st_sai
sog_st_iron
sog_st_musd
sog_st_alusd
```

Their backing and risk should be represented through protocol documentation, collateral components, technical records, and lifecycle evidence. An empty or synthetic reserve-report row would misstate the design.

## HUSD — source status unresolved

Stable Universal and Paxos launch material stated that a top US auditing firm would perform monthly attestations. Historical secondary material also identifies a January 2022 Reserve Accounts Report. The signed report, accountant package, measurement date, HUSD supply comparison, reserve balance, and durable primary archive were not recovered.

Decision:

```text
applicability: source_status_unresolved
reason_code: historical_attestation_confirmed_source_unrecovered
```

The existence of historical attestations is not enough to manufacture a canonical reserve-report row without the report's actual measurement and liability boundaries.

## EURT — source status unresolved

Tether publishes quarterly consolidated reserve and assurance reports. Those reports describe assets and liabilities at an issuer or reporting-group level, but the reviewed material does not provide a product-specific EURT reserve-versus-liability reconciliation, final reserve allocation after redemption ended, or unredeemed EURT liability outcome.

Decision:

```text
applicability: source_status_unresolved
reason_code: consolidated_reporting_found_product_scope_unresolved
```

A general Tether reserve report must not be copied into EURT as though it were a final EURT-specific reserve statement.

## Fixed rules

- Reserve reports are a publication-specific layer, not a universal coverage requirement.
- Protocol collateral disclosure is not relabeled as an issuer reserve report.
- Reserve components remain required where applicable even when periodic reports do not apply.
- Missing primary boundaries remain unresolved rather than becoming placeholder rows.
- Consolidated issuer reporting is not automatically product-specific reporting.
- A secondary description of a lost report does not replace the signed primary report.

## Reopen rule

HUSD or EURT may leave `source_status_unresolved` only when materially better primary evidence recovers the product-specific measurement date, reserve assets, liabilities or supply comparison, issuer boundary, and report provenance.

## Follow-up

The active workstream advances to PR #223, the first evidence-quality review. Reserve applicability remains machine-readable and exact at twelve classified records.

## Deployment classification

```text
No production deployment required
```
