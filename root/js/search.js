const darkMode = new DarkMode();
const favorites = new Favorites();
let firstLoad = true;
const loader = {extra: search};
function getRegex(hasHash) {
	let query = document.querySelector("#query input").value.split(" ");
	query = query.filter((q) => q.charAt(0) != "#" ^ hasHash);
	return RegExp(query.join("|"), "gi");
}
function updateState() {
	if (firstLoad) {
		firstLoad = false;
		return;
	}
	const query = document.querySelector("#query input").value.replace(" ", "+");
	let newUrl = window.location.href.split("?")[0];
	if (query) {
		newUrl += "?q=" + encodeURIComponent(query);
	}
	const state = {Title: document.title, Url: newUrl};
	history.pushState(state, state.Title, state.Url);
}
function resetResults() {
	document.querySelectorAll("#recipe-list .hidden,.match").forEach(n => n.classList.remove(n.classList[0]));
}
function clearQuery() {
	const input = document.querySelector("#query input");
	if (input.value) {
		input.value = "";
		resetResults();
		updateState();
	}
}
function search() {
	updateState();
	loadRecipes();
	const query = getRegex(0);
	const queryTags = getRegex(1);
	let testName = query.source != "(?:)";
	let testTags = queryTags.source != "(?:)";
	let listAll = !testName && !testTags;
	resetResults()
	for (var item of document.querySelectorAll("#recipe-list>tr")) {
		favorites.updateBtn(item.children[0]);
		let matchTags = false;
		for (var tag of item.querySelectorAll(".tags a")) {
			let matchTag = queryTags.test(tag.innerText);
			matchTags |= matchTag;
			if (testTags && matchTag) {
				tag.classList.add("match");
			}
		}
		let match = false;
		if (testName) {
			for (var span of item.querySelectorAll(".recipe-link span")) {
				if (query.test(span.innerText)) {
					span.classList.add("match");
					match = true;
				}
			}
		}
		if (!listAll && (!match || !matchTags)) {
			item.classList.add("hidden");
		}
	}
}
function loadRecipes() {
	listRecipes({
		loader,
		table: document.querySelector("#recipe-list"),
		getLinkInnerHTML: (fn) => fn.replace(/[a-z]+/gi, (m) => `<span>${m}</span>`)
	});
}
function load() {
	darkMode.load();
	const query = new URLSearchParams(location.search).get("q");
	if (query) {
		document.querySelector("#query input").value = query.replace("+", " ");
	}
	fetchRecipes(loader);
}
