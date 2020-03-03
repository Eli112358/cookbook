function loadCorner() {
	getFile({path: "images/octo-corner.svg", handler: (data) => {
		let svg = new DOMParser().parseFromString(data, "text/xml");
		let n = document.importNode(svg.documentElement, true);
		document.body.innerHTML += n.outerHTML;
	}});
}
