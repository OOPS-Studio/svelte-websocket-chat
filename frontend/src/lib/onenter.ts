import type { ActionReturn } from "svelte/action";

export function watchForEnterPressed(node: HTMLElement): ActionReturn {
	const handleKeypress = event => {
		if (event.key === "Enter") node.dispatchEvent(new CustomEvent("enterpressed"));
	}

	node.addEventListener("keypress", handleKeypress);

	return {
		destroy() {
			node.removeEventListener("keypress", handleKeypress);
		}
	}
}