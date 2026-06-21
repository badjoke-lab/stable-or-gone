# Batch L Promotion Review

Updated: 2026-06-21

## Scope

Batch L promotes five reviewed stable assets from the Batch 12 research queue:

- M (`sog_st_m0m`)
- Falcon USD (`sog_st_usdf`)
- dForce USX (`sog_st_usx`)
- Anzen USDz (`sog_st_usdz`)
- Avalon USDa (`sog_st_usda`)

The canonical stable-asset count moves from 70 to 75 after this batch is merged.

## Identity decisions

- M0 Extensions and wrapped M remain separate from base M.
- sUSDf remains separate from base USDf.
- sUSX remains separate from base USX; one provisional USX identity is retained across dForce and USX Finance presentation.
- sUSDz remains separate from base USDz.
- sUSDa remains separate from base USDa.

## Safety decisions

- Unsupported day-level launch dates remain null.
- Borrower repayment, Minter burn, and protocol close-position mechanics are not represented as unrestricted holder redemption rights.
- Only reviewed deployment identities are promoted; unresolved cross-chain and bridge maps remain known unknowns.
- Legal issuer, custody, reserve ownership, and bankruptcy treatment remain conservative where official material does not fully resolve them.
- Reserve context rows describe official frameworks and dashboards without inventing unsupported reserve percentages.

## Required layers

Each promoted asset includes:

- canonical stable-asset record
- organization and relationship
- classification
- reserve and redemption profile
- launch event and Event v2 detail
- evidence records and evidence relations
- reserve context
- known unknowns
- deployment
- legal profile
- reserve component
- income profile
- candidate promotion row

## Production gate

This batch reaches the 75-record production-parity checkpoint. After merge, the Cloudflare production deployment must be checked against the canonical 75-record build before any 75-to-80 growth batch begins.
