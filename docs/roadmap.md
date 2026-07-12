# Stable or Gone Roadmap

Updated: 2026-07-12  
Status: canonical execution schedule — active

## 1. Current position

```text
Canonical stable assets: 110
PR #351 Monthly Maintenance Log: complete
current public-surface expansion sequence: complete
PR #352 post-351 authority reset: complete
PR #353 Record Depth & Coverage Baseline: complete
PR #354 Tier A Dossier Deepening — Batch 1: complete
PR #355 Tier A Dossier Deepening — Batch 2: complete
PR #356 Market Access Pilot 1: active
PR #357 Tier A Dossier Deepening — Batch 3: next
```

The current operating mode is:

```text
reviewed data depth and record growth
canonical Market Access promotion
monitoring review without automatic promotion
corrections and evidence maintenance
monthly maintenance
```

A new public-surface sequence requires a separate reviewed roadmap amendment and canonical specification.

## 2. Current authority

Read in this order:

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-10-post-351-data-growth-activation.md
docs/roadmap-amendments/2026-07-10-pr353-record-depth-baseline-activation.md
docs/roadmap-amendments/2026-07-10-pr354-tier-a-batch-1-activation.md
docs/roadmap-amendments/2026-07-12-pr355-tier-a-batch-2-activation.md
docs/roadmap-amendments/2026-07-12-pr356-market-access-pilot-1-activation.md
docs/quality/market-access-pilot-1-pr356-spec.md
docs/market-access-record-spec.md
config/market-access-pilot-1-pr356.json
docs/migration/tier-a-batch-2-pr355-reviewed-handoff.json
data/editorial-research/japan-stablecoin-market-access-2026.json
docs/migration/record-depth-baseline-pr353-summary.json
docs/migration/tier-a-candidate-queue-pr353.json
docs/migration/tier-a-batch-1-pr354-reviewed-handoff.json
named validators, audits, and current work-item outputs
```

Earlier amendments remain historical records and do not override this current position.

## 3. Completed program through PR #355

Completed broad programs include:

```text
core integrity and lineage audits
EU/EEA market-access research and guide work
release integrity and reproducible-build hardening
audited 100-asset checkpoint
monitoring baseline synchronization and source expansion
bounded scheduled read-only monitoring
deterministic statistics and immutable history
controlled growth from 100 to 110 assets
Comparison Readiness and normalization
canonical Market Access schema and governance
facet freshness derivation
machine-readable comparison projection
Compare UI and presets
Access & Regulation Explorer
Change Timeline projection and UI
Update Feed
Monthly Maintenance Log
post-351 authority reset
Record Depth & Coverage Baseline
reviewed 18-asset Tier A candidate queue
Tier A Dossier Deepening — Batch 1
Tier A Dossier Deepening — Batch 2
```

PR #354 completed reviewed dossier deepening for:

```text
BUSD   legal_profile, redemption
DAI    legal_profile
RLUSD  legal_profile, redemption
USDC   legal_profile
USDT   legal_profile
```

Its reviewed handoff is:

```text
docs/migration/tier-a-batch-1-pr354-reviewed-handoff.json
```

Current reviewed canonical checkpoint after PR #356:

```text
110 stable assets
551 evidence records
551 evidence relations
110 legal profiles
4 canonical Market Access Records
```

Historical checkpoints remain immutable. Do not rewrite them because current canonical data deepens.

## 4. Current bounded sequence

```text
PR #352  post-351 authority reset and specification/schedule synchronization — complete
PR #353  Record Depth & Coverage Baseline — complete
PR #354  Tier A Dossier Deepening — Batch 1 — complete
PR #355  Tier A Dossier Deepening — Batch 2 — complete
PR #356  Market Access Pilot 1 — active
PR #357  Tier A Dossier Deepening — Batch 3 — next
PR #358  Record Growth Batch 1
PR #359  Market Access Pilot 2
PR #360  Evidence and Correction Batch
REVIEW GATE
```

No PR number after the review gate is pre-authorized by this roadmap.

## 5. PR #353 historical planning foundation — complete and immutable

PR #353 reviewed all 110 canonical assets across 16 planning dimensions and committed:

```text
docs/migration/record-depth-baseline-pr353-summary.json
docs/migration/tier-a-candidate-queue-pr353.json
```

The reviewed summary binds:

```text
110 assets
16 dimensions
1,760 planning cells
strong: 589
usable: 687
partial: 267
sparse: 0
absent: 217
not_applicable: 0
```

The reviewed Tier A queue binds 18 candidates in deterministic non-ranking slug order.

These files remain historical planning checkpoints. Later work may recompute current planning state but must not rewrite them.

## 6. PR #354 Tier A Dossier Batch 1 — complete

Binding historical references:

```text
docs/roadmap-amendments/2026-07-10-pr354-tier-a-batch-1-activation.md
docs/quality/tier-a-dossier-batch-1-pr354-spec.md
config/tier-a-dossier-batch-1-pr354.json
docs/migration/tier-a-batch-1-pr354-reviewed-handoff.json
```

Completed assets must not be selected again in PR #355:

```text
busd
dai
rlusd
usdc
usdt
```

PR #354 added no canonical asset, no Market Access Record, no ranking, and no public product surface.

## 7. PR #355 — Tier A Dossier Deepening — Batch 2 — complete

Binding reviewed handoff:

```text
docs/migration/tier-a-batch-2-pr355-reviewed-handoff.json
```

PR #355 completed reviewed deepening for FDUSD, FRAX, PYUSD, USDP, and UST. It preserved 110 assets, advanced Evidence and Evidence Relations to 549, and left canonical Market Access at zero records.

## 8. PR #356 — Market Access Pilot 1 — active

Binding references:

```text
docs/roadmap-amendments/2026-07-12-pr356-market-access-pilot-1-activation.md
docs/quality/market-access-pilot-1-pr356-spec.md
config/market-access-pilot-1-pr356.json
docs/market-access-record-spec.md
schemas/market-access-record-v1.schema.json
config/market-access-governance-v1.json
data/editorial-research/japan-stablecoin-market-access-2026.json
docs/migration/tier-a-batch-2-pr355-reviewed-handoff.json
```

Exact bounded scope:

```text
jurisdiction: JP / Japan
asset: USDC / sog_st_usdc
platform: SBI VC Trade
service: VCTRADE
functions: buy_sell, deposit, withdrawal, external_wallet_transfer
maximum canonical records: 4
effective_from: 2025-03-26
review cutoff: 2026-07-10
```

The pilot first audits canonical Evidence identity and function-specific claim scope. Editorial research remains noncanonical. RLUSD, JPYSC, direct issuer mint, and direct issuer redemption are outside Pilot 1.

Completion requires reviewed canonical Evidence mappings, no more than four supported function-scoped records, deterministic validation, green CI, and a PR #356 reviewed handoff.

## 9. PR #357 — Tier A Dossier Deepening — Batch 3

PR #357 must select from remaining reviewed PR #353 queue members after reading:

```text
PR #353 immutable snapshots
PR #354 reviewed handoff
PR #355 reviewed post-change handoff
current recomputed planning state
```

Each Tier A batch normally covers no more than five existing assets.

A dossier batch may deepen:

```text
identity and lineage
organization relationships
lifecycle history
reserve and backing structure
issuance and redemption
deployments
legal profiles
regulatory notes
events
evidence relations
known unknowns
```

Dossier batches do not add new canonical assets unless explicitly approved as combined growth work.

## 10. PR #358 — Record Growth Batch 1

This PR returns to broader evidence-backed registry growth.

If new canonical stable assets are added:

```text
maximum two new canonical stable assets per growth PR
```

Supporting record groups must be preserved as applicable.

## 11. PR #359 — Market Access Pilot 2

PR #359 may expand only after reviewing Pilot 1 scope, evidence burden, correction burden, and public utility.

No automatic promotion from monitoring or editorial research is allowed.

## 12. PR #360 — Evidence and Correction Batch

Priority work:

```text
broken-link repair
archive supplementation
official-source replacement
evidence relation correction
evidence source identity maintenance
record wording correction
date correction
organization relationship correction
known-unknown resolution
```

Registry quality is not measured only by asset count.

## 13. Review gate after PR #360

Review:

```text
record families that remain sparse
Tier A dossier depth improvement
Compare utility improvement
Timeline historical density
canonical Market Access utility
monitoring signal usefulness
correction and source-maintenance burden
monthly maintenance burden
external usage or referral evidence when available
```

Only then define the next bounded sequence.

## 14. Parallel operating lanes

### Data depth and growth

Deepen existing records and add new canonical assets only through reviewed evidence-backed PRs.

### Market Access

Promote only bounded evidence-backed access claims through manual review.

### Monitoring

Monitoring remains private, review-only, and read-only with respect to canonical data.

### Corrections and evidence maintenance

Broken links, archives, evidence relations, source identities, dates, relationships, wording, and known unknowns are continuing work.

### Monthly maintenance

The current month may remain `in_progress` until month-end review. Closed months are immutable and history grows append-only.

## 15. Product-surface policy

The existing public product set is sufficient for the current operating phase.

Normal work should improve the data that powers:

```text
Registry records
Stats
Compare
Access & Regulation Explorer
Change Timeline
Update Feed
Maintenance Log
machine-readable projections
```

New pages, explorers, dashboards, ranking surfaces, or navigation families are not automatically approved.

Small correctness, accessibility, readability, broken-link, and maintenance fixes remain allowed.

## 16. Core data rules

- Unknown values remain unknown unless reviewed evidence supports a value.
- Do not coerce partial dates into day-level dates.
- Preserve evidence relations, known unknowns, deployments, source identities, and value states.
- Candidate, monitoring, editorial-research, discovery, and private material remain outside canonical public release claims.
- Monitoring observations are not canonical Market Access Records.
- A platform licence is not proof of asset/function availability.
- Comparison Readiness remains separate from value truth and facet freshness.
- Record Depth planning states remain internal planning coverage states and do not replace canonical facts, Readiness, or Freshness.
- Timeline date semantics remain separate from review and freshness dates.
- Update Feed publication dates remain separate from historical subject dates.
- Maintenance Log remains aggregate-only and public-safe.
- SOG does not create composite asset risk scores or rankings.

Protected unresolved states include:

```text
null
unknown
not_recorded
not_applicable
source_review_needed
```

## 17. Mandatory pre-implementation check

Before every non-trivial post-351 PR:

1. read the repository authority chain;
2. confirm the active roadmap item;
3. read the work-item specification;
4. read named inputs and prior outputs;
5. state scope and non-goals;
6. state data-preservation checks;
7. state validation plan;
8. confirm deployment classification.

A PR that cannot cite an approved roadmap item and governing specification must pause until repository authority is corrected.
