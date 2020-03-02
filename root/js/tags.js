function loadTags(recipe) {
	let link = (tag) => createElement({
		name: "a",
		attributes: {href: `index.html?q=%23${tag}`}, // %23 is #
		content: [`#${tag}`]
	});
	let span = () => createElement({name: "span", content: [" "]});
	return recipe.tags.map(link).reduce((p, c) => p.concat(c, span()), [span()])
}
