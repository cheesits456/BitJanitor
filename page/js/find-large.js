Array.prototype.remove = function (a) {
	for (var b = 0; this.includes(a);) this.splice(this.indexOf(a), 1), b++;
	return this;
};


// Require mandatory packages
const fs = require("fs");
const os = require("os");
const path = require("path");
let stats = 0;


// Set height
function height() {
document.getElementById("panel-progress-large").style.paddingBottom = `${document.getElementById("panel-folder-large").height}px`;
}

// Set defualt search directory
document.getElementById("search-dir").value = os.homedir();


// Define onClick functions
function getDirLarge() {
	const { dialog } = require('electron').remote;
	dialog.showOpenDialog({
		properties: ['openDirectory']
	}).then(dir => document.getElementById("search-dir").value = dir.filePaths[0]);
}

function scanLarge() {
	document.getElementById("button-scan").setAttribute("onClick", "Metro.toast.create('There is already a scan in progress')");
	stats = 0;
	const dir = document.getElementById("search-dir").value,
		algorithm = "sha256";
	let hashes = {};

	document.getElementById("status").innerHTML = `<span class="text-medium">Scanning . . .</span>`;
	document.getElementById("step1").innerHTML = "<br><span class='text-medium'>Step 1/2:</span> Building file list [0 files found]";

	walkLarge(dir, async function (err, results) {
		if (err) throw err;

		document.getElementById("step2").innerHTML = "<span class='text-medium'>Step 2/2:</span> Checking for large files";
		results.remove(undefined);
		let size = parseInt(document.getElementById("search-size").value) * (document.getElementById("search-unit").value === "MB" ? 1000000 : 1000000000);

		let res = [];
		for (const file of results) {
			if (fs.statSync(file).size >= size) res.push(`<div id="${file}" class="text-secondary"><span class="mif-bin mif-lg fg-red hover-pointer" onClick="deleteFileLarge('${file.replace(/\\/g, "\\\\")}')"></span> ${file}</div>`);
			await setTimeout(() => {
				document.getElementById("results").innerHTML = res.join("");
			}, 100);
		}
		document.getElementById("button-scan").setAttribute("onClick", "scan()");
	});
}


// Define helper functions
function walkLarge(dir, done) {
	let results = []
	fs.readdir(dir, (err, list) => {
		if (err) return done(err);
		let pending = list.length;
		if (!pending) return done(null, results);
		list.forEach(file => {
			file = path.resolve(dir, file);
			fs.stat(file, (err, stat) => {
				if (stat && stat.isDirectory()) {
					walkLarge(file, (err, res) => {
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

function deleteFileLarge(file) {
	console.log(file);
	fs.unlink(file, err => {
		if (err) return console.log(err);// Metro.toast.create("Missing permission to delete this file");
		document.getElementById(file).style.display = "none";
	})
}