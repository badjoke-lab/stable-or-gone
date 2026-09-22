# Candidate Stable Asset Control

## Current authority

SOG now separates the original bootstrap candidate ledger from the live unresolved candidate queue.

- `data/candidate-stable-assets.json` is the **legacy/bootstrap candidate ledger** for the original 40 entries. All 40 are already promoted. It remains useful for historical candidate IDs, duplicate control, aliases, and promotion provenance, but it is **not** a complete list of current unlisted candidates.
- `docs/growth/current-unlisted-candidate-queue.json` is the **current carry-forward queue for stable assets that are not canonical/published and still require a promotion, launch, identity, duplicate, or evidence decision**.
- `docs/growth/batch-*-prescreen.json` files remain the review trail that feeds the live queue.

A candidate must not disappear merely because a later growth batch did not revisit it. Every non-canonical candidate found during record-growth work must either remain in the live queue or receive an explicit terminal disposition explaining why it is no longer a new-asset candidate.

Promotion does not occur automatically. A candidate leaves the active unlisted queue only after its canonical promotion commit has actually landed and the ordinary integrity/evidence gates have passed.

The candidate system is not a public recommendation list.

## Live carry-forward rules

For every reviewed candidate that is not yet canonical:

1. record the latest disposition;
2. preserve the latest reviewed batch/date;
3. preserve the next evidence or launch trigger required for another decision;
4. carry the candidate forward even if the next batch focuses elsewhere;
5. do not infer launch, issuer, backing, identity, deployment, or legal status to force promotion;
6. remove it from the active queue only after canonical promotion lands or a terminal exclusion/duplicate/deployment-only decision is recorded.

Planned assets, unresolved identities, unverified launches, and insufficiently sourced assets therefore remain visible to maintainers as pending work rather than being silently dropped.

## Legacy bootstrap ledger fields

`data/candidate-stable-assets.json` retains these fields for its original entries:

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

## Legacy candidate status

- `candidate`: identified but not yet source-reviewed for promotion
- `accepted`: approved for a future record batch but not yet promoted
- `promoted`: represented by a current canonical stablecoin record
- `duplicate`: duplicate of another candidate or record
- `excluded`: reviewed and outside SOG scope
- `watchlist`: retained for monitoring without an addition decision
- `needs_review`: identity or classification remains unresolved

Newer growth batches may use more specific dispositions such as `hold_not_launched`, `launch_verification_hold`, `identity_split_hold`, `needs_exact_identity_review`, or `needs_additional_review`. Those dispositions are normalized only by the live carry-forward queue; they must not be collapsed into a fake canonical fact.

## Priority

- `P0`: immediate working set
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

- A canonical stable-asset identity must remain unique under the normal registry validators.
- A non-promoted candidate must not be promoted into a duplicate canonical identity.
- Symbol and alias collisions are warnings because legitimate collisions can exist, but they must be reviewed.
- Wrappers, receipt tokens, bridged representations, and yield-bearing derivatives must not be promoted as the underlying stablecoin without an explicit classification decision.
- Deployment-only changes belong to the existing asset's deployment/history layer rather than the new-asset queue.
- Lineage-only findings must not create duplicate canonical assets.

## Bootstrap ledger counts

`data/candidate-stable-assets.json` currently contains:

- total unique bootstrap entries: 40
- promoted bootstrap entries: 40
- pending bootstrap promotion: 0

These numbers describe only the historical bootstrap ledger. They are **not** the current canonical registry count and are **not** the count of all unlisted candidates.

## Required direct scans

Duplicate and promotion review must directly inspect the relevant canonical data and current candidate-control sources, including:

- `docs/growth/current-unlisted-candidate-queue.json`
- relevant `docs/growth/batch-*-prescreen.json` review trail
- `data/candidate-stable-assets.json` for bootstrap-history collisions
- all stablecoin data groups
- all Registry v2 classification and profile data groups
- organizations and relationships
- all event and event-detail data groups
- all evidence data groups

GitHub code-search results are not accepted as the sole duplicate check.
