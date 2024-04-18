const getEnv = require("./env/getEnv");
const setEnv = require("./env/setEnv");
const path = require("path")
let env = getEnv();
const [_node,_file,...args] = process.argv
let testPath;
if(args.length==1){
    if(path.isAbsolute(args[0])){
        testPath = args[0];
    }
    else{
        testPath = path.join(__dirname,args[0]);
    }
}
else{
    testPath = path.join(__dirname,args.join("/")+".js");
}

const start = require(testPath)
start(env).then(()=>{
    setEnv(env)
})