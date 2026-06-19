# Cloudflare Pages Deployment

Updated: 2026-06-19

## Policy source

Deployment timing and classification are governed by:

```text
docs/deployment-policy.md
```

This file describes Cloudflare-specific configuration only. It must not redefine when production deployment is required.

## Project configuration

```text
Production branch: main
Framework: Astro
Repository build command: npm run build
Build output directory: dist
Root directory: /
Custom domain: sog.badjoke-lab.com
```

The intended publication path builds the repository in GitHub Actions and uploads the prebuilt `dist` directory with Wrangler.

## Required Cloudflare dashboard controls

Configure the existing Pages project as follows:

```text
Automatic production branch deployments: OFF
Automatic preview branch deployments:    OFF
```

For a Git-integrated Pages project, open the project and use the branch deployment controls under Builds and deployments. Save the settings after changing them.

Repository code cannot confirm or change the operator's dashboard settings. Record completion in the deployment report when these controls are changed.

## Required GitHub Secrets

```text
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
```

The API token must use least privilege and be limited to the Pages deployment operation required for this project.

Do not store secret values in repository files, issues, pull requests, comments, artifacts, or logs.

## Manual deployment command

The manual production workflow will upload the prebuilt site with a command equivalent to:

```bash
npx wrangler pages deploy dist \
  --project-name stable-or-gone \
  --branch main \
  --commit-hash "$GITHUB_SHA"
```

The exact Pages project name must be confirmed in the Cloudflare dashboard before the workflow is enabled.

## Production consistency

`.github/workflows/production-consistency.yml` is manual-only.

Run it after a deliberate deployment or operator-requested verification. Provide the expected deployed commit when it differs from the selected workflow ref.

The check verifies:

- deployed commit
- HTML and canonical count parity
- JSON and manifest parity
- detail-route counts
- sitemap coverage
- canonical and hreflang metadata
- Open Graph and JSON-LD output
- absence of obsolete count markers

## Retry rule

Do not retry an old failed deployment after code has changed. That republishes or rebuilds the old commit.

Create one new deployment from the intended latest commit, then verify production.

## Current migration status

Repository-side policy and manual-only production verification are established first. The manual Wrangler production workflow is implemented in a separate follow-up PR.

Until that workflow and the dashboard controls are configured, continue normal GitHub development without restoring automatic deployment triggers.

## Official references

- https://developers.cloudflare.com/pages/configuration/branch-build-controls/
- https://developers.cloudflare.com/pages/configuration/git-integration/
- https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/
- https://developers.cloudflare.com/workers/wrangler/commands/pages/
