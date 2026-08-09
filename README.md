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
Evidence: 585
Evidence Relations: 585
Deployments: 186
Market Access Records: 12
Archive recorded: 463
Archive not recorded: 122
Detail routes: 422
Metadata-checked detail routes: 422
```

Production/canonical checkpoint semantics:

```text
review entry production checkpoint: 58cbd7e621794c33fedbc3e263d7f64e9b8a5099
current production commit: dynamic; verify via deploy-production workflow and Issue #479
last canonical-changing implementation commit: 77e80dd3e2a62fea53ea0eabe91ef78a2d8ab1da
canonical hash: sha256:f386c1043ca5e83cafbd88e99746d0609aab0154ed48de1970677758a66ed5fa
canonical file count: 466
official origin: https://www.stableorgone.com
legacy-host 301: complete and strict-gated
```

A fixed work-item commit is an immutable entry checkpoint, not a perpetually current production claim. Current `main` and production equality is verified dynamically by `.github/workflows/deploy-production.yml`, the domain-migration gate, provenance/output-parity checks, relevant production visual review, and Issue #479.

## Current workstream

```text
PR #523: merged and production-verified canonical Market Access implementation
PR #534: merged and production-verified closeout
PR #535: bounded Japan Market Access Expansion Review Batch 1 authority
Japan Market Access Expansion Review Batch 1: complete no-go
Current implementation authority: REVIEW GATE
Current active review authority: none
Later canonical implementation lane authorized: no
```

The completed review inspected three source-led candidate pairs — RLUSD, USDC, and JPYSC on the separate BITPOINT service operated by SBI VC Trade — and found **zero promotable pairs and zero promotable Market Access Records**.

The current 12 canonical Market Access Records remain unchanged. Service-level exclusion, missing product-list entries, and VCTRADE-specific restrictions are not expanded into unsupported BITPOINT function states.

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

The 2026 regulation guide cluster is published and the shared Guide/readability remediation is complete. Guide content is maintenance-only unless a material regulatory change, correction/source update, or justified search/content gap requires new work.

## Official domain and legacy migration

The canonical public origin is:

```text
https://www.stableorgone.com
```

It governs canonical links, hreflang, OGP, JSON-LD, sitemap URLs, robots, machine-readable outputs, production verification, and deployment reporting.

The legacy host `sog.badjoke-lab.com` receives an exact path- and query-preserving HTTP 301 through `public/_worker.js` in Cloudflare Pages Advanced Mode. PR #530 made the migration contract strict in production and scheduled audits.

## Repository authority

Read the merged current versions in this order before non-trivial work:

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/roadmap-amendments/2026-08-09-japan-market-access-expansion-review-b1-result.md
docs/quality/japan-market-access-expansion-review-b1-result-spec.md
data/editorial-research/japan-market-access-expansion-review-b1-2026-08-09.json
docs/market-access-record-spec.md
config/market-access-governance-v1.json
current named source reviews, baselines, queues, audits, and validators
```

Merged repository authority outranks chat memory, handoff prose, issue discussion, stale branch state, generated reports, and unmerged drafts. Historical PR #523/#534/#535 checkpoint artifacts remain historical evidence.

## Completed JPYSC Market Access work

PR #523's bounded transition is complete and production-verified:

```text
Evidence: 584 -> 585
Evidence Relations: 584 -> 585
Market Access Records: 8 -> 12
Archive recorded: 462 -> 463
Detail routes: 422 -> 422
```

The JPYSC records remain provider-scoped to SBI VC Trade / VCTRADE in Japan and are not generalized into country-wide availability or future transfer capability.

## Completed Market Access expansion review

```text
RLUSD × SBI VC Trade / BITPOINT — no-go
USDC × SBI VC Trade / BITPOINT — no-go
JPYSC × SBI VC Trade / BITPOINT — no-go
promotable pairs: 0
promotable Market Access Records: 0
```

Market Access expansion may be reopened only on material new source evidence, such as an FSA provider/handled-instrument register change, a published stablecoin intermediary relationship, BITPOINT-specific function-level evidence, or a material BITPOINT/VCTRADE integration change.

The immediate repository boundary is `REVIEW GATE`. Evidence Archive Payload Verification Batch 2 is the next dated workstream, but only preparation is allowed until a separate authority is merged.

## Core data rules

- Reviewed canonical data only is published as registry truth.
- Unknown values remain explicit until reviewed evidence supports replacement.
- Monitoring, candidate, discovery, editorial-research, and private material is not canonical data.
- Stable assets, organizations, events, evidence, deployments, legal profiles, reserve components, income profiles, known unknowns, and Market Access Records remain distinct record families.
- Rebrands, aliases, wrapped representations, migrations, and deployments do not become separate canonical assets without scope and lineage review.
- Automatic candidate promotion is prohibited.
- Missing product-list entries are not canonical unavailability evidence.
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
