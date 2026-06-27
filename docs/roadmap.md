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

Implementation work must cite these documents and this roadmap before changing public semantics, record counts, routes, or deployment behavior.

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
Current phase after PR #183 merges: Phase 3 — information architecture, responsive specification, and mocks
Latest completed work after PR #183 merges: PR 16
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

## PR 10 organization baseline

Status: **PASS**

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

## PR 11 evidence taxonomy baseline

Status: **PASS**

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

Authoritative audit:

```text
docs/audits/evidence-taxonomy-normalization-2026-06-26.md
```

## PR 12 deployment baseline

Status: **PASS**

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

## PR 13 value-state baseline

Status: **PASS**

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

Authoritative audit:

```text
docs/audits/value-state-normalization-2026-06-27.md
```

## PR 14 primary display relationship baseline

Status: **PASS**

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

Authoritative audit:

```text
docs/audits/primary-display-relationships-2026-06-27.md
```

## PR 15 evidence source identity baseline

Status after PR #182 merges: **PASS**

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

PR 15 preserves all canonical evidence records for audit history. Public tables render one source identity per exact URL and union the connected stablecoins, organizations, events, and claim scopes. Every original evidence record still projects one relation, with alias evidence IDs resolved to the approved canonical source identity.

Authoritative files:

```text
config/evidence-source-identities.mjs
config/evidence-source-deduplication.mjs
src/lib/data/evidenceSources.ts
src/components/EvidenceSourceTable.astro
scripts/collect-evidence-deduplication.mjs
scripts/validate-evidence-deduplication.mjs
scripts/validate-evidence-deduplication-public-surfaces.mjs
scripts/build-evidence-source-identity-stats.mjs
docs/audits/evidence-source-deduplication-2026-06-27.md
```

## PR 16 record public-copy and migration baseline

Status after PR #183 merges: **PASS**

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

The 20 reviewed summaries moved from the `StablecoinDetailView.astro` component to `src/data/stablecoinPublicCopy.ts`, keyed by canonical stablecoin ID. All 92 records now use one deterministic summary resolver. The rendering component contains no asset-specific summary table.

The source-code audit scanned 77 files and classified 595 stablecoin-specific references:

```text
Unresolved migration targets:       0
Approved data-overlay occurrences: 270
Editorial references:              319
Search examples:                     4
Schema examples:                     2
Shared-infrastructure references:    0
```

Editorial articles, methodology examples, search examples, and schema examples remain intentional content rather than migration defects.

Authoritative files:

```text
src/data/stablecoinPublicCopy.ts
docs/migration/record-public-copy-baseline.json
scripts/record-public-copy-audit-lib.mjs
scripts/record-public-copy-occurrences.mjs
scripts/record-migration-matrix.mjs
scripts/collect-record-public-copy-audit.mjs
scripts/validate-record-public-copy-audit.mjs
docs/audits/record-public-copy-migration-2026-06-27.md
```

## Gate C conclusion

Gate C is complete after PR #183 merges.

PRs 5–16 now guarantee:

- normalized public taxonomy and independent semantic axes;
- explicit investigated-unknown states;
- deterministic primary display relationships;
- deployment state separated from verification work state;
- one reviewed public source identity per exact source with all 455 evidence relations preserved;
- record-specific summaries outside reusable rendering components;
- a passing migration matrix for all 92 current assets;
- no unexplained canonical count loss;
- no unsupported value inference;
- no production publication during repair.

## Immediate next work — PR 17

1. Finalize the site architecture and route-role map.
2. Define Registry, Learn, and Project navigation groups.
3. Preserve all canonical and compatibility routes unless a dedicated route migration is approved.
4. Separate record access, educational material, project methodology, updates, corrections, and support by explicit information role.
5. Inventory every current page and assign a keep, merge, redirect, replace, or remove decision without implementing route changes prematurely.
6. Ensure evidence, known unknowns, machine-readable access, and corrections remain first-class destinations.
7. Produce the approved global navigation map and route responsibility matrix required for Phase 3.
8. Do not add stable assets or select Batch 18.
9. Do not begin production publication.
10. Do not treat the current public UI as the final information architecture.

## PR 17 completion criteria

```text
Registry, Learn, and Project navigation groups approved
Every current route assigned an explicit role
Compatibility routes preserved or separately migrated
No record field or evidence route orphaned by architecture
No implementation-level route change hidden in documentation
Phase 3 PR 18 can begin from one approved architecture map
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

Gate D begins with PR 17 after PR 16 merges and Gate C passes. The final eight records remain blocked until information architecture, UI implementation, hardening, and the later full repaired-UI regression audit are complete.

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
