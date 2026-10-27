"""Release artifact checks for the source-only UI Foundry packager."""

import hashlib
import importlib.util
import json
import shutil
import tempfile
import unittest
import zipfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SKILL = ROOT / "skills/ui-foundry"
PACKAGER_PATH = ROOT / "tooling/package_skill.py"
SPEC = importlib.util.spec_from_file_location("package_skill", PACKAGER_PATH)
assert SPEC and SPEC.loader
PACKAGER = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(PACKAGER)


class DistributionTests(unittest.TestCase):
    def copy_skill(self, directory: Path) -> Path:
        target = directory / "ui-foundry"
        shutil.copytree(SKILL, target)
        return target

    def test_artifacts_are_reproducible_and_exact(self):
        with tempfile.TemporaryDirectory() as temporary_directory:
            temporary_path = Path(temporary_directory)
            skill = self.copy_skill(temporary_path)
            cache = skill / "__pycache__"
            cache.mkdir()
            (cache / "package_skill.cpython-313.pyc").write_bytes(b"cache")
            first_output = temporary_path / "first"
            second_output = temporary_path / "second"
            first_archive, first_sidecar, first_manifest = PACKAGER.build_artifacts(skill, first_output)
            second_archive, _, _ = PACKAGER.build_artifacts(skill, second_output)

            self.assertEqual(first_archive.read_bytes(), second_archive.read_bytes())
            with zipfile.ZipFile(first_archive) as archive:
                self.assertEqual(
                    archive.namelist(),
                    [f"ui-foundry/{path}" for path in PACKAGER.CANONICAL_FILES],
                )
                self.assertTrue(all(info.date_time == (1980, 1, 1, 0, 0, 0) for info in archive.infolist()))
                self.assertTrue(all(info.compress_type == zipfile.ZIP_STORED for info in archive.infolist()))

            digest = hashlib.sha256(first_archive.read_bytes()).hexdigest()
            self.assertEqual(first_sidecar.read_text(encoding="utf-8"), f"{digest}  {first_archive.name}\n")
            manifest = json.loads(first_manifest.read_text(encoding="utf-8"))
            self.assertEqual(manifest["sha256"], digest)
            self.assertEqual(manifest["version"], PACKAGER.skill_version(skill))
            self.assertEqual([entry["path"] for entry in manifest["files"]], list(PACKAGER.CANONICAL_FILES))
            for entry in manifest["files"]:
                self.assertEqual(
                    entry["sha256"],
                    hashlib.sha256((skill / entry["path"]).read_bytes()).hexdigest(),
                )

    def test_rejects_unexpected_file(self):
        with tempfile.TemporaryDirectory() as temporary_directory:
            temporary_path = Path(temporary_directory)
            skill = self.copy_skill(temporary_path)
            (skill / "draft-notes.md").write_text("not public", encoding="utf-8")
            with self.assertRaisesRegex(PACKAGER.PackagingError, "unexpected files: draft-notes.md"):
                PACKAGER.build_artifacts(skill, temporary_path / "dist")

    def test_rejects_symlink(self):
        with tempfile.TemporaryDirectory() as temporary_directory:
            temporary_path = Path(temporary_directory)
            skill = self.copy_skill(temporary_path)
            (skill / "references" / "linked.md").symlink_to(skill / "SKILL.md")
            with self.assertRaisesRegex(PACKAGER.PackagingError, "symlink is not allowed"):
                PACKAGER.build_artifacts(skill, temporary_path / "dist")

    def test_rejects_symlinked_skill_root(self):
        with tempfile.TemporaryDirectory() as temporary_directory:
            temporary_path = Path(temporary_directory)
            skill = self.copy_skill(temporary_path)
            linked_skill = temporary_path / "linked-ui-foundry"
            linked_skill.symlink_to(skill, target_is_directory=True)
            with self.assertRaisesRegex(PACKAGER.PackagingError, "Skill directory cannot be a symlink"):
                PACKAGER.build_artifacts(linked_skill, temporary_path / "dist")

    def test_rejects_output_inside_source(self):
        with tempfile.TemporaryDirectory() as temporary_directory:
            skill = self.copy_skill(Path(temporary_directory))
            with self.assertRaisesRegex(PACKAGER.PackagingError, "output directory cannot be inside"):
                PACKAGER.build_artifacts(skill, skill / "dist")


if __name__ == "__main__":
    unittest.main()
