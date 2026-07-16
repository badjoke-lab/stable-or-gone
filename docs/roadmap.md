# Stable or Gone Roadmap

Updated: 2026-07-16  
Status: canonical execution schedule — PR #388 active

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
Archive recorded: 406
Archive not recorded: 153

PR #387 Evidence Archive Review-History Contract v3 Update: complete
PR #388 Evidence Archive Maintenance Queue v4 Refresh: active; complete on merge
REVIEW GATE: mandatory after PR #388
```

## Current authority

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-16-pr388-evidence-archive-maintenance-queue-v4-activation.md
docs/quality/evidence-archive-maintenance-queue-v4-pr388-spec.md
config/evidence-archive-maintenance-queue-v4-pr388.json
config/evidence-archive-review-history-v3-pr387.json
docs/migration/evidence-archive-review-history-manifest-v3-pr387.json
docs/migration/evidence-archive-review-history-audit-v3-pr387.json
docs/migration/post-pr385-review-gate-pr386.json
docs/migration/evidence-archive-maintenance-queue-v3-pr383.json
```

## Queue v4 objective

PR #388 must start from 153 archive-not-recorded Evidence identities and apply the reviewed History v3 eligibility contract.

History v3 inventory:

```text
history sources: 4
history events: 40
reviewed Evidence identities: 39
archive present: 26
invalid archive removed: 1
reviewed no-safe-change: 11
reviewed source replacement: 1
reviewed unresolved total: 13
reviewed unresolved suppressed: 12
reviewed reactivated eligible: 1
```

The twelve reviewed suppressed identities remain excluded. `sog_src_fdusd_site` is the sole reviewed-reactivated identity and must be selected before ordinary unreviewed archive gaps.

After that reviewed-reactivated tier, Queue v4 preserves the existing deterministic non-ranking priority order:

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
docs/migration/evidence-archive-maintenance-queue-v4-pr388.json
docs/migration/evidence-archive-maintenance-queue-v4-pr388-delta.json
```

The outputs remain internal and manual-review-only. Queue v3 and delta are immutable historical inputs.

## Deferred and not approved

```text
Evidence and Archive Maintenance Batch 5
Tier A Dossier Deepening Batch 6
Market Access Pilot 3
Record Growth Batch 2
new public page or explorer
asset or Evidence ranking
automatic monitoring promotion
automatic canonical promotion
```

## Next gate

After PR #388, stop at `REVIEW GATE`. No canonical archive work or other expansion is authorized until the fresh Queue v4 and delta are reviewed.