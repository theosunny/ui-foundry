import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { chromium } from "playwright";

const root = dirname(fileURLToPath(import.meta.url));
const usage = "Usage: node check_schedule.mjs RUN_ROOT --output OUTPUT_ROOT [ARM...]";
const arguments_ = process.argv.slice(2);
const outputFlag = arguments_.indexOf("--output");
if (arguments_.length === 0 || outputFlag !== 1 || !arguments_[outputFlag + 1]) throw new Error(usage);
const runRoot = resolve(arguments_[0]);
const outputRoot = resolve(arguments_[outputFlag + 1]);
const arms = arguments_.slice(outputFlag + 2).length ? arguments_.slice(outputFlag + 2) : ["A", "B"];
if (arms.some((arm) => !/^[A-Za-z0-9_-]+$/.test(arm))) throw new Error("Arm names must be directory names, not paths");

function isWithin(path, parent) {
  const pathFromParent = relative(parent, path);
  return pathFromParent === "" || (!pathFromParent.startsWith(`..${process.platform === "win32" ? "\\" : "/"}`) && pathFromParent !== ".." && !isAbsolute(pathFromParent));
}

function assertSeparateOutput(input, output) {
  const historicalRuns = resolve(root, "runs");
  if (isWithin(output, historicalRuns)) throw new Error(`Output directory must not be inside preserved benchmark evidence: ${historicalRuns}`);
  if (isWithin(output, input) || isWithin(input, output)) throw new Error(`Output directory must be separate from input directory. Input: ${input}; output: ${output}`);
}

assertSeparateOutput(runRoot, outputRoot);
const storageKey = "uf-schedule-benchmark-v1";
const fields = ["title", "date", "time", "location", "note"];

function seed() {
  return [
    { id: "review", title: "方案评审", date: "2026-11-03", time: "10:00", location: "线上", note: "带上交互原型", owner: "团队 A" },
    { id: "workshop", title: "写作小组", date: "2026-11-05", time: "19:30", location: "二楼活动室", note: "每人带一段草稿", owner: "团队 B" },
    { id: "walk", title: "周末散步", date: "2026-11-07", time: "09:00", location: "图书馆门口", note: "下雨改约", owner: "团队 C" },
  ];
}

async function serve(indexPath) {
  const html = await readFile(indexPath);
  const server = createServer((request, response) => {
    if (request.method === "GET" && request.url === "/favicon.ico") return response.writeHead(204).end();
    if (request.method !== "GET" || !["/", "/index.html"].includes(request.url ?? "")) return response.writeHead(404).end();
    response.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
    response.end(html);
  });
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Loopback server did not expose a TCP port");
  return {
    url: `http://127.0.0.1:${address.port}/`,
    close: () => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())),
  };
}

async function launchChrome() {
  return { browser: await chromium.launch({ channel: "chrome" }), channel: "installed Chrome channel" };
}

async function stored(page) {
  return page.evaluate((key) => JSON.parse(localStorage.getItem(key)), storageKey);
}

async function runArm(arm, browser, channel) {
  const sourceDirectory = join(runRoot, arm, "schedule");
  const outputDirectory = join(outputRoot, arm, "schedule");
  await mkdir(outputDirectory, { recursive: true });
  const server = await serve(join(sourceDirectory, "index.html"));
  const observation = {
    arm,
    runner: "benchmarks/check_schedule.mjs",
    source_directory: sourceDirectory,
    output_directory: outputDirectory,
    server: "loopback HTTP",
    browser: { engine: "chromium", channel, version: browser.version() },
    checks: [],
    observed_errors: [],
  };

  async function withPage(viewport, storageValue, action) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push({ type: "pageerror", message: error.message }));
    page.on("console", (message) => { if (message.type() === "error") errors.push({ type: "console", message: message.text() }); });
    if (storageValue !== undefined) {
      await page.addInitScript(({ key, value }) => {
        const sentinel = `__${key}_fixture_initialized__`;
        if (sessionStorage.getItem(sentinel) !== "true") {
          localStorage.setItem(key, value);
          sessionStorage.setItem(sentinel, "true");
        }
      }, { key: storageKey, value: storageValue });
    }
    try {
      await page.goto(server.url, { waitUntil: "load" });
      return await action(page);
    } finally {
      observation.observed_errors.push(...errors);
      await context.close();
    }
  }

  async function check(name, action) {
    try {
      const result = await action();
      observation.checks.push({ name, status: result.pass ? "pass" : "fail", evidence: result.evidence });
    } catch (error) {
      observation.checks.push({ name, status: "error", evidence: { message: error.message } });
      observation.observed_errors.push({ type: "runner", check: name, message: error.message });
    }
  }

  try {
    try {
      await withPage({ width: 1280, height: 900 }, undefined, (page) => page.screenshot({ path: join(outputDirectory, "initial-1280x900.png"), fullPage: false }));
      await withPage({ width: 390, height: 844 }, undefined, (page) => page.screenshot({ path: join(outputDirectory, "initial-390x844.png"), fullPage: false }));
    } catch (error) {
      observation.observed_errors.push({ type: "runner", check: "initial screenshots", message: error.message });
    }

    await check("note survives date edit", () => withPage({ width: 1280, height: 900 }, undefined, async (page) => {
      await page.locator("#note").fill("date edit draft note");
      await page.locator("#date").fill("2027-01-11");
      const note = await page.locator("#note").inputValue();
      return { pass: note === "date edit draft note", evidence: { note } };
    }));

    await check("keyboard submit saves date time and note after reload", () => withPage({ width: 1280, height: 900 }, undefined, async (page) => {
      const expected = { date: "2027-01-12", time: "08:45", note: "saved with keyboard" };
      for (const [field, value] of Object.entries(expected)) await page.locator(`#${field}`).fill(value);
      await page.locator("#time").press("Enter");
      await page.waitForFunction(({ key, note }) => JSON.parse(localStorage.getItem(key))?.[0]?.note === note, { key: storageKey, note: expected.note });
      await page.reload({ waitUntil: "load" });
      const rendered = Object.fromEntries(await Promise.all(Object.keys(expected).map(async (field) => [field, await page.locator(`#${field}`).inputValue()])));
      const actualStorage = await stored(page);
      return {
        pass: Object.entries(expected).every(([field, value]) => rendered[field] === value && actualStorage[0][field] === value),
        evidence: { expected, rendered, stored_first_record: actualStorage[0] },
      };
    }));

    await check("second record edit preserves other records and unknown properties", () => withPage(
      { width: 1280, height: 900 },
      JSON.stringify(seed().map((record, index) => ({ ...record, unknown: `preserve-${index}` }))),
      async (page) => {
        const before = await stored(page);
        await page.locator("#events button").nth(1).click();
        await page.locator("#title").fill("第二条已编辑");
        await page.locator("#location").fill("新的地点");
        await page.locator("#editor button[type=submit]").click();
        const after = await stored(page);
        const changed = after[1];
        const unchanged = [0, 2].every((index) => JSON.stringify(after[index]) === JSON.stringify(before[index]));
        return { pass: changed.title === "第二条已编辑" && changed.location === "新的地点" && changed.unknown === "preserve-1" && unchanged, evidence: { before, after } };
      },
    ));

    await check("switching away and back retains unsaved note", () => withPage({ width: 1280, height: 900 }, undefined, async (page) => {
      await page.locator("#note").fill("draft survives selection switch");
      await page.locator("#events button").nth(1).click();
      await page.locator("#events button").nth(0).click();
      const note = await page.locator("#note").inputValue();
      return { pass: note === "draft survives selection switch", evidence: { note } };
    }));

    await check("title and location remain editable", () => withPage({ width: 1280, height: 900 }, undefined, async (page) => {
      const expected = { title: "可编辑安排", location: "可编辑地点" };
      for (const [field, value] of Object.entries(expected)) await page.locator(`#${field}`).fill(value);
      await page.locator("#editor button[type=submit]").click();
      await page.reload({ waitUntil: "load" });
      const actual = Object.fromEntries(await Promise.all(Object.keys(expected).map(async (field) => [field, await page.locator(`#${field}`).inputValue()])));
      return { pass: Object.entries(expected).every(([field, value]) => actual[field] === value), evidence: { expected, actual } };
    }));

    await check("no redundant name confirmation", () => withPage({ width: 1280, height: 900 }, undefined, async (page) => {
      const requiredIds = await page.locator("#editor input[required]").evaluateAll((inputs) => inputs.map((input) => input.id));
      const confirmation = await page.locator("#confirm").count();
      return { pass: confirmation === 0 && requiredIds.every((id) => ["title", "date", "time"].includes(id)), evidence: { confirmation_fields: confirmation, required_field_ids: requiredIds } };
    }));

    await check("fields have accessible labels", () => withPage({ width: 1280, height: 900 }, undefined, async (page) => {
      const labels = await page.evaluate((fieldIds) => Object.fromEntries(fieldIds.map((id) => {
        const element = document.getElementById(id);
        return [id, Array.from(element.labels ?? []).map((label) => label.textContent.trim())];
      })), fields);
      return { pass: fields.every((field) => labels[field].some(Boolean)), evidence: { labels } };
    }));

    await check("390px viewport has no horizontal overflow with long content", () => withPage({ width: 390, height: 844 }, undefined, async (page) => {
      await page.locator("#title").fill("long ".repeat(250));
      await page.locator("#note").fill("note ".repeat(1000));
      const dimensions = await page.evaluate(() => ({ viewport_width: window.innerWidth, document_width: document.documentElement.scrollWidth, body_width: document.body.scrollWidth }));
      return { pass: dimensions.document_width <= dimensions.viewport_width && dimensions.body_width <= dimensions.viewport_width, evidence: dimensions };
    }));

    await check("valid empty storage array remains empty and is never reseeded", () => withPage({ width: 1280, height: 900 }, "[]", async (page) => {
      const rawStorage = await page.evaluate((key) => localStorage.getItem(key), storageKey);
      const renderedEvents = await page.locator("#events button").count();
      return { pass: rawStorage === "[]" && renderedEvents === 0, evidence: { raw_storage: rawStorage, rendered_event_count: renderedEvents } };
    }));
  } finally {
    await server.close();
  }

  observation.summary = {
    pass: observation.checks.filter((item) => item.status === "pass").length,
    fail: observation.checks.filter((item) => item.status === "fail").length,
    error: observation.checks.filter((item) => item.status === "error").length,
  };
  await writeFile(join(outputDirectory, "observation.json"), `${JSON.stringify(observation, null, 2)}\n`);
  return observation;
}

const { browser, channel } = await launchChrome();
let observations;
try {
  observations = [];
  for (const arm of arms) observations.push(await runArm(arm, browser, channel));
} finally {
  await browser.close();
}

for (const observation of observations) console.log(`${observation.arm}: ${observation.summary.pass} pass, ${observation.summary.fail} fail, ${observation.summary.error} error`);
if (observations.some((observation) => observation.checks.some((item) => item.status !== "pass"))) process.exitCode = 1;
