# Stable or Gone Roadmap

Updated: 2026-07-31  
Status: Record Growth Batch 4 review gate active; MNEE authorized as the sole next implementation

## Current reviewed position

```text
Canonical stable assets: 116
Organizations: 107
Relationships: 128
Events: 191
Evidence: 571
Evidence Relations: 571
Deployments: 182
Market Access Records: 8
Archive recorded: 442
Archive not recorded: 129
Detail routes: 414
Metadata-checked detail routes: 414
Official public origin: https://www.stableorgone.com
Official-domain migration production checkpoint: bd0e63ac36b1824bf705e8c80d1fb0a1cd79d221
```

Current `main` and production equality is established dynamically by the deployment workflow and Issue #479.

## Completed acceptance points

```text
PR #467 Record Growth Batch 3 — PLNQ and GBPQ: reviewed complete
PR #487 stablecoin logo coverage: complete
PR #488 white background, status badges, and mobile density: complete
PR #489 homepage information architecture: complete
PR #490 broad desktop/mobile remediation: complete
PR #491 Statistics redesign: complete
PR #492 Statistics panel flow and deployment-chain normalization: complete
PR #493 official-domain migration: complete and production-verified
PR #495 post-domain authority synchronization and obsolete issue reconciliation: complete
PR #496 Record Growth Batch 4 candidate audit: complete and production-verified
```

PR #467 remains the 116-asset canonical-data checkpoint. PR #492 remains the Statistics and responsive-layout acceptance point. PR #493 remains the completed official-domain migration. PR #495 remains the post-domain authority checkpoint. PR #496 remains the reviewed private candidate-audit checkpoint.

## Statistics contract

- no Statistics section hidden in a collapsible disclosure;
- independent desktop column packing without shared row heights;
- single-column mobile source order;
- canonical BNB Chain and Gnosis Chain labels;
- distinct Arbitrum One and Arbitrum Nova values;
- bare `Arbitrum` retained as unresolved;
- total deployments reconciled from canonical-chain and unresolved counts.

## Legacy-host redirect boundary

The old host `sog.badjoke-lab.com` still resolves to the Pages project and serves output whose canonical origin is `www.stableorgone.com`.

A path- and query-preserving 301 remains required:

```text
sog.badjoke-lab.com/<path>?<query>
-> www.stableorgone.com/<path>?<query>
```

The current GitHub Cloudflare token returned zero accessible zones. It can publish the Pages project but cannot safely read or edit the `badjoke-lab.com` redirect ruleset.

The redirect is externally blocked. No Pages Function workaround is authorized because it would change the static-serving, request-accounting, and header boundary.

Required future permission and rule:

```text
Zone Read for badjoke-lab.com
Single Redirect / Rulesets Edit for badjoke-lab.com
match hostname: sog.badjoke-lab.com
status: 301
destination: concat("https://www.stableorgone.com", http.request.uri.path)
preserve query string: true
```

Issue #479 remains open for production history and this unresolved external dependency.

## Completed issue reconciliation

After PR #495, issues #66, #450, #451, #475, and #477 were closed with completion or supersession evidence preserved. No open Statistics, mobile, homepage, logo, or duplicate production-log issue remains.

## PR #496 candidate-audit result

```text
Ready for full-record review: MNEE and Figure YLDS
Prelaunch or noncanonical: Open USD, Roughrider Coin, Qivalis euro stablecoin
Insufficient current evidence: FIUSD, ANZ A$DC, USDF Consortium USDF
Exact canonical duplicates: 0
Canonical changes: 0
Public changes: 0
```

USDF Consortium USDF remains distinct from Falcon USDf despite symbol similarity. Open USD requires explicit OUSD issuer and lineage disambiguation from Origin Dollar.

## Active item

```text
PR #497 Record Growth Batch 4 review gate
```

Governing files:

```text
docs/roadmap-amendments/2026-07-31-record-growth-batch-4-review-gate.md
docs/quality/record-growth-batch-4-review-gate-pr497-spec.md
config/record-growth-batch-4-review-gate-pr497.json
docs/migration/record-growth-batch-4-review-gate-pr497.json
```

## Review-gate decision

Authorize MNEE only:

```text
PR #498 — Record Growth Batch 4: MNEE
Maximum new canonical assets: 1
Replacement candidate: prohibited
REVIEW GATE after PR #498
```

MNEE has current primary support for issuer identity, licence context, 1:1 reserve backing, direct verified-customer issuance and redemption, fees and minimums, monthly attestations, and official 1Sat Ordinals and Ethereum operation.

This is authorization for a complete-record attempt, not automatic promotion. PR #498 must withhold MNEE if exact identity or complete-record support fails.

## YLDS boundary

Figure YLDS is deferred.

Its issuer describes it as a registered fixed-income security rather than a stablecoin. Material differences include $0.01 face-amount certificate units, holder interest, issuer-credit and asset-portfolio risk, securities eligibility, transfer and redemption restrictions, and chain/wrapper distinctions.

YLDS requires a separate reviewed scope amendment. No YLDS canonical implementation is authorized.

## PR #498 entry gate

Before canonical edits, PR #498 must perform fresh review of:

```text
canonical duplicate and lineage
current primary sources
exact contract or inscription identities
first public issuance date
reserve composition and custodian
attestation report and archive series
issuance and redemption terms, fees, and minimums
MNEE Limited organization identity and relationships
```

Every applicable canonical record family must be complete. Unsupported values remain explicit known unknowns. No replacement candidate may be substituted.

## Review gate after PR #498

Stop and review the actual merged result:

```text
whether MNEE was added or withheld
canonical count and relationship changes
source and archive completeness
reserve and redemption support
deployment identity support
known-unknown burden
maintenance burden
production parity
```

No work after PR #498 is pre-authorized by this roadmap.

## Active operating mode

The governing operating specification remains `docs/post-351-data-growth-operating-spec.md`.

Allowed default lanes:

```text
reviewed data depth and bounded record growth
canonical Market Access promotion through explicit review
read-only monitoring review
corrections and Evidence maintenance
monthly maintenance
small correctness, accessibility, readability, and broken-link fixes
```

New public pages, dashboards, rankings, explorer families, or major navigation changes remain frozen unless a separate reviewed roadmap amendment and canonical specification authorize them.

## Production publication boundary

`main` is the repository source of truth. Production publication follows `docs/deployment-policy.md` through `.github/workflows/deploy-production.yml`.

A merge is not proof of production parity. Deployment conclusions require exact deployed-commit verification, canonical-data hash and provenance parity, reviewed count parity, route and metadata parity, public-origin consistency, and Issue #479 reporting.

## Mandatory operating rule

Every non-trivial PR must identify:

```text
governing specification
roadmap item
exact bounded scope
explicit non-goals
named inputs and prior outputs
preserved canonical and public boundaries
validation evidence
deployment classification
next review gate
```

Old handoffs, stale PR numbers, historical amendments, and issue discussion must not be treated as current authority when they conflict with this roadmap.
