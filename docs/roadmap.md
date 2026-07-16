# Stable or Gone Roadmap

Updated: 2026-07-16  
Status: canonical execution schedule — PR #383 active

Historical roadmap authority through PR #366 remains archived and does not override this file.

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
Archive recorded: 399
Archive not recorded: 160

PR #381 Post-PR #380 Review Gate: complete
PR #382 Evidence Archive Review-History Contract v2 Update: complete
PR #383 Evidence Archive Maintenance Queue v3 Refresh: active; complete on merge
REVIEW GATE: mandatory after PR #383
```

## Current authority

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-16-pr383-evidence-archive-maintenance-queue-v3-activation.md
docs/quality/evidence-archive-maintenance-queue-v3-pr383-spec.md
config/evidence-archive-maintenance-queue-v3-pr383.json
docs/migration/post-pr380-review-gate-pr381.json
config/evidence-archive-review-history-v2-pr382.json
docs/migration/evidence-archive-review-history-manifest-v2-pr382.json
docs/migration/evidence-archive-review-history-audit-v2-pr382.json
```

## Approved bounded sequence

```text
PR #382 Evidence Archive Review-History Contract v2 Update — complete
PR #383 Evidence Archive Maintenance Queue v3 Refresh — active
REVIEW GATE
```

## Queue v3 objective

PR #383 must start from 160 archive-not-recorded Evidence identities and apply the reviewed PR #382 history v2 eligibility contract.

History v2 inventory:

```text
history sources: 3
history events: 30
reviewed Evidence identities: 30
archive present: 19
invalid archive removed: 1
reviewed no-safe-change: 9
reviewed source replacement: 1
reviewed unresolved total: 11
reviewed unresolved suppressed: 10
reviewed reactivated eligible: 1
```

The ten reviewed suppressed identities remain excluded. `sog_src_eurc_mint_page` is the sole reviewed reactivated identity and must be selected for fresh manual archive review before ordinary unreviewed archive gaps.

After that reviewed-reactivated tier, the queue preserves the existing deterministic non-ranking priority order:

```text
regulator / court / legal
official issuer / protocol / product
reserve / attestation / audit
high-quality reporting / research
other reviewed source
```

Ties use Evidence ID. The queue selects at most ten identities and authorizes no canonical change.

## Required outputs

```text
docs/migration/evidence-archive-maintenance-queue-v3-pr383.json
docs/migration/evidence-archive-maintenance-queue-v3-pr383-delta.json
```

The outputs remain internal and manual-review-only. PR #378 queue and delta are immutable historical inputs.

## Deferred and not approved

```text
Evidence and Archive Maintenance Batch 4
Tier A Dossier Deepening Batch 6
Market Access Pilot 3
Record Growth Batch 2
new public page or explorer
asset or Evidence ranking
automatic monitoring promotion
automatic canonical promotion
```

## Next gate

After PR #383, stop at `REVIEW GATE`. No canonical archive work is authorized until the fresh v3 queue and delta are reviewed.