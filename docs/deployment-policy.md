# Deployment Policy

Updated: 2026-07-01

## Status

Stable or Gone publishes the current `main` branch automatically.

```text
Source of truth: main
Production workflow: .github/workflows/deploy-production.yml
Pages project: stable-or-gone
Public origin: https://www.stableorgone.com/
Automatic main publication: enabled
Manual workflow dispatch: fallback only
UI review gate: not a publication blocker
```

## Core rule

A normal merged change must not require a separate publication decision.

```text
PR merged to main
→ validate the publishable site
→ build dist
→ upload dist to Cloudflare Pages with Wrangler
→ verify the deployed commit
→ verify the public guide routes
```

Article publication, ordinary UI changes, copy changes, and normal reviewed registry changes follow this path.

## Guide publication

Guide visibility is controlled by `src/data/guideCatalog.ts`, but `publishedAt` is not a visibility switch for pre-existing evergreen guides.

```text
catalog entry + public guide route
→ included in /guides/
→ included in the sitemap

publishedAt set
→ exposes dated publication metadata

featured: true + publishedAt set
→ eligible for the latest three homepage guide cards

publishedAt null
→ allowed for evergreen guides that were already public
→ must not remove them from /guides/ or the sitemap
```

The four established evergreen guides are:

```text
/guides/what-is-a-depeg/
/guides/status-vs-event/
/guides/reserve-disclosure-basics/
/guides/stablecoin-lifecycle-terms/
```

The homepage and Guides index must not require separate hard-coded article lists. A change that hides an existing public guide requires explicit owner approval and a route-removal decision; it must not occur as a side effect of publication metadata handling.

## Validation boundaries

Publication checks are limited to what is required to build and verify the public site.

```text
Guide or copy change
→ guide metadata and route validation
→ Astro/site build
→ production verification

Registry data change
→ schema, identity, evidence, relationship, count, and integrity checks

Destructive infrastructure change
→ explicit review before merge
```

A failed unrelated research or migration audit must not block publishing an otherwise buildable article.

## Manual fallback

`workflow_dispatch` remains available only as a fallback when the automatic run must be repeated after an infrastructure interruption. Manual fallback requires `confirm=DEPLOY` and always deploys the selected `main` commit.

## Cloudflare configuration

```text
Production branch: main
GitHub Actions performs the production upload
Cloudflare Pages project: stable-or-gone
Build output: dist
Required secrets:
- CLOUDFLARE_API_TOKEN
- CLOUDFLARE_ACCOUNT_ID
```

The workflow uploads prebuilt assets using Wrangler. Cloudflare is not used as an independent source build system.

## Production verification

Every automatic deployment must verify:

- the deployed commit is the intended `main` commit;
- the homepage responds successfully;
- `/guides/` responds successfully;
- `/guides/uk-stablecoin-capital-rules-2026/` responds successfully;
- the UK guide is linked from the homepage and Guides index;
- every cataloged public guide remains linked from the Guides index and included in the sitemap;
- machine-readable and public outputs remain internally consistent.

## Exceptions

Manual approval is reserved for changes such as:

- domain or DNS changes;
- secret or Cloudflare account changes;
- destructive schema migrations;
- mass deletion;
- major route removals;
- emergency rollback.

The current visual quality or an unfinished UI review is not, by itself, a reason to block publication.
