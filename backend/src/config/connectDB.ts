import mongoose from "mongoose";
import env from "./env";
let gridFsBucket: mongoose.mongo.GridFSBucket | undefined = undefined;
export async function connectDB() {
  let connection = await mongoose.connect(env.MONGO_URI);
  gridFsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db);
  console.log("mongo connected");
}
export function getGridFsBucket() {
  return gridFsBucket;
}
