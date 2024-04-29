const fs = require("fs");
const path = require("path");
const getEnv = require("./getEnv");
module.exports = (newEnv) => {
  let oldEnv = getEnv();
  newEnv = Object.assign(oldEnv, newEnv);
  fs.writeFileSync(
    path.join(__dirname, "./env.json"),
    JSON.stringify(newEnv, null, 2),
    (err) => {
      console.log("Error!", e);
    },
  );
};
