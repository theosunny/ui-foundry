import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { chromium } from "playwright";

const root = dirname(fileURLToPath(import.meta.url));
const output = join(root, "artifacts");
await mkdir(output, { recursive: true });

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
};

const server = createServer(async (request, response) => {
  const target = new URL(request.url ?? "/", "http://localhost").pathname;
  if (target === "/favicon.ico") return response.writeHead(204).end();
  const file = target === "/" ? "/dist/index.html" : `/dist${target}`;
  try {
    const content = await import("node:fs/promises").then(({ readFile }) => readFile(join(root, file)));
    const extension = file.slice(file.lastIndexOf("."));
    response.writeHead(200, { "cache-control": "no-store", "content-type": contentTypes[extension] ?? "application/octet-stream" }).end(content);
  } catch {
    response.writeHead(404).end();
  }
});
await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
const address = server.address();
if (!address || typeof address === "string") throw new Error("Fixture server failed to bind loopback port");
const url = `http://127.0.0.1:${address.port}/`;

const packageJson = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
const result = {
  runner: "check.mjs",
  packages: Object.fromEntries(Object.entries(packageJson.dependencies).filter(([name]) => [
    "@heroui/react", "@heroui/styles", "@tailwindcss/vite", "react", "react-dom", "tailwindcss", "vite",
  ].includes(name))),
  browser: {},
  checks: [],
  observed_errors: [],
};
const browser = await chromium.launch({ channel: "chrome" });
result.browser = { engine: "chromium", channel: "installed Chrome", version: browser.version() };

async function withPage(viewport, action) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push({ type: "pageerror", message: error.message }));
  page.on("console", (message) => { if (message.type() === "error") errors.push({ type: "console", message: message.text() }); });
  try { await page.goto(url, { waitUntil: "networkidle" }); return await action(page); }
  finally { result.observed_errors.push(...errors); await context.close(); }
}

async function check(name, action) {
  try { const evidence = await action(); result.checks.push({ name, status: evidence.pass ? "pass" : "fail", evidence: evidence.data }); }
  catch (error) { result.checks.push({ name, status: "error", evidence: { message: error.message } }); result.observed_errors.push({ type: "runner", check: name, message: error.message }); }
}

try {
  await check("dialog opens, editable labelled input saves visible selection feedback", () => withPage({ width: 1280, height: 900 }, async (page) => {
    await page.screenshot({ path: join(output, "desktop-initial.png") });
    const trigger = page.getByRole("button", { name: "Edit name" });
    await trigger.click();
    await page.getByRole("dialog", { name: "Edit display name" }).waitFor({ state: "visible" });
    await page.waitForTimeout(350);
    await page.screenshot({ path: join(output, "desktop-dialog.png") });
    const input = page.getByRole("textbox", { name: "Display name" });
    await input.fill("Noor Ali");
    await page.getByRole("button", { name: "Save name" }).click();
    const name = await page.getByTestId("saved-name").textContent();
    const feedback = await page.getByTestId("save-feedback").textContent();
    return { pass: name === "Noor Ali" && feedback?.includes("saved"), data: { name, feedback } };
  }));
  await check("Escape closes dialog and focus returns to trigger", () => withPage({ width: 1280, height: 900 }, async (page) => {
    await page.getByRole("button", { name: "Edit name" }).click();
    await page.keyboard.press("Escape");
    await page.getByRole("dialog", { name: "Edit display name" }).waitFor({ state: "hidden" });
    const state = await page.evaluate(() => ({ dialogCount: document.querySelectorAll('[role="dialog"]').length, activeText: document.activeElement?.textContent }));
    return { pass: state.dialogCount === 0 && state.activeText?.includes("Edit name"), data: state };
  }));
  await check("390px viewport has no horizontal overflow", () => withPage({ width: 390, height: 844 }, async (page) => {
    await page.getByRole("button", { name: "Edit name" }).click();
    await page.getByRole("dialog", { name: "Edit display name" }).waitFor({ state: "visible" });
    await page.waitForTimeout(350);
    await page.screenshot({ path: join(output, "mobile-dialog.png") });
    const dimensions = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
    return { pass: dimensions.document <= dimensions.viewport && dimensions.body <= dimensions.viewport, data: dimensions };
  }));
} finally {
  await browser.close();
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}

result.summary = { pass: result.checks.filter((item) => item.status === "pass").length, fail: result.checks.filter((item) => item.status === "fail").length, error: result.checks.filter((item) => item.status === "error").length };
await writeFile(join(root, "result.json"), `${JSON.stringify(result, null, 2)}\n`);
console.log(`HeroUI fixture: ${result.summary.pass} pass, ${result.summary.fail} fail, ${result.summary.error} error`);
if (result.checks.some((item) => item.status !== "pass")) process.exitCode = 1;
