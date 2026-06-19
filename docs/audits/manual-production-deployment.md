# Manual Production Deployment Audit

Updated: 2026-06-19

## Repository implementation

The repository now contains a manual-only production publication workflow:

```text
.github/workflows/deploy-production.yml
```

The workflow:

- accepts only publication-checkpoint or emergency classifications
- requires exact `DEPLOY` confirmation
- refuses dispatches whose selected workflow ref is not `main`
- checks out the latest `main`
- records the source commit
- installs dependencies
- runs the full repository build
- uploads the prebuilt `dist` directory with Cloudflare's Wrangler Action
- attaches the source commit to the Pages deployment
- runs production consistency after publication
- writes a deployment summary
- uses a single production concurrency group
- uses the GitHub `production` environment

## Automatic paths

The repository policy validator confirms that:

- the production deployment workflow has no push trigger
- it has no pull-request trigger
- it has no schedule trigger
- Pages deployment does not occur from another workflow
- production consistency is not attached to an automatic trigger

## Data impact

No canonical registry data or public record count changes are included.

## External configuration still required

Repository code cannot complete these operator actions:

- disable automatic production deployments in the Cloudflare Pages dashboard
- disable automatic preview deployments in the Cloudflare Pages dashboard
- confirm the Pages project name
- configure the GitHub `production` environment
- configure the required Cloudflare credentials
- execute the first manual production deployment

## Publication status

This PR implements deployment infrastructure only. It is classified as no production deployment required and must not invoke the new workflow during its own review.

## Next work

After the external configuration is completed, run one controlled manual deployment from `main`. Normal SOG data development may resume without waiting for that first run.
