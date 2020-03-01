class Units {
	constructor() {
		this.deafults = new Map();
		this.map = new Map();
	}
	init(loader) {
		if (this.deafults.size == 0) {
			this.deafults = new Map(loader.loaded.units.map((k) => [k, k]));
		}
	}
	reset() {
		if (this.deafults.size == 0) {
			const errMsg = "Please report this error:\nUnits object has not been properly initialized";
			console.error(errMsg);
			alert(errMsg);
			return;
		}
		this.map = this.deafults;
	}
	reload() {
		localStorage.units = localStorage.units || "[]";
		let loaded = new Map(JSON.parse(localStorage.units));
		this.map = new Map([...this.deafults, ...loaded]);
	}
	save() {
		localStorage.units = JSON.stringify([...this.map.entries()]);
	}
	get(key) {
		if (!this.map.has(key)) {
			this.map.set(key, key);
		}
		return this.map.get(key);
	}
	set(key, value) {
		this.map.set(key, value);
	}
	get size() {
		return this.map.size;
	}
}
