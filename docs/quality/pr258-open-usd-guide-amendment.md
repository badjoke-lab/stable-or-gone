# PR #252 Open USD Guide Amendment

Status: canonical implementation amendment
Updated: 2026-07-01

## Purpose

This owner-requested editorial interruption adds one dated Open USD explainer inside the existing `/guides/` route family.

## Scope

- add `/guides/open-usd-reserve-revenue-model/`;
- register it in `src/data/guideCatalog.ts`;
- use the existing `core-concepts` guide category;
- feature the guide on the homepage through the existing guide catalog behavior;
- display full source URLs in the public article;
- verify the route during automatic production deployment.

## Required editorial distinctions

The guide must:

- distinguish participant reserve-revenue sharing from yield paid to ordinary token holders;
- distinguish joining Open Standard from becoming a legal co-issuer;
- state that Open USD is announced but not yet verified live;
- avoid inventing a legal issuer, reserve custodian, reserve manager, redemption terms, contract address, or governance allocation;
- identify the pre-existing Origin Dollar use of the OUSD ticker;
- keep unresolved issuer, reserve, redemption, governance, deployment, and contract questions explicit;
- separate official Open Standard claims from reporting-source details.

## Data preservation

This PR changes no canonical stable-asset, organization, relationship, classification, reserve/redemption, event, evidence, deployment, legal-profile, reserve-component, or income-profile record.

## Publication

Deployment classification: Automatic production deployment on main.

The normal `main` push workflow must build, deploy, and verify the new guide route, its Guides-index link, its homepage featured-card link, and its visible source URL section.

## Sequence effect

This is an owner-directed editorial interruption. The substantive scope of Growth D, the 100-record quality audit, and non-UI release preparation does not change.
