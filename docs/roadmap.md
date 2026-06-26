# Stable or Gone Roadmap

Updated: 2026-06-26

## Purpose

This is the canonical execution and recovery schedule for SOG. Roadmap-changing pull requests must update this file.

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
Current phase: Phase 1 — emergency production-integrity repair
Latest completed repair item after this PR merges: PR 2 — build provenance
Next approved work item: PR 3 — full-route and output parity enforcement
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

## Repair baseline

The fixed starting point is:

```text
docs/ui-redesign/repair-baseline.json
docs/audits/ui-repair-baseline-2026-06-26.md
scripts/validate-ui-repair-baseline.mjs
```

It records:

- canonical counts and coverage;
- 328 expected detail routes;
- 328 expected detail sitemap URLs;
- the public split-generation state observed on 2026-06-26;
- sixteen confirmed defects;
- twenty representative records.

## Build provenance

After PR 2 merges, every full build generates one provenance record containing:

```text
source commit
source branch
build timestamp
canonical data SHA-256 hash
canonical file count
canonical record-group counts
generated detail-route counts
```

The same record is embedded in:

```text
/version.json
/data/manifest.json
GitHub build summary
local post-build verification
production verification
```

Relevant files:

```text
data/generated/build-provenance.json
scripts/generate-build-provenance.mjs
scripts/verify-build-provenance.mjs
scripts/check-production-provenance.mjs
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

## Binding repair sequence

Detailed sequence: `docs/ui-redesign/implementation-plan.md`

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

- [x] PR 1 — repair baseline and defect inventory;
- [x] PR 2 — build provenance, after this PR merges;
- [ ] PR 3 — full-route and output parity enforcement;
- [ ] PR 4 — removal of destructive mobile column suppression.

No taxonomy migration, final UI mock, production UI implementation, Batch 18 selection, statistics expansion, or routine publication begins before Gate B passes.

## Immediate next work

```text
1. Merge PR 2 only after every workflow passes.
2. Start PR 3 from the resulting latest main.
3. Enforce list counts, detail-route counts, sitemap coverage, JSON-LD, canonical coverage, version/manifest parity, and stale-output rejection.
4. Make a mixed or partial generated site fail CI.
5. Do not deploy production for PR 2 or PR 3.
6. Do not select Batch 18.
```

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
