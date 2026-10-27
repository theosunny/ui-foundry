import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { chromium } from "playwright";

const root = dirname(fileURLToPath(import.meta.url));
const cssPath = join(root, "../skills/ui-foundry/assets/web-foundation.css");
const outputDirectory = process.argv[2] ? resolve(process.argv[2]) : join(root, "runs/2026-10-27/foundation/primitives");
await mkdir(outputDirectory, { recursive: true });

const fixture = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/web-foundation.css"><title>Foundation primitives</title></head>
<body><div id="outside"><button id="outside-button">Outside control</button></div><div class="uf-ui"><main class="uf-page"><section class="uf-surface uf-stack"><h1 class="uf-title">Foundation primitives</h1><p id="body-text">Readable body text for contrast testing.</p><p id="muted-text" class="uf-muted">Muted helper text for contrast testing.</p><button id="primary" class="uf-button uf-button--primary">Save changes</button><label for="textfield">Text field</label><input id="textfield" type="text" value="A text value"><label for="select">Select field</label><select id="select"><option>One choice</option></select><label for="textarea">Notes</label><textarea id="textarea">A note value</textarea><label for="checkbox"><input id="checkbox" type="checkbox"> Receive updates</label><p id="error" class="uf-field-error">This field needs attention.</p></section></main></div></body></html>`;

function relativeLuminance([red, green, blue]) {
  const convert = (channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * convert(red) + 0.7152 * convert(green) + 0.0722 * convert(blue);
}

function contrastRatio(foreground, background) {
  const [light, dark] = [relativeLuminance(foreground), relativeLuminance(background)].sort((left, right) => right - left);
  return (light + 0.05) / (dark + 0.05);
}

function parseRgb(color) {
  const values = color.match(/\d+(?:\.\d+)?/g)?.slice(0, 3).map(Number);
  if (!values || values.length !== 3) throw new Error(`Expected computed RGB color, received ${color}`);
  return values;
}

async function serve() {
  const css = await readFile(cssPath);
  const server = createServer((request, response) => {
    if (request.url === "/web-foundation.css") {
      response.writeHead(200, { "content-type": "text/css; charset=utf-8", "cache-control": "no-store" }).end(css);
      return;
    }
    if (request.url === "/" || request.url === "/index.html") {
      response.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" }).end(fixture);
      return;
    }
    if (request.url === "/favicon.ico") return response.writeHead(204).end();
    response.writeHead(404).end();
  });
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Loopback server did not expose a TCP port");
  return {
    url: `http://127.0.0.1:${address.port}/`,
    close: () => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())),
  };
}

const browser = await chromium.launch({ channel: "chrome" });
const server = await serve();
const result = {
  runner: "benchmarks/check_foundation.mjs",
  source_css: "skills/ui-foundry/assets/web-foundation.css",
  server: "loopback HTTP",
  browser: { engine: "chromium", channel: "installed Chrome channel", version: browser.version() },
  checks: [],
  observed_errors: [],
};

async function pageFor({ colorScheme = "light", reducedMotion = "no-preference", viewport = { width: 1280, height: 900 } } = {}) {
  const context = await browser.newContext({ colorScheme, reducedMotion, viewport });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push({ type: "pageerror", message: error.message }));
  page.on("console", (message) => { if (message.type() === "error") errors.push({ type: "console", message: message.text() }); });
  await page.goto(server.url, { waitUntil: "load" });
  return { context, page, errors };
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

async function inPage(options, action) {
  const { context, page, errors } = await pageFor(options);
  try {
    return await action(page);
  } finally {
    result.observed_errors.push(...errors);
    await context.close();
  }
}

try {
  for (const colorScheme of ["light", "dark"]) {
    await inPage({ colorScheme }, async (page) => page.screenshot({ path: join(outputDirectory, `${colorScheme}-1280x900.png`), fullPage: false }));
  }

  await check("normal-text contrast meets WCAG AA in light and dark", async () => {
    const evidence = {};
    for (const colorScheme of ["light", "dark"]) {
      evidence[colorScheme] = await inPage({ colorScheme }, async (page) => page.evaluate(() => {
        const read = (id, backgroundId) => {
          const element = document.getElementById(id);
          return { foreground: getComputedStyle(element).color, background: getComputedStyle(document.getElementById(backgroundId)).backgroundColor };
        };
        return {
          body: read("body-text", "outside"),
          muted: read("muted-text", "outside"),
          button: read("primary", "primary"),
          error: read("error", "outside"),
          canvas: getComputedStyle(document.querySelector(".uf-ui")).backgroundColor,
        };
      }));
      for (const item of ["body", "muted", "button", "error"]) {
        const sample = evidence[colorScheme][item];
        const background = item === "button" ? sample.background : evidence[colorScheme].canvas;
        sample.ratio = Number(contrastRatio(parseRgb(sample.foreground), parseRgb(background)).toFixed(2));
      }
    }
    const pass = Object.values(evidence).every((scheme) => ["body", "muted", "button", "error"].every((item) => scheme[item].ratio >= 4.5));
    return { pass, data: evidence };
  });

  await check("keyboard focus ring is visible", () => inPage({}, async (page) => {
    await page.locator("#primary").focus();
    const outline = await page.locator("#primary").evaluate((element) => {
      const style = getComputedStyle(element);
      return { active_id: document.activeElement?.id, color: style.outlineColor, style: style.outlineStyle, width: style.outlineWidth, offset: style.outlineOffset };
    });
    return { pass: outline.active_id === "primary" && outline.style !== "none" && Number.parseFloat(outline.width) >= 2, data: outline };
  }));

  await check("foundation CSS does not style body or outside button globally", () => inPage({}, async (page) => {
    const styles = await page.evaluate(() => {
      const body = getComputedStyle(document.body);
      const button = getComputedStyle(document.getElementById("outside-button"));
      return { body_background: body.backgroundColor, body_font: body.font, button_min_block_size: button.minBlockSize, button_padding: button.padding, button_display: button.display };
    });
    return {
      pass: styles.body_background === "rgba(0, 0, 0, 0)" && styles.button_min_block_size === "0px" && styles.button_display === "inline-block",
      data: styles,
    };
  }));

  await check("narrow 390px layout has no horizontal overflow with long content", () => inPage({ viewport: { width: 390, height: 844 } }, async (page) => {
    await page.locator("#textfield").fill("long ".repeat(250));
    await page.locator("#textarea").fill("note ".repeat(1000));
    const dimensions = await page.evaluate(() => ({ viewport_width: window.innerWidth, document_width: document.documentElement.scrollWidth, body_width: document.body.scrollWidth }));
    return { pass: dimensions.document_width <= dimensions.viewport_width && dimensions.body_width <= dimensions.viewport_width, data: dimensions };
  }));

  await check("reduced motion collapses transition duration", () => inPage({ reducedMotion: "reduce" }, async (page) => {
    const durations = await page.locator("#primary").evaluate((element) => getComputedStyle(element).transitionDuration.split(", "));
    const seconds = durations.map((duration) => duration.endsWith("ms") ? Number.parseFloat(duration) / 1000 : Number.parseFloat(duration));
    return { pass: seconds.every((duration) => duration <= 0.01), data: { durations, seconds } };
  }));

  await check("text controls meet 44px size and checkbox remains compact", () => inPage({}, async (page) => {
    const dimensions = await page.evaluate(() => Object.fromEntries(["textfield", "select", "textarea", "checkbox"].map((id) => {
      const rect = document.getElementById(id).getBoundingClientRect();
      return [id, { width: rect.width, height: rect.height }];
    })));
    const controls = ["textfield", "select", "textarea"];
    const pass = controls.every((id) => dimensions[id].height >= 44) &&
      dimensions.checkbox.height < 44 && dimensions.checkbox.width < 44;
    return { pass, data: dimensions };
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
console.log(`foundation: ${result.summary.pass} pass, ${result.summary.fail} fail, ${result.summary.error} error`);
if (result.checks.some((item) => item.status !== "pass")) process.exitCode = 1;
