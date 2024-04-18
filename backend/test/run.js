const getEnv = require("./env/getEnv");
const setEnv = require("./env/setEnv");
const path = require("path")
let env = getEnv();
const [_node,_file,...args] = process.argv
const testPath = args.join("/")+".js";

const start = require(path.join(__dirname,testPath))
start(env).then(()=>{
    setEnv(env)
})