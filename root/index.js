'use strict';
const path = require('path');
const fs = require('fs');
const recipesFile = "recipes.json";
module.exports = {
	exists: () => fs.existsSync(recipesFile),
	rebuild: () => {
		console.log("Rebuilding recipe index...");
		const f_unit = i => i.unit;
		const recipeDir = "recipes";
		let recipes = {
			index: {},
			units: new Set()
		};
		function addUnit(unit) {
			if (typeof unit == "string") {
				recipes.units.add(unit);
			} else {
				if (unit.hasOwnProperty("name")) {
					addUnit(unit.name);
				}
				if (unit.hasOwnProperty("detail")) {
					addUnit(unit.detail);
				}
			}
		}
		const re = /(?:\.([^.]+))?$/;
		fs.readdirSync(recipeDir).forEach((file) => {
			if (re.exec(file)[1] != "json") {
				return;
			}
			try {
				let recipe = JSON.parse(fs.readFileSync(path.join(recipeDir, file)));
				recipes.index[file.slice(0, -5)] = {full_name: recipe.full_name, tags: recipe.tags};
				recipe.ingredients.filter(f_unit).map(f_unit).forEach(item => addUnit(item));
			} catch (e) {
				console.log("File:", file);
				console.log(e);
			}

		});
		recipes.units = Array.from(recipes.units);
		recipes.units.sort();
		fs.writeFileSync(recipesFile, JSON.stringify(recipes, null, "\t"));
	}
};
if (require.main === module) {
	module.exports.rebuild();
	process.exit();
}
