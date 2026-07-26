# SOG full public UI remediation scope

Status: active implementation, blocking

The previous typography-only remediation did not resolve the public UI defects. Record growth remains paused until this scope is implemented, audited, merged, and production-verified.

Current branch: `agent/full-ui-contract-remediation`
Current PR: #470

## Implemented so far

- added one global visual authority: `src/styles/site-ui.css`;
- stopped the 23 shared global stylesheet entrypoints previously loaded by `BaseLayout` and `BrandLockup`;
- removed the dedicated home, event-index, and organization-index stylesheet imports;
- defined one documented typography, contrast, interaction, badge, form, table, home, detail, structured-fact, evidence, and responsive contract;
- replaced the event structured-detail schema table with human-facing fact groups;
- separated IDs, hashes, addresses, and references into explicit technical-value markup;
- expanded the rendered-route audit to block low contrast, invalid hover colors, flattened badges, raw enums, and schema-oriented labels;
- changed static validation to reject more than one public CSS import.

This is not complete and must not be merged yet. The stablecoin index entrypoint and any remaining page/component CSS imports still need removal after their layouts are moved into the authority file.

## Blocking defects

1. Typography
   - editorial serif is allowed only where it improves hierarchy;
   - ordinary copy, tables, controls, and metadata must meet readable size and line-height floors;
   - no page may depend on tiny text to fit dense content.

2. Color and contrast
   - body copy, metadata, borders, and disabled/secondary states must remain readable on the dark background;
   - inherited legacy hover colors are forbidden;
   - link default, hover, focus, visited, and active states must use one documented palette.

3. Public labels
   - raw snake_case, internal field paths, internal IDs presented as prose, and schema-oriented labels are forbidden on ordinary public surfaces;
   - technical IDs may appear only in explicit technical/code contexts.

4. Status presentation
   - semantic badges must remain recognizable badges, not colored underlines;
   - badges require consistent shape, padding, contrast, and state naming across all page families.

5. Information architecture
   - structured data must be presented as readable facts/cards/sections rather than compressed schema dumps;
   - wide evidence tables require readable desktop layouts and dedicated mobile representations;
   - all page families must preserve clear hierarchy and spacing.

## Required page-family audit

- Home
- Stablecoin index and pagination
- Stablecoin detail
- Event index and detail
- Organization index and detail
- Timeline
- Stats
- Guides and long-form pages
- Maintenance and updates
- Search and reference surfaces
- Header, navigation, footer, forms, links, tables, badges, and empty/unknown states

## Exit gate

- desktop and mobile screenshots for every public route;
- contrast checks for all text and interaction states;
- no role-inappropriate font findings;
- no raw public enums or schema-oriented public labels;
- no legacy hover/focus colors;
- semantic badge contract passes;
- representative manual visual review against the CYA design authority;
- production deployment verified after merge.
