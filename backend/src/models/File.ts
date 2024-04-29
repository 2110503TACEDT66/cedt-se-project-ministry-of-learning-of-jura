import mongoose from "mongoose";
import { getGridFsBucket } from "../config/connectDB";
import { buildSchema, modelOptions, pre, prop } from "@typegoose/typegoose";

@pre<File>(
  "deleteOne",
  async function (next) {
    await getGridFsBucket()?.delete(this._id);
    next();
  },
  {
    document: true,
    query: false,
  },
)
@modelOptions({ schemaOptions: { collection: "fs.files" } })
class File {
  @prop({
    required: true,
    index: true,
    unique: true,
  })
  public filename!: string;
}

// const FilesSchema = new mongoose.Schema(
//   {
//     filename: {
//       type: String,
//       index: true,
//       unique: true,
//       required: true
//     },
//   },
//   {
//     collection: "fs.files",
//   }
// );

// FilesSchema.pre(
//   "deleteOne",
//   {
//     document: false,
//     query: false
//   },
//   async function (next) {
//     let file = await (this as any).model.findOne((this as any)._condition)
//     await getGridFsBucket()?.delete(file._id);
//     next();
//   }
// );
const FileSchema = buildSchema(File);
export default mongoose.model("File", FileSchema);
