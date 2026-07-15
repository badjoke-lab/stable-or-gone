# PR #371 Planning Input Coverage Audit Specification

## Status

This specification governs the first work item approved by merged PR #370.

PR #371 audits profile-input coverage only. It must not change canonical records, public loaders, public output, or any Record Depth baseline.

## Authority

- `AGENTS.md`
- `docs/roadmap.md`
- `docs/roadmap-amendments/2026-07-15-pr370-post-pr369-review-gate.md`
- `docs/migration/post-pr369-review-gate-pr370.json`
- `config/planning-input-coverage-audit-pr371.json`

## Sources

The audit compares:

```text
src/lib/data/currentProfiles.ts
docs/migration/registry-v2-baseline.json
scripts/growth/build-reviewed-record-depth-baseline-pr353.mjs
scripts/build-record-depth-baseline-v2-refresh-pr368.mjs
```

`src/lib/data/stablecoinProfiles.ts` must delegate to `currentProfiles.ts` and must not define a competing profile composition.

## Required audit

PR #371 must deterministically:

1. parse the ordered profile imports from `currentProfiles.ts`;
2. compare them with the legacy `data_groups.profiles` list;
3. verify every referenced JSON file exists and contains rows with non-empty IDs;
4. record row counts and content SHA-256 for every input file;
5. preserve exact import order;
6. reproduce public last-write-wins profile composition;
7. record every duplicate asset ID occurrence;
8. record the winning file and superseded files for every asset;
9. identify files omitted from the default planning input;
10. identify asset IDs missing from or stale in the legacy planning composition;
11. confirm the planning builder's empty default override path;
12. define one complete deterministic planning input manifest for PR #372.

## Expected file boundary

The current reviewed boundary is:

```text
public profile loader files: 29
legacy planning profile files: 15
reviewed overlay files omitted by default planning input: 14
```

These counts must be derived from source and rejected if the source changes without a corresponding audit update.

## Required outputs

- `docs/migration/planning-input-manifest-pr371.json`
- `docs/migration/planning-input-coverage-audit-pr371.json`
- `scripts/build-planning-input-coverage-audit-pr371.mjs`
- `scripts/validate-planning-input-coverage-audit-pr371.mjs`
- `scripts/check-workstream-128.mjs`
- `.github/workflows/pr371-planning-input-coverage-audit.yml`

## Manifest contract

The manifest must contain:

```text
ordered profile files
input role: legacy baseline or reviewed overlay
row count
unique ID count
within-file duplicate count
content SHA-256
asset occurrence count
asset winning file
superseded files
legacy planning winner
missing/stale legacy-planning indicators
```

The manifest order is the public loader import order. Duplicate asset IDs resolve with last-write-wins semantics, matching `currentProfiles.ts`.

## Preservation

PR #371 must preserve byte-for-byte:

- `data/`;
- `src/`, including both public profile loader files;
- `public/`;
- PR #353, #363, #367, #368, #369, and #370 reviewed outputs;
- current canonical and release-integrity checkpoints.

## Explicit non-goals

- no baseline recomputation;
- no corrected queue generation;
- no canonical profile edit;
- no public loader edit;
- no new asset, deployment, Evidence, relationship, or Market Access record;
- no public page or endpoint;
- no ranking, score, recommendation, or automatic promotion;
- no Tier A Dossier Batch 6;
- no Record Growth Batch 2.

## Handoff

On merge, PR #372 may consume the approved manifest and recompute exactly 112 assets × 16 dimensions. PR #372 must preserve all earlier planning checkpoints, change no canonical or public data, emit a corrected non-ranking queue, and stop at another review gate.
