# Stable or Gone Agent Instructions

This file is the mandatory entry point for humans, AI agents, and automation working in this repository.

## Current authority

```text
Repository authority: PR #521 active Japan Market Access Pilot 3 JPYSC review
Authority PR: #520
Target: JPYSC on SBI VC Trade / VCTRADE in Japan
Reviewed disposition: blocked_canonical_asset_identity_absent
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

Current reviewed production result:

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
Metadata-checked detail routes: 422
```

PR #521 records a private reviewed result only. It changes no canonical data, public output, route, UI, machine-readable schema, deployment behavior, or redirect.

## Current authority chain

1. PR #493 established `https://www.stableorgone.com` as the official public origin.
2. PR #500 completed the bounded MNEE Evidence and Archive Maintenance checkpoint.
3. PR #514 fixed the 2026-08-03 through 2026-09-13 operating cycle.
4. PR #515 reviewed eight private Record Growth Batch 5 candidates and deferred JPYSC.
5. PR #516 authorized complete records only for Bison Bank EUB and USB.
6. PR #517 added EUB, USB, and Bison Bank, S.A. as complete reviewed canonical records.
7. PR #518 added only sibling-registry footer links for HEI, CYA, and BIR.
8. PR #519 closed that checkpoint and restored REVIEW GATE.
9. PR #520 authorized only PR #521's JPYSC eligibility review.
10. PR #520 production converged at `196f8e20cd55c9b229c88127afa236dc5060b3fd`.
11. PR #521 reviews the exact four-function state and exits only to REVIEW GATE.
12. `docs/ui-v3-remediation-authority.md` remains the regression-protection contract for material public UI work.

## Mandatory reading order

Before changing canonical data, code, workflows, infrastructure, or documentation, read:

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. `docs/market-access-record-spec.md`
6. `config/japan-market-access-pilot-3-review-authority-pr520.json`
7. `docs/quality/japan-market-access-pilot-3-review-authority-pr520-spec.md`
8. `config/japan-market-access-pilot-3-jpysc-review-pr521.json`
9. `data/editorial-research/japan-market-access-pilot-3-jpysc-review-pr521.json`
10. `docs/migration/japan-market-access-pilot-3-jpysc-review-pr521-source-coverage.json`
11. `docs/migration/japan-market-access-pilot-3-jpysc-review-pr521-duplicate-report.json`
12. `docs/migration/japan-market-access-pilot-3-jpysc-review-pr521-handoff.json`
13. `docs/quality/japan-market-access-pilot-3-jpysc-review-pr521-spec.md`
14. `data/editorial-research/japan-stablecoin-market-access-2026.json`
15. `data/editorial-research/record-growth-batch-5-candidate-audit-pr515.json`
16. `docs/migration/current-canonical-checkpoint.json`
17. `docs/migration/current-review-checkpoint.json`
18. `docs/migration/current-stats-history-checkpoint.json`
19. every named source, baseline, audit, and prior output required by the active work item

Merged repository authority outranks chat memory, handoff prose, issue discussion, generated reports, and unmerged drafts.

## Reviewed PR #521 result

The exact provider-scoped result as of 2026-08-05 is:

```text
asset: JPYSC / proposed sog_st_jpysc
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

JPYSC is issued and available for account-internal purchase, sale, and conversion. That does not establish current public-chain circulation or external transfer.

A current network label, technical-readiness statement, or future public-chain plan must not be backfilled into current deposit, withdrawal, or external-wallet transfer capability. JPYSC lending is outside Market Access Record v1 and cannot be used as transfer evidence.

## Canonical blocker

Market Access Record v1 requires an existing canonical asset identity. `sog_st_jpysc` is not present in the canonical 119-asset registry.

PR #521 therefore adds zero canonical Market Access records. A later promotion requires a separate complete canonical asset review, an approved canonical identity, sufficient canonical Evidence scope, a fresh current-state review, and a separate Market Access authority PR.

No later JPYSC promotion is authorized by PR #521.

## Next boundary

After PR #521 merges and production verifies, repository authority returns to:

```text
REVIEW GATE
```

Evidence Archive Payload Verification Batch 2 is the next planned lane. It is not implementation-authorized by PR #521.

## Canonical and public boundary

- Unknown values remain unknown unless reviewed evidence supports replacement.
- Monitoring, candidates, discovery leads, editorial research, and private notes are not canonical data.
- Candidate source leads are not canonical Evidence.
- A platform observation must not be generalized into country-wide availability.
- Future capability is not current capability.
- Automatic promotion, ranking, scoring, recommendation, or implied safety are prohibited.
- Public output remains canonical-only.
- The legacy host redirect remains an external Cloudflare task and is not authorized here.

Issue #479 remains the deployment-history authority. A merge is not production parity until the production workflow records successful convergence.
