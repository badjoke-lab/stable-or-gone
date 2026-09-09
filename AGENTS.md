# Stable or Gone Agent Instructions

This file is the mandatory entry point for humans, AI agents, and automation working in this repository.

## Current authority

```text
Current stage: UI_REDESIGN_V4_AUTHORITY
Active implementation authority: config/ui-redesign-v4-authority.json
Primary implementation branch: ui/sog-redesign-v4
Production branch: main
Official public origin: https://www.stableorgone.com
Partial redesign publication to main: forbidden
Current public UI remains live until full redesign cutover: yes
Ranking / scoring / recommendation authorized: no
DNS / Cloudflare account mutation authorized: no
New GA4 property / Measurement ID creation authorized: no
```

Merged repository authority outranks chat memory, handoff prose, issue discussion, stale branch state, generated reports, and unmerged drafts.

## Mandatory redesign references

Before starting or resuming UI redesign work, read in this order:

1. `config/ui-redesign-v4-authority.json`
2. `docs/UI-REDESIGN-SPEC.md`
3. `docs/UI-REDESIGN-SCHEDULE.md`
4. `DESIGN.md`
5. `docs/spec-governance.md`
6. `docs/roadmap.md`
7. `docs/deployment-policy.md`
8. `docs/ai-era-registry-spec.md`
9. `docs/ai-era-execution-schedule.md`
10. relevant permanent data/classification/evidence/deployment specifications for the surface being edited
11. current implementation of the affected route/components

Do not rely on chat summaries when merged repository documents are available.

## Redesign operating rule

At the start of each redesign session:

- identify the current gate in `docs/UI-REDESIGN-SCHEDULE.md`;
- fetch current `main` and `ui/sog-redesign-v4` heads;
- determine whether `main` needs to be synced;
- inspect the affected canonical data and current route implementation;
- work only within the active gate unless a real dependency requires otherwise.

At the end of each implementation unit:

- update schedule checkboxes/status when a deliverable changed;
- record branch/head and validation results;
- state completed and incomplete surfaces;
- state latest main sync point;
- state explicitly whether production changed.

## Production safety

- Keep the current public UI on `main` through Gates 0–7.
- Do not merge partial redesign pages to `main`.
- Ordinary record growth, evidence, guides, monitoring, and maintenance may continue independently on `main`.
- Sync current `main` into the redesign branch at safe checkpoints.
- Record the pre-cutover `main` SHA before Gate 8 integration.
- Roll back if a critical production regression is found after cutover.

## Data integrity

The UI adapts to canonical data. Canonical records must not be changed merely to make a desired visual state appear complete.

Do not invent market cap, price, lifecycle, backing, redemption, reserve, access, regulatory, evidence-coverage, issuer, deployment, or related values. Mockup numbers are not production data.

Derived presentation labels require deterministic documented rules. Missing information must remain explicit as `Unknown`, `Not recorded`, or another approved null state.

Preserve current deterministic per-asset JSON, provenance, evidence relationships, public machine-readable layer, Ledger Series projection, official-origin rules, legacy-host migration behavior, StablecoinMark/fallback behavior, and canonical logo-disposition requirements.

## UI validation policy

Preserve data/integrity/build/public-layer checks. Do not let obsolete visual baselines control the redesign.

Not redesign acceptance criteria:

- outgoing UI-v3 layout baselines;
- old UI-repair baseline;
- generated SVG mock fidelity;
- representative visual assertions whose only purpose is freezing the outgoing UI;
- pixel-perfect equality to the outgoing production site.

New UI checks should target demonstrated failure modes: route health, broken links, horizontal overflow, control usability, basic accessibility, state correctness, and representative desktop/mobile inspection.

Do not create new audit frameworks, validators, or workflow layers unless required by `docs/UI-REDESIGN-SPEC.md` or needed to cover an actual defect. Prefer implementing the product over expanding process machinery.

## Mobile

Mobile is part of each milestone, not a post-launch retrofit. A major surface is not complete until its desktop and mobile variants satisfy the relevant gate.

## Enduring non-UI boundaries

Unless separately authorized:

```text
ranking / scoring / recommendation: forbidden
AI-generated canonical classification: forbidden
DNS / Cloudflare account mutation: forbidden
new GA4 identity creation or guessing: forbidden
remote runtime Stablecoin-logo fetching: forbidden
canonical fact invention for presentation: forbidden
```

Historical completed authorities remain in repository history and their accepted machine/data/deployment contracts continue where they do not conflict with the active redesign authority. `docs/ui-v3-remediation-authority.md` is retained as historical regression context for accessibility, responsive safety, state handling, and canonical boundaries; its outgoing visual composition is not the new design target.
