import mongoose, { ObjectId } from "mongoose";
import Discount from "./Discount"
import { Ref, buildSchema, getModelForClass, prop } from "@typegoose/typegoose";
import { User } from "./User";
import {Restaurant} from "./Restaurant"

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
    public discount?: Discount

    @prop({
        required: true
    })
    public welcomeDrink?: Boolean

    @prop({
        required: true,
        default: false
    })
    public isConfirmed?: Boolean
}

export const ReservationModel = getModelForClass(Reservation);