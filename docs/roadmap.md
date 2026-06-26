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
Current phase after this PR merges: Phase 2 — public taxonomy and canonical-semantics repair
Latest completed repair item after this PR merges: PR 4 — mobile information preservation
Next approved work item: PR 5 — add public-value registry and legacy mapping
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

Status after this PR merges: **PASS**

Completed work:

- [x] PR 1 — repair baseline and defect inventory, PR #168;
- [x] PR 2 — generated build provenance, PR #169;
- [x] PR 3 — exact route, sitemap, canonical, JSON-LD, and output parity, PR #170;
- [x] PR 4 — remove destructive mobile column suppression and enforce information-preserving table identities.

### Controls established

```text
docs/ui-redesign/repair-baseline.json
docs/audits/ui-repair-baseline-2026-06-26.md
data/generated/build-provenance.json
scripts/validate-ui-repair-baseline.mjs
scripts/generate-build-provenance.mjs
scripts/verify-build-provenance.mjs
scripts/verify-full-output-parity.mjs
scripts/check-production-provenance.mjs
scripts/check-production-output-parity.mjs
scripts/validate-mobile-information-preservation.mjs
```

Gate B now guarantees:

- one source commit, build timestamp, and canonical SHA-256 data hash per generated site;
- exact equality between canonical identity sets, index links, generated routes, sitemap URLs, canonical URLs, and JSON-LD URLs;
- rejection of missing or stale extra routes;
- preservation of material table fields on narrow screens;
- prohibition of generic `th/td:nth-child` hiding;
- explicit identities and temporary `scroll-preserve` behavior for 22 core registry tables.

## Current gate

```text
Gate A — PASS
Gate B — PASS after this PR merges
Gate C — next
```

Gate C is governed by Phase 2 of `docs/ui-redesign/implementation-plan.md`.

Required sequence:

```text
PR 5   public-value registry and legacy mapping
PR 6   lifecycle and issuance normalization
PR 7   reference-target and peg normalization
PR 8   backing and stabilization normalization
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
1. Merge PR 4 only after every workflow passes.
2. Start PR 5 from the resulting latest main.
3. Implement one approved mapping layer for canonical value, public category, public label, legacy aliases, definition, and sort order.
4. Cover lifecycle, issuance, reference target, public model category, event category, organization category, relationship role, evidence, deployment, and value-state axes.
5. Add unmapped-value and duplicate-mapping validators.
6. Do not modify canonical record meaning in PR 5.
7. Do not deploy production.
8. Do not select Batch 18.
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
