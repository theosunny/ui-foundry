# Releasing UI Foundry

Repository-maintainer procedure; not required for using the skill.

1. Update `skills/ui-foundry/SKILL.md` metadata and `CHANGELOG.md`. Preserve previous release records. Root and bundled LICENSE must match.
2. Run `python3 -m unittest discover -s tests -v` and `python3 tooling/package_skill.py` from the repository root. The maintainer tool stays outside the installed skill; runtime helpers remain inside `skills/ui-foundry/scripts/`.
   Run `node --test tests/test_place_service.mjs` for the server adapter. For native changes, typecheck the Swift reference against the iOS 17+ simulator SDK and run `tests/native_date_check.swift` with that reference; record compilation and semantic checks separately from device interaction.
3. Review the manifest: exactly the intended skill files, correct version/license and no private data. Build twice and compare hashes. Run `node benchmarks/check_release.mjs dist/ui-foundry-VERSION.zip` with the actual version: it verifies the ZIP and manifest, extracts a fresh copy, and tests those installed assets, including installing and building the isolated Web kit. Dependencies and generated output must stay outside canonical Skill source. CI must pass before calling a release verified.
4. Push the reviewed source, create a matching version tag and a GitHub release. Attach the ZIP, SHA-256 and per-file manifest. Keep the `0.x` status explicit; do not overwrite an old release's artifacts with different bytes.
5. Publish the same canonical folder through the official ClawHub CLI. Registry acceptance or `pending-publication` is not availability.
6. Download the GitHub assets again. Verify the archive hash and each file against the manifest. Install the exact new ClawHub version anonymously in an isolated temporary workspace; compare all canonical files, excluding registry-generated metadata. Never overwrite a user's customized install as a smoke test.
7. Record source commit, artifact hashes, version, actual CI and download results. If a registry is pending or blocked, say so; don't mark that distribution complete.

## License transition

Version 0.1.2 and later use the standard [MIT License](https://spdx.org/licenses/MIT.html), with the copyright and permission notice retained. The already-published 0.1.0 and 0.1.1 artifacts retain their MIT-0 notices. No old artifact is rewritten to claim a retroactive license change.
