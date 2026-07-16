# Stable or Gone Roadmap

Updated: 2026-07-16  
Status: canonical execution schedule — PR #393 active

Historical roadmap authority through PR #392 remains archived and does not override this file.

## Current position

```text
Canonical stable assets: 112
Organizations: 107
Relationships: 124
Events: 187
Evidence: 559
Evidence Relations: 559
Deployments: 174
Market Access Records: 8
Archive recorded: 416
Archive not recorded: 143

PR #392 Evidence Archive Review-History Contract v4 Update: complete
PR #393 Evidence Archive Maintenance Queue v5 Refresh: active; complete on merge
REVIEW GATE: mandatory after PR #393
```

## Current authority

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-16-pr393-evidence-archive-maintenance-queue-v5-activation.md
docs/quality/evidence-archive-maintenance-queue-v5-pr393-spec.md
config/evidence-archive-maintenance-queue-v5-pr393.json
config/evidence-archive-review-history-v4-pr392.json
docs/migration/evidence-archive-review-history-manifest-v4-pr392.json
docs/migration/evidence-archive-review-history-audit-v4-pr392.json
docs/migration/post-pr390-review-gate-pr391.json
docs/migration/evidence-archive-maintenance-queue-v4-pr388.json
```

## History v4 boundary

```text
History sources / events / identities: 5 / 50 / 48
Archive present / invalid removed / no-safe / replacement: 36 / 1 / 11 / 0
Reviewed unresolved / suppressed / reactivated: 12 / 12 / 0
```

## Queue v5 rule

Queue v5 starts from 143 archive-not-recorded canonical Evidence identities, excludes aliases, Web Archive source URLs, missing source URLs, and twelve reviewed suppressions, then applies the established non-ranking source-priority order. There is no reviewed-reactivated candidate tier.

## Required outputs

```text
docs/migration/evidence-archive-maintenance-queue-v5-pr393.json
docs/migration/evidence-archive-maintenance-queue-v5-pr393-delta.json
```

The outputs remain internal and manual-review-only. History v4, Queue v4, canonical data, checkpoints, statistics, release baselines, and public surfaces remain immutable.

## Deferred and not approved

```text
Evidence and Archive Maintenance Batch 6
Tier A Dossier Deepening Batch 6
Market Access Pilot 3
Record Growth Batch 2
new public page or explorer
asset or Evidence ranking
automatic monitoring promotion
automatic canonical promotion
```

## Next gate

After PR #393, stop at `REVIEW GATE`. Queue v5 authorizes no canonical archive maintenance by itself.
