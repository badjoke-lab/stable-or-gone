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
docs/migration/evidence-archive-maintenance-queue-v4-pr388.json
docs/migration/evidence-archive-maintenance-queue-v4-pr388-delta.json
```

## Reviewed Queue v4 result

```text
Eligible pool: 108
Selected: 10
Reviewed suppressed excluded: 12
Reviewed reactivated selected: 1
Added versus Queue v3: 9
Removed versus Queue v3: 9
Retained versus Queue v3: 1
```

Selected Evidence identities:

```text
sog_src_fdusd_site
sog_src_frax_docs
sog_src_frax_docs_frax
sog_src_frax_official_site
sog_src_gho_bridge_batch_c
sog_src_gho_facilitators_batch_c
sog_src_gho_gsm_batch_c
sog_src_gho_launch_batch_c
sog_src_gusd_gemini_official
sog_src_lusd_liquity_docs
```

`sog_src_fdusd_site` is the sole reviewed-reactivated identity, remains archive-not-recorded, and is selection tier 0. The remaining nine identities are ordinary unreviewed archive gaps. Every selected row remains pending manual review and authorizes no canonical change.

## Selection rule

Queue v4 starts from 153 archive-not-recorded Evidence identities, excludes aliases, Web Archive source URLs, missing source URLs, and all twelve History v3 suppressions, then uses:

```text
reviewed-reactivated tier
regulator / court / legal
official issuer / protocol / product
reserve / attestation / audit
high-quality reporting / research
other reviewed source
Evidence ID tie-break
```

## Required outputs

```text
docs/migration/evidence-archive-maintenance-queue-v4-pr388.json
docs/migration/evidence-archive-maintenance-queue-v4-pr388-delta.json
```

The outputs remain internal and manual-review-only. Queue v3, History v3, and all canonical/release inputs remain immutable.

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