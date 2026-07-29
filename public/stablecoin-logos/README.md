# Stablecoin logo assets

These SVGs are vendored locally so public pages never depend on an external image host.

Current audited coverage: **39 of 116 canonical Stable or Gone stablecoin records**.

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

## Resolution rules

1. Exact canonical SOG slug is checked first.
2. Symbol lookup is used only for an explicit allow-list of symbols confirmed unique in the current corpus.
3. Ambiguous symbols such as `USX`, `USDX`, and `USDN` never resolve by symbol alone.
4. A record without an audited local SVG uses the same circular mark geometry with a short neutral monogram.
5. The adjacent record name and full symbol remain authoritative; marks are decorative and hidden from assistive technology.
6. No remote runtime fetching is used.
7. A file is not added merely because its filename resembles a symbol. The icon must be attributable to the same asset represented by the canonical SOG record.

The Stablecoins index screenshot contains real marks and unsupported-record fallbacks together. Fixed dossier screenshots and the mixed-mark geometry gate verify desktop and mobile rendering.
