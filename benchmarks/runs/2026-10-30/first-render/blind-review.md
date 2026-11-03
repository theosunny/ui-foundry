# Blind static review

Scope: eight supplied renders plus task facts only. This assesses visible composition and information access, not interaction behavior.

## workshop-booking — prefer workshop-1

workshop-1 gives comparison task strongest first screen. Mobile shows all three options, each supplied illustration, date, CNY price, duration, seats, and reservation context in one compact vertical scan. Desktop preserves same order and pairs it with a clear reservation area without hiding comparison facts. Warm paper ground, dark ink type, coral accent, and geometric art make one coherent studio voice. Large serif headline has useful contrast against compact operational metadata; hierarchy from intro to choice to reservation reads cleanly.

workshop-2 has more luxurious card material on desktop: generous image crops, cleaner button labels, and dark booking panel feel considered. But headline consumes disproportionate vertical area; desktop cards spend much width on empty space. On narrow view, only two full options appear and third begins below fold, while cards are much taller. This makes three-way comparison slower than workshop-1. Its dark booking panel is not visible in supplied mobile frame, so reservation context is less immediate there.

Material defects:

- workshop-1 desktop places unlabeled circular selectors at far right of very wide cards. Static affordance is weaker than workshop-2’s explicit “Choose” labels; selection state needs strong visible treatment.
- workshop-2 uses dense price strings such as `CN¥120`, less scannable than workshop-1’s separated `¥120 CNY`; its narrow layout also spends too much height per choice.
- Both desktop renders leave the cancellation terms absent in initial view. Static screenshot cannot show whether they appear after selection, but visible pre-reservation context is incomplete at this state.

## energy-review — prefer energy-1

energy-1 is better balanced across required sizes. Desktop gives meter navigation, date/range state, total, labeled chart, and individual dated values inside one clear work surface. Chart labels agree with visible numerical strip, reinforcing factual reading. Ink-navy rail and teal bars follow required brand while restrained pale panels keep data primary. On mobile, navigation condenses into a usable horizontal top band; range control, total, chart, and values maintain one-column hierarchy without visible clipping.

energy-2 is strong desktop analysis design. It has sharper type hierarchy, explicit meter/period controls, a high-contrast total card, and a useful table that makes exact readings easy to inspect. Its main weakness is responsive composition: supplied narrow render visibly clips date control, total-card decoration, and rightmost chart content beyond viewport. The chart’s meter legend also begins at right and is cut off. These are material small-screen access defects for a required 390px layout. Desktop also allocates substantial sidebar and header space before data.

Material defects:

- energy-2 narrow render has horizontal overflow/clipped essential content, especially date range and chart.
- energy-1 narrow render shows lower data strip only partially at screenshot boundary, but no horizontal clipping is visible; vertical continuation is acceptable for this dense workspace.
- energy-1 desktop rail labels are smaller and lower contrast than primary data labels, though still legible in supplied scale.
