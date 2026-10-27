#!/usr/bin/env python3
"""Build a deterministic public UI Foundry Skill archive.

This maintainer tool intentionally has no third-party dependencies and never
contacts a network service. It packages only the public files listed below.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import stat
import tempfile
import zipfile
from pathlib import Path
from typing import Iterable


REPOSITORY_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SKILL_DIRECTORY = REPOSITORY_ROOT / "skills" / "ui-foundry"
DEFAULT_OUTPUT_DIRECTORY = REPOSITORY_ROOT / "dist"
ARCHIVE_ROOT = "ui-foundry"
CANONICAL_FILES = (
    "LICENSE",
    "SKILL.md",
    "agents/openai.yaml",
    "assets/review-record.json",
    "assets/native-patterns/MeetingEditor.swift",
    "assets/place-service/README.md",
    "assets/place-service/amap-place-service.mjs",
    "assets/place-service/route-handler.mjs",
    "assets/web-foundation.css",
    "assets/web-patterns/README.md",
    "assets/web-patterns/MeetingPicker.tsx",
    "assets/web-patterns/PlacePicker.tsx",
    "assets/web-patterns/demo.tsx",
    "assets/web-patterns/http-provider.ts",
    "assets/web-patterns/index.html",
    "assets/web-patterns/index.ts",
    "assets/web-patterns/package-lock.json",
    "assets/web-patterns/package.json",
    "assets/web-patterns/styles.css",
    "assets/web-patterns/tsconfig.json",
    "assets/web-patterns/types.ts",
    "assets/web-patterns/usePlaceSearch.ts",
    "assets/web-patterns/vite.config.ts",
    "assets/workspace-reference.html",
    "references/component-patterns.md",
    "references/design-practice.md",
    "references/maintenance.md",
    "references/review.md",
    "references/tool-adapters.md",
    "references/visual-recipes.md",
    "scripts/check_design_gate.py",
)
IGNORED_SOURCE_FILES = {".clawhubignore"}
IGNORED_CACHE_DIRECTORIES = {".clawhub", "__pycache__"}
VERSION_PATTERN = re.compile(r"^[0-9]+\.[0-9]+\.[0-9]+(?:[-+][0-9A-Za-z.-]+)?$")


class PackagingError(RuntimeError):
    """Raised when the Skill source cannot be safely released."""


def sha256_bytes(content: bytes) -> str:
    return hashlib.sha256(content).hexdigest()


def _relative_paths(skill_directory: Path) -> Iterable[Path]:
    """Yield source paths while rejecting links before their contents are read."""
    for current, directories, files in os.walk(skill_directory, followlinks=False):
        current_path = Path(current)
        for directory in sorted(directories):
            path = current_path / directory
            if path.is_symlink():
                raise PackagingError(f"symlink is not allowed in Skill source: {path}")
        directories[:] = sorted(directories)
        for filename in sorted(files):
            path = current_path / filename
            if path.is_symlink():
                raise PackagingError(f"symlink is not allowed in Skill source: {path}")
            if not stat.S_ISREG(path.stat().st_mode):
                raise PackagingError(f"non-regular file is not allowed in Skill source: {path}")
            relative_path = path.relative_to(skill_directory)
            if not set(relative_path.parts).isdisjoint(IGNORED_CACHE_DIRECTORIES):
                continue
            yield relative_path


def validate_source(skill_directory: Path) -> tuple[Path, ...]:
    """Return canonical source paths or fail closed on unexpected material."""
    if not skill_directory.is_dir():
        raise PackagingError(f"Skill directory does not exist: {skill_directory}")
    if skill_directory.is_symlink():
        raise PackagingError(f"Skill directory cannot be a symlink: {skill_directory}")

    discovered = {path.as_posix() for path in _relative_paths(skill_directory)}
    unexpected = discovered - set(CANONICAL_FILES) - IGNORED_SOURCE_FILES
    missing = set(CANONICAL_FILES) - discovered
    if missing or unexpected:
        details: list[str] = []
        if missing:
            details.append(f"missing canonical files: {', '.join(sorted(missing))}")
        if unexpected:
            details.append(f"unexpected files: {', '.join(sorted(unexpected))}")
        raise PackagingError("; ".join(details))

    return tuple(Path(path) for path in CANONICAL_FILES)


def skill_version(skill_directory: Path) -> str:
    """Read the release version from SKILL.md frontmatter metadata."""
    content = (skill_directory / "SKILL.md").read_text(encoding="utf-8")
    match = re.match(r"\A---\r?\n(?P<frontmatter>.*?)\r?\n---(?:\r?\n|\Z)", content, re.DOTALL)
    if match is None:
        raise PackagingError("SKILL.md must start with YAML frontmatter")
    version_match = re.search(
        r"^metadata:\s*$.*?^\s{2,}version:\s*[\"']?([^\"'\s]+)[\"']?\s*$",
        match.group("frontmatter"),
        re.MULTILINE | re.DOTALL,
    )
    if version_match is None:
        raise PackagingError("SKILL.md metadata.version is required")
    version = version_match.group(1)
    if not VERSION_PATTERN.fullmatch(version):
        raise PackagingError(f"invalid metadata.version: {version!r}")
    return version


def build_artifacts(skill_directory: Path, output_directory: Path) -> tuple[Path, Path, Path]:
    """Build archive, SHA256 sidecar, and JSON manifest and return their paths."""
    source_directory = skill_directory.absolute()
    files = validate_source(source_directory)
    skill_directory = source_directory.resolve()
    output_directory = output_directory.resolve()
    try:
        output_directory.relative_to(skill_directory)
    except ValueError:
        pass
    else:
        raise PackagingError("output directory cannot be inside the Skill source directory")

    version = skill_version(skill_directory)
    output_directory.mkdir(parents=True, exist_ok=True)

    archive_name = f"{ARCHIVE_ROOT}-{version}.zip"
    archive_path = output_directory / archive_name
    sidecar_path = output_directory / f"{archive_name}.sha256"
    manifest_path = output_directory / f"{ARCHIVE_ROOT}-{version}.manifest.json"
    manifest_files = []

    with tempfile.TemporaryDirectory(dir=output_directory) as temporary_directory:
        temporary_archive = Path(temporary_directory) / archive_name
        with zipfile.ZipFile(
            temporary_archive,
            mode="w",
            compression=zipfile.ZIP_STORED,
            strict_timestamps=True,
        ) as archive:
            for relative_path in files:
                content = (skill_directory / relative_path).read_bytes()
                archive_path_in_zip = f"{ARCHIVE_ROOT}/{relative_path.as_posix()}"
                info = zipfile.ZipInfo(archive_path_in_zip, date_time=(1980, 1, 1, 0, 0, 0))
                info.compress_type = zipfile.ZIP_STORED
                info.external_attr = 0o100644 << 16
                info.create_system = 3
                archive.writestr(info, content)
                manifest_files.append(
                    {
                        "path": relative_path.as_posix(),
                        "sha256": sha256_bytes(content),
                        "size": len(content),
                    }
                )

        archive_digest = sha256_bytes(temporary_archive.read_bytes())
        manifest = {
            "archive": archive_name,
            "files": manifest_files,
            "sha256": archive_digest,
            "skill": ARCHIVE_ROOT,
            "version": version,
        }
        temporary_sidecar = Path(temporary_directory) / sidecar_path.name
        temporary_manifest = Path(temporary_directory) / manifest_path.name
        temporary_sidecar.write_text(f"{archive_digest}  {archive_name}\n", encoding="utf-8")
        temporary_manifest.write_text(
            json.dumps(manifest, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
            encoding="utf-8",
        )
        os.replace(temporary_archive, archive_path)
        os.replace(temporary_sidecar, sidecar_path)
        os.replace(temporary_manifest, manifest_path)

    return archive_path, sidecar_path, manifest_path


def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--skill-dir", type=Path, default=DEFAULT_SKILL_DIRECTORY)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT_DIRECTORY)
    return parser.parse_args()


def main() -> int:
    arguments = parse_arguments()
    try:
        archive_path, sidecar_path, manifest_path = build_artifacts(arguments.skill_dir, arguments.output_dir)
    except PackagingError as error:
        print(f"error: {error}")
        return 1
    print(archive_path)
    print(sidecar_path)
    print(manifest_path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
