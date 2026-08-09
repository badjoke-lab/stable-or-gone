# Japan Market Access Expansion Review Batch 1 — Result

Status: reviewed complete — no-go  
Recorded: 2026-08-09  
Authority: PR #535  
Entry production/repository commit: `58cbd7e621794c33fedbc3e263d7f64e9b8a5099`  
Exit boundary: `REVIEW GATE`

## Result

The bounded Japan Market Access review found no source-supported canonical promotion candidate.

```text
candidate asset x platform/service pairs reviewed: 3
promotable pairs: 0
promotable Market Access Records: 0
Market Access Records: 12 -> 12
Evidence: 585 -> 585
Evidence Relations: 585 -> 585
canonical hash: unchanged
public product changes: 0
```

## Official register boundary

The Financial Services Agency register reviewed on 2026-08-09 is dated 2026-06-24 and lists one registered electronic-payment-instrument service provider, SBI VC Trade Co., Ltd., handling USDC, RLUSD, and JPYSC.

That official register supports no new provider and no fourth handled electronic payment instrument for this bounded batch. The register does not establish function-level availability for each service brand operated by the provider.

The electronic-payment-instrument / crypto-asset service intermediary regime became effective on 2026-06-01. The reviewed official regime page did not expose a separate public intermediary roster, and the bounded source search found no stablecoin-specific intermediary candidate suitable for promotion. This must not be restated as proof that zero intermediaries are registered.

## Three reviewed candidates

### RLUSD × SBI VC Trade / BITPOINT

SBI VC Trade's RLUSD launch explicitly states that BITPOINT service is excluded. This is strong service-level exclusion evidence, but the source does not separately bind `buy_sell`, `deposit`, `withdrawal`, and `external_wallet_transfer` states for BITPOINT.

Disposition: **no-go**. Do not manufacture four `unavailable` rows from one service-level exclusion sentence.

### USDC × SBI VC Trade / BITPOINT

USDC is a registered handled electronic payment instrument and is supported in VCTRADE. The current USDC product page is explicitly a VCTRADE page. The BITPOINT price surface reviewed in this batch did not contain USDC, but absence from a price/product list is not canonical evidence of function-level unavailability.

Disposition: **no-go**. No direct BITPOINT function-level USDC source was found.

### JPYSC × SBI VC Trade / BITPOINT

JPYSC is a registered handled electronic payment instrument and is currently offered account-internally in VCTRADE. The explicit no-deposit/no-withdrawal statements reviewed are VCTRADE product statements and cannot be copied to BITPOINT.

Disposition: **no-go**. No direct BITPOINT function-level JPYSC source was found.

## Evidence identity and duplicate review

No canonical promotion is proposed.

```text
new Evidence identities: 0
new Evidence Relations: 0
new canonical source URLs: 0
```

Existing Evidence supporting current VCTRADE and official-register claims remains valid. It is not reused to infer BITPOINT function states.

## Reopen triggers

This lane may be reopened when at least one of the following occurs:

1. the FSA register adds another electronic-payment-instrument service provider or another handled stablecoin;
2. a registered service intermediary is publicly identified with a stablecoin-specific relationship;
3. SBI VC Trade publishes BITPOINT-specific function-level USDC, RLUSD, or JPYSC support/exclusion;
4. the planned BITPOINT-to-VCTRADE integration materially changes service-scoped access.

## Exit

The review exits to `REVIEW GATE` with no implementation proposal.

No canonical Market Access, Evidence, Evidence Relation, asset, organization, event, deployment, route, machine-readable schema, or material UI change is authorized by this result.
