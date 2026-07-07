# Stable or Gone

Stable or Gone (SOG) is a public historical registry for stablecoins and closely related stable-value assets. It records how assets are issued, backed, stabilized, redeemed, governed, migrated, restricted, wound down, or collapsed, together with the organizations, deployments, events, and evidence behind each claim.

Public site: https://sog.badjoke-lab.com/

SOG is not a live price dashboard, trading terminal, safety ranking, market-cap ranking, or source of investment advice.

## Current registry checkpoint

The reviewed canonical checkpoint contains:

```text
100 stable assets
94 organizations
110 stablecoin-organization relationships
100 classification records
100 reserve/redemption profiles
172 events
172 Event v2 detail records
502 evidence records
502 evidence relation projections
108 reserve-report or reserve-context records
289 known unknowns
9 regulatory notes
140 deployments
100 legal profiles
4 stable-asset relationships
133 reserve components
100 income profiles
140 deployment view rows
366 detail routes
```

These counts are derived from the same canonical data groups used by the public HTML pages, `version.json`, `data/manifest.json`, and route generation. They are protected by release-integrity checks and must not be maintained independently by hand.

The audited 100-asset checkpoint also records deterministic group and global identity/content digests, exact baseline linkage, package graph linkage, and the accepted reproducible-build result. Current production may move to a later noncanonical `main` commit only while provenance, canonical hash, file-count, reviewed count, and exact route parity remain valid.

Release note:

```text
docs/releases/100-asset-checkpoint-2026-07-06.md
```

Binding checkpoint:

```text
docs/migration/audited-100-asset-canonical-checkpoint.json
```

## Current workstream

The registry has reached the reviewed 100-asset checkpoint. The active roadmap item is non-UI release material.

The next approved sequence is:

```text
PR #321  100-asset monitoring baseline synchronization
PR #322  reserve and redemption source expansion
PR #323  lifecycle, regulatory, and EU market-access source/schema expansion
PR #324  bounded scheduled read-only monitoring
PR #325-#328  statistics implementation
PR #329       next candidate audit
PR #330-#334  controlled growth from 100 to 110
```

After a reviewed 110-asset checkpoint, approved later work begins with Comparison Foundation, followed by Compare, Access & Regulation Explorer, Change Timeline, and reviewed public update surfaces.

The repository source of truth is:

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
```

Do not infer the active schedule from old handoffs or superseded migration plans. See `docs/roadmap.md` and the active roadmap amendments for the current gate and next approved work item.

## What the registry tracks

SOG records:

- canonical stable-asset identity, aliases, symbol, reference target, lifecycle, and issuance state;
- asset class, backing model, stabilization mechanism, governance model, and exit or redemption model;
- issuers, protocols, governance bodies, custodians, reserve managers, redemption agents, and other organizations;
- reserve disclosure, reserve-report history, redemption access, eligibility, settlement terms, and restrictions;
- launches, depegs, regulatory actions, reserve changes, redemption changes, migrations, wind-downs, failures, issuer-control actions, and other material events;
- chain deployments, contract identities, control capabilities, and deployment status;
- source-backed evidence, claim scopes, known unknowns, and unresolved questions.

## Scope

The canonical registry may include:

- fiat-backed stablecoins;
- crypto-collateralized and overcollateralized stablecoins;
- algorithmic, partially collateralized, and hybrid designs;
- synthetic and delta-neutral stable assets;
- RWA- and government-security-backed stablecoins;
- commodity-referenced stable-value assets;
- basket-, index-, CPI-, and floating-target assets;
- independent yield-bearing or rebasing stable assets;
- historical failed, terminated, migrated, rebranded, and inactive assets.

Tokenized deposits, fund shares, yield receipts, reserve assets, and other adjacent instruments are included only when their relevance to stable-value systems is clear and their legal and economic nature can be classified separately.

Simple bridged versions, wrappers, LP tokens, vault shares, and ordinary yield wrappers are not separate canonical assets by default. They are represented through deployment or stable-asset relationship records when appropriate.

See:

```text
docs/stable-asset-scope.md
docs/classification-spec.md
docs/data-model-v3-spec.md
```

## What SOG does not provide

SOG does not provide:

- stablecoin safety scores;
- buy, sell, hold, avoid, or redemption recommendations;
- yield rankings;
- live depeg alerts;
- live price or market-cap rankings;
- issuer, exchange, wallet, or account support;
- investment, legal, financial, tax, or regulatory advice.

## Data structure

The registry is built from repository-managed JSON data and static Astro pages.

Current canonical data groups include:

- stable-asset records;
- organization records;
- stablecoin-organization relationships;
- classification records;
- reserve and redemption profiles;
- event records and Event v2 details;
- evidence records and evidence relations;
- reserve-report references;
- known unknowns;
- regulatory notes;
- deployment records;
- legal profiles;
- stable-asset relationships;
- reserve components;
- income profiles.

Public HTML, route generation, `version.json`, `data/manifest.json`, `llms.txt`, `ai.txt`, and the sitemap are generated or validated against the reviewed canonical groups.

The public machine-readable layer exposes reviewed canonical information only:

```text
canonical_only = true
includes_unreviewed_candidates = false
includes_internal_monitoring = false
includes_private_notes = false
```

Unreviewed candidates, pending monitoring baselines, internal monitoring output, editorial research matrices that have not become canonical records, and private notes remain outside public canonical release claims.

## Machine-readable entry points

Public machine-readable discovery starts at:

```text
/version.json
/data/manifest.json
/llms.txt
/ai.txt
```

`version.json` exposes project identity, build provenance, reviewed counts, and additive Registry v3 summary data.

`data/manifest.json` describes the public data model, count surfaces, and data-safety boundary.

SOG does not maintain a second manually edited public count authority.

## Monitoring boundary

Monitoring is review-only and read-only with respect to canonical data.

The monitoring pipeline may observe sources, compare accepted baselines, classify changes, and create private review material. It may not:

- write canonical data automatically;
- accept its own baseline;
- edit guides automatically;
- publish candidates automatically;
- create automatic canonical PRs;
- deploy.

At the current 100-asset checkpoint, registered source reach and accepted monitoring coverage are separate concepts. Source and schema expansion remains scheduled work; zero coverage in a required monitoring domain is recorded honestly rather than filled by inference.

## Specification and change control

Repository specifications are authoritative. Chat history, old handoffs, unmerged drafts, and mock images do not change the approved implementation by themselves.

Every non-trivial pull request must cite:

```text
Specification references
Roadmap item
Scope and non-scope
Data-preservation checks
Validation performed
Deployment classification
```

See `docs/spec-governance.md`.

## Validation and build

```bash
npm ci --no-audit --no-fund
npm run dev
npm run build
```

The release-hardening path pins Node 22.22.0 and uses the reviewed `package-lock.json`.

The validation chain covers canonical data, compatibility, classification, profiles, events, evidence relations, Registry v3 additive data, release integrity, reproducible-build contracts, the audited 100-asset checkpoint, final state, registry integrity, Astro validation, site generation, machine-readable output, route parity, metadata, provenance, and production consistency.

Useful commands include:

```bash
npm run validate:guides
npm run validate:parity-suite
npm run validate:release-integrity
npm run validate:reproducible-build
node scripts/validate-audited-100-checkpoint.mjs
npm run check:production
```

## Development and production deployment

Normal pull requests are validated by GitHub CI and do not wait for Cloudflare Pages. After a pull request merges, the `main` push automatically runs `.github/workflows/deploy-production.yml`, validates the publishable site, builds `dist`, uploads it to the `stable-or-gone` Cloudflare Pages project with Wrangler, and verifies production.

Manual deployment is fallback-only for infrastructure interruption or reserved exceptions such as DNS, secret, Cloudflare account, destructive schema migration, mass deletion, major route removal, and emergency rollback.

Canonical policy: `docs/deployment-policy.md`

Cloudflare operator setup: `docs/cloudflare-pages.md`

## Reporting and corrections

Use the contact page to choose the correct route:

https://sog.badjoke-lab.com/contact/

Use the Google Form for normal contact, non-public reports, missing records, broken links, and source suggestions:

https://docs.google.com/forms/d/e/1FAIpQLSeEUxdPktIm46X0HgwuYvk8vpx0N3R0EezOaC2fz64nfE6JjA/viewform?usp=dialog

Use GitHub Issues only for public, source-backed corrections that can be discussed openly:

https://github.com/badjoke-lab/stable-or-gone/issues/new/choose

Do not submit private keys, seed phrases, passwords, wallet credentials, exchange account details, bank information, identification documents, or sensitive personal information.

## Support

Support helps cover research, source checks, broken-link review, new records, and ongoing site maintenance. It does not affect listings, wording, methodology, corrections, or status labels.

https://sog.badjoke-lab.com/support/

## License

Code is released under the MIT License. See `LICENSE`.

Registry data and written record content are released under Creative Commons Attribution 4.0 International (CC BY 4.0). See `LICENSE-DATA.md`.

## Disclaimer

Stable or Gone is a historical and reference-oriented registry. Information may be incomplete, outdated, disputed, or dependent on source interpretation. Always check current issuer terms, protocol documentation, regulator publications, and market data before making decisions.
