const mongoose = require("mongoose")
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
    }
})
module.exports=mongoose.model("Reservation",Reservation)