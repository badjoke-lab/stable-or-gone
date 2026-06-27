# Global Shell Implementation Audit

Date: 2026-06-27  
Phase: Phase 4 — approved UI implementation  
Plan unit: PR 23 — global shell and grouped navigation

## Result

Status: **PASS when pull-request workflows complete**

PR 23 implements the common page shell approved in PRs 17, 21, and 22 without changing any route or canonical record.

## Implemented shell

```text
Grouped navigation: Registry / Learn / Project
Primary utility: Corrections
Secondary utility: Support
Compact navigation: disclosure menu
Skip link: present
Main target: #main-content
Current-page state: aria-current="page"
Escape close: present
Focus return: present
Data-access footer: present
```

The desktop and compact navigation are generated from:

```text
config/site-architecture.mjs
```

No duplicate hand-maintained navigation list is introduced.

## Route-family current state

Current-page selection covers both index and detail routes:

```text
/stablecoins/ + /stablecoin/{slug}/
/issuers/     + /issuer/{slug}/
/events/      + /event/{id}/
/guides/      + guide article routes
/glossary/
/models/
/methodology/
/updates/
/about/
/contact/
/support/
```

The public term remains **Organizations** while `/issuers/` and `/issuer/{slug}/` remain preserved compatibility paths.

## Accessibility foundations resolved

The PR resolves seven global implementation gaps recorded in PR 21:

```text
skip link
main-content focus target
current-page navigation state
reduced-motion foundation
forced-colors foundation
long-value overflow wrapping
44px target-size foundation
```

The 25 page-specific table transformations remain intentionally deferred to PRs 24–35.

## Compact navigation behavior

The compact menu uses a native `details` and `summary` structure.

Required behavior:

```text
Enter or Space opens the disclosure
Escape closes the menu
Escape returns focus to the trigger
Selecting a destination closes the menu
All grouped and utility destinations remain reachable
```

## Footer data access

The global footer preserves direct access to:

```text
/methodology/
/updates/
/contact/
/support/
/version.json
/data/manifest.json
/llms.txt
/ai.txt
```

## Visual foundations

The shell implements the approved PR 22 token family for:

```text
backgrounds
surfaces
lines
text and muted text
links
focus
positive, warning, critical, unknown, and inactive states
content widths
radii
panel shadow
```

The shell does not add market, ranking, recommendation, portfolio, or investment-advice visuals.

## Validation

Protected by:

```text
scripts/collect-site-architecture-audit.mjs
scripts/validate-site-architecture.mjs
scripts/collect-responsive-accessibility-audit.mjs
scripts/validate-responsive-accessibility-contract.mjs
```

The validators require:

```text
27 routes preserved
zero redirects
zero route removals
three contract-generated navigation groups
two contract-generated utilities
skip link and main target
current-page state
Escape and focus-return behavior
reduced-motion and forced-colors foundations
long-value wrapping
44px target foundation
25 table transformations still tracked as future work
```

## Scope boundaries

This PR does not:

- change a public route;
- change canonical record counts;
- transform the registry index tables;
- implement stablecoin comparison;
- reorder dossier content;
- add stable assets;
- select Batch 18;
- enable automatic production deployment;
- publish production.
