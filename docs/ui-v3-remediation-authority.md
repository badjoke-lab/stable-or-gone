# UI V3 Remediation Authority

Updated: 2026-07-25  
Status: completed — retained as an archived regression authority  
Issue: #281 — completed and closed  
Completion: true

## Purpose and authority

This document records the binding requirements and closure evidence for the Stable or Gone UI V3 remediation. The remediation program is complete, but its regression constraints remain applicable to future material UI changes.

Future UI maintenance must preserve the accepted information hierarchy, readability floors, responsive behavior, semantic color roles, public-state handling, canonical data boundaries, route contracts, and exhaustive audit gates established by PR #461 and PR #463.

## Closure decision

The earlier representative-only completion decision was withdrawn because build success, route existence, screenshot generation, and basic overflow checks did not establish acceptable product-design quality.

The replacement closure is accepted because the final single-head verification established full public-route coverage and corrected the blocking visual defect found during direct artifact review.

```text
Final implementation PR: #463
Final color-system PR: #461
Final verified head: 0e5194459289e2fb600f10637012e1a0d5bb9a35
Final exhaustive screenshot run: 30147237015
Final main merge: 88db81ed27b63ff8798883ef618045f2bbe1a9b3
Desktop routes: 457 / 457 captured / 0 failed
Mobile routes: 457 / 457 captured / 0 failed
Total screenshots: 914
Blocking exhaustive-UI findings: 0
Blocking color-system findings: 0
Blocking readability findings: 0
Repository workflows: green before merge
```

During direct review, mobile event-dossier section headings were found overlapping their explanatory copy. The affected heading family included What happened, Subjects, Structured detail, Evidence, and Corrections. The final head:

- restored normal vertical document flow for mobile section-heading children;
- regenerated all 914 screenshots;
- directly rechecked the affected event dossier;
- added computed sibling-overlap detection;
- made overlap findings blocking in the exhaustive readability validator.

The defect therefore became both fixed behavior and a permanent regression gate.

## Completed remediation sequence

| Phase | Status | Evidence |
|---|---|---|
| R1 Authority reset and audit baseline | complete | #436 |
| R2 Global shell and tokens | complete | #437 |
| R3 Home and Stablecoin Register | complete | #438 |
| R4 Stablecoin Dossier | complete | #439 |
| R5 Events and Organizations | complete | #440 |
| R6 Guides and long-form pages | complete | #442 |
| R7 Reference and utility pages | complete | merged V3 implementation and exhaustive closure |
| R8 Compare and Access/Regulation | complete | final runtime/state implementation preserved in main |
| R9 Timeline and Stats | complete | final route-family audit and readability closure |
| R10 Full visual closure | complete | #461, #463, run 30147237015 |

Superseded draft and audit PRs #444, #449, #452, #453, and #460 are closed without merge. Issue #457 is closed as completed. They are not active authority and must not be revived as current workstreams.

## Preserved regression contract

### Typography and hierarchy

- Ordinary body copy must remain at least 15px on desktop and 16px on mobile.
- Compact values and interactive text must remain at least 14px on desktop and 15px on mobile.
- Metadata must remain at least 12px and be used sparingly.
- Body line-height must remain at least 1.45; compact data line-height must remain at least 1.35.
- Page and section headings must remain bounded relative to body copy and viewport height.
- Ordinary text must not use `word-break: break-all` or essential-name truncation.
- Monospace remains limited to IDs, hashes, addresses, paths, keys, and literal code.

### Shell, surfaces, and color

- Navigation, search, footer, controls, tables, and definition lists must remain readable at desktop and mobile widths.
- Internal navigation, archive/source links, semantic statuses, warnings, and primary actions must retain distinct roles.
- Saturated colors must not return as generic decoration or ordinary-copy color.
- Status, warning, and error meaning must never rely on color alone.
- Legacy panel surfaces, text shadows, non-semantic colored borders, and non-semantic colored backgrounds remain prohibited by the exhaustive color audit.

### Responsive behavior

- Mobile layouts must preserve information without shrinking desktop density into unreadable cards.
- Interactive targets presented as controls must remain at least 40px high; the final shared implementation targets 44px where applicable.
- Section headings and their explanatory copy must remain in normal non-overlapping document flow.
- Horizontal page overflow, clipping, overlapping text, and essential ellipsis are blocking defects.
- Mobile table replacements must preserve record identity and protected fields.

### States and public safety

- Loading, empty, error, and ready states must remain visibly separate.
- Public error states must not expose internal exception text, schema diagnostics, private monitoring material, or unreviewed candidates.
- Compare and Access/Regulation must not show contradictory empty/error/ready states.
- Unsupported score, ranking, or recommendation controls remain prohibited.

### Canonical and publication boundaries

- UI maintenance does not authorize canonical record changes.
- Public HTML, machine-readable outputs, sitemap routes, metadata, and provenance must remain derived from reviewed repository data.
- Monitoring remains read-only and cannot promote canonical data automatically.
- A merge to main is not itself production-parity evidence; deployment verification remains governed by `docs/deployment-policy.md`.

## Required audit gates for future material UI changes

A future material UI PR must preserve or strengthen:

- exhaustive 457-route desktop and mobile capture coverage, adjusted only when the canonical route count legitimately changes;
- computed color-system auditing;
- computed readability and heading-bound auditing;
- section-heading overlap detection;
- route completeness, overflow, image, brand, and empty-state checks;
- desktop and mobile artifact generation;
- direct inspection of changed route families and states;
- all repository workflow gates.

Automated success must not override a known visual defect. A defect discovered during artifact review blocks merge until fixed and covered by a regression check where practical.

## Post-completion operating state

The UI remediation workstream is closed. Normal repository work returns to the reviewed data-growth and maintenance lanes defined by `docs/post-351-data-growth-operating-spec.md` and the current `docs/roadmap.md`.

New material UI programs require a new reviewed roadmap amendment. This archived authority remains the minimum regression contract; it is not an active multi-phase implementation queue.
