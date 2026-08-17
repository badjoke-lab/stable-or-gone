const comparisonRoot = document.querySelector<HTMLElement>('[data-stablecoin-index]');

if (comparisonRoot) {
  const grid = comparisonRoot.querySelector<HTMLElement>('[data-comparison-grid]');
  const toggle = comparisonRoot.querySelector<HTMLInputElement>('[data-comparison-differences]');
  const feedback = comparisonRoot.querySelector<HTMLElement>('[data-comparison-feedback]');
  const sources = Array.from(comparisonRoot.querySelectorAll<HTMLElement>('[data-comparison-source]'));
  const sourceByHref = new Map(sources.map((source) => [source.dataset.recordHref ?? '', source] as const));
  const mobileFeedback = window.matchMedia('(max-width: 640px)');
  const nothingToHide = 'All displayed attributes already differ. Nothing to hide.';
  const normalize = (value: unknown) => String(value ?? '').normalize('NFKC').toLocaleLowerCase().trim().replace(/\s+/g, ' ');
  const lifecycleRows = [
    { key: 'depeg_recovery_state', label: 'Depeg recovery state' },
    { key: 'recovery_dates', label: 'Recovery date' },
    { key: 'failure_mechanisms', label: 'Failure mechanism' },
    { key: 'regulatory_history', label: 'Regulatory history' },
    { key: 'redemption_change_history', label: 'Redemption-change history' },
    { key: 'migration_termination_history', label: 'Migration / termination history' }
  ] as const;

  const sourceForHeader = (header: Element) => {
    const href = header.querySelector<HTMLAnchorElement>('.comparison-column-identity a')?.getAttribute('href') ?? '';
    return sourceByHref.get(href);
  };

  const comparisonValue = (source: HTMLElement, key: string) => source.querySelector<HTMLElement>(`[data-compare-value="${key}"]`)?.textContent?.trim() || 'Not recorded';

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

  function injectLifecycleAftermathRows() {
    if (!grid) return;
    const table = grid.querySelector<HTMLTableElement>('[data-comparison-table]');
    const body = table?.querySelector<HTMLTableSectionElement>('tbody');
    const headers = Array.from(grid.querySelectorAll<HTMLElement>('.comparison-record-header'));
    const selectedSources = headers.map(sourceForHeader).filter((source): source is HTMLElement => Boolean(source));
    if (!table || !body || selectedSources.length === 0) return;

    const prepared = lifecycleRows.map((row) => {
      const values = selectedSources.map((source) => comparisonValue(source, row.key));
      const different = new Set(values.map(normalize)).size > 1;
      return { ...row, values, different };
    }).filter((row) => !(toggle?.checked ?? false) || row.different);

    const signature = JSON.stringify({
      selected: selectedSources.map((source) => source.dataset.recordSlug ?? ''),
      values: prepared.map((row) => [row.key, row.values, row.different]),
      differencesOnly: toggle?.checked ?? false
    });
    if (table.dataset.phase3LifecycleSignature === signature) return;
    table.dataset.phase3LifecycleSignature = signature;

    body.querySelectorAll('[data-phase3-lifecycle-row], [data-phase3-lifecycle-section]').forEach((node) => node.remove());
    if (prepared.length === 0) return;

    const marker = Array.from(body.querySelectorAll<HTMLElement>('[data-comparison-section]'))
      .find((row) => row.dataset.comparisonSection === 'Historical record depth') ?? null;
    const insert = (node: Node) => marker ? body.insertBefore(node, marker) : body.append(node);

    const sectionRow = document.createElement('tr');
    sectionRow.className = 'comparison-section-row';
    sectionRow.dataset.comparisonSection = 'Recorded event lifecycle';
    sectionRow.dataset.phase3LifecycleSection = '';
    const sectionLabelCell = document.createElement('th');
    sectionLabelCell.scope = 'rowgroup';
    sectionLabelCell.className = 'comparison-attribute-column comparison-section-label';
    sectionLabelCell.textContent = 'Recorded event lifecycle';
    const sectionFillCell = document.createElement('td');
    sectionFillCell.colSpan = selectedSources.length;
    sectionFillCell.className = 'comparison-section-fill';
    sectionFillCell.setAttribute('aria-hidden', 'true');
    sectionRow.append(sectionLabelCell, sectionFillCell);
    insert(sectionRow);

    for (const row of prepared) {
      const tableRow = document.createElement('tr');
      tableRow.dataset.comparisonRow = row.key;
      tableRow.dataset.different = String(row.different);
      tableRow.dataset.phase3LifecycleRow = '';

      const labelCell = document.createElement('th');
      labelCell.scope = 'row';
      labelCell.className = 'comparison-attribute-column';
      labelCell.textContent = row.label;
      tableRow.append(labelCell);

      for (const value of row.values) {
        const valueCell = document.createElement('td');
        valueCell.textContent = value;
        valueCell.dataset.comparisonValue = value;
        const normalized = normalize(value);
        if (normalized === 'unknown') valueCell.dataset.valueState = 'unknown';
        else if (normalized === 'not recorded') valueCell.dataset.valueState = 'not-recorded';
        tableRow.append(valueCell);
      }
      insert(tableRow);
    }
  }

  function setFeedbackLines(lines: string[]) {
    if (!feedback) return;
    const visibleLines = lines.filter(Boolean);
    if (!mobileFeedback.matches || visibleLines.length < 2) {
      feedback.textContent = visibleLines.join(' ');
      return;
    }

    const fragment = document.createDocumentFragment();
    visibleLines.forEach((line, index) => {
      if (index > 0) fragment.append(document.createElement('br'));
      fragment.append(document.createTextNode(line));
    });
    feedback.replaceChildren(fragment);
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
      const values = selectedSources.map((source) => comparisonValue(source, key));
      return new Set(values.map(normalize)).size > 1;
    }).length;
    const matchingCount = keys.length - differingCount;
    const differingLabel = `${differingCount} differing attribute${differingCount === 1 ? '' : 's'}`;
    const matchingLabel = `${matchingCount} matching attribute${matchingCount === 1 ? '' : 's'}`;

    if (toggle?.checked) {
      if (matchingCount === 0) {
        setFeedbackLines([
          `${differingLabel}.`,
          nothingToHide.replace(' Nothing to hide.', ''),
          'Nothing to hide.'
        ]);
      } else {
        setFeedbackLines([`${differingLabel}.`, `${matchingLabel} hidden.`]);
      }
      return;
    }

    setFeedbackLines([`${differingLabel}.`, `${matchingLabel} shown.`]);
  }

  function synchronizeComparisonEnhancements() {
    injectAuditedMarks();
    injectLifecycleAftermathRows();
    updateDifferenceFeedback();
  }

  if (grid) {
    const observer = new MutationObserver(() => queueMicrotask(synchronizeComparisonEnhancements));
    observer.observe(grid, { childList: true, subtree: true });
  }

  toggle?.addEventListener('change', () => queueMicrotask(synchronizeComparisonEnhancements));
  comparisonRoot.addEventListener('change', () => queueMicrotask(synchronizeComparisonEnhancements));
  window.addEventListener('popstate', () => queueMicrotask(synchronizeComparisonEnhancements));
  mobileFeedback.addEventListener('change', () => queueMicrotask(synchronizeComparisonEnhancements));
  queueMicrotask(synchronizeComparisonEnhancements);
}
