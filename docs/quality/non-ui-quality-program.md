# Stable or Gone non-UI quality program

Status: canonical implementation plan — active  
Updated: 2026-07-05  
Registry checkpoint: 100 canonical stable assets

## Purpose

This program governs the resumed core workstream after the dedicated UI correction program ended. The active sequence is:

```text
100-record registry-wide audit
-> non-UI release hardening
-> monitoring expansion and scheduled read-only operation
-> statistics implementation
-> controlled growth from 100 to 110
```

The canonical execution order and current PR number are defined by `docs/roadmap.md`.

UI is maintenance-only. A concrete verified UI defect may be corrected through a narrow PR, but UI work is not an active redesign program and must not displace this sequence without an explicit roadmap amendment.

## Current status

```text
Canonical stable assets: 100
Organizations: 94
Events: 172
Evidence: 501
Detail routes: 366
Growth D: complete
100-record production verification: complete
100-record registry-wide audit: active next phase
Monitoring foundation: implemented
Statistics specification: implemented as specification; page and public stats outputs not yet implemented
Growth beyond 100: not yet authorized until candidate audit phase
```

## Required reading order

Before changing canonical data, evidence, monitoring, statistics, workflows, or quality documentation:

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. this document
6. the relevant canonical data, monitoring, or statistics specification
7. `docs/migration/registry-v3-baseline.json`
8. every queue, validator, fixture, baseline, and supporting audit named by the work item

Relevant canonical specifications include:

```text
docs/stable-asset-scope.md
docs/classification-spec.md
docs/data-model-v3-spec.md
docs/stats-spec.md
docs/quality/monitoring-pipeline-spec.md
docs/quality/monitoring-official-source-spec.md
docs/quality/monitoring-official-source-schema.md
docs/quality/monitoring-review-material-spec.md
```

## Fixed operating rules

- Repository specifications remain the source of truth.
- Every non-trivial PR cites the exact queue, audit, schema, fixture, baseline, and validator it changes.
- Unknown values remain unknown unless reviewed evidence supports a canonical value.
- Month- or year-level evidence is not coerced into a day-level date.
- UI work must not clear quality queues through hiding, defaults, or relabeling.
- Candidate monitoring output never writes directly to canonical public data.
- Monitoring baselines are accepted only through a separate human-reviewed repository change.
- Monitoring executions remain read-only and do not update their own baseline.
- An unchanged normalized official source must not create a candidate.
- Metadata-only changes and fetch failures must not masquerade as content changes.
- No growth PR may contain more than two new stable assets.
- Growth must use a fresh branch from current `main` and preserve all applicable record groups.
- Ordinary merged changes publish from `main` under `docs/deployment-policy.md`.

## Completed foundation

```text
PR #217-#225  date, reserve, evidence, and traceability quality
PR #226-#229  deployment quality
PR #230-#245  review-only monitoring foundation and source coverage
PR #246         final-eight candidate audit
PR #247-#250   controlled growth through 98 records, with consumed-number deviations recorded in history
PR #278         rebuilt Growth D to 100 records from current implementation lineage
PR #279-#280   production verification and count-aware closure hardening
PR #284-#295   UI recovery and concrete maintenance fixes; dedicated UI program now stopped
```

Completed monitoring architecture already includes:

```text
official-source observation
-> accepted-baseline comparison
-> change classification
-> private monitoring candidate
-> review material
-> evidence draft
-> draft PR material
-> human approval before any canonical publication
```

The pipeline is review-only. It must not commit, open a pull request, update canonical data, mutate accepted baselines, publish, or deploy automatically.

## Active Phase A — 100-record registry-wide audit

The active audit is split into eight bounded work items defined in `docs/roadmap.md`:

```text
PR #297 identity uniqueness and lineage
PR #298 organization and relationship integrity
PR #299 evidence and source-identity integrity
PR #300 reserve, redemption, and backing applicability
PR #301 deployment and chain identity
PR #302 lifecycle and relationship boundaries
PR #303 known-unknown and placeholder integrity
PR #304 monitoring coverage recalculation for 100 assets
```

An audit result may:

- resolve a value from reviewed evidence;
- preserve a value as unknown;
- record that no reliable official source is available;
- record a bounded unresolved conflict;
- identify a duplicate or lineage issue for separate reviewed correction.

It must not reduce uncertainty by guessing.

## Phase B — non-UI release hardening

```text
PR #305 Registry v2/v3 and machine-readable parity
PR #306 counts, manifest, version, and provenance integrity
PR #307 reproducible build and generated-output audit
PR #308 audited 100-record canonical checkpoint
PR #309 non-UI release material
```

Release material is internal review material and may include:

```text
100-record count summary
change history
quality-audit results
known-unknown inventory
monitoring coverage summary
deployment checklist
rollback checklist
release-note draft
checkpoint commit reference
```

## Phase C — monitoring expansion and operation

```text
PR #310 100-asset monitoring baseline synchronization
PR #311 reserve and redemption source expansion
PR #312 lifecycle and regulatory source expansion
PR #313 bounded scheduled read-only monitoring
```

The scheduled workflow may observe sources and produce private artifacts. It may not perform canonical writes, baseline mutation, branch creation, automatic pull-request creation, publication, or deployment.

## Phase D — statistics implementation

The binding specification is `docs/stats-spec.md`.

```text
PR #314 deterministic stats generator and validator
PR #315 immutable checkpoint history
PR #316 /stats/ foundation
PR #317 historical, deployment, organization, and data-quality statistics
```

Statistics are derived from reviewed canonical data at build time. They are not live price, market-cap, yield, safety, or risk rankings.

## Phase E — controlled growth from 100 to 110

```text
PR #318 next candidate audit
PR #319 100 -> 102
PR #320 102 -> 104
PR #321 104 -> 106
PR #322 106 -> 108
PR #323 108 -> 110
```

Each growth PR contains no more than two new stable assets and must add every applicable supporting record group. Missing information remains explicit rather than inferred.

## Deployment classification

Quality, monitoring, statistics, and growth PRs follow `docs/deployment-policy.md`. Normal merged changes publish from `main`; monitoring execution itself remains read-only and publication-neutral.
