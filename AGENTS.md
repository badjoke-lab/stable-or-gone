# Stable or Gone Agent Instructions

This file is the mandatory entry point for humans, AI agents, and automation working in this repository.

## Current authority

```text
Repository authority: PR #522 active JPYSC Market Access implementation authority
Authorized implementation: PR #523 only
Asset: JPYSC / sog_st_jpysc
Provider: SBI VC Trade / VCTRADE
Jurisdiction: JP / Japan
buy_sell: account_internal_only
deposit: unavailable
withdrawal: unavailable
external_wallet_transfer: unavailable
Evidence: 584 -> 585
Evidence Relations: 584 -> 585
Market Access Records: 8 -> 12
Archive recorded: 462 -> 463
Detail routes: 422 -> 422
Required exit after PR #523: REVIEW GATE
Current production commit: c29c63de22bda81572d040b972539a7d4c735bd8
Production canonical hash: sha256:57749955faa96d2bd836bac83ef41a0c5dc13f2342763dc4d975c588cd50c650
Convergence attempt: 1
Official public origin: https://www.stableorgone.com
```

Current production counts:

```text
Canonical stable assets: 119
Organizations: 109
Relationships: 131
Events: 194
Canonical Evidence: 584
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
Metadata-checked routes: 422
```

PR #522 changes authority only. PR #523 is the only implementation authorized by this checkpoint.

## Authority chain

1. PR #128 added canonical `sog_st_jpysc`, issuer relationships, launch Evidence, and a restricted deployment placeholder.
2. PR #493 established `https://www.stableorgone.com` as the official public origin.
3. PR #514 fixed the current six-week operating cycle.
4. PR #515 reviewed growth proposals; its JPYSC row was a duplicate proposal, not a missing canonical identity.
5. PRs #516–#519 completed EUB/USB growth, sibling links, and production closeout.
6. PR #520 authorized the JPYSC eligibility review.
7. PR #521 confirmed canonical JPYSC and the four-function state, returned `eligible_for_later_separate_authority`, and production verified commit `c29c63de22bda81572d040b972539a7d4c735bd8`.
8. PR #522 authorizes exactly PR #523's bounded canonical implementation.
9. `docs/ui-v3-remediation-authority.md` remains the regression-protection contract for material public UI work.

## Mandatory reading order

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. `docs/ui-v3-remediation-authority.md`
6. `docs/market-access-record-spec.md`
7. `schemas/market-access-record-v1.schema.json`
8. `config/jpysc-market-access-pilot-3-implementation-authority-pr522.json`
9. `docs/quality/jpysc-market-access-pilot-3-implementation-authority-pr522-spec.md`
10. `docs/migration/jpysc-market-access-pilot-3-implementation-authority-pr522.json`
11. `config/japan-market-access-pilot-3-jpysc-review-pr521.json`
12. `data/editorial-research/japan-market-access-pilot-3-jpysc-review-pr521.json`
13. `data/stablecoins-batch-n.json`
14. `data/evidence-batch-n.json`
15. `data/evidence-pr356-market-access-pilot-1.json`
16. `data/market-access-records-v1.json`
17. current canonical, review, statistics, release-integrity, and provenance checkpoints

Merged repository authority outranks chat memory, issue discussion, and unmerged drafts.

## Exact PR #523 implementation

PR #523 must add only these records:

```text
sog_ma_jpysc_jp_sbivc_vctrade_buy_sell_20260624
  buy_sell / account_internal_only / account_internal_only
sog_ma_jpysc_jp_sbivc_vctrade_deposit_20260624
  deposit / unavailable / not_applicable
sog_ma_jpysc_jp_sbivc_vctrade_withdrawal_20260624
  withdrawal / unavailable / not_applicable
sog_ma_jpysc_jp_sbivc_vctrade_external_wallet_transfer_20260624
  external_wallet_transfer / unavailable / not_applicable
```

All four records use jurisdiction JP, organization `sog_org_sbi_vc_trade`, service VCTRADE, effective date 2026-06-24, and observed date 2026-08-05.

## Evidence boundary

PR #523 may add exactly one Evidence identity:

```text
sog_src_jpysc_sbivc_current_product_pr523
https://www.sbivc.co.jp/jpysc
```

It may reuse existing canonical JPYSC launch and announcement Evidence. It may extend `sog_src_jfsa_electronic_payment_instrument_register_pr356` only to add JPYSC handled-asset scope and `sog_st_jpysc` to its stablecoin ID list.

The JPYSC trading page remains private review support only. Lending, staking, and yield are outside Market Access Record v1.

## Prohibited work

PR #523 may not add assets, organizations, events, deployments, routes, UI, schema, ranking, score, recommendation, replacement assets, redirects, or future capability. A provider observation must not be generalized into Japan-wide availability.

## Exit

PR #523 must update deterministic statistics, immutable history, checkpoints, provenance, release integrity, dedicated validation, and production convergence. It exits only to `REVIEW GATE`.

Issue #479 remains the deployment-history authority.
