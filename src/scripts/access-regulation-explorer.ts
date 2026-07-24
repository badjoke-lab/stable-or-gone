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
  single_composite_score: false;
  risk_ranking: false;
  filters: IndexFilter[];
  rows: IndexRow[];
};

const explorerRoot = document.querySelector('[data-ar-explorer]');

if (explorerRoot instanceof HTMLElement) {
  const configElement = document.querySelector<HTMLScriptElement>('#ar-explorer-config');
  const config: ExplorerConfig = configElement?.textContent
    ? JSON.parse(configElement.textContent) as ExplorerConfig
    : {
        source_endpoint: '/data/access-regulation-index.json',
        initial_result_limit: 50,
        result_limit_increment: 25,
        filters: [],
        url_contract: { search_param: 'q' }
      };

  const searchInput = explorerRoot.querySelector<HTMLInputElement>('[data-ar-search]');
  const clearButton = explorerRoot.querySelector<HTMLButtonElement>('[data-ar-clear]');
  const copyButton = explorerRoot.querySelector<HTMLButtonElement>('[data-ar-copy]');
  const copyStatus = explorerRoot.querySelector<HTMLElement>('[data-ar-copy-status]');
  const activeFilters = explorerRoot.querySelector<HTMLElement>('[data-ar-active-filters]');
  const alert = explorerRoot.querySelector<HTMLElement>('[data-ar-alert]');
  const loading = explorerRoot.querySelector<HTMLElement>('[data-ar-loading]');
  const empty = explorerRoot.querySelector<HTMLElement>('[data-ar-empty]');
  const results = explorerRoot.querySelector<HTMLElement>('[data-ar-results]');
  const resultCount = explorerRoot.querySelector<HTMLElement>('[data-ar-result-count]');
  const resultRange = explorerRoot.querySelector<HTMLElement>('[data-ar-result-range]');
  const showMoreRow = explorerRoot.querySelector<HTMLElement>('[data-ar-show-more-row]');
  const showMoreButton = explorerRoot.querySelector<HTMLButtonElement>('[data-ar-show-more]');
  const contractAssetCount = explorerRoot.querySelector<HTMLElement>('[data-ar-contract-asset-count]');
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

  const isIndex = (value: unknown): value is AccessRegulationIndex => {
    if (!value || typeof value !== 'object') return false;
    const candidate = value as Partial<AccessRegulationIndex>;
    return Array.isArray(candidate.rows)
      && Array.isArray(candidate.filters)
      && Number.isInteger(candidate.asset_count)
      && candidate.asset_count === candidate.rows.length
      && candidate.single_composite_score === false
      && candidate.risk_ranking === false;
  };

  const badge = (label: string, state: string, kind: string) => {
    const element = document.createElement('span');
    element.className = `ar-badge ar-badge--${kind}`;
    element.dataset.state = state;
    element.textContent = `${label}: ${humanize(state)}`;
    return element;
  };

  const stateBadges = (layer: PublicState) => {
    const container = document.createElement('div');
    container.className = 'ar-state-badges';
    container.append(
      badge('Readiness', layer.readiness.state, 'readiness'),
      badge('Freshness', layer.freshness.state, 'freshness')
    );
    return container;
  };

  const freshnessMeta = (layer: PublicState) => {
    const text = document.createElement('p');
    text.className = 'ar-freshness-meta';
    text.textContent = layer.freshness.anchor_date
      ? `Anchor ${layer.freshness.anchor_date}${layer.freshness.age_days === null ? '' : ` · ${layer.freshness.age_days} days old`}`
      : `No date anchor · ${humanize(layer.freshness.date_semantics)}`;
    return text;
  };

  const chipList = (values: string[], emptyText: string) => {
    const container = document.createElement('div');
    container.className = 'ar-chip-list';
    if (!values.length) {
      appendText(container, emptyText, 'ar-chip ar-chip--empty');
      return container;
    }
    for (const value of values) appendText(container, humanize(value), 'ar-chip');
    return container;
  };

  const detailList = (entries: Array<[string, string | null | undefined]>) => {
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
  };

  const legalSection = (row: IndexRow) => {
    const section = document.createElement('section');
    section.className = 'ar-card-layer';

    const heading = document.createElement('h3');
    heading.textContent = 'Legal profile';
    const state = document.createElement('p');
    state.className = 'ar-layer-summary';
    state.textContent = humanize(row.legal.profile_state);
    section.append(heading, state, stateBadges(row.legal), freshnessMeta(row.legal));

    const classifications = row.legal.classifications
      .map((item) => item.classification)
      .filter((value): value is string => Boolean(value));
    const jurisdictions = row.legal.classifications
      .map((item) => item.jurisdiction)
      .filter((value): value is string => Boolean(value));
    section.append(
      chipList(classifications, 'No classification value'),
      chipList(jurisdictions, 'No legal jurisdiction recorded')
    );

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
  };

  const regulatorySection = (row: IndexRow) => {
    const section = document.createElement('section');
    section.className = 'ar-card-layer';

    const heading = document.createElement('h3');
    heading.textContent = 'Regulatory Notes';
    const summaryText = document.createElement('p');
    summaryText.className = 'ar-layer-summary';
    summaryText.textContent = `${humanize(row.regulatory.record_state)} · ${row.regulatory.record_count} canonical record${row.regulatory.record_count === 1 ? '' : 's'}`;
    section.append(heading, summaryText, stateBadges(row.regulatory), freshnessMeta(row.regulatory));

    section.append(
      chipList(row.filter_tokens.regulatory_note_type ?? [], 'No canonical note type'),
      chipList(row.filter_tokens.regulatory_jurisdiction ?? [], 'No regulatory jurisdiction token')
    );

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
        const copy = document.createElement('p');
        copy.textContent = record.summary ?? 'No summary recorded';
        item.append(title, meta, copy);
        list.append(item);
      }
      details.append(summary, list);
      section.append(details);
    }
    return section;
  };

  const marketAccessSection = (row: IndexRow) => {
    const section = document.createElement('section');
    section.className = 'ar-card-layer';

    const heading = document.createElement('h3');
    heading.textContent = 'Market Access';
    const summaryText = document.createElement('p');
    summaryText.className = 'ar-layer-summary';
    summaryText.textContent = `${humanize(row.market_access.record_state)} · ${row.market_access.record_count} canonical record${row.market_access.record_count === 1 ? '' : 's'}`;
    section.append(heading, summaryText, stateBadges(row.market_access), freshnessMeta(row.market_access));

    section.append(
      chipList(row.filter_tokens.market_access_state ?? [], 'No canonical access-state token'),
      chipList(row.filter_tokens.market_access_jurisdiction ?? [], 'No canonical access jurisdiction token')
    );

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
        meta.textContent = [
          record.jurisdiction.country_code,
          record.platform.name,
          record.platform.service,
          record.effective_from
        ].filter(Boolean).join(' · ') || 'Scope not recorded';
        item.append(title, meta);
        list.append(item);
      }
      details.append(summary, list);
      section.append(details);
    }
    return section;
  };

  const renderCard = (row: IndexRow) => {
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
  };

  const filterCatalog = (axis: string) => index?.filters.find((filter) => filter.axis === axis)?.values ?? [];

  const buildFilters = () => {
    selectByFilter.clear();
    explorerRoot.querySelectorAll<HTMLElement>('[data-ar-filter-slot]').forEach((slot) => slot.replaceChildren());
    for (const filter of config.filters) {
      const slot = explorerRoot.querySelector<HTMLElement>(`[data-ar-filter-slot="${filter.group}"]`);
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
  };

  const restoreStateFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    if (searchInput) searchInput.value = params.get(config.url_contract.search_param) ?? '';
    for (const filter of config.filters) {
      const select = selectByFilter.get(filter.id);
      if (!select) continue;
      const requested = params.get(filter.query_param) ?? '';
      select.value = [...select.options].some((option) => option.value === requested) ? requested : '';
    }
    visibleLimit = config.initial_result_limit;
  };

  const updateUrl = (mode: 'push' | 'replace') => {
    const params = new URLSearchParams();
    const query = searchInput?.value.trim() ?? '';
    if (query) params.set(config.url_contract.search_param, query);
    for (const filter of config.filters) {
      const select = selectByFilter.get(filter.id);
      if (select?.value) params.set(filter.query_param, select.value);
    }
    const next = `${window.location.pathname}${params.size ? `?${params.toString()}` : ''}${window.location.hash}`;
    window.history[mode === 'push' ? 'pushState' : 'replaceState']({}, '', next);
  };

  const matchingRows = () => {
    if (!index) return [];
    const query = searchInput?.value.trim().toLocaleLowerCase() ?? '';
    return index.rows.filter((row) => {
      if (query) {
        const haystack = `${row.name} ${row.symbol ?? ''} ${row.slug}`.toLocaleLowerCase();
        if (!haystack.includes(query)) return false;
      }
      for (const filter of config.filters) {
        const selected = selectByFilter.get(filter.id)?.value ?? '';
        if (selected && !(row.filter_tokens[filter.id] ?? []).includes(selected)) return false;
      }
      return true;
    });
  };

  const renderActiveFilters = (rows: IndexRow[]) => {
    if (!activeFilters) return;
    activeFilters.replaceChildren();
    const query = searchInput?.value.trim() ?? '';
    if (query) appendText(activeFilters, `Search: ${query}`, 'ar-active-filter');
    for (const filter of config.filters) {
      const select = selectByFilter.get(filter.id);
      if (select?.value) appendText(activeFilters, `${filter.label}: ${humanize(select.value)}`, 'ar-active-filter');
    }
    const summary = document.createElement('span');
    summary.className = 'ar-active-filter-summary';
    summary.textContent = `${rows.length} of ${index?.asset_count ?? 0} assets match`;
    activeFilters.append(summary);
  };

  const resetEmptyCopy = () => {
    if (!empty) return;
    const heading = empty.querySelector('strong');
    const copy = empty.querySelector('p');
    if (heading) heading.textContent = 'No matching assets';
    if (copy) copy.textContent = 'Clear one or more filters. A zero-result filter state is not a legal, regulatory, or availability conclusion.';
  };

  const render = () => {
    if (!index || !results || !empty || !loading) return;
    const matched = matchingRows();
    const visible = matched.slice(0, visibleLimit);
    resetEmptyCopy();
    results.replaceChildren(...visible.map(renderCard));
    loading.hidden = true;
    empty.hidden = matched.length !== 0;
    results.hidden = matched.length === 0;
    if (resultCount) resultCount.textContent = String(matched.length);
    if (resultRange) {
      resultRange.textContent = matched.length
        ? `showing ${Math.min(visible.length, matched.length)} of ${matched.length}`
        : 'showing 0 results';
    }
    if (showMoreRow) showMoreRow.hidden = visible.length >= matched.length || matched.length === 0;
    renderActiveFilters(matched);
  };

  const renderLoadFailure = (message: string) => {
    if (loading) loading.hidden = true;
    if (results) {
      results.hidden = true;
      results.replaceChildren();
    }
    if (empty) {
      empty.hidden = false;
      const heading = empty.querySelector('strong');
      const copy = empty.querySelector('p');
      if (heading) heading.textContent = 'Explorer index unavailable';
      if (copy) copy.textContent = 'The canonical index could not be loaded. No legal, regulatory, or availability conclusion should be inferred from this unavailable state.';
    }
    if (showMoreRow) showMoreRow.hidden = true;
    if (resultCount) resultCount.textContent = '0';
    if (resultRange) resultRange.textContent = 'index unavailable';
    if (contractAssetCount) contractAssetCount.textContent = 'Unavailable';
    if (alert) alert.textContent = `Explorer index failed to load: ${message}`;
  };

  const copyCurrentView = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      if (copyStatus) copyStatus.textContent = 'Filtered view link copied.';
    } catch {
      if (copyStatus) copyStatus.textContent = 'Copy failed. Copy the current URL from the address bar.';
    }
  };

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

  const loadIndex = async () => {
    try {
      const response = await fetch(config.source_endpoint, { headers: { accept: 'application/json' } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload: unknown = await response.json();
      if (!isIndex(payload)) throw new Error('access/regulation index contract mismatch');
      index = payload;
      if (contractAssetCount) contractAssetCount.textContent = String(index.asset_count);
      buildFilters();
      restoreStateFromUrl();
      updateUrl('replace');
      render();
    } catch (error) {
      renderLoadFailure(error instanceof Error ? error.message : String(error));
    }
  };

  void loadIndex();
}
