# BaseLayout compatibility adjustment

PR #448 restores the pre-v2 SOG terminal UI from commit `884351842fc01c028eeceb32bcd9fcc1ef7ffa09`.

The historical `BaseLayout.astro` predates current routes such as Compare, Access & Regulation, Timeline, Stats, and Maintenance. Restoring that file byte-for-byte caused the current site-architecture validation to fail before Astro check and build could run.

Compatibility policy:

- keep the restored historical page structures, components, and CSS;
- keep the current canonical records and loaders;
- use the current `BaseLayout.astro` route/navigation contract;
- do not re-enable the browser-final HEI-like remediation override;
- treat any visual differences introduced by the compatibility layout as concrete defects to correct in the restored shell CSS, not as reasons to remove current routes.
