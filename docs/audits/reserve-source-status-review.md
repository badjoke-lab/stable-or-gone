# Reserve Source-status Review

Updated: 2026-06-25

## Result

The 82-record registry has 70 assets with canonical reserve/report context and 12 classified uncovered assets. HUSD and EURT were rechecked on 2026-06-25 and remain source-status unresolved. Three source-scope evidence records were added without creating reserve-report rows.

```text
FEI resolved into canonical context: 1
Source-status records remaining: 2
HUSD: original signed attestation unrecovered
EURT: product-specific reserve scope unrecovered
```

## FEI — resolved

Tally marks the on-chain TIP-121c proposal as Executed. The proposal states that 51,450,791 DAI was transferred to an immutable zero-fee FEI-to-DAI wrapper and that all DAI from the existing PSM would be transferred to maintain complete 1:1 backing against changing circulating FEI. This is sufficient for a historical reserve/redemption execution context row.

The following remain separate known unknowns and do not block the historical context row:

- the exact execution timestamp rather than the proposal date
- present interface or contract availability
- universal holder completion
- completion dates for every residual PCV distribution

## HUSD — retained unresolved

Monthly attestations and a January 2022 Accountant's Attestation are historically identified. A legal study confirms the report existed and is no longer publicly available, but the original signed report, accountant package, measurement boundary, reserve comparison, and durable primary archive remain unrecovered. The secondary source does not justify a canonical report row.

## EURT — retained unresolved

Official Tether transparency and relevant-information materials confirm quarterly consolidated reserve reporting. They also show that the reporting scope may include assets and liabilities of entities that do not issue or redeem Tether Tokens. The reviewed material does not separately identify EURT reserve assets, EURT liabilities, the EURT issuer boundary, or a final product-specific reconciliation.

## Reopen rule

HUSD or EURT may leave source-status unresolved only when materially better primary evidence recovers the missing product-specific boundary.

## Production status

No Cloudflare action or production deployment is performed.
