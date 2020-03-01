const darkMode = new DarkMode();
const favorites = new Favorites(refreshList);
const loader = {extra: refreshList};
function refreshList() {
	loadRecipes();
	const list = document.querySelector("#recipe-list");
	for (var item of list.children) {
		item.classList[["add", "remove"][favorites.check(item.getAttribute("recipe"))]]("hidden");
		favorites.updateBtn(item.children[0]);
	}
}
function loadRecipes() {
	listRecipes({
		loader,
		table: document.querySelector("#recipe-list")
	});
}
function load() {
	darkMode.load();
	fetchRecipes(loader);
}
