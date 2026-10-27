# Reading queue repair

## Change

Compact in-app reading queue. Each rendered article title now links to its supplied URL; Mark read remains beside each row; Undo appears near queue actions. Removed landing-page headline, explanation and recommendation panel.

Storage behavior retains absent-key-only seeding, unread duration filters, one-record updates, exact-record Undo and unknown fields. Empty saved queue, all-read queue and no-duration-match states differ. Storage failures report error and do not apply a failed write in memory.

## Verification

`node benchmarks/check_reading.mjs benchmarks/runs/2026-10-27/repair/reading`: 9 pass, 0 fail, 0 error. The loopback Chrome run covered frozen hooks, all requested duration filters, keyboard budget activation, read persistence and unknown fields, Undo restoration, empty-array preservation, supplied URLs, no required text entry, and 390px horizontal overflow.
