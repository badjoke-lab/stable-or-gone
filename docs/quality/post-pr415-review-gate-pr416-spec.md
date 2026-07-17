# PR #416 Post-PR #415 Review Gate Specification

Status: active mandatory review gate  
Review PR: 416  
Source implementation PR: 415  
Public output: false

## Objective

Review the stablecoin dossier rebuild, bind its successful validation and six-state desktop/mobile visual audit, preserve every route, canonical, metadata, and owner-approval boundary, and authorize exactly one later implementation phase: PR #417, the events and organizations rebuild described as PR E in Issue #281.

## Binding findings

```text
UI v3 state: reopened
Completed phase: PR D — stablecoin dossier
Source implementation merge: e4af173ff3560e0474b8282de0ad8da4532d0f4a
Source implementation head: c632a4419da7a6e45645e75f5a3d87985cd0dbe8
Visual review run: 29576352130
Visual artifact ID: 8405201944
Visual artifact digest: sha256:2e0b937b44d53b0ddf0f50c87894ca1f36a7a25ff436f564b45366136a0799a5
Contract/build validation: success
Mandatory desktop/mobile visual audit: success
Required captures: 6
Completed captures: 6
Visual failures: 0
Horizontal-overflow failures: 0
Automated rendering equals owner approval: false
Owner-approved desktop templates: 0
Owner-approved mobile templates: 0
Routes changed: 0
Canonical changes: 0
Public machine-readable changes: 0
Metadata-contract changes: 0
```

The dossier now prioritizes current lifecycle and issuance, redemption/exit meaning, backing/reserves, primary and connected organizations, material events, deployments, known unknowns, and evidence before technical identity and coverage fields.

USDC, UST, and BUSD each passed desktop and mobile review. All six captures contained the shared shell, dossier marker, section navigation, six decision-summary records, redemption/reserve, organizations, mechanism, history, deployment, known-unknown, and evidence sections. Each rendered at its exact viewport width with zero horizontal page overflow.

The artifact establishes render, hierarchy, and responsive integrity. It does not accept owner visual approval and does not declare UI v3 complete.

## Authorized next work

PR #417 may rebuild exactly the existing event and organization route families:

```text
/events/
/event/[id]/
/issuers/
/issuer/[slug]/
```

No route addition, removal, or rename is authorized.

### Event requirements

- replace the full-page event dump with bounded rendering or pagination;
- expose event severity/impact, event type, date, lifecycle effect, subject asset, recovery state, source count, and confidence as distinct fields;
- add visible filters, selected-state feedback, result counts, sort, clear action, and explicit empty state;
- distinguish current lifecycle from historical event effect;
- provide a responsive event index and a decision-useful event record page;
- keep evidence and related stablecoin/organization context reachable without inventing an incident score.

### Organization requirements

- replace the full-page organization dump with bounded rendering or pagination;
- expose organization role/type, jurisdiction, connected stablecoins, relationship roles, relationship count, review state, and evidence context;
- add visible filters, selected-state feedback, result counts, sort, clear action, and explicit empty state;
- provide organization-to-stablecoin relationship views on both index and detail pages;
- distinguish primary display relationship from all recorded relationships;
- keep unknown and unresolved legal/control roles explicit.

### Required representative visual states

PR #417 must capture and audit these eight states:

```text
Desktop and mobile: /events/ — default bounded event register
Desktop and mobile: /event/sog_ev_ust_2022_05_collapse/ — critical failed-lifecycle event
Desktop and mobile: /issuers/ — default bounded organization register
Desktop and mobile: /issuer/circle/ — multi-relationship organization record
```

The visual audit must verify:

- no horizontal page overflow;
- index rendering is bounded and not an 8,000–12,000px primary dump;
- event severity/type/lifecycle context is visible;
- organization role and connected-asset relationships are visible;
- filters expose options and selected state;
- result counts, clear action, sort, empty state, keyboard operation, focus, long labels, and narrow screens remain usable;
- event and organization detail context remains available on mobile;
- automated capture does not modify owner approval.

## Required PR #417 validation

- only event and organization route/template families and their specific components/styles/scripts may change;
- no route additions, removals, or renames;
- no canonical or public machine-readable data changes;
- no home, stablecoin register, stablecoin dossier, guides, or other secondary-page redesign;
- the eight representative desktop/mobile captures are mandatory;
- contact sheet and machine visual manifest are mandatory;
- skipped visual audit or horizontal page overflow is a hard failure;
- contract, Astro, build, canonical, Evidence, compatibility, release-integrity, reproducibility, public-layer, responsive, and accessibility checks remain green;
- owner approval records stay pending;
- PR #417 stops before PR F.

## Prohibited work

- guides or secondary-page redesign;
- route or metadata-contract changes;
- canonical data growth or correction;
- public machine-readable schema or content changes;
- owner-approval status changes;
- safety, transparency, risk, incident, or organization scores;
- UI completion declaration;
- PR F or later implementation.

## Exit condition

PR #416 confirms PR #415 is complete, preserves owner approval as pending, and authorizes exactly PR #417. After PR #417, the repository returns to `REVIEW GATE` before guides and secondary pages work.
