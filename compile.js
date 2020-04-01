const fs = require("fs");
fs.writeFileSync("build.txt", parseInt(fs.readFileSync("build.txt", "utf8")) + 1, "utf8");