# UI V3 color and legacy-surface remediation

Status: in progress

The prior exhaustive screenshot pass verified route coverage, overflow, and broad font roles, but it did not enforce the design authority's color-restraint rules or reject all legacy panel surfaces.

Confirmed defects on the merged V3 UI:

- `StructuredEventDetail.astro` still renders the legacy `panel registry` / `bar` structure on event detail pages;
- the resulting structured-detail area uses a large blue surface and all-monospace value copy on desktop and mobile;
- stablecoin detail CSS applies warning color to every `time` and every class containing `date`, even when no warning meaning exists;
- the screenshot audit does not currently reject legacy `panel registry` surfaces, large off-token colored backgrounds, or semantic-color text outside approved roles.

Closure requires:

- replace the legacy structured-event panel with a V3 ruled record component;
- remove warning color from ordinary dates;
- audit all 457 desktop and 457 mobile routes for legacy panels, off-token colored surfaces, and semantic-color misuse;
- download and inspect the resulting 914 screenshots before merge;
- keep the PR in draft until both automated and manual checks pass.
