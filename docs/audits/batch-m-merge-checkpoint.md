# Batch M Merge Checkpoint

Recorded: 2026-06-22

PR #93 merged as `cd745f315d2b0f935fc2288c2e118f6905e087b6`.

## Result

- Canonical stable assets: 75 to 80
- Promoted: GYD, fxUSD, HONEY, MAI, and Stables Labs USDX
- Candidate controls: 80 promoted, 0 pending
- Critical findings: 0
- Warnings: 0

## Final validation

All required checks passed on head `a52cd75cfbf0d2cce52ed5c7c244ba3d2947d873`:

- CI
- Registry integrity
- Public consistency
- Registry stats
- Registry v3 view
- Registry v3 income profiles

## Current counts

```text
stablecoins 80
organizations 69
relationships 82
events 107
evidence 327
reserve reports 87
known unknowns 188
deployments 111
legal profiles 80
reserve components 112
income profiles 80
```

## Remaining queues

```text
launch dates 38
terminal dates 6
reserve applicability 13
reserve context 67 of 80
```

No production publication was executed. Production parity remains pending until access is available again. GitHub-only quality work may continue, but growth from 80 to 85 remains blocked until parity passes.
