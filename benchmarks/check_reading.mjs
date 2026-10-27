import { createServer } from "node:http";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { chromium } from "playwright";

const root = dirname(fileURLToPath(import.meta.url));
const usage = "Usage: node check_reading.mjs INPUT_DIRECTORY --output OUTPUT_DIRECTORY";
const arguments_ = process.argv.slice(2);
const outputFlag = arguments_.indexOf("--output");
if (arguments_.length !== 3 || outputFlag !== 1 || !arguments_[0] || !arguments_[2]) throw new Error(usage);
const targetDirectory = resolve(arguments_[0]);
const outputDirectory = resolve(arguments_[2]);

function isWithin(path, parent) {
  const pathFromParent = relative(parent, path);
  return pathFromParent === "" || (!pathFromParent.startsWith(`..${process.platform === "win32" ? "\\" : "/"}`) && pathFromParent !== ".." && !isAbsolute(pathFromParent));
}

function assertSeparateOutput(input, output) {
  const historicalRuns = resolve(root, "runs");
  if (isWithin(output, historicalRuns)) throw new Error(`Output directory must not be inside preserved benchmark evidence: ${historicalRuns}`);
  if (isWithin(output, input) || isWithin(input, output)) throw new Error(`Output directory must be separate from input directory. Input: ${input}; output: ${output}`);
}

assertSeparateOutput(targetDirectory, outputDirectory);
await mkdir(outputDirectory, { recursive: true });
const storageKey = "uf-reading-benchmark-v1";
const articles = JSON.parse(await readFile(join(root, "tasks/reading/articles.json"), "utf8"));

try {
  await access(join(targetDirectory, "index.html"), constants.R_OK);
} catch {
  console.error("Reading artifact not present. Provide a directory containing index.html after implementation.");
  process.exitCode = 1;
  process.exit();
}

async function serve() {
  const html = await readFile(join(targetDirectory, "index.html"));
  const server = createServer((request, response) => {
    if (request.url === "/" || request.url === "/index.html") {
      response.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" }).end(html);
      return;
    }
    if (request.url === "/favicon.ico") return response.writeHead(204).end();
    response.writeHead(404).end();
  });
  await new Promise((resolveListen, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolveListen); });
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Loopback server did not expose a TCP port");
  return {
    url: `http://127.0.0.1:${address.port}/`,
    close: () => new Promise((resolveClose, reject) => server.close((error) => error ? reject(error) : resolveClose())),
  };
}

const server = await serve();
const browser = await chromium.launch({ channel: "chrome" });
const result = {
  runner: "benchmarks/check_reading.mjs",
  source_directory: targetDirectory,
  output_directory: outputDirectory,
  source_data: "benchmarks/tasks/reading/articles.json",
  server: "loopback HTTP",
  browser: { engine: "chromium", channel: "installed Chrome channel", version: browser.version() },
  checks: [],
  observed_errors: [],
};

async function pageFor({ viewport = { width: 1280, height: 900 }, storageValue } = {}) {
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
  await page.goto(server.url, { waitUntil: "load" });
  return { context, page, errors };
}

async function inPage(options, action) {
  const { context, page, errors } = await pageFor(options);
  try {
    return await action(page);
  } finally {
    result.observed_errors.push(...errors);
    await context.close();
  }
}

async function check(name, action) {
  try {
    const evidence = await action();
    result.checks.push({ name, status: evidence.pass ? "pass" : "fail", evidence: evidence.data });
  } catch (error) {
    result.checks.push({ name, status: "error", evidence: { message: error.message } });
    result.observed_errors.push({ type: "runner", check: name, message: error.message });
  }
}

async function renderedIds(page) {
  return page.locator("[data-article-id]").evaluateAll((nodes) => nodes.map((node) => node.dataset.articleId));
}

async function savedArticles(page) {
  return page.evaluate((key) => JSON.parse(localStorage.getItem(key)), storageKey);
}

try {
  try {
    await inPage({}, (page) => page.screenshot({ path: join(outputDirectory, "initial-1280x900.png"), fullPage: false }));
    await inPage({ viewport: { width: 390, height: 844 } }, (page) => page.screenshot({ path: join(outputDirectory, "initial-390x844.png"), fullPage: false }));
  } catch (error) {
    result.observed_errors.push({ type: "runner", check: "initial screenshots", message: error.message });
  }

  await check("required frozen data hooks are present", () => inPage({}, async (page) => {
    const budgets = await page.locator("[data-budget]").evaluateAll((nodes) => nodes.map((node) => node.dataset.budget));
    const articleHooks = await page.locator("[data-article-id]").count();
    const readHooks = await page.locator("[data-action=read]").count();
    return {
      pass: ["5", "15", "30", "all"].every((budget) => budgets.includes(budget)) && articleHooks === 4 && readHooks === 4,
      data: { budgets, article_hook_count: articleHooks, read_hook_count: readHooks },
    };
  }));

  await check("budget filters return exact unread article sets", () => inPage({}, async (page) => {
    const expected = { "5": ["small"], "15": ["small", "craft", "defaults"], all: ["small", "craft", "tools", "defaults"] };
    const actual = {};
    for (const budget of Object.keys(expected)) {
      await page.locator(`[data-budget="${budget}"]`).click();
      actual[budget] = await renderedIds(page);
    }
    const same = (left, right) => left.length === right.length && left.every((item) => right.includes(item));
    return { pass: Object.keys(expected).every((budget) => same(actual[budget], expected[budget])), data: { expected, actual } };
  }));

  await check("buttons have labels and keyboard activates a budget", () => inPage({}, async (page) => {
    const labels = await page.locator("[data-budget], [data-action=read]").evaluateAll((nodes) => nodes.map((node) => ({
      tag: node.tagName.toLowerCase(),
      label: node.getAttribute("aria-label") || node.textContent.trim(),
    })));
    const budget = page.locator('[data-budget="5"]');
    await budget.focus();
    await budget.press("Enter");
    const ids = await renderedIds(page);
    return {
      pass: labels.every((item) => item.label.length > 0) && await budget.evaluate((node) => node === document.activeElement) && ids.length === 1 && ids[0] === "small",
      data: { labels, rendered_after_enter: ids },
    };
  }));

  await check("mark read persists selected record and preserves untouched unknown fields", () => inPage(
    { storageValue: JSON.stringify(articles.map((article, index) => ({ ...article, unknown: `preserve-${index}` }))) },
    async (page) => {
      const before = await savedArticles(page);
      await page.locator('[data-article-id="small"] [data-action="read"]').click();
      const after = await savedArticles(page);
      await page.reload({ waitUntil: "load" });
      const renderedAfterReload = await renderedIds(page);
      const selected = after.find((article) => article.id === "small");
      const untouched = after.filter((article) => article.id !== "small").every((article) => JSON.stringify(article) === JSON.stringify(before.find((beforeArticle) => beforeArticle.id === article.id)));
      return {
        pass: selected?.done === true && selected.unknown === "preserve-0" && untouched && !renderedAfterReload.includes("small"),
        data: { selected, untouched, rendered_after_reload: renderedAfterReload },
      };
    },
  ));

  await check("undo restores same saved record", () => inPage(
    { storageValue: JSON.stringify(articles.map((article, index) => ({ ...article, unknown: `preserve-${index}` }))) },
    async (page) => {
      const before = await savedArticles(page);
      await page.locator('[data-article-id="small"] [data-action="read"]').click();
      await page.locator('[data-action="undo"]').click();
      const after = await savedArticles(page);
      const restored = after.find((article) => article.id === "small");
      return { pass: JSON.stringify(restored) === JSON.stringify(before[0]), data: { before: before[0], restored } };
    },
  ));

  await check("empty stored array remains empty without fabricated articles", () => inPage({ storageValue: "[]" }, async (page) => {
    const raw = await page.evaluate((key) => localStorage.getItem(key), storageKey);
    const ids = await renderedIds(page);
    return { pass: raw === "[]" && ids.length === 0, data: { raw_storage: raw, rendered_ids: ids } };
  }));

  await check("article links preserve supplied URLs", () => inPage({}, async (page) => {
    const links = await page.locator("[data-article-id] a[href]").evaluateAll((nodes) => Object.fromEntries(nodes.map((node) => [node.closest("[data-article-id]").dataset.articleId, node.href])));
    const expected = Object.fromEntries(articles.map((article) => [article.id, article.url]));
    return { pass: Object.keys(expected).every((id) => links[id] === expected[id]), data: { expected, actual: links } };
  }));

  await check("no required text entry is imposed", () => inPage({}, async (page) => {
    const requiredTextControls = await page.locator('input[type="text"][required], textarea[required]').evaluateAll((nodes) => nodes.map((node) => node.id || node.name || node.outerHTML));
    return { pass: requiredTextControls.length === 0, data: { required_text_controls: requiredTextControls } };
  }));

  await check("390px viewport has no page horizontal overflow", () => inPage({ viewport: { width: 390, height: 844 } }, async (page) => {
    const dimensions = await page.evaluate(() => ({ viewport_width: window.innerWidth, document_width: document.documentElement.scrollWidth, body_width: document.body.scrollWidth }));
    return { pass: dimensions.document_width <= dimensions.viewport_width && dimensions.body_width <= dimensions.viewport_width, data: dimensions };
  }));
} finally {
  await server.close();
  await browser.close();
}

result.summary = {
  pass: result.checks.filter((item) => item.status === "pass").length,
  fail: result.checks.filter((item) => item.status === "fail").length,
  error: result.checks.filter((item) => item.status === "error").length,
};
await writeFile(join(outputDirectory, "observation.json"), `${JSON.stringify(result, null, 2)}\n`);
console.log(`reading: ${result.summary.pass} pass, ${result.summary.fail} fail, ${result.summary.error} error`);
if (result.checks.some((item) => item.status !== "pass")) process.exitCode = 1;
