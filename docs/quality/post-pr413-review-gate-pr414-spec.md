# PR #414 Post-PR #413 Review Gate Specification

Status: active mandatory review gate  
Review PR: 414  
Source implementation PR: 413  
Public output: false

## Objective

Review the completed home and stablecoin-register rebuild, bind the successful contract/build and ten-state desktop/mobile visual audit without treating automated rendering as owner approval, preserve every route and canonical boundary, and authorize exactly one later implementation phase: PR #415, the stablecoin dossier rebuild described as PR D in Issue #281.

## Binding findings

```text
UI v3 state: reopened
Completed phase: PR C — home and stablecoin register
Source implementation merge: 8771de6ad5fc79310a638455f5be24b27af20eb3
Source implementation head: 6df1719295070d206e800a92e024284e4e6a6011
Visual review run: 29573553479
Visual artifact ID: 8404110345
Contract/build validation: success
Mandatory desktop/mobile visual audit: success
Required captures: 10
Completed captures: 10
Visual failures: 0
Horizontal-overflow failures: 0
Automated rendering equals owner approval: false
Owner-approved desktop templates: 0
Owner-approved mobile templates: 0
Routes changed: 0
Canonical changes: 0
Public machine-readable changes: 0
```

The home now acts as a compact evidence-registry product entrypoint with cross-registry search, truthful canonical totals, lifecycle state, material-event and publication histories kept separate, explicit known unknowns, exploration paths, recently reviewed records, and reviewed guides.

The stablecoin register now exposes six visible filter groups, selected-state counts, active chips, clear-all, result range/count, sorting, URL-backed state, bounded pagination at 20 records per page, desktop table and compact-card representations, a two-to-four-record comparison workspace, and an explicit no-result state.

The ten required desktop/mobile captures completed with no missing state and no horizontal page overflow. The artifact establishes render and interaction-state integrity; it does not accept any owner visual-approval record and does not declare UI v3 complete.

## Authorized next work

PR #415 may rebuild exactly the existing stablecoin dossier route family:

```text
/stablecoin/[slug]/
```

This is a template redesign only. It may not add, remove, or rename routes.

### Dossier hierarchy requirements

The primary reading order must be:

1. current lifecycle and issuance state;
2. redemption meaning and access boundaries;
3. backing and reserve structure;
4. primary organization, issuer, operator, governance, and control relationships;
5. material lifecycle events and timeline;
6. native/bridged deployment summary;
7. unresolved questions and known unknowns;
8. evidence identities and claim context;
9. raw or technical fields under progressive disclosure.

### Required SOG-specific components

- lifecycle and issuance summary without a safety score;
- redemption state that distinguishes issuer redemption, protocol exits, and secondary-market liquidity;
- backing/reserve summary with unknown and not-recorded states preserved;
- primary relationship summary plus all connected organizations;
- material-event timeline with event dates and lifecycle context;
- deployment summary distinguishing native, bridged, deprecated, and unknown states where recorded;
- evidence-quality/source-identity context without inventing a transparency score;
- known-unknown section that remains explicit and prominent;
- raw field disclosure below the decision-useful summary.

### Required representative states

PR #415 must capture and audit at least these six dossier states:

```text
Desktop and mobile: /stablecoin/usdc/ — deep active fiat-backed record
Desktop and mobile: /stablecoin/ust/ — failed algorithmic record
Desktop and mobile: /stablecoin/busd/ — discontinued wind-down record
```

The visual audit must verify:

- no horizontal page overflow;
- no missing primary hierarchy section when relevant data exists;
- unknown/not-recorded values remain visible rather than silently omitted;
- evidence and unresolved questions remain reachable on narrow screens;
- touch targets, focus states, heading order, long labels, and long identifiers remain usable;
- automated capture does not modify owner approval.

## Required PR #415 validation

- only the stablecoin dossier template family and dossier-specific components/styles/scripts may change;
- no route additions, removals, or renames;
- no canonical or public machine-readable data changes;
- no home, register, events, organizations, guides, or other secondary-page redesign;
- the six representative desktop/mobile captures are mandatory;
- contact sheet and machine visual manifest are mandatory;
- a skipped visual audit is a hard failure;
- contract, Astro, build, canonical, Evidence, compatibility, release-integrity, reproducibility, public-layer, responsive, and accessibility checks remain green;
- owner approval records stay pending;
- PR #415 stops before PR E.

## Prohibited work

- events or organizations redesign;
- guides or secondary-page redesign;
- route or metadata-contract changes;
- canonical data growth or correction;
- public machine-readable schema or content changes;
- owner-approval status changes;
- safety, transparency, risk, or quality scores;
- UI completion declaration;
- PR E or later implementation.

## Exit condition

PR #414 confirms PR #413 is complete, preserves owner approval as pending, and authorizes exactly PR #415. After PR #415, the repository returns to `REVIEW GATE` before events and organizations work.
