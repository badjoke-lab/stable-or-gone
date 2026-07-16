# Stable or Gone Roadmap

Updated: 2026-07-16  
Status: canonical execution schedule — PR #390 active

Historical roadmap authority through PR #389 remains archived and does not override this file.

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
Archive recorded before PR #390: 406
Archive not recorded before PR #390: 153
Archive recorded: 416
Archive not recorded: 143
Archive recorded after reviewed decisions: 416
Archive not recorded after reviewed decisions: 143

PR #389 Post-PR #388 Review Gate: complete
PR #390 Evidence and Archive Maintenance Batch 5: active; complete on merge
REVIEW GATE: mandatory after PR #390
```

## Current authority

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-16-pr390-evidence-archive-maintenance-batch-5-activation.md
docs/quality/evidence-archive-maintenance-batch-5-pr390-spec.md
config/evidence-archive-maintenance-batch-5-pr390.json
config/evidence-archive-maintenance-batch-5-pr390-decisions.json
docs/migration/post-pr388-review-gate-pr389.json
docs/migration/evidence-archive-maintenance-queue-v4-pr388.json
docs/migration/evidence-archive-maintenance-queue-v4-pr388-delta.json
docs/migration/evidence-archive-maintenance-batch-5-pr390-review-queue.json
```

## Reviewed Batch 5 result

```text
Selected: 10
Changed: 10
Dated exact archives added: 10
Reviewed source replacements: 0
Reviewed no-safe-change: 0
Archive coverage transition: 406 / 153 -> 416 / 143
Evidence identities / relations: 559 / 559
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

Each accepted archive uses a reviewed HTTP 200 capture for the exact canonical source URL. The only canonical field changed on each selected row is `archived_url`.

## Required outputs

```text
docs/migration/evidence-archive-maintenance-batch-5-pr390-review-queue.json
docs/migration/evidence-archive-maintenance-outcomes-pr390.json
docs/migration/evidence-archive-maintenance-batch-5-pr390-reviewed-handoff.json
docs/migration/current-canonical-checkpoint.json
docs/migration/current-stats-history-checkpoint.json
data/stats-history.json
docs/migration/registry-release-integrity-baseline.json
```

Canonical identity counts, Evidence Relations, assets, deployments, Market Access records, non-Evidence record families, and public surfaces must remain unchanged.

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

After PR #390, stop at `REVIEW GATE`. No later archive batch or other canonical expansion is authorized until the Batch 5 outcomes are reviewed.
