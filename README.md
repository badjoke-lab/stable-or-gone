# Stable or Gone

Stable or Gone (SOG) is a public historical registry for stablecoins and closely related stable-value assets. It records identity, issuers and organizations, backing and stabilization models, redemption, legal and regulatory context, deployments, launches, incidents, migrations, wind-downs, failures, evidence, access conditions, and unresolved questions.

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
source commit: 210d68001fbd2560ffadf538fdb7cc9302b400a7
canonical hash: sha256:57749955faa96d2bd836bac83ef41a0c5dc13f2342763dc4d975c588cd50c650
convergence attempt: 1
official origin: https://www.stableorgone.com
legacy-host 301: complete and strict-gated
```

Current `main` and production equality is verified dynamically by `.github/workflows/deploy-production.yml`, the domain-migration gate, production visual review, and Issue #479.

## Current workstream

```text
PRs #524–#531: merged and recognized current-main history
Current documentation task: post-PR #531 authority/specification/schedule reconciliation
Immediate next implementation: Guide & Research Surface Readability Remediation
PR #523: paused; later current-main reconciliation and bounded completion only
Required exit after PR #523: REVIEW GATE
```

Direct production review on 2026-08-08 found a blocking shared Guide-layout/readability defect on both newly published and pre-existing Guide pages. The defect must be repaired at the shared layout/CSS level before PR #523 resumes. Automated screenshot/build success is not visual acceptance when a defect is known.

## Current public surfaces

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

The 2026 regulation guide cluster is published, but the Guide presentation is under a bounded readability remediation. Guide content moves to maintenance-only mode after that repair; there is no automatic recurring article cadence.

## Official domain and legacy migration

The canonical public origin is:

```text
https://www.stableorgone.com
```

It governs canonical links, hreflang, OGP, JSON-LD, sitemap URLs, robots, machine-readable outputs, production verification, and deployment reporting.

The legacy host `sog.badjoke-lab.com` now receives an exact path- and query-preserving HTTP 301 through `public/_worker.js` in Cloudflare Pages Advanced Mode. PR #530 made the migration contract strict in production and scheduled audits.

## Repository authority

Read the merged current versions in this order before non-trivial work:

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/roadmap-amendments/2026-08-08-post-pr531-authority-reconciliation.md
docs/quality/post-pr531-authority-reconciliation-spec.md
current work-item specification
named baselines, queues, audits, validators, handoffs, and prior outputs
```

The immediate work-item specification is:

```text
docs/quality/guide-readability-remediation-2026-08-08-spec.md
```

Merged repository authority outranks chat memory, handoff prose, issue discussion, stale branch state, generated reports, and unmerged drafts. If authority, production checkpoint, counts, schedule, deployment behavior, or a blocking visual conclusion changes, update the governing specifications and roadmap before continuing.

## Current Guide/readability remediation

The shared Guide repair must:

- remove the persistent desktop left-rail TOC;
- restore real primary section-heading hierarchy;
- widen data/table presentation while preserving readable prose measure;
- stop rendering every long-form section as a four-sided audit-sheet panel;
- remove duplicate contextual/footer support presentation;
- keep the contextual support block at the intended article width;
- rebalance the home Research & Guides secondary items;
- preserve mobile table semantics and the UI V3 readability floor.

Minimum direct visual acceptance routes are the home page, the global 2026 regulation guide, and the pre-existing UK stablecoin guide at desktop and mobile widths.

## Later JPYSC Market Access work

After the Guide remediation is merged and production-verified, PR #523 may resume only after incorporating the then-current `main`.

Its original bounded transition remains:

```text
Evidence: 584 -> 585
Evidence Relations: 584 -> 585
Market Access Records: 8 -> 12
Archive recorded: 462 -> 463
Detail routes: 422 -> 422
```

The JPYSC records remain provider-scoped to SBI VC Trade / VCTRADE in Japan and may not be generalized into country-wide availability or future transfer capability.

## Core data rules

- Reviewed canonical data only is published as registry truth.
- Unknown values remain explicit until reviewed evidence supports replacement.
- Monitoring, candidate, discovery, editorial-research, and private material is not canonical data.
- Stable assets, organizations, events, evidence, deployments, legal profiles, reserve components, income profiles, known unknowns, and Market Access Records remain distinct record families.
- Rebrands, aliases, wrapped representations, migrations, and deployments do not become separate canonical assets without scope and lineage review.
- Automatic candidate promotion is prohibited.
- Guide/editorial context is not automatically canonical asset-level availability, approval, legality, or safety evidence.

## Development and deployment

```bash
npm ci --no-audit --no-fund
npm run validate:active-workstream
npm run validate:data
npm run check
npm run build
```

Normal merged changes publish automatically from `main` through `.github/workflows/deploy-production.yml`. Material UI work additionally requires desktop/mobile artifact capture and direct inspection under the active specification. A repository merge is not itself proof of production parity.

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
