function listRecipe({
	table,
	id,
	recipe,
	inner
}={}) {
	table.append(createElement({
		name: "tr",
		attributes: {recipe: id},
		content: [
			createElement({
				name: "td",
				attributes: {
					onclick: `favorites.toggle(this, "${id}")`
				},
				classList: ["fav-btn"]
			}),
			createElement({
				name: "td",
				content: [
					createElement({name: "tr", content: [createElement({
						name: "a",
						properties: {href: `recipe.html?id=${id}`, innerHTML: inner(recipe.full_name)},
						classList: ["recipe-link"]
					})]}),
					createElement({
						name: "tr",
						classList: ["tags"],
						content: loadTags(recipe)
					})
				]
			})
		]
	}));
}
function listRecipes({
	loader,
	table,
	getLinkInnerHTML: inner = (fn) => fn
}={}) {
	if (!loader.listed) {
		Object.entries(loader.loaded.index).forEach(([id, recipe]) => listRecipe({table, id, recipe, inner}));
	}
	loader.listed = true;
}
function fetchRecipes(loader) {
	loadJsonFile("recipes.json", loader);
}
