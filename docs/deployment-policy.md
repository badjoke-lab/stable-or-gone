# Deployment Policy

Updated: 2026-06-30

## Status

Stable or Gone publishes the current `main` branch automatically.

```text
Source of truth: main
Production workflow: .github/workflows/deploy-production.yml
Pages project: stable-or-gone
Public origin: https://sog.badjoke-lab.com/
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

Guide visibility is controlled by `src/data/guideCatalog.ts`.

```text
publishedAt set
→ included in /guides/

featured: true
→ eligible for the latest three homepage guide cards

publishedAt set
→ included in the sitemap
```

The homepage and Guides index must not require separate hard-coded article lists.

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
