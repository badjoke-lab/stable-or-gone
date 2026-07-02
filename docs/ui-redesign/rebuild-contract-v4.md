# Stable or Gone UI restoration contract v4

Status: active
Updated: 2026-07-03
Tracking: #281
Restoration source: `3df568eab0a179d7690a88efb599156b0d659ab7`

## 1. Decision

The project will restore and refine the original terminal-style visual family instead of producing another unrelated visual concept.

The later Modern Data Product, Editorial Ledger, and Modern Evidence Registry directions were rejected in owner review. Their useful data, route, responsive, accessibility, and interaction work remains protected, but their visual authority is withdrawn.

A green build, successful screenshot capture, zero broken images, and zero overflow do not establish design quality.

## 2. Restoration boundary

Restore from the original terminal family:

- deep navy/near-black background;
- dark layered panels;
- cyan action and link color;
- monospace interface typography;
- square controls and borders;
- compact research-terminal density;
- semantic green, amber, red, violet, and muted states;
- atmospheric dark gradient treatment.

Do not roll back:

- canonical data or record counts;
- current routes and machine-readable outputs;
- current Home information and search behavior;
- stablecoin register pagination, filters, URL state, comparison, and mobile cards;
- stablecoin dossier hierarchy and field ownership;
- current Events and Organizations behavior;
- guide contents navigation and long-form structure;
- keyboard, focus, reduced-motion, forced-colors, zoom, and 320px support.

## 3. Rejected directions

The following are not binding requirements and must not be reintroduced as the dominant visual system:

- light paper/newspaper composition;
- muted dark-red editorial accent;
- giant editorial mastheads;
- transparent panels separated only by fine rules;
- generic white SaaS cards with soft rounded corners;
- design completion inferred from screenshot generation alone.

## 4. Restoration sequence

1. Remove the rejected Modern Evidence Registry shell.
2. Restore terminal tokens and shared visual primitives over the current semantic structure.
3. Validate Home, Stablecoin register, and Stablecoin dossier on desktop and mobile.
4. Validate Events, Organizations, Guides, and long-form pages under the same visual system.
5. Correct visual defects without creating a new visual family.
6. Run exact-commit production verification.
7. Record explicit owner approval before declaring completion.

## 5. Acceptance states

Required screenshot states include:

- default desktop;
- default mobile;
- active search;
- active filters;
- long labels;
- missing or unknown data;
- active lifecycle;
- failed or terminated lifecycle;
- migrated lifecycle;
- comparison selection where applicable.

## 6. Non-negotiable gates

UI completion is forbidden unless all conditions are true:

- no visual-audit step is skipped;
- desktop artifacts are reviewed;
- mobile artifacts are reviewed;
- Home is explicitly approved;
- Stablecoin register is explicitly approved;
- Stablecoin dossier is explicitly approved;
- Events is explicitly approved;
- Organizations is explicitly approved;
- Guides/long-form is explicitly approved;
- route, canonical data, provenance, accessibility, and machine-readable checks remain green;
- the project owner explicitly approves the exact screenshot set.

## 7. Workflow rule

Screenshot capture and visual approval are separate gates.

The final closure record must include:

- immutable commit SHA;
- screenshot artifact and run identifier;
- desktop review status;
- mobile review status;
- per-template approval status;
- owner approval reference;
- zero skipped required checks.

## 8. Current restoration checkpoint

PR #288 restores the terminal visual family over the current 100-record implementation. It is a restoration checkpoint, not a completion declaration.
