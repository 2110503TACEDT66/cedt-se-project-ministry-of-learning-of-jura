const mongoose = require("mongoose")
const Reservation = new mongoose.Schema({
    reservorId:{
        type: mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    restaurantId:{
        type: mongoose.Schema.ObjectId,
        ref:"Restaurant",
        required:true
    },
    reservationDate:{
        required: true,
        type: Date,
        required:true
    }
})
module.exports=mongoose.model("Reservation",Reservation)