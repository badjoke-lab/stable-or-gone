# Stable or Gone Roadmap

Updated: 2026-06-26

## Purpose

This file is the canonical execution schedule for SOG. Detailed findings belong in `docs/audits/`; this roadmap records current position, completed gates, remaining PR order, and publication constraints.

Required authority:

```text
AGENTS.md
docs/spec-governance.md
docs/deployment-policy.md
docs/ui-redesign/master-spec.md
docs/ui-redesign/implementation-plan.md
docs/public-taxonomy-spec.md
```

## Current registry checkpoint

```text
Stable assets:                92
Organizations:                86
Organization relationships:  101
Classifications:              92
Reserve/redemption profiles:  92
Events:                      150
Event details:               150
Evidence:                    455
Evidence relations:          455
Reserve reports/context:     100
Known unknowns:              253
Regulatory notes:              9
Deployments:                 130
Legal profiles:               92
Stable-asset relationships:    4
Reserve components:          125
Income profiles:              92
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
Latest completed work after PR #178 merges: PR 11
Next approved work: PR 12 — deployment status and verification-state separation
Routine record growth: paused at 92 assets
Production publication: paused except verified emergency repair
Batch 18 selection: prohibited during repair
```

## Completed program work

### Documentation and production-integrity gates

```text
PR #167  documentation reset
PR #168  repair baseline and defect inventory
PR #169  generated build provenance
PR #170  route, sitemap, canonical, JSON-LD, and output parity
PR #171  mobile information preservation
```

Gate A — documentation reset: **PASS**  
Gate B — production-integrity repair: **PASS**

Gate B guarantees:

- one source commit and canonical data hash per generated site;
- exact parity among canonical identities, routes, sitemap, canonical URLs, and JSON-LD;
- rejection of stale extra routes;
- preservation of material mobile information;
- prohibition of generic numbered-column hiding;
- explicit table identities with `scroll-preserve` access during repair.

### Taxonomy and semantics work

```text
PR #172  PR 5  public-value registry
PR #173  PR 6  lifecycle and issuance normalization
PR #174  PR 7  reference-target and peg normalization
PR #175  PR 8  backing and stabilization normalization
PR #176  PR 9  event category and subtype normalization
PR #177  PR 10 organization classification normalization
PR #178  PR 11 evidence reliability, provenance, and type separation
```

Gate C — taxonomy and data semantics: **in progress**

## Completed taxonomy baselines

### Lifecycle and issuance

```text
Lifecycle:
  active        69
  restricted     8
  winding_down   3
  inactive       1
  terminated     2
  collapsed      6
  migrated       2
  rebranded      1

Issuance:
  open             1
  protocol_based  29
  restricted      45
  terminated      15
  unknown           2
```

### Reference target

```text
US dollar                         71
Euro                               8
Japanese yen                       3
Other fiat currency                5
Gold                               2
Floating protocol target           1
Indexed or inflation-linked target 2
```

### Public backing model

```text
Fiat and cash-equivalent backed 31
Crypto-collateralized           27
Hybrid or mixed                 10
Tokenized asset-backed           7
Synthetic or hedged              6
Algorithmic or unbacked          4
Wrapper or receipt               3
Commodity-backed                 2
Unknown                          2
```

### Event taxonomy

```text
Canonical events:                    150
Canonical event subtypes:             51
Unmapped current subtypes:              0
Structured typed-detail records:     120
Description-and-source-only records:  30
```

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

### Evidence taxonomy

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

The 36 `Unknown` records contain raw values such as `primary`, `explorer`, and repository/interface labels. These remain visible as compatibility values and are not promoted to reliability grades.

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

Evidence presentation now separates:

```text
original source URL
publisher
public source category
canonical source type
provenance
primary or secondary state
supported claims
archive state and archive URL
normalized reliability
recorded raw reliability when different
```

Duplicate evidence is not merged in PR 11. Deduplication remains reserved for PR 15, where all subject and claim relations must be preserved.

## Remaining Gate C sequence

```text
PR 12  deployment status and verification-state separation
PR 13  value-state semantics
PR 14  explicit primary display relationships
PR 15  evidence-source deduplication with claim preservation
PR 16  move record-specific public copy and complete the 92-record migration
```

## Immediate next work — PR 12

PR 12 must start from the latest main after PR #178 merges.

Required work:

1. Inventory all 130 deployment records.
2. Separate deployment lifecycle status from canonicality and verification state.
3. Separate chain/network identity, token standard, deployment type, contract verification, issuer-control capability, and operational state.
4. Detect `status` values that are standing in for canonicality or verification.
5. Distinguish missing contract data from unknown, not applicable, and not yet verified.
6. Preserve multi-chain and historical deployment records.
7. Update stablecoin deployment tables, machine-readable output, registry statistics, mobile checks, and validators.
8. Do not infer canonical deployment status from chain popularity or current market use.
9. Do not perform value-state semantics work inside PR 12.
10. Do not change canonical record counts.
11. Do not deploy production.
12. Do not select Batch 18.

## Preserved quality queues

```text
Missing canonical launch dates:          20
Historical terminal dates unresolved:     4
Reserve applicability queue:              12
  not applicable by design:               10
  source status unresolved:                2
  report expected but missing:             0
Evidence duplicate URLs for PR 15:        32
Evidence polluted reliability values:     36
```

These queues remain visible but are not the PR 12 work item unless explicitly required by deployment semantics.

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

The 100 target never permits:

- thin records;
- unsupported dates;
- placeholder sources;
- collapsed organization roles;
- hidden known unknowns;
- erased evidence relations;
- reduced evidence requirements.

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
