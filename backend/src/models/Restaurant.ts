import File from "./File"
import { timeRegex, invalidTimeMsg } from "../config/constants";
import {ReservationModel, Reservation} from "./Reservation";
import Discount from "./Discount"
import { Ref, getModelForClass, pre, prop } from "@typegoose/typegoose";
import {User} from "./User";

class reservationPeriod{
  @prop({
    match: [timeRegex, invalidTimeMsg],
    required: true,
  })
  public start!: string;

  @prop({
    match: [timeRegex, invalidTimeMsg],
    required: true,
  })
  public end!: string
}

class menu{
  @prop({
    required:true
  })
  public name!: string

  @prop({
    required:true,
    min:1
  })
  public price!: number
}

@pre<Restaurant>(
  "deleteOne",
  async function (next) {
    await ReservationModel.deleteMany({
      restaurantId: this._id,
    });
    await File.deleteOne({
      filename: this._id.toString(),
    });
    next();
  },
  { document: true, query: false }
)
export class Restaurant {
  @prop({
    required: true,
    unique: true,
    index: true,
    minlength: 1
  })
  public name!: string

  @prop({
    unique: true,
    required: true,
    minlength: 1
  })
  public address!: string

  @prop({
    type: [menu],
    default: []
  })
  public menus!: [menu]

  @prop({
    required: true,
    match: [timeRegex, invalidTimeMsg]
  })
  public openingHours!: string

  @prop({
    required: true,
    match: [timeRegex, invalidTimeMsg]
  })
  public closingHours!: string

  
  @prop({
    required: true,
    ref: ()=>User,
    select: false,

  })
  public restaurantOwner!: Ref<User>

  @prop({
    type: [Discount],
    default: []
  })
  public discounts!: [Discount]
  
  @prop({
    type: [String],
    required: true,
  })
  public tags!: [string]

  @prop({
    required: true,
    min: 1,
  })
  public reserverCapacity!: number

  @prop({
    _id: false,
    validate: (array: any) => array.length >= 1,
    type: [reservationPeriod],
    required: true
  })
  public reservationPeriods!: [reservationPeriod]

  @prop({
    ref: "Reservation",
    localField: "_id",
    foreignField: "restaurantId",
    justOne: false,
  })
  public reservations?: Ref<Reservation>;
}

// const Restaurant = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       unique: true,
//       minLength: 1,
//     },
//     address: {
//       type: String,
//       unique: true,
//       required: true,
//     },
//     menus: {
//       type: [{
//         name: {
//           type: String,
//           required: true
//         },
//         price: {
//           type: Number,
//           required: true
//         }
//       }],
//       default: []
//     },
//     openingHours: {
//       type: String,
//       match: [timeRegex, invalidTimeMsg],
//       required: true
//     },
//     closingHours: {
//       type: String,
//       match: [timeRegex, invalidTimeMsg],
//       required: true
//     },
//     restaurantOwner: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//       select: false
//     },
//     discounts: {
//       type: [Discount],
//       default: []
//     },
//     tags: {
//       type: [String],
//       required: true
//     },
//     reserverCapacity: {
//       type: Number,
//       min: 0,
//       required: true,
//     },
//     reservationPeriods: {
//       type: [
//         {
//           _id: false,
//           start: {
//             type: String,
//             match: [timeRegex, invalidTimeMsg],
//             required: true,
//           },
//           end: {
//             type: String,
//             match: [timeRegex, invalidTimeMsg],
//             required: true,
//           },
//         },
//       ],
//       required: true,
//       validate: (array: any) => array.length >= 1,
//     },
//   },
//   {
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true },
//   }
// );
// Restaurant.pre(
//   "deleteOne",
//   { document: true, query: false },
//   async function (next) {
//     await Reservation.deleteMany({
//       restaurantId: this._id,
//     });
//     await File.deleteOne({
//       filename: this._id,
//     });
//     next();
//   }
// );
// Restaurant.pre(
//   "deleteOne",
//   { document: false, query: false },
//   async function (next) {
//     let restaurant = await (this as any).model.findOne((this as any)._condition)
//     if(restaurant==undefined){
//       return;
//     }
//     await Reservation.deleteMany({
//       restaurantId: restaurant._id,
//     });
//     await File.deleteOne({
//       filename: restaurant._id,
//     });
//     next();
//   }
// );
// Restaurant.virtual("reservations", {
//   ref: "Reservation",
//   localField: "_id",
//   foreignField: "restaurantId",
//   justOne: false,
// });
// export default mongoose.model("Restaurant", Restaurant);
export const RestaurantModel = getModelForClass(Restaurant);