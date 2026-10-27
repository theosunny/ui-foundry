# Harness correction

`observation-harness-bug.json` preserves the initial run. Its fixture preload wrote the supplied localStorage value again on every reload, so the reported persistence failure was not valid evidence about the unchanged artifact. The corrected runner initializes fixture storage once per isolated browser context; the replacement `observation.json` is the comparable result.
