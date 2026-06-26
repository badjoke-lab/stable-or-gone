# Stable or Gone Roadmap

Updated: 2026-06-26

## Purpose

This is the canonical execution and recovery schedule for SOG. Roadmap-changing pull requests must update this file.

The document-authority rules are defined in `docs/spec-governance.md`.

The active workstream is governed by:

```text
docs/ui-redesign/master-spec.md
docs/ui-redesign/implementation-plan.md
docs/public-taxonomy-spec.md
```

## Current position

```text
Repository: badjoke-lab/stable-or-gone
Public site: https://sog.badjoke-lab.com/
Latest merged growth PR: #164 — Promote Batch 17 stable assets
Growth merge commit: be058152fe6f9c8b18357a36015a6b49c249624b
Latest merged quality PR: #165 — Align event source counts
Quality merge commit: db625e2f2b2268e3b5c2d8afadbe0f67452f7c63
Documentation reset PR: #167 — merged
Documentation reset merge commit: 94db111dc48e7dfb30576cda52d60e5494565ec0
Canonical stable assets: 92
Candidate total: 92
Promoted candidates: 92
Pending candidates: 0
Integrity audit: 0 critical findings / 0 warnings
Current phase: Phase 1 — emergency production-integrity repair
Latest completed repair item after this PR merges: PR 1 — repair baseline and defect inventory
Next approved work item: PR 2 — add build provenance
Routine growth: paused
Production publication: paused except verified emergency repair
```

## Why the roadmap changed

The 92-record checkpoint exposed defects that cannot be solved by a cosmetic redesign alone.

Confirmed repair areas include:

- public pages generated from inconsistent production snapshots;
- legacy and canonical lifecycle labels used inconsistently;
- arbitrary free-text values used as filter taxonomies;
- internal peg, deployment, and review values exposed publicly;
- event-category proliferation;
- evidence reliability mixed with source provenance;
- primary organization inferred from relationship array order;
- duplicate evidence presentation;
- internal implementation terminology in public records;
- generic mobile CSS hiding unrelated material fields by column number;
- long detail pages without an adequate information hierarchy;
- record-specific copy hard-coded in components.

The previous immediate sequence of publication, quality audits, and Batch 18 selection is superseded by the repair program below.

## Repair baseline

The fixed starting point for the repair program is:

```text
docs/ui-redesign/repair-baseline.json
docs/audits/ui-repair-baseline-2026-06-26.md
scripts/validate-ui-repair-baseline.mjs
```

The baseline records canonical counts, generated route and sitemap expectations, the public split-generation snapshot observed on 2026-06-26, sixteen confirmed defect IDs, and twenty representative records.

## Canonical registry

```text
Stable assets:               92
Organizations:               86
Relationships:              101
Classifications:             92
Reserve/redemption profiles: 92
Events:                     150
Event v2 details:           150
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

Source of truth:

```text
docs/migration/registry-v3-baseline.json
```

## Quality baseline

```text
Critical findings:                         0
Blocking warnings:                         0
Integrity audit warnings:                  0
Required-layer coverage:               92 / 92
Event coverage:                         92 / 92
Deployment coverage:                    92 / 92
Missing canonical launch dates:             20
Historical records missing terminal date:    4
Reserve applicability queue:                 12
  not applicable by design:                  10
  source status unresolved:                   2
  report expected but missing:                0
```

These canonical-data checks remain valid but do not replace the public-layer, taxonomy, responsive, and production-parity repair gates.

## Remaining research queues

### Launch dates

```text
Total unresolved: 20
Category B:         3
Category C:        13
Category D:         4
```

Category B:

```text
BRZ
Berachain HONEY
Anzen USDz
```

Batch 17 additions:

```text
USDH — Category C, launch-boundary conflict
AE Coin — Category D, primary launch source not recovered
```

### Reserve sources

```text
HUSD
EURT
```

### Terminal dates

```text
Basis Cash
Dynamic Set Dollar
Empty Set Dollar
GYEN
```

These queues remain preserved but are not the next work item.

## Binding repair sequence

The detailed PR-by-PR plan is `docs/ui-redesign/implementation-plan.md`.

Summary:

```text
Phase 0  Documentation reset
Phase 1  Emergency production-integrity repair
Phase 2  Public taxonomy and canonical-semantics repair
Phase 3  Information architecture, responsive specification, and mocks
Phase 4  Shared UI and registry indexes
Phase 5  Stablecoin dossier implementation
Phase 6  Search, home, editorial alignment, and hardening
Phase 7  Full 92-record audit and final eight-record promotion
Phase 8  100-record production publication
Phase 9  Post-release work
```

## Current gate

```text
Gate A — PASS
Gate B — in progress
```

Gate A completed through PR #167.

Gate B requires:

- PR 1 — repair baseline and defect inventory;
- PR 2 — build provenance;
- PR 3 — full-route and output parity enforcement;
- PR 4 — removal of destructive mobile column suppression.

No taxonomy migration, final UI mock, production UI implementation, Batch 18 selection, or routine publication begins before Gate B passes.

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

## Immediate next work

```text
1. Merge PR 1 after all CI workflows pass.
2. Start PR 2 from the resulting latest main.
3. Generate source commit, build timestamp, canonical data hash, canonical counts, and generated route counts at build time.
4. Expose the same provenance through version.json and build verification.
5. Do not select Batch 18.
6. Do not produce final UI mocks before PRs 17–21 define information and responsive behavior.
7. Do not begin production UI implementation before Gate D.
```

## Growth policy during repair

Routine growth is paused at 92 canonical assets.

The final eight records are promoted only after:

- production integrity repair;
- public-taxonomy migration;
- information-architecture approval;
- UI implementation and hardening;
- a full 92-record audit.

The final eight records must follow the normal candidate, evidence, full-layer, validation, and bounded-batch rules. The count target does not justify thin or incomplete records.

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
- the repaired public taxonomy is used consistently;
- all current asset, organization, and event routes pass the new audit;
- no material mobile information is silently suppressed;
- evidence and known unknowns remain visible and connected;
- production is generated from one verified source commit and data snapshot;
- HTML, sitemap, metadata, machine-readable files, and canonical counts agree;
- the production publication report is recorded.
