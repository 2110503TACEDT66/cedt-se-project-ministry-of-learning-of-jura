const mongoose = require("mongoose");
let bucket;
exports.connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db);
  console.log("mongo connected");
};
exports.getGridFsBucket = function () {
  return bucket;
};
