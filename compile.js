const fs = require("fs");
let data = JSON.parse(fs.readFileSync("data.json", "utf8"));
data.build++;
fs.writeFileSync("data.json", JSON.stringify(data), "utf8");