# Blind visual review — reversed variants

Scope: static first-render review only. No interaction or storage certification.

## Workshop booking — prefer workshop-2

Workshop-2 gives mobile screen clear, compact sequence: brand, purpose, three comparable choice rows, then reservation status. It fits 390px without turning every choice into a large card. Thumbnail, title, date, price, duration, availability form quick repeatable scan; radio affordance communicates one-of-three selection. Desktop keeps this same hierarchy and uses empty right column well for reservation state.

Workshop-1 has warmer, more distinctive art direction and its desktop booking panel has stronger action context. But mobile puts long introductory copy and oversized cards before third option, making comparison slower; every card also repeats a detached “Choose” control despite card-sized content. Desktop headline consumes disproportionate height, while booking panel is visually strong but disconnected from individual selections.

Workshop-2 defects / review notes:

- Current reservation panel says only “Pick a class to see your place.” Static render cannot show selected fee, free-cancellation term, confirmation, or cancellation path required after selection. Ensure selected state turns this panel into that decision context without losing values on chosen row.
- Thin unlabelled circles look like radio controls but have weak visual weight. Clear selected fill/check and sufficiently large hit area needed.
- `beginner-friendly` and `shared making room` are unsupported business claims; task supplied only a community art studio and workshop facts.
- “Saturday Studio” is invented branding. Visually coherent, but confirm it is acceptable as local-demo brand rather than presented as supplied fact.

## Energy review — prefer energy-2

Energy-2 is cleaner and more task-shaped. Desktop puts selected meter, range, total, chart, and seven exact readings into one bounded analysis surface. Total and daily values agree, and information hierarchy stays legible without excess navigation. Mobile restructures rather than shrinking: meter choices become top horizontal controls, range is full width, total leads chart, and values remain attached to graph.

Energy-1 has competent data clarity: 89 kWh, labeled bars, tabs, and a readings table agree. However desktop allocates a wide permanent sidebar and a second, redundant “Meter records” destination for a deliberately narrow workspace. On mobile, date chip visibly overflows/crops at right and chart is wider than viewport; chart legend also crops. This weakens meaningful 390px access. Its mobile top bar gives local-demo status visibility, though.

Energy-2 defects / review notes:

- Desktop range control is visually detached in upper-right and “Studio meter” chip competes with actual Studio selection. Place range closer to its chart/period context or make hierarchy clearer.
- At 390px, bottom reading strip begins below fold and appears horizontally dense/cropped; confirm all seven numerical readings stay reachable without relying on chart labels alone.
- “Maker room” and “Build room” are unsupported room labels. Supplied facts name meters Studio and Workshop only.
- “Local demo” visible. Add no unsupported operational claim; unlike energy-1, energy-2 does not assert browser-only data behavior in static copy.
