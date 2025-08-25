const os = require("os");
const osu = require("node-os-utils");

setTimeout(async () => {
	// Set version number
	document.getElementById("version").innerHTML = `alpha ${require("../package.json").version} build ${require("../data.json").build}`;

	// Set stats
	document.getElementById("stat-ram").innerHTML = (Math.round(os.totalmem() / 1024 / 1024 / 1024 * 100) / 100) + " GB";
	osu.mem.info().then(info => {
		document.getElementById("usage-ram").innerHTML = `${100 - info.freeMemPercentage}%`;
	})

	require("systeminformation").cpu().then(data => {
		document.getElementById("stat-cpu").innerHTML = data.cores + " cores @<br>" + data.speedmax + " GHz<br>";
	});

	require("systeminformation").fsSize().then(data => {
		data.forEach(drive => {
			document.getElementById("stat-storage").innerHTML = (Math.round(drive.size / 1024 / 1024 / 1024 * 100) / 100) + " GB";
		})
	});

	document.getElementById("stat-user").innerHTML = require("os").userInfo().username;
})
setInterval(async () => {
	let mem = await osu.mem.info();
	let cpu = await osu.cpu.usage();
	let disk = await osu.drive.info();

	document.getElementById("usage-ram").innerHTML = `${100 - mem.freeMemPercentage}%`;
	document.getElementById("usage-cpu").innerHTML = `${cpu}%`;
	document.getElementById("usage-storage").innerHTML = `${disk.usedPercentage}%`;
	document.getElementById("usage-users").innerHTML = timeConvert(os.uptime());
}, 3000)

function timeConvert(seconds) {
	hours = Math.floor(seconds / 60 / 60);
	minutes = Math.floor((seconds - (hours * 60 * 60)) / 60);
	return `${hours}h ${minutes}m`;
}