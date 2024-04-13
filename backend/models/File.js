const mongoose = require("mongoose");
const { getGridFsBucket } = require("../config/connectDB");

const FilesSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      index: true,
      unique: true,
      required: true
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
    query: false
  },
  async function (next) {
    console.log(this._id)
    await getGridFsBucket().delete(this._id);
    next();
  }
);

FilesSchema.pre(
  "deleteOne",
  { 
    document: false,
    query: true
  },
  async function (next) {
    let file = await this.model.findOne(this._condition)
    await getGridFsBucket().delete(file._id);
    next();
  }
);
module.exports = mongoose.model("File", FilesSchema);
