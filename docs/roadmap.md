# Stable or Gone Roadmap

Updated: 2026-06-27

## Purpose

This is the canonical execution schedule for SOG. Detailed findings belong in `docs/audits/` and approved design decisions belong in `docs/architecture/`. This file records the current position, completed gates, remaining PR order, protected queues, and publication constraints.

Required authority:

```text
AGENTS.md
docs/spec-governance.md
docs/deployment-policy.md
docs/ui-redesign/master-spec.md
docs/ui-redesign/implementation-plan.md
docs/public-taxonomy-spec.md
docs/architecture/site-architecture-v1.md
```

Implementation work must cite these documents and this roadmap before changing public semantics, record counts, routes, navigation, or deployment behavior.

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
```

Canonical count source:

```text
docs/migration/registry-v3-baseline.json
```

## Current position

```text
Repository: badjoke-lab/stable-or-gone
Public site: https://sog.badjoke-lab.com/
Current phase after PR #185 merges: Phase 3 — information architecture, responsive specification, and mocks
Latest completed work after PR #185 merges: PR 17
Next approved work: PR 18 — finalize stablecoin dossier hierarchy
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

Status after PR #183 merges: **PASS**

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
PR #183  PR 16 record-specific public-copy migration and 92-record completion matrix
```

Gate C guarantees normalized public taxonomy, explicit investigated-unknown states, deterministic primary display relationships, independent deployment verification axes, one reviewed public source identity per exact source URL, all 455 evidence relations preserved, record-specific summaries outside reusable rendering components, and a passing migration matrix for all 92 assets.

## Phase 2 baselines

### Organization taxonomy

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

Authoritative audit:

```text
docs/audits/organization-taxonomy-normalization-2026-06-26.md
```

### Evidence taxonomy and source identity

```text
Canonical evidence records:          455
Evidence relations:                   455
Canonical source types:                75
Public source categories:              12 used / 13 defined
Explicit v2 relation origins:         361
Legacy subject projections:            94
Multi-subject records:                421
Multi-claim records:                  307
Unknown reliability values retained:   36
Public source identities:             410
Exact duplicate URL groups reviewed:   32
Alias evidence IDs:                    45
Public duplicate URL groups:            0
Orphan relation source IDs:              0
```

Identity equation:

```text
410 public source identities
+45 alias evidence records
=455 canonical evidence records
```

Authoritative audits:

```text
docs/audits/evidence-taxonomy-normalization-2026-06-26.md
docs/audits/evidence-source-deduplication-2026-06-27.md
```

### Deployment taxonomy

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

Authoritative audit:

```text
docs/audits/deployment-taxonomy-normalization-2026-06-26.md
```

### Value states

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

Authoritative audit:

```text
docs/audits/value-state-normalization-2026-06-27.md
```

### Primary display relationships

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

Authoritative audit:

```text
docs/audits/primary-display-relationships-2026-06-27.md
```

### Record public-copy migration

```text
Stable assets audited:                    92
Migration-ready records:                  92
Incomplete records:                        0
Reviewed summary overrides preserved:     20
Canonical-summary fallbacks preserved:    72
Unresolved component/page copy targets:    0
Canonical evidence relations preserved:  455
Public source identities preserved:      410
Orphan source relation IDs:                0
Invalid stablecoin relation IDs:           0
```

Before-and-after preservation:

```text
Stablecoin count preserved:             true
Summary override count preserved:       true
Canonical fallback count preserved:     true
Summary override ID set preserved:      true
Summary text digest preserved:          true
```

Authoritative audit:

```text
docs/audits/record-public-copy-migration-2026-06-27.md
```

## PR 17 site architecture baseline

Status after PR #185 merges: **PASS**

Route inventory:

```text
Page source files:                    27
Route patterns:                       27
Static routes:                        24
Dynamic route families:                3
HTML route patterns:                  22
Machine-readable route patterns:       5
Duplicate routes:                       0
Navigation destinations without route: 0
Declared routes without source:         0
Unassigned routes after review:         0
```

Approved global information architecture:

```text
Registry
  Stablecoins     /stablecoins/
  Organizations   /issuers/
  Events          /events/

Learn
  Guides          /guides/
  Glossary        /glossary/
  Models          /models/

Project
  Methodology     /methodology/
  Updates         /updates/
  About           /about/

Utilities
  Corrections     /contact/   primary utility
  Support         /support/   secondary utility
```

Data access remains outside the primary human-navigation groups:

```text
/version.json
/data/manifest.json
/llms.txt
/ai.txt
/sitemap-index.xml
```

Route decisions:

```text
Current routes kept:     27
Routes renamed:           0
Routes removed:           0
Redirects introduced:     0
Compatibility breaks:     0
```

`/about/` was the only route without a preliminary role and is now assigned to Project. `/about/` and `/models/` are added to the approved grouped-navigation map, but the current global shell is not changed in PR 17. Actual grouped desktop/mobile navigation remains deferred to PR 23.

Authoritative files:

```text
config/site-architecture.mjs
scripts/collect-site-architecture-audit.mjs
scripts/validate-site-architecture.mjs
docs/architecture/site-architecture-v1.md
```

## Phase 3 sequence

```text
PR 17  finalize site architecture and route roles — PASS after PR #185
PR 18  finalize stablecoin dossier hierarchy
PR 19  finalize list, search, filter, and comparison behavior
PR 20  define meaningful change history
PR 21  finalize responsive and accessibility specification
PR 22  approve visual system and image mocks
```

### Gate D

No production UI implementation begins until PRs 17–22 are merged.

The approved architecture is a specification, not permission to implement the final shell early. Global shell and grouped navigation implementation remains PR 23.

## Immediate next work — PR 18

1. Inventory every field currently exposed on the stablecoin detail route.
2. Create one field-to-section matrix covering:

```text
identity and current state
organizations and control
how the asset works
deployments and legal context
history
evidence
known unknowns
corrections and further reading
```

3. Assign every current public field one destination, replacement, or explicit deprecation decision.
4. Keep canonical field names, public labels, value-state handling, and display formatting separate.
5. Preserve all organization relationships, not only the primary display relationship.
6. Preserve deployment operational state, canonicality, verification, contract identity, and network identity as distinct facts.
7. Preserve source identity and evidence relation counts and every supported claim scope.
8. Make evidence and known unknowns mandatory dossier sections that cannot be removed by visual simplification.
9. Define local dossier navigation and section order without implementing the final UI shell.
10. Do not add stable assets, select Batch 18, change routes, or publish production.

## PR 18 completion criteria

```text
Every current stablecoin-detail field appears in the matrix
Every field has destination, replacement, or explicit deprecation
Evidence section is mandatory
Known-unknown section is mandatory
All organization relationships remain reachable
All deployment axes remain distinguishable
No route or production implementation is hidden in the specification
PR 19 can begin from one approved dossier hierarchy
```

## Preserved quality queues

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

These queues may be reduced only by source-backed review. Architecture and UI work must not clear them by defaulting, guessing, or relabeling them as known.

## Later phase gates

```text
Gate C  taxonomy and data-semantics migration complete — PASS after PR #183
Gate D  information architecture and mocks approved
Gate E  core registry UI complete
Gate F  responsive, accessibility, performance, SEO, and machine-readable hardening complete
Gate G  all 92 current records audited under the repaired UI
Gate H  100-record release candidate verified
Gate I  deliberate production publication and parity verification complete
```

The final eight records remain blocked until information architecture, UI implementation, hardening, and the later full repaired-UI regression audit are complete.

## Growth policy

Routine growth remains paused at 92 assets. The 100 target never permits thin records, unsupported dates, placeholder sources, collapsed organization roles, hidden known unknowns, erased evidence relations, duplicated public source rows, or reduced evidence requirements.

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
