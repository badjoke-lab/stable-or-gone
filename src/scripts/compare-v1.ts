type CompareFacet = {
  dimension_id: string;
  value: unknown;
  readiness: { state: string; scored: boolean };
  freshness: { state: string; anchor_date: string | null; age_days: number | null; date_semantics: string; inherited_review_anchor: boolean };
};

type CompareAsset = {
  asset_id: string;
  slug: string;
  name: string;
  symbol: string | null;
  overall_readiness: string;
  facets: CompareFacet[];
};

type CompareProjection = {
  asset_count: number;
  dimension_count: number;
  cell_count: number;
  assets: CompareAsset[];
};

type DimensionConfig = {
  id: string;
  label: string;
  description: string;
};

type GroupConfig = {
  id: string;
  label: string;
  description: string;
  dimensions: DimensionConfig[];
};

type CompareConfig = {
  groups: GroupConfig[];
};

const foundRoot = document.querySelector('[data-compare-page]');

if (foundRoot instanceof HTMLElement) {
  const root = foundRoot;
  const slots = Array.from(root.querySelectorAll<HTMLSelectElement>('[data-compare-slot]'));
  const clearButton = root.querySelector<HTMLButtonElement>('[data-compare-clear]');
  const copyButton = root.querySelector<HTMLButtonElement>('[data-compare-copy]');
  const linkStatus = root.querySelector<HTMLElement>('[data-compare-link-status]');
  const status = root.querySelector<HTMLElement>('[data-compare-status]');
  const alert = root.querySelector<HTMLElement>('[data-compare-alert]');
  const empty = root.querySelector<HTMLElement>('[data-compare-empty]');
  const output = root.querySelector<HTMLElement>('[data-compare-output]');
  const columnHeader = root.querySelector<HTMLElement>('[data-compare-column-header]');
  const groupsContainer = root.querySelector<HTMLElement>('[data-compare-groups]');
  const configElement = document.querySelector<HTMLScriptElement>('#compare-dimension-config');
  const maxAssets = Math.max(2, Number.parseInt(root.dataset.maxAssets ?? '4', 10) || 4);
  const minAssets = Math.max(2, Number.parseInt(root.dataset.minAssets ?? '2', 10) || 2);
  const knownSlugs = new Set(slots[0] ? Array.from(slots[0].options).map((option) => option.value).filter(Boolean) : []);
  const config = configElement?.textContent ? JSON.parse(configElement.textContent) as CompareConfig : { groups: [] };
  let projection: CompareProjection | null = null;
  let projectionError: string | null = null;

  const humanize = (value: unknown) => String(value ?? '')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());

  const compactValue = (value: unknown) => {
    if (value === null || value === undefined || value === '') return 'Not recorded';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'number') return new Intl.NumberFormat('en').format(value);
    return humanize(value);
  };

  const arrayText = (value: unknown) => Array.isArray(value) && value.length
    ? value.map((item) => compactValue(item)).join(', ')
    : 'None recorded';

  const asRecord = (value: unknown): Record<string, unknown> => value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
  const asArray = (value: unknown): unknown[] => Array.isArray(value) ? value : [];

  function summaryFor(dimensionId: string, value: unknown) {
    const row = asRecord(value);
    switch (dimensionId) {
      case 'identity_consistency':
        return [row.name, row.symbol].filter(Boolean).join(' · ') || 'Not recorded';
      case 'issuer_asset_boundary': {
        const relationships = asArray(row.relationships);
        return `${relationships.length} relationship${relationships.length === 1 ? '' : 's'} recorded`;
      }
      case 'lifecycle_semantics': return compactValue(row.lifecycle_status);
      case 'reference_target_and_currency': {
        const reference = asRecord(row.peg_reference);
        const parts = [reference.reference_currency, reference.target_value, reference.reference_kind].filter((item) => item !== null && item !== undefined && item !== '');
        return parts.length ? parts.map(compactValue).join(' · ') : 'Not recorded';
      }
      case 'asset_class': return compactValue(row.asset_class);
      case 'backing_model_representation': {
        const backing = arrayText(row.backing_types);
        const components = asArray(row.reserve_components).length;
        return `${backing} · ${components} reserve component${components === 1 ? '' : 's'}`;
      }
      case 'stabilization_mechanism_representation':
        return [row.stabilization_mechanism, row.governance_model].filter(Boolean).map(compactValue).join(' · ') || 'Not recorded';
      case 'reserve_disclosure_comparability': {
        const profile = asRecord(row.reserve_profile);
        return `${compactValue(profile.disclosure_status)} · ${compactValue(row.reserve_report_count)} reports · ${compactValue(row.reserve_component_count)} components`;
      }
      case 'reserve_report_date_semantics': {
        const latest = asRecord(row.latest_report);
        const date = latest.report_date ?? latest.as_of_date;
        return `${compactValue(row.reserve_report_count)} reports · latest ${compactValue(date)}`;
      }
      case 'issuance_comparability': return compactValue(row.issuance_status);
      case 'redemption_comparability': {
        const profile = asRecord(row.redemption_profile);
        return [profile.status, profile.settlement_asset].filter(Boolean).map(compactValue).join(' · ') || 'Not recorded';
      }
      case 'legal_classification_comparability': {
        const classifications = asArray(row.classifications).length;
        return `${classifications} classification${classifications === 1 ? '' : 's'} · holder claim ${compactValue(row.holder_claim_type)}`;
      }
      case 'regulatory_action_scope':
        return `${compactValue(row.record_count)} canonical note${Number(row.record_count) === 1 ? '' : 's'}`;
      case 'market_access_applicability':
        return `${compactValue(row.record_state)} · ${compactValue(row.record_count)} records`;
      case 'launch_date_semantics':
        return row.launch_date ? String(row.launch_date) : `Not recorded · ${compactValue(row.unresolved_tracking)}`;
      case 'verification_date_semantics': return compactValue(row.last_verified_at);
      case 'unknown_state_semantics':
        return `${compactValue(row.known_unknown_count)} known unknowns · unresolved state ${row.protected_unresolved_state_visible ? 'preserved' : 'not flagged'}`;
      case 'evidence_scope_and_relation_depth':
        return `${compactValue(row.evidence_count)} evidence records · ${arrayText(row.claim_scopes)}`;
      case 'known_unknown_visibility':
        return `${compactValue(row.record_count)} records · ${arrayText(row.topics)}`;
      default: return 'Canonical value available';
    }
  }

  function structuredNode(value: unknown, depth = 0): HTMLElement {
    const container = document.createElement('div');
    container.className = 'compare-structured-value';

    if (value === null || value === undefined || value === '') {
      const text = document.createElement('span');
      text.className = 'compare-not-recorded';
      text.textContent = 'Not recorded';
      container.append(text);
      return container;
    }

    if (typeof value !== 'object') {
      container.textContent = compactValue(value);
      return container;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        container.textContent = 'None recorded';
        return container;
      }
      if (value.every((item) => item === null || typeof item !== 'object')) {
        container.textContent = value.map(compactValue).join(', ');
        return container;
      }
      const list = document.createElement('ol');
      list.className = 'compare-record-list';
      for (const item of value) {
        const listItem = document.createElement('li');
        listItem.append(structuredNode(item, depth + 1));
        list.append(listItem);
      }
      container.append(list);
      return container;
    }

    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) {
      container.textContent = 'No canonical records';
      return container;
    }

    const definitionList = document.createElement('dl');
    definitionList.className = 'compare-structured-list';
    for (const [key, child] of entries) {
      const row = document.createElement('div');
      const term = document.createElement('dt');
      const definition = document.createElement('dd');
      term.textContent = humanize(key);
      if (depth >= 2 && child && typeof child === 'object') definition.textContent = Array.isArray(child) ? `${child.length} item${child.length === 1 ? '' : 's'}` : 'Structured record';
      else definition.append(structuredNode(child, depth + 1));
      row.append(term, definition);
      definitionList.append(row);
    }
    container.append(definitionList);
    return container;
  }

  function badge(kind: 'readiness' | 'freshness', state: string) {
    const element = document.createElement('span');
    element.className = `compare-badge compare-badge--${kind}`;
    element.dataset.state = state;
    element.textContent = `${kind === 'readiness' ? 'Readiness' : 'Freshness'}: ${humanize(state)}`;
    return element;
  }

  function assetHeader(asset: CompareAsset, compact = false) {
    const header = document.createElement('article');
    header.className = compact ? 'compare-cell-asset' : 'compare-asset-header';
    const symbol = document.createElement('span');
    symbol.className = 'compare-asset-symbol';
    symbol.textContent = asset.symbol || 'No symbol';
    const title = document.createElement(compact ? 'span' : 'h3');
    const link = document.createElement('a');
    link.href = `/stablecoin/${asset.slug}/`;
    link.textContent = asset.name;
    title.append(link);
    header.append(symbol, title);
    return header;
  }

  function readSelection() {
    return slots.map((slot) => slot.value).filter(Boolean).slice(0, maxAssets);
  }

  function selectionFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const values = (params.get('assets') ?? '').split(',').map((value) => value.trim()).filter(Boolean);
    const selected: string[] = [];
    for (const slug of values) {
      if (!knownSlugs.has(slug) || selected.includes(slug)) continue;
      selected.push(slug);
      if (selected.length >= maxAssets) break;
    }
    return selected;
  }

  function applySelection(slugs: string[]) {
    slots.forEach((slot, index) => { slot.value = slugs[index] ?? ''; });
  }

  function writeUrl(mode: 'push' | 'replace') {
    const selected = readSelection();
    const params = new URLSearchParams(window.location.search);
    if (selected.length) params.set('assets', selected.join(',')); else params.delete('assets');
    const next = `${window.location.pathname}${params.size ? `?${params.toString()}` : ''}${window.location.hash}`;
    window.history[mode === 'push' ? 'pushState' : 'replaceState']({}, '', next);
  }

  function setStatus(selectedCount: number) {
    if (!status) return;
    if (projectionError) {
      status.textContent = 'The comparison projection could not be loaded. Use the machine-readable endpoint or try again later.';
      return;
    }
    if (selectedCount === 0) status.textContent = `Choose at least ${minAssets} stablecoins to start a comparison.`;
    else if (selectedCount < minAssets) status.textContent = `${selectedCount} selected. Choose ${minAssets - selectedCount} more stablecoin to begin side-by-side comparison.`;
    else status.textContent = `${selectedCount} stablecoin records selected across ${config.groups.reduce((sum, group) => sum + group.dimensions.length, 0)} facets.`;
  }

  function render() {
    const selectedSlugs = readSelection();
    const assetBySlug = new Map((projection?.assets ?? []).map((asset) => [asset.slug, asset]));
    const selectedAssets = selectedSlugs.map((slug) => assetBySlug.get(slug)).filter((asset): asset is CompareAsset => Boolean(asset));
    setStatus(selectedAssets.length);

    if (!output || !empty || !columnHeader || !groupsContainer) return;
    const hasSelection = selectedAssets.length > 0;
    empty.hidden = hasSelection;
    output.hidden = !hasSelection;
    if (!hasSelection) return;

    output.style.setProperty('--compare-columns', String(selectedAssets.length));
    columnHeader.replaceChildren();
    groupsContainer.replaceChildren();

    const facetHeading = document.createElement('div');
    facetHeading.className = 'compare-facet-column-heading';
    facetHeading.textContent = 'Facet';
    columnHeader.append(facetHeading);
    for (const asset of selectedAssets) columnHeader.append(assetHeader(asset));

    for (const group of config.groups) {
      const section = document.createElement('section');
      section.className = 'compare-facet-group';
      section.dataset.compareGroup = group.id;
      const heading = document.createElement('header');
      heading.className = 'compare-group-heading';
      const eyebrow = document.createElement('span');
      eyebrow.textContent = 'Facet group';
      const title = document.createElement('h3');
      title.textContent = group.label;
      const description = document.createElement('p');
      description.textContent = group.description;
      heading.append(eyebrow, title, description);
      section.append(heading);

      for (const dimension of group.dimensions) {
        const row = document.createElement('div');
        row.className = 'compare-facet-row';
        row.dataset.dimensionId = dimension.id;

        const label = document.createElement('div');
        label.className = 'compare-facet-label';
        const labelTitle = document.createElement('h4');
        labelTitle.textContent = dimension.label;
        const labelDescription = document.createElement('p');
        labelDescription.textContent = dimension.description;
        label.append(labelTitle, labelDescription);
        row.append(label);

        for (const asset of selectedAssets) {
          const facet = asset.facets.find((item) => item.dimension_id === dimension.id);
          const cell = document.createElement('article');
          cell.className = 'compare-value-cell';
          cell.dataset.assetSlug = asset.slug;
          cell.append(assetHeader(asset, true));
          if (!facet) {
            const missing = document.createElement('p');
            missing.className = 'compare-value-summary';
            missing.textContent = 'Projection cell missing';
            cell.append(missing);
            row.append(cell);
            continue;
          }

          const summary = document.createElement('p');
          summary.className = 'compare-value-summary';
          summary.textContent = summaryFor(dimension.id, facet.value);
          const badges = document.createElement('div');
          badges.className = 'compare-badges';
          badges.append(badge('readiness', facet.readiness.state), badge('freshness', facet.freshness.state));

          const metadata = document.createElement('p');
          metadata.className = 'compare-freshness-meta';
          metadata.textContent = facet.freshness.anchor_date
            ? `Anchor ${facet.freshness.anchor_date}${facet.freshness.age_days === null ? '' : ` · ${facet.freshness.age_days} days old`}`
            : `No date anchor · ${humanize(facet.freshness.date_semantics)}`;

          const detail = document.createElement('details');
          detail.className = 'compare-value-details';
          const detailSummary = document.createElement('summary');
          detailSummary.textContent = 'View canonical fields';
          const detailBody = structuredNode(facet.value);
          detail.append(detailSummary, detailBody);
          cell.append(summary, badges, metadata, detail);
          row.append(cell);
        }
        section.append(row);
      }
      groupsContainer.append(section);
    }
  }

  function validateSlots(changed: HTMLSelectElement) {
    const values = slots.map((slot) => slot.value).filter(Boolean);
    const duplicates = values.filter((value, index) => values.indexOf(value) !== index);
    if (duplicates.length) {
      changed.value = '';
      if (alert) alert.textContent = 'Each comparison slot must use a different stablecoin. The duplicate selection was cleared.';
      return false;
    }
    if (alert) alert.textContent = '';
    return true;
  }

  async function copyLink() {
    const value = window.location.href;
    try {
      await navigator.clipboard.writeText(value);
      if (linkStatus) linkStatus.textContent = 'Comparison link copied.';
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = value;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.append(textarea);
      textarea.select();
      const copied = document.execCommand('copy');
      textarea.remove();
      if (linkStatus) linkStatus.textContent = copied ? 'Comparison link copied.' : 'Copy failed. Copy the current URL from the address bar.';
    }
  }

  async function loadProjection() {
    try {
      const response = await fetch('/data/comparison.json', { headers: { accept: 'application/json' } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      projection = await response.json() as CompareProjection;
      if (projection.asset_count !== 110 || projection.dimension_count !== 19 || projection.cell_count !== 2090) throw new Error('projection contract mismatch');
      render();
    } catch (error) {
      projectionError = error instanceof Error ? error.message : String(error);
      if (alert) alert.textContent = 'Comparison data failed to load.';
      setStatus(readSelection().length);
    }
  }

  for (const slot of slots) {
    slot.addEventListener('change', () => {
      if (!validateSlots(slot)) {
        render();
        return;
      }
      if (linkStatus) linkStatus.textContent = '';
      writeUrl('push');
      render();
    });
  }

  clearButton?.addEventListener('click', () => {
    applySelection([]);
    if (alert) alert.textContent = '';
    if (linkStatus) linkStatus.textContent = '';
    writeUrl('push');
    render();
  });
  copyButton?.addEventListener('click', copyLink);
  window.addEventListener('popstate', () => { applySelection(selectionFromUrl()); render(); });

  applySelection(selectionFromUrl());
  writeUrl('replace');
  setStatus(readSelection().length);
  loadProjection();
}
