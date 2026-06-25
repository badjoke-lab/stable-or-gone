# HUSD and EURT Reserve-Source Recheck

Recorded: 2026-06-25

Result: IMPLEMENTED — BOTH RECORDS REMAIN SOURCE-STATUS UNRESOLVED

## Scope

This review rechecks the only two records still classified as `source_status_unresolved` in the reserve-report applicability queue:

```text
HUSD
EURT
```

The question is not whether historical backing claims existed. The question is whether SOG can recover a durable, product-specific primary report with a sufficiently clear measurement date, asset boundary, liability boundary, issuer scope, and reserve comparison to support a canonical reserve-report row.

## HUSD

### Recovered evidence

Stable Universal's launch materials and contemporaneous reporting establish that HUSD was intended to receive monthly attestations. Later reporting also states that Eide Bailly published monthly attestations and that reserves were described as cash held in money-market accounts.

A legal study identifies a January 2022 document titled:

```text
Accountant's Attestation: Reserve Accounts Report
```

The study states that the report is no longer publicly available and describes it as referring to assets administered by Huobi for the benefit of Stable Universal and HUSD holders.

Source:

```text
https://arizonastatelawjournal.org/wp-content/uploads/2023/08/54.4_Bruce_Publication.pdf
```

### Missing boundary

The following were not recovered:

- the original signed attestation
- the accounting firm's complete report package
- the exact measurement date and time
- the HUSD token-supply figure used in the comparison
- the reserve-account balance and account scope
- the custodian or account-holder boundary used by the accountant
- a durable first-party or accountant-hosted archive

### Decision

Keep HUSD as:

```text
applicability: source_status_unresolved
reason_code: historical_attestation_confirmed_source_unrecovered
```

A secondary legal description confirms that the report existed, but it is not a substitute for the missing signed primary report.

## EURT

### Recovered evidence

Tether currently publishes quarterly reserve reports and independent assurance reports. Its transparency material describes total assets and total liabilities for the Tether Issuer identified in each report.

Sources:

```text
https://tether.to/transparency/?tab=reports
https://tether.to/public/Relevant_Information_Document_-_Tether_International%2C_S.A._de_C.V..pdf
```

The current Tether material also states that reported information may include assets and liabilities of entities that do not issue or redeem Tether Tokens. The reporting is therefore an issuer or group-level reserve package rather than an automatically product-specific EURT reconciliation.

### Missing boundary

The reviewed material does not separately establish:

- EURT-specific reserve assets
- EURT-specific liabilities
- the EURT issuer entity included in the report for the relevant period
- the final reserve allocation after EURT redemption ended
- unredeemed EURT liabilities and holder outcomes
- a product-specific EURT reserve-versus-liability comparison

### Decision

Keep EURT as:

```text
applicability: source_status_unresolved
reason_code: consolidated_reporting_found_product_scope_unresolved
```

General Tether reserve reports must not be copied into the EURT record as if they were a final EURT-specific reconciliation.

## Queue result

```text
Reserve applicability total:             12
Not applicable by design:                10
Source status unresolved:                 2
Report expected but missing:              0
```

No reserve-report row is added in this audit.

## Implementation result

The quality implementation:

1. add the HUSD legal-study evidence as secondary source-recovery context
2. add Tether transparency and relevant-information evidence as consolidated-scope context
3. update both queue notes and known unknowns to the 2026-06-25 review date
4. retain both records as `source_status_unresolved`
5. keep reserve-report counts unchanged

## Reopen rule

HUSD or EURT may leave the unresolved category only when materially better primary evidence recovers the missing product-specific reserve and liability boundary.
