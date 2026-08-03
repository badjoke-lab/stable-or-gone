# Record Growth Batch 5 — Bison Bank EUB and USB — PR #517

Status: reviewed complete-record implementation  
Authority PR: #516  
Implementation PR: #517  
Updated: 2026-08-03

## Scope

PR #517 adds exactly two sibling electronic-money tokens and one shared issuer:

```text
sog_st_bison_eub — Bison Bank Electronic Money Token — Euro (EUB)
sog_st_bison_usb — Bison Bank Electronic Money Token — US Dollar (USB)
sog_issuer_bison_bank — Bison Bank, S.A.
```

No replacement candidate is allowed. No other PR #515 candidate is promoted.

## Reviewed identity and launch boundary

Bison Bank's official launch article states that EUB and USB launched on 2026-05-06. The MiCA whitepapers state an offer start date of 2026-04-10. The canonical launch date is 2026-05-06 because it is the explicit public launch statement. The exact first on-chain mint, first holder allocation, and initial circulating supply remain unknown.

EUB and USB are distinct assets. They have separate names, symbols, whitepapers, reference currencies, and holder claims. They share one issuer and program but are not aliases, wrappers, or deployments of one another.

## Deployment boundary

Official product pages and whitepapers establish:

```text
chain: Solana
token standard: Solana Token-2022 Program
access: approved / allowlisted wallets
```

The reviewed official whitepapers do not publish a digital-token identifier in section B.12, and no exact mint address received the required second authoritative or direct on-chain confirmation. Both deployment records therefore use a null contract address and preserve the mint identity as a high-severity known unknown.

## Reserve and assurance boundary

The issuer describes 1:1 issuance and redemption and management of fiat proceeds under a conservative high-quality and liquid investment strategy. The reviewed sources do not establish current token-specific reserve asset categories, amounts, shares, custodian identity, liabilities, excess reserves, or a token-specific audit or attestation opinion.

Bison Bank's issuer-level statement that it is regularly audited by Deloitte is not recorded as an EUB or USB reserve attestation. Each asset receives a whitepaper-framework reserve report only, with explicit limitations.

## Issuance, redemption, and access

Both assets are recorded as restricted, institutional-only products:

- direct issuance and redemption are limited to pre-approved institutional partners;
- fiat funding, AML/KYC checks, a Bison Bank relationship, and an approved Solana-compatible wallet are required;
- reviewed whitepaper terms describe redemption processing within two Lisbon business days after compliance checks and token transfer;
- no public minimum or fee schedule was established;
- no complete partner, jurisdiction, or approved-wallet inventory was established;
- retail direct issuer access is not recorded.

## Holder income

The reviewed whitepapers state that holders receive no interest or other remuneration merely by holding EUB or USB. Reserve income is not a holder income right.

## Complete-record requirement

Each asset must have all applicable record families:

```text
stablecoin identity
classification
reserve and redemption profile
issuer relationship
launch event and event details
Evidence and Evidence Relations
whitepaper-framework reserve report
known unknowns
deployment family
legal profile
reserve component boundary
income profile
candidate and promotion records
canonical and statistics checkpoints
```

Thin records are prohibited.

## Expected count transition

```text
Stable assets: 117 -> 119
Organizations: 108 -> 109
Relationships: 129 -> 131
Events: 192 -> 194
Evidence: 579 -> 584
Evidence Relations: 579 -> 584
Reserve reports: 125 -> 127
Known unknowns: 342 -> 352
Deployments: 184 -> 186
Legal profiles: 117 -> 119
Reserve components: 151 -> 153
Income profiles: 117 -> 119
Market Access records: 8 -> 8
Detail routes: 417 -> 422
```

The archive partition is expected to become 462 recorded and 122 not recorded because all five new Evidence identities receive an archive-discovery URL.

## Prohibited changes

PR #517 must not:

- publish an unconfirmed Solana mint;
- claim token-specific Deloitte assurance;
- infer reserve categories, allocation, custodian, or current supply;
- infer public or retail access;
- add Market Access records;
- add a replacement candidate;
- create a new route family or material UI redesign;
- rank, score, recommend, or imply safety;
- change the legacy redirect;
- authorize work after PR #517.

## Exit

After merge and production verification, repository authority returns to REVIEW GATE. The next six-week-cycle lane requires a separate authority PR.
