# Record Growth Batch 5 Review Gate

Date: 2026-08-03  
Authority PR: #516  
Authorized implementation PR: #517

## Decision

The private eight-candidate audit completed in PR #515 and production converged at `e33bed83dead360570ab81907fbf4f237b63d136` with unchanged canonical output.

The review gate authorizes exactly two sibling candidates for a bounded complete-record implementation:

```text
Bison Bank Electronic Money Token — Euro (EUB)
Bison Bank Electronic Money Token — US Dollar (USB)
```

Both are distinct launched assets under Bison Bank's EMT program. EUB references EUR and USB references USD. PR #517 may add at most two assets and one shared issuer organization.

## Why both are selected

Current first-party product pages, launch material, and MiCA whitepapers support:

- an official 2026-05-06 launch;
- Bison Bank, S.A. as issuer;
- separate EUB and USB identities;
- 1:1 fiat backing and par-redemption claims;
- an institutional mint and redemption workflow;
- approved-wallet or allowlist transfer restrictions;
- Solana Token-2022 as the deployment family;
- sufficient legal and operational material for a complete-record attempt.

The exact Solana mint identities, first on-chain issuance facts, token-specific reserve evidence, current reserve allocation and custodian detail, and current fee and minimum schedule remain implementation-entry checks and may remain explicit known unknowns.

## PR #517 scope

```text
maximum assets: 2
maximum new organizations: 1
replacement candidate: none
Market Access changes: none
new UI or route family: none
legacy redirect changes: none
required exit: REVIEW GATE
```

PR #517 must add every applicable organization, relationship, profile, classification, event, Evidence, Evidence Relation, deployment, reserve, legal, income, and known-unknown record together. A thin asset record is not acceptable.

A candidate that fails fresh identity or complete-record review must be withheld. The other candidate may proceed only on its own evidence. No replacement candidate is allowed. No deferred candidate may be substituted.

## Deferred candidates

The other six PR #515 candidates remain unchanged:

- SoFiUSD / SOFID — exact deployments and current assurance evidence unresolved;
- USA₮ — exact deployments and product-specific holder terms unresolved;
- XREUR — announced circulation date is 2026-09-03;
- JPYSC — account-limited issuance without public-chain identity and complete terms;
- Swiss CHF sandbox — no final asset identity or market-launch decision;
- Hazel Network token design — infrastructure and testing without a final independent production asset.

## Preserved production checkpoint

```text
source commit: e33bed83dead360570ab81907fbf4f237b63d136
origin: https://www.stableorgone.com
canonical hash: sha256:083860b341f6deebc1109b6b5b044dee584ba5e487e2e9b1722213772256b5bb
convergence attempt: 1
stable assets: 117
organizations: 108
relationships: 129
events: 192
Evidence: 579
Evidence Relations: 579
deployments: 184
Market Access records: 8
detail routes: 417
metadata-checked routes: 417
archive recorded / not recorded: 457 / 122
```

PR #516 changes authority and planning only. It changes no canonical or public data.
