# Stable or Gone

Stable or Gone (SOG) is a public historical registry for stablecoins and closely related stable-value assets. It records how assets are issued, backed, stabilized, redeemed, governed, migrated, restricted, wound down, or collapsed, together with the organizations, deployments, events, evidence, legal context, access context, and unresolved questions behind each claim.

Public site: https://sog.badjoke-lab.com/

SOG is not a live price dashboard, trading terminal, safety ranking, market-cap ranking, yield leaderboard, or source of investment advice.

## Current registry position

The reviewed canonical registry contains 110 stable assets.

All other public counts derive from repository canonical data groups and generated/validated public projections. They must not be maintained as a second manually edited count authority in this README.

The current public research surfaces include:

```text
Registry records
Stats
Compare
Compare presets
Access & Regulation Explorer
Change Timeline
Update Feed
Maintenance Log
machine-readable projections and manifest discovery
```

## Current workstream

The public-surface expansion sequence through PR #351 is complete.

Current position:

```text
PR #351 Monthly Maintenance Log: complete
PR #352 post-351 authority reset: active
PR #353 Record Depth & Coverage Baseline: next
```

Approved near-term sequence:

```text
PR #352  post-351 authority reset and specification/schedule synchronization
PR #353  Record Depth & Coverage Baseline
PR #354  Tier A Dossier Deepening — Batch 1
PR #355  Tier A Dossier Deepening — Batch 2
PR #356  Market Access Pilot 1
PR #357  Tier A Dossier Deepening — Batch 3
PR #358  Record Growth Batch 1
PR #359  Market Access Pilot 2
PR #360  Evidence and Correction Batch
REVIEW GATE
```

After the review gate, the next bounded sequence is chosen from reviewed evidence rather than pre-authorized indefinitely.

Repository authority:

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-10-post-351-data-growth-activation.md
```

Do not infer the active schedule from old handoffs or superseded PR numbering.

## Post-351 operating mode

The default operating mode is now:

```text
reviewed data depth and record growth
canonical Market Access promotion
monitoring review without automatic promotion
corrections and evidence maintenance
monthly maintenance
```

A new public page, explorer, dashboard, ranking surface, or navigation family requires a separate reviewed roadmap amendment and canonical specification.

Small correctness, accessibility, readability, broken-link, and maintenance fixes remain allowed.

## What the registry tracks

SOG records:

- canonical stable-asset identity, aliases, symbol, reference target, lifecycle, and issuance state;
- asset class, backing model, stabilization mechanism, governance model, and exit or redemption model;
- issuers, protocols, governance bodies, custodians, reserve managers, redemption agents, and other organizations;
- reserve disclosure, reserve-report history, redemption access, eligibility, settlement terms, and restrictions;
- launches, depegs, regulatory actions, reserve changes, redemption changes, migrations, wind-downs, failures, issuer-control actions, and other material events;
- chain deployments, contract identities, control capabilities, and deployment status;
- legal profiles and regulatory notes;
- canonical Market Access Records when reviewed evidence supports bounded asset × jurisdiction × platform/service × function claims;
- source-backed evidence, claim scopes, known unknowns, and unresolved questions.

## Public research workflow

The site now supports a connected research flow:

```text
find a stable asset or organization
-> read the canonical dossier
-> compare selected assets
-> explore legal/regulatory/access records
-> inspect historical subject changes in the Timeline
-> inspect registry publication changes in the Update Feed
-> inspect public-safe operational maintenance checkpoints
```

These surfaces answer different questions and preserve separate semantics.

## Scope

The canonical registry may include:

- fiat-backed stablecoins;
- crypto-collateralized and overcollateralized stablecoins;
- algorithmic, partially collateralized, and hybrid designs;
- synthetic and delta-neutral stable assets;
- RWA- and government-security-backed stablecoins;
- commodity-referenced stable-value assets;
- basket-, index-, CPI-, and floating-target assets;
- independent yield-bearing or rebasing stable assets;
- historical failed, terminated, migrated, rebranded, and inactive assets.

Tokenized deposits, fund shares, yield receipts, reserve assets, and other adjacent instruments are included only when their relevance to stable-value systems is clear and their legal and economic nature can be classified separately.

Simple bridged versions, wrappers, LP tokens, vault shares, and ordinary yield wrappers are not separate canonical assets by default. They are represented through deployment or stable-asset relationship records when appropriate.

See:

```text
docs/stable-asset-scope.md
docs/classification-spec.md
docs/data-model-v3-spec.md
```

## What SOG does not provide

SOG does not provide:

- stablecoin safety scores;
- buy, sell, hold, avoid, or redemption recommendations;
- yield rankings;
- live depeg alerts;
- live price or market-cap rankings;
- universal green/red country availability claims;
- issuer, exchange, wallet, or account support;
- investment, legal, financial, tax, or regulatory advice.

## Data structure

The registry is built from repository-managed JSON data and static Astro pages.

Canonical data families include stable assets, organizations, relationships, classifications, reserve/redemption profiles, events, evidence, evidence relations, reserve reports, known unknowns, regulatory notes, deployments, legal profiles, stable-asset relationships, reserve components, income profiles, and canonical Market Access Records when reviewed records exist.

Public HTML, route generation, `version.json`, `data/manifest.json`, `llms.txt`, `ai.txt`, the sitemap, and public research projections are generated or validated against reviewed repository data and explicit public-safety boundaries.

## Machine-readable entry points

Public machine-readable discovery starts at:

```text
/version.json
/data/manifest.json
/llms.txt
/ai.txt
```

Additional public projections include statistics, comparison, access/regulation, timeline, update-feed, and maintenance-log endpoints discovered through the manifest.

The public machine-readable layer exposes reviewed canonical or explicitly public-safe derived information only.

```text
canonical_only = true
includes_unreviewed_candidates = false
includes_internal_monitoring = false
includes_private_notes = false
```

## Monitoring boundary

Monitoring is review-only and read-only with respect to canonical data.

It may observe sources, compare accepted baselines, classify changes, identify stale review states, discover bounded leads, and create private review material.

It may not:

- write canonical data automatically;
- accept its own baseline;
- edit guides automatically;
- publish candidates or monitoring rows automatically;
- create automatic canonical PRs;
- deploy.

Monitoring observations and editorial research matrices are not canonical Market Access Records.

## Market Access boundary

Canonical Market Access Records represent bounded reviewed claims.

Conceptual identity:

```text
asset
× jurisdiction or region
× platform or service
× function or access route
× state
× effective-date context
× evidence
```

A platform licence is not proof that a specific asset/function combination is available.

Access is not reduced to one universal allowed/banned boolean.

## Specification and change control

Repository specifications are authoritative.

Every post-351 non-trivial PR must cite:

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/post-351-data-growth-operating-spec.md
active roadmap amendment
work-item-specific specification
named baseline/queue/audit/research checkpoint or prior output
```

See `docs/spec-governance.md`.

## Validation and build

```bash
npm ci --no-audit --no-fund
npm run dev
npm run build
```

The validation chain covers canonical data, compatibility, classification, profiles, events, evidence relations, Registry v3 additive data, release integrity, reproducible-build contracts, statistics history, active-workstream authority, public output, route parity, metadata, provenance, and production consistency.

## Development and production deployment

Normal pull requests are validated by GitHub CI and do not wait for Cloudflare Pages.

After merge, `main` publication follows `docs/deployment-policy.md`.

Manual deployment is fallback-only for infrastructure interruption or reserved exceptions such as DNS, secret, Cloudflare account, destructive schema migration, mass deletion, major route removal, and emergency rollback.

## Reporting and corrections

Use the contact page for normal contact, non-public reports, missing records, broken links, and source suggestions:

https://sog.badjoke-lab.com/contact/

Use GitHub Issues only for public, source-backed corrections that can be discussed openly:

https://github.com/badjoke-lab/stable-or-gone/issues/new/choose

Do not submit private keys, seed phrases, passwords, wallet credentials, exchange account details, bank information, identification documents, or sensitive personal information.

## Support

Support helps cover research, source checks, broken-link review, new records, and ongoing site maintenance. It does not affect listings, wording, methodology, corrections, or status labels.

https://sog.badjoke-lab.com/support/

## License

Code is released under the MIT License. See `LICENSE`.

Registry data and written record content are released under Creative Commons Attribution 4.0 International (CC BY 4.0). See `LICENSE-DATA.md`.

## Disclaimer

Stable or Gone is a historical and reference-oriented registry. Information may be incomplete, outdated, disputed, or dependent on source interpretation. Always check current issuer terms, protocol documentation, regulator publications, and market data before making decisions.
