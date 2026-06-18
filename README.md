# Stable or Gone

Stable or Gone (SOG) is a public historical registry for stablecoins and closely related stable-value assets. It records how assets are issued, backed, stabilized, redeemed, governed, migrated, restricted, wound down, or collapsed, together with the organizations, deployments, events, and evidence behind each claim.

Public site: https://sog.badjoke-lab.com/

SOG is not a live price dashboard, trading terminal, safety ranking, market-cap ranking, or source of investment advice.

## Current registry checkpoint

The canonical public checkpoint contains:

```text
70 stable assets
59 organizations
72 stablecoin-organization relationships
70 classification records
70 reserve/redemption profiles
92 events
92 Event v2 detail records
279 evidence records
279 evidence relation projections
72 reserve-report or reserve-context records
153 known unknowns
9 regulatory notes
101 deployments
70 legal profiles
4 stable-asset relationships
102 reserve components
70 income profiles
```

The controlled 20 → 70 growth phase is complete. SOG is now in the 70-record quality-completion phase before controlled growth from 70 to 100 records. The batch finalization guard and integrity audit protect the canonical checkpoint.

## What the registry tracks

SOG records:

- canonical stable-asset identity, aliases, symbol, reference target, lifecycle, and issuance state
- asset class, backing model, stabilization mechanism, governance model, and exit or redemption model
- issuers, protocols, governance bodies, custodians, reserve managers, redemption agents, and other organizations
- reserve disclosure, reserve-report history, redemption access, eligibility, settlement terms, and restrictions
- launches, depegs, regulatory actions, reserve changes, redemption changes, migrations, wind-downs, failures, issuer-control actions, and other material events
- chain deployments, contract identities, control capabilities, and deployment status
- source-backed evidence, claim scopes, known unknowns, and unresolved questions

## Scope

The canonical registry may include:

- fiat-backed stablecoins
- crypto-collateralized and overcollateralized stablecoins
- algorithmic, partially collateralized, and hybrid designs
- synthetic and delta-neutral stable assets
- RWA- and government-security-backed stablecoins
- commodity-referenced stable-value assets
- basket-, index-, CPI-, and floating-target assets
- independent yield-bearing or rebasing stable assets
- historical failed, terminated, migrated, rebranded, and inactive assets

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

- stablecoin safety scores
- buy, sell, hold, avoid, or redemption recommendations
- yield rankings
- live depeg alerts
- live price or market-cap rankings
- issuer, exchange, wallet, or account support
- investment, legal, financial, tax, or regulatory advice

## Data structure

The registry is built from repository-managed canonical JSON data and static Astro pages. Human-readable HTML, machine-readable metadata, generated statistics, route generation, and deployment verification all resolve through the canonical registry loader in `src/lib/data/registry.ts`.

Current canonical data groups include:

- stable-asset records
- organization records
- stablecoin-organization relationships
- classification records
- reserve and redemption profiles
- event records and Event v2 details
- evidence records and evidence relations
- reserve-report and reserve-context records
- known unknowns
- regulatory notes
- deployment records
- legal profiles, stable-asset relationships, reserve components, and income profiles

Registry v3 is implemented as an additive extension. It preserves current IDs, slugs, routes, and Registry v2 compatibility while adding legal profiles, stable-asset relationships, reserve components, deployment canonicality, expanded income mechanics, and additional event detail types.

See:

```text
docs/roadmap.md
docs/migration/registry-v3-plan.md
docs/stats-spec.md
docs/record-growth-40-to-70.md
```

## Validation and build

```bash
npm install
npm run dev
npm run build
```

The build chain runs baseline, candidate, data, compatibility, classification, profile, event, evidence-relation, Registry v3, final-state, batch-finalization, integrity, Astro, deployment, and public-surface validation. The public-surface checks compare canonical counts with generated HTML, detail routes, the sitemap, version metadata, the manifest, `llms.txt`, and `ai.txt`.

The dedicated finalization guard can also be run directly:

```bash
npm run validate:finalization
```

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
