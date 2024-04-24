import File from "./File"
import { timeRegex, invalidTimeMsg } from "../config/constants";
import {ReservationModel, Reservation} from "./Reservation";
import Discount from "./Discount"
import { Ref, getModelForClass, pre, prop } from "@typegoose/typegoose";
import {User} from "./User";

class ReservationPeriod{
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

class Menu{
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
    type: [Menu],
    default: []
  })
  public menus!: [Menu]

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
    default: [],
    _id: true
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
    type: [ReservationPeriod],
    required: true
  })
  public reservationPeriods!: [ReservationPeriod]

  @prop({
    ref: "Reservation",
    localField: "_id",
    foreignField: "restaurantId",
    justOne: false,
  })
  public reservations?: Ref<Reservation>;
}
export const RestaurantModel = getModelForClass(Restaurant);