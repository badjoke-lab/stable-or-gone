# SOG SEO / GA4 Custom-Domain Migration Audit Specification

Status: reviewed authority specification after merge  
Date: 2026-08-14

## Purpose

This specification authorizes only the bounded verification and repair work required to confirm that Stable or Gone operates publicly from `https://www.stableorgone.com`, that the legacy `https://sog.badjoke-lab.com` host remains a migration-only redirect surface, and that the existing SOG GA4 identity can be injected into the static production build when configured.

This is not a new domain migration and does not authorize DNS changes, new analytics identities, canonical data changes, route-family changes, or unrelated UI work.

## Entry baseline

- main: `3c715fa77d9e92d52d7646f6e6e944a43d7f5ea9`
- exact-main production run: `31588746719` — success
- official public origin: `https://www.stableorgone.com`
- canonical hash: `sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798`
- canonical file count: `466`
- canonical delta authorized: `0`

## Required repository audit

The lane must inspect the actual origin consumers, not only documentation. At minimum:

- `config/public-origin.mjs`
- Astro site configuration
- global layout metadata
- canonical and Open Graph URLs
- JSON-LD URLs
- robots sitemap declaration
- sitemap generation
- version / manifest / llms / ai output
- legacy-host redirect worker
- production deploy workflow
- GA4 tag injection path

Legacy-host or `pages.dev` strings are permitted only where they are intentionally part of migration, verification, deployment, or historical documentation. They must not become generated public canonical origins.

## Legacy-host acceptance

The enduring deployment contract remains:

```text
https://sog.badjoke-lab.com/<path>?<query>
-> 301 https://www.stableorgone.com/<path>?<query>
```

Fresh live checks should cover the homepage plus representative deep paths and a query-bearing request when the execution environment can reach both hosts. Historical migration evidence is not a substitute for a fresh live check, but inability of one audit environment to resolve a host must not be falsely reported as a production failure.

## GA4 acceptance

The existing layout contract uses `PUBLIC_GA_MEASUREMENT_ID`. This lane may wire that existing value from GitHub Actions configuration into the static build if the production workflow does not currently do so.

Rules:

- reuse the existing SOG GA4 property / web stream;
- do not create, invent, or hardcode a Measurement ID;
- do not print the configured value in logs;
- if the variable is configured, built HTML must contain the GA4 loader and config call;
- if no value is configured, report that account-side configuration remains required rather than fabricating a value.

The preferred workflow source is the existing `production` environment using a variable or secret named `PUBLIC_GA_MEASUREMENT_ID`.

## GSC boundary

Repository work can ensure the new domain exposes correct canonical metadata, redirects, robots, and sitemap. Google Search Console ownership, Change of Address, and sitemap submission are Google-account operations and must not be claimed complete without direct account evidence.

The intended account-side state is:

- `stableorgone.com` Domain property as the new primary property;
- old `sog.badjoke-lab.com` property retained during migration observation;
- new sitemap submitted from `https://www.stableorgone.com`;
- Change of Address used only after the redirect/public-origin checks are satisfied.

## Implementation boundary

Permitted implementation is limited to deployment/validation plumbing necessary for the audit result, especially GA4 build-time environment wiring and checks. No canonical data, archive, Market Access, route family, ranking, scoring, recommendation, or unrelated presentation change is authorized.

## Acceptance artifacts

Required before closeout:

1. repository origin audit result;
2. current live-origin / redirect result where reachable;
3. CI result for the exact implementation head;
4. production workflow result for exact merged main;
5. proof that configured GA4 injection is present in built/public HTML without exposing the ID in logs;
6. a clear list of any GSC/GA4 account-side steps that remain unverifiable from repository access.

## Closeout

After production verification, a closeout must restore `REVIEW_GATE`, set active implementation authority back to `none`, and prohibit automatic continuation.
