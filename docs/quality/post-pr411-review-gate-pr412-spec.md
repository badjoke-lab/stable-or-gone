# PR #412 Post-PR #411 Review Gate Specification

Status: active mandatory review gate  
Review PR: 412  
Source implementation PR: 411  
Public output: false

## Objective

Review the completed global shell and navigation rebuild, bind the successful desktop/mobile artifact run without treating it as owner approval, preserve every route and canonical boundary, and authorize exactly one later implementation phase: PR #413, the home and stablecoin register rebuild described as PR C in Issue #281.

## Binding findings

```text
UI v3 state: reopened
Completed phase: PR B — global shell and navigation
Shell marker: evidence-registry-pr411
Visual review run: 29559515009
Contract/build validation: success
Mandatory desktop/mobile visual audit: success
Automated rendering equals owner approval: false
Owner-approved desktop templates: 0
Owner-approved mobile templates: 0
Routes changed: 0
Canonical changes: 0
Public machine-readable changes: 0
```

The shell now provides prominent registry search, grouped Registry/Learn/Project navigation, Corrections and Support utilities, active-route states, a mobile disclosure menu, 16px body text, 14px dense/control text, 44px touch targets, and a structured footer. The screenshot artifact establishes that the shell rendered without the prohibited skipped-audit state or horizontal overflow; it does not close any owner-approval gate.

## Authorized next work

PR #413 may rebuild exactly two public templates:

1. `/` — home product entrypoint;
2. `/stablecoins/` — stablecoin register.

### Home requirements

- prominent, truthful registry search;
- current canonical registry state;
- recent material/publication changes with clear date semantics;
- issue-watch or unresolved-question entrypoint;
- direct exploration paths into stablecoins, comparison, timeline, organizations, events, and guides;
- no decorative masthead competing with registry use;
- no invented metrics or derived claims not already supported by canonical/public projections.

### Stablecoin register requirements

- visible filter options and selected states;
- active-filter chips and one clear-all action;
- result count and sort state;
- understandable compare selection behavior;
- responsive desktop table and compact card/browse mode;
- initial primary rendering of at most 50 records;
- bounded rendering or pagination whenever the dataset exceeds 100 records;
- no misleading zero-count headings;
- empty, no-result, long-label, and narrow-screen states;
- canonical links and existing search query compatibility preserved.

## Required PR #413 validation

- exactly the home and stablecoin-register template families may change;
- no route additions, removals, or renames;
- no canonical or public machine-readable data changes;
- no stablecoin dossier, events, organizations, guides, or secondary-page redesign;
- desktop and mobile captures for home and register default, filtered, empty/no-result, and compare-selection states;
- contact sheet and machine visual audit are mandatory;
- skipped visual audit is a hard failure;
- screenshots do not update the owner-approval register;
- body text, dense text, control, focus, overflow, and touch-target boundaries from PR #409 remain in force;
- PR #413 stops before PR D.

## Prohibited work

- stablecoin dossier redesign;
- events or organizations redesign;
- guides or secondary-page redesign;
- canonical data growth or correction;
- public machine-readable schema or content changes;
- route or metadata-contract changes;
- owner-approval status changes;
- UI completion declaration;
- PR D or later implementation.

## Exit condition

PR #412 confirms PR #411 is complete, preserves owner approval as pending, and authorizes exactly PR #413. After PR #413, the repository returns to `REVIEW GATE` before dossier work.
