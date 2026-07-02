# Growth D rebuild from UI v3 main

Date: 2026-07-02
Base commit: `d85b1c41737d10484a5e8117ac67127d3afe2f94`
Status: in progress

## Purpose

Rebuild the reviewed Growth D content from the current UI v3 main instead of merging stale PR #251.

## Targets

- Mento Euro / EURm
- Web 3 Dollar / USD3
- canonical stable assets: 98 to 100

## Required layers

- stablecoin entities
- organizations and relationships
- classification
- reserve and redemption profiles
- deployments
- income profiles
- lifecycle and governance events
- evidence and source identities
- reserve reports and components
- known unknowns
- candidate promotion metadata
- provenance, stats, runtime loaders, and validation

## Safety rules

- preserve the completed Editorial Ledger UI v3 implementation;
- do not copy the stale branch wholesale;
- apply only reviewed Growth D data and loader changes to current main;
- do not assert live collateral quantities without dated evidence;
- do not treat governance proposals as execution proof;
- preserve canonical routes and machine-readable data safety boundaries;
- require all normal workflows and the 100-record validators before merge.
