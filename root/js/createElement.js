function createElement({
	name = "div",
	properties = {},
	attributes = {},
	classList = [],
	content = []
}={}) {
	let el = document.createElement(name);
	Object.assign(el, properties);
	Object.entries(attributes).forEach((attrib) => {el.setAttribute(...attrib)});
	el.classList.add(...classList);
	el.append(...content);
	return el;
}
