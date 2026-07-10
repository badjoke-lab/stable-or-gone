type UpdateFeedUiConfig = {
  initial_result_limit: number;
  result_limit_increment: number;
  filters: Array<{ id: string; label: string; query_param: string }>;
  url_contract: { search_param: string };
};

const foundRoot = document.querySelector('[data-update-feed-page]');

if (foundRoot instanceof HTMLElement) {
  const root = foundRoot;
  const configElement = document.querySelector<HTMLScriptElement>('#update-feed-config');
  const config: UpdateFeedUiConfig = configElement?.textContent
    ? JSON.parse(configElement.textContent) as UpdateFeedUiConfig
    : {
        initial_result_limit: 20,
        result_limit_increment: 20,
        filters: [],
        url_contract: { search_param: 'q' }
      };

  const searchInput = root.querySelector<HTMLInputElement>('[data-update-feed-search]');
  const clearButton = root.querySelector<HTMLButtonElement>('[data-update-feed-clear]');
  const copyButton = root.querySelector<HTMLButtonElement>('[data-update-feed-copy]');
  const copyStatus = root.querySelector<HTMLElement>('[data-update-feed-copy-status]');
  const activeFilters = root.querySelector<HTMLElement>('[data-update-feed-active-filters]');
  const alert = root.querySelector<HTMLElement>('[data-update-feed-alert]');
  const empty = root.querySelector<HTMLElement>('[data-update-feed-empty]');
  const results = root.querySelector<HTMLElement>('[data-update-feed-results]');
  const resultCount = root.querySelector<HTMLElement>('[data-update-feed-result-count]');
  const resultRange = root.querySelector<HTMLElement>('[data-update-feed-result-range]');
  const showMoreRow = root.querySelector<HTMLElement>('[data-update-feed-show-more-row]');
  const showMoreButton = root.querySelector<HTMLButtonElement>('[data-update-feed-show-more]');
  const items = Array.from(root.querySelectorAll<HTMLElement>('[data-update-feed-item]'));
  const selectByFilter = new Map<string, HTMLSelectElement>();
  let visibleLimit = config.initial_result_limit;
  let searchTimer: number | null = null;

  const humanize = (value: string) => value
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());

  for (const select of root.querySelectorAll<HTMLSelectElement>('[data-update-feed-filter-id]')) {
    const filterId = select.dataset.updateFeedFilterId;
    if (!filterId) continue;
    selectByFilter.set(filterId, select);
    select.addEventListener('change', () => {
      visibleLimit = config.initial_result_limit;
      updateUrl('push');
      render();
    });
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

  function itemMatches(item: HTMLElement) {
    const query = searchInput?.value.trim().toLocaleLowerCase() ?? '';
    if (query && !(item.dataset.searchText ?? '').includes(query)) return false;

    const category = selectByFilter.get('category')?.value ?? '';
    if (category && item.dataset.category !== category) return false;

    const year = selectByFilter.get('year')?.value ?? '';
    if (year && item.dataset.year !== year) return false;

    const routeFamily = selectByFilter.get('route_family')?.value ?? '';
    if (routeFamily) {
      const tokens = (item.dataset.routeFamilies ?? '').split(',').filter(Boolean);
      if (!tokens.includes(routeFamily)) return false;
    }

    return true;
  }

  function matchingItems() {
    return items.filter(itemMatches);
  }

  function appendActiveFilter(text: string) {
    if (!activeFilters) return;
    const chip = document.createElement('span');
    chip.className = 'update-feed-active-filter';
    chip.textContent = text;
    activeFilters.append(chip);
  }

  function renderActiveFilters(matchedCount: number) {
    if (!activeFilters) return;
    activeFilters.replaceChildren();
    const query = searchInput?.value.trim() ?? '';
    if (query) appendActiveFilter(`Search: ${query}`);

    for (const filter of config.filters) {
      const select = selectByFilter.get(filter.id);
      if (!select?.value) continue;
      appendActiveFilter(`${filter.label}: ${humanize(select.value)}`);
    }

    const summary = document.createElement('span');
    summary.className = 'update-feed-active-filter-summary';
    summary.textContent = `${matchedCount} of ${items.length} updates match`;
    activeFilters.append(summary);
  }

  function render() {
    const matched = matchingItems();
    const matchedSet = new Set(matched);
    let visibleMatched = 0;

    for (const item of items) {
      if (!matchedSet.has(item)) {
        item.hidden = true;
        continue;
      }
      const shouldShow = visibleMatched < visibleLimit;
      item.hidden = !shouldShow;
      visibleMatched += 1;
    }

    if (resultCount) resultCount.textContent = String(matched.length);
    if (resultRange) resultRange.textContent = matched.length
      ? `showing ${Math.min(matched.length, visibleLimit)} of ${matched.length}`
      : 'showing 0 results';
    if (empty) empty.hidden = matched.length !== 0;
    if (results) results.hidden = matched.length === 0;
    if (showMoreRow) showMoreRow.hidden = matched.length <= visibleLimit || matched.length === 0;
    renderActiveFilters(matched.length);
  }

  async function copyCurrentView() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      if (copyStatus) copyStatus.textContent = 'Filtered update link copied.';
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

  restoreStateFromUrl();
  updateUrl('replace');
  render();
}
