# MAI / miMATIC launch and lineage audit

Recorded: 2026-06-24

## Decision

- Canonical public-availability launch: 2021-05-02
- Launch network: Polygon
- Current name: MAI
- Historical name: miMATIC
- Polygon token: 0xa3Fa99A148fA48D14Ed51d610c367C61876997F1
- V2 introduction article: 2022-06-28
- Exact miMATIC-to-MAI rename day: unresolved
- Exact V2 production activation transaction: unresolved

## Launch boundary

QiDao's May 2, 2021 first-party guide documents an operating application, a current MAI debt ceiling, vault creation, collateral deposits, and MAI borrowing on Polygon. SOG uses that day as the canonical public-availability boundary. A later official V2 article independently states that the first Polygon contracts were deployed in May 2021.

## Name continuity

The launch guide already describes MAI as previously miMATIC, and the current official glossary preserves the same relationship. This supports one continuous stablecoin identity but does not establish a day-level rename event. The registry therefore retains miMATIC as an alias without inventing a separate rebrand date.

## V2 boundary

QiDao introduced V2 on June 28, 2022 with a new liquidation engine, risk-management process, chain-specific tailoring, and vault-deprecation tools. The source does not identify one exact activation transaction, so the date is recorded as a version announcement rather than a second asset launch.

## Deployment treatment

The original Polygon MAI token address is normalized as the primary native deployment. Official documentation lists many additional chain addresses, but current support, bridge canonicality, paused fungibility, and retired deployments require a separate inventory audit.

## Remaining unknowns

The exact rename day, exact V2 activation transaction, and complete current native-versus-bridged deployment map remain unresolved.
