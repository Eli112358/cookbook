const darkMode = new DarkMode();
const favorites = new Favorites();
const units = new Units();

const id = new URLSearchParams(location.search).get("id");
const batches = () => document.querySelector("#batches input");
const evalBatches = () => parseEval(batches().value);
const loader = {extra: loadRecipe};
const recipeLoader = {extra: recipeLoaded};
let recipe = {};

String.prototype.format = function () {
	s = this;
	for (k in arguments) {
		s = s.replace("{" + k + "}", arguments[k]);
	}
	return s;
};

function hasProp(obj, path) {
	if (!path) {
		return false;
	}
	let keys = path.split(".");
	let first = keys[0];
	if (keys.length == 1) {
		return obj.hasOwnProperty(first);
	}
	if (!hasProp(obj, first)) {
		return false;
	}
	return hasProp(obj[first], keys.slice(1).join("."));
}
function toggleSection(element, i) {
	element.classList.toggle("rotate");
	document.querySelectorAll(".section div")[i].classList.toggle("hidden");
}
function filterAndJoin(array, sep = " ") {
	return array.filter(n => n != null).join(sep);
}
function parseEval(n) {
	return math.parse(n).evaluate();
}
function evalQuantity(quantity) {
	let value = parseEval(quantity);
	let whole = math.floor(value);
	let part = math.mod(value, 1)
	let fraction = math.fraction(part);
	return filterAndJoin([
		whole > 0 ? whole : null,
		part > 0 ? `\\({${fraction.n} \\over ${fraction.d}}\\)` : null
	]);
}
function calcQuantities() {
	document.querySelectorAll(".quantity").forEach(item => {
		let originalValue = parseEval(item.getAttribute("originalValue"));
		let value = originalValue*evalBatches();
		item.setAttribute("value", value);
		item.innerText = evalQuantity(value);
	});
	document.querySelectorAll(".unit").forEach(item => {
		let quantity = item.parentElement.querySelector(".quantity");
		if (quantity) {
			let value = parseEval(quantity.getAttribute("value"));
			item.innerText = pluralize(item.innerText, math.max(value, 1));
		}
	});
	MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}
function listQuantities() {
	units.reload();
	const ingredients = document.querySelector("#ingredients ul");
	function parseQuantity(quantity, key = "deafult") {
		if (quantity == undefined) {
			return {value: 1, string: null, element: null};
		}
		if (typeof quantity == "number") {
			let value = quantity*evalBatches();
			let string = evalQuantity(value);
			return {
				value: value,
				string: string,
				element: createElement({
					name: "span",
					classList: ["quantity"],
					attributes: {originalValue: value, value: value},
					content: [string]
				}).outerHTML
			};
		}
		if (typeof quantity == "string") {
			return parseQuantity(parseEval(quantity));
		}
		if (hasProp(quantity, "min")) {
			let min = parseQuantity(quantity.min);
			let max = parseQuantity(quantity.max);
			return {
				value: min.value,
				string: `${min.string}-${max.string}`,
				element: min.element + "-" + max.element
			};
		}
		return parseQuantity(quantity[key]);
	}
	function parseUnit(unit, quantity) {
		if (typeof unit == "string") {
			return createElement({
				name: "span",
				classList: ["unit"],
				content: [pluralize(units.get(unit), math.max(quantity, 1))]
			}).outerHTML;
		}
		if (hasProp(unit, "quantity")) {
			return "(<span>" + parseQuantity(unit.quantity).element + " " + parseUnit(unit.name, unit.quantity) + "</span>)";
		}
		return filterAndJoin([
			parseUnit(unit.name, quantity),
			hasProp(unit, "detail") ? parseUnit(unit.detail) : null
		]);
	}
	if (hasProp(recipe, "result")) {
		let resultQuantity = parseQuantity(recipe.result.quantity);
		document.querySelector("#result").innerHTML = filterAndJoin([
			"Makes",
			resultQuantity.element,
			pluralize(recipe.result.unit, resultQuantity.value),
			hasProp(recipe.result, "detail") ? recipe.result.format.detail.format(recipe.result.detail) : null
		]);
	}
	ingredients.innerHTML = "";
	for (var ingredient of recipe.ingredients) {
		let quantity = parseQuantity(ingredient.quantity);
		let optioanlQuantity = parseQuantity(ingredient.quantity, "optioanl").element;
		let child = createElement({name: "li", content: [filterAndJoin([
			filterAndJoin([
				quantity.element,
				hasProp(ingredient, "unit") ? parseUnit(ingredient.unit, quantity.value) : null,
				hasProp(ingredient, "type") ? ingredient.type : null,
				!hasProp(ingredient, "unit") ? parseUnit(ingredient.name, math.max(quantity.value, 1)) : ingredient.name
			]),
			hasProp(ingredient, "detail") ? (hasProp(ingredient, "format.detail") ? ingredient : recipe).format.detail.format(ingredient.detail) : null,
			hasProp(ingredient, "quantity.optioanl") ? (hasProp(ingredient, "format.optioanl") ? ingredient : recipe).format.optioanl.format(optioanlQuantity) : null
		], "")]});
		child.innerHTML = child.innerText;
		ingredients.append(child);
	}
	MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}
function resetBatches() {
	batches().value = 1;
	calcQuantities();
}
function listInstructions() {
	document.querySelector("#instructions div").append(
		...recipe.instructions.map(instr => createElement({
			name: recipe.format.instructions,
			content: [instr]
		}))
	);
}
function displayFullName() {
	document.querySelector("#full-name").innerText = recipe.full_name;
	document.title = "Cookbook - " + recipe.full_name;
}
function displayCompanion() {
	if (hasProp(recipe, "companion")) {
		const companion = document.querySelector("#companion a");
		companion.href = "recipe.html?id=" + recipe.companion;
		companion.innerText = loader.loaded.index[recipe.companion].full_name;
		companion.parentElement.classList.remove("hidden");
	}
}
function displaySources() {
	for (var [k, v] of Object.entries(recipe.source)) {
		let elem = document.querySelector("#source .source-" + k);
		if (elem.tagName == "A") {
			elem.href = v;
		} else {
			elem.querySelector("span").innerText = v;
		}
		elem.classList.remove("hidden");
	}
}
function displayRecipe() {
	if (!recipe.hasOwnProperty("full_name")) {
		window.location.replace("404");
	}

	displayFullName();
	displayCompanion();

	document.querySelector(".tags").append(...loadTags(recipe));

	displaySources();

	const favBtn = document.querySelector(".fav-btn");
	favBtn.parentElement.setAttribute("recipe", id)
	favBtn.setAttribute("onclick", `favorites.toggle(this, "${id}")`);
	favorites.updateBtn(favBtn);

	listQuantities();
	listInstructions();
}
function recipeLoaded() {
	recipe = recipeLoader.loaded;
	displayRecipe();
}
function loadRecipe() {
	units.init(loader);
	loadJsonFile("recipes/" + id + ".json", recipeLoader);
}
function load() {
	darkMode.load();
	pluralize.addPluralRule(/\.$/i, ".");
	Array.from(document.querySelectorAll(".arrow")).forEach((el, i) => {
		el.setAttribute("onclick", `toggleSection(this, ${i})`);
	});
	fetchRecipes(loader); // for deafult units and companion's full name
}
