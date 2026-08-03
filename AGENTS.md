# Stable or Gone Agent Instructions

This file is the mandatory entry point for humans, AI agents, and automation working in this repository.

## Current authority

```text
Repository authority: PR #517 active complete-record implementation
Authority PR: #516
Source candidate audit: PR #515
Authorized assets: Bison Bank EUB and USB only
Authorized shared organization: Bison Bank, S.A. only
Maximum new canonical assets: 2
Maximum new organizations: 1
Replacement candidate: prohibited
Required exit after merge and production verification: REVIEW GATE
```

Expected reviewed result of the active implementation:

```text
Canonical stable assets: 119
Organizations: 109
Relationships: 131
Events: 194
Canonical Evidence: 584
Evidence Relations: 584
Archive recorded: 462
Archive not recorded: 122
Deployments: 186
Market Access Records: 8
Detail routes: 422
Metadata-checked detail routes: 422
Official public origin: https://www.stableorgone.com
Pre-PR #517 production authority commit: 9e5d7071cdcd4d398d36e8235aa6b8eae173d019
```

These counts are implementation expectations until PR #517 merges and production verifies. A merge alone is not production parity.

## Current authority chain

1. PR #498 is the preceding 117-asset canonical growth checkpoint.
2. PR #500 and PR #506 are the preceding Evidence and archive maintenance checkpoints.
3. PR #493 established `https://www.stableorgone.com` as the official public origin.
4. PR #514 fixed the 2026-08-03 through 2026-09-13 operating cycle and authorized Record Growth Batch 5 candidate audit.
5. PR #515 reviewed exactly eight private candidates and retained Bison Bank EUB and USB for full-record review.
6. PR #516 production-verified the unchanged 117-asset state and authorized only PR #517.
7. PR #517 may add complete canonical records for EUB and USB and one shared issuer organization.
8. After PR #517 merges and production verifies, repository authority returns to REVIEW GATE.
9. `docs/ui-v3-remediation-authority.md` remains the regression-protection contract for material public UI work.

## Mandatory reading order

Before changing canonical data, code, workflows, infrastructure, or documentation, read:

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. `docs/quality/record-growth-batch-5-review-gate-pr516-spec.md`
6. `config/record-growth-batch-5-review-gate-pr516.json`
7. `data/editorial-research/record-growth-batch-5-candidate-audit-pr515.json`
8. `docs/quality/record-growth-batch-5-bison-eub-usb-pr517-spec.md`
9. `config/record-growth-batch-5-bison-eub-usb-pr517.json`
10. `data/editorial-research/record-growth-batch-5-bison-eub-usb-pr517-source-review.json`
11. `docs/migration/current-canonical-checkpoint.json`
12. `docs/migration/current-review-checkpoint.json`
13. `docs/migration/current-stats-history-checkpoint.json`
14. every named baseline, source, queue, audit, handoff, or prior output required by the active work item

Merged repository authority outranks chat memory, handoff prose, issue discussion, generated reports, and unmerged drafts.

## PR #517 exact scope

PR #517 may add only:

```text
sog_st_bison_eub — Bison Bank Electronic Money Token — Euro (EUB)
sog_st_bison_usb — Bison Bank Electronic Money Token — US Dollar (USB)
sog_issuer_bison_bank — Bison Bank, S.A.
```

The two assets are sibling electronic-money tokens under one issuer program. They are not aliases, wrappers, or deployments of one another.

## Required record boundary

The reviewed sources support:

```text
public launch date: 2026-05-06
whitepaper offer start date: 2026-04-10
chain family: Solana
token standard: Solana Token-2022
access: pre-approved institutional partners and approved wallets
issuance and redemption: issuer workflow at par, subject to AML/KYC
holder yield: none
```

The canonical launch date is 2026-05-06. The exact first on-chain mint and initial circulation remain unknown.

Exact EUB and USB Solana mint addresses are not authorized because the reviewed official whitepapers do not publish a digital-token identifier and no address received the required second authoritative or direct on-chain confirmation. Deployment records must retain null contract addresses.

Current token-specific reserve composition, amount, share, custodian, liabilities, excess reserves, and assurance opinion are not established. Bison Bank's issuer-level statement that it is regularly audited by Deloitte must not be promoted to an EUB- or USB-specific reserve attestation.

Current fees, minimums, complete partner and jurisdiction inventory, approved-wallet inventory, supply, and control-role assignments remain explicit known unknowns.

## Complete-record requirement

Each selected asset must include every applicable canonical family:

```text
stablecoin identity
organization and issuer relationship
classification
reserve and redemption profile
launch event and event detail
Evidence and Evidence Relations
reserve-framework record
known unknowns
deployment family
legal profile
reserve component boundary
income profile
candidate and promotion records
canonical, review, statistics, parity, and release checkpoints
```

Thin records are prohibited. No deferred candidate may replace EUB or USB.

## Deferred Batch 5 candidates

The following remain outside current authority:

```text
SoFiUSD / SOFID
USA₮
XrymaCoin / XREUR
JPYSC
Swiss joint CHF stablecoin sandbox
Hazel Network unified token design
```

No automatic recheck or promotion is authorized.

## Canonical-data boundary

- Unknown values remain unknown unless reviewed evidence supports replacement.
- Partial dates must not be coerced into day-level dates.
- Monitoring, candidates, discovery leads, editorial research, and private notes are not canonical data.
- Candidate source leads are not canonical Evidence.
- Canonical counts change only through explicit audited data PRs.
- Rebrands, aliases, wrappers, migrations, and deployments do not become separate canonical assets without scope and lineage review.
- Name or symbol similarity never authorizes automatic deduplication.
- Automatic promotion, ranking, scoring, recommendation, or implied safety are prohibited.
- No canonical work beyond PR #517 is currently authorized.

## UI boundary

PR #517 authorizes no material UI redesign, no new route family, no new dashboard, no ranking, and no navigation restructuring. Automatically generated detail routes for canonical records are permitted. Existing responsive, metadata, Statistics, Compare, and machine-readable contracts must remain green.

## Domain and deployment boundary

The only official origin is:

```text
https://www.stableorgone.com
```

Canonical metadata, hreflang, OGP, JSON-LD, machine-readable files, robots, sitemap, production smoke tests, and deployment reporting must use that origin.

The legacy host `sog.badjoke-lab.com` remains an external Cloudflare configuration task. PR #517 must not change the redirect or reintroduce that host into canonical output.

Issue #479 remains the authority for deployment history. Main/production equality is established only by the production workflow and Issue #479.
