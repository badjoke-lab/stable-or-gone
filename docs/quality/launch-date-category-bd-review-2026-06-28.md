# Launch-date Category B/D source review

Status: supporting audit  
Date: 2026-06-28  
Roadmap item: PR #218

## Scope

This review rechecked seven unresolved launch-date records using first-party, regulatory, and on-chain sources where available:

```text
BRZ
HONEY
USDz
HUSD
TRYB
USYC
AE Coin
```

The purpose was not to force dates. A canonical day is accepted only when the evidence identifies the same public launch boundary used by SOG.

## Result

No canonical `launch_date` was promoted. All seven records remain `null`.

The unresolved queue remains 20 records, but the reason distribution changes from:

```text
B 3 / C 13 / D 4
```

to:

```text
B 3 / C 17 / D 0
```

Category D is cleared because all four former D records now have meaningful source trails. Their remaining problem is boundary ambiguity, not total absence of sources.

## Record decisions

| Asset | Previous | Result | Strongest bounded conclusion |
|---|---:|---:|---|
| BRZ | B | B | Transfero establishes 2019; a dated Transfero publication shows BRZ launch material existed by 2019-07-25. |
| HONEY | B | C | Berachain mainnet launched 2025-02-06, but no HONEY-specific first mint, redemption, or public-mint boundary was recovered. |
| USDz | B | B | Anzen establishes June 2024 only; no day-level public-availability boundary was recovered. |
| HUSD | D | C | Issuer announcement on 2019-07-17 preceded operational HUSD/PAX conversion by 2019-10-18; the exact launch boundary remains between them. |
| TRYB | D | B | BiLira establishes initial Ethereum release in 2019 only. |
| USYC | D | C | Circle publishes a 2023-05-01 fund inception date, which is not proof of token launch or first mint. |
| AE Coin | D | C | Regulatory approval preceded live customer access; first issuance and first customer-availability day remain unresolved. |

## Boundary rules applied

- Network mainnet launch is not automatically the token launch.
- Fund inception is not automatically the token launch.
- Regulatory approval is not automatically first issuance or public availability.
- An announcement that a product will launch is not automatically the launch date.
- A later operational feature proves the product was live by that date, not that it launched that day.
- Month- and year-level evidence remain month- and year-level bounds.

## Machine-readable changes

`data/quality/launch-date-unresolved.json` now records:

- `last_reviewed: 2026-06-28` for all seven records;
- reviewed source URLs;
- stronger best-known ranges;
- corrected reason codes;
- category totals `B 3 / C 17 / D 0`.

The canonical stablecoin files, event files, routes, public counts, and build output remain unchanged.

## Follow-up

PR #219 begins the first bounded Category C review group. Category C work must continue to separate contract deployment, first mint, public interface availability, migration, rebrand, and version activation.

## Deployment classification

```text
No production deployment required
```
