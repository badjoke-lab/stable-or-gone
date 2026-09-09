# Stable or Gone Specification Governance

Status: canonical governance specification
Updated: 2026-09-09

## Authority order

Merged repository specifications are the source of truth. Chat memory, handoff prose, issue discussion, stale branch state, generated reports, and unmerged drafts do not override merged repository authority.

Authority order:

1. `docs/deployment-policy.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. current reviewed authority / roadmap amendment
5. current workstream specification and execution schedule
6. permanent operating specifications
7. enduring regression authorities
8. named audits, baselines, queues, and reviewed prior outputs
9. conversation history and unmerged drafts

## Current reviewed authority

```text
Stage: UI_REDESIGN_V4_AUTHORITY
Authority: config/ui-redesign-v4-authority.json
Roadmap amendment: docs/roadmap-amendments/2026-09-09-ui-redesign-v4-authority.md
Specification: docs/UI-REDESIGN-SPEC.md
Schedule: docs/UI-REDESIGN-SCHEDULE.md
Implementation branch: ui/sog-redesign-v4
Production branch: main
```

This authority permits a sitewide presentation-layer redesign but does not authorize canonical-fact mutation, schema/taxonomy mutation, ranking/scoring/recommendation, DNS/Cloudflare account mutation, or new analytics identity creation.

## Production isolation rule

The outgoing public UI remains live on `main` during redesign. Partial redesign merges to `main` are not authorized. The complete redesign is integrated only after Gate 7 acceptance and then production-verified under Gate 8.

## Canonical boundary

Current counts and hash are dynamic because approved record-growth work may continue on `main`. The redesign authority does not freeze a stale checkpoint. Every verification cycle must read current canonical counts/hash from the current branch/main state and confirm the redesign did not alter facts merely for presentation.

## Visual authority transition

`DESIGN.md`, `docs/UI-REDESIGN-SPEC.md`, and the active roadmap amendment supersede the outgoing Terminal Registry/paper visual target for this workstream.

`docs/ui-v3-remediation-authority.md` remains an enduring regression reference for accessibility, responsive safety, state handling, route/public safety, and canonical boundaries. Its exact outgoing visual composition, generated SVG mock fidelity, and obsolete layout baselines are not active redesign acceptance gates.

## Required start protocol

Before substantive redesign implementation:

1. read `AGENTS.md`, the active authority, redesign spec, and redesign schedule;
2. confirm current main, redesign branch head, open PRs, and relevant production state;
3. inspect the current route/components and canonical fields used by that surface;
4. identify the current schedule gate;
5. sync current main when necessary;
6. do not start unscheduled side frameworks or validators without a demonstrated need.

## Closeout

After Gate 8 production verification, complete Gate 9 cleanup and then establish the next reviewed authority or return the repository to its normal post-redesign operating state. Automatic continuation beyond closeout is not implied.
