const mongoose = require("mongoose")
const Discount = require("./Discount")

const Reservation = new mongoose.Schema({
    reservorId:{
        type: mongoose.Schema.ObjectId,
        ref:"User"
    },
    restaurantId:{
        type: mongoose.Schema.ObjectId,
        ref:"Restaurant"
    },
    reservationDate:{
        required: true,
        type: Date
    },
    discount:{
        required: false,
        type: Discount
    }
})
module.exports=mongoose.model("Reservation",Reservation)