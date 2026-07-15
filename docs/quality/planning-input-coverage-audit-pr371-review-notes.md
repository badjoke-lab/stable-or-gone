# PR #371 Planning Input Coverage Review Notes

Date: 2026-07-15

## Audited composition

The current public profile composition is defined by `src/lib/data/currentProfiles.ts` and resolves duplicate asset IDs with last-write-wins semantics.

The legacy planning composition is defined by `docs/migration/registry-v2-baseline.json` under `data_groups.profiles`.

## Expected source-derived difference

```text
public loader files: 29
legacy planning files: 15
reviewed overlays omitted by default planning input: 14
```

The generated manifest must record exact import order, file hashes, row counts, duplicate occurrences, winning files, superseded files, and affected asset IDs.

## Handoff

PR #372 must use the approved manifest directly. It may not reconstruct an ad hoc profile list or rewrite earlier planning checkpoints.
