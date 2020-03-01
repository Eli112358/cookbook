function loadTags(recipe) {
	return recipe.tags.map((tag) => createElement({name: "a", attributes: {href: `index.html?q=%23${tag}`}, content: [`#${tag}`]})); // %23 is #
}
