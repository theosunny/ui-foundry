import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, join, relative, sep } from "node:path";
const input = resolve(process.argv[2] ?? "");
const output = resolve(process.argv[3] ?? "");
if (process.argv.length !== 4) throw Error("Usage: node check_factorial.mjs INPUT NEW_OUTPUT");
const under = (a, b) => a === b || a.startsWith(b + sep);
if (under(output, input) || under(input, output) || under(output, resolve("benchmarks/runs")))
	throw Error("Output overlaps input or historical evidence");
await mkdir(output, { recursive: false });
const tasks = JSON.parse(await readFile(join(input, "tasks.json"), "utf8"));
if (
	!Array.isArray(tasks) ||
	tasks.some((task) => !["repair-choice", "exhibit-notes"].includes(task.id))
) {
	throw Error("Unknown task: implement its domain checks before replaying it");
}
const server = createServer(async (req, res) => {
	try {
		const path = resolve(input, "." + new URL(req.url, "http://localhost").pathname);
		if (!under(path, input)) throw Error("path");
		res.setHeader("Content-Type", "text/html");
		res.end(await readFile(path));
	} catch {
		res.writeHead(404).end();
	}
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ channel: "chrome" });
const results = [];
try {
	for (const arm of ["A", "B", "C", "D"])
		for (const task of tasks) {
			const dir = join(output, arm, task.id);
			await mkdir(dir, { recursive: true });
			const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
			const page = await ctx.newPage();
			page.setDefaultTimeout(4000);
			const errors = [];
			page.on("pageerror", (e) => errors.push(e.message));
			const fixture = structuredClone(task.initial);
			fixture.audit = "additional-root-field";
			if (fixture.items) fixture.items[0].audit = "additional-item-field";
			await ctx.addInitScript(
				({ key, value }) => {
					if (!sessionStorage.getItem("__fixture")) {
						localStorage.setItem(key, JSON.stringify(value));
						sessionStorage.setItem("__fixture", "yes");
					}
				},
				{ key: task.storageKey, value: fixture },
			);
			await page.goto(`${base}/${arm}/${task.id}/index.html`);
			await page.screenshot({ path: join(dir, "desktop.png") });
			const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
			await mobileContext.addInitScript(
				({ key, value }) => localStorage.setItem(key, JSON.stringify(value)),
				{ key: task.storageKey, value: fixture },
			);
			const mobilePage = await mobileContext.newPage();
			await mobilePage.goto(`${base}/${arm}/${task.id}/index.html`);
			await mobilePage.screenshot({ path: join(dir, "mobile-initial.png") });
			await mobileContext.close();
			const checks = [];
			async function check(name, fn) {
				try {
					const evidence = await fn();
					checks.push({ name, status: "pass", evidence });
				} catch (e) {
					checks.push({ name, status: "fail", error: String(e) });
				}
			}
			const state = () =>
				page.evaluate((key) => JSON.parse(localStorage.getItem(key)), task.storageKey);
			const choose = async (id) => {
				const radio = page.locator(`input[value="${id}"]`);
				if (await radio.count()) await radio.check();
				else await page.locator(`[data-id="${id}"], [data-select="${id}"]`).click();
			};
			if (task.id === "repair-choice") {
				await check("quote facts visible", async () => {
					const text = await page.locator("body").innerText();
					for (const q of fixture.quotes)
						for (const value of [q.name, String(q.price), q.time, q.warranty])
							if (!text.includes(value)) throw Error("Missing fact: " + value);
					return { quotes: 3 };
				});
				await check("select q2 and confirm actual booking", async () => {
					await choose("q2");
					const text = await page.locator("body").innerText();
					if (!text.includes("220") || !/cancel|before arrival/i.test(text))
						throw Error("Missing terms");
					await page.locator("#confirm").click();
					const value = await state();
					if (value.booking?.quoteId !== "q2" || value.booking.status !== "confirmed")
						throw Error("Wrong persisted booking");
					return value.booking;
				});
				await check("cancel and reload preserve original data", async () => {
					await page.locator("#cancel").click();
					await page.reload();
					const value = await state();
					if (
						value.booking !== null ||
						value.audit !== fixture.audit ||
						JSON.stringify(value.quotes) !== JSON.stringify(fixture.quotes)
					)
						throw Error("Cancel lost data");
					return { booking: value.booking, audit: value.audit };
				});
				await check("changed selection q3 persists after reload", async () => {
					await choose("q3");
					await page.locator("#confirm").click();
					await page.reload();
					const value = await state();
					if (
						value.booking?.quoteId !== "q3" ||
						value.extra !== fixture.extra ||
						value.audit !== fixture.audit
					)
						throw Error("Changed selection lost");
					return value.booking;
				});
			} else {
				const select = (id) => page.locator(`[data-id="${id}"]`).click();
				await check("draft survives object switching", async () => {
					await page.locator("#note").fill("Draft for first exhibit");
					await select("p2");
					await select("p1");
					if ((await page.locator("#note").inputValue()) !== "Draft for first exhibit")
						throw Error("Draft lost");
					return { draftRetained: true };
				});
				await check("save/reload preserve identity and unknown fields", async () => {
					await page.locator("#save").click();
					await page.reload();
					const value = await state();
					if (
						value.items[0].note !== "Draft for first exhibit" ||
						value.items[0].audit !== fixture.items[0].audit ||
						JSON.stringify(value.items[1]) !== JSON.stringify(fixture.items[1]) ||
						value.audit !== fixture.audit
					)
						throw Error("Save lost data");
					return { note: value.items[0].note, audit: value.audit };
				});
				await check("cancel restores committed note", async () => {
					await select("p1");
					await page.locator("#note").fill("Discard me");
					await page.locator("#cancel").click();
					if ((await page.locator("#note").inputValue()) !== "Draft for first exhibit")
						throw Error("Cancel did not restore");
					return { restored: true };
				});
				await check("second object save preserves first", async () => {
					const before = await state();
					await select("p2");
					await page.locator("#note").fill("Second exhibit saved");
					await page.locator("#save").click();
					await page.reload();
					const value = await state();
					if (
						value.items[1].note !== "Second exhibit saved" ||
						JSON.stringify(value.items[0]) !== JSON.stringify(before.items[0]) ||
						value.extra !== fixture.extra
					)
						throw Error("Second save corrupted data");
					return { note: value.items[1].note };
				});
			}
			await page.setViewportSize({ width: 390, height: 844 });
			await page.screenshot({ path: join(dir, "mobile.png") });
			await check("390px page width", async () => {
				const widths = await page.evaluate(() => ({
					viewport: innerWidth,
					document: document.documentElement.scrollWidth,
				}));
				if (widths.document > widths.viewport) throw Error(JSON.stringify(widths));
				return widths;
			});
			if (errors.length)
				checks.push({ name: "runtime errors", status: "fail", error: errors.join("; ") });
			const result = {
				arm,
				task: task.id,
				checks,
				pass: checks.filter((x) => x.status === "pass").length,
				fail: checks.filter((x) => x.status === "fail").length,
			};
			results.push(result);
			await writeFile(join(dir, "result.json"), JSON.stringify(result, null, 2) + "\n");
			await ctx.close();
		}
} finally {
	await browser.close();
	await new Promise((r) => server.close(r));
}
await writeFile(
	join(output, "results.json"),
	JSON.stringify(
		{ browser: "Chrome", scope: "four-arm pilot, not a general superiority claim", results },
		null,
		2,
	) + "\n",
);
console.log(results.map(({ arm, task, pass, fail }) => ({ arm, task, pass, fail })));
if (results.some((r) => r.fail)) process.exitCode = 1;
