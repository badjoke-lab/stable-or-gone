# Exact pre-v2 SOG restoration progress

Authority: commit `884351842fc01c028eeceb32bcd9fcc1ef7ffa09` and the user-supplied Cloudflare deployment.

Rules:

- Restore UI implementation from the authority commit; do not redesign it.
- Preserve current canonical data, routes, search, filters, sort, compare, pagination, accessibility, responsive behavior, and machine-readable outputs.
- UI v2, UI v3, HEI, generic SaaS, and CSS-only reinterpretations are not valid references.
- Do not merge until representative desktop and mobile renders match the supplied deployment.

Completed:

- disabled the browser-final HEI-like override;
- restored `src/styles/shell.css` from the authority commit;
- restored `src/pages/index.astro` from the authority commit.

In progress:

- shared layout;
- register and dossier components;
- Events and Organizations;
- Guides and long-form pages.
