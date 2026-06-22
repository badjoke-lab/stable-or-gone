# Category B Launch-Date Resolution

Recorded: 2026-06-22

## Result

Four Category B records now have day-level canonical launch dates backed by first-party sources:

- EURS — `2018-06-22`: first EURS emission, confirmed by repeated STASIS anniversary statements.
- Mountain Protocol USDM — `2023-09-11`: Mountain Protocol’s dated public-launch announcement.
- USD0 — `2024-07-09`: Usual’s dated announcement that the public mainnet had launched; earlier permissioned activity remains pre-public context.
- USR — `2024-09-04`: Resolv’s dated public participation opening, corroborated by its exact one-year public-launch anniversary statement.

The unresolved queue changes from 38 to 34. Category B changes from 8 to 4; Category C remains 27 and Category D remains 3.

## Records kept unresolved

- BRZ — first-party material still establishes only 2019.
- Anzen USDz — first-party material still establishes only June 2024; tutorial recording dates are not treated as launch statements.
- Avalon USDa — first-party material still establishes only November 2024.
- Berachain HONEY — Berachain mainnet has a day-level launch date, but the reviewed evidence does not yet establish that mainnet genesis is the correct first-production-availability boundary for HONEY itself.

No month or year was coerced into a day, and exchange listings were not used as default launch boundaries.

## Coupled updates

- canonical stablecoin launch dates and verification notes
- launch events and Event v2 details
- four first-party evidence records
- launch-date unresolved queue
- Registry v2 and v3 count baselines
- generated stats and integrity audit

## Validation

- The cross-layer integrity audit passed with zero critical findings and zero warnings.
- The complete `npm run build` validation chain passed before the clean branch commit.
- Temporary transformation and workflow files were removed from the pull-request diff.
- Canonical asset count remains 81; only evidence and event history grew.

## Production status

No Cloudflare action, production deployment, or public parity assertion is performed.
