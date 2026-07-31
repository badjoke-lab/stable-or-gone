# Stable or Gone Deployment Policy

Updated: 2026-07-31

## Status

Stable or Gone publishes the current `main` branch automatically.

```text
Source of truth: main
Production workflow: .github/workflows/deploy-production.yml
Pages project: stable-or-gone
Official public origin: https://www.stableorgone.com/
Official-domain migration production checkpoint: bd0e63ac36b1824bf705e8c80d1fb0a1cd79d221
Automatic main publication: enabled
Manual workflow dispatch: fallback only
Deployment record: Issue #479
```

The checkpoint records the completed PR #493 migration. Current `main` and production equality must be read from the deployment workflow and Issue #479 rather than inferred from this document.

## Core publication rule

A normal merged change must not require a separate publication decision.

```text
PR merged to main
-> validate the official origin and publishable site
-> build dist from the exact main commit
-> upload dist to Cloudflare Pages with Wrangler
-> verify the deployed commit and canonical-data hash
-> verify reviewed counts, routes, metadata, and public guides
-> report the result to Issue #479
```

A merge is not itself proof of production parity.

## Official-origin contract

The only official public origin is:

```text
https://www.stableorgone.com
```

The same origin must govern:

- Astro `site` configuration;
- canonical and hreflang links;
- OGP and Twitter URLs;
- JSON-LD;
- `version.json` and `data/manifest.json` canonical origins;
- `llms.txt` and `ai.txt`;
- `robots.txt` and sitemap URLs;
- production smoke, provenance, and output-parity checks;
- deployment summaries and Issue #479 reports;
- repository public-site documentation.

`config/public-origin.mjs` is the repository source for runtime and build-time origin consumers. `npm run validate:public-origin` must reject accidental reintroduction of the legacy host in active files, including escaped regular-expression forms.

## Production verification

Every automatic deployment must verify:

- the deployed commit is the intended `main` commit;
- the public origin is `https://www.stableorgone.com`;
- canonical-data hash and source provenance match the build;
- Stablecoin, Organization, Event, and detail-route sets exactly match reviewed repository state;
- all detail routes expose the required metadata;
- canonical links and sitemap URLs use the official origin;
- machine-readable and public outputs are internally consistent;
- `/guides/` and required dated guide routes are public;
- the deployment result is recorded in Issue #479.

Current verified production baseline:

```text
Stablecoins: 116
Organizations: 107
Events: 191
Detail routes: 414
Metadata-checked routes: 414
```

## Cloudflare publication configuration

```text
Production branch: main
GitHub Actions performs the production upload
Cloudflare Pages project: stable-or-gone
Build output: dist
Required repository secrets:
- CLOUDFLARE_API_TOKEN
- CLOUDFLARE_ACCOUNT_ID
```

The workflow uploads prebuilt assets using Wrangler. Cloudflare is not used as an independent source-build system.

The current token has sufficient Pages publication access. It does not expose the `badjoke-lab.com` zone through the Zones API and therefore must not be assumed to have zone or redirect-ruleset authority.

## Legacy-host redirect

The legacy host is:

```text
https://sog.badjoke-lab.com
```

It currently reaches the same Pages project. Repository canonical output already identifies `www.stableorgone.com` as official, but a host-level 301 is still required for complete migration.

Required behavior:

```text
https://sog.badjoke-lab.com/<path>?<query>
-> 301 https://www.stableorgone.com/<path>?<query>
```

The redirect must preserve both path and query string. Redirecting every old URL to the new homepage is prohibited.

Required Cloudflare zone permissions:

```text
Zone Read for badjoke-lab.com
Single Redirect / Rulesets Edit for badjoke-lab.com
```

Required dynamic redirect rule:

```text
match: http.host eq "sog.badjoke-lab.com"
status: 301
target: concat("https://www.stableorgone.com", http.request.uri.path)
preserve_query_string: true
```

No Cloudflare zone write may be attempted until the credential can read the target zone and existing redirect entry-point ruleset.

A Pages `_redirects` file is not a valid substitute because Pages does not support domain-level redirects there.

A Pages Function or advanced-mode `_worker.js` workaround is not authorized because it would move all official-site requests through Workers request accounting and change the existing static-serving and header boundary.

## Redirect verification gate

After suitable Cloudflare permissions are available, the redirect change must be verified with at least:

```text
/ -> https://www.stableorgone.com/
/about/ -> https://www.stableorgone.com/about/
/stablecoin/tusd/?source=legacy -> https://www.stableorgone.com/stablecoin/tusd/?source=legacy
```

Verification must inspect status code, `Location`, path preservation, query preservation, absence of loops, and continued success of the official production smoke test.

Issue #479 remains open while this external redirect is incomplete.

## Guide publication

Guide visibility is controlled by `src/data/guideCatalog.ts`. `publishedAt` is metadata, not a removal switch for established evergreen guides.

```text
catalog entry + public route
-> included in /guides/
-> included in the sitemap

publishedAt set
-> exposes dated publication metadata

featured: true + publishedAt set
-> eligible for homepage guide cards
```

An existing guide must not disappear as a side effect of metadata handling.

## Manual fallback

`workflow_dispatch` remains available only when the automatic main deployment must be repeated after an infrastructure interruption or edge-convergence failure.

Manual fallback requires `confirm=DEPLOY` and must deploy the selected `main` commit. It is not permission to publish an unmerged branch.

## Infrastructure change boundary

Explicit review is required for:

- domain or DNS changes;
- redirect-ruleset changes;
- secret or Cloudflare account changes;
- Pages Functions or Worker introduction;
- destructive schema migrations;
- mass deletion;
- major route removal;
- emergency rollback.

Ordinary reviewed registry, guide, copy, UI, and documentation changes follow automatic main publication after their required repository validation passes.
