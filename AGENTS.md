# Stable or Gone Agent Instructions

This file is the mandatory entry point for humans, AI agents, and automation working in this repository.

## Current authority

```text
Repository authority: PR #521 active Japan Market Access Pilot 3 JPYSC review
Authority PR: #520
Target: JPYSC on SBI VC Trade / VCTRADE in Japan
Reviewed disposition: eligible_for_later_separate_authority
Canonical JPYSC identity: present since PR #128
buy_sell: account_internal_only
deposit: unavailable
withdrawal: unavailable
external_wallet_transfer: unavailable
Canonical Market Access Records added: 0
Canonical assets added: 0
Canonical Evidence identities added: 0
Public changes: 0
Required exit after PR #521: REVIEW GATE
Current production commit: 196f8e20cd55c9b229c88127afa236dc5060b3fd
Production canonical hash: sha256:57749955faa96d2bd836bac83ef41a0c5dc13f2342763dc4d975c588cd50c650
Convergence attempt: 2
Official public origin: https://www.stableorgone.com
```

Current production counts remain:

```text
Stable assets: 119
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
Archive recorded / not recorded: 462 / 122
Detail routes: 422
Metadata-checked routes: 422
```

PR #521 records a private reviewed result only. It changes no canonical data, public output, route, UI, schema, deployment behavior, or redirect.

## Authority chain

1. PR #128 added canonical `sog_st_jpysc`, issuer relationships, launch Evidence, and a restricted deployment placeholder.
2. PR #493 established `https://www.stableorgone.com` as the official public origin.
3. PR #500 completed the MNEE Evidence and Archive Maintenance checkpoint.
4. PR #514 fixed the 2026-08-03 through 2026-09-13 operating cycle.
5. PR #515 reviewed eight growth proposals. Its deferred JPYSC candidate was a duplicate growth proposal, not proof that the canonical identity was absent.
6. PR #516 authorized complete records only for Bison Bank EUB and USB.
7. PR #517 added EUB, USB, and Bison Bank, S.A.
8. PR #518 added sibling-registry footer links.
9. PR #519 closed that checkpoint and restored REVIEW GATE.
10. PR #520 authorized only PR #521's JPYSC eligibility review.
11. PR #521 confirms the four-function matrix and exits only to REVIEW GATE.

## Mandatory reading order

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. `docs/market-access-record-spec.md`
6. `schemas/market-access-record-v1.schema.json`
7. `config/japan-market-access-pilot-3-review-authority-pr520.json`
8. `config/japan-market-access-pilot-3-jpysc-review-pr521.json`
9. `data/editorial-research/japan-market-access-pilot-3-jpysc-review-pr521.json`
10. `docs/migration/japan-market-access-pilot-3-jpysc-review-pr521-source-coverage.json`
11. `docs/migration/japan-market-access-pilot-3-jpysc-review-pr521-duplicate-report.json`
12. `docs/migration/japan-market-access-pilot-3-jpysc-review-pr521-handoff.json`
13. `docs/quality/japan-market-access-pilot-3-jpysc-review-pr521-spec.md`
14. `data/stablecoins-batch-n.json`
15. `data/evidence-batch-n.json`
16. `data/deployments-batch-n.json`
17. current canonical, review, and statistics checkpoints

Merged repository authority outranks chat memory, handoff prose, issue discussion, and unmerged drafts.

## Reviewed PR #521 result

```text
asset: JPYSC / sog_st_jpysc
jurisdiction: JP / Japan
platform: SBI VC Trade
service: VCTRADE
effective from: 2026-06-24
observed at: 2026-08-05
buy_sell: account_internal_only
deposit: unavailable
withdrawal: unavailable
external_wallet_transfer: unavailable
```

JPYSC is canonical and available for account-internal purchase, sale, and conversion. This does not establish current deposit, withdrawal, external-wallet transfer, or public-chain circulation.

Existing canonical Evidence includes `sog_src_jpysc_launch_sbi_vc_2026` and `sog_src_jpysc_announcement_sbi_2026`. Current SBI VC Trade product and trading pages were reviewed privately; a later authority must decide their canonical Evidence treatment.

A current network label, technical-readiness statement, or future public-chain plan must not be backfilled into current capability. JPYSC lending is outside Market Access Record v1 and cannot be used as transfer evidence.

## Next boundary

PR #521 exits to `REVIEW GATE`. The next recommended authority is a bounded implementation of exactly four provider-scoped JPYSC Market Access records, with a count transition from 8 to 12. PR #521 does not authorize that implementation.

Evidence Archive Payload Verification Batch 2 remains the later planned cycle lane and also requires separate authority.

## Canonical and public boundary

- Unknown values remain unknown unless reviewed evidence supports replacement.
- Private research is not canonical Evidence.
- A provider observation must not be generalized into country-wide availability.
- Future capability is not current capability.
- Automatic promotion, ranking, scoring, recommendation, or implied safety are prohibited.
- Public output remains canonical-only.
- The legacy host redirect is not authorized here.

Issue #479 remains the deployment-history authority. A merge is not production parity until the production workflow records successful convergence.
