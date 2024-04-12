const mongoose = require("mongoose");
// const Grid = require("gridfs-stream")
// let gfs = undefined;
let gridFsBucket = undefined;
exports.connectDB=async ()=>{
    let connection = await mongoose.connect(process.env.MONGO_URI)
    gridFsBucket=new mongoose.mongo.GridFSBucket(mongoose.connection.db)
    // gfs = Grid(connection,mongoose.mongo);
    // console.log(gfs)
    console.log("mongo connected")
}
exports.getGridFsBucket=function(){
    return gridFsBucket;
}