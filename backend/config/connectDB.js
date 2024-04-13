const mongoose = require("mongoose");
let bucket
exports.connectDB=async ()=>{
    let connection = await mongoose.connect(process.env.MONGO_URI)
    gridFsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db)
    console.log("mongo connected")
}
exports.getGridFsBucket = function () {
    return gridFsBucket;
}