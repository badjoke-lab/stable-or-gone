# Roadmap Amendment — PR #371 Planning Input Coverage Audit

Date: 2026-07-15  
Status: active; complete on merge

## Authority source

Merged PR #370 approved exactly:

```text
PR #371 Planning Input Coverage Audit
PR #372 Record Depth Baseline v2.1 Refresh
REVIEW GATE
```

## Exact scope

PR #371 audits whether the planning builder consumes the same reviewed profile composition as the public profile loader.

Current source boundary:

```text
public loader: src/lib/data/currentProfiles.ts
legacy planning list: docs/migration/registry-v2-baseline.json data_groups.profiles
planning builder: scripts/growth/build-reviewed-record-depth-baseline-pr353.mjs
v2 refresh builder: scripts/build-record-depth-baseline-v2-refresh-pr368.mjs
```

## Expected finding

```text
public profile input files: 29
legacy planning profile files: 15
reviewed overlay files omitted from default planning input: 14
```

The audit must derive and validate these values rather than relying on prose.

## Required outputs

```text
docs/migration/planning-input-manifest-pr371.json
docs/migration/planning-input-coverage-audit-pr371.json
```

The manifest must preserve exact public-loader order and last-write-wins composition semantics.

## Preservation

PR #371 changes no canonical data, public loader, public page, public machine-readable output, baseline, or queue. It records only internal audit, manifest, authority, validation, and workflow material.

## Next authority

After PR #371 merges:

```text
PR #372 Record Depth Baseline v2.1 Refresh
```

PR #372 must use the approved manifest, recompute 112 assets × 16 dimensions, preserve historical planning checkpoints, emit a corrected non-ranking queue, and stop at a review gate.

## Not approved

```text
Tier A Dossier Deepening Batch 6
Evidence and Archive Maintenance Batch 3
Market Access Pilot 3
Record Growth Batch 2
new canonical asset
new deployment family
new public page or explorer
ranking or composite score
automatic monitoring promotion
automatic canonical promotion
```
