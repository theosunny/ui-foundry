import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, relative, resolve, isAbsolute, sep } from "node:path";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const input = process.argv[2];
const out = process.argv[3];
if (!input || !out) throw Error("Usage: node check_collection.mjs <html-file> <new-output-dir>");
const runs = resolve(dirname(fileURLToPath(import.meta.url)), "runs");
const pathInRuns = relative(runs, resolve(out));
if (
	!pathInRuns ||
	(pathInRuns !== ".." && !pathInRuns.startsWith(`..${sep}`) && !isAbsolute(pathInRuns))
) {
	throw Error("Output must not be inside committed benchmark history");
}
const html = await readFile(resolve(input));
const server = createServer((request, response) => {
	response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
	response.end(html);
});
await new Promise((resolvePromise) => server.listen(0, "127.0.0.1", resolvePromise));
const base = `http://127.0.0.1:${server.address().port}/`;
await mkdir(resolve(out), { recursive: false });
const browser = await chromium.launch({ channel: "chrome" });
const checks = [];
async function check(name, fn) {
	try {
		await fn();
		checks.push({ name, status: "pass" });
	} catch (e) {
		checks.push({ name, status: "fail", error: String(e) });
	}
}
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.setDefaultTimeout(4000);
await page.goto(base);
await check("search filters and clearing restores results", async () => {
	await page.getByRole("searchbox").fill("咖啡");
	if ((await page.locator("article").count()) !== 1) throw Error("search");
	await page.getByRole("searchbox").fill("");
	if ((await page.locator("article").count()) !== 3) throw Error("clear");
});
await check("favorite persists after reload and filter shows favorites", async () => {
	await page.getByRole("button", { name: "收藏 一本值得再读的书" }).click();
	await page.reload();
	await page.getByRole("button", { name: "已收藏", exact: true }).click();
	if ((await page.locator("article").count()) !== 2) throw Error("favorites");
});
await check("dialog escape and saved item survive reload", async () => {
	await page.getByRole("button", { name: "＋ 添加" }).click();
	await page.getByLabel("标题").fill("未保存");
	await page.keyboard.press("Escape");
	if (await page.locator("dialog").isVisible()) throw Error("dialog");
	if (
		!(await page
			.getByRole("button", { name: "＋ 添加" })
			.evaluate((el) => el === document.activeElement))
	)
		throw Error("focus not restored");
	await page.getByRole("button", { name: "＋ 添加" }).click();
	await page.getByLabel("标题").fill("待分享的想法");
	await page.getByLabel("备注").fill("真实的备忘");
	await page.getByRole("button", { name: "保存", exact: true }).click();
	await page.reload();
	if ((await page.getByRole("heading", { name: "待分享的想法" }).count()) !== 1)
		throw Error("save");
});
await check("delete and undo restore exact record and order", async () => {
	const before = await page.evaluate(() => localStorage.getItem("ui-foundry:collection-demo:v1"));
	await page.getByRole("button", { name: "删除 待分享的想法" }).click();
	await page.getByRole("button", { name: "撤销" }).click();
	const after = await page.evaluate(() => localStorage.getItem("ui-foundry:collection-demo:v1"));
	if (before !== after) throw Error("undo");
	await page.reload();
	if ((await page.getByRole("heading", { name: "待分享的想法" }).count()) !== 1)
		throw Error("reload");
});
await check("editing preserves identity and cancellation preserves saved data", async () => {
	const before = await page.evaluate(() =>
		JSON.parse(localStorage.getItem("ui-foundry:collection-demo:v1")),
	);
	await page.getByRole("button", { name: "编辑 待分享的想法" }).click();
	await page.getByLabel("标题").fill("放弃更改");
	await page.getByRole("button", { name: "取消", exact: true }).click();
	if (
		JSON.stringify(before) !==
		(await page.evaluate(() => localStorage.getItem("ui-foundry:collection-demo:v1")))
	)
		throw Error("cancel mutated data");
	await page.getByRole("button", { name: "编辑 待分享的想法" }).click();
	await page.getByLabel("标题").fill("整理后的想法");
	await page.getByRole("button", { name: "保存", exact: true }).click();
	await page.reload();
	const after = await page.evaluate(() =>
		JSON.parse(localStorage.getItem("ui-foundry:collection-demo:v1")),
	);
	if (
		after[0].id !== before[0].id ||
		after[0].title !== "整理后的想法" ||
		JSON.stringify(after.slice(1)) !== JSON.stringify(before.slice(1))
	)
		throw Error("edit lost identity or changed other records");
});
await page.screenshot({ path: resolve(out, "desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(base);
await check("mobile has no horizontal overflow", async () => {
	const widths = await mobile.evaluate(() => [innerWidth, document.documentElement.scrollWidth]);
	if (widths[1] > widths[0]) throw Error(JSON.stringify(widths));
});
await mobile.screenshot({ path: resolve(out, "mobile.png") });
if (errors.length) checks.push({ name: "page errors", status: "fail", error: errors.join("; ") });
await browser.close();
await new Promise((resolvePromise) => server.close(resolvePromise));
await writeFile(
	resolve(out, "result.json"),
	JSON.stringify({ scope: "authored reference; local storage, Chrome", checks }, null, 2) + "\n",
);
console.log(checks);
if (checks.some((c) => c.status !== "pass")) process.exitCode = 1;
