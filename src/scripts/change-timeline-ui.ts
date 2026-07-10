type TimelineFilterConfig = {
  id: string;
  label: string;
  query_param: string;
  group: string;
};

type TimelineUiConfig = {
  source_endpoint: string;
  initial_result_limit: number;
  result_limit_increment: number;
  filters: TimelineFilterConfig[];
  url_contract: { search_param: string };
};

type TimelineFilterValue = { value: string; item_count: number };
type TimelineAssetRef = { asset_id: string; slug: string | null; name: string | null; symbol: string | null };
type TimelineOrganizationRef = { organization_id: string; name: string | null };

type TimelineItem = {
  item_id: string;
  date: string;
  year: string;
  date_kind: string;
  date_semantics: string;
  boundary_kind: string;
  source_family: string;
  source_record_id: string;
  change_type: string;
  asset_ids: string[];
  assets: TimelineAssetRef[];
  organization_ids: string[];
  organizations: TimelineOrganizationRef[];
  jurisdiction_tokens: string[];
  title: string;
  summary: string | null;
  confidence: string | null;
  metadata: Record<string, unknown>;
};

type TimelineProjection = {
  item_count: number;
  projection_rules: {
    date_semantics_preserved: boolean;
    single_generic_timestamp: boolean;
    review_dates_are_change_items: boolean;
    freshness_dates_are_change_items: boolean;
    single_composite_score: boolean;
    risk_ranking: boolean;
  };
  filters: Record<string, TimelineFilterValue[]>;
  items: TimelineItem[];
};

const foundTimelineRoot = document.querySelector('[data-timeline-page]');

if (foundTimelineRoot instanceof HTMLElement) {
  const root = foundTimelineRoot;
  const configElement = document.querySelector<HTMLScriptElement>('#timeline-ui-config');
  const config: TimelineUiConfig = configElement?.textContent
    ? JSON.parse(configElement.textContent) as TimelineUiConfig
    : {
        source_endpoint: '/data/change-timeline.json',
        initial_result_limit: 40,
        result_limit_increment: 20,
        filters: [],
        url_contract: { search_param: 'q' }
      };

  const searchInput = root.querySelector<HTMLInputElement>('[data-timeline-search]');
  const clearButton = root.querySelector<HTMLButtonElement>('[data-timeline-clear]');
  const copyButton = root.querySelector<HTMLButtonElement>('[data-timeline-copy]');
  const copyStatus = root.querySelector<HTMLElement>('[data-timeline-copy-status]');
  const activeFilters = root.querySelector<HTMLElement>('[data-timeline-active-filters]');
  const alert = root.querySelector<HTMLElement>('[data-timeline-alert]');
  const loading = root.querySelector<HTMLElement>('[data-timeline-loading]');
  const empty = root.querySelector<HTMLElement>('[data-timeline-empty]');
  const results = root.querySelector<HTMLElement>('[data-timeline-results]');
  const resultCount = root.querySelector<HTMLElement>('[data-timeline-result-count]');
  const resultRange = root.querySelector<HTMLElement>('[data-timeline-result-range]');
  const showMoreRow = root.querySelector<HTMLElement>('[data-timeline-show-more-row]');
  const showMoreButton = root.querySelector<HTMLButtonElement>('[data-timeline-show-more]');
  const selectByFilter = new Map<string, HTMLSelectElement>();
  let projection: TimelineProjection | null = null;
  let visibleLimit = config.initial_result_limit;
  let searchTimer: number | null = null;

  const humanize = (value: string | null | undefined) => String(value ?? 'not_recorded')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());

  function appendText(parent: HTMLElement, text: string, className?: string) {
    const element = document.createElement('span');
    if (className) element.className = className;
    element.textContent = text;
    parent.append(element);
    return element;
  }

  function createBadge(label: string, value: string, kind: string) {
    const badge = document.createElement('span');
    badge.className = `timeline-badge timeline-badge--${kind}`;
    badge.dataset.state = value;
    badge.textContent = `${label}: ${humanize(value)}`;
    return badge;
  }

  function createLinkList(items: TimelineItem) {
    const links = document.createElement('div');
    links.className = 'timeline-subject-links';

    for (const asset of items.assets) {
      if (!asset.slug) continue;
      const link = document.createElement('a');
      link.href = `/stablecoin/${asset.slug}/`;
      link.textContent = asset.symbol ? `${asset.name ?? asset.asset_id} (${asset.symbol})` : (asset.name ?? asset.asset_id);
      links.append(link);
    }

    for (const organization of items.organizations) {
      const item = document.createElement('span');
      item.textContent = organization.name ?? organization.organization_id;
      links.append(item);
    }

    if (!links.childElementCount) appendText(links, 'No linked subject reference', 'timeline-subject-empty');
    return links;
  }

  function createMetadata(item: TimelineItem) {
    const grid = document.createElement('dl');
    grid.className = 'timeline-item-metadata';
    const entries: Array<[string, string]> = [
      ['Source family', humanize(item.source_family)],
      ['Date kind', humanize(item.date_kind)],
      ['Boundary', humanize(item.boundary_kind)],
      ['Change type', humanize(item.change_type)],
      ['Date semantics', humanize(item.date_semantics)],
      ['Source record', item.source_record_id]
    ];
    if (item.jurisdiction_tokens.length) entries.push(['Jurisdiction', item.jurisdiction_tokens.join(', ')]);
    if (item.confidence) entries.push(['Confidence', humanize(item.confidence)]);

    for (const [label, value] of entries) {
      const row = document.createElement('div');
      const term = document.createElement('dt');
      const definition = document.createElement('dd');
      term.textContent = label;
      definition.textContent = value;
      row.append(term, definition);
      grid.append(row);
    }
    return grid;
  }

  function renderItem(item: TimelineItem) {
    const article = document.createElement('article');
    article.className = 'timeline-item';
    article.dataset.timelineItemId = item.item_id;

    const dateColumn = document.createElement('div');
    dateColumn.className = 'timeline-item__date';
    const year = document.createElement('span');
    year.textContent = item.year;
    const date = document.createElement('time');
    date.dateTime = item.date;
    date.textContent = item.date;
    dateColumn.append(year, date);

    const content = document.createElement('div');
    content.className = 'timeline-item__content';
    const badgeRow = document.createElement('div');
    badgeRow.className = 'timeline-badge-row';
    badgeRow.append(
      createBadge('Source', item.source_family, 'source'),
      createBadge('Date', item.date_kind, 'date-kind'),
      createBadge('Boundary', item.boundary_kind, 'boundary')
    );

    const heading = document.createElement('h3');
    heading.textContent = item.title;
    const summary = document.createElement('p');
    summary.className = 'timeline-item__summary';
    summary.textContent = item.summary ?? 'No canonical summary recorded.';

    const subjects = createLinkList(item);
    const details = document.createElement('details');
    details.className = 'timeline-item-details';
    const detailsSummary = document.createElement('summary');
    detailsSummary.textContent = 'View date semantics and source metadata';
    details.append(detailsSummary, createMetadata(item));

    content.append(badgeRow, heading, summary, subjects, details);
    article.append(dateColumn, content);
    return article;
  }

  function buildFilters() {
    if (!projection) return;
    for (const filter of config.filters) {
      const slot = root.querySelector<HTMLElement>(`[data-timeline-filter-slot="${filter.group}"]`);
      if (!slot) continue;
      const label = document.createElement('label');
      label.className = 'timeline-filter-control';
      const labelText = document.createElement('span');
      labelText.textContent = filter.label;
      const select = document.createElement('select');
      select.dataset.timelineFilterId = filter.id;
      select.dataset.timelineQueryParam = filter.query_param;
      select.setAttribute('aria-label', filter.label);

      const allOption = document.createElement('option');
      allOption.value = '';
      allOption.textContent = `All ${filter.label.toLowerCase()}`;
      select.append(allOption);

      for (const option of projection.filters?.[filter.id] ?? []) {
        const element = document.createElement('option');
        element.value = option.value;
        element.textContent = `${humanize(option.value)} (${option.item_count})`;
        select.append(element);
      }

      if (select.options.length === 1) {
        select.disabled = true;
        allOption.textContent = `${filter.label}: no canonical values`;
      }

      label.append(labelText, select);
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

  function itemTokens(item: TimelineItem, filterId: string): string[] {
    if (filterId === 'source_family') return [item.source_family];
    if (filterId === 'date_kind') return [item.date_kind];
    if (filterId === 'boundary_kind') return [item.boundary_kind];
    if (filterId === 'asset_slug') return item.assets.map((asset) => asset.slug).filter((value): value is string => Boolean(value));
    if (filterId === 'year') return [item.year];
    if (filterId === 'jurisdiction') return item.jurisdiction_tokens;
    return [];
  }

  function matchingItems() {
    if (!projection) return [];
    const query = searchInput?.value.trim().toLocaleLowerCase() ?? '';

    return projection.items.filter((item) => {
      if (query) {
        const searchable = [
          item.title,
          item.summary ?? '',
          item.change_type,
          item.source_family,
          item.date_kind,
          ...item.assets.flatMap((asset) => [asset.name ?? '', asset.symbol ?? '', asset.slug ?? '']),
          ...item.organizations.map((organization) => organization.name ?? organization.organization_id),
          ...item.jurisdiction_tokens
        ].join(' ').toLocaleLowerCase();
        if (!searchable.includes(query)) return false;
      }

      for (const filter of config.filters) {
        const selected = selectByFilter.get(filter.id)?.value ?? '';
        if (!selected) continue;
        if (!itemTokens(item, filter.id).includes(selected)) return false;
      }
      return true;
    });
  }

  function renderActiveFilters(items: TimelineItem[]) {
    if (!activeFilters) return;
    activeFilters.replaceChildren();
    const query = searchInput?.value.trim() ?? '';
    if (query) appendText(activeFilters, `Search: ${query}`, 'timeline-active-filter');

    for (const filter of config.filters) {
      const select = selectByFilter.get(filter.id);
      if (!select?.value) continue;
      appendText(activeFilters, `${filter.label}: ${humanize(select.value)}`, 'timeline-active-filter');
    }

    const summary = document.createElement('span');
    summary.className = 'timeline-active-filter-summary';
    summary.textContent = `${items.length} of ${projection?.item_count ?? 0} items match`;
    activeFilters.append(summary);
  }

  function render() {
    if (!projection || !results || !empty || !loading) return;
    const matched = matchingItems();
    const visible = matched.slice(0, visibleLimit);
    results.replaceChildren(...visible.map(renderItem));
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
      if (copyStatus) copyStatus.textContent = 'Filtered timeline link copied.';
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

  async function loadTimeline() {
    try {
      const response = await fetch(config.source_endpoint, { headers: { accept: 'application/json' } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      projection = await response.json() as TimelineProjection;
      if (
        projection.item_count !== projection.items.length
        || projection.projection_rules?.date_semantics_preserved !== true
        || projection.projection_rules?.single_generic_timestamp !== false
        || projection.projection_rules?.review_dates_are_change_items !== false
        || projection.projection_rules?.freshness_dates_are_change_items !== false
        || projection.projection_rules?.single_composite_score !== false
        || projection.projection_rules?.risk_ranking !== false
      ) throw new Error('timeline projection contract mismatch');

      buildFilters();
      restoreStateFromUrl();
      updateUrl('replace');
      render();
    } catch (error) {
      if (loading) loading.hidden = true;
      if (alert) alert.textContent = `Timeline projection failed to load: ${error instanceof Error ? error.message : String(error)}`;
      if (resultRange) resultRange.textContent = 'projection unavailable';
    }
  }

  loadTimeline();
}
