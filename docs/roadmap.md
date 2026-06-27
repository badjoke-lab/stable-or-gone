# Stable or Gone Roadmap

Updated: 2026-06-27

## Purpose

This is the canonical execution schedule for SOG. Detailed findings belong in `docs/audits/`; approved information-architecture decisions belong in `docs/architecture/`. This file records the current position, completed gates, remaining PR order, protected queues, and publication constraints.

Required authority:

```text
AGENTS.md
docs/spec-governance.md
docs/deployment-policy.md
docs/ui-redesign/master-spec.md
docs/ui-redesign/implementation-plan.md
docs/public-taxonomy-spec.md
docs/architecture/site-architecture-v1.md
docs/architecture/stablecoin-dossier-hierarchy-v1.md
docs/architecture/index-interaction-contract-v1.md
docs/architecture/meaningful-change-history-v1.md
```

Implementation work must cite these documents and this roadmap before changing public semantics, record counts, routes, navigation, dossier field ownership, index interaction behavior, change-history behavior, or deployment behavior.

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
Current phase after PR #188 merges: Phase 3 — information architecture, responsive specification, and mocks
Latest completed work after PR #188 merges: PR 20
Next approved work: PR 21 — finalize responsive and accessibility specification
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

## Phase 2 protected baselines

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

## Phase 3 sequence

```text
PR 17  finalize site architecture and route roles — PASS after PR #185
PR 18  finalize stablecoin dossier hierarchy — PASS after PR #186
PR 19  finalize list, search, filter, and comparison behavior — PASS after PR #187
PR 20  define meaningful public change history — PASS after PR #188
PR 21  finalize responsive and accessibility specification
PR 22  approve visual system and image mocks
```

### Gate D

No production UI implementation begins until PRs 17–22 are merged and their validation contracts pass.

The approved architecture, dossier hierarchy, index interaction contract, and change-history contract are specifications, not permission to implement the final UI early.

```text
Global shell implementation:       PR 23
Stablecoin index implementation:   PR 24
Organization index implementation: PR 25
Event index implementation:        PR 26
Dossier implementation begins:     PR 27
Meaningful Updates implementation: PR 34
```

## PR 17 site architecture baseline

Status after PR #185 merges: **PASS**

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
  Corrections     /contact/
  Support         /support/
```

Route decisions:

```text
Current routes kept:     27
Routes renamed:           0
Routes removed:           0
Redirects introduced:     0
Compatibility breaks:     0
```

## PR 18 stablecoin dossier baseline

Status after PR #186 merges: **PASS**

```text
Required dossier sections:          8
Current dossier surface files:      7
Current section labels found:      13
Raw field-render occurrences:     118
Unique current field surfaces:    102
Synthetic required fields:         12
Total field-to-section rows:       114
Unassigned current fields:          0
Duplicate field IDs:                0
Deprecated current fields:          0
Collector or validator failures:    0
```

Approved section order:

```text
Identity and current state
Organizations and control
How the asset works
Deployments and legal context
History
Evidence
Known unknowns and coverage
Corrections and further reading
```

Mandatory dossier protections:

```text
Evidence section required:                  true
Known unknowns section required:            true
Corrections and further reading required:   true
All organization relationships reachable:  true
Current and historical data kept distinct: true
Hero metrics remain summaries only:        true
Deployment semantic axes preserved:          8
Evidence semantic axes preserved:            8
Route changes in PR 18:                       0
Dossier implementation starts:              PR 27
```

## PR 19 index interaction baseline

Status after PR #187 merges: **PASS**

```text
Index contracts:                  3
Explicit search fields:          18
Multi-value filters:             16
Sort modes:                      15
Material mobile-row fields:      26
Comparison-enabled indexes:       1
Comparison-disabled indexes:      2
Route changes:                     0
```

Current implementation baseline:

```text
Index            Search inputs   Select controls   Table columns
Stablecoins      1               6                 9
Organizations    1               6                 8
Events           1               4                 8
```

Implementation gaps preserved for PRs 24–26:

```text
shareable URL state
browser Back and Forward restoration
per-filter removal
Clear all
stablecoin comparison
```

Stablecoin comparison:

```text
Minimum records: 2
Maximum records: 4
URL parameter: compare
Identity key: slug
Comparison groups: 7
Excluded market/ranking axes: 8
```

Comparison is not a ranking or recommendation. Unknown values remain explicit and are not converted to zero or treated as worst.

## PR 20 meaningful change-history baseline

Status after PR #188 merges: **PASS**

Approved public change types:

```text
status_change
event_added
evidence_added
relationship_change
reserve_redemption_change
known_unknown_added
known_unknown_resolved
copy_only_correction
```

Current legacy update layer:

```text
Legacy entries:                    13
Legacy categories:                  4
Duplicate legacy IDs:               0
Public-copy overlays:              13
Missing public-copy overlays:       0
Target-ready legacy entries:        0
```

Legacy category inventory:

```text
data:        8
content:     2
ui:          2
foundation:  1
```

The legacy entries remain intact. Broad legacy categories are not automatically converted to meaningful change types. Migration requires reviewed manual mapping in PR 34.

Canonical date-signal audit:

```text
Date signals scanned:             1,324
Review-only signals:                850
Source metadata signals:            151
Historical/effective signals:       323
Invalid date shapes:                  0
```

Review-only and generated dates do not create change entries:

```text
stablecoin.last_verified_at
organization.last_verified_at
evidence.accessed_at
known_unknown.last_checked_at
build.generated_at
manifest.generated_at
version.generated_at
```

Structured change-entry contract:

```text
Required fields:                   12
Optional relationship fields:       5
Public placement surfaces:          4
Before/after value states:           8
Effective-date states:               5
Route changes:                        0
Public implementation starts:       PR 34
```

Mandatory history protections:

```text
append-only public history
historical entries not overwritten
corrections reference prior entries
superseded entries remain visible
copy-only corrections do not imply fact changes
known-unknown resolution requires prior unknown and evidence
source identity and evidence relation remain distinct
recorded date and effective date remain distinct
```

Authoritative files:

```text
config/change-history-contract.mjs
scripts/collect-change-history-audit.mjs
scripts/validate-change-history-contract.mjs
docs/architecture/meaningful-change-history-v1.md
```

## Immediate next work — PR 21

1. Inventory every current table, long-form record section, filter control, navigation surface, evidence list, contract field, and expanded-state interaction.
2. Define page-specific responsive transformations for:

```text
home
stablecoin index
organization index
event index
stablecoin dossier
organization detail
event detail
guides and project pages
```

3. Define the mobile representation of every protected table.
4. Ensure mobile operation does not depend only on horizontal scrolling.
5. Define desktop and mobile focus order.
6. Define keyboard behavior for navigation, filters, comparison selection, disclosure controls, source expansion, and local dossier navigation.
7. Define result announcements, active-filter announcements, and zero-result recovery.
8. Define long contract-address handling and copy behavior.
9. Define non-color state indicators, reduced-motion behavior, and minimum contrast requirements.
10. Generate a machine-readable responsive/accessibility contract and dedicated validator.
11. Do not implement the final UI, add stable assets, select Batch 18, change routes, or deploy production.

PR 21 completion criteria:

```text
every current table has an explicit mobile representation
no material-information suppression remains unspecified
focus order defined for all major page families
keyboard behavior defined for all interactive controls
result and filter announcements defined
contract and long-text behavior defined
non-color and reduced-motion requirements defined
machine-readable contract and validator pass
no final UI implementation or production publication hidden in the specification
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
