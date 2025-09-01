const os = require("os");
const path = require("path");

const osu = require("node-os-utils");
const systeminformation = require("systeminformation");

const buildData = require(path.join("..", "..", "data.json"));
const package = require(path.join("..", "..", "package.json"));

// Set version number
document.getElementById("version").innerHTML = `<i class="fa fa-code fa-fw"></i> ${buildData.type}${package.version} build ${buildData.build}`;

// Set height
document.getElementById("page-wrapper").style.height = `${Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)}px`;

updateStats();
setInterval(updateStats, 1000);


async function updateStats() {
	// Get stats
	let cpu = await systeminformation.cpu();
	let drive = await osu.drive.info();
	let memUsage = await osu.mem.info();
	let cpuUsage = await osu.cpu.usage();
	let diskUsage = await osu.drive.info();

	// Set stats
	document.getElementById("stat-ram").innerHTML = `${Math.round(os.totalmem() / 1024 / 1024 / 1024 * 100) / 100} GB`;
	document.getElementById("stat-cpu").innerHTML = `${cpu.cores} cores @ ${cpu.speedmax} GHz<br>`;
	document.getElementById("stat-storage").innerHTML = `${drive.totalGb} GB`;
	document.getElementById("stat-user").innerHTML = require("os").userInfo().username;

	document.getElementById("usage-ram").innerHTML = `${Math.round((100 - memUsage.freeMemPercentage) * 100) / 100}%`;
	document.getElementById("usage-cpu").innerHTML = `${cpuUsage}%`;
	document.getElementById("usage-storage").innerHTML = `${diskUsage.usedPercentage}%`;
	document.getElementById("usage-user").innerHTML = timeConvert(os.uptime());
}

function timeConvert(input) {
	if (input > 60 * 60 * 24) {
		let days = Math.floor(input / 60 / 60 / 24);
		let hours = Math.floor((input - (days * 60 * 60 * 24)) / 60 / 60);
		return `${days}d ${hours}h`;
	} else if (input > 60 * 60) {
		let hours = Math.floor(input / 60 / 60);
		let minutes = Math.floor((input - (hours * 60 * 60)) / 60);
		return `${hours}h ${minutes}m`;
	} else {
		let minutes = Math.floor(input / 60);
		let seconds = Math.floor(input - (minutes * 60));
		return `${minutes}m ${seconds}s`;
	}
}