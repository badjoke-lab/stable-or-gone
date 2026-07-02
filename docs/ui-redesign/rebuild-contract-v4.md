# Stable or Gone UI rebuild contract v4

Status: active
Updated: 2026-07-03
Tracking: #281

## 1. Decision

The Editorial Ledger UI v3 is not an accepted finished interface. Its data integrity, route generation, accessibility contracts, and rendering checks remain useful, but its visual completion claim is withdrawn.

A green build, successful screenshot capture, zero broken images, and zero overflow do not establish design quality.

## 2. Failed direction

The following are no longer binding visual requirements:

- giant editorial mastheads;
- paper-first newspaper composition;
- transparent panels separated primarily by thin rules;
- 10px table headings and 12–13px default data text;
- unbounded index-page data dumps;
- schema-order detail pages;
- representative screenshot capture treated as approval.

The existing logo, routes, canonical data, machine-readable outputs, accessibility support, and evidence model remain protected.

## 3. New direction

Stable or Gone must become a modern evidence registry: calm, credible, operationally useful, and visually structured.

The interface must prioritize:

1. search and record discovery;
2. current lifecycle and operational meaning;
3. redemption and backing;
4. issuer, control, and relationships;
5. material events and lifecycle history;
6. evidence and unresolved questions;
7. raw registry fields only after the decision-useful summary.

Visual hierarchy must use typography, spacing, surfaces, grouping, and interaction state. Borders may support hierarchy but may not be the only hierarchy mechanism.

## 4. Mandatory prototype sequence

Do not roll the redesign across the whole site at once.

The first implementation slice is limited to:

- Home;
- Stablecoin register;
- Stablecoin dossier.

Each must be reviewed on desktop and mobile before Organizations, Events, Guides, and secondary pages are migrated.

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

## 6. Non-negotiable design gates

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
- filter state, clear actions, result counts, and selected state are visible;
- index browsing is bounded by pagination, virtualization, or deliberate grouping;
- default body and data text remain readable;
- route, canonical data, provenance, accessibility, and machine-readable checks remain green;
- the project owner explicitly approves the exact screenshot set.

## 7. Workflow rule

Screenshot capture and visual audit are separate gates.

A workflow must not report visual success when the audit step is skipped. The final closure record must include:

- immutable commit SHA;
- screenshot artifact/run identifier;
- desktop review status;
- mobile review status;
- per-template approval status;
- owner approval reference;
- zero skipped required checks.

## 8. PR sequence

1. Design contract and failure gates.
2. Shared shell and navigation.
3. Home and stablecoin register prototype.
4. Stablecoin dossier prototype.
5. Events and organizations.
6. Guides and secondary pages.
7. Full visual closure.

No later PR may claim UI completion before step 7.
