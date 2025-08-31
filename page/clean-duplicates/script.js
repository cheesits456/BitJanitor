const path = require("path");

const buildData = require(path.join("..", "..", "data.json"));
const package = require(path.join("..", "..", "package.json"));

// Set version number
document.getElementById("version").innerHTML = `${buildData.type}${package.version} build ${buildData.build}`;