# Stable or Gone Roadmap

Updated: 2026-07-16  
Status: canonical execution schedule — PR #384 review gate active

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

PR #383 Evidence Archive Maintenance Queue v3 Refresh: complete
PR #384 Post-PR #383 Review Gate: active; complete on merge
PR #385 Evidence and Archive Maintenance Batch 4: approved next
REVIEW GATE: mandatory after PR #385
```

## Current authority

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-16-pr384-post-pr383-review-gate.md
docs/quality/post-pr383-review-gate-pr384-spec.md
config/post-pr383-review-gate-pr384.json
docs/migration/evidence-archive-maintenance-queue-v3-pr383.json
docs/migration/evidence-archive-maintenance-queue-v3-pr383-delta.json
config/evidence-archive-review-history-v2-pr382.json
docs/migration/evidence-archive-review-history-manifest-v2-pr382.json
docs/migration/evidence-archive-review-history-audit-v2-pr382.json
```

## Completed Queue v3 result

```text
Eligible pool: 117
Selected: 10
Reviewed suppressed excluded: 10
Reviewed reactivated selected: 1
Added versus Queue v2: 9
Removed versus Queue v2: 9
Retained versus Queue v2: 1
```

Selected Evidence identities:

```text
sog_src_eurc_mint_page
sog_src_fdusd_official_site
sog_src_fdusd_site
sog_src_fei_addresses_batch_a
sog_src_fei_final_redemption_batch_a
sog_src_fei_intro_batch_a
sog_src_fei_launch_batch_a
sog_src_fei_tip121c_execution_2022
sog_src_fei_v2_batch_a
sog_src_frax_app
```

The selected Circle Mint record is the sole reviewed-reactivated identity. The remaining nine are fresh unreviewed archive gaps. Every row remains pending manual review and authorizes no automatic change.

## Approved next sequence

```text
PR #385 Evidence and Archive Maintenance Batch 4
REVIEW GATE
```

PR #385 may review exactly the ten Queue v3 identities. Allowed outcomes are:

```text
dated_exact_archive_added
reviewed_source_replacement
reviewed_no_safe_change
```

A canonical change is allowed only after an exact-source capture is verified or a replacement source is reviewed for publisher/product identity and claim-scope equivalence. No candidate is presumed to change.

PR #385 must update `AGENTS.md` and this roadmap before changing canonical Evidence.

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

After PR #385, stop at `REVIEW GATE`. No further archive batch or other canonical expansion is authorized until the Batch 4 outcomes are reviewed.