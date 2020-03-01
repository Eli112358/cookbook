class Favorites {
	constructor(extra = () => {}) {
		localStorage.favorites = localStorage.favorites || "";
		this.extra = extra;
		this.map = new Map(localStorage.favorites.split(",").filter((id) => id).map((id) => [id, true]));
	}
	check(id) {
		return this.map.get(id) | 0;
	}
	save() {
		localStorage.favorites = Array.from(this.map.keys()).filter((id) => this.map.get(id)).join(",");
	}
	toggle(row, id) {
		this.map.set(id, !this.map.get(id));
		row.classList.toggle("faved");
		this.save();
		this.extra();
	}
	updateBtn(btn) {
		btn.classList[["remove", "add"][this.check(btn.parentElement.getAttribute("recipe"))]]("faved");
	}
}
