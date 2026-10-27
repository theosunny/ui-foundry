import { createServer } from "node:http";
import { cp, mkdir, readFile, symlink, writeFile } from "node:fs/promises";
import { dirname, extname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { chromium } from "playwright";

const exec = promisify(execFile);
const root = dirname(fileURLToPath(import.meta.url));
const getArg = (name) => {
	const index = process.argv.indexOf(name);
	return index >= 0 ? process.argv[index + 1] : undefined;
};
const kitArg = getArg("--kit");
const outputArg = getArg("--output");
if (!kitArg || !outputArg)
	throw new Error("Usage: node check.mjs --kit <extracted-kit> --output <new-output-dir>");
const kit = resolve(kitArg);
const output = resolve(outputArg);
const under = (path, parent) => path === parent || path.startsWith(parent + sep);
if (under(output, resolve(root, "../../runs")) || under(output, kit) || under(kit, output)) {
	throw new Error("Output must not overlap kit input or committed benchmark history");
}
if (kit === resolve(root, "../../../skills/ui-foundry/assets/web-patterns")) {
	throw new Error("Use an extracted release kit, not the canonical source directory");
}
try {
	await mkdir(output);
} catch (error) {
	if (error?.code === "EEXIST") throw new Error("--output must be a new directory");
	throw error;
}
const probe = join(output, "probe");
const run = (cwd, args) =>
	exec("npm", args, { cwd, env: { ...process.env, PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: "1" } });
// The release gate has already built the unmodified installed demo.
await cp(kit, probe, {
	recursive: true,
	filter: (source) => !source.split(sep).some((part) => part === "node_modules" || part === "dist"),
});
await symlink(join(kit, "node_modules"), join(probe, "node_modules"));
await cp(join(root, "probe.tsx"), join(probe, "demo.tsx"));
await run(probe, ["run", "build"]);
const probeIndex = join(probe, "dist", "index.html");
await writeFile(
	probeIndex,
	(await readFile(probeIndex, "utf8")).replaceAll('"/assets/', '"/probe/assets/'),
);

const mime = { ".css": "text/css", ".html": "text/html", ".js": "text/javascript" };
const server = createServer(async (request, response) => {
	const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
	const probeRoute = pathname === "/probe" || pathname.startsWith("/probe/");
	const relative =
		(probeRoute ? pathname.slice(7) : pathname === "/" ? "index.html" : pathname).replace(
			/^\/+/,
			"",
		) || "index.html";
	const file = join(probeRoute ? probe : kit, "dist", relative);
	try {
		const body = await readFile(file);
		response
			.writeHead(200, {
				"content-type": mime[extname(file)] ?? "application/octet-stream",
				"cache-control": "no-store",
			})
			.end(body);
	} catch {
		response.writeHead(404).end();
	}
});
await new Promise((resolvePromise, reject) => {
	server.once("error", reject);
	server.listen(0, "127.0.0.1", resolvePromise);
});
const address = server.address();
if (!address || typeof address === "string") throw new Error("Loopback server failed");
const base = `http://127.0.0.1:${address.port}`;
const browser = await chromium.launch({ channel: "chrome" });
const result = {
	runner: "check.mjs",
	kit: "verified extracted package",
	fixture: { demo: "offline fixture places only", probe: "deterministic, network-free provider" },
	browser: { version: browser.version() },
	checks: [],
	errors: [],
};

async function check(name, action) {
	try {
		const evidence = await action();
		result.checks.push({ name, status: evidence.pass ? "pass" : "fail", evidence: evidence.data });
	} catch (error) {
		result.checks.push({
			name,
			status: "error",
			evidence: { message: error instanceof Error ? error.message : String(error) },
		});
	}
}
async function open(path = "/", viewport = { width: 1280, height: 900 }, prepare) {
	const context = await browser.newContext({ viewport });
	if (prepare) await prepare(context);
	const page = await context.newPage();
	page.setDefaultTimeout(5000);
	page.on("pageerror", (error) => result.errors.push({ type: "page", message: error.message }));
	await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
	return { context, page };
}
async function tomorrow(page) {
	await page.getByRole("button", { name: "明天" }).click();
}
async function selectPlace(page) {
	const box = page.getByRole("combobox", { name: "地点" });
	await box.fill("河");
	await page.getByRole("option", { name: /河畔咖啡/ }).waitFor();
	await box.press("ArrowDown");
	await box.press("Enter");
	await page.getByTestId("selected-place").waitFor();
	await page.getByRole("listbox").waitFor({ state: "hidden" });
}

try {
	await check("demo calendar opens and selects date", async () => {
		const { context, page } = await open();
		try {
			await page.getByRole("button", { name: "打开日期选择" }).click();
			await page.getByRole("dialog").waitFor();
			await page.waitForTimeout(200);
			await page.screenshot({ path: join(output, "calendar.png") });
			const cell = page
				.locator('[role="dialog"] [data-slot="calendar-cell"]')
				.filter({ hasText: "15" })
				.last();
			await cell.click();
			const text = await page.locator('[data-slot="date-input-group"]').textContent();
			return { pass: /15/.test(text ?? ""), data: { text } };
		} finally {
			await context.close();
		}
	});
	await check("demo saves, reloads and cancels edit without replacing saved record", async () => {
		const { context, page } = await open();
		try {
			await page.getByRole("textbox", { name: "事项" }).fill("产品讨论");
			await tomorrow(page);
			await selectPlace(page);
			await page.getByTestId("save-meeting").click();
			await page.getByTestId("saved-meeting").waitFor();
			const before = await page.evaluate(() => localStorage.getItem("ui-foundry:meeting-picker"));
			await page.reload();
			await page.getByRole("button", { name: "编辑" }).click();
			await page.getByRole("textbox", { name: "事项" }).fill("错误改名");
			await page.getByRole("button", { name: "取消未保存更改" }).click();
			const after = await page.evaluate(() => localStorage.getItem("ui-foundry:meeting-picker"));
			return {
				pass:
					before === after && (await page.getByRole("heading", { name: "产品讨论" }).count()) === 1,
				data: { before, after },
			};
		} finally {
			await context.close();
		}
	});
	await check(
		"demo mobile fits 390px and reduced-motion removes opened popover animation",
		async () => {
			const { context, page } = await open("/", { width: 390, height: 844 });
			try {
				await page.emulateMedia({ reducedMotion: "reduce" });
				const box = page.getByRole("combobox", { name: "地点" });
				await box.fill("河");
				await page.getByRole("option", { name: /河畔咖啡/ }).waitFor();
				await page.screenshot({ path: join(output, "mobile.png") });
				const data = await page.evaluate(() => ({
					width: innerWidth,
					body: document.body.scrollWidth,
					document: document.documentElement.scrollWidth,
					animation: getComputedStyle(document.querySelector("[data-slot='combo-box-popover']"))
						.animationDuration,
				}));
				return {
					pass:
						data.width >= data.body &&
						data.width >= data.document &&
						Number.parseFloat(data.animation) <= 0.02,
					data,
				};
			} finally {
				await context.close();
			}
		},
	);
	await check("invalid stored record is ignored", async () => {
		const { context, page } = await open("/", undefined, (contextValue) =>
			contextValue.addInitScript(() =>
				localStorage.setItem(
					"ui-foundry:meeting-picker",
					JSON.stringify({ id: "bad", title: "bad", date: "2026-99-99", place: {} }),
				),
			),
		);
		try {
			return {
				pass: (await page.getByRole("heading", { name: "约个时间" }).count()) === 1,
				data: {},
			};
		} finally {
			await context.close();
		}
	});
	await check("empty result has manual fallback", async () => {
		const { context, page } = await open();
		try {
			const box = page.getByRole("combobox", { name: "地点" });
			await box.fill("没有");
			await page.getByText("没有匹配地点").waitFor();
			await page.getByRole("button", { name: "手动填写" }).click();
			await page.getByRole("textbox", { name: "手动地点" }).fill("楼下大厅");
			await page.getByRole("button", { name: "使用" }).click();
			const selected = await page.getByTestId("selected-place").textContent();
			return {
				pass: selected?.includes("楼下大厅") && selected.includes("手动地点"),
				data: { selected },
			};
		} finally {
			await context.close();
		}
	});
	await check("probe prevents stale result and reports provider/remote failure", async () => {
		const { context, page } = await open("/probe/");
		try {
			await page.getByRole("textbox", { name: "事项" }).fill("同步测试");
			await tomorrow(page);
			const box = page.getByRole("combobox", { name: "地点" });
			await box.fill("慢");
			await page.waitForFunction(() => window.__probeStarts?.includes("慢"));
			await box.fill("新");
			await page.getByRole("option", { name: /新结果/ }).waitFor();
			await page.waitForTimeout(780);
			const options = await page.getByRole("option").allTextContents();
			const starts = await page.evaluate(() => window.__probeStarts);
			await box.fill("失败");
			await page.getByRole("button", { name: "重试" }).waitFor();
			await page.getByRole("button", { name: "手动填写" }).click();
			await page.getByRole("textbox", { name: "手动地点" }).fill("大厅");
			await page.getByRole("button", { name: "使用" }).click();
			await page.getByRole("listbox").waitFor({ state: "hidden" });
			await page.getByTestId("save-meeting").dblclick();
			await page.getByText("保存中").waitFor();
			await page.getByText("已本地保存，远程同步失败").waitFor();
			return {
				pass:
					starts?.includes("慢") &&
					starts.includes("新") &&
					options.some((item) => item.includes("新结果")) &&
					!options.some((item) => item.includes("旧结果")) &&
					(await page.evaluate(() => window.__probeSaves)) === 1,
				data: { starts, options, saves: await page.evaluate(() => window.__probeSaves) },
			};
		} finally {
			await context.close();
		}
	});

	await check("IME composition defers searches and manual Enter does not commit", async () => {
		const { context, page } = await open("/probe/");
		try {
			const box = page.getByRole("combobox", { name: "地点" });
			await box.focus();
			await box.dispatchEvent("compositionstart");
			await box.fill("新");
			await page.waitForTimeout(300);
			const before = await page.evaluate(() => window.__probeStarts ?? []);
			await box.dispatchEvent("compositionend", { data: "新" });
			await page.getByRole("option", { name: /新结果/ }).waitFor();
			await page.getByRole("button", { name: "手动填写" }).click();
			const manual = page.getByRole("textbox", { name: "手动地点" });
			await manual.fill("大厅");
			await manual.dispatchEvent("keydown", { key: "Enter", code: "Enter", isComposing: true });
			const committedDuringComposition = await page.getByTestId("selected-place").count();
			await page.getByRole("button", { name: "使用", exact: true }).click();
			await page.getByRole("listbox").waitFor({ state: "hidden" });
			return {
				pass:
					before.length === 0 &&
					committedDuringComposition === 0 &&
					(await page.getByTestId("selected-place").textContent()).includes("大厅"),
				data: { before, committedDuringComposition },
			};
		} finally {
			await context.close();
		}
	});
} finally {
	await browser.close();
	await new Promise((resolvePromise, reject) =>
		server.close((error) => (error ? reject(error) : resolvePromise())),
	);
}
result.summary = {
	pass: result.checks.filter((item) => item.status === "pass").length,
	fail: result.checks.filter((item) => item.status !== "pass").length,
};
await writeFile(join(output, "result.json"), `${JSON.stringify(result, null, 2)}\n`);
console.log(`Web patterns: ${result.summary.pass} pass, ${result.summary.fail} fail`);
if (result.summary.fail || result.errors.length) process.exitCode = 1;
