# USDT on TRON issuer-control event source snapshot

Reviewed at: 2026-06-14 UTC

## Record

```text
Stablecoin: USDT
Issuer: Tether
Network: TRON
Token standard: TRC-20
Event date: 2026-06-12
Event type: issuer_freeze
Event subtype: address_blacklisting
```

## Values reviewed

```text
TRON USDT contract:
TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t

Initial recipient:
TA6YHqB2xh5HhfmC7WoLQaWmqq7Vv4zCoQ

Initial transfer transaction:
516109e27db098f540d3f11d12222ceac95dac39de47f783313a25e60746c6c2

Initial transfer amount:
120,271,055.092505 USDT

Reported blacklisted address:
T8zrPEsStbZAUx2SBhD4oHz8UW3FX9Ak9W

Reported balance:
72,030,295.55 USDT
```

## Sources reviewed

- Tether supported-protocol documentation.
- TRONSCAN transaction record.
- TRONSCAN blacklist API documentation.
- USDTBanList public alert.
- ZachXBT Investigations post.
- CoinDesk reporting.
- The Crypto Times reporting.

## Unresolved fields

- Exact blacklist-add transaction hash.
- Direct blacklist API response for this address.
- Legal basis.
- Requesting authority.
- Source incident identity.
- Duration and final outcome of the restriction.

Blacklisting is recorded as an issuer-control action and not as a burn or final asset disposition.
