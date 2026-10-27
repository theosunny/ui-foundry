# Repair B report

## Corrections

- `schedule/index.html`: seed fixtures only when `uf-schedule-benchmark-v1` is absent. A stored `[]` remains an empty list, with a disabled editor and empty-state copy. Invalid stored JSON also stays unseeded rather than overwriting an existing stored value.
- `schedule/index.html`: replaced incorrect `HOUSEHOLD PLANNING` eyebrow with `TEAM SCHEDULING`.
- `schedule/index.html`: drafts now exist only when a selected record differs in an editable contract field. Switching untouched events no longer creates “unsaved changes”; changed notes still survive selection changes. Saving updates only the selected record and preserves unknown fields.
- `brief/result.md`: date state now distinguishes unknown/unrecorded, explicit “No date on package,” package-recorded, and household-entered dates. Package label wording travels with a package date; packed/manufactured dates do not determine expiry or Home order.
- `brief/result.md`: Home uses an explicit household **Use next** choice rather than raw-date urgency ranking. Added **Mark used** with Undo as the minimal active-list completion path; no history or administration feature was added.

## Checks executed

- Parsed inline schedule JavaScript with Node `new Function` after edits.
- Browser smoke test over loopback HTTP: stored `[]` remained `[]`, rendered zero event buttons, and disabled the empty editor. Switching untouched events left no draft badge/status; an edited note survived switching away and back.
- Static review: storage initialization has no `records.length===0` reseed path; untouched `saveDraft()` deletes/avoids a draft; null selection disables inputs and prevents submit.
- Static review: brief permits both packaging and household date sources, defaults to unknown, describes date semantics, and includes consume/undo completion.

## Unverified

- Unchanged browser harness, full reload persistence, keyboard submission, and rendered responsive layout were not run here. Root agent will run unchanged browser harness.
- Native iPhone behavior is a portable implementation brief only; no app was built or run.
