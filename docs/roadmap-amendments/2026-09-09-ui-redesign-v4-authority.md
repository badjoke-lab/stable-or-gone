# 2026-09-09 — SOG UI Redesign V4 Authority

Status: ACTIVE AFTER MERGE
Authority config: `config/ui-redesign-v4-authority.json`
Implementation branch: `ui/sog-redesign-v4`
Production branch: `main`

## Decision

A full SOG UI redesign is authorized. The outgoing public UI remains live during development. Partial redesign work must not be merged to `main`; the complete redesign is cut over only after final desktop/mobile and repository verification.

This authority supersedes the old terminal/paper visual direction as the active target for this workstream while preserving the enduring data-integrity, route-safety, accessibility, machine-readable, provenance, and production-verification requirements that remain relevant.

## Approved direction

- dark graphite / near-black observatory interface;
- clean sans-serif primary typography;
- semantic lifecycle colors;
- dense but readable research-tool layout;
- no globe/Earth hero dependency;
- no paper/newspaper design;
- no retro-terminal parody;
- no generated SVG mock as the visual source of truth.

## Production-safe development model

`main` remains the currently published site and continues ordinary record growth, evidence, guide, monitoring, and maintenance work.

`ui/sog-redesign-v4` contains the complete redesign. It periodically syncs from `main` and adapts to current canonical data. Canonical data is not modified merely to satisfy a desired UI state.

## Validation decision

Keep data/integrity/build/public-layer verification. Quarantine old visual/UI-v3 baselines and generated SVG mock validation from redesign acceptance when they encode the outgoing UI. New browser validation is limited to demonstrated functional/usability failure modes: route health, broken links, overflow, basic accessibility, and representative browser inspection.

## Cutover

After all scheduled gates are complete, record the pre-cutover `main` SHA, sync latest `main`, repeat critical checks, merge the full redesign once, verify production, and rollback if a critical regression is found.

## Mandatory references

All agents and contributors working on the redesign must continuously consult:

1. `AGENTS.md`
2. `docs/UI-REDESIGN-SPEC.md`
3. `docs/UI-REDESIGN-SCHEDULE.md`
4. relevant canonical/schema/policy specifications
5. current implementation of the affected surface

Progress reports must identify the current schedule gate, branch/head, completed and incomplete surfaces, latest main sync point, validation state, and whether production changed.
