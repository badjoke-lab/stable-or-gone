# SOG UI V3 — CYA-Dark Redesign Authority

Status: **active design and implementation authority**

Working branch: `ui/v3-cya-dark-redesign`

This document is the mandatory reference for every UI change made during the SOG V3 redesign. Implementation commits, review notes, screenshot audits, and corrective passes must cite the relevant section of this document.

The redesign must not be merged into `main` until the owner has reviewed representative desktop and mobile screenshots and explicitly accepted the direction.

---

## 1. UI version definitions

### V2 — current verified UI and permanent recovery point

The current production-compatible terminal/ledger UI is designated **SOG UI V2**.

- Frozen V2 commit: `a376d440b87deb25d3e3ee1c880369ac31d7e70a`
- V2 implementation tail commit: `efde9ec06e4b44ecaf40fa7f00895c15e219ff33`
- Frozen recovery branch: `restore-point/pre-ui-redesign-2026-07-24`
- Recovery record: GitHub Issue `#456`
- Representative visual verification at freeze:
  - Desktop: `42 / 42`, zero capture failures
  - Mobile: `42 / 42`, zero capture failures
- Functional browser verification at freeze: `25 / 25` checks passed

The recovery branch is immutable. Do not develop on it, merge into it, delete it, rename it, or move its ref.

### V3 — CYA-inspired dark editorial registry

The next design is designated **SOG UI V3**.

V3 is not a recolored copy of CYA and is not a continuation of the rejected generic SaaS/dashboard direction. It combines:

1. CYA's editorial information hierarchy;
2. CYA's ruled archive and registry composition;
3. SOG's black-background identity;
4. SOG's denser and more complex registry functions;
5. SOG's current routes, records, evidence, filters, comparison tools, and machine-readable outputs.

---

## 2. Source references

### Primary visual reference

- Live CYA site: `https://cya.badjoke-lab.com/`
- CYA repository: `badjoke-lab/crypto-yield-archive`

Relevant CYA implementation references include:

- `src/layouts/BaseLayout.astro`
- `src/styles/global.css`
- `src/styles/home.css`
- `src/styles/platform.css`
- `src/pages/index.astro`

### SOG V2 recovery reference

- Frozen commit: `a376d440b87deb25d3e3ee1c880369ac31d7e70a`
- Recovery branch: `restore-point/pre-ui-redesign-2026-07-24`

The V2 reference is the fallback and functional baseline. V3 may change visual structure, but it must not silently remove V2 functionality.

---

## 3. Design objective

V3 must present SOG as a **historical research archive, evidence registry, and public reference work** rather than as:

- a crypto trading product;
- a real-time market terminal;
- an internal admin dashboard;
- a generic SaaS application;
- a marketing landing page.

The desired visual character is:

- editorial;
- archival;
- authoritative;
- restrained;
- dark;
- evidence-led;
- readable for long-form research;
- dense enough for registry work.

The interface must communicate three distinct content layers:

1. **Editorial layer** — page titles, introductions, guide prose, methodology, explanations;
2. **Registry layer** — tables, facts, states, dates, relationships, evidence counts;
3. **Utility layer** — search, filters, sorting, comparison, pagination, corrections, machine-readable access.

These layers must be visually distinguishable without using rounded cards, heavy surfaces, gradients, glow, or dashboard tiles.

---

## 4. Non-negotiable visual rules

1. The primary page background is black or near-black.
2. No light-paper CYA background may be copied directly.
3. No generic SaaS dashboard composition.
4. No rounded cards, pills, glass, blur panels, gradients, decorative shadows, or glowing borders.
5. No oversized marketing hero.
6. Color must convey meaning, not decorate large surfaces.
7. Borders and rules must form the main structural system.
8. Desktop registries must remain dense and scannable.
9. Mobile registries must preserve labels and context without becoming enormous generic cards.
10. Long-form pages must not use monospace for all body copy.
11. Metadata, dates, IDs, state labels, and compact facts should use monospace.
12. Main headings may use a restrained serif face.
13. General interface copy and explanatory prose should use a readable sans-serif or serif according to role.
14. Every page family must retain a clear SOG identity; V3 must not look like a literal CYA clone.
15. No page may be declared complete from code inspection alone.

---

## 5. Dark color system

Initial V3 token direction:

```css
:root {
  --v3-bg: #050607;
  --v3-bg-raised: #0a0c0f;
  --v3-bg-soft: #0e1115;

  --v3-text: #f1efe8;
  --v3-text-muted: #aaa9a2;
  --v3-text-quiet: #7f8388;

  --v3-rule: #2d3136;
  --v3-rule-strong: #5b6168;

  --v3-accent: #67cef4;
  --v3-archive: #79bde3;
  --v3-positive: #6fc79d;
  --v3-warning: #d1aa62;
  --v3-danger: #db756d;
  --v3-violet: #a993c2;
}
```

These values are a controlled starting point, not an excuse to spread color across the page.

### Color application rules

- Primary text uses `--v3-text`.
- Explanatory text uses `--v3-text-muted`.
- Quiet metadata uses `--v3-text-quiet`.
- SOG navigation and primary links may use `--v3-accent` selectively.
- Source/archive links use `--v3-archive`.
- Positive, warning, danger, and violet colors are restricted to state text, thin rules, small marks, and evidence-quality indicators.
- Status backgrounds must remain transparent unless accessibility testing proves a minimal fill is necessary.
- Pure white should not dominate large text blocks.
- Pure black and bright cyan must not produce a neon-terminal appearance.

---

## 6. Typography system

V3 uses role-based typography rather than the V2 all-monospace system.

### Serif

Use for:

- page titles;
- major section headings;
- selected editorial introductions;
- important numeric summaries where appropriate;
- long-form research prose when readability remains strong on dark backgrounds.

The serif treatment must remain restrained. It must not resemble a luxury brand, magazine cover, or cinematic title page.

### Sans-serif

Use for:

- navigation;
- forms;
- general explanatory copy;
- registry descriptions;
- buttons and utility controls;
- compact mobile record text.

### Monospace

Use for:

- dates;
- identifiers;
- record counts;
- metadata labels;
- state labels;
- evidence-quality labels;
- table headings;
- machine-readable links;
- small archive annotations.

### Scale constraints

- Desktop page titles should normally remain below the visual dominance of CYA's largest 72px title treatment.
- Default V3 desktop title target: approximately `clamp(2.25rem, 4vw, 4rem)`.
- Mobile titles must fit without forcing awkward multi-line fragmentation.
- Body text must remain readable and must not be shrunk to solve layout problems.
- Registry density must come from spacing and hierarchy, not from illegibly small type.

---

## 7. Global shell

### Header

Use a CYA-inspired two-level information structure adapted to SOG:

**Upper masthead row**

- SOG brand mark or lockup;
- Stable or Gone name;
- concise archive descriptor;
- evidence-led/static-registry signal;
- correction link or another essential maintenance action.

**Lower navigation row**

- Stablecoins;
- Compare;
- Access & Regulation;
- Timeline;
- Organizations;
- Events;
- Stats;
- Guides;
- Reference/About grouping where necessary.

Rules:

- Sticky behavior is allowed.
- Background remains opaque or nearly opaque black.
- Blur is prohibited.
- Navigation uses an active underline or rule, not a filled pill.
- On mobile, horizontal navigation or a compact disclosed menu may be used, but it must not generate a tall empty header.

### Footer

The V3 footer should be substantially shorter than the V2 multi-column footer.

Preferred structure:

- one concise SOG disclaimer;
- a compact wrap of important project, correction, methodology, source, and machine-readable links;
- no giant empty footer region;
- no six-column desktop structure unless real content requires it.

---

## 8. Home page

The home page should follow this order:

1. concise editorial introduction;
2. compact ruled registry facts;
3. clear archive-scope strip;
4. numbered or otherwise ordered research directory;
5. stablecoin registry entry or complete registry;
6. latest material changes or selected evidence context where useful.

### Home rules

- No marketing hero.
- The introductory title may be larger than other pages but must remain bounded.
- Facts use a connected ruled grid, not separate KPI cards.
- Research entry points may use CYA-like numbered rows or cells.
- The registry remains a primary destination, not an afterthought below decorative content.
- SOG-specific categories must replace CYA terminology.

---

## 9. Registry indexes

Applies to:

- Stablecoins;
- Events;
- Organizations;
- Guides and reference indexes where applicable.

### Desktop

- Use a full-width ruled table or ledger.
- Search and filter controls form one coherent tool area.
- Controls may wrap, but must not become a dashboard of filter cards.
- State indicators use text plus a thin rule or small mark.
- Key identity and status columns must remain visible without horizontal hunting at common desktop widths.
- Pagination, result count, active filters, and comparison state remain explicit.

### Mobile

Do not blindly copy CYA's full row-to-record transformation for every SOG field.

Use a bounded SOG adaptation:

- record identity and lifecycle always visible;
- primary organization/reference context visible;
- secondary values grouped in a compact label/value grid;
- tertiary evidence and relationship detail may use `details`;
- no unlabeled values;
- no enormous generic card padding;
- no horizontal overflow;
- search and controls use full width where required.

---

## 10. Stablecoin detail pages

The detail page should combine an editorial report with a factual registry record.

Preferred structure:

1. breadcrumb or archive context;
2. title, symbol, aliases, and concise summary;
3. connected status/fact ledger;
4. optional compact record strip;
5. main report column;
6. secondary reference sidebar on desktop;
7. lifecycle and event chronology;
8. evidence grouped by claim or topic;
9. related records;
10. report/correction action.

### Detail-page rules

- Main prose must be readable, not terminal-like.
- Sidebar sections use top rules and compact ledgers, not cards.
- Timeline dates use monospace and a semantic accent.
- Evidence quality may use a thin left rule.
- Source links use the archive/source color.
- Important unknowns must remain visually explicit.
- Mobile collapses to one column without losing record context.

---

## 11. Guides and long-form reference pages

Guides, Methodology, About, Models, Glossary, Access & Regulation, Updates, and utility/reference pages require a reading-oriented layout.

Rules:

- Constrain prose line length.
- Use editorial heading hierarchy.
- Keep metadata and revision history in compact monospace ledgers.
- Use a table of contents only where it adds value.
- Avoid forcing all guide content into the same dense table typography used by registries.
- Related records should use connected ruled cells or compact rows.
- Revision history must remain readable on narrow screens.
- Large empty regions before the footer are prohibited.

---

## 12. Stats and comparison

### Stats

Stats must not become a generic analytics dashboard.

Use:

- connected ruled summary facts;
- simple bars and distributions;
- clearly labeled tables;
- editorial section introductions;
- minimal semantic color;
- no floating KPI cards;
- no rounded chart containers.

### Compare

Comparison must remain a research tool, not a product selector.

Use:

- explicit selected-record state;
- ruled comparison columns or rows;
- visible unknown/not-recorded values;
- no ranking language;
- no winner emphasis;
- no commerce-style comparison cards.

---

## 13. Functionality that must be preserved

The V3 redesign must preserve all current behavior unless a replacement is explicitly documented and verified.

Required preservation includes:

- all public routes;
- canonical records and IDs;
- current data counts;
- search;
- filtering;
- sorting;
- pagination;
- URL/shareable view state;
- record comparison;
- disclosures and expandable details;
- correction and support paths;
- event and organization relationships;
- evidence links and known unknowns;
- JSON outputs;
- manifest and version outputs;
- `llms.txt` and `ai.txt`;
- sitemap and canonical metadata;
- keyboard navigation;
- focus visibility;
- reduced-motion handling;
- mobile accessibility.

A visual rewrite does not authorize deletion of functionality.

---

## 14. Prohibited regression patterns

The following are immediate rejection conditions:

- rounded card grids;
- pill-heavy filters;
- oversized hero copy;
- KPI dashboard composition;
- gradient backgrounds;
- glass or blur effects;
- neon terminal styling;
- tiny unreadable body copy;
- all-monospace long-form prose;
- mobile records with every field permanently expanded;
- missing table labels on mobile;
- giant footer blank areas;
- horizontal overflow;
- hidden or removed unknown-state information;
- removal of evidence or source context;
- visual completion claims without real screenshots;
- direct merging of unfinished experiments into `main`.

---

## 15. Implementation sequence

### Phase 0 — authority and branch isolation

- [x] Freeze V2.
- [x] Create immutable recovery branch.
- [x] Create V3 working branch.
- [x] Add this authority document.
- [ ] Keep all initial V3 work off `main`.

### Phase 1 — design tokens and shell specimen

- [ ] Add V3 color and typography tokens.
- [ ] Implement the two-level header.
- [ ] Implement the compact footer.
- [ ] Produce desktop and 390px mobile screenshots.
- [ ] Verify no function or route changes.

### Phase 2 — representative stablecoin registry specimen

- [ ] Implement the V3 Stablecoins index only.
- [ ] Preserve search, filters, sorting, pagination, URL state, and comparison selection.
- [ ] Capture desktop default, filtered, empty, and comparison states.
- [ ] Capture mobile default and filtered states.
- [ ] Do not propagate until the specimen is visually accepted.

### Phase 3 — home and detail specimen

- [ ] Implement the V3 home hierarchy.
- [ ] Implement one representative stablecoin detail page.
- [ ] Capture desktop and mobile evidence.
- [ ] Correct typography, density, and color before propagation.

### Phase 4 — registry propagation

- [ ] Events.
- [ ] Organizations.
- [ ] Guides index.
- [ ] Other reference indexes.

### Phase 5 — detail and long-form propagation

- [ ] Stablecoin details.
- [ ] Event details.
- [ ] Organization details.
- [ ] Guide details.
- [ ] Methodology/About/Models/Glossary.
- [ ] Access & Regulation/Timeline/Updates.

### Phase 6 — tools and statistics

- [ ] Compare.
- [ ] Stats.
- [ ] Corrections/support/contact and remaining utility pages.

### Phase 7 — final verification

- [ ] Build passes.
- [ ] Route count unchanged.
- [ ] Machine-readable outputs unchanged.
- [ ] Search/filter/sort/pagination/compare smoke tests pass.
- [ ] Representative desktop screenshots inspected.
- [ ] Representative mobile screenshots inspected.
- [ ] Exhaustive desktop screenshots captured.
- [ ] Exhaustive mobile screenshots captured.
- [ ] Owner explicitly accepts or rejects V3.

---

## 16. Review and completion rules

Every implementation pass must record:

- files changed;
- authority sections implemented;
- routes affected;
- behavior preserved or replaced;
- screenshots captured;
- defects found;
- defects remaining;
- exact commit SHA.

V3 is not complete because:

- the build passes;
- screenshots were captured automatically;
- a single page looks acceptable;
- no horizontal overflow was detected;
- the code resembles CYA.

V3 is complete only after:

1. all relevant page families are implemented;
2. functionality checks pass;
3. desktop and mobile screenshots are directly inspected;
4. outstanding defects are resolved or explicitly accepted;
5. the owner explicitly accepts the design.

---

## 17. V2 rollback procedure

### Preferred recovery reference

```text
restore-point/pre-ui-redesign-2026-07-24
```

### Frozen V2 commit

```text
a376d440b87deb25d3e3ee1c880369ac31d7e70a
```

### Immediate local and remote rollback

Use this only when the V3 redesign must be abandoned and `main` must become exactly V2 again:

```bash
git fetch origin
git switch main
git reset --hard origin/restore-point/pre-ui-redesign-2026-07-24
git push --force-with-lease origin main
```

### Preserve the failed V3 state before rollback

```bash
git fetch origin
git switch main
BACKUP="backup/failed-ui-v3-$(date +%Y%m%d-%H%M%S)"
git branch "$BACKUP"
git push origin "$BACKUP"
```

### Protected-main alternative

If branch protection blocks a direct reset:

1. create a new recovery branch from `a376d440b87deb25d3e3ee1c880369ac31d7e70a`;
2. restore the V2 tree through the repository's required review path;
3. do not move or modify the immutable recovery branch.

The V2 commit SHA remains a permanent fallback even if another branch is accidentally changed.

---

## 18. Current authority state

- V2 is frozen and recoverable.
- V3 work is isolated on `ui/v3-cya-dark-redesign`.
- No V3 visual implementation has been approved yet.
- The first implementation target is the global shell specimen, followed by the Stablecoins registry specimen.
- This document remains authoritative until explicitly replaced by an owner-approved revision.
