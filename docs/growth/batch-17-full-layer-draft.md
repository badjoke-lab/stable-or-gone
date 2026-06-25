# Batch 17 full-layer draft

Recorded: 2026-06-26

## Scope

This checkpoint converts the five candidates accepted by PR #162 into one reviewed, non-canonical full-layer draft.

Drafted candidates:

- USA₮ / USAT
- EURAU
- Noble Dollar / USDN
- USDH
- AE Coin / AEC

## Layer coverage

Each candidate now has draft decisions for:

- stable-asset identity and lifecycle
- organization and role boundaries
- classification
- reserve context
- redemption access
- launch or lifecycle event
- evidence set
- deployment boundaries
- legal profile
- reserve component
- income profile
- five explicit known unknowns

The draft contains five stable-asset identities, ten organization-role drafts, five event drafts, twenty-one evidence sources, seven deployment drafts, and five explicit unknowns per candidate.

## Important boundaries

- USA₮ is separate from USD₮ / USDT; Anchorage Digital Bank remains the legal issuer.
- EURAU is issued by AllUnity; shareholders, reserve banks, custodians, liquidity providers, and distributors remain separate roles.
- Noble Dollar is separate from Neutrino USD and keeps the disambiguated `sog_st_nobleusdn` identity.
- USDH remains proposed as limited / winding down while migration, liquidity transition, and final support dates remain unresolved.
- AE Coin separates AED Stablecoin LLC's B2B issuer role from appointed custody, transfer, conversion, and end-customer agents.
- Noble Dollar's native yield is separated from vault boosts, points, and integrator incentives.
- USDH reserve income assigned to ecosystem programs is not treated as intrinsic holder yield.

## Safety

This PR does not change the canonical 87-record registry. Unsupported launch dates for USDH and AE Coin remain null. Contract addresses, exact reserve allocations, unsupported legal claims, unresolved agent inventories, and incomplete migration chronology remain null or explicit review queues.

## Next

After this draft passes CI, open a separate bounded canonical promotion PR that:

1. splits the draft into production record files;
2. wires runtime loaders and validators;
3. updates v2/v3 baselines and generated outputs;
4. promotes candidates 88–92;
5. runs all six workflows;
6. publishes and verifies production only after merge.
