# Batch 16 full-layer draft

Recorded: 2026-06-25

## Scope

This checkpoint converts the five candidates accepted by PR #158 into one reviewed, non-canonical full-layer draft.

Drafted candidates:

- United Stables U
- USDGO
- SoFiUSD / SOFID
- Solstice USX
- Origin Dollar / OUSD

## Layer coverage

Each candidate now has draft decisions for:

- stable-asset identity and lifecycle
- organization and role boundaries
- classification
- reserve context
- redemption access
- launch event
- evidence set
- deployment boundaries
- legal profile
- reserve component
- income profile
- explicit known unknowns

The draft contains five stable-asset identities, six organization roles, five launch events, eighteen evidence sources, seven deployments, and five explicit unknowns per candidate.

## Important boundaries

- USDGO is issued by Anchorage Digital Bank; OSL branding and distribution are separate roles.
- SoFiUSD and the SOFID symbol are one stablecoin identity; future tokenized deposits are separate products.
- Solstice USX is not dForce USX, and eUSX / YieldVault positions are separate representations.
- OUSD is the rebasing base asset; wrapped OUSD and other Origin products remain separate.
- United Stables U is separate from exchange rewards, staking positions, and wrapped forms.

## Safety

This PR does not change the canonical 82-record registry. Contract addresses, exact reserve allocations, unsupported legal claims, and unresolved chronology remain null or explicit review queues.

## Next

After this draft passes CI, open a separate bounded canonical promotion PR that:

1. splits the draft into the production record files;
2. wires runtime loaders and validators;
3. updates v2/v3 baselines and generated outputs;
4. promotes candidates 83–87;
5. runs all six workflows;
6. publishes and verifies production only after merge.
