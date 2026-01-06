(() => {
	const relationships = {
		lightning: { beats: ["water", "air"], losesTo: ["earth", "fire"] },
		fire: { beats: ["air", "earth"], losesTo: ["water", "lightning"] },
		air: { beats: ["earth", "water"], losesTo: ["fire", "lightning"] },
		earth: { beats: ["lightning", "water"], losesTo: ["air", "fire"] },
		water: { beats: ["fire", "lightning"], losesTo: ["air", "earth"] },
	};

	const displayNames = {
		lightning: "Lightning",
		fire: "Fire",
		air: "Air",
		earth: "Earth",
		water: "Water",
	};

	function formatList(keys) {
		return keys.map((k) => displayNames[k] ?? k).join(", ");
	}

	function clearRelations(navEl, icons, tooltipEl) {
		navEl.classList.remove("is-active");
		for (const icon of icons) {
			icon.classList.remove("relation-self", "relation-beats", "relation-loses");
			if (icon.dataset.originalTitle) {
				icon.setAttribute("title", icon.dataset.originalTitle);
				delete icon.dataset.originalTitle;
			}
		}
		tooltipEl.hidden = true;
		tooltipEl.textContent = "";
	}

	document.addEventListener("DOMContentLoaded", () => {
		const navEl = document.querySelector(".element-icons");
		const tooltipEl = document.getElementById("element-tooltip");
		const icons = Array.from(document.querySelectorAll(".element-icon"));

		if (!navEl || !tooltipEl || icons.length === 0) return;

		const iconByKey = new Map();
		for (const icon of icons) {
			const key = icon.dataset.element;
			if (key) iconByKey.set(key, icon);
		}

		function activate(key) {
			const rel = relationships[key];
			if (!rel) return;

			navEl.classList.add("is-active");
			for (const icon of icons) {
				icon.classList.remove("relation-self", "relation-beats", "relation-loses");
				// Avoid double-tooltips by temporarily clearing the native title.
				if (!icon.dataset.originalTitle) {
					icon.dataset.originalTitle = icon.getAttribute("title") ?? "";
				}
				icon.setAttribute("title", "");
			}

			const selfIcon = iconByKey.get(key);
			if (selfIcon) selfIcon.classList.add("relation-self");

			for (const beatKey of rel.beats) {
				const beatIcon = iconByKey.get(beatKey);
				if (beatIcon) beatIcon.classList.add("relation-beats");
			}

			for (const loseKey of rel.losesTo) {
				const loseIcon = iconByKey.get(loseKey);
				if (loseIcon) loseIcon.classList.add("relation-loses");
			}

			tooltipEl.textContent =
				`${displayNames[key] ?? key}\n` +
				`Beats: ${formatList(rel.beats)}\n` +
				`Loses to: ${formatList(rel.losesTo)}`;
			tooltipEl.hidden = false;
		}

		for (const icon of icons) {
			const key = icon.dataset.element;
			if (!key) continue;

			icon.addEventListener("mouseenter", () => activate(key));
			icon.addEventListener("focus", () => activate(key));
			icon.addEventListener("mouseleave", () => clearRelations(navEl, icons, tooltipEl));
			icon.addEventListener("blur", () => clearRelations(navEl, icons, tooltipEl));
		}

		// If the user moves the mouse off the diagram entirely, clear state.
		navEl.addEventListener("mouseleave", () => clearRelations(navEl, icons, tooltipEl));
	});
})();
