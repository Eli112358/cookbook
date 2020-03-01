class DarkMode {
	constructor() {
		localStorage.darkMode = localStorage.darkMode || "false";
	}
	get value() {
		return localStorage.darkMode == "true";
	}
	set value(value) {
		localStorage.darkMode = value;
	}
	load() {
		if (this.value) {
			document.body.classList.add("dark-mode");
		}
	}
	toggle() {
		document.body.classList.toggle("dark-mode");
		this.value = !this.value;
	}
}
