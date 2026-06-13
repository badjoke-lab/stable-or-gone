# Candidate Stable Asset Master List

## Purpose

`data/candidate-stable-assets.json` is SOG's internal candidate-control ledger. It prevents duplicate additions, records naming and symbol conflicts, separates stablecoins from adjacent stable-value assets, reserves proposed record IDs, and preserves inclusion or exclusion decisions before promotion into the public registry.

The candidate master is not a public recommendation list and does not promote assets automatically.

## Required fields

- `candidate_id`
- `proposed_record_id`
- `slug`
- `name`
- `symbol`
- `aliases`
- `candidate_type`
- `asset_class`
- `reference_kind`
- `reference_label`
- `priority`
- `status`
- `target_batch`
- `notes`

## Candidate status

- `candidate`: identified but not yet source-reviewed for promotion
- `accepted`: approved for a future record batch but not yet promoted
- `promoted`: represented by a current canonical stablecoin record
- `duplicate`: duplicate of another candidate or record
- `excluded`: reviewed and outside SOG scope
- `watchlist`: retained for monitoring without an addition decision
- `needs_review`: identity or classification remains unresolved

## Priority

- `P0`: immediate ten-item working set
- `P1`: candidate for the path toward 100 records
- `P2`: medium-term candidate
- `P3`: research required
- `P4`: adjacent asset or watchlist
- `PX`: excluded or duplicate

## Candidate type

- `stablecoin`
- `stable_value_asset`
- `stablecoin_adjacent`
- `tokenized_commodity`
- `experimental_stabilization_asset`
- `reserve_asset`
- `unknown`

## Asset class

- `stablecoin`
- `stable_value_asset`
- `stablecoin_adjacent`
- `tokenized_commodity`
- `yield_bearing_stable_receipt`
- `experimental_stabilization_asset`
- `reserve_asset`
- `unknown`

## Reference kind

- `fiat`
- `commodity`
- `crypto_asset`
- `index`
- `floating`
- `other`
- `unknown`

## Identity rules

- `candidate_id`, `slug`, and `proposed_record_id` must be unique.
- A promoted entry must match one canonical stablecoin record by ID and slug.
- A non-promoted entry must not collide with an existing stablecoin ID or slug.
- Symbol and alias collisions are warnings because legitimate collisions can exist, but they must be reviewed.
- Existing stablecoins must each have one promoted candidate-master entry.
- Wrappers, receipt tokens, bridged representations, and yield-bearing derivatives must not be promoted as the underlying stablecoin without an explicit classification decision.

## Current counts

- total unique entries: 28
- promoted entries: 28
- P0 entries: 10
- P0 promoted: USDe, sUSD, MIM, FEI, USDN, RAI, PAXG, XAUT, SPOT, Nuon
- P0 pending promotion: 0

Batch A promoted MIM, FEI, and USDN. Batch B promoted RAI, PAXG, XAUT, SPOT, and Nuon. USDe and sUSD remain the same canonical records and received classification and evidence expansion rather than duplicate entries.

## Required direct scans

The validator must directly read:

- `data/candidate-stable-assets.json`
- all stablecoin data groups
- all Registry v2 classification and profile data groups
- organizations and relationships
- all event and event-detail data groups
- all evidence data groups

GitHub code-search results are not accepted as the sole duplicate check.
