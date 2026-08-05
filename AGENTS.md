# Stable or Gone Agent Instructions

This file is the mandatory entry point for humans, AI agents, and automation working in this repository.

## Current authority

```text
Repository authority: PR #520 active Japan Market Access Pilot 3 review authority
Authorized next review: PR #521 only
Target: JPYSC on SBI VC Trade / VCTRADE in Japan
Review mode: canonical-promotion eligibility review only
Maximum new canonical Market Access Records in PR #520: 0
Maximum new canonical Market Access Records in PR #521: 0
New canonical asset in PR #521: prohibited
New canonical Evidence identity in PR #521: prohibited
Replacement asset: prohibited
Required exit after PR #521: REVIEW GATE
Current production commit: 0648272f4271e68deac0a9603d77392eb7b63a3f
Production canonical hash: sha256:57749955faa96d2bd836bac83ef41a0c5dc13f2342763dc4d975c588cd50c650
Convergence attempt: 1
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

PR #520 changes authority only. PR #521 may update private editorial research and add reviewed decision artifacts, but it may not change canonical or public output.

## Current authority chain

1. PR #493 established `https://www.stableorgone.com` as the official public origin.
2. PR #500 completed the bounded MNEE Evidence and Archive Maintenance checkpoint.
3. PR #514 fixed the 2026-08-03 through 2026-09-13 operating cycle.
4. PR #515 reviewed eight private Record Growth Batch 5 candidates and deferred JPYSC.
5. PR #516 authorized complete records only for Bison Bank EUB and USB.
6. PR #517 added EUB, USB, and Bison Bank, S.A. as complete reviewed canonical records.
7. PR #518 added only sibling-registry footer links for HEI, CYA, and BIR.
8. PR #519 closed the combined checkpoint and production verified commit `0648272f4271e68deac0a9603d77392eb7b63a3f`.
9. PR #520 authorizes only the PR #521 JPYSC eligibility review.
10. `docs/ui-v3-remediation-authority.md` remains the regression-protection contract for material public UI work.

## Mandatory reading order

Before changing canonical data, code, workflows, infrastructure, or documentation, read:

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. `docs/market-access-record-spec.md`
6. `schemas/market-access-record-v1.schema.json`
7. `config/market-access-governance-v1.json`
8. `docs/roadmap-amendments/2026-08-05-japan-market-access-pilot-3-review-authority.md`
9. `docs/quality/japan-market-access-pilot-3-review-authority-pr520-spec.md`
10. `config/japan-market-access-pilot-3-review-authority-pr520.json`
11. `docs/migration/japan-market-access-pilot-3-review-authority-pr520.json`
12. `data/editorial-research/japan-stablecoin-market-access-2026.json`
13. `data/editorial-research/record-growth-batch-5-candidate-audit-pr515.json`
14. `docs/migration/current-canonical-checkpoint.json`
15. `docs/migration/current-review-checkpoint.json`
16. `docs/migration/current-stats-history-checkpoint.json`
17. every named source, baseline, handoff, audit, and prior output required by the active work item

Merged repository authority outranks chat memory, handoff prose, issue discussion, generated reports, and unmerged drafts.

## PR #521 exact review scope

PR #521 reviews only:

```text
research record: jp_access_jpysc_sbivc_2026_06_24
candidate: sog_cand_pr515_jpysc
proposed asset id: sog_st_jpysc
jurisdiction: JP / Japan
platform: SBI VC Trade
service: VCTRADE
effective from: 2026-06-24
review cutoff: 2026-08-05
functions: buy_sell, deposit, withdrawal, external_wallet_transfer
```

Direct issuer mint and redemption are excluded. Lending, staking, and yield are outside Market Access Record v1 and are excluded.

## Known entry blocker

Market Access Record v1 requires an existing canonical asset identity before promotion. `sog_st_jpysc` is not canonical at PR #520 entry.

PR #515 retained JPYSC as `insufficient_current_evidence` because the reviewed product was account-internal and lacked a verified public-chain token identity and complete terms. PR #521 must recheck this boundary but may add zero canonical Market Access records regardless of its review disposition.

A future-capability statement must not be converted into current deposit, withdrawal, or external-wallet transfer availability.

## Allowed PR #521 outputs

PR #521 may:

- update the private editorial research checkpoint;
- add a reviewed eligibility decision, source-coverage report, and duplicate report;
- add dedicated validation;
- update authority and roadmap documentation.

PR #521 may not:

- add or modify canonical stable assets;
- add or modify canonical Market Access Records;
- add canonical Evidence identities or Evidence Relations;
- change public routes, UI, navigation, machine-readable schema, or production behavior;
- rank, score, recommend, or imply safety;
- change the official origin or legacy redirect.

## Remaining cycle lanes

The following remain planning windows, not implementation authority:

```text
Evidence Archive Payload Verification Batch 2
Tier A Dossier Deepening Batch 4
cycle review and next operating authority
```

PR #521 exits only to `REVIEW GATE`. A separate authority PR is required before any later lane or any JPYSC canonical promotion begins.

## Canonical and public boundary

- Unknown values remain unknown unless reviewed evidence supports replacement.
- Monitoring, candidates, discovery leads, editorial research, and private notes are not canonical data.
- Candidate source leads are not canonical Evidence.
- Canonical counts change only through explicit audited data PRs.
- A platform observation must not be generalized into country-wide availability.
- Automatic promotion, ranking, scoring, recommendation, or implied safety are prohibited.
- Public output remains canonical-only.
- The legacy host redirect remains an external Cloudflare task and is not authorized here.

Issue #479 remains the deployment-history authority. A merge is not production parity until the production workflow records successful convergence.
