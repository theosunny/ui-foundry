# Reading queue contract

Use the supplied articles.json. Fields id, title, source, minutes, url, done and unknown fields survive updates. localStorage key `uf-reading-benchmark-v1`. Seed only if the key is absent; `[]` remains empty. Save the selected item only.

User can filter by available time (5, 15, 30 minutes or all). Filter is duration <= selected minutes on unread items. Opening an article is a normal link to its supplied URL; do not fetch/copy the destination. Marking read removes it from the active queue; Undo restores the same record. Saved state survives reload. Empty/filter-no-results states must not fabricate content. No forced typed input.

For reproducible browser checks, use data-budget="5|15|30|all" on budget buttons; data-article-id on each rendered article; data-action="read" on its mark-read button; data-action="undo" on Undo. Keep semantic labels as well as these test hooks. These hooks do not prescribe layout or styling.
