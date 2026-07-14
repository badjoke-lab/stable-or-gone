# PR #360 Evidence and Correction Batch Activation

Status: active roadmap amendment  
Date: 2026-07-14

## 1. Activation

PR #359 Market Access Pilot 2 is complete and merged at:

```text
043faab38160d693fb226c2955e2b6062d56946f
```

Its reviewed handoff is:

```text
docs/migration/market-access-pilot-2-pr359-reviewed-handoff.json
```

The active work item is now:

```text
PR #360 Evidence and Correction Batch: active
post-PR #360 review gate: next
```

## 2. Governing references

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-14-pr360-evidence-correction-batch-activation.md
docs/quality/evidence-correction-batch-pr360-spec.md
config/evidence-correction-batch-pr360.json
docs/migration/market-access-pilot-2-pr359-reviewed-handoff.json
```

## 3. Starting boundary

```text
canonical assets: 112
canonical Evidence: 557
Evidence Relations: 557
archive indexes recorded: 380
archive not recorded: 177
Market Access Records: 8
```

## 4. Bounded batch

```text
maximum canonical Evidence records touched: 10
maximum non-Evidence canonical corrections: 5
new assets: 0
Market Access changes: 0
new public surfaces: 0
```

## 5. Sequence

```text
1. bind the reviewed PR #359 handoff
2. generate the deterministic internal correction queue
3. review source identity, live URL, archive, subject relation, wording, date, and organization-role state
4. commit only evidence-supported corrections
5. record reviewed-no-change outcomes
6. generate deterministic correction and impact reports
7. synchronize checkpoints and statistics only when canonical content changes
8. validate and merge
9. run the post-PR #360 review gate
```

## 6. Boundaries

PR #360 must not:

```text
add a canonical stable asset
change a Market Access Record
rewrite a historical checkpoint
invent date precision
resolve an unknown without reviewed Evidence
replace a historical source with a less specific current page
publish internal queue or review notes
add a ranking, score, dashboard, explorer, or navigation family
automatically promote monitoring or editorial research
```
