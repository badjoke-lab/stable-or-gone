# Russia USDT Regulation Guide Update Authority — 2026-08-11

## Decision

Open one bounded public-guide implementation lane for the 2026 Russia crypto-market regulation update.

This lane is prompted by a new public claim that Russia approved Bitcoin, Ethereum, and USDT for public exchange trading. The claim is not accepted verbatim. The reviewed source boundary supports a narrower and more durable statement:

- the Russian crypto-market law enters into force on 2026-09-01;
- non-qualified investors may buy the most liquid cryptocurrencies after testing and within RUB 300,000 per year through one intermediary;
- qualified investors have broader cryptocurrency purchase/sale access after testing;
- the Bank of Russia states that the framework also applies to foreign stablecoins;
- cryptocurrency payments inside Russia remain prohibited;
- the Bank of Russia has drafted rules for organised trading;
- First Deputy Governor Vladimir Chistyukhin told RBC that Bitcoin, Ethereum, and USDT are the three currencies currently meeting the initial access principles, but this must not be rendered as a permanent statutory whitelist.

## Source boundary

Primary:

- Bank of Russia — Russia introduces cryptocurrency regulation, 2026-07-21
- Bank of Russia — first draft regulations for organised cryptocurrency trading, 2026-07-27
- Bank of Russia — cryptocurrency market prospects / stablecoin treatment, 2025-12-23

Secondary direct-interview support:

- RBC, 2026-06-04 — interview/reporting quoting Bank of Russia First Deputy Governor Vladimir Chistyukhin on Bitcoin, Ethereum, and USDT as the initial three currencies meeting the principles.

Discovery only:

- Watcher.Guru X post dated 2026-08-11. It is not canonical Evidence and is not sufficient authority for legal wording.

## Authorized implementation

A later implementation PR may change only:

```text
src/pages/guides/russia-stablecoin-rules-2026/index.astro
src/pages/guides/global-stablecoin-regulation-2026/index.astro
src/data/guideCatalog.ts
```

Required public outcome:

1. refresh the Russia guide through 2026-08-11;
2. replace the older consultation-only framing with the enacted 2026-09-01 framework and July implementation work;
3. explain the BTC/ETH/USDT point with explicit source qualification;
4. preserve the domestic-payment prohibition and the distinction between investment/trading access and payment use;
5. update the global comparison and timeline consistently;
6. record the update in guide revision history.

## Market Access Record v1 decision

No canonical Market Access promotion is authorized.

`docs/market-access-record-spec.md` defines the canonical analytical unit as asset × jurisdiction × platform/service × function × access state × effective date. The current Russia-wide law and regulator material do not establish a named provider/service function state. A country-level legal framework must not be inflated into provider-scoped `buy_sell`, `deposit`, `withdrawal`, or `external_wallet_transfer` rows.

Canonical Market Access therefore remains 12.

## Explicit prohibitions

The implementation must not:

- change USDT lifecycle status;
- add or alter canonical Market Access Records;
- add canonical Evidence identities or Evidence Relations;
- claim that Russia permanently whitelisted exactly BTC, ETH, and USDT;
- claim universal Russian access to USDT;
- infer provider-level deposit, withdrawal, or wallet-transfer availability;
- imply government endorsement, safety, ranking, or recommendation;
- change unrelated routes, UI, CSS, schema, taxonomy, or canonical data.

## Canonical preservation

```text
Stable assets: 119
Evidence: 585
Evidence Relations: 585
Market Access Records: 12
Canonical hash: sha256:f386c1043ca5e83cafbd88e99746d0609aab0154ed48de1970677758a66ed5fa
Canonical file count: 466
Expected canonical delta: 0
```

## Sequencing

Evidence Archive Payload Verification Batch 2 remains preserved at its completed-review `REVIEW_GATE` boundary while this bounded public-guide lane is active.

After the guide implementation is reviewed, merged, and production-verified, restore:

```text
Evidence Archive Payload Verification Batch 2
reviewed: 10
proposals: 8
o safe change: 2
stage: REVIEW_GATE
canonical archive additions authorized: 0
```

No archive implementation is authorized by this amendment.
