// Verify and test the actual release archive, not a successful source-tree copy.
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = dirname(fileURLToPath(import.meta.url));
const archive = process.argv[2] && resolve(process.argv[2]);
if (!archive || !archive.endsWith(".zip") || process.argv.length !== 3)
	throw new Error("Usage: node benchmarks/check_release.mjs ARCHIVE.zip");
const manifest = archive.replace(/\.zip$/, ".manifest.json");
const outputRoot = join(root, "../output/release-browser");
await mkdir(outputRoot, { recursive: true });
const output = await mkdtemp(join(outputRoot, "attempt-"));
const installed = join(output, "installed");
const verified = spawnSync(
	process.env.PYTHON ?? "python3",
	[join(root, "../tooling/verify_archive.py"), archive, manifest, installed],
	{ encoding: "utf8" },
);
if (verified.error || verified.status !== 0) {
	throw new Error(
		`Archive verification failed: ${verified.error?.message ?? verified.stderr ?? verified.stdout}`,
	);
}
await writeFile(join(output, "archive-receipt.json"), verified.stdout);
const source = join(installed, "assets");
const fixture = join(output, "fixture");
const directory = join(fixture, "reference/schedule");
await mkdir(directory, { recursive: true });
const css = await readFile(join(source, "web-foundation.css"), "utf8");
const html = (await readFile(join(source, "workspace-reference.html"), "utf8")).replace(
	'<link rel="stylesheet" href="web-foundation.css">',
	`<style>${css}</style>`,
);
await writeFile(join(directory, "index.html"), html);
for (const [script, args] of [
	["check_collection.mjs", [join(source, "collection-reference.html"), join(output, "collection")]],
	[
		"check_foundation.mjs",
		["--css", join(source, "web-foundation.css"), "--output", join(output, "primitives")],
	],
	["check_schedule.mjs", [fixture, "--output", join(output, "schedule"), "reference"]],
]) {
	const result = spawnSync(process.execPath, [join(root, script), ...args], { stdio: "inherit" });
	if (result.status !== 0) process.exitCode = 1;
}

// Build the web kit out of the verified archive, never from the source tree.
// The checker lives in benchmarks so it can use the CI browser installation,
// while --kit makes it serve the extracted kit's dist output.
const webPatterns = join(source, "web-patterns");
for (const [command, args] of [
	["npm", ["ci", "--ignore-scripts"]],
	["npm", ["run", "typecheck"]],
	["npm", ["run", "build"]],
]) {
	const result = spawnSync(command, args, { cwd: webPatterns, stdio: "inherit" });
	if (result.error || result.status !== 0) {
		throw new Error(`Extracted web kit command failed: ${command} ${args.join(" ")}`);
	}
}
const webCheck = spawnSync(
	process.execPath,
	[
		join(root, "integrations/web-patterns/check.mjs"),
		"--kit",
		webPatterns,
		"--output",
		join(output, "web-patterns"),
	],
	{ stdio: "inherit" },
);
if (webCheck.error || webCheck.status !== 0) {
	throw new Error("Extracted web kit browser verification failed.");
}
console.log(`Archive browser evidence: ${output}`);
