# Stable or Gone Roadmap

Updated: 2026-08-01  
Status: post-PR #498 review gate complete; MNEE Evidence and Archive Maintenance — Batch 1 active

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
Current production checkpoint: a0c86896764a43020e2faa7442d8e7303785295e
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
Post-PR #498 review gate: complete
```

PR #498 is the current canonical-data checkpoint. PR #492 remains the Statistics and responsive-layout acceptance point. PR #493 remains the official-domain migration acceptance point.

## Post-PR #498 review decision

The MNEE record is structurally complete and production-verified, but five explicit evidence and archive unknowns remain. The next item prioritizes those gaps over another record-growth batch.

The decision preserves:

```text
new canonical assets: 0
Figure YLDS: deferred
Market Access changes: 0
new public route families: 0
material UI work: 0
```

## Current item

```text
MNEE Evidence and Archive Maintenance — Batch 1
```

Governing files:

```text
docs/roadmap-amendments/2026-08-01-post-pr498-review-gate.md
docs/quality/mnee-evidence-archive-maintenance-spec.md
config/mnee-evidence-archive-maintenance.json
docs/quality/record-growth-batch-4-mnee-pr498-spec.md
data/editorial-research/record-growth-batch-4-mnee-pr498-source-review.json
```

Authorized targets:

```text
latest listed attestation report body and archive
current reserve custodian and allocation
first public Ethereum issuance date
current deployment control configuration
complete direct-access and jurisdiction inventory
```

A target may remain unknown when primary evidence is insufficient. The work must not force a resolution.

Hard limits:

```text
maximum new canonical stable assets: 0
maximum new organizations: 0
maximum new lifecycle events: 0
maximum new Market Access Records: 0
maximum new canonical Evidence records: 8
maximum new reserve reports: 1
maximum new deployments: 0
material UI or CSS changes: prohibited
new public route families: prohibited
Figure YLDS work: prohibited
```

After the maintenance item, stop at REVIEW GATE.

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
