import mongoose, { ObjectId } from "mongoose";
import Discount from "./Discount"
import { Ref, buildSchema, getModelForClass, prop } from "@typegoose/typegoose";
import { User } from "./User";
import {Restaurant} from "./Restaurant"
import ReservationPeriod from "./ReservationPeriod";

export class Reservation {
    @prop({
        ref:"User",
        required:true
    })
    public reservorId!: Ref<User>

    @prop({
        ref:"Restaurant",
        required:true
    })
    public restaurantId!: Ref<Restaurant>;

    @prop({
        required:true
    })
    public reservationDate!: Date

    @prop({
        required: false,
    })
    public discountIndex?: number

    @prop({
        required: true,
        default: false
    })
    public welcomeDrink?: Boolean

    @prop({
        required: true,
        _id: false
    })
    public reservationPeriod!: ReservationPeriod

    @prop({
        required: true,
        default: false
    })
    public isConfirmed?: Boolean
}

// const ReservationSchema = new mongoose.Schema({
//     reservorId:{
//         type: mongoose.Schema.ObjectId,
//         ref:"User",
//         required:true
//     },
//     restaurantId:{
//         type: mongoose.Schema.ObjectId,
//     },
//     reservationDate:{
//         required: true,
//         type: Date
//     },
//     discount:{
//         required: false,
//         type: Discount
//     },
//     welcomedrink:{
//         required: true,
//         type:Boolean
//     }
// })
// const ReservationSchema = buildSchema(Reservation);
// export default mongoose.model("Reservation",ReservationSchema)
export const ReservationModel = getModelForClass(Reservation);