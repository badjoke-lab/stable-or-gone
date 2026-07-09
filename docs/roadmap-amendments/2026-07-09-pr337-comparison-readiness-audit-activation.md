# PR #337 Comparison Readiness audit activation

Status: active roadmap amendment  
Updated: 2026-07-09

## Authoritative current workstream

```text
Phase E controlled growth to 110 assets: complete
PR #336 Comparison Readiness contract and audit method: complete
PR #337 audit all 110 assets for comparison readiness: active
PR #338 normalize comparison-critical gaps and validators: next
```

This amendment activates the all-asset audit authorized by the fixed PR #336 contract.

## Binding inputs

```text
contract: data/quality/comparison-readiness-contract-v1.json
checkpoint: sog_controlled_growth_110_checkpoint_pr335_2026_07_09
asset denominator: 110
dimensions: 19
comparison cells: 2090
```

PR #337 must not change the PR #336 contract while auditing assets. Contract changes require a separate specification and validation change.

## Required outputs

PR #337 must produce:

```text
data/quality/comparison-readiness-audit-pr337.json
scripts/comparison/build-readiness-audit-pr337.mjs
scripts/validate-comparison-readiness-audit-pr337.mjs
```

The audit artifact must include:

- exactly 110 unique canonical asset rows;
- exactly nineteen dimension rows for every asset;
- a categorical overall readiness state for triage;
- per-dimension state counts;
- deterministic normalization queue;
- canonical-only input digest;
- explicit market-access deferred state for all assets;
- no numeric score or ranking.

## Result states

Only the PR #336 states are allowed:

```text
ready
ready_with_unknowns
needs_normalization
integrity_blocked
```

Asset-level categorical precedence is:

```text
integrity_blocked
> needs_normalization
> ready_with_unknowns
> ready
```

This precedence is triage ordering, not a numeric score or asset ranking.

## Normalization queue boundary

The queue contains only dimension results in:

```text
needs_normalization
integrity_blocked
```

Every queue row must include:

```text
asset_id
dimension_id
state
severity
reason_code
```

The queue is input to PR #338. PR #337 must not repair records while generating the audit.

## Market-access boundary

For every one of the 110 assets:

```text
dimension_id: market_access_applicability
state: ready_with_unknowns
readiness_scored: false
reason_code: deferred_canonical_schema
```

The audit may not read monitoring observations, monitoring candidates, news discovery, or editorial research to infer access state.

## Data preservation

PR #337 must not change canonical counts or canonical record contents.

Binding checkpoint remains:

```text
stable assets: 110
organizations: 103
relationships: 120
events: 185
evidence: 543
reserve reports: 118
known unknowns: 319
deployments: 170
legal profiles: 110
reserve components: 143
income profiles: 110
```

## Completion condition

PR #337 completes when:

- deterministic audit builder succeeds;
- exact 110-asset audit artifact is generated and reviewed;
- 2,090 dimension cells are present;
- normalization queue exactly matches all `needs_normalization` and `integrity_blocked` cells;
- summary counts recompute exactly;
- committed artifact equals regeneration byte-for-byte;
- market access remains deferred and unscored for all assets;
- no excluded input source is read;
- no canonical record is modified;
- dedicated workflow and general CI are green.

## Next item

After PR #337 merges, PR #338 is authorized to consume only the reviewed normalization queue and perform bounded comparison-critical normalization. PR #338 may not invent missing facts or create Market Access Records.
