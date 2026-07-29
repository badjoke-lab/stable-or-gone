# Stablecoin logo assets

These SVGs are vendored locally so public pages never depend on an external image host.

## Sources and licenses

### Original CC0 set

Source: `spothq/cryptocurrency-icons` (`svg/color`), distributed under CC0-1.0.

```text
aeur.svg
dai.svg
gusd.svg
pax.svg
paxg.svg
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
dola.svg
eurt.svg
eurc.svg
fdusd.svg
fei.svg
frax.svg
gho.svg
gyen.svg
iron.svg
ist.svg
lusd.svg
mim.svg
ousd.svg
pyusd.svg
rai.svg
susd.svg
tryb.svg
usdd.svg
usde.svg
vai.svg
xaut.svg
xsgd.svg
```

Only SVG identifiers and formatting needed for safe local coexistence were normalized. The icon artwork is otherwise preserved.

## Resolution rules

1. Exact canonical SOG slug is checked first.
2. Symbol lookup is used only for an explicit allow-list of symbols confirmed unique in the current corpus.
3. Ambiguous symbols such as `USX`, `USDX`, and `USDN` never resolve by symbol alone.
4. A record without an audited local SVG uses the same circular mark geometry with a short neutral monogram.
5. The adjacent record name and full symbol remain authoritative; marks are decorative and hidden from assistive technology.
6. No remote runtime fetching is used.

The Stablecoin screenshot audit includes records with real marks and an unsupported-record fallback so mixed rendering is reviewed directly on desktop and mobile.
