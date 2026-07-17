# PR #410 Post-PR #409 Review Gate Specification

Status: active mandatory review gate  
Review PR: 410  
Public output: false

## Objective

Review the completed UI v3 Rebuild A design contract, preserve every canonical and public-data boundary, and authorize exactly one implementation phase: PR #411, the global shell and navigation rebuild described as PR B in Issue #281.

## Binding findings

```text
UI v3 state: reopened
Design direction: modern evidence registry
Representative capture states: 14
Required owner-approved templates: 6
Required review widths: 320 / 390 / 768 / 1280 / 1440
Skipped visual audit: hard failure
Automated rendering equals approval: false
Production UI changes in PR #409: 0
Canonical changes in PR #409: 0
```

## Authorized next work

PR #411 may rebuild the shared global shell only:

- header and brand presentation;
- global navigation and active-route states;
- prominent registry search;
- mobile menu and responsive navigation behavior;
- page-width and shell-level surface tokens;
- shared buttons, links, focus, selected, hover, and disabled states;
- footer structure and data-access links;
- screenshot capture for representative shell states.

PR #411 must preserve every route, page template, canonical record, public machine-readable output, content hierarchy, and page-specific data interaction. Home, register, dossier, events, organizations, and guide template redesign remain blocked.

## Required PR #411 validation

- no route additions, removals, or renames;
- no canonical or public machine-readable data changes;
- body text at least 16px and controls at least 14px;
- touch targets at least 44px;
- active route, keyboard focus, mobile menu state, and skip link remain explicit;
- no giant decorative masthead in the shared shell;
- shell capture artifacts at desktop and mobile widths;
- visual audit may not be skipped;
- screenshot capture must not be recorded as owner approval;
- PR #411 stops before PR C.

## Prohibited work

- home or stablecoin register redesign;
- stablecoin dossier redesign;
- events or organizations redesign;
- guides or secondary-page redesign;
- route, metadata, canonical data, or public machine-readable changes;
- visual completion declaration;
- owner-approval status changes;
- PR C or later implementation.

## Exit condition

PR #410 confirms PR #409 is complete and authorizes exactly PR #411. After PR #411, the repository returns to `REVIEW GATE` before any page-template work.
