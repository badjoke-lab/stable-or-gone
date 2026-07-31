# Stablecoin logo assets

These SVG and PNG assets are vendored locally so public pages never depend on an external image host.

Public display coverage is fixed at **98 direct Stablecoin/product logos of 117 canonical records (83.76%)**. The remaining **19 records use the shared neutral monogram fallback**.

A project, issuer, or third-party directory mark is not displayed as though it were the Stablecoin's own logo. Those researched marks remain classified in the research ledger, while `config/stablecoin-logo-display-policy.json` is the rendering source of truth.

## Sources and licenses

### Original CC0 set

Source: `spothq/cryptocurrency-icons` (`svg/color`), distributed under CC0-1.0.

```text
dai.svg
gusd.svg
husd.svg
pax.svg            # canonical SOG slug: usdp
paxg.svg
sai.svg
tusd.svg
usdc.svg
usdt.svg
```

### Expanded MIT set

Source: `0xa3k5/web3icons`, token `background` variants, pinned to commit:

```text
113249b982b3ec5e597feee1ad03d15961e6598b
```

License notice: `LICENSE-web3icons.txt`.

```text
beanstalk-bean.svg
berachain-honey.svg
crvusd.svg
djed.svg
dola.svg
eurc.svg
eurs.svg
eurt.svg
fdusd.svg
fei.svg
frax.svg
gho.svg
gyen.svg
iron.svg
ist.svg             # canonical SOG slug: agoric-ist
lusd.svg
mim.svg
musd.svg
near-usn.svg
ousd.svg            # canonical SOG slug: origin-dollar
pyusd.svg
rai.svg
susd.svg
tryb.svg
united-stables-u.svg
usdd.svg
usde.svg
vai.svg
xaut.svg
xsgd.svg
```

Only SVG identifiers and formatting needed for safe local coexistence may be normalized. The icon artwork is otherwise preserved.

### Address-verified Trust Wallet Assets set

Source: `trustwallet/assets`, distributed under the MIT License and pinned to commit:

```text
34d808acb2a71e55c41505cd8f15c827db21b0fc
```

License notice: `LICENSE-trustwallet-assets.txt`. Each logo below was matched by an exact canonical deployment identifier recorded in SOG, not by symbol alone.

```text
agora-ausd.png
basis-cash.png
busd.png
falcon-usdf.png
lisusd.png
mento-dollar.png
qidao-mai.png
sdai.png
usd0.png
usd1.png
ust.png
```

### BGD Labs MIT set

Source: `bgd-labs/web3-icons`, distributed under the MIT License and pinned to commit:

```text
fd03ac0b5aaaeb9d0e6b85958e56eaaf9613db22
```

License notice: `LICENSE-bgd-web3-icons.txt`. Every accepted entry was manually checked against the canonical SOG asset name and unique symbol. The `EURm` file was rejected because it represents Monerium EUR Money rather than Mento Euro.

```text
alusd.svg             # Alchemix USD
usdtb.svg             # Ethena USDtb
mountain-usdm.svg     # Mountain Protocol USD
susde.svg             # Staked USDe
eura.svg              # Angle Euro
monerium-eure.svg     # EURe
rlusd.svg              # Ripple USD
usdg.svg               # Global Dollar
usds.svg               # USDS
```

### Official Money on Chain GPL-3.0 set

Source: `money-on-chain/stable-protocol-interface`, pinned to commit:

```text
9398b8bfc70ee2c84528560ae0ec4f9055179439
```

License notice: `LICENSE-money-on-chain-gpl3.txt`. `dollar-on-chain.svg` is the official `icon-tp.svg`; the same source code maps the TP currency to `docBalance`, establishing its identity as Dollar on Chain.

```text
dollar-on-chain.svg
```

## Resolution rules

1. Exact canonical SOG slug is checked first.
2. Symbol lookup is used only for an explicit allow-list of symbols confirmed unique in the current corpus.
3. Ambiguous symbols such as `USX`, `USDX`, and `USDN` never resolve by symbol alone.
4. Only token-specific or product-specific marks are displayed as logos.
5. Records supported only by a project, issuer, or directory mark use the shared neutral monogram fallback.
6. The adjacent record name and full symbol remain authoritative; marks are decorative and hidden from assistive technology.
7. No remote runtime fetching is used.
8. A file is not added merely because its filename resembles a symbol. The image must be attributable to the same asset represented by the canonical SOG record.

The Stablecoins index, home preview, and dossiers therefore render **98 direct logos and 19 neutral fallbacks** with identical geometry. The mixed-mark and all-record catalog gates verify desktop and mobile rendering.

## Corpus-wide disposition closure

All 117 canonical Stablecoin records have a final display disposition:

- 98 direct Stablecoin/product logos;
- 19 neutral fallbacks where research found only project, issuer, or directory-level artwork, including MNEE pending a separately reviewed product-specific mark.

Research ledger: `config/stablecoin-logo-decisions.json`.
Public display policy: `config/stablecoin-logo-display-policy.json`.
