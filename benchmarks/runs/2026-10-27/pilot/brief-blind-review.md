# Blind review

Visual design and runtime behavior are unverified: these are briefs only, not running apps.

## X

Strengths:

- Matches requested first-release scope: manual name/date entry, explicit undated state, add/edit, ordered household list.
- Makes date provenance and limits explicit. It neither treats a package date as an expiry fact nor offers camera recognition, predictions, safety judgments, reminders, or integrations.
- Developer-ready interaction detail: sorting rule, row content, empty state, edit/save/back behavior, validation, accessibility focus, persistence boundary, and acceptance cases are concrete.
- Native iPhone choices are specific and appropriate: large title, grouped list/form, system sheet or push, native picker, Dynamic Type, VoiceOver, safe areas, unsaved-change dialog.
- Keeps user effort low: only name plus a two-way date-source choice; date defaults to absent rather than fabricated.
- No claim of implementation, execution, visual verification, or runtime verification.

Failures / limits:

- “Use next” still orders all known package dates by calendar date, although the brief correctly says package label meanings differ. This is acceptable only as an un-interpreted attention ordering; implementation should retain the displayed package wording if available, or the neutral “Package date” label may hide useful source context.
- “Date on package” excludes a date supplied by the user when packaging is unavailable, despite request allowing dates from packaging **or user**. The brief could name this as “Recorded date” or add a user-entered-date source without changing the focused flow.

## Y

Strengths:

- Clearly forbids camera/OCR/barcode capability, date prediction, transformation, and food-safety claims.
- Gives solid native iPhone basics: grouped form, date picker, tab bar, search, Dynamic Type, VoiceOver, destructive confirmation, Undo, and explicit no-date presentation.
- Captures date meaning and an exact “Other” label, which can preserve packaging facts better than a generic expiry label.
- No claim of implementation, execution, visual verification, or runtime verification.

Failures / limits:

- Materially exceeds focused first-version request: category, storage location, quantity, notes, inventory browsing, search/filtering, delete, mark-used, undo, a second tab, and icons add a broader pantry manager. Several extra required fields raise entry effort without serving core date tracking.
- It makes Category and Storage place mandatory, so a user cannot quickly record a food and its package date without categorizing it. This conflicts with stated “in seconds” job and manual-entry focus.
- Defaulting date meaning to “Best before” risks assigning a meaning the package may not state. User must copy exact packaging facts; default should be no selection, or neutral “Other package date” with exact label required.
- Date sorting mixes “Use by,” “Best before,” and other labels into one priority list. Because those labels have different and sometimes unknown meanings, raw ordering should be described as neutral attention order, or sorting should retain/communicate its limitation. Current “Use next” framing can imply expiry judgment despite disclaimers.
- Unsaved existing-item exit offers only Keep editing and Discard changes; unlike X, it omits Save Changes. This creates an unnecessary extra step when navigating away after a legitimate edit.
- No persistence/relaunch requirement, so developer behavior for saved data is under-specified.

## Preference

Prefer **X**. It is tighter, lower-effort, and more implementation-ready for stated first version. Its two gaps are small wording/source-model corrections. Y has useful date-label fidelity and accessibility detail, but scope expands into inventory management and its default date meaning can misstate unknown package facts.
