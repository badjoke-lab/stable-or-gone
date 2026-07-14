# Stable or Gone

Stable or Gone (SOG) is a public historical registry for stablecoins and closely related stable-value assets. It records how assets are issued, backed, stabilized, redeemed, governed, migrated, restricted, wound down, or collapsed, together with the organizations, deployments, events, evidence, legal context, access context, and unresolved questions behind each claim.

Public site: https://sog.badjoke-lab.com/

SOG is not a live price dashboard, trading terminal, safety ranking, market-cap ranking, yield leaderboard, or source of investment advice.

## Current registry position

Canonical stable assets: 112

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
PR #357 Tier A Dossier Deepening — Batch 3: complete
PR #358 Record Growth Batch 1: complete
PR #359 Market Access Pilot 2: complete
PR #360 Evidence and Correction Batch: complete
PR #361 Post-PR #360 Review Gate: active
```

Approved bounded sequence:

```text
PR #352  post-351 authority reset and specification/schedule synchronization — complete
PR #353  Record Depth & Coverage Baseline — complete
PR #354  Tier A Dossier Deepening — Batch 1 — complete
PR #355  Tier A Dossier Deepening — Batch 2 — complete
PR #356  Market Access Pilot 1 — complete
PR #357  Tier A Dossier Deepening — Batch 3 — complete
PR #358  Record Growth Batch 1 — complete
PR #359  Market Access Pilot 2 — complete
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
docs/roadmap-amendments/2026-07-13-pr358-record-growth-batch-1-activation.md
docs/quality/record-growth-batch-1-pr358-spec.md
config/record-growth-batch-1-pr358.json
docs/migration/tier-a-batch-3-pr357-reviewed-handoff.json
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

## Completed PR #357 Tier A Dossier Deepening — Batch 3

PR #357 is bounded to five existing assets selected deterministically from the remaining PR #353 queue:

```text
AUDD
FEI
HUSD
MIM
NZDS
```

It may deepen only the authorized events, lifecycle, organization-relationship, redemption, and legal-profile dimensions. It adds no stable asset, changes no Market Access record, and adds no public product surface.

## Completed PR #358 Record Growth Batch 1

PR #358 has promoted complete reviewed records for StraitsX USD (XUSD) and Blast USDB on its branch. The current branch checkpoint contains 112 canonical assets, 557 Evidence records, 174 deployments, full v2/v3 coverage, and four preserved Market Access Records. Merge remains blocked until deterministic statistics history and all release/CI contracts are green.

## Completed PR #359 Market Access Pilot 2

PR #359 promotes exactly four provider-scoped RLUSD Market Access records for Japan / SBI VC Trade / VCTRADE. Existing canonical Evidence identities are reused and expanded; no duplicate Evidence identity or new public product surface is allowed.

## Completed PR #360 Evidence and Correction Batch

PR #360 is a bounded quality-maintenance batch for broken links, archives, source identities, Evidence Relations, wording, dates, organization relationships, and known unknowns. It adds no asset or public product surface.

## Active PR #361 Post-PR #360 Review Gate

PR #361 recomputes the current 112-asset planning state and decides the next bounded sequence without changing canonical data or adding a public product surface.

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

## PR #357 active authority

Current work item:

```text
PR #356 Market Access Pilot 1: complete
PR #357 Tier A Dossier Deepening — Batch 3: complete
PR #358 Record Growth Batch 1: complete
```

Binding references:

```text
docs/roadmap-amendments/2026-07-13-pr357-tier-a-batch-3-activation.md
docs/quality/tier-a-dossier-batch-3-pr357-spec.md
config/tier-a-dossier-batch-3-pr357.json
docs/migration/record-depth-baseline-pr353-summary.json
docs/migration/tier-a-candidate-queue-pr353.json
docs/migration/tier-a-batch-1-pr354-reviewed-handoff.json
docs/migration/tier-a-batch-2-pr355-reviewed-handoff.json
docs/migration/market-access-pilot-1-pr356-reviewed-handoff.json
```

Selected assets:

```text
AUDD
FEI
HUSD
MIM
NZDS
```

This is deterministic queue consumption, not a ranking. PR #357 preserves 110 canonical stable assets, four canonical Market Access Records, canonical-only publication, and the existing public-surface boundary.

## PR #358 active authority

Current work item:

```text
PR #357 Tier A Dossier Deepening — Batch 3: complete
PR #358 Record Growth Batch 1: complete
PR #359 Market Access Pilot 2: complete
```

Binding references:

```text
docs/roadmap-amendments/2026-07-13-pr358-record-growth-batch-1-activation.md
docs/quality/record-growth-batch-1-pr358-spec.md
config/record-growth-batch-1-pr358.json
data/editorial-research/record-growth-batch-1-pr358-candidates.json
docs/migration/tier-a-batch-3-pr357-reviewed-handoff.json
```

Selected context group:

```text
current USD payment stablecoins with distinct stabilization models
```

Selected candidates:

```text
StraitsX USD / XUSD / sog_st_xusd
USDB / USDB / sog_st_usdb
```

Candidate selection is not canonical promotion. PR #358 may add no more than two fully reviewed records, must reject thin records, preserves four canonical Market Access Records, and adds no public product surface.

## PR #359 active authority

Current work item:

```text
PR #358 Record Growth Batch 1: complete
PR #359 Market Access Pilot 2: complete
PR #360 Evidence and Correction Batch: complete
```

Binding references:

```text
docs/roadmap-amendments/2026-07-13-pr359-market-access-pilot-2-activation.md
docs/quality/market-access-pilot-2-pr359-spec.md
config/market-access-pilot-2-pr359.json
docs/market-access-record-spec.md
schemas/market-access-record-v1.schema.json
config/market-access-governance-v1.json
data/editorial-research/japan-stablecoin-market-access-2026.json
docs/migration/record-growth-batch-1-pr358-reviewed-handoff.json
```

Exact bounded scope:

```text
Japan / SBI VC Trade / VCTRADE
RLUSD / sog_st_rlusd
buy_sell, deposit, withdrawal, external_wallet_transfer
effective_from 2026-06-24
observed_at 2026-07-13
maximum four new records
```

PR #359 preserves 112 canonical assets, 557 canonical Evidence identities, and 174 deployments. It expands Market Access from four to eight records by reusing existing canonical source identities. It adds no public product surface, ranking, score, or automatic monitoring promotion.

## PR #360 active authority

Current work item:

```text
PR #359 Market Access Pilot 2: complete
PR #360 Evidence and Correction Batch: complete
PR #361 Post-PR #360 Review Gate: active
```

Binding references:

```text
docs/roadmap-amendments/2026-07-14-pr360-evidence-correction-batch-activation.md
docs/quality/evidence-correction-batch-pr360-spec.md
config/evidence-correction-batch-pr360.json
docs/migration/market-access-pilot-2-pr359-reviewed-handoff.json
docs/migration/evidence-correction-queue-pr360.json
```

Starting boundary:

```text
canonical assets: 112
canonical Evidence: 557
Evidence Relations: 557
archive indexes recorded: 380
archive not recorded: 177
Market Access Records: 8
```

PR #360 may touch at most 10 Evidence records and 5 non-Evidence records. Queue selection is internal and does not authorize automatic canonical correction. No asset, Market Access, ranking, score, or public product surface may be added.

## PR #361 active review-gate authority

Current work item:

```text
PR #360 Evidence and Correction Batch: complete
PR #361 Post-PR #360 Review Gate: active
PR #362 Record Depth and Coverage Baseline Refresh: next
```

Approved bounded sequence after review:

```text
PR #362 Record Depth and Coverage Baseline Refresh
PR #363 Tier A Dossier Deepening Batch 4
PR #364 Evidence and Archive Maintenance Batch 2
review gate
```

Not approved in this sequence:

```text
Market Access Pilot 3
Record Growth Batch 2
new public product surface
asset ranking or composite score
automatic monitoring promotion
```

Binding references:

```text
docs/quality/post-pr360-review-gate-pr361-spec.md
config/post-pr360-review-gate-pr361.json
docs/migration/evidence-correction-batch-pr360-reviewed-handoff.json
docs/migration/post-pr360-review-gate-pr361.json
```

