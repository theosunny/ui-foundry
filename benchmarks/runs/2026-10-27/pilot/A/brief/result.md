# Food First — iPhone Product Brief

## Purpose

Food First helps one household decide what food already at home to use next. It is a focused native iPhone app for manually recording food and the date printed on its packaging when one exists.

Package dates are facts copied from a package or entered by a person. The app never predicts, calculates, verifies, or changes them. It is not a food-safety authority and must not claim food is safe or unsafe.

## Audience and primary job

The user is a household member in the kitchen deciding what to cook or eat before buying more food. In seconds, they need to see what to use next, where it is stored, and whether its package has a recorded date.

Version one supports one household on one iPhone. It has no account or sync promise.

## First-release scope

Build:

- Manual add, edit, view, and delete for food items.
- Optional package date with an explicit label: **Use by**, **Best before**, or **Other package date**.
- A “Use next” list sorted by earliest entered package date.
- An undated section for active items without a recorded package date.
- Inventory browsing by storage place and name search.
- “Mark as used” with immediate Undo.

Do not build camera recognition, OCR, barcode scanning, calendar, reminders, notifications, recipe suggestions, retailer connections, accounts, shared sync, or automatic date calculation.

## Data model

| Field | Required | Detail |
| --- | --- | --- |
| Item name | Yes | Free text, e.g. “Northwind Tofu”. |
| Category | Yes | Produce, Dairy & eggs, Meat & seafood, Prepared food, Pantry, Drinks, or Other. |
| Storage place | Yes | Fridge, Freezer, Pantry, or Other. |
| Quantity | No | Free text, e.g. “half jar” or “4”. |
| Package date | No | Exact date from packaging or the user. |
| Date meaning | When dated | Use by, Best before, or Other package date. |
| Exact package label | For Other | User-entered wording, e.g. “Display until”. |
| Note | No | E.g. “opened Sunday”. |
| Status | System | Active or Used. |

Use fictional names in seeded examples, including Juniper Soup, Cedar Grove Eggs, and Northwind Tofu.

## Navigation

Use a standard iPhone tab bar: **Use next** and **Inventory**. Both screens have a visible add button in the navigation bar.

### Use next

Default screen. Show content immediately, with no onboarding wall.

- First section: active items with package dates, ordered from earliest entered date to latest.
- Each row shows name, storage place, optional quantity, date label, and exact date: “Cedar Grove Eggs · Fridge · Best before Oct 18”.
- Second section: **No package date**, containing active undated items. Explain only that no package date was recorded.
- Tapping opens detail. Empty state reads “Nothing recorded yet” with one Add food button and “Add foods you want to keep track of.”

Avoid countdowns, warning colors, overdue labels, or safety claims.

### Inventory

Show all active items grouped by Fridge, Freezer, Pantry, and Other. Provide standard iOS search for item name and optional storage-place filter chips. Reuse Use next row anatomy so scanning stays familiar.

### Add and edit food

Use a native grouped form in a pushed screen or full-screen sheet. Put Item name first and focus it.

Fields: name, category, storage place, optional quantity, a **Package date available** toggle, date meaning, date picker, optional exact label, and note. Date controls stay hidden until the toggle is on. Default the date meaning to Best before, but allow change. Selecting Other package date reveals Exact label on package.

Enable Save only after name, category, and storage place are complete. Cancel discards a new item. Leaving an edited existing item asks whether to Keep editing or Discard changes. Preserve text while users navigate inside Add/Edit.

### Item detail

Show all recorded fields in a readable detail view. For undated food, state “No package date recorded.” Actions: Edit, Mark as used, Delete.

Mark as used immediately removes item from active lists and shows a bottom confirmation with Undo. Delete opens a destructive confirmation naming the item.

## Interaction rules

- Dates always originate from packaging or the user; never prefill, estimate, or transform them.
- Undated items remain visible and searchable. They are not late, hidden, or downgraded.
- “Use next” is household prioritization, not safety guidance.
- Use iOS date picker, swipe-back navigation, Dynamic Type, and standard destructive-action behavior.

## Visual direction

Quiet practical kitchen tool: warm off-white background, deep charcoal type, muted sage accent, restrained amber for interaction emphasis. Use SF Pro and native grouped lists with generous row spacing. Category line icons help scanning. Never rely on color alone to convey date meaning. Avoid dashboards, charts, gamification, stock imagery, and alarm-like red states.

## Accessibility

- Support Dynamic Type; critical date label and date may wrap.
- Minimum 44 × 44 pt targets; text contrast at least 4.5:1.
- VoiceOver row label combines item name, storage place, date meaning, and date when present.
- Store dates separately from localized display formatting.

## Acceptance scenarios

1. Mei adds Northwind Tofu, selects Fridge, and copies “Use by” plus the package date. Use next shows the same label and date.
2. Mei adds Juniper Soup without a date. It appears under No package date, remains searchable, and has no unsafe or late label.
3. Mei begins a note, navigates back, chooses Keep editing, and finds her text unchanged.
4. Mei marks Cedar Grove Eggs as used, sees it leave active lists, then taps Undo and sees it return.
