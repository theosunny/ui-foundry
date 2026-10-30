# Collection reference: implementation and review

Purpose: a fictional local content collection, with create, search, favorite, delete and undo. This is an authored reference, not a blind generation benchmark and not a complete product or backend.

The initial version passed five browser groups but the root reviewer found oversized repetitive cards on the 390px screenshot. Functional success did not imply visual pass. The revision uses a denser list and was rechecked; the original screenshot and result are retained. The revision is readable at the captured size and avoids repeated floating cards, but has not been independently reviewed or assessed by users. No high-end or preference claim follows from this inspection.

Six Chrome checks cover search/clear, favorite persistence/filter, dialog escape and save/reload, exact deletion undo/order, editing identity and cancellation, and 390px overflow. The first edit test failed because its non-exact “取消” locator also matched “取消收藏”; the selector was corrected and the same artifact retested. The failing test output is preserved separately. They do not establish accessibility conformance, backend persistence, real touch/IME behavior or performance.
