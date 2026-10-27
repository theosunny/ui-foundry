# iPhone Food Expiry Tracker — Design Brief

## Product outcome

Help a household member choose food already at home to use next and clear it from the active list when it is used. The primary result is a small, trustworthy list of active food with recorded label facts visible and editable. This first version is a native iPhone app; it does not send reminders, read a calendar, or recognize packaging with a camera.

## User and moment

Lina opens the app while planning dinner or putting groceries away. She wants to see which food has a date printed on its packaging, decide what to use, and correct a date without rebuilding a record. She may have items with no date label.

Use fictional example content only, such as “Harbor Oat Milk,” “Mina’s Tofu,” and “Cedar Grove Yogurt.” Do not present any example as the user’s inventory.

## Product scope

Implement one focused flow:

1. See food currently tracked at home.
2. Read any date fact that was recorded from packaging or entered by the household, when one is known.
3. Open an item, correct its name or date record, save it, and mark it used when it leaves the household stock.
4. Add a food item without having to claim whether a package has a date.

Do not add accounts, sharing, pantry locations, recipes, barcode scanning, image recognition, calendar links, notifications, expiry predictions, safety claims, history, or analytics in version one. Marking an item used only removes it from the active list; it does not create a history screen.

## Native iPhone experience

Use standard iOS navigation, large navigation titles, system sheets, Dynamic Type, VoiceOver labels, safe-area spacing, and native date controls. The app should feel like a compact household list, not a web dashboard inside a phone.

### Home: “Use next”

The home screen uses a large title, **Use next**, and a single grouped list.

- The top **Use next** section contains only items the household explicitly marked **Use next**, in the order they chose. It is a manual choice, not a claim about food safety.
- Other active foods follow in their existing list order. Each row shows the food name and a factual date line when one is recorded, for example “Best before on package · 12 Nov” or “Manufactured on package · 12 Nov.”
- An item with a manufactured/packed-on date is never moved ahead of another item because of that date. Raw dates are not used as an automatic urgency or expiry ranking.
- Items with no date record show **Date not recorded**. That means the app has no date fact yet; it does not mean the package has no date.
- A compact summary under the title reads “6 foods tracked” rather than repeating instructions.
- A prominent trailing `+` button opens Add Food.
- Tapping a row opens Food Details.

For an empty home, show “Nothing tracked yet” and one **Add food** button. Do not include a tutorial paragraph.

### Food Details

Use an iOS details form with **Food name** and an optional **Date record**. Preserve free-form name entry. Show a native date picker only when the user chooses to record a date.

The date record control starts at **Date not recorded**. It offers these choices:

- **Date on package** — requires the user to enter the calendar date they read and the label wording: **Use by/expiry**, **Best before**, **Manufactured/packed on**, or **Other label**. Display that wording beside the saved date.
- **Date entered by household** — requires a date and an optional short source note; it is visibly labelled as household-entered rather than package-derived.
- **No date on package** — an explicit user assertion after checking; it clears any date and shows “No date on package.”
- **Date not recorded** — the default unknown state; it clears any date without asserting anything about the package.

Do not infer a date, create a freshness score, call food safe or unsafe, or imply that a package date is a guarantee. Include one quiet helper sentence beneath the control: “Record the label wording and date, or leave it unrecorded.”

Navigation title uses the food name when present. A standard **Save** action commits changes and returns to the item view with the saved values shown. The detail view also offers **Use next** and **Mark used**. **Mark used** removes the item from the active Home list and immediately offers **Undo**; it is the minimal completion path, not an inventory-history feature. A back action with unsaved changes presents native choices: **Keep Editing**, **Discard Changes**, and **Save Changes**.

### Add Food

Present Add Food as a navigation push or sheet with the same fields and controls as Food Details. The name is required. Default the date record to **Date not recorded** so the app neither invents a date nor asserts that packaging lacks one. After saving, return to Home in the ordinary active-food list.

## Visual direction

Aim for a calm kitchen-notebook feel: warm off-white grouped backgrounds, a deep leafy green used only for primary actions and selection, charcoal text, and muted gray-green secondary text. Use San Francisco typography and iOS grouped-list materials. Keep rows dense enough to scan while shopping or cooking; avoid illustrated produce, cards inside cards, gradients, and decorative dashboard metrics. Dates use tabular numerals where available for steady scanning.

## States and behavior

- **Recorded date:** display the exact entered date in the device’s local date format with its recorded source and label wording. Only an explicit **Use by/expiry** label may be shown as such; a manufactured/packed-on date remains descriptive and does not drive order.
- **Date not recorded:** show “Date not recorded”; do not substitute a placeholder or infer that no package date exists.
- **No date on package:** show that exact statement only after the user selects it.
- **Use next / used:** the household may pin an active item to **Use next**; **Mark used** removes it from active Home and offers Undo.
- **Long names:** wrap in details and truncate to two lines in Home without hiding the date line.
- **Editing:** retain all unsaved fields while the form remains open; warn before leaving if values changed.
- **Validation:** block saving only when Food name is blank, or when either date-record source is selected without a date. For a package date, label wording is also required. Explain the missing field next to it and move VoiceOver focus there.
- **Persistence:** saved changes remain after relaunch. This is local app data for version one; no sync claim.

## Acceptance criteria

1. Given a food with “Manufactured on package · 12 Nov” and one with “Use by/expiry · 18 Nov,” Home displays both facts but does not rank the manufactured date as an earlier expiry or safety signal.
2. Given a newly added food, its default date state is **Date not recorded**. A user may choose either **Date on package** or **Date entered by household**, enter 15 Nov, and after saving see that exact date with its selected provenance after relaunch.
3. Given an active food, choosing **Mark used** removes it from Home and exposes Undo; Undo restores it to the active list without creating history.
4. Given unsaved edits to both food name and date record, attempting to leave Food Details offers Keep Editing, Discard Changes, and Save Changes; choosing Keep Editing preserves both entered values.

## Assumptions for implementation

- Dates may be transcribed from packaging or entered by the household; no camera recognition is available.
- Date-label choices are proposed product behavior for this first version, not an existing integration or safety classifier. The product records a fact and does not interpret it.
- Local persistence is sufficient for first release. Cloud sync and multi-person conflict handling are out of scope.
