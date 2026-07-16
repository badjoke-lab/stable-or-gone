# Stable or Gone Roadmap

Updated: 2026-07-16  
Status: canonical execution schedule — PR #385 active

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

PR #384 Post-PR #383 Review Gate: complete
PR #385 Evidence and Archive Maintenance Batch 4: active; complete on merge
REVIEW GATE: mandatory after PR #385
```

## Current authority

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-16-pr385-evidence-archive-maintenance-batch-4-activation.md
docs/quality/evidence-archive-maintenance-batch-4-pr385-spec.md
config/evidence-archive-maintenance-batch-4-pr385.json
config/evidence-archive-maintenance-batch-4-pr385-decisions.json
docs/migration/post-pr383-review-gate-pr384.json
docs/migration/evidence-archive-maintenance-queue-v3-pr383.json
docs/migration/evidence-archive-maintenance-batch-4-pr385-review-queue.json
```

## Reviewed Batch 4 result

Before boundary:

```text
Archive recorded before PR #385: 399
Archive not recorded before PR #385: 160
```

Reviewed result:

```text
Selected: 10
Changed: 8
Dated exact archives added: 7
Reviewed source replacements: 1
Reviewed no-safe-change: 2
Archive recorded: 399 → 406
Archive not recorded: 160 → 153
Evidence identities: 559
Evidence Relations: 559
```

Accepted archive additions:

```text
sog_src_eurc_mint_page
sog_src_fdusd_official_site
sog_src_fei_final_redemption_batch_a
sog_src_fei_intro_batch_a
sog_src_fei_launch_batch_a
sog_src_fei_v2_batch_a
sog_src_frax_app
```

Reviewed source replacement:

```text
sog_src_fdusd_site
https://firstdigitallabs.com/fdusd/ → https://www.firstdigitallabs.com/fdusd
```

Reviewed no-safe-change:

```text
sog_src_fei_addresses_batch_a
sog_src_fei_tip121c_execution_2022
```

Every archive addition is backed by the reviewed exact-source probe timestamp and digest. The FDUSD replacement is the successful current issuer/product route with reviewed claim-scope equivalence. The two no-safe-change identities remain unchanged.

## Required outputs

```text
docs/migration/evidence-archive-maintenance-batch-4-pr385-review-queue.json
docs/migration/evidence-archive-maintenance-outcomes-pr385.json
docs/migration/evidence-archive-maintenance-batch-4-pr385-reviewed-handoff.json
docs/migration/current-canonical-checkpoint.json
docs/migration/current-stats-history-checkpoint.json
data/stats-history.json
docs/migration/registry-release-integrity-baseline.json
```

Canonical identity counts, Evidence Relations, assets, deployments, Market Access records, non-Evidence record families, and public surfaces remain unchanged.

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

After PR #385, stop at `REVIEW GATE`. No later archive batch or other canonical expansion is authorized until the Batch 4 outcomes are reviewed.