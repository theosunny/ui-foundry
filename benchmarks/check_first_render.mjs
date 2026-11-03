import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, join, sep } from "node:path";
if (process.argv.length !== 4) throw Error("Usage: node check_first_render.mjs INPUT NEW_OUTPUT");
const input = resolve(process.argv[2]),
	output = resolve(process.argv[3]);
const under = (a, b) => a === b || a.startsWith(b + sep);
if (under(output, input) || under(input, output) || under(output, resolve("benchmarks/runs")))
	throw Error("Output overlaps source/history");
await mkdir(output, { recursive: false });
const tasks = JSON.parse(await readFile(join(input, "tasks.json"), "utf8"));
if (tasks.map((t) => t.id).join(",") !== "workshop-booking,energy-review")
	throw Error("Unsupported tasks");
const server = createServer(async (req, res) => {
	try {
		const path = resolve(input, "." + new URL(req.url, "http://localhost").pathname);
		if (!under(path, input)) throw Error("path");
		res.setHeader("Content-Type", path.endsWith(".svg") ? "image/svg+xml" : "text/html");
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
	for (const condition of ["old", "new"])
		for (const [index, task] of tasks.entries()) {
			const id = condition + (index === 0 ? "-workshop" : "-energy");
			const directory = join(output, id);
			await mkdir(directory);
			const viewport = index === 0 ? { width: 390, height: 844 } : { width: 1280, height: 900 };
			const ctx = await browser.newContext({ viewport });
			const fixture = structuredClone(task.initial);
			fixture.unseen = "preserve-unseen";
			await ctx.addInitScript(
				({ key, value }) => {
					if (!sessionStorage.getItem("__seeded")) {
						localStorage.setItem(key, JSON.stringify(value));
						sessionStorage.setItem("__seeded", "yes");
					}
				},
				{ key: task.key, value: fixture },
			);
			const page = await ctx.newPage();
			page.setDefaultTimeout(4000);
			const errors = [];
			page.on("pageerror", (e) => errors.push(e.message));
			await page.goto(`${base}/artifacts/${id}/index.html`);
			await page.screenshot({ path: join(directory, "primary.png") });
			const other = await browser.newContext({
				viewport: index === 0 ? { width: 1280, height: 900 } : { width: 390, height: 844 },
			});
			const otherPage = await other.newPage();
			await otherPage.goto(`${base}/artifacts/${id}/index.html`);
			await otherPage.screenshot({ path: join(directory, "secondary.png") });
			const checks = [];
			async function check(name, fn) {
				try {
					checks.push({ name, status: "pass", evidence: await fn() });
				} catch (e) {
					checks.push({ name, status: "fail", error: String(e) });
				}
			}
			const state = () => page.evaluate((key) => JSON.parse(localStorage.getItem(key)), task.key);
			const select = async (id) => {
				const loc = page.locator(`[data-select="${id}"]`);
				if (await loc.count()) {
					const tag = await loc.first().evaluate((e) => e.tagName);
					if (tag === "INPUT") await loc.check();
					else await loc.click();
				} else {
					const radio = page.locator(`input[value="${id}"]`);
					if (await radio.count()) await radio.check();
					else throw Error("Cannot resolve semantic selection " + id);
				}
			};
			if (index === 0) {
				await check("given comparison facts", async () => {
					const text = (await page.locator("body").innerText()).replace(/\s+/g, " ").toLowerCase();
					for (const item of fixture.workshops)
						for (const value of [
							item.title,
							item.date,
							String(item.price),
							String(item.minutes),
							String(item.seats),
						])
							if (!text.includes(value.toLowerCase())) throw Error("Missing " + value);
					return { items: 3 };
				});
				await check("selected reservation and cancellation", async () => {
					await select("cyan");
					const text = await page.locator("#confirm").evaluate((el) => el.parentElement.innerText);
					if (!text.includes("80") || !/free cancellation|cancel.*free/i.test(text))
						throw Error("Missing terms");
					await page.screenshot({ path: join(directory, "selected.png") });
					await page.locator("#confirm").click();
					let value = await state();
					if (value.reservation?.workshopId !== "cyan" || value.reservation.status !== "confirmed")
						throw Error("Wrong reservation");
					await page.locator("#cancel").click();
					await page.reload();
					value = await state();
					if (
						value.reservation !== null ||
						JSON.stringify(value.workshops) !== JSON.stringify(fixture.workshops) ||
						value.unseen !== fixture.unseen
					)
						throw Error("Cancel lost data");
					return { preserved: true };
				});
				await check("changed selection persists", async () => {
					await select("print");
					await page.locator("#confirm").click();
					await page.reload();
					const value = await state();
					if (value.reservation?.workshopId !== "print" || value.audit !== fixture.audit)
						throw Error("Changed reservation");
					return value.reservation;
				});
			} else {
				const total = async () =>
					Number((await page.locator("#total").innerText()).replace(/,/g, "").match(/[\d.]+/)[0]);
				await check("initial total", async () => {
					if ((await total()) !== 89) throw Error("Incorrect 7-day studio total");
					return { total: 89 };
				});
				await check("meter/range totals and persistence", async () => {
					await page.locator('[data-range="3"]').click();
					if ((await total()) !== 37) throw Error("Wrong short studio total");
					await page.locator('[data-meter="workshop"]').click();
					if ((await total()) !== 62) throw Error("Wrong short workshop total");
					await page.reload();
					if ((await total()) !== 62) throw Error("Selection lost");
					const value = await state();
					if (
						value.selectedId !== "workshop" ||
						Number(value.range) !== 3 ||
						value.unseen !== fixture.unseen ||
						JSON.stringify(value.meters) !== JSON.stringify(fixture.meters)
					)
						throw Error("Data lost");
					return { total: 62, preserved: true };
				});
				await check("full range restored", async () => {
					await page.locator('[data-range="7"]').click();
					if ((await total()) !== 140) throw Error("Wrong full workshop total");
					return { total: 140 };
				});
			}
			await check("mobile viewport", async () => {
				const mobile = index === 0 ? page : otherPage;
				const widths = await mobile.evaluate(() => ({
					viewport: innerWidth,
					document: document.documentElement.scrollWidth,
				}));
				if (widths.document > widths.viewport) throw Error(JSON.stringify(widths));
				return widths;
			});
			if (errors.length)
				checks.push({ name: "runtime errors", status: "fail", error: errors.join("; ") });
			const result = { id, condition, task: task.id, checks };
			results.push(result);
			await writeFile(join(directory, "result.json"), JSON.stringify(result, null, 2) + "\n");
			await ctx.close();
			await other.close();
		}
} finally {
	await browser.close();
	await new Promise((r) => server.close(r));
}
await writeFile(
	join(output, "results.json"),
	JSON.stringify(
		{ scope: "matched first-render probe, not a reliability guarantee", results },
		null,
		2,
	) + "\n",
);
console.log(
	results.map((r) => ({
		id: r.id,
		pass: r.checks.filter((c) => c.status === "pass").length,
		fail: r.checks.filter((c) => c.status === "fail").length,
	})),
);
if (results.some((r) => r.checks.some((c) => c.status === "fail"))) process.exitCode = 1;
