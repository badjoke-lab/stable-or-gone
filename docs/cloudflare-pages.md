# Cloudflare Pages Deployment

Updated: 2026-06-30

## Canonical policy

Deployment timing and classification are governed by:

```text
docs/deployment-policy.md
```

## SOG production target

```text
Production branch: main
Framework: Astro
Build command: npm run build
Build output: dist
Pages project: stable-or-gone
Public origin: https://sog.badjoke-lab.com/
```

## Repository workflow

Production deployment is performed by:

```text
.github/workflows/deploy-production.yml
```

The workflow runs automatically on every push to `main`. `workflow_dispatch` remains only as a fallback for rerunning the same automatic publication path after an infrastructure interruption, and manual fallback requires `confirm=DEPLOY`.

Normal pull requests are validated by CI. After a PR merges, the resulting `main` push validates guide metadata, builds the publishable Astro site, uploads the prebuilt `dist` directory to Cloudflare Pages with Wrangler, and verifies production.

## Cloudflare dashboard controls

Configured state:

```text
Production branch: main
GitHub Actions production upload: enabled
Build cache: ON
Build output: dist
```

The repository workflow uploads prebuilt assets with Wrangler. Cloudflare Pages is not used as a separate source-build gate for publication.

## GitHub operator setup

Required repository secrets:

```text
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
```

The GitHub `production` environment must allow the `main` deployment workflow to run without an additional routine publication approval.

## Equivalent operation

The workflow performs the equivalent of:

```text
wrangler pages deploy dist
project: stable-or-gone
branch: main
commit: checked-out main SHA
```

## Verification

Each automatic deployment verifies the homepage, Guides index, and UK guide route at:

```text
https://sog.badjoke-lab.com/
https://sog.badjoke-lab.com/guides/
https://sog.badjoke-lab.com/guides/uk-stablecoin-capital-rules-2026/
```

The verification confirms HTTP success, homepage and Guides links to the UK guide, the UK article text, and the deployed commit/output parity checks implemented by the production check scripts.

## Manual fallback and exceptions

Manual action is reserved for DNS, secret, Cloudflare account, destructive schema migration, mass deletion, major route-removal, and emergency rollback work. Do not use a separate manual publication checkpoint for ordinary guide, copy, UI, or reviewed data changes.

## Official references

- https://developers.cloudflare.com/pages/configuration/branch-build-controls/
- https://developers.cloudflare.com/pages/configuration/git-integration/
- https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/
- https://developers.cloudflare.com/workers/wrangler/commands/pages/
