# Stablecoin logo assets

These SVG and PNG assets are vendored locally so public pages never depend on an external image host.

Public display coverage is fixed at **101 direct Stablecoin/product logos of 119 canonical records (84.87%)**. The remaining **18 records use the shared neutral monogram fallback**.

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

### Phase D first-party Stablecoin/product marks

Phase B re-audited the 21 neutral fallbacks. Phase D then directly inspected the proposed artwork before import and promoted only the three already-approved slugs below. No additional Stablecoin was promoted.

#### MNEE

```text
local path:        /stablecoin-logos/mnee.svg
source page:       https://www.mnee.io/
source asset:      https://www.mnee.io/mnee.svg
source class:      official_product_page_asset
SHA-256:           ddee8994d9b3ac38835ed5f99d01a6f029cc8a997c9096d2b9ee4f9e49808911
transformation:    none; vendored without artwork changes
```

The official MNEE product page labels the asset as `MNEE Logo`. No separate open redistribution license was identified during review. The file is retained unmodified for product identification; underlying rights remain with the owner.

#### USDGO

```text
local path:        /stablecoin-logos/usdgo.svg
source page:       https://www.usdgo.com/
source asset:      inline SVG in the first-party USDGO homepage header
source class:      official_product_homepage_inline_svg
SHA-256:           e75fc78d2b70dd3da4725aed2b1ed3e4f6201c7299a22f737154557b92ce4a84
transformation:    extracted inline SVG without artwork changes
```

The Phase B research result pointed to an Anchorage Digital image labelled for USDGO. Direct Phase D artifact inspection showed that image was a product illustration, not a compact Stablecoin mark, so it was **not** imported. The current first-party USDGO homepage instead renders a compact USDGO SVG in its header; the same visual identity is present in OSL's official USDGO listing artwork. The allow-list was not expanded: the correction remained within the already-approved `usdgo` slug. No separate open redistribution license was identified during review; underlying rights remain with the owner.

#### Resolv USD / USR

```text
local path:        /stablecoin-logos/usr.png
source page:       https://resolv.xyz/brand-kit
source asset:      https://framerusercontent.com/images/jr6pCURt19DV9uNMz7A80qtO8c.png?height=256&width=256
source class:      official_brand_kit_token_asset
SHA-256:           56279ebd60697a49d0c8fa62179a40eb7ba07b26d756729645d331de2addbf16
transformation:    none; vendored without artwork changes
```

Resolv's official Brand Kit provides a dedicated USR asset separately from RLP, stUSR, wstUSR, RESOLV, and stRESOLV. No separate open-source or redistribution license was identified in the reviewed Brand Kit material; the file is retained unmodified for token identification and underlying rights remain with the owner.

The previous `usdgo.png` issuer mark and `usr.svg` generic Resolv project mark were removed after their product/token-specific replacements were accepted, preventing obsolete research artwork from remaining as orphan display assets.

## Resolution rules

1. Exact canonical SOG slug is checked first.
2. Symbol lookup is used only for an explicit allow-list of symbols confirmed unique in the current corpus.
3. Ambiguous symbols such as `USX`, `USDX`, and `USDN` never resolve by symbol alone.
4. Only token-specific or product-specific marks are displayed as logos.
5. Records supported only by a project, issuer, or directory mark use the shared neutral monogram fallback.
6. The adjacent record name and full symbol remain authoritative; marks are decorative and hidden from assistive technology.
7. No remote runtime fetching is used.
8. A file is not added merely because its filename resembles a symbol. The image must be attributable to the same asset represented by the canonical SOG record.
9. Every canonical Stablecoin must have exactly one reviewed logo disposition before merge; a neutral fallback is valid, an omitted review is not.

The Stablecoins index, home preview, dossiers, and Compare therefore render **101 direct logos and 18 neutral fallbacks** through the same resolver and mark component. The mixed-mark and all-record catalog gates verify desktop and mobile rendering.

## Corpus-wide disposition closure

All **119 canonical Stablecoin records** have a final display disposition:

- **101** direct Stablecoin/product logos;
- **18** neutral fallbacks where the current reviewed evidence does not support a display-safe Stablecoin/product-specific mark.

The permanent core CI gate runs `scripts/audit-stablecoin-logo-coverage.mjs` on every pull request, including data-only canonical growth. It requires the decision count to equal the canonical Stablecoin count, requires every canonical slug to have a disposition, verifies direct assets and resolver mappings, and rejects orphan logo files or an unlisted fallback.

Research ledger: `config/stablecoin-logo-decisions.json` plus the bounded additions ledger where applicable.  
Public display policy: `config/stablecoin-logo-display-policy.json`.  
Permanent operating specification: `docs/quality/stablecoin-logo-disposition-operating-spec.md`.
