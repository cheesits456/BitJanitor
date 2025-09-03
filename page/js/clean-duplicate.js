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
	document.getElementById("button-scan").setAttribute("onClick", "Metro.toast.create('There is already a scan in progress')");
	stats = 0;
	const dir = document.getElementById("search-dir").value;
	let hashes = {};

	document.getElementById("status").innerHTML = `<span class="text-medium">Scanning . . .</span>`;
	document.getElementById("step1").innerHTML = "<br><span class='text-medium'>Step 1/3:</span> Building file list [0 files found]";
	document.getElementById("step2").innerHTML = "";
	document.getElementById("step3").innerHTML = "";

	walk(dir, async function (err, results) {
		if (err) throw err;

		document.getElementById("progress").style.height = "auto";
		document.getElementById("step2").innerHTML = "<span class='text-medium'>Step 2/3:</span> Calculating file hashes [0%]";
		document.getElementById("configuration").style.height = `${document.getElementById("progress").offsetHeight}px`
		stats = 0;
		results.remove(undefined);

		for (const file of results) {
			const hash = await fileHash(file);
			if (hash !== "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855") {
				if (!hashes[hash]) hashes[hash] = [];
				hashes[hash].push(file);
			};
			document.getElementById("step2").innerHTML = `<span class='text-medium'>Step 2/3:</span> Calculating file hashes [${Math.round(++stats / results.length * 10000) / 100}%]`;
		}

		document.getElementById("step3").innerHTML = "<span class='text-medium'>Step 3/3:</span> Checking for duplicates";
		document.getElementById("configuration").style.height = `${document.getElementById("progress").offsetHeight}px`;

		let res = [];
		for (const files of Object.values(hashes)) {
			if (files.length > 1) {
				let push = [];
				for (const file of files) {
					const fileSize = fs.statSync(file).size;
					push.push(`
						<tr id="${file}">
							<td><i class="fa fa-trash fa-fw fg-red pointer-cursor" onClick="deleteFile('${file.replace(/\\/g, "\\\\")}')"></i> ${file}</td>
							<td>${(Math.round((fileSize / 1000000) * 100) / 100).toLocaleString()} MB</td>
						</tr>
					`);
				}

				await setTimeout(() => {
					res.push(`<div>${push.join("")}</div>`);
					document.getElementById("results").innerHTML = `
						<div class="table-responsive">
							<table class="table table-striped">
								<thead class="default-cursor" style="font-weight:bold">
									<tr>
										<td>File path</td>
										<td>Size</td>
									</tr>
								</thead>
								<tbody id="results">
									${res.join("")}
								</tbody>
							</table>
						</div>
					`;
				}, 100);
			}
		}
		document.getElementById("button-scan").setAttribute("onClick", "scan()");
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

function fileHash(filename, algorithm = "sha256") {
	return new Promise((resolve, reject) => {
		let shasum = require("crypto").createHash(algorithm);
		try {
			let s = fs.ReadStream(filename)
			s.on('data', function (data) {
				shasum.update(data)
			})
			// making digest
			s.on('end', function () {
				const hash = shasum.digest('hex')
				return resolve(hash);
			})
			s.on("error", () => { })
		} catch (error) {
		}
	});
}

function deleteFile(file) {
	console.log(file);
	fs.unlink(file, err => {
		if (err) return alert(err);
		document.getElementById(file).remove();
	})
}