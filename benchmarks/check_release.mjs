// Test the current distributed reference, not an old successful benchmark copy.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = dirname(fileURLToPath(import.meta.url));
const output = join(root, "../output/release-browser");
const source = join(root, "../skills/ui-foundry/assets");
const directory = join(output, "reference/schedule");
await mkdir(directory, { recursive: true });
const css = await readFile(join(source, "web-foundation.css"), "utf8");
const html = (await readFile(join(source, "workspace-reference.html"), "utf8"))
  .replace('<link rel="stylesheet" href="web-foundation.css">', `<style>${css}</style>`);
await writeFile(join(directory, "index.html"), html);
for (const [script, args] of [
  ["check_foundation.mjs", [join(output, "primitives")]],
  ["check_schedule.mjs", [output, "reference"]],
]) {
  const result = spawnSync(process.execPath, [join(root, script), ...args], { stdio: "inherit" });
  if (result.status !== 0) process.exitCode = 1;
}
