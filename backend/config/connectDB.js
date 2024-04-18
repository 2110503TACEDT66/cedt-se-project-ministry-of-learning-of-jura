const mongoose = require("mongoose");
let bucket
exports.connectDB=async ()=>{
    await mongoose.connect(process.env.MONGO_URI)
    bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db)
    gridFsBucket=new mongoose.mongo.GridFSBucket(mongoose.connection.db)
    console.log("mongo connected")
}
exports.getBucket=function(){
    return bucket
}
exports.getGridFsBucket=function(){
    return gridFsBucket;
}