# Stable or Gone Roadmap

Updated: 2026-08-01  
Status: PR #500 MNEE Evidence and Archive Maintenance — Batch 1 under review; exit boundary REVIEW GATE

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
Last production-verified canonical-data checkpoint: a0c86896764a43020e2faa7442d8e7303785295e
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
PR #498 Record Growth Batch 4 — MNEE: reviewed complete and production-verified
PR #499 post-PR #498 review gate and MNEE maintenance authorization: complete
```

PR #498 remains the current canonical-asset checkpoint. PR #492 remains the Statistics and responsive-layout acceptance point. PR #493 remains the official-domain migration acceptance point.

## PR #500 current item

```text
MNEE Evidence and Archive Maintenance — Batch 1
```

Governing files:

```text
docs/roadmap-amendments/2026-08-01-post-pr498-review-gate.md
docs/quality/mnee-evidence-archive-maintenance-spec.md
config/mnee-evidence-archive-maintenance.json
data/editorial-research/mnee-evidence-archive-maintenance-batch-1-source-review.json
scripts/validate-mnee-evidence-archive-maintenance.mjs
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

The implementation adds no new canonical Evidence ID and deletes no known unknown. Both MNEE deployment verification states remain `identifier_recorded_unverified`.

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
```

## Next boundary

After PR #500 merge and exact production verification, stop at:

```text
REVIEW GATE
```

No later dossier batch, record-growth batch, Figure YLDS amendment, Market Access change, or material public-surface program is authorized automatically.

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

The old host `sog.badjoke-lab.com` still resolves to the Pages project. A path- and query-preserving 301 to `www.stableorgone.com` remains an external Cloudflare configuration task. The current token has Pages publication access but no visible `badjoke-lab.com` zone, so no Pages Function workaround or unverified zone write is authorized. Issue #479 remains open for production history and this external dependency.

## Active operating mode

The governing operating specification remains `docs/post-351-data-growth-operating-spec.md`. Allowed default lanes are reviewed data depth, explicitly authorized bounded growth, explicit Market Access review, read-only monitoring review, corrections and Evidence maintenance, monthly maintenance, and small correctness or accessibility fixes.

New public pages, dashboards, rankings, explorer families, or major navigation changes remain frozen unless a separate reviewed roadmap amendment and canonical specification authorize them.

## Production publication boundary

`main` is the repository source of truth. Production publication follows `docs/deployment-policy.md` through `.github/workflows/deploy-production.yml`. Deployment conclusions require exact deployed-commit verification, canonical-data hash and provenance parity, reviewed count parity, route and metadata parity, public-origin consistency, and Issue #479 reporting.
