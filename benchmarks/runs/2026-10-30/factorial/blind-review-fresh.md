# Blind static review — fresh 390px viewport

Scope: static review of every supplied desktop image and fresh-browser-context initial 390px mobile image. This does not test interaction, semantics, storage, reloads, or persistence. Original review remains unchanged.

## Changed observations

- `repair-choice-3/mobile-initial.png`: previous apparent repeat/new header after quote cards is absent. Third quote continues normally below second. This removes the earlier page-continuity concern.
- `exhibit-notes-1/mobile-initial.png`: previous apparent repeat header after saved state is absent. Mobile page ends cleanly at saved state. This removes the earlier page-continuity concern.
- Preferences do not change: **repair-choice variant 2** and **exhibit-notes variant 3** remain strongest overall static presentations.

## Repair quote comparison (`repair-choice`)

Preferred: **variant 2**. It still best communicates quote comparison and selection: provider, rating, CNY fee, appointment, warranty, local-demo context, and selection action are distinct and consistently organized on both viewport sizes. Its side booking panel supplies next-step context without competing with comparison.

- Variant 1: Clear table-like desktop and clean styling; mobile cards are tall, delaying access to later quotes and selection detail.
- Variant 3: Now a viable, coherent alternative; editorial scale remains disproportionate on desktop and mobile shows less quote density than variant 2.
- Variant 4: Still has mobile horizontal clipping: arrival values cross card boundary. This remains a 390px blocker.

Static limits: cannot verify selected confirmation content, cancellation timing, changing selection, booking/cancellation state, local-only behavior, semantic controls, or localStorage requirements.

## Exhibit-note editor (`exhibit-notes`)

Preferred: **variant 3**. It continues to make an effective curator workspace: object navigation, selected state, title, medium, credit, note editor, actions, and local-demo message are visible with a fitting ink/white/coral system. Fresh 390px capture maintains readable object switching and editing hierarchy.

- Variant 1: Fresh mobile viewport now has clean continuity and its gallery typography is excellent. Desktop still dedicates substantial unused space below compact controls, so it remains second to variant 3 for repeated editing.
- Variant 2: Efficient and clear but visually generic; mobile action/status row remains crowded.
- Variant 4: Strong composition, but credit follows editor rather than leading exhibit details; action label remains less direct than requested cancel wording.

Static limits: cannot verify drafts across item switches, save/cancel/reload behavior, unknown-field preservation, semantic labels, or persistence.

## Images inspected

- `blind-fresh-viewport/repair-choice-1/desktop.png`
- `blind-fresh-viewport/repair-choice-1/mobile-initial.png`
- `blind-fresh-viewport/repair-choice-2/desktop.png`
- `blind-fresh-viewport/repair-choice-2/mobile-initial.png`
- `blind-fresh-viewport/repair-choice-3/desktop.png`
- `blind-fresh-viewport/repair-choice-3/mobile-initial.png`
- `blind-fresh-viewport/repair-choice-4/desktop.png`
- `blind-fresh-viewport/repair-choice-4/mobile-initial.png`
- `blind-fresh-viewport/exhibit-notes-1/desktop.png`
- `blind-fresh-viewport/exhibit-notes-1/mobile-initial.png`
- `blind-fresh-viewport/exhibit-notes-2/desktop.png`
- `blind-fresh-viewport/exhibit-notes-2/mobile-initial.png`
- `blind-fresh-viewport/exhibit-notes-3/desktop.png`
- `blind-fresh-viewport/exhibit-notes-3/mobile-initial.png`
- `blind-fresh-viewport/exhibit-notes-4/desktop.png`
- `blind-fresh-viewport/exhibit-notes-4/mobile-initial.png`
