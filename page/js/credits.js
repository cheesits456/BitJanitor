const path = require("path");

const buildData = require(path.join("..", "..", "data.json"));
const package = require(path.join("..", "..", "package.json"));

// Set version number
document.getElementById("version").innerHTML = `<i class="fa fa-code fa-fw"></i> ${buildData.type}${package.version} build ${buildData.build}`;

// Set height
updateSize();
window.addEventListener("resize", updateSize);

function updateSize() {
	document.getElementById("page-wrapper").style.height = `${Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)}px`;
}