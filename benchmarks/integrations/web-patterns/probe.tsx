import { createRoot } from "react-dom/client";
import { MeetingPicker } from "./MeetingPicker";
import type { PlaceProvider } from "./types";
import "./styles.css";

const provider: PlaceProvider = {
	async search(query) {
		window.__probeStarts = [...(window.__probeStarts ?? []), query];
		if (query === "慢") await new Promise((resolve) => window.setTimeout(resolve, 700));
		if (query === "新") await new Promise((resolve) => window.setTimeout(resolve, 30));
		if (query === "失败") throw new Error("denied by probe");
		if (query === "慢")
			return [
				{
					id: "probe:old",
					label: "旧结果",
					address: "过期地址",
					coordinateSystem: null,
					source: "fixture",
				},
			];
		return query === "新"
			? [
					{
						id: "probe:new",
						label: "新结果",
						address: "测试地址",
						coordinateSystem: null,
						source: "fixture",
					},
				]
			: [];
	},
};

declare global {
	interface Window {
		__probeStarts?: string[];
		__probeSaves?: number;
	}
}
createRoot(document.getElementById("root")!).render(
	<main className="uf-demo-shell">
		<MeetingPicker
			onSave={() => {
				window.__probeSaves = (window.__probeSaves ?? 0) + 1;
				return new Promise((_, reject) =>
					window.setTimeout(() => reject(new Error("remote rejected")), 350),
				);
			}}
			provider={provider}
			storageKey="ui-foundry:probe"
		/>
	</main>,
);
