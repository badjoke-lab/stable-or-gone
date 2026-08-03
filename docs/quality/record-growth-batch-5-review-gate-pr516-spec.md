# Record Growth Batch 5 Review Gate — PR #516

Status: reviewed decision  
Updated: 2026-08-03

## Purpose

Execute the mandatory review gate after PR #515 and authorize a bounded complete-record implementation for the two candidates whose reviewed primary-source coverage is sufficient.

PR #516 changes authority only. It changes no canonical data or public output.

## Authority and production checkpoint

```text
PR #514 six-week operating cycle and Batch 5 audit authority
PR #515 eight-candidate private audit
PR #515 merge commit: e33bed83dead360570ab81907fbf4f237b63d136
Production origin: https://www.stableorgone.com
Production result: success
Canonical hash: sha256:083860b341f6deebc1109b6b5b044dee584ba5e487e2e9b1722213772256b5bb
Convergence attempt: 1
```

Canonical baseline:

```text
Stable assets: 117
Organizations: 108
Relationships: 129
Events: 192
Evidence: 579
Evidence Relations: 579
Deployments: 184
Market Access Records: 8
Archive recorded / not recorded: 457 / 122
Detail routes: 417
Metadata-checked routes: 417
```

## Decision

Authorize exactly:

```text
PR #517 — Record Growth Batch 5: Bison Bank EUB and USB
Selected candidates: sog_cand_pr515_bison_eub, sog_cand_pr515_bison_usb
Maximum new canonical assets: 2
Maximum new organizations: 1
Replacement candidates: prohibited
REVIEW GATE after PR #517
```

The intended result is a paired sibling implementation under the same issuer and program. A candidate may be withheld if its fresh entry gate fails; the other candidate may proceed only if it independently satisfies the complete-record standard. No third candidate may replace a withheld candidate.

## Selection basis

The reviewed primary sources support both candidate identities as distinct assets:

- Bison Bank launched EUB and USB on 2026-05-06;
- EUB references EUR and USB references USD;
- Bison Bank is the legal issuer of both;
- the issuer states 1:1 fiat backing and par redemption;
- mint and redemption are available through the Bison institutional workflow;
- transfers are restricted to approved or allowlisted wallets;
- official product pages and MiCA whitepapers describe Solana Token-2022 as the deployment family;
- the two assets are siblings, not aliases or wrappers of one asset;
- complete records are feasible while unsupported details remain explicit known unknowns.

This evidence authorizes a fresh complete-record attempt. It does not authorize copying candidate research directly into canonical data without re-review.

## PR #517 entry gate

Before any canonical edit, PR #517 must perform:

```text
fresh duplicate and lineage review
fresh manual primary-source review
official EUB and USB whitepaper payload review
exact Solana mint identity search
second authoritative or direct on-chain confirmation for every exact identifier
first public issuance or mint-date review
current reserve composition, custodian, and assurance review
current issuance/redemption fee and minimum review
institutional allowlist and jurisdiction restriction review
organization and relationship review
```

An issuer-level statement that Bison Bank is audited must not be converted into a token-specific reserve attestation unless a report body and claim scope support that conclusion.

PR #517 must create every applicable record family together. Thin records are prohibited. Unsupported mint identities, supply, reserve composition, custodian, audit coverage, fees, minimums, dates, access inventory, and controls must remain explicit known unknowns.

## Deferred candidates

The following remain outside PR #517:

```text
SoFiUSD / SOFID
USA₮
XrymaCoin / XREUR
JPYSC
Swiss joint CHF stablecoin sandbox
Hazel Network unified token design
```

Their PR #515 dispositions and blocking unknowns remain intact. PR #516 authorizes no automatic recheck or canonical promotion for them.

## Prohibited changes

PR #516 must not:

- change canonical records or counts;
- change Evidence or Evidence Relations;
- change public routes, metadata, UI, CSS, guides, sitemap, or machine-readable output;
- authorize a replacement candidate;
- promote EUB or USB automatically;
- create an automatic canonical PR;
- score, rank, recommend, or imply safety;
- authorize Market Access work;
- change the legacy redirect;
- authorize any post-PR #517 implementation without another review gate.

## Validation

PR #516 must prove:

1. PR #515 remains a reviewed eight-candidate audit;
2. PR #515 production is verified at `e33bed83dead360570ab81907fbf4f237b63d136`;
3. the canonical baseline remains 117 assets and 417 detail routes;
4. only EUB and USB are selected;
5. the six deferred candidates remain deferred;
6. PR #517 is the only authorized next canonical-growth PR;
7. the maximum future addition count is two assets and one organization;
8. replacement candidates are prohibited;
9. PR #516 changes no canonical or public data;
10. active-workstream validation is wired to PR #516;
11. ordinary CI, Astro check, build, deployment output, and public layer remain green.

## Exit condition

After PR #516 merges and production verifies unchanged public output, PR #517 may begin with the required fresh entry-gate checks.

PR #517 exits only to another mandatory REVIEW GATE based on its actual merged result.
