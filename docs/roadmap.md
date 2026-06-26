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
Current phase: Phase 1 — emergency production-integrity repair
Latest completed repair item after this PR merges: PR 3 — full-route and output parity enforcement
Next approved work item: PR 4 — remove destructive mobile column suppression
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

## Repair controls now present

### Repair baseline

```text
docs/ui-redesign/repair-baseline.json
docs/audits/ui-repair-baseline-2026-06-26.md
scripts/validate-ui-repair-baseline.mjs
```

The baseline fixes canonical counts, 328 expected detail routes, the 2026-06-26 split-generation production snapshot, sixteen defect IDs, and twenty representative records.

### Build provenance

```text
data/generated/build-provenance.json
scripts/generate-build-provenance.mjs
scripts/verify-build-provenance.mjs
scripts/check-production-provenance.mjs
```

Every full build identifies one source commit, source branch, timestamp, canonical SHA-256 data hash, canonical file count, record-group counts, and route counts. The same object appears in `version.json` and `data/manifest.json`.

### Full output parity

After PR 3 merges, CI rejects any difference between canonical record identity sets and:

```text
stablecoin index links
organization index links
event index links
generated detail directories
sitemap detail URLs
per-page canonical URLs
per-page JSON-LD URLs
version and manifest provenance
```

Relevant files:

```text
scripts/verify-full-output-parity.mjs
scripts/check-production-output-parity.mjs
dist/data/output-parity.json
```

The local verifier checks all 328 detail pages. The production verifier checks the exact canonical sets and every detail page at the deployed origin.

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

Gate B requires:

- [x] PR 1 — repair baseline and defect inventory;
- [x] PR 2 — build provenance;
- [x] PR 3 — full-route and output parity enforcement, after this PR merges;
- [ ] PR 4 — removal of destructive mobile column suppression.

No taxonomy migration, final UI mock, production UI implementation, Batch 18 selection, statistics expansion, or routine publication begins before Gate B passes.

## Immediate next work

```text
1. Merge PR 3 only after every workflow passes.
2. Start PR 4 from the resulting latest main.
3. Remove the global fifth-column suppression rule.
4. Add explicit table identities and temporary information-preserving mobile behavior.
5. Verify that peg, impact, relationship status, confidence, summary, and control capability never disappear by generic column position.
6. Do not deploy production for PR 3 or PR 4.
7. Do not select Batch 18.
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
