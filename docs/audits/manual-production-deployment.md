# Manual Production Deployment Audit

Updated: 2026-06-22

## Result

```text
Status: OPERATIONAL
First controlled deployment: PASS
Workflow run: 27908380603
Job: 82581060887
Source commit: 1aa87b0ca8251eea651af74f2af80f30c791e39c
Pages project: stable-or-gone
Public origin: https://sog.badjoke-lab.com/
```

## Repository implementation

The repository contains a manual-only production publication workflow:

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

## External configuration

The required operator configuration is complete:

- automatic production deployments disabled in Cloudflare Pages
- automatic preview deployments disabled in Cloudflare Pages
- build cache enabled
- Pages project confirmed as `stable-or-gone`
- least-privilege Cloudflare API token created
- `CLOUDFLARE_API_TOKEN` stored as a Repository secret
- `CLOUDFLARE_ACCOUNT_ID` stored as a Repository secret
- GitHub `production` environment created
- environment deployment branch restricted to `main`

## First controlled deployment

Workflow run `27908380603` completed successfully.

All deployment job steps passed:

- main and confirmation enforcement
- latest main checkout
- source commit recording
- Node setup and dependency install
- full repository build
- prebuilt Pages upload
- production verification
- deployment summary

The run proves that the intended free-plan architecture is operational: normal GitHub development remains independent from Cloudflare, while planned releases are published through one deliberate manual workflow.

## Data impact

No canonical registry data or public record count changed during activation. The deployed source contained the existing 75-record canonical baseline.

## Publication status

This infrastructure-finalization change is classified as:

```text
No production deployment required
```

Automatic Cloudflare publication is disabled, and the documentation/validator PR does not need a second deployment.

## Next work

Resume controlled growth from 75 to 80. After the 80-record promotion PR is merged, execute one `publication-checkpoint` deployment from `main` and complete the 80-record parity gate.
