# Emergency MainStreetUSD / msUSD impaired incident insertion

Date: 2026-06-22

## Decision

MainStreetUSD / msUSD is inserted as an emergency reviewed SOG record with canonical status `impaired` and Registry v2 lifecycle `restricted`.

It is **not** classified as `failed` or `discontinued`.

## Confirmed boundary

- MainStreet documentation describes msUSD as a USDC-referenced stablecoin with a 1:1 backing and redemption claim.
- Direct redemption is limited to eligible users and is subject to documented timing and capacity constraints.
- Official documentation identifies the current Ethereum msUSDV2 contract separately from legacy representations.
- Reporting dated 2026-06-21 states that Accountable terminated verification services on 2026-06-20 after a standards dispute.
- msUSD then suffered a severe market depeg, with reporting placing the low near $0.09.

## Not confirmed

- an actual reserve deficit
- insolvency
- permanent redemption failure
- protocol shutdown
- sustainable recovery to $1
- realized downstream losses in msY, Morpho markets, or related vaults

## Evidence limitation

The exact Accountable primary-post URL and timestamp have not yet been preserved. The record therefore retains medium incident confidence and an explicit known unknown rather than inventing a source.

## Scope

This is an emergency one-record exception. It does not open general 80-to-85 growth and does not change Cloudflare or production publication.

## Validation

- The complete repository validation chain, including `npm run build`, passed on 2026-06-22.
- All six standard pull-request workflows passed on the final reviewed head.
- The integrity audit passed with 81 canonical assets and complete required-layer coverage.
- Temporary transformation, diagnostic, and finalization workflows and scripts were removed before review.
- No Cloudflare deployment or production publication was performed.
