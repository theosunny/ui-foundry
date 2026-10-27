# iPhone Food Expiry Tracker — Design Brief

## Product outcome

Help a household member choose food already at home to use next. The primary result is a small, trustworthy list of food items ordered for attention, with each item’s package date visible and editable. This first version is a native iPhone app; it does not send reminders, read a calendar, or recognize packaging with a camera.

## User and moment

Lina opens the app while planning dinner or putting groceries away. She wants to see which food has a date printed on its packaging, decide what to use, and correct a date without rebuilding a record. She may have items with no date label.

Use fictional example content only, such as “Harbor Oat Milk,” “Mina’s Tofu,” and “Cedar Grove Yogurt.” Do not present any example as the user’s inventory.

## Product scope

Implement one focused flow:

1. See food currently tracked at home.
2. Read the date that was transcribed from packaging, when one exists.
3. Open an item, edit its name or date, and save the correction.
4. Add a food item with either a package date or an explicit “No date on package” state.

Do not add accounts, sharing, pantry locations, recipes, barcode scanning, image recognition, calendar links, notifications, expiry predictions, safety claims, history, or analytics in version one.

## Native iPhone experience

Use standard iOS navigation, large navigation titles, system sheets, Dynamic Type, VoiceOver labels, safe-area spacing, and native date controls. The app should feel like a compact household list, not a web dashboard inside a phone.

### Home: “Use next”

The home screen uses a large title, **Use next**, and a single grouped list.

- Items with a known date appear first, sorted by the earliest calendar date.
- Each row shows the food name and a plain factual date line such as “Package date · 12 Nov.”
- Items without a package date appear in a final **No date recorded** section. They are not ranked as more or less urgent.
- A compact summary under the title reads “6 foods tracked” rather than repeating instructions.
- A prominent trailing `+` button opens Add Food.
- Tapping a row opens Food Details.

For an empty home, show “Nothing tracked yet” and one **Add food** button. Do not include a tutorial paragraph.

### Food Details

Use an iOS details form with two editable fields: **Food name** and **Package date**. Preserve free-form name entry. Show the date as a native date picker only after the user chooses “Date on package.”

The date source control has exactly two choices:

- **Date on package** — requires the user to enter the calendar date they read from packaging.
- **No date on package** — clears the date field and shows “No package date recorded” in the item details and list.

Do not infer a date, create a freshness score, call food safe or unsafe, or imply that a package date is a guarantee. Include one quiet helper sentence beneath the control: “Enter only a date you can read from the package.”

Navigation title uses the food name when present. A standard **Save** action commits changes and returns to the item view with the saved values shown. A back action with unsaved changes presents native choices: **Keep Editing**, **Discard Changes**, and **Save Changes**.

### Add Food

Present Add Food as a navigation push or sheet with the same fields and controls as Food Details. The name is required. Default the source to **No date on package** so the app never invents a date. After saving, return to Home and show the new item in its correct section.

## Visual direction

Aim for a calm kitchen-notebook feel: warm off-white grouped backgrounds, a deep leafy green used only for primary actions and selection, charcoal text, and muted gray-green secondary text. Use San Francisco typography and iOS grouped-list materials. Keep rows dense enough to scan while shopping or cooking; avoid illustrated produce, cards inside cards, gradients, and decorative dashboard metrics. Dates use tabular numerals where available for steady scanning.

## States and behavior

- **Known date:** display exactly the user-entered package date in the device’s local date format.
- **No date:** show “No package date recorded”; do not substitute a placeholder date.
- **Long names:** wrap in details and truncate to two lines in Home without hiding the date line.
- **Editing:** retain all unsaved fields while the form remains open; warn before leaving if values changed.
- **Validation:** block saving only when Food name is blank or when “Date on package” is selected without a date. Explain the missing field next to it and move VoiceOver focus there.
- **Persistence:** saved changes remain after relaunch. This is local app data for version one; no sync claim.

## Acceptance criteria

1. Given foods with 18 Nov, 12 Nov, and no package date, Home shows the 12 Nov item before 18 Nov and both before the no-date section; no wording labels either dated item safe or unsafe.
2. Given an item with “No date on package,” choosing “Date on package,” entering 15 Nov, and saving updates that exact date in Home after relaunch.
3. Given unsaved edits to both food name and package date, attempting to leave Food Details offers Keep Editing, Discard Changes, and Save Changes; choosing Keep Editing preserves both entered values.

## Assumptions for implementation

- Dates are entered manually from packaging by the user; no camera recognition is available.
- “Package date” is intentionally neutral because labels may use different date wording. The product records a fact and does not interpret it.
- Local persistence is sufficient for first release. Cloud sync and multi-person conflict handling are out of scope.
