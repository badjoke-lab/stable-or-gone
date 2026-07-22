type CompareFacet = {
  dimension_id: string;
  value: unknown;
  readiness: { state: string; scored: boolean };
  freshness: { state: string; anchor_date: string | null; age_days: number | null; date_semantics: string; inherited_review_anchor: boolean };
};
type CompareAsset = { asset_id: string; slug: string; name: string; symbol: string | null; overall_readiness: string; facets: CompareFacet[] };
type DimensionConfig = { id: string; label: string; description: string };
type GroupConfig = { id: string; label: string; description: string; dimensions: DimensionConfig[] };
type CompareConfig = { groups: GroupConfig[] };
type CompareProjection = { asset_count: number; dimension_count: number; cell_count: number; assets: CompareAsset[] };

const foundRoot = document.querySelector('[data-compare-page]');
if (foundRoot instanceof HTMLElement) {
  const root = foundRoot;
  const slots = Array.from(root.querySelectorAll<HTMLSelectElement>('[data-compare-slot]'));
  const clearButton = root.querySelector<HTMLButtonElement>('[data-compare-clear]');
  const copyButton = root.querySelector<HTMLButtonElement>('[data-compare-copy]');
  const retryButton = root.querySelector<HTMLButtonElement>('[data-compare-retry]');
  const linkStatus = root.querySelector<HTMLElement>('[data-compare-link-status]');
  const status = root.querySelector<HTMLElement>('[data-compare-status]');
  const alert = root.querySelector<HTMLElement>('[data-compare-alert]');
  const empty = root.querySelector<HTMLElement>('[data-compare-empty]');
  const output = root.querySelector<HTMLElement>('[data-compare-output]');
  const columnHeader = root.querySelector<HTMLElement>('[data-compare-column-header]');
  const groupsContainer = root.querySelector<HTMLElement>('[data-compare-groups]');
  const mobileFacetControl = root.querySelector<HTMLElement>('.r8-mobile-facet-control');
  const mobileFacetSelect = root.querySelector<HTMLSelectElement>('[data-compare-mobile-facet]');
  const configElement = document.querySelector<HTMLScriptElement>('#compare-dimension-config');
  const projectionElement = document.querySelector<HTMLScriptElement>('#compare-projection-data');
  const maxAssets = Math.max(2, Number.parseInt(root.dataset.maxAssets ?? '4', 10) || 4);
  const minAssets = Math.max(2, Number.parseInt(root.dataset.minAssets ?? '2', 10) || 2);
  const config: CompareConfig = configElement?.textContent ? JSON.parse(configElement.textContent) as CompareConfig : { groups: [] };
  const knownSlugs = new Set(slots[0] ? Array.from(slots[0].options).map((option) => option.value).filter(Boolean) : []);
  let projection: CompareProjection | null = null;

  const humanize = (value: unknown) => String(value ?? '').replaceAll('_', ' ').replace(/\b\w/g, (character) => character.toUpperCase());
  const compact = (value: unknown): string => {
    if (value === null || value === undefined || value === '') return 'Not recorded';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'number') return new Intl.NumberFormat('en').format(value);
    if (Array.isArray(value)) return value.length ? value.map(compact).join(', ') : 'None recorded';
    return humanize(value);
  };
  const asRecord = (value: unknown): Record<string, unknown> => value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
  const asArray = (value: unknown): unknown[] => Array.isArray(value) ? value : [];

  function summaryFor(dimensionId: string, value: unknown) {
    const row = asRecord(value);
    switch (dimensionId) {
      case 'identity_consistency': return [row.name, row.symbol].filter(Boolean).join(' · ') || 'Not recorded';
      case 'issuer_asset_boundary': return `${asArray(row.relationships).length} relationships recorded`;
      case 'lifecycle_semantics': return compact(row.lifecycle_status);
      case 'reference_target_and_currency': {
        const reference = asRecord(row.peg_reference);
        return [reference.reference_currency, reference.target_value, reference.reference_kind].filter((item) => item !== null && item !== undefined && item !== '').map(compact).join(' · ') || 'Not recorded';
      }
      case 'asset_class': return compact(row.asset_class);
      case 'backing_model_representation': return `${compact(row.backing_types)} · ${asArray(row.reserve_components).length} reserve components`;
      case 'stabilization_mechanism_representation': return [row.stabilization_mechanism, row.governance_model].filter(Boolean).map(compact).join(' · ') || 'Not recorded';
      case 'reserve_disclosure_comparability': return `${compact(asRecord(row.reserve_profile).disclosure_status)} · ${compact(row.reserve_report_count)} reports`;
      case 'reserve_report_date_semantics': return `${compact(row.reserve_report_count)} reports · latest ${compact(asRecord(row.latest_report).report_date ?? asRecord(row.latest_report).as_of_date)}`;
      case 'issuance_comparability': return compact(row.issuance_status);
      case 'redemption_comparability': return [asRecord(row.redemption_profile).status, asRecord(row.redemption_profile).settlement_asset].filter(Boolean).map(compact).join(' · ') || 'Not recorded';
      case 'legal_classification_comparability': return `${asArray(row.classifications).length} classifications · holder claim ${compact(row.holder_claim_type)}`;
      case 'regulatory_action_scope': return `${compact(row.record_count)} canonical notes`;
      case 'market_access_applicability': return `${compact(row.record_state)} · ${compact(row.record_count)} records`;
      case 'launch_date_semantics': return row.launch_date ? String(row.launch_date) : `Not recorded · ${compact(row.unresolved_tracking)}`;
      case 'verification_date_semantics': return compact(row.last_verified_at);
      case 'unknown_state_semantics': return `${compact(row.known_unknown_count)} known unknowns`;
      case 'evidence_scope_and_relation_depth': return `${compact(row.evidence_count)} evidence records · ${compact(row.claim_scopes)}`;
      case 'known_unknown_visibility': return `${compact(row.record_count)} records · ${compact(row.topics)}`;
      default: return 'Canonical value available';
    }
  }

  function structuredNode(value: unknown, depth = 0): HTMLElement {
    const container = document.createElement('div');
    container.className = 'compare-structured-value';
    if (value === null || value === undefined || value === '') { container.textContent = 'Not recorded'; return container; }
    if (typeof value !== 'object') { container.textContent = compact(value); return container; }
    if (Array.isArray(value)) {
      if (!value.length) { container.textContent = 'None recorded'; return container; }
      const list = document.createElement('ol');
      list.className = 'compare-record-list';
      for (const item of value) { const li = document.createElement('li'); li.append(structuredNode(item, depth + 1)); list.append(li); }
      container.append(list); return container;
    }
    const list = document.createElement('dl');
    list.className = 'compare-structured-list';
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      const row = document.createElement('div');
      const dt = document.createElement('dt');
      const dd = document.createElement('dd');
      dt.textContent = humanize(key);
      if (depth >= 2 && child && typeof child === 'object') dd.textContent = Array.isArray(child) ? `${child.length} items` : 'Structured record';
      else dd.append(structuredNode(child, depth + 1));
      row.append(dt, dd); list.append(row);
    }
    container.append(list); return container;
  }

  function badge(label: string, state: string) {
    const span = document.createElement('span');
    span.className = 'compare-badge';
    span.dataset.state = state;
    span.textContent = `${label}: ${humanize(state)}`;
    return span;
  }

  function assetHeader(asset: CompareAsset, compactHeader = false) {
    const header = document.createElement(compactHeader ? 'div' : 'article');
    header.className = compactHeader ? 'compare-cell-asset' : 'compare-asset-header';
    const symbol = document.createElement('span'); symbol.className = 'compare-asset-symbol'; symbol.textContent = asset.symbol || 'No symbol';
    const title = document.createElement(compactHeader ? 'span' : 'h3');
    const link = document.createElement('a'); link.href = `/stablecoin/${asset.slug}/`; link.textContent = asset.name;
    title.append(link); header.append(symbol, title); return header;
  }

  function readSelection() { return slots.map((slot) => slot.value).filter(Boolean).slice(0, maxAssets); }
  function selectionFromUrl() {
    const values = new URLSearchParams(window.location.search).get('assets')?.split(',').map((value) => value.trim()).filter(Boolean) ?? [];
    const selected: string[] = [];
    for (const slug of values) if (knownSlugs.has(slug) && !selected.includes(slug) && selected.length < maxAssets) selected.push(slug);
    return selected;
  }
  function applySelection(slugs: string[]) { slots.forEach((slot, index) => { slot.value = slugs[index] ?? ''; }); }
  function writeUrl(mode: 'push' | 'replace') {
    const params = new URLSearchParams();
    const selected = readSelection();
    if (selected.length) params.set('assets', selected.join(','));
    window.history[mode === 'push' ? 'pushState' : 'replaceState']({}, '', `${window.location.pathname}${params.size ? `?${params}` : ''}`);
  }

  function setError(show: boolean) {
    if (alert) alert.hidden = !show;
    if (show) { if (empty) empty.hidden = true; if (output) output.hidden = true; }
  }

  function updateMobileFacetVisibility() {
    const mobile = window.innerWidth <= 719;
    if (mobileFacetControl) mobileFacetControl.hidden = !mobile || !projection || readSelection().length < minAssets;
    const active = mobileFacetSelect?.value ?? '';
    root.querySelectorAll<HTMLElement>('[data-dimension-id]').forEach((row) => { row.hidden = mobile && active ? row.dataset.dimensionId !== active : false; });
  }

  function populateMobileFacets() {
    if (!mobileFacetSelect) return;
    const previous = mobileFacetSelect.value;
    mobileFacetSelect.replaceChildren();
    for (const group of config.groups) for (const dimension of group.dimensions) {
      const option = document.createElement('option'); option.value = dimension.id; option.textContent = `${group.label} — ${dimension.label}`; mobileFacetSelect.append(option);
    }
    if (previous && [...mobileFacetSelect.options].some((option) => option.value === previous)) mobileFacetSelect.value = previous;
  }

  function render() {
    if (!projection || !empty || !output || !columnHeader || !groupsContainer) return;
    const selectedSlugs = readSelection();
    const bySlug = new Map(projection.assets.map((asset) => [asset.slug, asset]));
    const selectedAssets = selectedSlugs.map((slug) => bySlug.get(slug)).filter((asset): asset is CompareAsset => Boolean(asset));
    const ready = selectedAssets.length >= minAssets;
    empty.hidden = ready;
    output.hidden = !ready;
    if (status) status.textContent = ready ? `${selectedAssets.length} records selected.` : `${selectedAssets.length} selected. Choose ${minAssets - selectedAssets.length} more.`;
    if (!ready) return;

    output.style.setProperty('--compare-columns', String(selectedAssets.length));
    columnHeader.replaceChildren(); groupsContainer.replaceChildren();
    const facetHeading = document.createElement('div'); facetHeading.className = 'compare-facet-column-heading'; facetHeading.textContent = 'Facet'; columnHeader.append(facetHeading);
    for (const asset of selectedAssets) columnHeader.append(assetHeader(asset));

    for (const group of config.groups) {
      const section = document.createElement('section'); section.className = 'compare-facet-group'; section.dataset.compareGroup = group.id;
      const heading = document.createElement('header'); heading.className = 'compare-group-heading';
      const h3 = document.createElement('h3'); h3.textContent = group.label;
      const p = document.createElement('p'); p.textContent = group.description;
      heading.append(h3, p); section.append(heading);
      for (const dimension of group.dimensions) {
        const row = document.createElement('div'); row.className = 'compare-facet-row'; row.dataset.dimensionId = dimension.id;
        const label = document.createElement('div'); label.className = 'compare-facet-label';
        const h4 = document.createElement('h4'); h4.textContent = dimension.label;
        const description = document.createElement('p'); description.textContent = dimension.description;
        label.append(h4, description); row.append(label);
        for (const asset of selectedAssets) {
          const facet = asset.facets.find((item) => item.dimension_id === dimension.id);
          const cell = document.createElement('article'); cell.className = 'compare-value-cell'; cell.append(assetHeader(asset, true));
          if (!facet) { const missing = document.createElement('p'); missing.textContent = 'Not available'; cell.append(missing); row.append(cell); continue; }
          const summary = document.createElement('p'); summary.className = 'compare-value-summary'; summary.textContent = summaryFor(dimension.id, facet.value);
          const badges = document.createElement('div'); badges.className = 'compare-badges'; badges.append(badge('Readiness', facet.readiness.state), badge('Freshness', facet.freshness.state));
          const metadata = document.createElement('p'); metadata.className = 'compare-freshness-meta'; metadata.textContent = facet.freshness.anchor_date ? `Anchor ${facet.freshness.anchor_date}` : 'No date anchor';
          const detail = document.createElement('details'); detail.className = 'compare-value-details';
          const detailSummary = document.createElement('summary'); detailSummary.textContent = 'Canonical fields';
          detail.append(detailSummary, structuredNode(facet.value)); cell.append(summary, badges, metadata, detail); row.append(cell);
        }
        section.append(row);
      }
      groupsContainer.append(section);
    }
    populateMobileFacets(); updateMobileFacetVisibility();
  }

  function loadEmbeddedProjection() {
    try {
      const parsed = projectionElement?.textContent ? JSON.parse(projectionElement.textContent) as CompareProjection : null;
      const expectedDimensions = config.groups.reduce((sum, group) => sum + group.dimensions.length, 0);
      if (!parsed || parsed.asset_count !== parsed.assets.length || parsed.dimension_count !== expectedDimensions || parsed.cell_count !== parsed.asset_count * parsed.dimension_count) throw new Error('invalid projection');
      if (parsed.assets.some((asset) => asset.facets.length !== parsed.dimension_count)) throw new Error('incomplete projection');
      projection = parsed; setError(false); render();
    } catch { projection = null; setError(true); }
  }

  for (const slot of slots) slot.addEventListener('change', () => {
    const values = slots.map((item) => item.value).filter(Boolean);
    if (new Set(values).size !== values.length) { slot.value = ''; if (status) status.textContent = 'Each record may be selected once.'; }
    writeUrl('push'); render();
  });
  clearButton?.addEventListener('click', () => { applySelection([]); writeUrl('push'); render(); });
  copyButton?.addEventListener('click', async () => { try { await navigator.clipboard.writeText(window.location.href); if (linkStatus) linkStatus.textContent = 'Comparison link copied.'; } catch { if (linkStatus) linkStatus.textContent = 'Copy the URL from the address bar.'; } });
  retryButton?.addEventListener('click', loadEmbeddedProjection);
  mobileFacetSelect?.addEventListener('change', updateMobileFacetVisibility);
  window.addEventListener('resize', updateMobileFacetVisibility, { passive: true });
  window.addEventListener('popstate', () => { applySelection(selectionFromUrl()); render(); });

  applySelection(selectionFromUrl()); writeUrl('replace'); loadEmbeddedProjection();
}
