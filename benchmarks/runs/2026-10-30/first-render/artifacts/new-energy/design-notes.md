# Energy review — first render notes

Direction: compact precision workspace. Ink-navy rail holds room choice; white analysis sheet keeps period control, computed total, chart and exact readings in one scan. Teal marks measured use and selection; no implied savings, benchmarks, or forecast.

Data and state: data comes only from supplied meter records. `uf:energy-probe` initializes only when absent. Meter/range updates preserve all stored top-level fields, including unknown ones, while raw meter records remain unchanged.

Checks performed:

- Source inspection: chart uses selected daily values; total reduces same currently displayed values.
- Contract inspection: meter buttons expose `data-meter`; period buttons expose `data-range`; `#total` exists; no external URLs or dependencies present.
- Responsive CSS inspected for desktop rail at 1280px and stacked room selector with horizontally available readings at 390px.

Not performed: browser rendering, interaction, refresh-persistence or visual screenshot checks.
