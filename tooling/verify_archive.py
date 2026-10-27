#!/usr/bin/env python3
"""Verify and safely extract a UI Foundry release archive.

Usage: python tooling/verify_archive.py ARCHIVE.zip MANIFEST.json OUTPUT_DIR

The verifier trusts neither archive paths nor manifest paths. It accepts only
the public canonical file set defined by ``package_skill.py`` and writes into
an output directory that did not exist before verification.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import stat
import sys
import zipfile
from pathlib import Path
from typing import Any

from package_skill import ARCHIVE_ROOT, CANONICAL_FILES, sha256_bytes


class ArchiveVerificationError(RuntimeError):
    """Raised when a release archive cannot be trusted."""


SHA256_PATTERN = re.compile(r"^[0-9a-f]{64}$")
EXPECTED_ARCHIVE_PATHS = tuple(f"{ARCHIVE_ROOT}/{path}" for path in CANONICAL_FILES)


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def load_manifest(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        raise ArchiveVerificationError(f"cannot read manifest: {error}") from error

    if not isinstance(value, dict):
        raise ArchiveVerificationError("manifest must be a JSON object")
    required = {"archive", "files", "sha256", "skill", "version"}
    if set(value) != required:
        raise ArchiveVerificationError("manifest has an unexpected schema")
    if value["skill"] != ARCHIVE_ROOT or not isinstance(value["version"], str):
        raise ArchiveVerificationError("manifest has an unexpected skill identity")
    if not isinstance(value["archive"], str) or Path(value["archive"]).name != value["archive"]:
        raise ArchiveVerificationError("manifest archive name is unsafe")
    if not isinstance(value["sha256"], str) or not SHA256_PATTERN.fullmatch(value["sha256"]):
        raise ArchiveVerificationError("manifest archive SHA-256 is invalid")
    if not isinstance(value["files"], list) or len(value["files"]) != len(CANONICAL_FILES):
        raise ArchiveVerificationError("manifest file list is invalid")

    paths: list[str] = []
    for entry in value["files"]:
        if not isinstance(entry, dict) or set(entry) != {"path", "sha256", "size"}:
            raise ArchiveVerificationError("manifest file entry has an unexpected schema")
        file_path, digest, size = entry["path"], entry["sha256"], entry["size"]
        if not isinstance(file_path, str) or not isinstance(digest, str) or type(size) is not int:
            raise ArchiveVerificationError("manifest file entry has invalid types")
        if not SHA256_PATTERN.fullmatch(digest) or size < 0:
            raise ArchiveVerificationError("manifest file entry has invalid values")
        paths.append(file_path)

    if tuple(paths) != CANONICAL_FILES:
        raise ArchiveVerificationError("manifest paths do not match the canonical release file list")
    return value


def verify_archive(archive_path: Path, manifest_path: Path, output_directory: Path) -> dict[str, Any]:
    """Verify ``archive_path`` against manifest and safely extract it once."""
    if not archive_path.is_file():
        raise ArchiveVerificationError(f"archive does not exist: {archive_path}")
    if output_directory.exists() or output_directory.is_symlink():
        raise ArchiveVerificationError(f"output directory already exists: {output_directory}")

    manifest = load_manifest(manifest_path)
    if archive_path.name != manifest["archive"]:
        raise ArchiveVerificationError("archive filename does not match manifest")
    archive_digest = sha256_file(archive_path)
    if archive_digest != manifest["sha256"]:
        raise ArchiveVerificationError("archive SHA-256 does not match manifest")

    expected_entries = {entry["path"]: entry for entry in manifest["files"]}
    contents: dict[str, bytes] = {}
    try:
        with zipfile.ZipFile(archive_path) as archive:
            infos = archive.infolist()
            names = [info.filename for info in infos]
            if len(names) != len(set(names)):
                raise ArchiveVerificationError("archive contains duplicate paths")
            if tuple(names) != EXPECTED_ARCHIVE_PATHS:
                raise ArchiveVerificationError("archive paths do not match the canonical release file list")

            for info, expected_path in zip(infos, CANONICAL_FILES):
                if info.is_dir() or info.flag_bits & 0x1:
                    raise ArchiveVerificationError("archive contains an unsupported entry")
                file_type = stat.S_IFMT(info.external_attr >> 16)
                if file_type == stat.S_IFLNK:
                    raise ArchiveVerificationError("archive contains a symlink")
                content = archive.read(info)
                entry = expected_entries[expected_path]
                if len(content) != entry["size"] or sha256_bytes(content) != entry["sha256"]:
                    raise ArchiveVerificationError(f"archive content does not match manifest: {expected_path}")
                contents[expected_path] = content
    except zipfile.BadZipFile as error:
        raise ArchiveVerificationError(f"invalid ZIP archive: {error}") from error

    output_directory.parent.mkdir(parents=True, exist_ok=True)
    try:
        output_directory.mkdir()
        for relative_path in CANONICAL_FILES:
            destination = output_directory / relative_path
            destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_bytes(contents[relative_path])
    except OSError as error:
        raise ArchiveVerificationError(f"could not extract verified archive: {error}") from error

    return {
        "archive": archive_path.name,
        "files": len(CANONICAL_FILES),
        "output": str(output_directory),
        "sha256": archive_digest,
        "verified": True,
    }


def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("archive", type=Path)
    parser.add_argument("manifest", type=Path)
    parser.add_argument("output_directory", type=Path)
    return parser.parse_args()


def main() -> int:
    arguments = parse_arguments()
    try:
        receipt = verify_archive(arguments.archive, arguments.manifest, arguments.output_directory)
    except ArchiveVerificationError as error:
        print(f"error: {error}", file=sys.stderr)
        return 1
    print(json.dumps(receipt, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
