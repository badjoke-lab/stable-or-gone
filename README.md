# Stable or Gone

Stable or Gone (SOG) is a public historical registry for stablecoins and closely related stable-value assets. It records how assets are issued, backed, stabilized, redeemed, governed, migrated, restricted, wound down, or collapsed, together with the organizations, deployments, events, evidence, legal context, access context, and unresolved questions behind each claim.

Public site: https://sog.badjoke-lab.com/

SOG is not a live price dashboard, trading terminal, safety ranking, market-cap ranking, yield leaderboard, or source of investment advice.

## Current registry position

Canonical stable assets: 110

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
PR #352 post-351 authority reset: complete
PR #353 Record Depth & Coverage Baseline: complete
PR #354 Tier A Dossier Deepening — Batch 1: complete
PR #355 Tier A Dossier Deepening — Batch 2: complete
PR #356 Market Access Pilot 1: complete
PR #357 Tier A Dossier Deepening — Batch 3: active
PR #358 Record Growth Batch 1: next
```

Approved bounded sequence:

```text
PR #352  post-351 authority reset and specification/schedule synchronization — complete
PR #353  Record Depth & Coverage Baseline — complete
PR #354  Tier A Dossier Deepening — Batch 1 — complete
PR #355  Tier A Dossier Deepening — Batch 2 — complete
PR #356  Market Access Pilot 1 — complete
PR #357  Tier A Dossier Deepening — Batch 3 — active
PR #358  Record Growth Batch 1 — next
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
docs/roadmap-amendments/2026-07-10-pr353-record-depth-baseline-activation.md
docs/roadmap-amendments/2026-07-10-pr354-tier-a-batch-1-activation.md
docs/roadmap-amendments/2026-07-12-pr355-tier-a-batch-2-activation.md
docs/roadmap-amendments/2026-07-12-pr356-market-access-pilot-1-activation.md
docs/roadmap-amendments/2026-07-13-pr357-tier-a-batch-3-activation.md
docs/quality/tier-a-dossier-batch-3-pr357-spec.md
config/tier-a-dossier-batch-3-pr357.json
docs/migration/market-access-pilot-1-pr356-reviewed-handoff.json
docs/quality/market-access-pilot-1-pr356-spec.md
docs/market-access-record-spec.md
config/market-access-pilot-1-pr356.json
docs/migration/tier-a-batch-2-pr355-reviewed-handoff.json
data/editorial-research/japan-stablecoin-market-access-2026.json
docs/migration/record-depth-baseline-pr353-summary.json
docs/migration/tier-a-candidate-queue-pr353.json
docs/migration/tier-a-batch-1-pr354-reviewed-handoff.json
```

Do not infer the active schedule from old handoffs or superseded PR numbering.

## Completed PR #354 batch

PR #354 deepened:

```text
BUSD   legal_profile, redemption
DAI    legal_profile
RLUSD  legal_profile, redemption
USDC   legal_profile
USDT   legal_profile
```

Reviewed handoff:

```text
docs/migration/tier-a-batch-1-pr354-reviewed-handoff.json
```

PR #354 preserved 110 canonical assets, advanced canonical evidence and evidence relations to 547, added no Market Access Record, introduced no score or ranking, and added no public product surface.

## Completed PR #355 batch

PR #355 deepened FDUSD, FRAX, PYUSD, USDP, and UST for the authorized legal-profile and redemption dimensions.

Reviewed handoff:

```text
docs/migration/tier-a-batch-2-pr355-reviewed-handoff.json
```

PR #355 preserved 110 canonical assets, advanced canonical evidence and evidence relations to 549, added no Market Access Record, introduced no score or ranking, and added no public product surface.

## Completed PR #356 Market Access Pilot 1

PR #356 promoted four provider-scoped USDC Market Access records for Japan / SBI VC Trade and advanced canonical Evidence to 551. Its reviewed handoff is:

```text
docs/migration/market-access-pilot-1-pr356-reviewed-handoff.json
```

## Active PR #357 Tier A Dossier Deepening — Batch 3

PR #357 is bounded to five existing assets selected deterministically from the remaining PR #353 queue:

```text
AUDD
FEI
HUSD
MIM
NZDS
```

It may deepen only the authorized events, lifecycle, organization-relationship, redemption, and legal-profile dimensions. It adds no stable asset, changes no Market Access record, and adds no public product surface.

## Post-351 operating mode

The default operating mode is:

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

The canonical registry may include fiat-backed, crypto-collateralized, algorithmic, partially collateralized, hybrid, synthetic, delta-neutral, RWA-backed, government-security-backed, commodity-referenced, basket/index/CPI/floating-target, yield-bearing, rebasing, historical failed, terminated, migrated, rebranded, and inactive stable-value assets.

Tokenized deposits, fund shares, yield receipts, reserve assets, and adjacent instruments are included only when their relevance to stable-value systems is clear and their legal and economic nature can be classified separately.

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

Record Depth baselines, Tier A queues, dossier handoffs, and dossier-impact reports are internal planning infrastructure and are not public endpoints or manifest surfaces.

## Monitoring boundary

Monitoring is review-only and read-only with respect to canonical data.

It may observe sources, compare accepted baselines, classify changes, identify stale review states, discover bounded leads, and create private review material.

It may not write canonical data automatically, accept its own baseline, edit guides automatically, publish candidates or monitoring rows automatically, create automatic canonical PRs, or deploy.

Monitoring observations and editorial research matrices are not canonical Market Access Records.

## Market Access boundary

Canonical Market Access Records represent bounded reviewed claims:

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

## Record Depth and dossier boundary

PR #353 evaluated all 110 canonical assets across 16 planning dimensions and committed an immutable reviewed summary and 18-asset non-ranking Tier A queue.

PR #354 and PR #355 completed two reviewed five-asset dossier batches. PR #356 uses the merged PR #355 handoff and the reviewed Japan research checkpoint for a bounded Market Access pilot.

The planning baseline is not a risk score, safety score, quality ranking, transparency ranking, asset rank, investment recommendation, or public leaderboard.

A post-change planning state is evidence of repository coverage improvement only. It does not replace canonical facts or imply asset safety.

## Specification and change control

Every post-351 non-trivial PR must cite:

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/post-351-data-growth-operating-spec.md
active roadmap amendments
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
