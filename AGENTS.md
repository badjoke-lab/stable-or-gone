# Stable or Gone Agent Instructions

This file is the mandatory entry point for humans, AI agents, and automation working in this repository.

## Current authority

The current reviewed canonical state is:

```text
Canonical stable assets: 117
Organizations: 108
Relationships: 129
Events: 192
Canonical Evidence: 579
Evidence Relations: 579
Archive recorded: 450
Archive not recorded: 129
Deployments: 184
Market Access Records: 8
Detail routes: 417
Metadata-checked detail routes: 417
Official public origin: https://www.stableorgone.com
Official-domain migration checkpoint: bd0e63ac36b1824bf705e8c80d1fb0a1cd79d221
Current production checkpoint: 9136f44bff06d20b8611d66ed28156c9147765a5
Current production canonical hash: sha256:c6fa6b7494fc3e36f599d88edaa3d2af94a0e8c2f0ee6e4c3ee7d8a9121a4372
```

Current authority chain:

1. PR #498 is the reviewed 117-asset canonical-data checkpoint; PR #467 remains the preceding 116-asset checkpoint.
2. PR #487 through PR #492 are the completed public UI, Statistics, responsive, logo, and deployment-chain normalization sequence.
3. PR #493 made `https://www.stableorgone.com` the official origin and was production-verified.
4. PR #495 synchronized post-domain repository authority and completed obsolete issue reconciliation.
5. PR #496 completed the private Record Growth Batch 4 candidate audit.
6. PR #497 authorized exactly one complete-record implementation for MNEE.
7. PR #498 added and production-verified the complete MNEE record.
8. PR #499 closed the post-PR #498 review gate and authorized one bounded MNEE evidence-maintenance item.
9. PR #500 completed and production-verified that maintenance item.
10. PR #502 closes the post-PR #500 review gate and authorizes one bounded launch-date boundary review for six named records.
11. PR #502 itself changes no canonical data; implementation is reserved for PR #503.
12. `docs/ui-v3-remediation-authority.md` remains the regression-protection contract for material public UI work.

## Mandatory reading order

Before changing code, canonical data, workflows, infrastructure, or documentation, read:

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. `docs/roadmap-amendments/2026-08-01-launch-date-boundary-review-batch-1.md`
6. `docs/quality/launch-date-boundary-review-batch-1-spec.md`
7. `config/launch-date-boundary-review-batch-1.json`
8. `docs/roadmap-amendments/2026-08-01-post-pr498-review-gate.md`
9. `docs/post-351-data-growth-operating-spec.md`
10. `docs/quality/mnee-evidence-archive-maintenance-spec.md`
11. `config/mnee-evidence-archive-maintenance.json`
12. `data/editorial-research/mnee-evidence-archive-maintenance-batch-1-source-review.json`
13. `docs/migration/current-canonical-checkpoint.json`
14. `docs/migration/current-review-checkpoint.json`
15. `docs/migration/current-stats-history-checkpoint.json`
16. every named baseline, queue, audit, handoff, source-coverage report, and prior output required by a separately authorized work item

Merged repository authority outranks chat memory, handoff prose, issue discussion, generated reports, and unmerged drafts.

## Current workstream

```text
PR #487 stablecoin logo coverage: complete
PR #488 white background, status badges, and mobile density: complete
PR #489 homepage information architecture: complete
PR #490 broad desktop/mobile remediation: complete
PR #491 Statistics redesign: complete
PR #492 Statistics panel flow and deployment-chain normalization: complete
PR #493 official-domain migration: complete and production-verified
PR #495 post-domain authority synchronization and issue reconciliation: complete
PR #496 Record Growth Batch 4 candidate audit: complete and production-verified
PR #497 Record Growth Batch 4 review gate: complete
PR #498 Record Growth Batch 4 — MNEE: reviewed complete and production-verified
PR #499 post-PR #498 review gate and MNEE maintenance authorization: complete
PR #500 MNEE Evidence and Archive Maintenance — Batch 1: complete and production-verified
Required exit after PR #500 merge and production verification: REVIEW GATE — satisfied
PR #501 post-PR #500 authority synchronization: complete and production-verified
PR #502 Launch Date Boundary Review — Batch 1 authorization: complete
PR #503 Launch Date Boundary Review — Batch 1: implementation under review
Required exit after PR #503 merge and production verification: REVIEW GATE
```

## PR #502 authorized review

The next bounded item reviews exactly six unresolved launch-date records that currently lack both a formal review date and reviewed-source list:

```text
sog_st_msusd
sog_st_stablesusdx
sog_st_susde
sog_st_usd1
sog_st_usdm
sog_st_usdh
```

PR #502 changed authority only. PR #503 reviewed all six named records. No exact day-level primary evidence was found that safely equates announcement, deployment, first mint, testing, terms, rebrand, or later availability with one original public launch day. All six canonical launch dates remain null. The unresolved queue now records a reviewed range, specific reason, review date, and primary-source list for every target. No seventh or replacement target was used.

## PR #500 maintenance result

The bounded maintenance item reviewed all five authorized MNEE unknown areas.

```text
Latest attestation body and archive: index through May 2026 reconfirmed; report body and report-specific archive remain unknown
Current reserve custodian and allocation: reserve categories reconfirmed; custodian identity and category amounts or shares remain unknown
First public Ethereum issuance date: proxy deployment on 2024-03-21 recorded; first public issuance remains unknown
Current deployment controls: upgradeable proxy, 2025-09-15 upgrade, and pause-capable source recorded; current roles/state and 1Sat controls remain unknown
Direct access and jurisdiction inventory: verified-account and compliance-screening boundary recorded; complete current inventory remains unknown
```

No unknown was deleted or forced closed. No new canonical Evidence ID was added. Both MNEE deployments remain `identifier_recorded_unverified`.

Preserved counts:

```text
stable assets: 117
organizations: 108
events: 192
Evidence: 579
reserve reports: 125
known unknowns: 342
deployments: 184
detail routes: 417
metadata-checked detail routes: 417
```

Production verification:

```text
source commit: 9d583845d73e4d758ab245812d165f25dd59ada8
canonical hash: sha256:c6fa6b7494fc3e36f599d88edaa3d2af94a0e8c2f0ee6e4c3ee7d8a9121a4372
convergence attempt: 1
```

No later record-growth batch, YLDS work, Market Access change, public route family, or material UI work is authorized automatically.

## PR #498 reviewed result

PR #498 added exactly one complete canonical record:

```text
MNEE — sog_st_mnee
Issuer: MNEE Limited — sog_issuer_mnee_limited
1Sat Ordinals token ID: ae59f3b898ec61acbdb6cc7a245fabeded0c094bf046f35206a3aec60ef88127_0
Ethereum contract: 0x8ccedbae4916b79da7f3f612efb2eb93a2bfd6cf
```

The official `@mnee/ts-sdk` package version 1.2.0 is the source for the production 1Sat token ID. Identifier recording is not independent runtime or control verification.

Figure YLDS remains deferred. It must not be treated as an ordinary stablecoin without a separate reviewed scope amendment.

## Mandatory UI working rule

Before changing public HTML, components, layouts, CSS, client scripts, UI validators, screenshot workflows, or visual acceptance records, read `docs/ui-v3-remediation-authority.md` and the PR #492 Statistics contract.

Every material UI pull request must:

- identify the governing authority;
- list changed route families and preserved contracts;
- include desktop and mobile screenshots;
- manually inspect generated images rather than relying on CI status alone;
- inspect page top, middle, and bottom, long-page flow, card heights, whitespace, overlaps, duplicates, footer completion, and mobile source order;
- preserve or strengthen exhaustive color, readability, overlap, route-completeness, and responsive checks;
- preserve canonical data, routes, metadata, and machine-readable outputs unless separate authority permits a change.

For `/stats/` specifically:

- no data may be hidden in collapsibles;
- desktop columns must pack independently without shared row heights;
- mobile must preserve source order in one column;
- bare `Arbitrum` is unresolved and must not be mapped to Arbitrum One;
- Arbitrum One and Arbitrum Nova remain distinct;
- canonical chain totals plus unresolved deployments must reconcile to total deployments.

Automated success never overrides a known visual or semantic defect.

## Canonical-data boundary

- Unknown values remain unknown unless reviewed evidence supports replacement.
- Partial dates must not be coerced into day-level dates.
- Monitoring, candidates, discovery leads, editorial research, and private notes are not canonical data.
- Candidate source leads are not canonical Evidence.
- Canonical counts change only through explicit audited data PRs.
- Rebrands, aliases, wrappers, migrations, and deployments do not become separate canonical assets without scope and lineage review.
- Name or symbol similarity never authorizes automatic deduplication.
- USDF Consortium USDF must not be merged with Falcon USDf.
- Open USD must be disambiguated from Origin Dollar before any future record.
- YLDS must not be treated as an ordinary stablecoin without a separate reviewed scope amendment.
- Automatic promotion is prohibited.
- No later canonical asset addition is currently authorized.

## Domain and deployment boundary

The only official origin is:

```text
https://www.stableorgone.com
```

Canonical metadata, hreflang, OGP, JSON-LD, machine-readable files, robots, sitemap, production smoke tests, and deployment reporting must use that origin.

The legacy host `sog.badjoke-lab.com` still resolves to the Pages project. Its 301 redirect is an external Cloudflare configuration task, not permission to reintroduce the old host into repository canonical output.

Issue #479 remains open only for deployment history and the externally blocked redirect.

A merge to `main` is not proof of production parity. Current main/production equality is established dynamically by `docs/deployment-policy.md`, the deployment workflow, and Issue #479.
