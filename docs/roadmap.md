# Stable or Gone Roadmap

Updated: 2026-06-27

## Purpose

This is the canonical execution schedule for SOG. Detailed findings belong in `docs/audits/`; this file records current position, completed gates, remaining PR order, and publication constraints.

Required authority:

```text
AGENTS.md
docs/spec-governance.md
docs/deployment-policy.md
docs/ui-redesign/master-spec.md
docs/ui-redesign/implementation-plan.md
docs/public-taxonomy-spec.md
```

## Registry checkpoint

```text
Stable assets:                92
Organizations:                86
Organization relationships:  101
Events:                      150
Evidence:                    455
Evidence relations:          455
Known unknowns:              253
Deployments:                 130
Reserve components:          125
```

Canonical count source:

```text
docs/migration/registry-v3-baseline.json
```

## Current position

```text
Repository: badjoke-lab/stable-or-gone
Public site: https://sog.badjoke-lab.com/
Current phase: Phase 2 — public taxonomy and canonical-semantics repair
Latest completed work after PR #181 merges: PR 14
Next approved work: PR 15 — evidence-source deduplication with claim preservation
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

Gate B guarantees one source commit and data hash per generated site, route and sitemap parity, stale-output rejection, and preservation of material mobile information.

### Gate C — taxonomy and data semantics

Status: **in progress**

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

Authoritative audit:

```text
docs/audits/organization-taxonomy-normalization-2026-06-26.md
```

## PR 11 evidence baseline

Status after PR #178 merges: **PASS**

```text
Evidence records:                    455
Projected evidence relations:       455
Canonical source types:              75
Public source categories:            12 used / 13 defined
Explicit v2 relation origins:       361
Legacy subject projections:          94
Multi-subject records:              421
Multi-claim records:                307
Duplicate evidence IDs:               0
Duplicate URLs retained:             32
Duplicate URL-title pairs retained:   7
```

Reviewed public reliability:

```text
High:    356
Medium:   63
Low:       0
Unknown:  36
```

The 36 unknown reliability values are retained rather than promoted from provenance or type-like raw values. Duplicate evidence remains reserved for PR 15.

Authoritative audit:

```text
docs/audits/evidence-taxonomy-normalization-2026-06-26.md
```

## PR 12 deployment baseline

Status after PR #179 merges: **PASS**

```text
Deployments:                       130
Unique deployment IDs:            130
Stable assets covered:             92
Network or network contexts:       31
Records with evidence:            130
Records with control events:       18
Canonicality explicitly recorded:  63
Canonicality not recorded:         67
Explicit verification status:       0
```

Operational state:

```text
Active:                 85
Unknown or unresolved:  23
Inactive or historical:  6
Restricted:              6
Collapsed or failed:     2
Winding down:            2
Terminated:              2
Limited:                 2
Impaired:                1
Migrated:                1
```

Verification state:

```text
Source-linked record; identifier not recorded: 69
Identifier recorded; verification not recorded: 45
Source review needed:                           15
Unknown or unresolved:                           1
Explicitly verified:                             0
```

Authoritative audit:

```text
docs/audits/deployment-taxonomy-normalization-2026-06-26.md
```

## PR 13 value-state baseline

Status after PR #180 merges: **PASS**

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

PR 13 preserves canonical raw values, exposes explicit public states, and keeps known-unknown records distinct from accidental blanks.

Authoritative audit:

```text
docs/audits/value-state-normalization-2026-06-27.md
```

## PR 14 primary display relationship baseline

Status after PR #181 merges: **PASS**

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

Selected roles:

```text
Protocol operator: 52
Legal issuer:      37
Brand owner:        2
Reserve manager:    1
```

Selected relationship states:

```text
Active:  77
Ended:   13
Unknown:  2
```

PR 14 removes relationship-array-order selection. Every asset is tested against canonical, reversed, and rotated relationship order. Search and organization filters continue to cover every relationship, while compact summaries use one reviewed primary display relationship.

Authoritative files:

```text
config/primary-display-relationships.mjs
src/utils/primaryDisplayRelationship.ts
scripts/collect-primary-display-relationships.mjs
scripts/validate-primary-display-relationships.mjs
scripts/validate-primary-display-public-surfaces.mjs
docs/audits/primary-display-relationships-2026-06-27.md
```

## Remaining Gate C sequence

```text
PR 15  evidence-source deduplication with claim preservation
PR 16  move record-specific public copy and complete the 92-record migration
```

## Immediate next work — PR 15

1. Audit all 455 evidence identities and all projected evidence relations.
2. Start from the 32 duplicate URLs and 7 duplicate URL-title pairs already identified.
3. Distinguish true duplicate source identities from different archive captures, editions, pages, or claim contexts.
4. Preserve every stablecoin, organization, event, and claim-scope relation before merging source identities.
5. Prevent duplicate public source rows while allowing one source to support multiple claims and subjects.
6. Preserve canonical counts unless an audited evidence-identity migration explicitly changes them.
7. Update evidence pages, machine-readable output, Registry statistics, mobile checks, and validators.
8. Do not perform PR 16 record-specific copy migration.
9. Do not select Batch 18.
10. Do not deploy production.

## Preserved quality queues

```text
Missing canonical launch dates:          20
Historical terminal dates unresolved:     4
Historical relationship end dates:        7
Reserve applicability queue:              12
Evidence duplicate URLs for PR 15:        32
Evidence duplicate URL-title pairs:        7
Evidence polluted reliability values:     36
Direct workflow placeholders retained:   112
Deployment canonicality not recorded:     67
Deployment verification not recorded:    130
Deployment source review needed:          15
```

## Later phase gates

```text
Gate C  taxonomy and data-semantics migration complete
Gate D  information architecture and mocks approved
Gate E  core registry UI complete
Gate F  responsive, accessibility, performance, SEO, and machine-readable hardening complete
Gate G  all 92 current records audited
Gate H  100-record release candidate verified
Gate I  deliberate production publication and parity verification complete
```

## Growth policy

Routine growth remains paused at 92 assets. The final eight records may be promoted only after taxonomy migration, information architecture, UI implementation, hardening, and the complete 92-record audit.

The 100 target never permits thin records, unsupported dates, placeholder sources, collapsed organization roles, hidden known unknowns, erased evidence relations, or reduced evidence requirements.

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
Manual production publication activation: PASS
Deployment workflow run: 27908380603
```

Canonical publication rules remain in `docs/deployment-policy.md`.

## Completion definition

The repair program is complete only when:

- 100 canonical stable assets are present;
- all public taxonomy axes are consistent;
- every asset, organization, event, evidence, and deployment route passes audit;
- no material mobile information is silently suppressed;
- evidence and known unknowns remain visible and connected;
- production identifies one source commit and one canonical data hash;
- HTML, sitemap, metadata, machine-readable files, and canonical counts agree;
- the production publication report is recorded.
