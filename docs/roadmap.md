# Stable or Gone Roadmap

Updated: 2026-07-16  
Status: canonical execution schedule — PR #395 active

Historical roadmap authority through PR #394 remains archived and does not override this file.

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
Archive recorded before PR #395: 416
Archive not recorded before PR #395: 143
Archive recorded: 425
Archive not recorded: 134
Archive recorded after reviewed decisions: 425
Archive not recorded after reviewed decisions: 134

PR #394 Post-PR #393 Review Gate: complete
PR #395 Evidence and Archive Maintenance Batch 6: active; complete on merge
REVIEW GATE: mandatory after PR #395
```

## Current authority

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-16-pr395-evidence-archive-maintenance-batch-6-activation.md
docs/quality/evidence-archive-maintenance-batch-6-pr395-spec.md
config/evidence-archive-maintenance-batch-6-pr395.json
config/evidence-archive-maintenance-batch-6-pr395-decisions.json
docs/migration/post-pr393-review-gate-pr394.json
docs/migration/evidence-archive-maintenance-queue-v5-pr393.json
docs/migration/evidence-archive-maintenance-queue-v5-pr393-delta.json
docs/migration/evidence-archive-maintenance-batch-6-pr395-review-queue.json
```

## Reviewed Batch 6 result

```text
Selected: 10
Changed: 9
Dated exact archives added: 9
Reviewed source replacements: 0
Reviewed no-safe-change: 1
Archive coverage transition: 416 / 143 -> 425 / 134
Evidence identities / relations: 559 / 559
```

`sog_src_makerdao_docs_dai` remains unchanged because the canonical route has no exact archive and redirects to a legal-document page that does not safely preserve its Dai documentation claim scope. The other nine selected identities receive exact dated archives.

Selected Evidence identities:

```text
sog_src_makerdao_docs_dai
sog_src_makerdao_forum_lifecycle_reference
sog_src_mim_2025_postmortem_batch_a
sog_src_mim_docs_batch_a
sog_src_mim_tokenomics_batch_a
sog_src_mstable_withdrawal_batch_d
sog_src_nuon_contracts_batch_b
sog_src_nuon_guarded_launch_batch_b
sog_src_nuon_maxcap_batch_b
sog_src_nuon_minting_batch_b
```

## Required outputs

```text
docs/migration/evidence-archive-maintenance-batch-6-pr395-review-queue.json
docs/migration/evidence-archive-maintenance-outcomes-pr395.json
docs/migration/evidence-archive-maintenance-batch-6-pr395-reviewed-handoff.json
docs/migration/current-canonical-checkpoint.json
docs/migration/current-stats-history-checkpoint.json
data/stats-history.json
docs/migration/registry-release-integrity-baseline.json
```

Canonical identity counts, Evidence Relations, assets, deployments, Market Access records, non-Evidence record families, and public surfaces must remain unchanged.

## Deferred and not approved

```text
Evidence and Archive Maintenance Batch 7
Tier A Dossier Deepening Batch 6
Market Access Pilot 3
Record Growth Batch 2
new public page or explorer
asset or Evidence ranking
automatic monitoring promotion
automatic canonical promotion
```

## Next gate

After PR #395, stop at `REVIEW GATE`. No later archive batch or other canonical expansion is authorized before that review.
