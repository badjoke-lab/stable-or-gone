# SPOT launch and version-lineage audit

Recorded: 2026-06-24

## Provisional decision

- Canonical branded-asset launch candidate: 2022-12-08
- Original network: Ethereum
- Current SPOT token proxy: `0xC1f33e0cf7e40a67375007104B929E49a581bafE`
- Current bond issuer: `0x5613Fc36A431c9c2746763B80C1DD89e03593871`
- Current router: `0xCe2878d1f2901EFaF48cd456E586B470C145d1BC`
- Current rollover vault: `0x82A91a0D599A45d8E9Af781D67f695d7C72869Bd`
- Current fee policy: `0x8689Fa9991834Bcf0387b31b7986ac311bAb6ab5`
- Version treatment: one branded SPOT asset and one upgradeable token-proxy lineage
- Current repository version state: v5, not v2

The 2022-12-08 Ampleforth launch article states that SPOT was live. This is the strongest recovered day-level first-party public-production boundary and is the candidate canonical launch date. It must still be applied through a synchronized canonical update rather than edited in isolation.

## Recovered boundaries

### Initial launch

- Ampleforth published `SPOT — A Responsibly-Designed, Inflation Resistant Store of Value` on 2022-12-08 with the launch statement `Spot is live`.
- The later official v2 governance proposal states that SPOT had been operating since December 2022.
- The current official repository identifies SPOT as an Ethereum perpetual-note token and publishes its mainnet proxy and supporting component addresses.

### v2 rollout

- The official governance proposal was posted on 2024-04-09.
- The signal vote passed on 2024-04-19.
- Rollout was planned no earlier than 2024-04-22.
- The proposal explicitly describes v2 as an in-place upgrade.
- Existing SPOT holders and stAMPL stakers did not need to migrate.
- The underlying ButtonTranche contracts were not replaced as part of the upgrade.
- The exact on-chain v2 execution day remains unresolved and must not be inferred from the earliest permitted rollout date.

### Later upgrades and current state

- The official repository retains the same SPOT token proxy through later upgrade scripts.
- The current repository includes a v5 upgrade path using the same SPOT proxy and rollover-vault proxy.
- Ampleforth governance material confirms that the v5 upgrade was executed, but the exact execution transaction and day still require normalization.
- The existing SOG wording that treats the current protocol as v2 and withholds the canonical SPOT address is outdated.

## Version boundary

SPOT v2 and v5 are protocol upgrades within one asset and proxy lineage. They are not separate stable assets, token replacements, bridge deployments, or holder migrations. SOG should therefore retain one `sog_st_spot` entity and one Ethereum native SPOT deployment while representing material upgrades through events, details, evidence, component history, and known unknowns.

The current SPOT token proxy is the same address referenced by the v2 and v5 upgrade scripts. Supporting components such as router, fee policy, bond issuer, and implementation contracts can change without creating a new SPOT asset identity.

## Remaining source work

- Recover or corroborate the initial Ethereum mainnet deployment transaction and first public-use boundary.
- Recover the exact v2 proxy-upgrade execution transaction and day.
- Recover the exact v5 proxy-upgrade execution transaction and day.
- Normalize the original and current bond-issuer history.
- Normalize router, fee-policy, rollover-vault, and implementation-contract changes without treating them as new SPOT tokens.
- Review the v2 tranche-ratio change and later collateral-rotation mechanics as protocol events.
- Recover day-level first-party or on-chain boundaries for Rotation Vault introduction and subsequent collateral rotations.
- Determine which superseded support components should be recorded as legacy related contracts rather than stable-asset deployments.

## Canonical update plan

1. Set the SPOT canonical launch date to `2022-12-08` after the final synchronized source check.
2. Add a dedicated initial-launch event and Event v2 launch detail.
3. Add first-party launch evidence and relate it to the launch event.
4. Rewrite the current v2 event as an in-place protocol-upgrade event rather than a migration between token identities.
5. Keep the v2 execution date null until the exact execution transaction or an equivalent first-party day-level source is recovered.
6. Add the v5 upgrade as a separate version-history event, conservatively dated only when the execution boundary is recovered.
7. Populate the Ethereum SPOT deployment with the official token proxy and current canonical component context.
8. Narrow the SPOT contract/version known unknown from `address unresolved` to the remaining implementation, component-history, and execution-date questions.
9. Retain collateral-rotation history as unresolved until day-level evidence is normalized.
10. Remove SPOT from the launch-date unresolved queue only in the synchronized canonical update.
11. Expected queue effect after successful canonical update: unresolved launch dates `29 -> 28`; Category C `23 -> 22`.
12. Synchronize generated stats, integrity audit, Registry v3 baselines/views, README, and roadmap in the same canonical PR.

## Do not assert

- Do not record 2024-04-22 as the v2 execution date merely because rollout could begin on or after that day.
- Do not record the date of a later confirmation comment as the v5 execution date without the execution transaction or equivalent source.
- Do not describe v2 or v5 as a new SPOT token launch.
- Do not describe a holder migration, token swap, or contract-address replacement.
- Do not treat router, fee-policy, bond-issuer, or implementation changes as separate SPOT deployments.
- Do not assign collateral-rotation dates from undated current documentation.

## Primary sources

- Ampleforth launch article: `https://brandoniles.medium.com/spot-the-inflation-resistant-store-of-value-87e8112468b2`
- Ampleforth governance v2 proposal: `https://forum.ampleforth.org/t/proposal-initiate-rollout-of-spot-v2/738`
- Official SPOT repository: `https://github.com/ampleforth/spot`
- Official mainnet addresses: `https://github.com/ampleforth/spot/blob/main/spot-contracts/README.md`
- Official v2 upgrade script: `https://github.com/ampleforth/spot/blob/main/spot-contracts/tasks/scripts/mainnet_v2.sh`
- Official v5 upgrade script: `https://github.com/ampleforth/spot/blob/main/spot-contracts/tasks/scripts/mainnet_v5.sh`

## Production status

This audit plan changes no canonical stable-asset, event, evidence, deployment, generated, Cloudflare, or public-production data. It establishes the bounded research and update rules for the next SPOT canonical-quality PR.
