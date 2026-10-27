import assert from "node:assert/strict";
import test from "node:test";

import {
	createAMapPlaceService,
	PlaceServiceError,
} from "../skills/ui-foundry/assets/place-service/amap-place-service.mjs";
import { createPlaceSearchHandler } from "../skills/ui-foundry/assets/place-service/route-handler.mjs";

function response(body, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { "Content-Type": "application/json" },
	});
}

test("maps complete AMap POIs and enforces city bounds without leaking its key", async () => {
	let requestedUrl;
	let requestedInit;
	const service = createAMapPlaceService({
		key: "server-secret",
		fetchImpl: async (url, init) => {
			requestedUrl = new URL(url);
			requestedInit = init;
			return response({
				status: "1",
				pois: [
					{ id: "B000A", name: "国家博物馆", address: "东城区东长安街16号", location: "0,39.9042" },
				],
			});
		},
	});

	const places = await service.search({ query: " 国家博物馆 ", city: "北京市", limit: 1 });
	assert.deepEqual(places, [
		{
			id: "B000A",
			label: "国家博物馆",
			address: "东城区东长安街16号",
			latitude: 39.9042,
			longitude: 0,
			coordinateSystem: "GCJ-02",
			source: "amap",
		},
	]);
	assert.equal(
		requestedUrl.origin + requestedUrl.pathname,
		"https://restapi.amap.com/v5/place/text",
	);
	assert.equal(requestedUrl.searchParams.get("keywords"), "国家博物馆");
	assert.equal(requestedUrl.searchParams.get("region"), "北京市");
	assert.equal(requestedUrl.searchParams.get("city_limit"), "true");
	assert.equal(requestedUrl.searchParams.get("key"), "server-secret");
	assert.equal(requestedInit.redirect, "error");
	assert.equal(JSON.stringify(places).includes("server-secret"), false);
});

test("returns empty for a valid provider response with no POIs and discards invalid provider data", async () => {
	const service = createAMapPlaceService({
		key: "server-secret",
		fetchImpl: async () =>
			response({
				status: "1",
				pois: [
					{ id: "missing-name", address: "地址", location: "116,39" },
					{ id: "wrong-location", name: "地点", address: "地址", location: "not-a-coordinate" },
					{ id: "wrong-bounds", name: "地点", address: "地址", location: "181,39" },
				],
			}),
	});
	assert.deepEqual(await service.search({ query: "地点" }), []);
});

test("uses safe errors for invalid requests, provider failure, and malformed JSON", async () => {
	const service = createAMapPlaceService({
		key: "server-secret",
		fetchImpl: async () => response({ status: "0", info: "INVALID_USER_KEY" }),
	});
	await assert.rejects(
		() => service.search({ query: "" }),
		(error) => error instanceof PlaceServiceError && error.code === "INVALID_REQUEST",
	);
	await assert.rejects(
		() => service.search({ query: "museum secret" }),
		(error) => {
			assert.equal(error.code, "UNAVAILABLE");
			assert.equal(error.message.includes("secret"), false);
			return true;
		},
	);

	const malformed = createAMapPlaceService({
		key: "server-secret",
		fetchImpl: async () => new Response("not-json", { status: 200 }),
	});
	await assert.rejects(
		() => malformed.search({ query: "museum" }),
		(error) => error.code === "UNAVAILABLE",
	);

	const incomplete = createAMapPlaceService({
		key: "server-secret",
		fetchImpl: async () => response({ status: "1" }),
	});
	await assert.rejects(
		() => incomplete.search({ query: "museum" }),
		(error) => error.code === "UNAVAILABLE",
	);
});

test("maps external cancellation and timeout without a network request", async () => {
	const controller = new AbortController();
	controller.abort();
	let called = false;
	const cancelled = createAMapPlaceService({
		key: "server-secret",
		fetchImpl: async () => {
			called = true;
			throw new Error("should not matter");
		},
	});
	await assert.rejects(
		() => cancelled.search({ query: "museum", signal: controller.signal }),
		(error) => error.code === "ABORTED",
	);
	assert.equal(called, false);

	const timeout = createAMapPlaceService({
		key: "server-secret",
		timeoutMs: 1,
		fetchImpl: (_url, { signal }) =>
			new Promise((_resolve, reject) =>
				signal.addEventListener("abort", () => reject(new Error("aborted")), { once: true }),
			),
	});
	await assert.rejects(
		() => timeout.search({ query: "museum" }),
		(error) => error.code === "TIMEOUT",
	);
});

test("keeps abort and timeout classification if response JSON reading is interrupted", async () => {
	const controller = new AbortController();
	const aborted = createAMapPlaceService({
		key: "server-secret",
		fetchImpl: async () => ({
			ok: true,
			json: async () => {
				controller.abort();
				throw new Error("body stream stopped");
			},
		}),
	});
	await assert.rejects(
		() => aborted.search({ query: "museum", signal: controller.signal }),
		(error) => error.code === "ABORTED",
	);

	const timedOut = createAMapPlaceService({
		key: "server-secret",
		timeoutMs: 1,
		fetchImpl: async () => ({
			ok: true,
			json: async () =>
				new Promise((_resolve, reject) =>
					setTimeout(() => reject(new Error("body stream stopped")), 5),
				),
		}),
	});
	await assert.rejects(
		() => timedOut.search({ query: "museum" }),
		(error) => error.code === "TIMEOUT",
	);
});

test("route handler enforces same origin and caller-owned auth/rate hooks", async () => {
	const handler = createPlaceSearchHandler({
		placeService: {
			search: async () => [
				{
					id: "p",
					label: "地点",
					address: "地址",
					latitude: 0,
					longitude: 0,
					coordinateSystem: "GCJ-02",
					source: "amap",
				},
			],
		},
		origin: "https://app.example.com",
		authenticate: async () => true,
		rateLimit: async () => true,
	});
	const allowed = await handler(
		new Request("https://app.example.com/api/place-search", {
			method: "POST",
			headers: { origin: "https://app.example.com", "content-type": "application/json" },
			body: JSON.stringify({ query: "地点" }),
		}),
	);
	assert.equal(allowed.status, 200);
	assert.deepEqual(await allowed.json(), {
		places: [
			{
				id: "p",
				label: "地点",
				address: "地址",
				latitude: 0,
				longitude: 0,
				coordinateSystem: "GCJ-02",
				source: "amap",
			},
		],
	});

	const foreign = await handler(
		new Request("https://app.example.com/api/place-search", {
			method: "POST",
			headers: { origin: "https://other.example", "content-type": "application/json" },
			body: JSON.stringify({ query: "地点" }),
		}),
	);
	assert.equal(foreign.status, 403);
});

test("route handler rejects unauthenticated, rate-limited, malformed, and unsafe provider failures", async () => {
	const request = (body = JSON.stringify({ query: "地点" }), headers = {}) =>
		new Request("https://app.example.com/api/place-search", {
			method: "POST",
			headers: {
				origin: "https://app.example.com",
				"content-type": "application/json",
				...headers,
			},
			body,
		});
	const dependencies = {
		placeService: {
			search: async () => {
				throw new PlaceServiceError("UNAVAILABLE", "Place search is temporarily unavailable.");
			},
		},
		origin: "https://app.example.com",
		authenticate: async () => false,
		rateLimit: async () => true,
	};
	let result = await createPlaceSearchHandler(dependencies)(request());
	assert.equal(result.status, 401);

	dependencies.authenticate = async () => true;
	dependencies.rateLimit = async () => false;
	result = await createPlaceSearchHandler(dependencies)(request());
	assert.equal(result.status, 429);

	dependencies.rateLimit = async () => true;
	result = await createPlaceSearchHandler(dependencies)(request("not-json"));
	assert.equal(result.status, 400);
	result = await createPlaceSearchHandler(dependencies)(
		request(JSON.stringify({ query: "地点" }), { "content-type": "text/plain" }),
	);
	assert.equal(result.status, 415);
	result = await createPlaceSearchHandler(dependencies)(
		request(JSON.stringify({ query: "地".repeat(8_193) })),
	);
	assert.equal(result.status, 413);
	result = await createPlaceSearchHandler(dependencies)(request());
	assert.equal(result.status, 503);
	assert.deepEqual(await result.json(), {
		error: "Place search is temporarily unavailable.",
		code: "UNAVAILABLE",
	});
});
