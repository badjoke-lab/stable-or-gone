# Stable or Gone v0 Scope

## Goal

SOG v0 should establish the registry foundation.

It should prove that stablecoin records can be displayed as structured, source-backed dossiers without becoming a price dashboard or recommendation site.

## v0 pages

Planned v0 pages:

```txt
/
/stablecoins/
/stablecoin/[slug]/
/issuers/
/issuer/[slug]/
/events/
/event/[slug]/
/models/
/glossary/
/methodology/
/about/
/support/
```

## v0 data files

```txt
data/stablecoins.json
data/issuers.json
data/events.json
data/evidence.json
data/reserve-reports.json
data/known-unknowns.json
```

## v0 data priority

Initial records should include a small, high-value seed set:

- USDT
- USDC
- DAI
- UST / TerraUSD
- BUSD
- FRAX
- TUSD
- FDUSD
- PYUSD
- USDD

The first seed does not need to be exhaustive.

USDT / USDC / DAI / UST / BUSD should be deeper than the rest.

## v0 must include

- stablecoin registry list
- stablecoin detail pages
- issuer pages
- event pages
- methodology
- glossary
- support page
- contact/correction links
- GitHub Issue templates
- Google Form placeholder link fields in docs/UI copy

## v0 can be thin on

- full reserve report history
- full deployment/contract coverage
- full regulatory coverage
- complete depeg history for all stablecoins
- all chains for every token

## v0 must not include

- live market data
- live price charts
- live depeg monitor
- safety score
- ranking
- user voting
- wallet integration
- database
- auth
- paid API dependency

## v0 decision summary

- Glossary is included in v0.
- Guides are deferred to v0.5.
- Issuer pages are included in v0.
- Known unknowns are displayed from v0.
- Reserve reports have a separate JSON file from v0.
- Design direction is Terminal Registry UI.
- Support/donation route is included from v0.
- Contact uses Google Form.
- Public source-backed reports use GitHub Issues.
