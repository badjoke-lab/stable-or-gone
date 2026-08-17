# SOG SEO / GA4 migration closeout evidence — 2026-08-17

Status: reviewed closeout evidence candidate

## Authority

This evidence is bounded by `config/seo-ga4-migration-authority.json`, `docs/quality/seo-ga4-migration-audit-spec.md`, and `docs/roadmap-amendments/2026-08-14-seo-ga4-migration-audit-authority.md`.

No canonical registry, archive, Market Access, logo, route-family, DNS, Cloudflare-account, or analytics-identity mutation is authorized or performed here.

## Exact main verified

- Commit: `c889b707dc5163aaaa5e26349fb36c8ec9cde01e`
- Production workflow: `Deploy production`
- Run: `31954474819`
- Job: `95182862252`
- Result: success
- Official public origin: `https://www.stableorgone.com`

The production job completed all of the following steps successfully on the exact main commit:

- Validate official public origin
- Build publishable site
- Verify GA4 static-build output
- Upload prebuilt site to Cloudflare Pages
- Verify deployed production
- Verify UK guide publication
- Report deployment result

## GA4 build contract

The production workflow passes the existing `PUBLIC_GA_MEASUREMENT_ID` value from the `production` environment into the Astro static build using the existing variable/secret name only. It does not create, guess, or hardcode a Measurement ID.

`scripts/verify-ga4-build-output.mjs` checks the built HTML. When a measurement ID is configured, it requires every built HTML file to contain both the gtag loader and the matching config call. The verifier reports only configured state and aggregate file counts; it does not print the measurement ID value.

The exact-main production job's `Verify GA4 static-build output` step completed successfully.

## Origin and deployment contract

The production workflow uses `SOG_BASE_URL=https://www.stableorgone.com`, validates the official public origin before build, deploys the exact checked-out main SHA, and runs the production smoke check after Cloudflare Pages upload.

The merged authority continues to require the legacy host contract:

`https://sog.badjoke-lab.com/<path>?<query>` -> `301 https://www.stableorgone.com/<path>?<query>`

Repository evidence and the successful production smoke/audit jobs support the current migration contract. This closeout evidence does not claim Google-account-side actions that are not directly observable from the repository.

## Account-side items that remain outside repository proof

The repository does not prove any of the following by itself:

- Google Search Console Domain-property ownership state
- Search Console Change of Address completion
- Search Console sitemap submission state
- GA4 account/property administration outside the existing build variable

These remain account-side verification items unless direct account evidence is supplied.

## Canonical boundary

This evidence introduces no canonical changes. The authority boundary remains:

- stable assets: 119
- organizations: 109
- relationships: 131
- events: 194
- evidence: 585
- evidence relations: 585
- deployments: 186
- Market Access records: 12
- canonical hash: `sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798`
- canonical file count: 466
- canonical delta: 0

## PR acceptance

PR #565 exact head `dfcbb999c4055107a508053a08269e29e21daa06` completed the repository validation matrix successfully on 2026-08-17. Two legacy gate workflows were intentionally skipped; all executed validation workflows completed successfully, including core CI, public consistency, registry integrity, lifecycle/boundary, evidence integrity, legacy-host worker contract, deterministic statistics, monitoring coverage, reserve/redemption, organization/relationship, deployment/chain identity, and reproducible build audits.

## Closeout decision

The repository-side acceptance evidence required by the SEO / GA4 migration authority is now present for the current exact main production state. The next repository mutation for this lane should be the dedicated closeout that restores `REVIEW_GATE`, sets active implementation authority to `none`, and keeps automatic continuation disabled.
