# Existing behavior and data

A single self-contained index.html runs in a browser. No build or dependency is needed. Use a local HTTP server if needed.

Storage key: `uf-schedule-benchmark-v1`. Value: JSON array of event records. Fields: `id`, `title`, `date` (YYYY-MM-DD), `time` (HH:MM), `location`, `note`. Unknown fields must survive edits. Do not change the key. Defaults are seeded only when the key is absent. Users may already have records in storage. Event dates are user-entered facts, not urgency or safety indicators.

All six fields (excluding immutable id) are readable; title/date/time/location/note remain editable. Save persists only the selected event. Users can switch between events. No real notification or external calendar integration exists. There is no contract requiring a post-save reset or repeated confirmation text. The confirmation field is a legacy interface requirement, not a security check. Uncommitted notes must survive changing another field; when navigating away from an edited event, preserve its draft or explicitly ask before discarding it.

Fixture data is fictional. No user profiles, private styling preferences or other product code are relevant to this task.
