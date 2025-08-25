const os = require("os");

const osu = require("node-os-utils");
const systeminformation = require("systeminformation");

updateStats();
setInterval(updateStats, 3000)

async function updateStats() {
	// Set stats
	document.getElementById("stat-ram").innerHTML = `${Math.round(os.totalmem() / 1024 / 1024 / 1024 * 100) / 100} GB`;

	let cpu = await systeminformation.cpu();
	document.getElementById("stat-cpu").innerHTML = `${cpu.cores} cores @<br>${cpu.speedmax} GHz<br>`;

	let drive = await osu.drive.info();
	document.getElementById("stat-storage").innerHTML = `${drive.totalGb} GB`;

	document.getElementById("stat-user").innerHTML = require("os").userInfo().username;


	let memUsage = await osu.mem.info();
	let cpuUsage = await osu.cpu.usage();
	let diskUsage = await osu.drive.info();

	document.getElementById("usage-ram").innerHTML = `${100 - memUsage.freeMemPercentage}%`;
	document.getElementById("usage-cpu").innerHTML = `${cpuUsage}%`;
	document.getElementById("usage-storage").innerHTML = `${diskUsage.usedPercentage}%`;
	document.getElementById("usage-users").innerHTML = timeConvert(os.uptime());
}

function timeConvert(seconds) {
	hours = Math.floor(seconds / 60 / 60);
	minutes = Math.floor((seconds - (hours * 60 * 60)) / 60);
	return `${hours}h ${minutes}m`;
}