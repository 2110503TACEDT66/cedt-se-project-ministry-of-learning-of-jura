const File = require("./File");
const mongoose = require("mongoose");
const { timeRegex, invalidTimeMsg } = require("../config/constants");
const Reservation = require("./Reservation");
const Discount = require("./Discount")

const Restaurant = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minLength: 1,
    },
    address: {
      type: String,
      unique: true,
      required: true,
    },
    menus: {
      type: [{
        name: {
          type: String,
          required: true
        },
        price: {
          type: Number,
          required: true
        }
      }],
      default: []
    },
    openingHours: {
      type: String,
      match: [timeRegex, invalidTimeMsg],
      required: true
    },
    closingHours: {
      type: String,
      match: [timeRegex, invalidTimeMsg],
      required: true
    },
    restaurantOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      select: false
    },
    discounts: {
      type: [Discount],
      default: []
    },
    tags: {
      type: [String],
      required: true
    },
    reserverCapacity: {
      type: Number,
      min: 0,
      required: true,
    },
    reservationPeriods: {
      type: [
        {
          _id: false,
          start: {
            type: String,
            match: [timeRegex, invalidTimeMsg],
            required: true,
          },
          end: {
            type: String,
            match: [timeRegex, invalidTimeMsg],
            required: true,
          },
        },
      ],
      required: true,
      validate: (array) => array.length >= 1,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
Restaurant.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    await Reservation.deleteMany({
      restaurantId: this._id,
    });
    await File.deleteOne({
      filename: this._id,
    });
    next();
  }
);
Restaurant.pre(
  "deleteOne",
  { document: false, query: false },
  async function (next) {
    let restaurant = await Restaurant.findOne(this._condition)
    if(restaurant==undefined){
      return;
    }
    await Reservation.deleteMany({
      restaurantId: restaurant._id,
    });
    await File.deleteOne({
      filename: restaurant._id,
    });
    next();
  }
);
Restaurant.virtual("reservations", {
  ref: "Reservation",
  localField: "_id",
  foreignField: "restaurantId",
  justOne: false,
});
module.exports = mongoose.model("Restaurant", Restaurant);
