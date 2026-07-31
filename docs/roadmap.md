# Stable or Gone Roadmap

Updated: 2026-07-31  
Status: Official-domain migration complete; post-domain authority synchronization active

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

## Completed canonical-data checkpoint

```text
PR #426 Post-UI v3 Data-Growth Reset: complete
PR #427 Record Growth Candidate Audit v2: complete
PR #428 Post-PR #427 Review Gate: complete
PR #429 Record Growth Batch 2 — CHFAU and SEKAU: complete
PR #433 Generated-output repair: complete
PR #466 Post-UI data-growth review gate: complete
PR #467 Record Growth Batch 3 — PLNQ and GBPQ: reviewed complete
```

PR #467 is the current 116-asset canonical-data checkpoint. It remains the active data-preservation baseline until a later reviewed canonical-data PR explicitly advances it.

## Completed public UI sequence

```text
PR #470 Full Public UI Contract: complete and production-verified
PR #487 stablecoin logo coverage: complete
PR #488 white background, status badges, and mobile density: complete
PR #489 homepage information architecture: complete
PR #490 broad desktop/mobile remediation: complete
PR #491 Statistics redesign: complete
PR #492 Statistics panel flow and deployment-chain normalization: complete
```

PR #492 is the current Statistics and responsive-layout acceptance point.

Its binding rules include:

- no Statistics section hidden in a collapsible disclosure;
- independent desktop column packing without shared row heights;
- single-column mobile source order;
- canonical BNB Chain and Gnosis Chain labels;
- distinct Arbitrum One and Arbitrum Nova values;
- bare `Arbitrum` retained as unresolved;
- total deployments reconciled from canonical-chain and unresolved counts.

The UI sequence changed no canonical record counts.

## Completed official-domain migration

```text
PR #493 official-domain migration: complete
Migration merge and deployed checkpoint: bd0e63ac36b1824bf705e8c80d1fb0a1cd79d221
Official origin: https://www.stableorgone.com
Production verification: success
Stablecoins: 116
Organizations: 107
Events: 191
Detail routes: 414
Metadata routes: 414
```

The official origin now governs Astro configuration, canonical and hreflang links, OGP, JSON-LD, robots, sitemap, machine-readable outputs, production checkers, deployment reporting, and repository documentation.

## Legacy-host redirect boundary

The old host `sog.badjoke-lab.com` still resolves to the Pages project and serves output whose canonical origin is `www.stableorgone.com`.

A path- and query-preserving 301 remains required:

```text
sog.badjoke-lab.com/<path>?<query>
-> www.stableorgone.com/<path>?<query>
```

The current GitHub Cloudflare token returned zero accessible zones, both with and without the configured account filter. It can publish the Pages project but cannot safely read or edit the `badjoke-lab.com` redirect ruleset.

The redirect is therefore externally blocked. No Pages Function workaround is authorized because it would place the entire static site behind Workers request accounting and change the current static-serving and header boundary.

The redirect may be completed only after a credential has:

```text
Zone Read for badjoke-lab.com
Single Redirect / Rulesets Edit for badjoke-lab.com
```

Required rule:

```text
match hostname: sog.badjoke-lab.com
status: 301
destination: concat("https://www.stableorgone.com", http.request.uri.path)
preserve query string: true
```

## Active item

```text
PR #495 post-domain authority synchronization
```

PR #495 updates top-level repository authority only. It must:

- align `AGENTS.md`, `README.md`, `docs/spec-governance.md`, `docs/roadmap.md`, and `docs/deployment-policy.md`;
- record PR #492 and PR #493 as completed acceptance points;
- preserve the PR #467 canonical-data checkpoint;
- make `www.stableorgone.com` the only repository official origin;
- record the legacy redirect as externally blocked rather than falsely complete;
- update active-workstream validation;
- change no canonical data, public route, UI output, or machine-readable schema.

## Bounded continuation after PR #495

```text
1. reconcile obsolete production, deployment, and UI issues;
2. leave Issue #479 open while the legacy redirect remains externally blocked;
3. perform a bounded Record Growth Batch 4 candidate audit;
4. stop at a review gate before any canonical promotion.
```

The candidate audit may identify and evaluate candidates but may not promote them.

No candidate, new canonical asset, or later growth batch is pre-authorized by this roadmap.

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

A merge is not proof of production parity. Deployment conclusions require:

- exact deployed-commit verification;
- canonical-data hash and provenance parity;
- reviewed count parity;
- route and metadata parity;
- public-origin consistency;
- Issue #479 deployment reporting.

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
