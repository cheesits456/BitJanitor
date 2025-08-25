// Set version number
document.getElementById("version").innerHTML = `alpha ${require("../package.json").version} build ${require("../data.json").build}`;