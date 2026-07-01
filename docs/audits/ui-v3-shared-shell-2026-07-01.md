# UI v3 shared Editorial Ledger shell audit

Status: supporting audit  
Date: 2026-07-01  
Roadmap item: PR #262

## Scope

This audit records the shared-shell implementation that follows the canonical Editorial Ledger contract.

Changed implementation areas:

```text
config/ui-v3-foundation.mjs
config/site-architecture.mjs
src/components/BrandLockup.astro
src/layouts/BaseLayout.astro
src/styles/global.css
src/styles/shell.css
src/styles/editorial-ledger-v3.css
scripts/validate-ui-v3-foundation.mjs
scripts/validate-ui-v2-foundation.mjs
package.json
```

## Preserved facts and routes

```text
Canonical stable assets: 98
Canonical data changes: 0
Route additions: 0
Route removals: 0
Redirect additions: 0
Logo replacements: 0
```

The existing approved S/G SVG assets remain the only brand assets used by the shell.

## Exact foundation

```text
paper             #F4F1E9
paper subtle      #ECE7DC
paper emphasis    #E2DCCF
ink               #1B1A18
muted ink         #5C5851
quiet ink         #7A746B
rule              #C4BDB1
strong rule       #5D5850
accent            #7F242A
accent strong     #641A1F
focus             #1D5F85
positive          #2F6B4F
warning           #93651B
critical          #8B2B2B
unknown           #655C79
inactive          #6B6862
```

## Navigation result

Desktop primary shell:

```text
S/G lockup
Register
Events
Organizations
Guides
Search register
About disclosure
```

Mobile shell:

```text
S/G lockup
Menu disclosure
primary links
search
secondary links
```

Footer groups:

```text
Registry
Reference
Project
Data access
```

All existing route families remain available through primary navigation, About, mobile navigation, contextual links, or the footer.

## Removed shared defaults

The shared layer no longer authorizes:

- dark navy as the page background;
- radial or linear decorative page gradients;
- blue neon interaction identity;
- decorative panel shadows;
- medium-radius panels as the default page language;
- visible decorative hero illustrations;
- metric-card icon circles;
- large primary CTA gradients;
- repeated dashboard surfaces.

## Transitional behavior

Page-specific UI v2 files remain temporarily because Home, indexes, details, guides, and project pages have separate roadmap PRs. `src/styles/editorial-ledger-v3.css` neutralizes prohibited shared treatments while those page families are replaced.

The compatibility layer is temporary. PR #271 removes unused UI v2 CSS and components only after all replacement page families are complete.

## Accessibility preservation

The shared shell retains:

- skip link;
- semantic header, navigation, main, and footer regions;
- 44px minimum interactive control height;
- visible focus ring;
- keyboard-close behavior for mobile navigation;
- reduced-motion handling;
- forced-colors handling;
- descriptive labels for search controls;
- approved logo alt text and SVG title/description.

## Validation

Primary command:

```text
npm run validate:ui-v3-foundation
```

The historical `validate:ui-v2-foundation` command is retained as an alias so existing workflow wiring validates the current v3 foundation rather than enforcing superseded visual tokens.

## Remaining work

The shared shell does not complete the site redesign. The next item is PR #263 Home, followed by Stablecoins, dossiers, Organizations/Events, Guides, reference pages, mobile hardening, representative visual audit, cleanup, and production verification.
