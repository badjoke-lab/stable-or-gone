const comparisonRoot = document.querySelector<HTMLElement>('[data-stablecoin-index]');

if (comparisonRoot) {
  const grid = comparisonRoot.querySelector<HTMLElement>('[data-comparison-grid]');
  const toggle = comparisonRoot.querySelector<HTMLInputElement>('[data-comparison-differences]');
  const feedback = comparisonRoot.querySelector<HTMLElement>('[data-comparison-feedback]');
  const sources = Array.from(comparisonRoot.querySelectorAll<HTMLElement>('[data-comparison-source]'));
  const sourceByHref = new Map(sources.map((source) => [source.dataset.recordHref ?? '', source] as const));
  const normalize = (value: unknown) => String(value ?? '').normalize('NFKC').toLocaleLowerCase().trim().replace(/\s+/g, ' ');

  const sourceForHeader = (header: Element) => {
    const href = header.querySelector<HTMLAnchorElement>('.comparison-column-identity a')?.getAttribute('href') ?? '';
    return sourceByHref.get(href);
  };

  function injectAuditedMarks() {
    if (!grid) return;
    const headers = Array.from(grid.querySelectorAll<HTMLElement>('.comparison-record-header'));
    for (const header of headers) {
      const column = header.querySelector<HTMLElement>('.comparison-column-header');
      const identity = column?.querySelector<HTMLElement>(':scope > .comparison-column-identity');
      if (!column || !identity || column.querySelector('[data-comparison-header-mark]')) continue;

      const source = sourceForHeader(header);
      const sourceMark = source?.querySelector<HTMLElement>('[data-comparison-source-mark]')?.firstElementChild;
      if (!sourceMark) continue;

      const mark = sourceMark.cloneNode(true);
      if (!(mark instanceof Element)) continue;
      mark.setAttribute('data-comparison-header-mark', '');

      const identityRow = document.createElement('div');
      identityRow.className = 'stablecoin-dossier-heading-identity comparison-column-identity-row';
      identityRow.append(mark, identity);
      column.prepend(identityRow);
    }
  }

  function updateDifferenceFeedback() {
    if (!feedback || !grid) return;
    const headers = Array.from(grid.querySelectorAll<HTMLElement>('.comparison-record-header'));
    const selectedSources = headers.map(sourceForHeader).filter((source): source is HTMLElement => Boolean(source));

    if (selectedSources.length < 2) {
      feedback.textContent = 'Difference counts appear after two records are selected.';
      return;
    }

    const keys = Array.from(selectedSources[0].querySelectorAll<HTMLElement>('[data-compare-value]'))
      .map((value) => value.dataset.compareValue ?? '')
      .filter(Boolean);
    const differingCount = keys.filter((key) => {
      const values = selectedSources.map((source) => source.querySelector<HTMLElement>(`[data-compare-value="${key}"]`)?.textContent?.trim() || 'Not recorded');
      return new Set(values.map(normalize)).size > 1;
    }).length;
    const matchingCount = keys.length - differingCount;
    const differingLabel = `${differingCount} differing attribute${differingCount === 1 ? '' : 's'}`;
    const matchingLabel = `${matchingCount} matching attribute${matchingCount === 1 ? '' : 's'}`;

    if (toggle?.checked) {
      feedback.textContent = matchingCount === 0
        ? `${differingLabel}. All displayed attributes already differ. Nothing to hide.`
        : `${differingLabel}. ${matchingLabel} hidden.`;
      return;
    }

    feedback.textContent = `${differingLabel}. ${matchingLabel} shown.`;
  }

  function synchronizeComparisonEnhancements() {
    injectAuditedMarks();
    updateDifferenceFeedback();
  }

  if (grid) {
    const observer = new MutationObserver(() => queueMicrotask(synchronizeComparisonEnhancements));
    observer.observe(grid, { childList: true, subtree: true });
  }

  toggle?.addEventListener('change', () => queueMicrotask(synchronizeComparisonEnhancements));
  comparisonRoot.addEventListener('change', () => queueMicrotask(synchronizeComparisonEnhancements));
  window.addEventListener('popstate', () => queueMicrotask(synchronizeComparisonEnhancements));
  queueMicrotask(synchronizeComparisonEnhancements);
}
