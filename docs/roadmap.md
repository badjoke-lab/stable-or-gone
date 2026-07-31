# Stable or Gone Roadmap

Updated: 2026-07-31  
Status: PR #498 Record Growth Batch 4 complete; REVIEW GATE active

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
Archive recorded: 450
Archive not recorded: 129
Detail routes: 417
Metadata-checked detail routes: 417
Official public origin: https://www.stableorgone.com
Official-domain migration production checkpoint: bd0e63ac36b1824bf705e8c80d1fb0a1cd79d221
```

Current `main` and production equality is established dynamically by the deployment workflow and Issue #479. A merge is not proof of production parity.

## Completed acceptance points

```text
PR #467 Record Growth Batch 3 — PLNQ and GBPQ: reviewed complete
PR #487–#492 public UI, Statistics, responsive, logo, and chain-normalization sequence: complete
PR #493 official-domain migration: complete and production-verified
PR #495 post-domain authority synchronization and obsolete issue reconciliation: complete
PR #496 Record Growth Batch 4 candidate audit: complete and production-verified
PR #497 Record Growth Batch 4 review gate: complete
PR #498 Record Growth Batch 4 — MNEE: reviewed complete
```

PR #498 is the current canonical-data checkpoint. PR #492 remains the Statistics and responsive-layout acceptance point. PR #493 remains the official-domain migration acceptance point.

## PR #498 result

PR #498 added exactly one complete canonical asset: MNEE.

```text
Stablecoin: sog_st_mnee
Issuer: sog_issuer_mnee_limited
Launch date: 2025-03-03
1Sat Ordinals production token ID: ae59f3b898ec61acbdb6cc7a245fabeded0c094bf046f35206a3aec60ef88127_0
Ethereum contract: 0x8ccedbae4916b79da7f3f612efb2eb93a2bfd6cf
Evidence added: 8
Known unknowns added: 5
Deployment identifiers added: 2
```

The official `@mnee/ts-sdk` package version 1.2.0 supplies the production 1Sat token ID. Both deployment records remain `identifier_recorded_unverified` in the review overlay; current control capabilities and independent runtime verification are not inferred.

The record preserves unknowns for the latest attestation report body and archive, current reserve custodian and allocation, first public Ethereum issuance date, deployment controls, and the complete direct-access and jurisdiction inventory.

## YLDS boundary

Figure YLDS remains deferred. Its issuer describes it as a registered fixed-income security rather than a stablecoin. Its face-amount units, holder yield, issuer-credit exposure, securities eligibility, transfer and redemption restrictions, and chain or wrapper semantics require a separate reviewed scope amendment. No YLDS canonical work is authorized.

## Current item

```text
REVIEW GATE after PR #498
```

Governing files:

```text
docs/roadmap-amendments/2026-07-31-record-growth-batch-4-mnee.md
docs/quality/record-growth-batch-4-mnee-pr498-spec.md
config/record-growth-batch-4-mnee-pr498.json
data/editorial-research/record-growth-batch-4-mnee-pr498-source-review.json
docs/migration/record-growth-batch-4-mnee-pr498-handoff.json
```

Stop and review the actual merged and production-verified result:

```text
canonical record completeness
source and archive completeness
reserve and redemption support
deployment identity and control unknowns
known-unknown and maintenance burden
production commit, count, route, and metadata parity
value of later dossier deepening versus another bounded growth item
```

No later record-growth batch, YLDS scope amendment, Market Access change, new public page, major navigation change, ranking, score, recommendation, or material UI program is pre-authorized.

## Statistics contract

- no Statistics section hidden in a collapsible disclosure;
- independent desktop column packing without shared row heights;
- single-column mobile source order;
- canonical BNB Chain and Gnosis Chain labels;
- distinct Arbitrum One and Arbitrum Nova values;
- bare `Arbitrum` retained as unresolved;
- total deployments reconciled from canonical-chain and unresolved counts.

## Legacy-host redirect boundary

The old host `sog.badjoke-lab.com` still resolves to the Pages project. A path- and query-preserving 301 to `www.stableorgone.com` remains an external Cloudflare configuration task. The current token has Pages publication access but no visible `badjoke-lab.com` zone, so no Pages Function workaround or unverified zone write is authorized. Issue #479 remains open for production history and this external dependency.

## Active operating mode

The governing operating specification remains `docs/post-351-data-growth-operating-spec.md`. Allowed default lanes are reviewed data depth, explicitly authorized bounded growth, explicit Market Access review, read-only monitoring review, corrections and Evidence maintenance, monthly maintenance, and small correctness or accessibility fixes.

New public pages, dashboards, rankings, explorer families, or major navigation changes remain frozen unless a separate reviewed roadmap amendment and canonical specification authorize them.

## Production publication boundary

`main` is the repository source of truth. Production publication follows `docs/deployment-policy.md` through `.github/workflows/deploy-production.yml`. Deployment conclusions require exact deployed-commit verification, canonical-data hash and provenance parity, reviewed count parity, route and metadata parity, public-origin consistency, and Issue #479 reporting.
