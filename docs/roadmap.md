# Stable or Gone Roadmap

Updated: 2026-06-26

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
Latest completed work after PR #179 merges: PR 12
Next approved work: PR 13 — value-state semantics
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

Gate B guarantees:

- one source commit and canonical data hash per generated site;
- parity among canonical identities, routes, sitemap, canonical URLs, and JSON-LD;
- rejection of stale extra routes;
- preservation of material mobile information;
- prohibition of generic numbered-column hiding.

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

Reviewed provenance:

```text
Subject-controlled source:                  363
Technical primary source:                    31
Independent third-party source:              20
Governance primary source:                   14
Assurance or financial-report source:        13
Archive capture:                              5
Government, regulator, or legal source:       5
Data or market aggregator:                    4
Unknown:                                      0
```

Reviewed primary state:

```text
Primary:   431
Secondary:  24
Unknown:     0
```

Reviewed public reliability:

```text
High:    356
Medium:   63
Low:       0
Unknown:  36
```

The 36 `Unknown` records contain provenance/type-like raw values such as `primary`, `explorer`, repository labels, and interface labels. They are not promoted to reliability grades.

Archive state:

```text
Archive index or wildcard: 282
No archive recorded:       173
```

Authoritative files:

```text
config/evidence-taxonomy.mjs
config/evidence-relation-kinds.mjs
src/utils/evidenceTaxonomy.ts
scripts/collect-evidence-taxonomy-migration.mjs
scripts/validate-evidence-taxonomy-normalization.mjs
docs/audits/evidence-taxonomy-normalization-2026-06-26.md
```

Duplicate evidence is not merged in PR 11. Deduplication remains reserved for PR 15, where all subject and claim relations must be preserved.

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

Contract identity state:

```text
Identifier not recorded:                  69
Identifier recorded:                      45
Source review needed:                     15
Not applicable or review unresolved:       1
```

Network record state:

```text
Specific network recorded:        124
Aggregate or multi-chain context:    4
Network source review needed:        2
```

Authoritative files:

```text
config/deployment-taxonomy.mjs
src/utils/deploymentTaxonomy.ts
src/components/DeploymentTable.astro
scripts/collect-deployment-taxonomy-migration.mjs
scripts/validate-deployment-taxonomy-normalization.mjs
docs/audits/deployment-taxonomy-normalization-2026-06-26.md
```

PR 12 does not infer canonicality from popularity, verification from identifier syntax, active state from explorer availability, or implementation from a proposal.

## Remaining Gate C sequence

```text
PR 13  value-state semantics
PR 14  explicit primary display relationships
PR 15  evidence-source deduplication with claim preservation
PR 16  move record-specific public copy and complete the 92-record migration
```

## Immediate next work — PR 13

1. Define shared public states for known, unknown, not recorded, not applicable, review needed, and unavailable.
2. Audit field-level placeholders and blank-value semantics across the 92 current asset records.
3. Prevent literal workflow placeholders from appearing as user-facing facts.
4. Preserve canonical raw values while exposing normalized public state separately.
5. Apply the shared value-state model to asset, organization, event, evidence, reserve, redemption, and deployment surfaces where applicable.
6. Update machine-readable output, statistics, mobile checks, and validators.
7. Do not infer missing facts.
8. Do not perform primary-display-relationship work inside PR 13.
9. Do not deduplicate evidence.
10. Do not change canonical record counts.
11. Do not deploy production.
12. Do not select Batch 18.

## Preserved quality queues

```text
Missing canonical launch dates:          20
Historical terminal dates unresolved:     4
Reserve applicability queue:              12
Evidence duplicate URLs for PR 15:        32
Evidence polluted reliability values:     36
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
- evidence and known unknowns remain visible and connected;
- production identifies one source commit and one canonical data hash;
- HTML, sitemap, metadata, machine-readable files, and canonical counts agree;
- the production publication report is recorded.
