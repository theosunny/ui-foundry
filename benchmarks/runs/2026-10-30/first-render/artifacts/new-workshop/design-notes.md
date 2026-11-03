# Design notes

- Direction: warm editorial studio noticeboard. Workshop art carries comparison identity; aligned facts support fast choice. Dark reservation panel keeps price, terms and action together.
- Data: localStorage key `uf:workshop-probe`; missing storage initializes supplied state. Selection and reservation keep workshop records and unknown root fields.
- Checks performed: static inspection of required semantic selectors, confirmation/cancellation IDs, supplied SVG paths, local-only assets, selection/confirmation/cancellation state transitions, and 390px responsive CSS rules.
- Not performed: browser rendering or automated UI validation; root task owns validation.
