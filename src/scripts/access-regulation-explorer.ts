type FilterConfig = {
  id: string;
  label: string;
  query_param: string;
  group: string;
};

type ExplorerConfig = {
  source_endpoint: string;
  initial_result_limit: number;
  result_limit_increment: number;
  filters: FilterConfig[];
  url_contract: { search_param: string };
};

type AxisValue = { value: string; asset_count: number };
type IndexFilter = { axis: string; values: AxisValue[] };

type PublicState = {
  readiness: { state: string; scored: boolean };
  freshness: {
    state: string;
    anchor_date: string | null;
    age_days: number | null;
    date_semantics: string;
    inherited_review_anchor: boolean;
  };
};

type LegalClassification = {
  classification: string | null;
  jurisdiction: string | null;
  effective_from: string | null;
  effective_to: string | null;
  authority_or_basis: string | null;
  confidence: string | null;
};

type RegulatoryRecord = {
  id: string | null;
  note_type: string | null;
  note_date: string | null;
  jurisdiction: string | null;
  authority_or_source: string | null;
  summary: string | null;
};

type MarketAccessRecord = {
  id: string | null;
  jurisdiction: { country_code: string | null; subdivision_code: string | null };
  platform: { name: string | null; service: string | null };
  function: string | null;
  access_state: string | null;
  effective_from: string | null;
  effective_to: string | null;
  observed_at: string | null;
  network_scope: unknown;
  customer_scope: unknown;
  conditions: unknown[];
};

type IndexRow = {
  asset_id: string;
  slug: string;
  name: string;
  symbol: string | null;
  lifecycle_status: string | null;
  legal: {
    profile_state: string;
    classifications: LegalClassification[];
    holder_claim_type: string | null;
    reserve_ownership: string | null;
    reserve_segregation: string | null;
    bankruptcy_remoteness: string | null;
    licensed_or_regulated_as: string[];
  } & PublicState;
  regulatory: {
    record_state: string;
    record_count: number;
    records: RegulatoryRecord[];
  } & PublicState;
  market_access: {
    record_state: string;
    record_count: number;
    records: MarketAccessRecord[];
  } & PublicState;
  filter_tokens: Record<string, string[]>;
};

type AccessRegulationIndex = {
  asset_count: number;
  single_composite_score: boolean;
  risk_ranking: boolean;
  filters: IndexFilter[];
  rows: IndexRow[];
};

const foundExplorerRoot = document.querySelector('[data-ar-explorer]');

if (foundExplorerRoot instanceof HTMLElement) {
  const root = foundExplorerRoot;
  const configElement = document.querySelector<HTMLScriptElement>('#ar-explorer-config');
  const config: ExplorerConfig = configElement?.textContent
    ? JSON.parse(configElement.textContent) as ExplorerConfig
    : { source_endpoint: '/data/access-regulation-index.json', initial_result_limit: 50, result_limit_increment: 25, filters: [], url_contract: { search_param: 'q' } };

  const searchInput = root.querySelector<HTMLInputElement>('[data-ar-search]');
  const clearButton = root.querySelector<HTMLButtonElement>('[data-ar-clear]');
  const copyButton = root.querySelector<HTMLButtonElement>('[data-ar-copy]');
  const copyStatus = root.querySelector<HTMLElement>('[data-ar-copy-status]');
  const activeFilters = root.querySelector<HTMLElement>('[data-ar-active-filters]');
  const alert = root.querySelector<HTMLElement>('[data-ar-alert]');
  const loading = root.querySelector<HTMLElement>('[data-ar-loading]');
  const empty = root.querySelector<HTMLElement>('[data-ar-empty]');
  const results = root.querySelector<HTMLElement>('[data-ar-results]');
  const resultCount = root.querySelector<HTMLElement>('[data-ar-result-count]');
  const resultRange = root.querySelector<HTMLElement>('[data-ar-result-range]');
  const showMoreRow = root.querySelector<HTMLElement>('[data-ar-show-more-row]');
  const showMoreButton = root.querySelector<HTMLButtonElement>('[data-ar-show-more]');
  const selectByFilter = new Map<string, HTMLSelectElement>();
  let index: AccessRegulationIndex | null = null;
  let visibleLimit = config.initial_result_limit;
  let searchTimer: number | null = null;

  const humanize = (value: string | null | undefined) => String(value ?? 'not_recorded')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());

  const appendText = (parent: HTMLElement, text: string, className?: string) => {
    const element = document.createElement('span');
    if (className) element.className = className;
    element.textContent = text;
    parent.append(element);
    return element;
  };

  function badge(label: string, state: string, kind: string) {
    const element = document.createElement('span');
    element.className = `ar-badge ar-badge--${kind}`;
    element.dataset.state = state;
    element.textContent = `${label}: ${humanize(state)}`;
    return element;
  }

  function stateBadges(layer: PublicState) {
    const container = document.createElement('div');
    container.className = 'ar-state-badges';
    container.append(
      badge('Readiness', layer.readiness.state, 'readiness'),
      badge('Freshness', layer.freshness.state, 'freshness')
    );
    return container;
  }

  function freshnessMeta(layer: PublicState) {
    const text = document.createElement('p');
    text.className = 'ar-freshness-meta';
    text.textContent = layer.freshness.anchor_date
      ? `Anchor ${layer.freshness.anchor_date}${layer.freshness.age_days === null ? '' : ` · ${layer.freshness.age_days} days old`}`
      : `No date anchor · ${humanize(layer.freshness.date_semantics)}`;
    return text;
  }

  function chipList(values: string[], emptyText: string) {
    const container = document.createElement('div');
    container.className = 'ar-chip-list';
    if (!values.length) {
      appendText(container, emptyText, 'ar-chip ar-chip--empty');
      return container;
    }
    for (const value of values) appendText(container, humanize(value), 'ar-chip');
    return container;
  }

  function detailList(entries: Array<[string, string | null | undefined]>) {
    const list = document.createElement('dl');
    list.className = 'ar-detail-list';
    for (const [label, value] of entries) {
      const row = document.createElement('div');
      const term = document.createElement('dt');
      const definition = document.createElement('dd');
      term.textContent = label;
      definition.textContent = value ? humanize(value) : 'Not recorded';
      row.append(term, definition);
      list.append(row);
    }
    return list;
  }

  function legalSection(row: IndexRow) {
    const section = document.createElement('section');
    section.className = 'ar-card-layer';
    const heading = document.createElement('h3');
    heading.textContent = 'Legal profile';
    const state = document.createElement('p');
    state.className = 'ar-layer-summary';
    state.textContent = humanize(row.legal.profile_state);
    section.append(heading, state, stateBadges(row.legal), freshnessMeta(row.legal));

    const classificationValues = row.legal.classifications.map((item) => item.classification).filter((value): value is string => Boolean(value));
    const jurisdictions = row.legal.classifications.map((item) => item.jurisdiction).filter((value): value is string => Boolean(value));
    section.append(chipList(classificationValues, 'No classification value'), chipList(jurisdictions, 'No legal jurisdiction recorded'));

    const details = document.createElement('details');
    details.className = 'ar-layer-details';
    const summary = document.createElement('summary');
    summary.textContent = 'View legal fields';
    details.append(summary, detailList([
      ['Holder claim type', row.legal.holder_claim_type],
      ['Reserve ownership', row.legal.reserve_ownership],
      ['Reserve segregation', row.legal.reserve_segregation],
      ['Bankruptcy remoteness', row.legal.bankruptcy_remoteness]
    ]));
    if (row.legal.licensed_or_regulated_as.length) {
      const label = document.createElement('p');
      label.className = 'ar-detail-label';
      label.textContent = 'Licensed or regulated as';
      details.append(label, chipList(row.legal.licensed_or_regulated_as, 'None recorded'));
    }
    section.append(details);
    return section;
  }

  function regulatorySection(row: IndexRow) {
    const section = document.createElement('section');
    section.className = 'ar-card-layer';
    const heading = document.createElement('h3');
    heading.textContent = 'Regulatory Notes';
    const summaryText = document.createElement('p');
    summaryText.className = 'ar-layer-summary';
    summaryText.textContent = `${humanize(row.regulatory.record_state)} · ${row.regulatory.record_count} canonical record${row.regulatory.record_count === 1 ? '' : 's'}`;
    section.append(heading, summaryText, stateBadges(row.regulatory), freshnessMeta(row.regulatory));

    const types = row.filter_tokens.regulatory_note_type ?? [];
    const jurisdictions = row.filter_tokens.regulatory_jurisdiction ?? [];
    section.append(chipList(types, 'No canonical note type'), chipList(jurisdictions, 'No regulatory jurisdiction token'));

    if (row.regulatory.records.length) {
      const details = document.createElement('details');
      details.className = 'ar-layer-details';
      const summary = document.createElement('summary');
      summary.textContent = `View ${row.regulatory.records.length} canonical note${row.regulatory.records.length === 1 ? '' : 's'}`;
      const list = document.createElement('ol');
      list.className = 'ar-record-list';
      for (const record of row.regulatory.records) {
        const item = document.createElement('li');
        const title = document.createElement('strong');
        title.textContent = `${humanize(record.note_type)} · ${record.note_date ?? 'date not recorded'}`;
        const meta = document.createElement('small');
        meta.textContent = [record.jurisdiction, record.authority_or_source].filter(Boolean).join(' · ') || 'Scope not recorded';
        const summaryTextNode = document.createElement('p');
        summaryTextNode.textContent = record.summary ?? 'No summary recorded';
        item.append(title, meta, summaryTextNode);
        list.append(item);
      }
      details.append(summary, list);
      section.append(details);
    }
    return section;
  }

  function marketAccessSection(row: IndexRow) {
    const section = document.createElement('section');
    section.className = 'ar-card-layer';
    const heading = document.createElement('h3');
    heading.textContent = 'Market Access';
    const summaryText = document.createElement('p');
    summaryText.className = 'ar-layer-summary';
    summaryText.textContent = `${humanize(row.market_access.record_state)} · ${row.market_access.record_count} canonical record${row.market_access.record_count === 1 ? '' : 's'}`;
    section.append(heading, summaryText, stateBadges(row.market_access), freshnessMeta(row.market_access));

    const states = row.filter_tokens.market_access_state ?? [];
    const jurisdictions = row.filter_tokens.market_access_jurisdiction ?? [];
    section.append(chipList(states, 'No canonical access-state token'), chipList(jurisdictions, 'No canonical access jurisdiction token'));

    if (row.market_access.records.length) {
      const details = document.createElement('details');
      details.className = 'ar-layer-details';
      const summary = document.createElement('summary');
      summary.textContent = `View ${row.market_access.records.length} canonical access record${row.market_access.records.length === 1 ? '' : 's'}`;
      const list = document.createElement('ol');
      list.className = 'ar-record-list';
      for (const record of row.market_access.records) {
        const item = document.createElement('li');
        const title = document.createElement('strong');
        title.textContent = `${humanize(record.function)} · ${humanize(record.access_state)}`;
        const meta = document.createElement('small');
        meta.textContent = [record.jurisdiction.country_code, record.platform.name, record.platform.service, record.effective_from].filter(Boolean).join(' · ') || 'Scope not recorded';
        item.append(title, meta);
        list.append(item);
      }
      details.append(summary, list);
      section.append(details);
    }
    return section;
  }

  function renderCard(row: IndexRow) {
    const article = document.createElement('article');
    article.className = 'ar-result-card';
    article.dataset.assetId = row.asset_id;

    const header = document.createElement('header');
    header.className = 'ar-result-card__header';
    const identity = document.createElement('div');
    const eyebrow = document.createElement('span');
    eyebrow.textContent = row.symbol || 'No symbol';
    const heading = document.createElement('h2');
    const link = document.createElement('a');
    link.href = `/stablecoin/${row.slug}/`;
    link.textContent = row.name;
    heading.append(link);
    identity.append(eyebrow, heading);
    const lifecycle = document.createElement('span');
    lifecycle.className = 'ar-lifecycle';
    lifecycle.dataset.state = row.lifecycle_status ?? 'unknown';
    lifecycle.textContent = humanize(row.lifecycle_status);
    header.append(identity, lifecycle);

    const layers = document.createElement('div');
    layers.className = 'ar-card-layers';
    layers.append(legalSection(row), regulatorySection(row), marketAccessSection(row));
    article.append(header, layers);
    return article;
  }

  function filterCatalog(axis: string) {
    return index?.filters.find((filter) => filter.axis === axis)?.values ?? [];
  }

  function buildFilters() {
    for (const filter of config.filters) {
      const slot = root.querySelector<HTMLElement>(`[data-ar-filter-slot="${filter.group}"]`);
      if (!slot) continue;
      const label = document.createElement('label');
      label.className = 'ar-filter-control';
      const text = document.createElement('span');
      text.textContent = filter.label;
      const select = document.createElement('select');
      select.dataset.arFilterId = filter.id;
      select.dataset.arQueryParam = filter.query_param;
      select.setAttribute('aria-label', filter.label);
      const allOption = document.createElement('option');
      allOption.value = '';
      allOption.textContent = `All ${filter.label.toLowerCase()}`;
      select.append(allOption);
      for (const option of filterCatalog(filter.id)) {
        const element = document.createElement('option');
        element.value = option.value;
        element.textContent = `${humanize(option.value)} (${option.asset_count})`;
        select.append(element);
      }
      if (select.options.length === 1) {
        select.disabled = true;
        allOption.textContent = `${filter.label}: no canonical values yet`;
      }
      label.append(text, select);
      slot.append(label);
      selectByFilter.set(filter.id, select);
      select.addEventListener('change', () => {
        visibleLimit = config.initial_result_limit;
        updateUrl('push');
        render();
      });
    }
  }

  function restoreStateFromUrl() {
    const params = new URLSearchParams(window.location.search);
    if (searchInput) searchInput.value = params.get(config.url_contract.search_param) ?? '';
    for (const filter of config.filters) {
      const select = selectByFilter.get(filter.id);
      if (!select) continue;
      const requested = params.get(filter.query_param) ?? '';
      select.value = [...select.options].some((option) => option.value === requested) ? requested : '';
    }
    visibleLimit = config.initial_result_limit;
  }

  function updateUrl(mode: 'push' | 'replace') {
    const params = new URLSearchParams();
    const query = searchInput?.value.trim() ?? '';
    if (query) params.set(config.url_contract.search_param, query);
    for (const filter of config.filters) {
      const select = selectByFilter.get(filter.id);
      if (select?.value) params.set(filter.query_param, select.value);
    }
    const next = `${window.location.pathname}${params.size ? `?${params.toString()}` : ''}${window.location.hash}`;
    window.history[mode === 'push' ? 'pushState' : 'replaceState']({}, '', next);
  }

  function matchingRows() {
    if (!index) return [];
    const query = searchInput?.value.trim().toLocaleLowerCase() ?? '';
    return index.rows.filter((row) => {
      if (query) {
        const haystack = `${row.name} ${row.symbol ?? ''} ${row.slug}`.toLocaleLowerCase();
        if (!haystack.includes(query)) return false;
      }
      for (const filter of config.filters) {
        const selected = selectByFilter.get(filter.id)?.value ?? '';
        if (!selected) continue;
        if (!(row.filter_tokens[filter.id] ?? []).includes(selected)) return false;
      }
      return true;
    });
  }

  function renderActiveFilters(rows: IndexRow[]) {
    if (!activeFilters) return;
    activeFilters.replaceChildren();
    const query = searchInput?.value.trim() ?? '';
    if (query) appendText(activeFilters, `Search: ${query}`, 'ar-active-filter');
    for (const filter of config.filters) {
      const select = selectByFilter.get(filter.id);
      if (!select?.value) continue;
      appendText(activeFilters, `${filter.label}: ${humanize(select.value)}`, 'ar-active-filter');
    }
    const summary = document.createElement('span');
    summary.className = 'ar-active-filter-summary';
    summary.textContent = `${rows.length} of ${index?.asset_count ?? 0} assets match`;
    activeFilters.append(summary);
  }

  function render() {
    if (!index || !results || !empty || !loading) return;
    const matched = matchingRows();
    const visible = matched.slice(0, visibleLimit);
    results.replaceChildren(...visible.map(renderCard));
    loading.hidden = true;
    empty.hidden = matched.length !== 0;
    results.hidden = matched.length === 0;
    if (resultCount) resultCount.textContent = String(matched.length);
    if (resultRange) resultRange.textContent = matched.length
      ? `showing ${Math.min(visible.length, matched.length)} of ${matched.length}`
      : 'showing 0 results';
    if (showMoreRow) showMoreRow.hidden = visible.length >= matched.length || matched.length === 0;
    renderActiveFilters(matched);
  }

  async function copyCurrentView() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      if (copyStatus) copyStatus.textContent = 'Filtered view link copied.';
    } catch {
      if (copyStatus) copyStatus.textContent = 'Copy failed. Copy the current URL from the address bar.';
    }
  }

  searchInput?.addEventListener('input', () => {
    if (searchTimer !== null) window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => {
      visibleLimit = config.initial_result_limit;
      updateUrl('replace');
      render();
    }, 120);
  });

  clearButton?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    for (const select of selectByFilter.values()) select.value = '';
    visibleLimit = config.initial_result_limit;
    if (copyStatus) copyStatus.textContent = '';
    if (alert) alert.textContent = '';
    updateUrl('push');
    render();
  });

  copyButton?.addEventListener('click', copyCurrentView);
  showMoreButton?.addEventListener('click', () => {
    visibleLimit += config.result_limit_increment;
    render();
  });
  window.addEventListener('popstate', () => {
    restoreStateFromUrl();
    render();
  });

  async function loadIndex() {
    try {
      const response = await fetch(config.source_endpoint, { headers: { accept: 'application/json' } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      index = await response.json() as AccessRegulationIndex;
      if (index.asset_count !== 110 || index.single_composite_score !== false || index.risk_ranking !== false) {
        throw new Error('access/regulation index contract mismatch');
      }
      buildFilters();
      restoreStateFromUrl();
      updateUrl('replace');
      render();
    } catch (error) {
      if (loading) loading.hidden = true;
      if (alert) alert.textContent = `Explorer index failed to load: ${error instanceof Error ? error.message : String(error)}`;
      if (resultRange) resultRange.textContent = 'index unavailable';
    }
  }

  loadIndex();
}
