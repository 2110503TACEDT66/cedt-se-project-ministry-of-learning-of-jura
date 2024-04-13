const mongoose = require("mongoose")
const {timeRegex,invalidTimeMsg} = require("../config/constants")
const Reservation = require("./Reservation")
const discount = {
    _id:false,
    name:{
        type: String,
        required:true
    },
    description:{
        type: String,
        required:true
    },
    points: {
        type:Number,
        min: 1,
        max: 500,
        required:true
    }
}
const Restaurant = new mongoose.Schema({
    name:{
        type: String,
        required:true,
        unique: true,
        minLength: 1
    },
    address:{
        type: String,
        unique: true,
        required:true
    },
    menu:{
        type: [String]
    },
    openingHours:{
        type: String,
        match: [timeRegex,invalidTimeMsg]
    },
    closingHours:{
        type: String,
        match: [timeRegex,invalidTimeMsg]
    },
    discounts:{
        type:[discount],
        default: []
    },
    tags:{
        type: [String],
    }
},{
    toJSON: {virtuals:true},
    toObject: {virtuals:true}
})
Restaurant.pre("deleteOne",{document:true, query:false},async function(next){
    await Reservation.deleteMany({
        restaurantId: this._id
    });
    await Files.deleteOne({
        filename: this._id
    });
    next()
})
Restaurant.virtual("reservations",{
    ref:"Reservation",
    localField:"_id",
    foreignField:"restaurantId",
    justOne:false
})
module.exports=mongoose.model("Restaurant",Restaurant)