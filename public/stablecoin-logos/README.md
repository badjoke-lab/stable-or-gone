# Stablecoin logo assets

These SVG and PNG assets are vendored locally so public pages never depend on an external image host.

Current audited coverage: **116 of 116 canonical records (100%)**.

The count is record coverage, not merely the number of files in this directory. Every mapped slug is a canonical current SOG route. Obsolete or noncanonical resolver keys are not counted.

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
4. A record without an audited local logo asset uses the same circular mark geometry with a short neutral monogram.
5. The adjacent record name and full symbol remain authoritative; marks are decorative and hidden from assistive technology.
6. No remote runtime fetching is used.
7. A file is not added merely because its filename resembles a symbol. The icon must be attributable to the same asset represented by the canonical SOG record.

The Stablecoins index and home-page preview contain real marks and unsupported-record fallbacks together. Fixed dossier screenshots and the mixed-mark geometry gate verify desktop and mobile rendering.

## Corpus-wide logo disposition closure

All 116 canonical Stablecoin records now have a final local image-mark decision. The adjacent canonical name and symbol remain authoritative. The decision ledger distinguishes token-specific logos from official product, project, issuer, and verified-directory marks; the interface does not imply that every image is a distinct token logo. No generated substitute brand artwork is used.

Decision ledger: `config/stablecoin-logo-decisions.json`.

Imported during the closure pass: 56 records. Current mark-type counts: `official_issuer_mark` 10, `official_product_mark` 8, `official_project_mark` 7, `previously_audited_mark` 60, `token_logo` 30, `verified_directory_mark` 1.
