const darkMode = new DarkMode();
const loader = {extra: listUnits};
const units = new Units();
function listUnits() {
	units.init(loader);
	units.reload();
	if (units.size == 0) {
		units.reset();
	}
	const table = createElement({
		name: "table",
		attributes: {align: "center"}
	});
	units.map.forEach((v, k) => {
		table.append(createElement({
			name: "tr",
			attributes: {unit: k},
			content: [
				createElement({
					name: "td",
					content: [document.createTextNode(k + ": ")]
				}),
				createElement({
					name: "td",
					content: [createElement({
						name: "input",
						attributes: {name: k, type: "text", value: v}
					})]
				})
			]
		}));
	});
	const form = document.querySelector("#units");
	if (form.childElementCount > 1) {
		form.children[0].remove();
	}
	form.insertBefore(table, form.lastElementChild);
}
function save() {
	for (var input of form.querySelectorAll("#units input")) {
		units.set(input.name, input.value);
	}
	units.save();
}
function reset() {
	units.reset();
	units.save();
	listUnits();
}
function load() {
	darkMode.load();
	svg4everybody();
	fetchRecipes(loader); // for deafult units
	document.querySelector("#units").reset.onclick = reset;
}
