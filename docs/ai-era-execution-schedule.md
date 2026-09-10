# SOG AI-era Execution Schedule

Status: roadmap addendum
Updated: 2026-09-11

## Current checkpoint

UI Redesign V4 and the subsequent Public Stats / Registry Health refinement are completed production lineage. Earlier Ledger Series Phase 3 and Phase 9 work also remains completed historical lineage; accepted machine/data contracts remain regression requirements where relevant.

```text
Current stage: POST_CUTOVER_STATS_HEALTH_COMPLETE
Production branch: main
UI Redesign V4: complete via PR #636
Public Stats / Registry Health split: complete via PR #653
Verified production commit: 157ec8c391a9134552c9e0beabb3ff430e867fd6
Deploy production verification: run #516 / success
```

No new AI-era implementation lane is automatically opened by this closeout.

## AI-era registry work order

Previously completed deterministic lifecycle/public-surface strengthening remains complete. Current production authority does not authorize AI-generated canonical classification, ranking, scoring, recommendations, or unsourced market data.

Future lifecycle follow-up, natural-language filtering, or other AI-era product changes remain separate workstreams unless separately reviewed and authorized.

## Presentation lineage

The UI Redesign V4 schedule in `docs/UI-REDESIGN-SCHEDULE.md` is now a completed execution ledger. Its accepted data, route, accessibility, mobile, and deployment contracts remain relevant, while the former isolated redesign branch is not an active implementation lane.

The production analytical split between `/stats/` and `/maintenance/` is governed by `docs/stats-spec.md`.

Canonical record growth may continue on `main` without reopening completed UI branches.

## Mandatory continuation rule

For future substantial work, read:

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. `DESIGN.md` when presentation is involved
6. `docs/stats-spec.md` when Stats / Registry Health semantics are involved
7. `docs/ai-era-registry-spec.md`
8. relevant current data/classification/comparison/provenance specifications
9. any newly reviewed workstream authority/schedule

Always confirm current `main`, relevant open PRs, and production state before implementation. Do not infer that `ui/sog-redesign-v4` or `ui/stats-registry-health-20260910` remains active merely from historical references.
