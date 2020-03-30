const fs = require("fs");

function test() {
  fs.writeFileSync("test.txt", "this is a test", "utf8");
}