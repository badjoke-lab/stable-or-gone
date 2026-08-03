# Stable or Gone Roadmap

Updated: 2026-08-03  
Status: PR #516 active authority review; PR #517 is the only authorized next implementation after merge and production verification

## Current reviewed position

```text
Canonical stable assets: 117
Organizations: 108
Relationships: 129
Events: 192
Evidence: 579
Evidence Relations: 579
Deployments: 184
Market Access Records: 8
Archive recorded: 457
Archive not recorded: 122
Detail routes: 417
Metadata-checked detail routes: 417
Official public origin: https://www.stableorgone.com
Current production checkpoint: e33bed83dead360570ab81907fbf4f237b63d136
Current production canonical hash: sha256:083860b341f6deebc1109b6b5b044dee584ba5e487e2e9b1722213772256b5bb
Production convergence attempt: 1
```

PR #515 and production are equal at the checkpoint above. The private candidate audit changed no canonical or public counts.

## Six-week operating cycle

The reviewed operating cycle runs from 2026-08-03 through 2026-09-13.

```text
2026-08-03 to 2026-08-09  Record Growth Batch 5 candidate audit and review gate
2026-08-10 to 2026-08-16  reviewed canonical growth implementation and closeout
2026-08-17 to 2026-08-23  Japan Market Access Pilot 3
2026-08-24 to 2026-08-30  Evidence Archive Payload Verification Batch 2
2026-08-31 to 2026-09-06  Tier A Dossier Deepening Batch 4
2026-09-07 to 2026-09-13  cycle review and next operating authority
```

Dates are planning windows. Each implementation still requires an explicit merged authority and production checkpoint. Later lanes remain planned but are not yet implementation-authorized.

## Completed current-cycle steps

```text
PR #514 six-week operating cycle and Batch 5 candidate-audit authority: complete
PR #515 eight-candidate private audit: complete and production-verified
PR #515 production commit: e33bed83dead360570ab81907fbf4f237b63d136
PR #515 result: 2 ready, 3 insufficient-current-evidence, 3 prelaunch-or-noncanonical
```

## Active reviewed decision — PR #516

PR #516 authorizes exactly one next implementation:

```text
PR #517 — Record Growth Batch 5: Bison Bank EUB and USB
Maximum new stable assets: 2
Maximum new organizations: 1
Replacement candidate: prohibited
Required exit: REVIEW GATE
```

Selected candidates:

```text
sog_cand_pr515_bison_eub — Bison Bank Electronic Money Token — Euro (EUB)
sog_cand_pr515_bison_usb — Bison Bank Electronic Money Token — US Dollar (USB)
```

The two candidates are separate sibling assets under the same Bison Bank EMT program. EUB references EUR and USB references USD. First-party launch material, product pages, and MiCA whitepapers support an official 2026-05-06 launch, Bison Bank as issuer, 1:1 fiat backing and par redemption claims, institutional mint and redemption, allowlisted-wallet restrictions, and Solana Token-2022 as the deployment family.

## PR #517 entry gate

Before any canonical edit, PR #517 must freshly establish:

- no canonical duplicate or lineage conflict;
- current official launch, product, and whitepaper payloads;
- exact Solana mint identity, or an explicit unresolved identifier;
- second authoritative or direct on-chain confirmation for any exact identifier;
- first public issuance or mint date, or an explicit unresolved date;
- current reserve composition, custodian, and assurance claim scope;
- current issuance and redemption eligibility, fees, and minimums;
- institutional allowlist, KYC, jurisdiction, and transfer restrictions;
- one shared legal issuer organization and correct relationships.

An issuer-level audit claim is not token-specific reserve assurance. Unsupported values remain known unknowns.

PR #517 must create every applicable canonical family together. Thin records and automatic promotion are prohibited. If one candidate fails, it is withheld; the other may proceed only if complete on its own. No replacement candidate is allowed.

## Deferred Batch 5 candidates

```text
SoFiUSD / SOFID — exact deployments and current assurance evidence unresolved
USA₮ — exact deployments and product-specific holder terms unresolved
XREUR — announced circulation date is 2026-09-03
JPYSC — limited account-only issue without public-chain identity and complete terms
Swiss CHF sandbox — no final asset identity or market-launch decision
Hazel Network token design — infrastructure/testing without a final independent production asset
```

No automatic recheck or promotion is authorized.

## Explicit current exclusions

```text
Terminal Date Boundary Review Batch 3
GYEN terminal-date review before 2026-11-12
Figure YLDS ordinary-stablecoin promotion
Japan Market Access implementation before its separate authority
Archive Batch 2 implementation before its separate authority
Tier A Dossier Batch 4 implementation before its separate authority
new dashboard, ranking, score, or recommendation
large navigation or UI redesign
legacy host redirect work
```

## Established historical checkpoints

- PR #467: Record Growth Batch 3, PLNQ and GBPQ.
- PR #487–#492: public UI, responsive, Statistics, logo, and chain-normalization acceptance sequence.
- PR #493: official-domain migration.
- PR #498: MNEE complete canonical record and the current 117-asset addition checkpoint.
- PR #500: MNEE Evidence and archive maintenance.
- PR #503: Launch Date Boundary Review Batch 1.
- PR #506: Evidence Archive Payload Verification Batch 1.
- PR #509: Terminal Date Boundary Review Batch 1.
- PR #512: Terminal Date Boundary Review Batch 2.
- PR #513: post-PR #512 REVIEW GATE checkpoint.

## Deployment boundary

The only official public origin is `https://www.stableorgone.com`.

Main/production equality is established dynamically by `docs/deployment-policy.md`, the production workflow, and Issue #479. The legacy-host redirect remains an external Cloudflare task and is excluded from current repository work.
