# Reading queue transfer check

## Delivery

`index.html` is self-contained: no external assets, font, dependency, account or backend. It seeds `uf-reading-benchmark-v1` only when absent, preserves stored empty arrays, filters unread records by the requested duration, opens only supplied URLs, marks a single selected record done, and restores the exact pre-change record on Undo.

Design direction: editorial reading shelf. The supplied workspace foundation informed token discipline, responsive breakpoints, visible focus, compact controls, and local-state feedback. Its scheduling layout, fields, data, and interaction model were not carried over. The interface puts time selection and ready articles in primary view; a contextual short pick gives a direct reading link without inventing article content.

## Executed checks

- `node --check` on extracted inline JavaScript: passed.
- Contract-hook and self-containment static assertions: passed (`data-budget`, rendered `data-article-id`, `data-action="read"`, `data-action="undo"`, storage key, supplied URLs, no external resource tags).
- Source-flow assertions: passed for absent-key-only seeding, unread duration filter, single-record read update, exact-record Undo restoration, and persistence save calls.
- Defect repaired before checks: recommendation now selects shortest matching unread item even after earlier items are marked read; queue display order remains saved order.

## Unverified

Desktop and 390px visual rendering plus live localStorage interaction remain unverified. Browser automation rejected `file:` navigation under its URL policy; no workaround was attempted.
