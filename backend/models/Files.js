const mongoose = require("mongoose");
const { getBucket } = require("../config/connectDB");

const FilesSchema = new mongoose.Schema(
  {
    filename: String,
  },
  {
    collection: "fs.files",
  }
);
FilesSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    await getBucket().delete(this._id);
    next();
  }
);
module.exports = mongoose.model("files", FilesSchema);
