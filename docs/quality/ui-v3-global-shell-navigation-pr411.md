# PR #411 UI v3 Rebuild B — Global Shell and Navigation

Status: active bounded implementation  
Issue: 281  
Phase: PR B  
Public UI change: shared shell only

## Objective

Replace the inconsistent terminal/editorial shell with a modern evidence-registry shell while preserving every route, page template, canonical record, and public machine-readable output.

## Implemented shared surfaces

- two-level desktop header with brand, prominent registry search, utilities, and grouped navigation;
- explicit active-route states for Registry, Learn, Project, Corrections, and Support routes;
- mobile menu with registry search, grouped links, utilities, ARIA state synchronization, Escape handling, and outside-click dismissal;
- shared shell tokens for page, section, card, interactive, selected, focus, warning, and critical surfaces;
- minimum 16px body text, minimum 14px table text, and 44px controls/touch targets;
- shared page-width, body background, link, button, form-control, skip-link, and focus rules;
- structured footer with project statement, grouped navigation, data access, and project boundaries;
- desktop/mobile screenshot capture and representative visual audit artifacts;
- generated HTML contact sheet for human review.

## Preserved boundaries

```text
Routes changed: 0
Canonical data changed: 0
Public machine-readable data changed: 0
Page-template redesigns: 0
Owner approval records changed: 0
UI completion declared: false
```

Home, stablecoin register, dossier, events, organizations, guides, and secondary-page content structures remain unchanged. Their later redesign phases remain blocked.

## Shell acceptance requirements

- `data-shell="evidence-registry-pr411"` on the shared header;
- global navigation generated from `globalNavigationGroups`;
- utility navigation generated from `utilityNavigation`;
- registry search remains a GET request to `/stablecoins/` with query parameter `q`;
- all desktop and mobile route states use `aria-current="page"`;
- mobile navigation uses `details`, explicit `aria-expanded`, Escape focus return, and outside-click dismissal;
- no decorative masthead is introduced by the shell;
- no page-level horizontal overflow;
- desktop and mobile captures are mandatory and may not be skipped;
- automated captures and audit results do not change the owner-approval register.

## Visual review status

PR #411 produces review artifacts but does not approve any template. All six template approvals remain pending in `docs/migration/ui-v3-visual-approval-register.json`.

## Exit condition

The shared shell is implemented and validated, visual artifacts are produced, canonical and route boundaries remain unchanged, and the repository stops at `REVIEW GATE` before PR C.
