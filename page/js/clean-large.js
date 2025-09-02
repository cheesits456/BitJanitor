Array.prototype.remove = function (a) {
	for (var b = 0; this.includes(a);) this.splice(this.indexOf(a), 1), b++;
	return this;
};

// Require mandatory packages
const fs = require("fs");
const os = require("os");
const path = require("path");

const remote = require('@electron/remote');
const { dialog } = remote;

const buildData = require(path.join("..", "..", "data.json"));
const package = require(path.join("..", "..", "package.json"));

stats = 0;

// Set version number
document.getElementById("version").innerHTML = `<i class="fa fa-code fa-fw"></i> ${buildData.type}${package.version} build ${buildData.build}`;

// Set height
updateSize();
window.addEventListener("resize", updateSize);

function updateSize() {
	document.getElementById("sidebar").style.height = `${Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) - 51}px`;
	document.getElementById("progress").style.height = `${document.getElementById("configuration").offsetHeight}px`;
}

// Set defualt search directory
document.getElementById("search-dir").value = os.homedir();


// Define onClick functions
function getDir() {
	dialog.showOpenDialog({
		buttonLabel: "Select",
		properties: ["openDirectory"],
		title: "Select Folder"
	}).then(dir => {
		if (dir.filePaths[0]) document.getElementById("search-dir").value = dir.filePaths[0];
	});
}

function scan() {
	document.getElementById("button-scan").setAttribute("onClick", "alert('There is already a scan in progress')");
	stats = 0;
	const dir = document.getElementById("search-dir").value;

	document.getElementById("status").innerHTML = `<span class="text-medium">Scanning . . .</span>`;
	document.getElementById("step1").innerHTML = "<br><span class='text-medium'>Step 1/2:</span> Building file list [0 files found]";

	walk(dir, async function (err, results) {
		if (err) throw err;

		document.getElementById("step2").innerHTML = "<span class='text-medium'>Step 2/2:</span> Checking for large files";
		results.remove(undefined);
		let size = parseInt(document.getElementById("search-size").value) * (document.getElementById("search-unit").value === "MB" ? 1000000 : 1000000000);

		let res = [];
		for (const file of results) {
			if (fs.statSync(file).size >= size) res.push(`<p id="${file}" width="100%"><i class="fa fa-trash fa-fw fg-red pointer-cursor" onClick="deleteFile('${file.replace(/\\/g, "\\\\")}')"></i> ${file}</p>`);
			await setTimeout(() => {
				document.getElementById("results").innerHTML = res.join("");
				document.getElementById("button-scan").setAttribute("onClick", "scan()");
				updateSize();
			}, 100);
		}
		document.getElementById("button-scan").setAttribute("onClick", "scanLarge()");
	});
}


// Define helper functions
function walk(dir, done) {
	let results = []
	fs.readdir(dir, (err, list) => {
		if (err) return done(err);
		let pending = list.length;
		if (!pending) return done(null, results);
		list.forEach(file => {
			file = path.resolve(dir, file);
			fs.stat(file, (err, stat) => {
				if (stat && stat.isDirectory()) {
					walk(file, (err, res) => {
						results = results.concat(res);
						if (!--pending) done(null, results);
					});
				} else {
					results.push(file);
					document.getElementById("step1").innerHTML = `<br><span class='text-medium'>Step 1/3:</span> Building file list [${(++stats).toLocaleString()} files found]`
					if (!--pending) done(null, results);
				}
			});
		});
	});
};

function deleteFile(file) {
	console.log(file);
	fs.unlink(file, err => {
		if (err) return console.log(err);// Metro.toast.create("Missing permission to delete this file");
		document.getElementById(file).style.display = "none";
	})
}