# Stable or Gone Roadmap

Updated: 2026-06-26

## Purpose

This is the canonical execution schedule for SOG. Roadmap-changing pull requests must update this file.

Required authority and workstream documents:

```text
AGENTS.md
docs/spec-governance.md
docs/deployment-policy.md
docs/ui-redesign/master-spec.md
docs/ui-redesign/implementation-plan.md
docs/public-taxonomy-spec.md
```

## Current position

```text
Repository: badjoke-lab/stable-or-gone
Public site: https://sog.badjoke-lab.com/
Canonical stable assets: 92
Organizations: 86
Relationships: 101
Events: 150
Evidence: 455
Known unknowns: 253
Deployments: 130
Documentation reset: PR #167 merged
Repair PR 1 baseline: PR #168 merged
Repair PR 2 provenance: PR #169 merged
Repair PR 3 output parity: PR #170 merged
Repair PR 4 mobile preservation: PR #171 merged
Taxonomy PR 5 public-value registry: PR #172 merged
Taxonomy PR 6 lifecycle and issuance: PR #173 merged
Taxonomy PR 7 reference target and peg: PR #174 merged
Current phase: Phase 2 — public taxonomy and canonical-semantics repair
Latest completed repair item after this PR merges: PR 8 — backing and stabilization normalization
Next approved work item: PR 9 — event category and subtype normalization
Routine growth: paused
Production publication: paused except verified emergency repair
```

## Canonical registry checkpoint

```text
Stable assets:               92
Organizations:               86
Relationships:              101
Classifications:             92
Reserve/redemption profiles: 92
Events:                     150
Event details:              150
Evidence:                   455
Evidence relations:         455
Reserve reports/context:    100
Known unknowns:             253
Regulatory notes:             9
Deployments:                130
Legal profiles:              92
Stable-asset relationships:   4
Reserve components:         125
Income profiles:             92
```

Canonical count source:

```text
docs/migration/registry-v3-baseline.json
```

## Gate A — documentation reset

Status: **PASS**  
Completed by PR #167.

## Gate B — production-integrity repair

Status: **PASS**

Completed work:

- [x] PR 1 — repair baseline and defect inventory, PR #168;
- [x] PR 2 — generated build provenance, PR #169;
- [x] PR 3 — exact route, sitemap, canonical, JSON-LD, and output parity, PR #170;
- [x] PR 4 — mobile information preservation, PR #171.

Gate B guarantees:

- one source commit, build timestamp, and canonical SHA-256 data hash per generated site;
- exact equality between canonical identity sets, index links, generated routes, sitemap URLs, canonical URLs, and JSON-LD URLs;
- rejection of missing or stale extra routes;
- preservation of material table fields on narrow screens;
- prohibition of generic numbered-column hiding;
- explicit identities and temporary `scroll-preserve` behavior for core registry tables.

## Gate C — taxonomy and data semantics

Status: **in progress**

### PR 5 — public-value registry

Status: **PASS**  
Merged as PR #172.

Authoritative mapping layer:

```text
config/public-taxonomy.mjs
docs/audits/public-taxonomy-registry-2026-06-26.md
scripts/collect-public-taxonomy-values.mjs
scripts/generate-public-taxonomy-registry.mjs
scripts/validate-public-taxonomy-registry.mjs
data/generated/public-taxonomy-values.json
data/generated/public-taxonomy-registry.json
data/generated/public-taxonomy-validation.json
```

Validation baseline:

```text
Managed axes:       26
Mapped entries:    411
Legacy rules:       10
Descriptive axes:    3
Observed unmapped managed values: 0
```

### PR 6 — lifecycle and issuance normalization

Status: **PASS**  
Merged as PR #173.

Authoritative compatibility and validation files:

```text
config/lifecycle-issuance-compatibility.mjs
src/utils/publicTaxonomy.ts
scripts/collect-lifecycle-issuance-migration.mjs
scripts/validate-lifecycle-issuance-normalization.mjs
docs/audits/lifecycle-issuance-normalization-2026-06-26.md
data/generated/lifecycle-issuance-migration.json
data/generated/lifecycle-issuance-validation.json
```

Canonical lifecycle counts:

```text
active:        69
restricted:     8
winding_down:   3
inactive:       1
terminated:     2
collapsed:      6
migrated:       2
rebranded:      1
```

Canonical issuance counts:

```text
open:             1
protocol_based:  29
restricted:      45
terminated:      15
unknown:           2
```

Public presentation separates lifecycle from issuance on the home page, stablecoin index, stablecoin detail pages, organization relationship tables, machine-readable breakdowns, and statistics.

Legacy status remains only as compatibility diagnostics under:

```text
composition.legacy_status_compatibility
```

### PR 7 — reference-target and peg normalization

Status: **PASS**  
Merged as PR #174.

Authoritative mapping and validation files:

```text
config/reference-targets.mjs
src/utils/referenceTarget.ts
scripts/collect-reference-target-migration.mjs
scripts/validate-reference-target-normalization.mjs
docs/audits/reference-target-normalization-2026-06-26.md
data/generated/reference-target-migration.json
data/generated/reference-target-validation.json
```

Canonical coverage:

```text
Stable assets:                 92
Missing reference kind:        0
Missing reference asset:       0
Unmapped reference asset:      0
Kind/mapping contradictions:   0
```

Reference kinds:

```text
fiat:       88
commodity:   2
floating:    1
index:       1
```

Approved public comparison categories:

```text
US dollar:                         71
Euro:                               8
Japanese yen:                       3
Other fiat currency:                5
Gold:                               2
Floating protocol target:           1
Indexed or inflation-linked target: 2
```

The three implementation-style reference codes now have reviewed public labels:

```text
Nuon -> US dollar with Truflation-linked rebase
RAI  -> Floating protocol redemption price
SPOT -> CPI-adjusted AMPL target
```

Public presentation separates reference target, reference kind, comparison category, target value, and methodology. The stablecoin index filters on approved comparison categories instead of raw reference codes.

Machine-readable output exposes:

```text
reference_kind
reference_comparison_category
```

Registry statistics expose:

```text
composition.reference_target_categories
```

Canonical codes remain only as compatibility diagnostics under:

```text
composition.canonical_reference_assets_compatibility
```

### PR 8 — backing and stabilization normalization

Status after this PR merges: **PASS**

Authoritative mapping and validation files:

```text
config/backing-models.mjs
src/utils/backingModel.ts
scripts/collect-backing-stabilization-migration.mjs
scripts/validate-backing-stabilization-normalization.mjs
docs/audits/backing-stabilization-normalization-2026-06-26.md
data/generated/backing-stabilization-migration.json
data/generated/backing-stabilization-validation.json
```

Canonical coverage:

```text
Stable assets:                    92
Reviewed public assignments:     92
Missing public model category:    0
Missing canonical backing type:   0
Missing stabilization mechanism:  0
Reserve component records:      125
```

Approved public model categories:

```text
Fiat and cash-equivalent backed: 31
Crypto-collateralized:           27
Hybrid or mixed:                 10
Tokenized asset-backed:           7
Synthetic or hedged:              6
Algorithmic or unbacked:          4
Wrapper or receipt:               3
Commodity-backed:                 2
Unknown:                          2
Other:                            0
```

Public presentation now separates the one-category comparison model from canonical non-exclusive backing types, reserve component records, the primary stabilization mechanism, the recorded model description, and historical model-change events.

The stablecoin index filters by approved public model category instead of deriving options from free-text `collateral_model` values.

Machine-readable output exposes:

```text
public_model_category
backing_type_non_exclusive
stabilization_mechanism
```

Registry statistics expose:

```text
composition.public_model_categories
composition.backing_types_non_exclusive
composition.stabilization_mechanisms
composition.reserve_component_categories
```

### Remaining Gate C sequence

```text
PR 9   event category and subtype normalization
PR 10  organization classification normalization
PR 11  evidence reliability, provenance, and type separation
PR 12  deployment status and verification-state separation
PR 13  value-state semantics
PR 14  explicit primary display relationships
PR 15  evidence-source deduplication with claim preservation
PR 16  move record-specific public copy and complete the 92-record migration
```

## Immediate next work

```text
1. Merge PR 8 only after every workflow passes.
2. Start PR 9 from the resulting latest main.
3. Inventory event_type, event_detail_kind, status effect, recovery state, and event-specific detail fields across all 150 events.
4. Separate public event category, canonical subtype, status effect, and recovery state.
5. Preserve depeg, issuer-control, governance, regulatory, launch, migration, wind-down, and failure detail instead of flattening them into one label.
6. Replace raw event filters and headings with approved public categories while retaining canonical subtype detail.
7. Validate all 150 events and reject unmapped category/subtype combinations.
8. Do not deploy production.
9. Do not select Batch 18.
```

## Quality queues preserved during repair

```text
Missing canonical launch dates:          20
Historical terminal dates unresolved:     4
Reserve applicability queue:              12
  not applicable by design:               10
  source status unresolved:                2
  report expected but missing:             0
```

These queues remain canonical but are not the current work item.

## Phase gates

```text
Gate A  documentation reset merged
Gate B  production integrity repaired
Gate C  taxonomy and data-semantics migration complete
Gate D  information architecture and mocks approved
Gate E  core registry UI complete
Gate F  responsive, accessibility, performance, SEO, and machine-readable hardening complete
Gate G  all 92 current records audited
Gate H  100-record release candidate verified
Gate I  deliberate production publication and parity verification complete
```

## Growth policy

Routine growth is paused at 92 assets. The final eight records may be promoted only after production integrity, taxonomy migration, information architecture, UI implementation, hardening, and the complete 92-record audit.

The 100 target never permits thin records, unsupported dates, placeholder sources, collapsed organization roles, or reduced evidence requirements.

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

The canonical deployment rules remain in `docs/deployment-policy.md`.

## Completion definition

The repair program is complete only when:

- 100 canonical stable assets are present;
- public taxonomy is consistent;
- every asset, organization, and event route passes the repaired audit;
- no material mobile information is silently suppressed;
- evidence and known unknowns remain visible and connected;
- production identifies one source commit and one canonical data hash;
- HTML, sitemap, metadata, machine-readable files, and canonical counts agree;
- the production publication report is recorded.
