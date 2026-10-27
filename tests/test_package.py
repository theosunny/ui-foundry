"""Structural and privacy guards. These do not certify a design outcome."""

import json
import re
import subprocess
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKILL = ROOT / "skills/ui-foundry"


class PackageTests(unittest.TestCase):
    def test_entrypoint_and_name(self):
        text = (SKILL / "SKILL.md").read_text(encoding="utf-8")
        self.assertTrue(text.startswith("---\nname: ui-foundry\n"))
        self.assertRegex(text, r"(?m)^license: MIT$")
        self.assertLess(len(text.splitlines()), 150)

    def test_local_markdown_links_resolve_inside_package(self):
        for path in SKILL.rglob("*.md"):
            for target in re.findall(r"\]\(([^)]+)\)", path.read_text(encoding="utf-8")):
                if target.startswith(("https://", "http://", "#")):
                    continue
                resolved = (path.parent / target.split("#")[0]).resolve()
                self.assertTrue(resolved.is_relative_to(SKILL), (path.name, target))
                self.assertTrue(resolved.is_file(), (path.name, target))

    def test_bundle_contains_only_intended_files(self):
        files = {
            path.relative_to(SKILL).as_posix()
            for path in SKILL.rglob("*")
            if path.is_file() and "__pycache__" not in path.parts
        }
        self.assertEqual(files, {
            "SKILL.md", "LICENSE", "agents/openai.yaml",
            "references/design-practice.md", "references/review.md",
            "references/maintenance.md", "assets/review-record.json",
            "references/visual-recipes.md", "references/tool-adapters.md", "references/component-patterns.md",
            "assets/web-foundation.css", "assets/workspace-reference.html",
            "scripts/check_design_gate.py", ".clawhubignore",
            "assets/native-patterns/MeetingEditor.swift",
            "assets/place-service/README.md", "assets/place-service/amap-place-service.mjs",
            "assets/place-service/route-handler.mjs",
            "assets/web-patterns/README.md", "assets/web-patterns/MeetingPicker.tsx",
            "assets/web-patterns/PlacePicker.tsx", "assets/web-patterns/demo.tsx",
            "assets/web-patterns/http-provider.ts", "assets/web-patterns/index.html",
            "assets/web-patterns/index.ts", "assets/web-patterns/package-lock.json",
            "assets/web-patterns/package.json", "assets/web-patterns/styles.css",
            "assets/web-patterns/tsconfig.json", "assets/web-patterns/types.ts", "assets/web-patterns/usePlaceSearch.ts",
            "assets/web-patterns/vite.config.ts",
        })
        for path in SKILL.rglob("*"):
            self.assertFalse(path.is_symlink(), str(path))

    def test_public_material_has_no_private_profile_or_local_home_path(self):
        for root in (SKILL, ROOT / "docs", ROOT / "evals"):
            for path in root.rglob("*"):
                if not path.is_file() or "__pycache__" in path.parts:
                    continue
                text = path.read_text(encoding="utf-8")
                self.assertNotRegex(text, r"/Users/[^/\s]+|/home/[^/\s]+")
                self.assertNotRegex(text, r"[\w.+-]+@(?:gmail|outlook|qq)\.com")
                self.assertNotIn("preferences.md", text)
                self.assertNotIn("BEGIN PRIVATE KEY", text)

    def test_template_remains_unverified(self):
        path = SKILL / "assets/review-record.json"
        record = json.loads(path.read_text(encoding="utf-8"))
        self.assertTrue(all(check["status"] == "unverified" for check in record["checks"]))
        result = subprocess.run(
            [sys.executable, str(SKILL / "scripts/check_design_gate.py"), str(path)],
            capture_output=True, text=True, check=False,
        )
        self.assertEqual(result.returncode, 3)
        self.assertFalse(json.loads(result.stdout)["quality_verified_by_script"])

    def test_license_matches_bundle(self):
        self.assertEqual((ROOT / "LICENSE").read_bytes(), (SKILL / "LICENSE").read_bytes())


if __name__ == "__main__":
    unittest.main()
