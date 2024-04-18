const mongoose = require("mongoose");
const { getGridFsBucket } = require("../config/connectDB");

const FilesSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      index: true,
      unique: true,
      required: true,
    },
  },
  {
    collection: "fs.files",
  }
);
FilesSchema.pre(
  "deleteOne",
  {
    document: true,
    query: false,
  },
  async function (next) {
    // console.log(this._id, "qkweoq");
    await getGridFsBucket().delete(this._id);
    // console.log("bro");
    next();
  }
);

FilesSchema.pre(
  "deleteOne",
  {
    document: false,
    query: false,
  },
  async function (next) {
    // console.log("bro2");
    console.log(this._condition);
    let file = await this.model.findOne(this._condition);
    // console.log(file._id + "gg");
    await getGridFsBucket().delete(file._id);
    // console.log("bro");
    next();
  }
);
module.exports = mongoose.model("File", FilesSchema);
