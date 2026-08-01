# Stable or Gone Roadmap

Updated: 2026-08-01  
Status: PR #505 Evidence Archive Payload Verification — Batch 1 authorized; PR #506 reserved

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
Current production checkpoint: 4ac32bc2476e04bb28142ef75cf421149c441542
Current production canonical hash: sha256:c6fa6b7494fc3e36f599d88edaa3d2af94a0e8c2f0ee6e4c3ee7d8a9121a4372
```

Current `main` and production equality is established dynamically by the deployment workflow and Issue #479. PR #503 production converged with exact count, route, metadata, provenance, and canonical-hash parity.

## Completed acceptance points

```text
PR #467 Record Growth Batch 3 — PLNQ and GBPQ: reviewed complete
PR #487–#492 public UI, Statistics, responsive, logo, and chain-normalization sequence: complete
PR #493 official-domain migration: complete and production-verified
PR #495 post-domain authority synchronization and obsolete issue reconciliation: complete
PR #496 Record Growth Batch 4 candidate audit: complete and production-verified
PR #497 Record Growth Batch 4 review gate: complete
PR #498 Record Growth Batch 4 — MNEE: reviewed complete and production-verified
PR #499 post-PR #498 review gate and MNEE maintenance authorization: complete
PR #500 MNEE Evidence and Archive Maintenance — Batch 1: complete and production-verified
PR #501 post-PR #500 authority synchronization: complete and production-verified
PR #502 Launch Date Boundary Review — Batch 1 authorization: complete
PR #503 Launch Date Boundary Review — Batch 1: complete and production-verified
PR #504 post-PR #503 authority synchronization: complete and production-verified
PR #505 Evidence Archive Payload Verification — Batch 1 authorization: active
PR #506 Evidence Archive Payload Verification — Batch 1: reserved implementation
```

PR #498 remains the current canonical-asset addition checkpoint. PR #500 is the current canonical maintenance and statistics-history checkpoint. PR #492 remains the Statistics and responsive-layout acceptance point. PR #493 remains the official-domain migration acceptance point.

## PR #500 completed item

```text
MNEE Evidence and Archive Maintenance — Batch 1
```

Governing files:

```text
docs/roadmap-amendments/2026-08-01-post-pr498-review-gate.md
docs/quality/mnee-evidence-archive-maintenance-spec.md
config/mnee-evidence-archive-maintenance.json
data/editorial-research/mnee-evidence-archive-maintenance-batch-1-source-review.json
scripts/validate-mnee-evidence-archive-maintenance-pr500.mjs
docs/migration/current-canonical-checkpoint.json
docs/migration/current-review-checkpoint.json
docs/migration/current-stats-history-checkpoint.json
```

Result by target:

```text
latest attestation body and archive:
  May 2026 index entry reconfirmed
  report body, signed report-specific URL, figures, snapshot dates, and report-specific archive remain unknown

current reserve custodian and allocation:
  U.S. cash at a qualified custodian and U.S. Treasury bills <=90 days reconfirmed
  current custodian identity and latest category amounts or shares remain unknown

first public Ethereum issuance date:
  proxy deployment and initial implementation upgrade on 2024-03-21 recorded
  contract deployment is not treated as proof of first public issuance or availability

current deployment control configuration:
  TransparentUpgradeableProxy, 2025-09-15 implementation upgrade, and active PausableUpgradeable source recorded
  current Ethereum role holders and operational state, post-upgrade permissions, and current 1Sat controls remain unknown

direct access and jurisdiction inventory:
  verified-account, company-document, beneficial-owner, sanctions, PEP, watchlist, prohibited-jurisdiction, and higher-risk screening boundaries recorded
  complete current jurisdiction, customer-type, and country availability inventory remains unknown
```

The implementation added no canonical Evidence ID, deleted no known unknown, and promoted no deployment verification state. Both MNEE deployments remain `identifier_recorded_unverified`.

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

Production result:

```text
source commit: 9d583845d73e4d758ab245812d165f25dd59ada8
canonical hash: sha256:c6fa6b7494fc3e36f599d88edaa3d2af94a0e8c2f0ee6e4c3ee7d8a9121a4372
convergence attempt: 1
```

## PR #503 completed item

```text
Launch Date Boundary Review — Batch 1
Authority PR: #502
Implementation PR: #503
Targets: sog_st_msusd, sog_st_stablesusdx, sog_st_susde, sog_st_usd1, sog_st_usdm, sog_st_usdh
```

PR #503 reviewed all six named targets using primary sources and the prior PR #220 source checkpoint. Result:

```text
exact day resolved: 0
canonical null preserved: 6
queue rows completed with reviewed range, reason, date, and sources: 6
new Evidence identities: 0
new Evidence Relations: 0
```

Announcement, deployment, first mint, testing, terms-effective, rebrand, underlying-asset launch, and later availability boundaries were not coerced into original launch dates. The item added no new asset and authorized no replacement target, YLDS work, Market Access change, route family, ranking, recommendation, or material UI change.

Production result:

```text
source commit: a89832072b6f4fe07cf43b76ae77d2a5a1aac0f0
canonical hash: sha256:c6fa6b7494fc3e36f599d88edaa3d2af94a0e8c2f0ee6e4c3ee7d8a9121a4372
convergence attempt: 2
stable assets: 117
organizations: 108
events: 192
detail routes: 417
metadata-checked detail routes: 417
```

## Authorized current item

```text
Evidence Archive Payload Verification — Batch 1
Authority PR: #505
Implementation PR: #506
Targets: ten PR #405 reviewed-no-safe-change Evidence identities
```

PR #506 must fetch and inspect archived payload bodies. It may add zero to ten exact dated Wayback URLs only when the payload preserves the existing canonical claim scope. CDX metadata alone is insufficient. Source replacement, replacement identities, Evidence identity changes, public output, and non-Evidence canonical changes are prohibited.

## Current boundary

```text
PR #506 implementation, then REVIEW GATE
```

No later archive batch, launch-date batch, dossier batch, record-growth batch, Figure YLDS amendment, Market Access change, public route family, or material public-surface program is authorized automatically.

The PR #496 candidate audit remains the latest complete candidate review. Its non-MNEE candidates were not supported for complete-record promotion at that checkpoint.

## YLDS boundary

Figure YLDS remains deferred. Its issuer describes it as a registered fixed-income security rather than a stablecoin. Its face-amount units, holder yield, issuer-credit exposure, securities eligibility, transfer and redemption restrictions, and chain or wrapper semantics require a separate reviewed scope amendment. No YLDS canonical work is authorized.

## Statistics contract

- no Statistics section hidden in a collapsible disclosure;
- independent desktop column packing without shared row heights;
- single-column mobile source order;
- canonical BNB Chain and Gnosis Chain labels;
- distinct Arbitrum One and Arbitrum Nova values;
- bare `Arbitrum` retained as unresolved;
- total deployments reconciled from canonical-chain and unresolved counts.

## Legacy-host redirect boundary

The old host `sog.badjoke-lab.com` still resolves to the Pages project. A path- and query-preserving 301 to `www.stableorgone.com` remains an external Cloudflare configuration task. The current token has Pages publication access but no visible `badjoke-lab.com` zone, so no Pages Function workaround or unverified zone write is authorized. Issue #479 remains open only for production history and this external dependency.

## Active operating mode

The governing operating specification remains `docs/post-351-data-growth-operating-spec.md`. Allowed default lanes are reviewed data depth, explicitly authorized bounded growth, explicit Market Access review, read-only monitoring review, corrections and Evidence maintenance, monthly maintenance, and small correctness or accessibility fixes.

New public pages, dashboards, rankings, explorer families, or major navigation changes remain frozen unless a separate reviewed roadmap amendment and canonical specification authorize them.

## Production publication boundary

`main` is the repository source of truth. Production publication follows `docs/deployment-policy.md` through `.github/workflows/deploy-production.yml`. Deployment conclusions require exact deployed-commit verification, canonical-data hash and provenance parity, reviewed count parity, route and metadata parity, public-origin consistency, and Issue #479 reporting.
