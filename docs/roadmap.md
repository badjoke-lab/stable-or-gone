# Stable or Gone Roadmap

Updated: 2026-06-27

## Purpose

This is the canonical execution schedule for SOG. Detailed findings belong in `docs/audits/`; this file records the current position, completed gates, remaining PR order, protected queues, and publication constraints.

Required authority:

```text
AGENTS.md
docs/spec-governance.md
docs/deployment-policy.md
docs/ui-redesign/master-spec.md
docs/ui-redesign/implementation-plan.md
docs/public-taxonomy-spec.md
```

Implementation work must cite these documents and this roadmap before changing public semantics, record counts, routes, information architecture, or deployment behavior.

## Registry checkpoint

```text
Stable assets:                 92
Organizations:                 86
Organization relationships:   101
Events:                       150
Canonical evidence records:   455
Public source identities:      410
Evidence relations:            455
Known unknowns:                253
Deployments:                   130
Reserve components:            125
Reserve reports:               100
Regulatory notes:                9
```

Canonical count source:

```text
docs/migration/registry-v3-baseline.json
```

## Current position

```text
Repository: badjoke-lab/stable-or-gone
Public site: https://sog.badjoke-lab.com/
Completed phase after PR #184 merges: Phase 2 / Gate C
Current phase: Phase 3 — information architecture, responsive specification, and mocks
Latest completed work after PR #184 merges: PR 16
Next approved work: PR 17 — finalize site architecture and route roles
Routine record growth: paused at 92 assets
Production publication: paused except verified emergency repair
Batch 18 selection: prohibited during repair
```

## Completed gates and PRs

### Gate A — documentation reset

Status: **PASS**

```text
PR #167  documentation reset
```

### Gate B — production-integrity repair

Status: **PASS**

```text
PR #168  repair baseline and defect inventory
PR #169  generated build provenance
PR #170  route, sitemap, canonical, JSON-LD, and output parity
PR #171  mobile information preservation
```

Gate B guarantees one source commit and canonical data hash per generated site, route and sitemap parity, stale-output rejection, and preservation of material mobile information.

### Gate C — taxonomy and data semantics

Status after PR #184 merges: **PASS**

```text
PR #172  PR 5  public-value registry
PR #173  PR 6  lifecycle and issuance normalization
PR #174  PR 7  reference-target and peg normalization
PR #175  PR 8  backing and stabilization normalization
PR #176  PR 9  event category and subtype normalization
PR #177  PR 10 organization classification normalization
PR #178  PR 11 evidence reliability, provenance, and type separation
PR #179  PR 12 deployment status and verification-state separation
PR #180  PR 13 value-state semantics
PR #181  PR 14 explicit primary display relationships
PR #182  PR 15 evidence-source deduplication with claim preservation
PR #184  PR 16 record-specific public-copy migration and complete 92-record audit
```

Gate C guarantees:

- public taxonomy axes are separated and validated;
- reviewed unknowns are distinct from missing, non-applicable, undisclosed, disputed, approximate, and unverified values;
- relationship-array order cannot select the public organization;
- canonical evidence history, public source identity, and evidence relations remain distinct;
- named-asset summary maps do not live in rendering components;
- all 92 current assets pass the complete migration audit;
- canonical record counts remain unchanged.

## Gate C authoritative audits

```text
docs/audits/organization-taxonomy-normalization-2026-06-26.md
docs/audits/evidence-taxonomy-normalization-2026-06-26.md
docs/audits/deployment-taxonomy-normalization-2026-06-26.md
docs/audits/value-state-normalization-2026-06-27.md
docs/audits/primary-display-relationships-2026-06-27.md
docs/audits/evidence-source-deduplication-2026-06-27.md
docs/audits/record-copy-migration-2026-06-27.md
```

## PR 10 organization baseline

```text
Organizations:                       86
Relationships:                      101
Canonical organization types:       39
Public organization categories:     10
Unmapped categories:                 0
Unmapped regulatory characters:      0
Unmapped functional roles:           0
Unmapped relationship states:        0
Organizations without relationships: 0
```

## PR 11 evidence taxonomy baseline

```text
Canonical evidence records:          455
Projected evidence relations:         455
Canonical source types:                75
Public source categories:              12 used / 13 defined
Explicit v2 relation origins:         361
Legacy subject projections:            94
Multi-subject records:                421
Multi-claim records:                  307
Duplicate evidence IDs:                 0
Unknown reliability values retained:   36
```

Reliability, provenance, primary state, source type, and claim scope remain separate axes.

## PR 12 deployment baseline

```text
Deployments:                         130
Unique deployment IDs:              130
Stable assets covered:               92
Network or network contexts:         31
Records with evidence:              130
Records with control events:         18
Canonicality explicitly recorded:    63
Canonicality not recorded:           67
Explicit verification status:         0
```

Deployment operational state, canonicality, verification state, contract identity, and network identity remain separate axes.

## PR 13 value-state baseline

Approved public states:

```text
known
unknown_after_review
not_recorded
not_applicable
not_public
unverified
disputed
approximate
```

Canonical inventory:

```text
Source files scanned:         236
Records scanned:            2,167
Scalar values scanned:     31,908
Direct-value findings:      1,227
Narrative-text findings:       39
Excluded reference scalars:   435
```

Canonical raw values remain preserved, and known-unknown records remain distinct from accidental blanks.

## PR 14 primary display relationship baseline

```text
Stable assets:                         92
Organization relationships:          101
Primary display selections:            92
Deterministic selections:              92
Explicit overrides required:            0
Ambiguous selections:                   0
Invalid selections:                     0
Assets with multiple relationships:     8
Assets with multiple organizations:     8
Historical end dates not recorded:      7
```

Selection is independent of relationship JSON order. All current and historical relationships remain visible and searchable.

## PR 15 evidence source identity baseline

```text
Canonical evidence records:          455
Public source identities:            410
Evidence relations preserved:        455
Exact duplicate URL groups reviewed:  32
Records inside duplicate groups:      77
Approved canonical source groups:     32
Alias evidence IDs:                   45
Public duplicate URL groups:           0
Orphan relation source IDs:            0
```

Identity equation:

```text
410 public source identities
+45 alias evidence records
=455 canonical evidence records
```

Canonical evidence records remain available for audit history. Public tables render one source identity and preserve the union of connected stablecoins, organizations, events, and claim scopes.

## PR 16 complete 92-record migration baseline

Status after PR #184 merges: **PASS**

```text
Stable assets audited:                92
Passing records:                      92
Failing records:                       0
Curated copy-registry summaries:      20
Canonical record summaries:           72
Missing-summary fallbacks:             0
Rendering-component summary maps:      0
Asset-specific component findings:     0
Invalid copy slugs:                     0
Empty curated summaries:               0
Duplicate curated summaries:           0
```

Canonical counts before and after:

```text
Stable assets:                92 → 92
Organizations:                86 → 86
Relationships:               101 → 101
Events:                      150 → 150
Evidence records:            455 → 455
Deployments:                 130 → 130
Known unknowns:              253 → 253
Reserve reports:             100 → 100
Regulatory notes:              9 → 9
```

Every stable asset has a public summary source, lifecycle status, issuance status, reference target, backing type, stabilization mechanism, organization relationship, canonical evidence, public source identity, deployment, and last-reviewed date under the approved migration contract.

Authoritative files:

```text
config/stablecoin-public-copy.mjs
src/data/stablecoinPublicCopy.ts
scripts/collect-record-copy-migration.mjs
scripts/validate-record-copy-migration.mjs
data/generated/record-copy-migration-audit.json
data/generated/record-copy-migration-validation.json
docs/audits/record-copy-migration-2026-06-27.md
```

## Phase 3 sequence

```text
PR 17  finalize site architecture and route roles
PR 18  finalize stablecoin dossier hierarchy
PR 19  finalize list, search, filter, and comparison behavior
PR 20  define meaningful change history
PR 21  finalize responsive and accessibility specification
PR 22  approve visual system and image mocks
```

Phase 3 defines the complete information architecture and approved visual direction before implementation. It must not silently remove fields validated in Gate C.

## Immediate next work — PR 17

1. Define the three public navigation groups: Registry, Learn, and Project.
2. Assign one explicit role to every current route and machine-readable endpoint.
3. Preserve canonical route compatibility, including `/issuers/` and `/issuer/[slug]/`, while using the broader public concept `Organizations`.
4. Define primary, secondary, contextual, and machine-discovery navigation paths.
5. Define which page owns registry entry, education, methodology, change history, corrections, support, and machine-readable discovery.
6. Produce the approved route-role matrix, sitemap hierarchy, global-navigation map, and route compatibility table.
7. Reject any route removal, rename, redirect, or canonical change not supported by a dedicated migration decision.
8. Keep Evidence, Known unknowns, organization relationships, history, and machine-readable endpoints reachable.
9. Do not design the stablecoin dossier field order; that belongs to PR 18.
10. Do not implement final list/filter behavior; that belongs to PR 19.
11. Do not implement visual mocks; that belongs to PR 22.
12. Do not select Batch 18, add the final eight assets, or deploy production.

## PR 17 completion criteria

```text
Every current route has one approved role
Registry / Learn / Project navigation groups are fixed
Compatibility routes and canonical URLs are preserved
Machine-readable discovery remains explicit
No current public route is silently orphaned
PR 18 can use the approved route architecture without reopening global navigation
```

## Protected quality queues

```text
Missing canonical launch dates:           20
Historical terminal dates unresolved:      4
Historical relationship end dates:         7
Reserve applicability queue:               12
Public duplicate evidence URL groups:       0
Evidence reliability values unknown:       36
Direct workflow placeholders retained:    112
Deployment canonicality not recorded:      67
Deployment verification not recorded:     130
Deployment source review needed:           15
```

These queues may be reduced only by source-backed review. Phase 3 must not clear them through design, default values, hidden fields, or copy changes.

## Later phase gates

```text
Gate C  taxonomy and data-semantics migration — PASS after PR #184
Gate D  information architecture and mocks approved
Gate E  core registry UI complete
Gate F  responsive, accessibility, performance, SEO, and machine-readable hardening complete
Gate G  all 92 current records audited
Gate H  100-record release candidate verified
Gate I  deliberate production publication and parity verification complete
```

The final eight records remain blocked until the approved information architecture, UI implementation, hardening, and full regression audit are complete.

## Growth policy

Routine growth remains paused at 92 assets. The 100 target never permits thin records, unsupported dates, placeholder sources, collapsed organization roles, hidden known unknowns, erased evidence relations, or reduced evidence requirements.

## Publication policy during repair

```text
Automatic production deployment: disabled
Preview branch deployments: disabled
Routine repair PR deployment: none
Verified emergency repair: manual emergency publication allowed
100-record repaired UI: one planned manual publication checkpoint
Publication path: manual GitHub Actions workflow only
Pages project: stable-or-gone
Production branch: main
Manual production publication activation — PASS
Deployment workflow run: 27908380603
```

Canonical publication rules remain in `docs/deployment-policy.md`.

## Completion definition

The repair program is complete only when:

- 100 canonical stable assets are present;
- all public taxonomy axes are consistent;
- every asset, organization, event, evidence, and deployment route passes audit;
- no material mobile information is silently suppressed;
- evidence source identities, evidence relations, and known unknowns remain visible and connected;
- production identifies one source commit and one canonical data hash;
- HTML, sitemap, metadata, machine-readable files, and canonical counts agree;
- the production publication report is recorded.
