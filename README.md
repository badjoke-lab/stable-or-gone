# Stable or Gone

Stable or Gone (SOG) is a public stablecoin history registry focused on stablecoin lifecycles, issuers and organizations, reserve disclosures, redemption access, depeg events, wind-downs, migrations, failures, and source-backed evidence.

Public site: https://sog.badjoke-lab.com/

SOG is not a live price dashboard, not a trading terminal, not a safety ranking, and not investment advice.

## What the registry tracks

Stablecoins should not be understood only by current price or market cap. SOG records:

- stablecoin identity, symbol, peg, lifecycle status, and issuance status
- issuer, organization, protocol, network, and reserve-organization relationships
- launches, depegs, regulatory actions, migrations, wind-downs, failures, and other material events
- reserve disclosure state and historical reserve-report references
- redemption access, eligibility, settlement asset, and restrictions when available
- source-backed evidence for claims
- known unknowns and unresolved record questions

## What SOG does not do

SOG does not provide:

- stablecoin safety scores
- buy, sell, hold, avoid, or redemption recommendations
- yield comparison
- live depeg alerts
- market cap ranking
- issuer, exchange, wallet, or account support
- investment, legal, financial, tax, or regulatory advice

## Data structure

The registry is built from repository-managed JSON data and static Astro pages.

Core data groups include:

- stablecoin records
- organization records
- stablecoin-organization relationships
- event records
- evidence records
- reserve report references
- known unknowns
- regulatory notes
- deployment records
- Registry v2 classification records
- Registry v2 reserve and redemption profiles

Current Registry v2 migration status is tracked in `docs/roadmap.md` and `docs/migration/`.

## Local development

```bash
npm install
npm run dev
```

Validate and build:

```bash
npm run build
```

The build chain runs baseline validation, data validation, Registry v2 compatibility validation, classification validation, profile validation, Astro check, and Astro build.

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

Stable or Gone is a historical and reference-oriented registry. Information may be incomplete, outdated, disputed, or dependent on source interpretation. Always check current issuer terms, exchange notices, regulator publications, and market data before making decisions.
