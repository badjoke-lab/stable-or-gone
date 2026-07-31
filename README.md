# Stable or Gone

Stable or Gone (SOG) is a public historical registry for stablecoins and closely related stable-value assets. It records identity, issuers and organizations, backing and stabilization models, redemption, legal and regulatory context, deployments, launches, incidents, migrations, wind-downs, failures, evidence, and unresolved questions.

Public site: https://www.stableorgone.com/

SOG is not a live price dashboard, trading terminal, safety ranking, market-cap ranking, yield leaderboard, or source of investment advice.

## Current reviewed checkpoint

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
```

Current main and production commit after the official-domain migration:

```text
bd0e63ac36b1824bf705e8c80d1fb0a1cd79d221
```

All public counts are derived from canonical repository data and generated or validated projections. This README is not an independent count authority.

## Public research surfaces

```text
Registry records
Stats
Compare
Compare presets
Access & Regulation Explorer
Change Timeline
Update Feed
Maintenance Log
Guides
machine-readable projections and manifest discovery
```

## Current workstream

The reviewed UI and domain sequence is complete:

```text
PR #487 stablecoin logo coverage
PR #488 white background, status badges, and mobile density
PR #489 homepage information architecture
PR #490 broad desktop/mobile remediation
PR #491 Statistics redesign
PR #492 Statistics panel flow and deployment-chain normalization
PR #493 official-domain migration to www.stableorgone.com
```

PR #493 was production-verified at the current main commit with 116 stablecoins, 107 organizations, 191 events, 414 detail routes, and 414 metadata-checked routes.

The current bounded continuation is:

```text
PR #495 post-domain authority synchronization
issue and checkpoint reconciliation
Record Growth Batch 4 candidate audit
REVIEW GATE before canonical promotion
```

No candidate and no later growth batch is pre-authorized.

## Official domain

The canonical public origin is:

```text
https://www.stableorgone.com
```

It governs canonical links, hreflang, OGP, JSON-LD, sitemap URLs, robots, machine-readable outputs, production verification, and deployment reporting.

The legacy host `sog.badjoke-lab.com` still reaches the same Pages project. A path- and query-preserving 301 redirect remains an external Cloudflare zone task. The current deployment token can publish Pages but cannot read the `badjoke-lab.com` zone, so no redirect write has been attempted.

## Repository authority

Read in this order before non-trivial work:

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/roadmap-amendments/2026-07-31-post-domain-authority-sync.md
docs/post-351-data-growth-operating-spec.md
work-item-specific specification
named baselines, queues, audits, handoffs, and prior outputs
```

Merged repository authority outranks chat memory, handoff prose, issue discussion, generated reports, and unmerged drafts.

## Core data rules

- Reviewed canonical data only is published as registry truth.
- Unknown values remain explicit until reviewed evidence supports replacement.
- Monitoring, candidate, discovery, editorial-research, and private material is not canonical data.
- Stable assets, organizations, events, evidence, deployments, legal profiles, reserve components, income profiles, known unknowns, and Market Access Records remain distinct record families.
- Rebrands, aliases, wrapped representations, migrations, and deployments do not become separate canonical assets without scope and lineage review.
- Automatic candidate promotion is prohibited.

## Statistics contract

The Statistics page is a visible analytical projection over reviewed canonical records.

- No section is hidden in a collapsible disclosure.
- Desktop panels pack independently rather than sharing row heights.
- Mobile preserves source order in a single column.
- BNB Chain and Gnosis Chain variants normalize to their canonical labels.
- Arbitrum One and Arbitrum Nova remain distinct.
- Bare `Arbitrum` remains unresolved rather than being coerced to Arbitrum One.
- Canonical chain counts plus unresolved deployments reconcile to total deployments.

## Development and deployment

Install and validate with the locked Node and npm dependency set:

```bash
npm ci --no-audit --no-fund
npm run validate:active-workstream
npm run validate:data
npm run check
npm run build
```

Normal merged changes publish automatically from `main` through `.github/workflows/deploy-production.yml`. The workflow builds a preverified `dist`, uploads it to the `stable-or-gone` Cloudflare Pages project, verifies the deployed commit and public output, and reports the result to Issue #479.

A repository merge is not itself proof of production parity.

## Public machine-readable layer

Reviewed canonical information is exposed through:

```text
/version.json
/data/manifest.json
/llms.txt
/ai.txt
/data/stats.json
/data/stats-history.json
/data/comparison.json
/data/access-regulation-index.json
/data/change-timeline.json
/data/update-feed.json
/data/maintenance-log.json
```

The public safety boundary remains:

```text
canonical_only = true
includes_unreviewed_candidates = false
includes_internal_monitoring = false
includes_private_notes = false
```

## Corrections

Use GitHub Issues for public, source-backed corrections that can be discussed openly. Do not submit private personal information, unsupported allegations, investment recommendations, or candidate material as canonical facts.
