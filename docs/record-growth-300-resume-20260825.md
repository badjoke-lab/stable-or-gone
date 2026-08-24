# SOG Record Growth 300 — Resume Control

Status: active execution
Date: 2026-08-25
Branch: `agent/record-growth-300-work`
Target: grow canonical stable assets from 119 to 300 without duplicate promotion or thin record inflation.

## Verified starting state

- Canonical stable assets: 119.
- Remaining target: +181 canonical stable assets.
- `data/candidate-stable-assets.json` / `docs/candidate-stable-assets.md` are legacy control surfaces and currently account for only 40 promoted entries; they are not sufficient as the candidate universe for the 119 -> 300 program.
- Existing `batch-16-full-layer-draft.json` and `batch-17-full-layer-draft.json` are historical material and must not be re-promoted when their records already exist in canonical.
- Publication-blocking validation is separate from advisory maintenance audits. Advisory statistics/evidence/deployment maintenance checks must not be used as a reason to stop record growth.

## Execution rule

The 300 program is now source-universe-first, not candidate-master-first.

For each growth batch:

1. Build a broad candidate scan from external stable-asset registries plus repo history/backlog.
2. Direct-scan all canonical stable asset data groups, aliases, symbols, organizations, relationships, deployments, events, evidence, and prior drafts.
3. Classify candidates as `existing`, `new_public_ready`, `needs_research`, `adjacent_watchlist`, `out_of_scope`, or `duplicate`.
4. Promote only `new_public_ready` candidates.
5. A promoted asset must include the full SOG layer required by current canonical conventions: stable asset identity, organization references, lifecycle/event material, evidence, and any required Registry v2/v3 profile/deployment data.
6. Run publication-blocking validators and CI before merge.
7. Recompute the canonical count from actual production data after every merged batch.

## Batch sizing

- Scan window: 30–60 candidates at a time.
- Promotion batch: normally 10–20 new canonical assets when evidence supports it.
- Complex or disputed assets may be isolated from the main batch rather than blocking unrelated ready records.

## Hard prohibitions

- Do not count old drafts as new canonical records.
- Do not re-promote an already canonical asset under a symbol/name variant.
- Do not promote wrappers, receipt tokens, bridged representations, yield-bearing derivatives, or adjacent assets as the underlying stablecoin without an explicit classification decision.
- Do not create placeholder-only canonical records to hit 300.
- Do not let advisory maintenance audits block otherwise publication-safe record batches.

## Completion definition

The target is complete only when the repository's canonical production dataset contains 300 unique stable assets and each newly added record passes the current publication-blocking validation/CI requirements with its required supporting layers.
