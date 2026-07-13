# Stable or Gone Agent Instructions

This file is the mandatory entry point for humans, AI agents, and automation working in this repository.

## 1. Required reading order

Before changing code, canonical data, workflows, monitoring, or documentation, read in this order:

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. `docs/post-351-data-growth-operating-spec.md`
6. every active roadmap amendment named by the roadmap
7. the canonical specification for the active work item
8. every named baseline, queue, validator, audit, fixture, research checkpoint, release note, or prior output required by that work item

Current active amendments:

```text
docs/roadmap-amendments/2026-07-10-post-351-data-growth-activation.md
docs/roadmap-amendments/2026-07-10-pr353-record-depth-baseline-activation.md
docs/roadmap-amendments/2026-07-10-pr354-tier-a-batch-1-activation.md
docs/roadmap-amendments/2026-07-12-pr355-tier-a-batch-2-activation.md
docs/roadmap-amendments/2026-07-12-pr356-market-access-pilot-1-activation.md
docs/roadmap-amendments/2026-07-13-pr357-tier-a-batch-3-activation.md
```

Current operating specification:

```text
docs/post-351-data-growth-operating-spec.md
```

Current work-item specification:

```text
docs/quality/record-growth-batch-1-pr358-spec.md
```

Current required prior outputs:

```text
docs/migration/record-depth-baseline-pr353-summary.json
docs/migration/tier-a-candidate-queue-pr353.json
docs/migration/tier-a-batch-1-pr354-reviewed-handoff.json
docs/migration/tier-a-batch-2-pr355-reviewed-handoff.json
docs/migration/market-access-pilot-1-pr356-reviewed-handoff.json
```

## 2. Repository source of truth

Merged repository specifications outrank:

```text
chat memory
handoff prose
issue discussion
generated reports
stale roadmap text
unmerged drafts
mock images
```

PR numbering, active workstream state, and next approved work come from `docs/roadmap.md` plus the active amendments named there.

Do not infer the schedule from old PR numbers in historical documents.

## 3. Current workstream

```text
Canonical stable assets: 110
PR #351 Monthly Maintenance Log: complete
current public-surface expansion sequence: complete
PR #352 post-351 authority reset: complete
PR #353 Record Depth & Coverage Baseline: complete
PR #354 Tier A Dossier Deepening — Batch 1: complete
PR #355 Tier A Dossier Deepening — Batch 2: complete
PR #356 Market Access Pilot 1: complete
PR #357 Tier A Dossier Deepening — Batch 3: complete
PR #358 Record Growth Batch 1: active
PR #359 Market Access Pilot 2: next
```

Approved bounded sequence:

```text
PR #352  post-351 authority reset and specification/schedule synchronization — complete
PR #353  Record Depth & Coverage Baseline — complete
PR #354  Tier A Dossier Deepening — Batch 1 — complete
PR #355  Tier A Dossier Deepening — Batch 2 — complete
PR #356  Market Access Pilot 1 — complete
PR #357  Tier A Dossier Deepening — Batch 3 — complete
PR #358  Record Growth Batch 1 — active
PR #359  Market Access Pilot 2 — next
PR #360  Evidence and Correction Batch
REVIEW GATE
```

Do not skip ahead unless `docs/roadmap.md` is deliberately amended.

No PR number after the review gate is pre-authorized.

## 4. Operating mode

The public-surface expansion sequence is complete.

Default work now belongs to:

```text
reviewed data depth and record growth
canonical Market Access promotion
monitoring review without automatic promotion
corrections and evidence maintenance
monthly maintenance
```

A new public page, explorer, dashboard, ranking surface, or navigation family requires a separate roadmap amendment and canonical specification.

Small correctness, accessibility, readability, broken-link, and maintenance fixes remain allowed.

## 5. Mandatory PR traceability

Every post-351 non-trivial PR must cite:

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/post-351-data-growth-operating-spec.md
active roadmap amendments
work-item-specific specification
named baseline/queue/audit/research checkpoint or prior output
```

The PR body must identify:

```text
Specification references
Roadmap item
Scope
Explicit non-goals
Named inputs and prior outputs
Data preservation
Validation
Deployment classification
```

A PR that cannot identify its roadmap item and governing specification must pause.

## 6. Historical planning foundation

PR #353 is complete.

Its immutable reviewed planning checkpoints are:

```text
docs/migration/record-depth-baseline-pr353-summary.json
docs/migration/tier-a-candidate-queue-pr353.json
```

The baseline covers 110 assets × 16 dimensions and uses only:

```text
strong
usable
partial
sparse
absent
not_applicable
```

The planning system must not become:

```text
risk score
safety score
quality ranking
transparency ranking
numeric composite score
asset rank
investment recommendation
public leaderboard
```

Current work may recompute planning state but must not rewrite PR #353 checkpoints.

## 7. PR #354 reviewed handoff — complete

PR #354 completed legal-profile deepening for BUSD, DAI, RLUSD, USDC, and USDT, plus bounded BUSD/RLUSD redemption deepening.

Binding handoff:

```text
docs/migration/tier-a-batch-1-pr354-reviewed-handoff.json
```

The handoff binds:

```text
merge commit: d8a10676aec2f190bc32923fdc547ef359feb5c8
canonical stable assets: 110
canonical evidence: 547
canonical evidence relations: 547
Market Access Records: 0
new public surface: false
```

Completed PR #354 assets must not be selected again in PR #355:

```text
busd
dai
rlusd
usdc
usdt
```

## 8. Completed PR #355, completed PR #356, and active PR #357 rules

PR #355 completed FDUSD, FRAX, PYUSD, USDP, and UST dossier deepening.

PR #356 completed the bounded USDC / Japan / SBI VC Trade Market Access pilot. Its binding handoff is:

```text
docs/migration/market-access-pilot-1-pr356-reviewed-handoff.json
```

PR #357 is governed by:

```text
docs/roadmap-amendments/2026-07-13-pr357-tier-a-batch-3-activation.md
docs/quality/tier-a-dossier-batch-3-pr357-spec.md
config/tier-a-dossier-batch-3-pr357.json
scripts/validate-tier-a-dossier-batch-3-selection-pr357.mjs
```

Its selected assets are exactly AUDD, FEI, HUSD, MIM, and NZDS. Completed Batch 1 and Batch 2 assets must not be selected again. PR #357 must preserve four canonical Market Access Records and add no public product surface.

## 9. Dossier evidence discipline

Changed legal-profile and redemption fields must be supported by reviewed evidence.

Preferred evidence:

```text
official issuer terms
official stablecoin terms
official redemption or mint/redeem documentation
official reserve/transparency documentation
official protocol documentation
official governance documentation
official regulator publications
official court or enforcement publications when directly relevant
```

Rules:

- legal entity scope must not be broadened beyond the source;
- reserve ownership, reserve segregation, and bankruptcy remoteness are separate claims;
- direct issuer redemption is separate from exchange or market exit;
- customer eligibility, restrictions, and effective dates remain explicit;
- duplicate evidence URLs must use evidence identity/alias maintenance rather than redundant source rows;
- PayPal distribution and branding roles must not be collapsed into the PYUSD legal issuer role;
- BUSD-specific Paxos wind-down claims must not be reused as USDP claims without USDP-specific evidence;
- protocol-backed FRAX and UST must not be forced into issuer-backed fields where the model does not apply;
- missing evidence is not permission to fill a planning gap.

## 10. Core data rules

- Keep unknown values unknown unless reviewed evidence supports a value.
- Do not coerce partial-date evidence into a day-level date.
- Preserve evidence relations, known unknowns, deployments, source identities, and value states.
- Canonical counts change only through explicit audited data PRs.
- Rebrand, migration continuation, wrapped representation, deployment, or alias records do not become separate canonical assets without scope support and lineage review.
- Archive absence is a quality queue item, not permission to fabricate an archive URL.
- Missing capability data means unknown knowledge state, not `false`.

Protected unresolved states:

```text
null
unknown
not_recorded
not_applicable
source_review_needed
```

## 11. Canonical/public safety boundary

Public release claims remain canonical-only.

```text
canonical_only = true
includes_unreviewed_candidates = false
includes_internal_monitoring = false
includes_private_notes = false
```

Candidate, monitoring, discovery, editorial-research, and private material remain outside canonical public release claims until separately reviewed and promoted.

Record Depth baselines, Tier A queues, dossier handoffs, and dossier-impact reports remain internal planning infrastructure.

## 12. Monitoring rules

Monitoring remains private, review-only, and read-only with respect to canonical data.

Monitoring may observe, compare, classify, identify stale review state, prepare private review material, and discover bounded leads.

Monitoring may not write canonical data, self-accept baselines, edit guides automatically, create canonical pull requests automatically, publish candidates, or deploy.

A registered source is not an accepted baseline. Monitoring output is not canonical data.

## 13. Market Access rules

Canonical Market Access promotion must follow:

```text
research or monitoring signal
-> duplicate and scope review
-> source confirmation
-> evidence relation
-> bounded claim drafting
-> manual canonical review
-> reviewed repository PR
-> merge
-> public canonical output
```

Do not reduce access to a universal allowed/banned boolean.

A platform licence is not proof that a specific asset/function combination is available.

Monitoring observations, legal-profile facts, and editorial matrices are not canonical Market Access Records.

PR #356 may add no more than four reviewed USDC/JP/SBI VC Trade function-scoped rows to `data/market-access-records-v1.json` after canonical Evidence and claim-scope review.

## 14. Dossier and growth rules

Tier A dossier batches normally cover no more than five existing assets.

They may deepen supporting canonical records and evidence but do not add new canonical assets unless explicitly approved as combined growth work.

PR #357 must read the merged PR #356 handoff before selecting Tier A Dossier Deepening — Batch 3.

If a growth PR adds new canonical stable assets:

```text
maximum two new canonical stable assets per growth PR
```

All applicable supporting record groups must be preserved.

## 15. Derived-surface rules

Statistics derive from reviewed canonical data and do not become live price, market-cap, APY, safety, transparency, or risk rankings.

Compare preserves unresolved states and does not score or recommend assets.

Comparison Readiness remains separate from factual value truth and facet freshness.

Facet Freshness derives from authoritative record families.

Record Depth planning state remains internal and does not replace canonical facts.

Change Timeline preserves source date semantics.

Update Feed publication dates remain separate from historical subject dates.

Maintenance Log remains public-safe and aggregate-only.

## 16. Historical checkpoint rules

Do not rewrite historical checkpoints because current canonical data or dossier depth changed.

Binding historical material includes:

```text
release-integrity baselines
reproducible-build baselines
audited asset checkpoints
monitoring snapshots
statistics history
PR #353 planning snapshots
PR #354 reviewed handoff
PR #355 reviewed handoff
closed Maintenance Log months
```

## 17. Deployment rule

Normal merged changes publish from `main` under `docs/deployment-policy.md`.

Scheduled monitoring remains artifact-only and does not authorize canonical writes, guide edits, automatic canonical pull requests, or deployment.

## 18. Review gate

After PR #360, stop and review:

```text
remaining sparse record families
Tier A dossier improvement
Compare utility
Timeline historical density
canonical Market Access utility
monitoring signal usefulness
correction burden
monthly maintenance burden
external usage evidence when available
```

Only then define the next bounded sequence.

## PR #357 active authority

Current work item:

```text
PR #356 Market Access Pilot 1: complete
PR #357 Tier A Dossier Deepening — Batch 3: complete
PR #358 Record Growth Batch 1: active
```

Binding references:

```text
docs/roadmap-amendments/2026-07-13-pr357-tier-a-batch-3-activation.md
docs/quality/tier-a-dossier-batch-3-pr357-spec.md
config/tier-a-dossier-batch-3-pr357.json
docs/migration/record-depth-baseline-pr353-summary.json
docs/migration/tier-a-candidate-queue-pr353.json
docs/migration/tier-a-batch-1-pr354-reviewed-handoff.json
docs/migration/tier-a-batch-2-pr355-reviewed-handoff.json
docs/migration/market-access-pilot-1-pr356-reviewed-handoff.json
```

Selected assets:

```text
AUDD
FEI
HUSD
MIM
NZDS
```

This is deterministic queue consumption, not a ranking. PR #357 preserves 110 canonical stable assets, four canonical Market Access Records, canonical-only publication, and the existing public-surface boundary.

## PR #358 active authority

Current work item:

```text
PR #357 Tier A Dossier Deepening — Batch 3: complete
PR #358 Record Growth Batch 1: active
PR #359 Market Access Pilot 2: next
```

Binding references:

```text
docs/roadmap-amendments/2026-07-13-pr358-record-growth-batch-1-activation.md
docs/quality/record-growth-batch-1-pr358-spec.md
config/record-growth-batch-1-pr358.json
data/editorial-research/record-growth-batch-1-pr358-candidates.json
docs/migration/tier-a-batch-3-pr357-reviewed-handoff.json
```

Selected context group:

```text
current USD payment stablecoins with distinct stabilization models
```

Selected candidates:

```text
StraitsX USD / XUSD / sog_st_xusd
USDB / USDB / sog_st_usdb
```

Candidate selection is not canonical promotion. PR #358 may add no more than two fully reviewed records, must reject thin records, preserves four canonical Market Access Records, and adds no public product surface.

