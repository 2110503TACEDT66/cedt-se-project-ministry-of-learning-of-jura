const fs = require("fs");
var path = require("path");
module.exports = () => {
  let envJson = fs.readFileSync(path.join(__dirname, "./env.json"));
  let env = JSON.parse(envJson);
  return env;
};
