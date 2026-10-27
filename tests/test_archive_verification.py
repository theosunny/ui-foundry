"""Checks for release archive verification and safe extraction."""

import importlib.util
import json
import shutil
import stat
import sys
import tempfile
import unittest
import zipfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PACKAGER_PATH = ROOT / "tooling/package_skill.py"
VERIFIER_PATH = ROOT / "tooling/verify_archive.py"


def load_module(name: str, path: Path):
    spec = importlib.util.spec_from_file_location(name, path)
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


PACKAGER = load_module("package_skill", PACKAGER_PATH)
sys.modules["package_skill"] = PACKAGER
VERIFIER = load_module("verify_archive", VERIFIER_PATH)


class ArchiveVerificationTests(unittest.TestCase):
    def build_release(self, directory: Path):
        skill = directory / "ui-foundry"
        shutil.copytree(ROOT / "skills/ui-foundry", skill)
        return PACKAGER.build_artifacts(skill, directory / "dist")

    def rewrite_archive(self, archive: Path, destination: Path, entries):
        with zipfile.ZipFile(destination, "w", compression=zipfile.ZIP_STORED) as rewritten:
            for name, content in entries:
                rewritten.writestr(name, content)

    def manifest_for(self, original_manifest: Path, archive: Path, destination: Path) -> Path:
        manifest = json.loads(original_manifest.read_text(encoding="utf-8"))
        manifest["sha256"] = VERIFIER.sha256_file(archive)
        destination.write_text(json.dumps(manifest), encoding="utf-8")
        return destination

    def test_verifies_and_extracts_packager_artifact(self):
        with tempfile.TemporaryDirectory() as temporary_directory:
            directory = Path(temporary_directory)
            archive, _, manifest = self.build_release(directory)
            output = directory / "extracted"

            receipt = VERIFIER.verify_archive(archive, manifest, output)

            self.assertTrue(receipt["verified"])
            self.assertEqual(receipt["files"], len(PACKAGER.CANONICAL_FILES))
            self.assertEqual(
                sorted(path.relative_to(output).as_posix() for path in output.rglob("*") if path.is_file()),
                sorted(PACKAGER.CANONICAL_FILES),
            )

    def test_rejects_altered_archive_content(self):
        with tempfile.TemporaryDirectory() as temporary_directory:
            directory = Path(temporary_directory)
            archive, _, manifest = self.build_release(directory)
            altered = directory / archive.name
            with zipfile.ZipFile(archive) as source:
                entries = [(info.filename, source.read(info)) for info in source.infolist()]
            entries[0] = (entries[0][0], b"altered")
            self.rewrite_archive(archive, altered, entries)
            altered_manifest = self.manifest_for(manifest, altered, directory / "altered-manifest.json")

            with self.assertRaisesRegex(VERIFIER.ArchiveVerificationError, "content does not match"):
                VERIFIER.verify_archive(altered, altered_manifest, directory / "extracted")

    def test_rejects_missing_or_extra_paths(self):
        with tempfile.TemporaryDirectory() as temporary_directory:
            directory = Path(temporary_directory)
            archive, _, manifest = self.build_release(directory)
            with zipfile.ZipFile(archive) as source:
                entries = [(info.filename, source.read(info)) for info in source.infolist()]

            missing_directory = directory / "missing"
            missing_directory.mkdir()
            missing = missing_directory / archive.name
            self.rewrite_archive(archive, missing, entries[:-1])
            missing_manifest = self.manifest_for(manifest, missing, missing_directory / "manifest.json")
            with self.assertRaisesRegex(VERIFIER.ArchiveVerificationError, "paths do not match"):
                VERIFIER.verify_archive(missing, missing_manifest, directory / "missing-output")

            extra_directory = directory / "extra"
            extra_directory.mkdir()
            extra = extra_directory / archive.name
            self.rewrite_archive(archive, extra, entries + [("ui-foundry/extra.txt", b"no")])
            extra_manifest = self.manifest_for(manifest, extra, extra_directory / "manifest.json")
            with self.assertRaisesRegex(VERIFIER.ArchiveVerificationError, "paths do not match"):
                VERIFIER.verify_archive(extra, extra_manifest, directory / "extra-output")

    def test_rejects_duplicate_symlink_and_path_escape_entries(self):
        with tempfile.TemporaryDirectory() as temporary_directory:
            directory = Path(temporary_directory)
            archive, _, manifest = self.build_release(directory)
            with zipfile.ZipFile(archive) as source:
                entries = [(info.filename, source.read(info)) for info in source.infolist()]

            duplicate_directory = directory / "duplicate"
            duplicate_directory.mkdir()
            duplicate = duplicate_directory / archive.name
            self.rewrite_archive(archive, duplicate, entries + [entries[0]])
            duplicate_manifest = self.manifest_for(manifest, duplicate, duplicate_directory / "manifest.json")
            with self.assertRaisesRegex(VERIFIER.ArchiveVerificationError, "duplicate paths"):
                VERIFIER.verify_archive(duplicate, duplicate_manifest, directory / "duplicate-output")

            escape_directory = directory / "escape"
            escape_directory.mkdir()
            escape = escape_directory / archive.name
            self.rewrite_archive(archive, escape, entries[:-1] + [("../outside.txt", b"no")])
            escape_manifest = self.manifest_for(manifest, escape, escape_directory / "manifest.json")
            with self.assertRaisesRegex(VERIFIER.ArchiveVerificationError, "paths do not match"):
                VERIFIER.verify_archive(escape, escape_manifest, directory / "escape-output")

            symlink_directory = directory / "symlink"
            symlink_directory.mkdir()
            symlink = symlink_directory / archive.name
            with zipfile.ZipFile(symlink, "w", compression=zipfile.ZIP_STORED) as rewritten:
                for index, (name, content) in enumerate(entries):
                    info = zipfile.ZipInfo(name)
                    if index == 0:
                        info.external_attr = (stat.S_IFLNK | 0o777) << 16
                    rewritten.writestr(info, content)
            symlink_manifest = self.manifest_for(manifest, symlink, symlink_directory / "manifest.json")
            with self.assertRaisesRegex(VERIFIER.ArchiveVerificationError, "symlink"):
                VERIFIER.verify_archive(symlink, symlink_manifest, directory / "symlink-output")

    def test_never_overwrites_existing_destination(self):
        with tempfile.TemporaryDirectory() as temporary_directory:
            directory = Path(temporary_directory)
            archive, _, manifest = self.build_release(directory)
            output = directory / "extracted"
            output.mkdir()
            marker = output / "keep.txt"
            marker.write_text("keep", encoding="utf-8")

            with self.assertRaisesRegex(VERIFIER.ArchiveVerificationError, "already exists"):
                VERIFIER.verify_archive(archive, manifest, output)
            self.assertEqual(marker.read_text(encoding="utf-8"), "keep")


if __name__ == "__main__":
    unittest.main()
