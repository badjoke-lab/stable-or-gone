# PR #415 UI v3 Stablecoin Dossier Specification

Status: active implementation  
Implementation PR: 415  
Source review PR: 414  
Issue: 281  
Phase: PR D

## Objective

Rebuild the existing `/stablecoin/[slug]/` dossier family so the first screen explains the current operational meaning of a stablecoin record before exposing normalized technical fields.

The dossier must present lifecycle and issuance, redemption/exit, backing and reserves, organizations and control, material events, deployments, known unknowns, and evidence as distinct evidence-registry concepts. It must not invent a safety, transparency, risk, or quality score.

## Authorized scope

```text
src/pages/stablecoin/[slug].astro
src/components/StablecoinDetailView.astro
src/components/StablecoinDossierHeader.astro
src/components/StablecoinReserveSection.astro
src/components/StablecoinContextSections.astro
src/components/StablecoinHistorySection.astro
src/components/StablecoinOrganizationsControl.astro
src/styles/stablecoin-dossier*.css
PR #415 validation and visual-audit files
```

Only the existing dossier template family may be redesigned. No route addition, removal, or rename is authorized.

## Required hierarchy

```text
1. Current lifecycle and issuance
2. Redemption meaning and access
3. Backing and reserve structure
4. Issuer, operator, governance, and control relationships
5. Material lifecycle events and timeline
6. Deployment and network summary
7. Unresolved questions and known unknowns
8. Evidence identities and claim context
9. Progressively disclosed technical identity and coverage
```

## Required implementation

### Entry and current meaning

- keep a visible return path to the stablecoin register;
- show canonical identity, lifecycle, issuance, reference target, primary organization, launch, redemption/exit, backing, stabilization, last review, and evidence count;
- add a decision-useful summary grid for current state, redemption/exit, backing/stabilization, primary organization, latest material event, and unresolved questions;
- keep explicit language that the page is not a rating or recommendation.

### Redemption and reserves

- place redemption and reserve context immediately after the overview;
- distinguish issuer redemption, protocol exits, secondary-market liquidity, and unavailable/unknown states;
- preserve recorded reserve components, reports, disclosure context, and regulatory notes without flattening them into one score.

### Organizations and control

- show the primary display relationship and all connected relationships;
- preserve issuer, operator, governance, custodian, reserve manager, and control roles as separate recorded facts;
- keep issuer-control events separate from present organization identity.

### Mechanism and history

- show reference target, backing model, stabilization, valuation source, yield/rebase profile, and classification notes as separate fields;
- keep current classification separate from dated events;
- show model/lifecycle changes, issuer-control events, and the complete material-event timeline.

### Deployments, unknowns, and evidence

- keep deployment identity and native/bridged/deprecated/unknown state explicit where recorded;
- place known unknowns before evidence so unresolved claims remain prominent;
- show evidence publisher, provenance, claim support, archive state, reliability, and date without inventing evidence scores.

### Technical disclosure

- move canonical ID, route slug, aliases, record confidence, and section coverage below the decision-useful summary;
- use progressive disclosure rather than dumping raw schema fields into the primary reading path;
- preserve every unknown and not-recorded value.

## Responsive and accessibility requirements

- desktop and mobile are first-class outputs;
- no horizontal page overflow at 390px or 1440px;
- sticky dossier navigation must remain keyboard operable and horizontally scrollable when needed;
- touch targets remain at least 44px;
- headings remain semantic and ordered;
- long labels, identifiers, aliases, source titles, and URLs must wrap or use an explicit local scroll container;
- evidence and unknown sections must remain reachable on narrow screens;
- forced-colors behavior must remain usable.

## Mandatory visual matrix

```text
Desktop /stablecoin/usdc/ — deep active fiat-backed record
Mobile  /stablecoin/usdc/ — deep active fiat-backed record
Desktop /stablecoin/ust/  — failed algorithmic record
Mobile  /stablecoin/ust/  — failed algorithmic record
Desktop /stablecoin/busd/ — discontinued wind-down record
Mobile  /stablecoin/busd/ — discontinued wind-down record
```

For every capture, the machine audit must verify:

- shared shell present;
- `data-dossier-version="pr415"` present;
- dossier navigation present;
- six decision-summary records present;
- redemption/reserve, organizations, mechanism, history, deployments, known-unknowns, and evidence sections present;
- no horizontal page overflow.

A skipped visual audit or missing capture is a hard failure. Automated rendering does not change owner approval.

## Preserved boundaries

```text
Routes changed: 0
Canonical data changed: 0
Public machine-readable data changed: 0
Metadata contract changed: 0
Home/register/events/organizations/guides redesigned: 0
Owner approval records changed: 0
UI completion declared: false
PR E pre-authorized: false
```

## Exit condition

PR #415 ends at `REVIEW GATE`. Events and organizations remain blocked until a separate post-PR #415 review authorizes PR E.
