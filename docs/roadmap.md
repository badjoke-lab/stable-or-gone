# Stable or Gone Roadmap

Updated: 2026-08-03  
Status: PR #517 active complete-record implementation; production verification and REVIEW GATE are the only permitted exit

## Active implementation result

```text
Canonical stable assets: 119
Organizations: 109
Relationships: 131
Events: 194
Evidence: 584
Evidence Relations: 584
Reserve reports: 127
Known unknowns: 352
Deployments: 186
Legal profiles: 119
Reserve components: 153
Income profiles: 119
Market Access Records: 8
Archive recorded: 462
Archive not recorded: 122
Detail routes: 422
Metadata-checked detail routes: 422
Official public origin: https://www.stableorgone.com
Pre-PR #517 production authority commit: 9e5d7071cdcd4d398d36e8235aa6b8eae173d019
```

These are the deterministic PR #517 source counts. They become the production checkpoint only after merge and production convergence.

## Six-week operating cycle

The reviewed operating cycle runs from 2026-08-03 through 2026-09-13.

```text
2026-08-03 to 2026-08-09  Record Growth Batch 5 candidate audit and review gate
2026-08-10 to 2026-08-16  canonical implementation, production verification, and closeout
2026-08-17 to 2026-08-23  Japan Market Access Pilot 3
2026-08-24 to 2026-08-30  Evidence Archive Payload Verification Batch 2
2026-08-31 to 2026-09-06  Tier A Dossier Deepening Batch 4
2026-09-07 to 2026-09-13  cycle review and next operating authority
```

Dates are planning windows. Later lanes remain planned but are not implementation-authorized until a new reviewed authority PR merges.

## Completed current-cycle steps

```text
PR #514 six-week cycle and Batch 5 candidate-audit authority: complete
PR #515 eight-candidate private audit: complete and production-verified
PR #516 EUB/USB complete-record authority: complete and production-verified
PR #516 production commit: 9e5d7071cdcd4d398d36e8235aa6b8eae173d019
```

## Active work — PR #517

PR #517 adds exactly:

```text
Bison Bank Electronic Money Token — Euro (EUB)
Bison Bank Electronic Money Token — US Dollar (USB)
Bison Bank, S.A. as one shared legal issuer
```

EUB and USB are separate sibling assets. EUB references EUR and USB references USD. Both are recorded as restricted institutional electronic-money tokens.

### Source-supported facts

- official public launch on 2026-05-06;
- MiCA whitepaper offer start date of 2026-04-10;
- Bison Bank, S.A. as legal issuer;
- 1:1 issuance and redemption claims;
- institutional issuance and redemption workflow;
- approved-wallet and AML/KYC restrictions;
- Solana Token-2022 deployment family;
- no holder interest or yield.

### Preserved unknowns

```text
exact EUB Solana mint
exact USB Solana mint
first on-chain mint and initial circulation
current token supply
current reserve categories, amounts, shares, custodian, and liabilities
token-specific reserve audit or attestation opinion
current issuance and redemption fees and minimums
complete partner, jurisdiction, and approved-wallet inventories
current mint, freeze, permanent-delegate, transfer-hook, allowlist, block, and recall role assignments
```

The official whitepapers do not publish a digital-token identifier, and no address received second authoritative or direct on-chain confirmation. Deployment contract addresses therefore remain null.

Bison Bank's issuer-level statement that it is regularly audited by Deloitte is not recorded as token-specific EUB or USB reserve assurance.

## Count transition

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
Market Access Records: 8 -> 8
Detail routes: 417 -> 422
```

Five new first-party Evidence records are added: one shared launch source and separate EUB/USB product and whitepaper sources.

## Required PR #517 exit

```text
all CI and audit workflows green
Astro check and production build green
public machine-readable counts equal canonical counts
119 stablecoin routes, 109 organization routes, and 194 event routes present
422 detail routes and 422 metadata checks pass
production source commit equals merged PR #517 commit
production canonical hash and counts reported in Issue #479
repository returns to REVIEW GATE through a separate closeout authority PR
```

No later implementation is automatically authorized.

## Deferred Batch 5 candidates

```text
SoFiUSD / SOFID — exact deployments and current assurance evidence unresolved
USA₮ — exact deployments and product-specific holder terms unresolved
XREUR — announced circulation date is 2026-09-03
JPYSC — limited account-only issue without public-chain identity and complete terms
Swiss CHF sandbox — no final asset identity or market-launch decision
Hazel Network token design — infrastructure/testing without a final independent production asset
```

## Explicit current exclusions

```text
replacement candidate
Market Access implementation
Terminal Date Boundary Review Batch 3
GYEN terminal-date review before 2026-11-12
Figure YLDS ordinary-stablecoin promotion
Evidence Archive Batch 2 implementation
Tier A Dossier Batch 4 implementation
new dashboard, ranking, score, or recommendation
large navigation or UI redesign
legacy host redirect work
```

## Deployment boundary

The only official public origin is `https://www.stableorgone.com`.

Main/production equality is established dynamically by `docs/deployment-policy.md`, the production workflow, and Issue #479. The legacy-host redirect remains an external Cloudflare task and is excluded from PR #517.
