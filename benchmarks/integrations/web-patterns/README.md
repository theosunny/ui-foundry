# Shipped Web kit regression

Run the entire archive gate from the repository root:

```sh
python3 tooling/package_skill.py
node benchmarks/check_release.mjs dist/ui-foundry-0.2.0.zip
```

The gate verifies the ZIP and manifest, extracts a new copy, installs its locked dependencies, typechecks and builds it, then calls this runner. Chrome and the repository's `benchmarks` test dependencies are required. Do not install dependencies in `skills/ui-foundry/assets/web-patterns/`; generated files must not enter the canonical package.

For a verified, already-built extraction, the direct command is:

```sh
node benchmarks/integrations/web-patterns/check.mjs \
  --kit output/verified-install/assets/web-patterns \
  --output output/component-replay-new
```

The output must be new and must not overlap input or committed benchmark history. The unmodified shipped demo supplies calendar, keyboard selection, persistence, cancel and mobile checks. A separate copied entrypoint, `probe.tsx`, injects a deterministic provider and failed remote save into the same extracted components. It checks an actually started slow request against a newer query, provider failure, duplicate-save prevention and synthetic IME events. No probe contacts a map vendor.

Seven check groups write `result.json` and screenshots. Any failed check or browser page error exits nonzero. Screenshots and automated events are limited evidence: they do not certify accessibility, physical keyboard/IME compatibility, live map connectivity or native runtime behavior. Preserve observed failures when tuning this regression; do not present a repaired case as fresh held-out generation evidence.
