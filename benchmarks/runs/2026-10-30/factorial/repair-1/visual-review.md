# Repair static visual review

Scope: static comparison only. Reviewed repaired D screenshots against exposed originals for `repair-choice-1` and `exhibit-notes-1`, at desktop and fresh 390px initial mobile viewport. No interaction, semantic, storage, reload, or persistence claim follows from this review.

## Repair quote comparison

Result: no material visible regression or improvement from original.

Desktop and mobile preserve same effective hierarchy: quote name/rating, fee, appointment, warranty, direct Choose action, and local-demo/no-vendor-request disclosure. The mobile layout keeps the first two choices complete and begins third below fold; expected vertical continuation rather than clipping.

Remaining static limitation: selection details, CNY confirmation fee, cancellation terms, and confirmed/cancelled state are not visible in an initial unselected screenshot. This is a coverage limit, not evidence they are absent.

## Exhibit-note editor

Result: mixed but non-blocking static change.

Improvement: repair removes "Private workspace" from desktop and omits it on mobile. That better fits a local demo with no accounts. Mobile also has a more compact entry, while object switcher, active state, title, medium, credit, note field, save/cancel controls, and saved status remain visible.

Regression: desktop loses large "Exhibit notes" page title and its associated visual hierarchy; the small all-caps top label now carries page identity. The editing view remains clear, but brand presence and desktop orientation are weaker than original. The ink/white/coral visual system otherwise remains coherent.

No material static blocker visible at 390px: controls fit, object switching is reachable, and content does not clip. Screenshots cannot establish draft survival, save/cancel effects, reload verification, or preservation behavior.

## Images inspected

- `factorial-repair-check/D/repair-choice/desktop.png`
- `factorial-repair-check/D/repair-choice/mobile-initial.png`
- `factorial-20261030/blind-fresh-viewport/repair-choice-1/desktop.png`
- `factorial-20261030/blind-fresh-viewport/repair-choice-1/mobile-initial.png`
- `factorial-repair-check/D/exhibit-notes/desktop.png`
- `factorial-repair-check/D/exhibit-notes/mobile-initial.png`
- `factorial-20261030/blind-fresh-viewport/exhibit-notes-1/desktop.png`
- `factorial-20261030/blind-fresh-viewport/exhibit-notes-1/mobile-initial.png`
