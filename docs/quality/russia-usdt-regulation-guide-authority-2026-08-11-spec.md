# Russia USDT Regulation Guide Authority — Quality Specification

Status: active authority specification  
Date: 2026-08-11

## Purpose

Bind one source-reviewed public Guide update for Russia without creating a false country-wide or provider-wide Market Access claim.

## Reviewed source facts

The implementation may state, with source attribution and temporal qualification, that:

1. Russia's 2026 crypto-market law enters into force on 2026-09-01.
2. Non-qualified investors may buy the most liquid cryptocurrencies after testing and within RUB 300,000 per year via one intermediary.
3. Qualified investors may purchase and sell cryptocurrencies after testing without the non-qualified amount limit.
4. Bank of Russia says the requirements also apply to foreign stablecoins.
5. Cryptocurrency payments within Russia remain prohibited.
6. Bank of Russia has published draft regulations for organised trading in digital currencies and digital rights.
7. Bank of Russia First Deputy Governor Vladimir Chistyukhin told RBC that Bitcoin, Ethereum, and USDT are the three currencies currently meeting the initial principles. This is interview-level current implementation guidance, not a permanent statutory whitelist.

## Public wording requirements

The Russia guide and global comparison must distinguish:

```text
enacted law / regulator framework
vs
current asset set described by a Bank of Russia official
vs
provider-specific actual availability
```

Allowed formulation examples:

- `The Bank of Russia's July summary says non-qualified investors will be limited to the most liquid cryptocurrencies.`
- `In June, First Deputy Governor Vladimir Chistyukhin identified Bitcoin, Ethereum, and USDT as the initial three meeting those principles.`
- `That does not establish a permanent three-asset statutory whitelist or prove that every Russian platform currently offers USDT.`

Disallowed formulations:

- `Russia permanently approved only BTC, ETH and USDT.`
- `USDT is now available on all Russian exchanges.`
- `Russia approved USDT for payments.`

## Market Access v1 gate

No canonical Market Access row may be created from this review.

Reason: the v1 schema requires platform/service and function scope. The current law/regulator sources establish jurisdiction-level framework conditions, not a named provider/service observation for `buy_sell`, `deposit`, `withdrawal`, `external_wallet_transfer`, `direct_issuer_mint`, or `direct_issuer_redemption`.

A later source review may consider a canonical Market Access candidate only after a named regulated intermediary or organised-trading platform publishes function-scoped USDT support with an effective date.

## Canonical/public boundaries

Canonical delta must be zero. The implementation may edit exactly three existing Guide/catalog files named by the authority contract. It may not edit canonical data, schemas, taxonomy, stable-asset status, Evidence, Evidence Relations, Market Access, CSS, or unrelated public routes.

## Verification

Authority PR:

- dedicated authority validator passes;
- active-workstream validator points only to the authority validator;
- canonical checkpoint hash/counts are unchanged;
- source URLs and prohibited wording are bound in the machine-readable contract.

Implementation PR:

- update is current through 2026-08-11;
- Russia and global Guide wording agree;
- guide catalog records `updatedAt` and a revision note;
- no Watcher.Guru URL appears as a source in public Guide content;
- canonical hash/counts remain unchanged;
- public build and route validation pass;
- production verification is required after merge.

## Exit

After implementation, production verification, and closeout, restore Evidence Archive Payload Verification Batch 2 to `REVIEW_GATE`. No archive promotion is implied or authorized.
