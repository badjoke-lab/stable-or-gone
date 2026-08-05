# Stable or Gone

Stable or Gone (SOG) is a public historical registry for stablecoins and closely related stable-value assets. It records identity, issuers and organizations, backing and stabilization models, redemption, legal and regulatory context, deployments, launches, incidents, migrations, wind-downs, failures, evidence, and unresolved questions.

Public site: https://www.stableorgone.com/

SOG is not a live price dashboard, trading terminal, safety ranking, market-cap ranking, yield leaderboard, or source of investment advice.

## Current reviewed checkpoint

```text
Canonical stable assets: 119
Organizations: 109
Relationships: 131
Events: 194
Evidence: 584
Evidence Relations: 584
Deployments: 186
Market Access Records: 8
Archive recorded: 462
Archive not recorded: 122
Detail routes: 422
Metadata-checked detail routes: 422
```

Production checkpoint:

```text
source commit: e51f7440c7761d0a70cb36807a8ca452aa2622da
canonical hash: sha256:57749955faa96d2bd836bac83ef41a0c5dc13f2342763dc4d975c588cd50c650
convergence attempt: 1
official origin: https://www.stableorgone.com
```

Current `main` and production equality is verified dynamically by `.github/workflows/deploy-production.yml` and Issue #479. All public counts are derived from canonical repository data and validated projections.

## Current workstream

```text
PR #517 complete — Bison Bank EUB and USB complete records
PR #518 complete — HEI, CYA, and BIR footer links
Current repository authority — REVIEW GATE
```

No later canonical, Market Access, archive-maintenance, dossier, public-surface, or infrastructure work is pre-authorized. The next planned lane is Japan Market Access Pilot 3, subject to a separate reviewed authority PR.

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

## Official domain

The canonical public origin is:

```text
https://www.stableorgone.com
```

It governs canonical links, hreflang, OGP, JSON-LD, sitemap URLs, robots, machine-readable outputs, production verification, and deployment reporting.

The legacy host `sog.badjoke-lab.com` still reaches the same Pages project. A path- and query-preserving 301 redirect remains an external Cloudflare zone task and is not authorized by the current review gate.

## Repository authority

Read in this order before non-trivial work:

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/roadmap-amendments/2026-08-05-post-pr518-production-closeout.md
docs/quality/post-pr518-production-closeout-spec.md
config/post-pr518-production-closeout.json
docs/migration/post-pr518-production-closeout.json
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

## Development and deployment

```bash
npm ci --no-audit --no-fund
npm run validate:active-workstream
npm run validate:data
npm run check
npm run build
```

Normal merged changes publish automatically from `main` through `.github/workflows/deploy-production.yml`. A repository merge is not itself proof of production parity.

## Public machine-readable layer

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
