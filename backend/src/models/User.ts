import type { InferSchemaType, ObjectId } from "mongoose";

import mongoose from "mongoose"
import bcrypt from "bcrypt"
import validator from "email-validator"
import {ReservationModel} from "./Reservation"
import { buildSchema, getModelForClass, pre, prop, queryMethod } from "@typegoose/typegoose";
import { Restaurant } from "./Restaurant";

export enum UserType{
  User="user",
  RestaurantOwner="restaurantOwner"
}

@pre<User>("save",async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
})

@pre<User>("deleteOne", async function (next) {
  await ReservationModel.deleteMany({
    reservorId: this._id
  });
  next()
},{
  document: true,
  query: false
})
export class User {
  @prop({
    required: [true, "no username provided"],
    match: [/^[a-zA-Z0-9]+$/, "this username isn't allowed, username must be composed of only alphabets or numbers"],
    unique: true
  })
  public username!: string

  @prop({
    required: [true, "no email provided"],
    validate: [validator.validate, "not a valid email"],
    unique: true
  })
  public email!: string;

  @prop({
    enum: UserType,
    default: UserType.User,
    required: true
  })
  public role!: UserType;

  @prop({
    required: [true, "no password provided"],
    minLength: 7,
    select: false
  })
  public password!: string

  @prop({
    default: Date.now,
    required: true
  })
  public joinedAt!: Date

  @prop({
    type: [String],
    default: []
  })
  public phone!: [string]

  @prop({
    default: 0
  })
  public karma!: number

  @prop({
    default:0
  })
  public point!: number

  @prop({
    required:true
  })
  public _id!: mongoose.Types.ObjectId

  async matchPassword(inputPassword:string) {
    // console.log(inputPassword,this.password)
    return await bcrypt.compare(inputPassword, this.password);
  }

  isOwner(restaurant: Restaurant) {
    return restaurant.restaurantOwner._id.equals(this._id);
  }
}

// const UserSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: [true, "no username provided"],
//     match: [/^[a-zA-Z0-9]+$/, "this username isn't allowed, username must be composed of only alphabets or numbers"],
//     unique: true
//   },
//   email: {
//     type: String,
//     required: [true, "no email provided"],
//     validate: [validator.validate, "not a valid email"],
//     unique: true
//   },
//   role: {
//     type: String,
//     enum: ['user', 'restaurantOwner'],
//     default: "user",
//     required: true
//   },
//   password: {
//     type: String,
//     required: [true, "no password provided"],
//     minLength: 7,
//     select: false
//   },
//   joinedAt: {
//     type: Date,
//     default: Date.now,
//     required: true
//   },
//   phone: {
//     type: [String]
//   }
// },{_id:false})
// UserSchema.pre("save", async function (next) {
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// })
// UserSchema.methods.matchPassword = async function (inputPassword:string) {
//   // console.log(inputPassword,this.password)
//   return await bcrypt.compare(inputPassword, this.password);
// }
// UserSchema.pre("deleteOne", {
//   document: true,
//   query: false
// }, async function (next) {
//   await Reservation.deleteMany({
//     reservorId: this._id
//   });
//   next()
// })
// export type User = InferSchemaType<typeof UserSchema> & {_id:mongoose.ObjectId};
// let UserSchema = buildSchema(User);
// export default mongoose.model('User', UserSchema);
// export default getModelForClass(User);
export const UserModel = getModelForClass(User);