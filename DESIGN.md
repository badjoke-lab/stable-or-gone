# DESIGN.md — Stable or Gone

## 0. Purpose

This document is the visual source of truth for Stable or Gone (SOG).

SOG is a terminal-style stablecoin registry. It should feel like a structured archive terminal for stablecoin records, depeg events, issuers, reserve reports, redemption notes, and evidence.

SOG is not:

- a trading terminal
- an MS-DOS clone
- a DeFi dashboard
- a cyberpunk crypto UI
- a game-like 8-bit interface
- a glossy SaaS landing page

## 1. Core design direction

Primary design direction:

```txt
Terminal Registry UI
```

Working phrase:

```txt
A terminal-style registry UI for stablecoins, depeg events, issuers, reserves, and evidence.
```

The UI may use terminal-inspired language, dense tables, log panels, evidence blocks, and monospace accents, but it must remain readable as a modern web registry.

## 2. Product mood

SOG should feel:

- structured
- investigative
- archival
- source-backed
- technical but readable
- quiet but sharper than HEI
- registry-first

SOG should not feel:

- speculative
- hype-driven
- score/rating oriented
- investment-advice oriented
- neon crypto
- exchange-like
- price-dashboard-like

## 3. Information density

SOG is allowed to be dense.

Rules:

- prefer compact clarity over decorative whitespace
- tables are acceptable and often preferred
- cards are secondary, not the main structure
- mobile should preserve information density
- avoid giant marketing heroes
- use concise summaries and clear record metadata

## 4. Layout principles

Registry pages should use:

1. compact header
2. command-inspired search/filter area
3. summary strip
4. dense table/list
5. footer utility links

Detail pages should use:

1. record header
2. status / peg / issuer facts
3. reserve and redemption block
4. depeg / event timeline
5. lifecycle block
6. evidence coverage
7. source list
8. known unknowns
9. report/contact prompt

## 5. Visual language

Use:

- dark navy / blue-black base
- thin borders
- terminal-like panels
- monospace accents
- restrained green / amber / red status colors
- cyan/blue for evidence/archive/source links
- log-like event rows
- file-like evidence blocks

Avoid:

- full green-on-black hacker screen
- old OS clone behavior
- blinking cursors everywhere
- fake command line navigation that blocks normal browsing
- excessive ASCII art
- animated counters
- price-chart-first layout

## 6. Color roles

Suggested roles:

- background: deep navy / near black
- surface: slightly lighter blue-black
- border: muted blue-gray
- text: off-white
- muted text: blue-gray
- active/stable: subdued green
- notable/warning: amber
- failed/collapse: muted red
- unknown: neutral gray
- evidence/source: cyan or archival blue
- support/donation: muted gold or amber

Status colors must remain stable across pages.

## 7. Typography

Use a readable modern sans-serif for body text and a monospace font for:

- command-inspired search labels
- record IDs
- JSON-like metadata snippets
- log timestamps
- evidence IDs
- terminal-style headings

Do not use decorative pixel fonts for body content.

## 8. Components

### Header

Must include:

- Stable or Gone wordmark/title
- primary navigation
- Support link
- Contact / Submit correction utility

### Search / command bar

May appear as:

```txt
> search stablecoin, issuer, peg, event...
```

But it must behave like a normal search field.

### Tables

Tables are core.

Stablecoin registry columns should eventually include:

- Name
- Symbol
- Peg
- Model
- Issuer
- Status
- Major depeg
- Redemption
- Evidence

### Chips

Use chips for:

- status
- peg asset
- collateral model
- event type
- evidence type
- confidence
- redemption status

### Evidence coverage panel

Show source coverage, not a score.

Example:

```txt
Issuer statement: yes
Market data: yes
Reserve report: yes
Regulatory source: no
Archive: yes
```

### Known unknowns

Known unknowns should be visible, not hidden.

They communicate that SOG does not force uncertain facts into false certainty.

## 9. Support/donation UI

Support must be present from v0, but it must be secondary.

Allowed placements:

- header utility link
- footer link
- `/support/`
- about page section

Do not make donation the main hero CTA.

Good language:

- Support SOG
- Support this registry
- Help keep this project independent

Avoid:

- Fund our ratings
- Keep stablecoins safe
- Donate for risk scores

## 10. Mobile behavior

Mobile should not become huge cards.

Use compact two-line rows where possible:

Line 1:

- name
- symbol
- status chip

Line 2:

- peg
- model
- issuer
- evidence/depeg marker

## 11. Final rule

SOG should look like a terminal-style historical registry, not a trading tool.

The design exists to make stablecoin records, events, and evidence easier to inspect.
