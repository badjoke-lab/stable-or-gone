# World Money / Ripio wFIAT / World Chain review — 2026-09-20

Status: research only / no canonical authorization
Tracking issue: #669

## Purpose

Review the 2026-09-17 World Money rollout as a stable-asset distribution signal without converting the "150+ countries" product-rollout claim into asset-level market access.

This note separates:

1. stable-asset identity;
2. issuer/backing evidence;
3. World Chain deployment;
4. World Money provider/distribution access;
5. country/function-specific fiat rails.

Those layers must not be collapsed.

## World Money boundary

World launched World Money on 2026-09-17 and described stablecoin balances, transfers, trading and country-dependent financial features.

The launch is relevant to SOG as a **distribution/access surface**, not as a new stablecoin identity.

The product-level "150+ countries" rollout does not prove that every supported stablecoin is available, redeemable, transferable, or cash-out enabled in every one of those countries.

## Existing canonical EURC

SOG already has canonical EURC:

```text
id: sog_st_eurc
slug: eurc
issuer: Circle
status: active
peg: EUR
model: fiat_backed
```

Therefore EURC is **not** a new-asset candidate.

Circle first-party material separately states that EURC is natively available on World Chain. Any SOG implementation should treat this as deployment/distribution/access enrichment of the existing EURC identity.

Primary sources:

- Circle, “EURC and USDC Are Now Available on World Chain”
  https://www.circle.com/blog/eurc-and-usdc-are-now-available-on-world-chain
- Circle developer contract-address documentation
  https://developers.circle.com/stablecoins/usdc-contract-addresses

## Ripio wFIAT suite

Ripio first-party material identifies the following six local-currency stablecoins:

- wARS
- wBRL
- wCLP
- wCOP
- wMXN
- wPEN

Ripio describes the suite as local-currency stablecoins backed 1:1 by corresponding fiat reserves, with reserves held at regulated financial institutions and independently attested.

Primary sources:

- Ripio wFIAT transparency / product page
  https://www.ripio.com/en/wfiat
- Ripio Celo launch announcement
  https://www.ripio.com/en/blog/ripio-launches-six-local-stablecoins-on-celo
- Ripio Arc launch announcement
  https://www.ripio.com/en/blog/ripio-wfiat-stablecoins-arrive-on-arc

The wFIAT transparency material also contains World Chain deployment/history information for the suite.

## World Money / World Chain references

World first-party material establishes:

- wARS as a Local Stablecoin example;
- supported Local Stablecoins can be sent and received on World Chain;
- fiat cash-in/cash-out depends on country and third-party provider availability;
- virtual-account mappings currently include:
  - USD → USDC
  - ARS → wARS
  - COP → wCOP
  - MXN → WLD
- WLD is not a stablecoin and must not enter SOG merely because it is used in a fiat-account flow;
- MiniKit 2.0 material lists expanded support including wARS, wCOP, wMXN, wBRL, wPEN, wCLP and EURC.

Primary sources:

- World Money launch
  https://world.org/blog/announcements/world-money
- Local Stablecoin definition
  https://support.world.org/hc/en-us/articles/44774231726867-What-is-a-Local-Stablecoin
- Local Stablecoin buy/deposit/withdraw
  https://support.world.org/hc/en-us/articles/45222279076243-How-do-I-buy-deposit-and-withdraw-Local-Stablecoins
- Local Stablecoin send/receive
  https://support.world.org/hc/en-us/articles/45222251023763-How-do-I-send-and-receive-Local-Stablecoins
- Virtual Accounts
  https://support.world.org/hc/en-us/articles/44413326159635-What-is-a-Virtual-Account
- MiniKit 2.0
  https://world.org/blog/announcements/build-once-deploy-anywhere-minikit-2.0-is-live-for-world-developers

## Current candidate disposition

### EURC

`existing_canonical_update_review`

Reason:
- canonical identity already exists;
- first-party Circle material supports World Chain deployment;
- World Money / MiniKit material supplies distribution context.

### wARS / wBRL / wCLP / wCOP / wMXN / wPEN

`needs_identity_and_duplicate_review`

Reason:
- first-party Ripio material strongly supports existence, six-asset suite identity and 1:1 fiat-collateral framing;
- repository code search did not surface an obvious canonical match for these symbols during this review;
- that search result is not itself a sufficient exhaustive duplicate gate;
- exact issuer/legal-entity, redemption, contract/deployment and evidence relationships must still pass normal SOG canonical review.

## Required canonical gate

Before any new stable-asset promotion:

1. perform exhaustive current-main duplicate and lineage scan;
2. resolve the exact issuer / responsible legal entity from first-party material;
3. preserve the six assets as separate stable-asset identities only if SOG identity rules support that treatment;
4. verify per-asset peg and backing;
5. verify redemption / conversion boundary without turning secondary-market access into issuer redemption;
6. verify exact World Chain deployment identity / contract where required;
7. create evidence relationships at claim level;
8. keep provider-scoped World Money access separate from country-wide availability;
9. do not derive universal "150+ countries" access;
10. do not infer legality, safety, reserve quality beyond the reviewed source language, or guaranteed redemption.

## Marketing-count caution

World Money marketing references a larger stablecoin/local-currency set, but the reviewed text sources used here do not provide a complete authoritative eight-local-stablecoin identity list.

Do not invent a missing eighth asset to reconcile a marketing count.

## Publication path

After canonical review, the World Money rollout is suitable for an SOG Update Feed / article focused on:

- local stablecoins entering a large consumer wallet/distribution surface;
- World Chain deployment;
- country/provider-specific fiat rails;
- why "150+ countries" is not equivalent to 150+ country availability for every stablecoin.

This research note does not authorize canonical changes.
