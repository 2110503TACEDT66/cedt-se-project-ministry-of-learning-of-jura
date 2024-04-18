const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("email-validator");
const Reservation = require("./Reservation");
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "no username provided"],
    match: [/^[a-zA-Z0-9]+$/, "this username isn't allowed, username must be composed of only alphabets or numbers"],
    unique: true
  },
  email: {
    type: String,
    required: [true, "no email provided"],
    validate: [validator.validate, "not a valid email"],
    unique: true
  },
  role: {
    type: String,
    enum: ['user', 'restaurantOwner'],
    default: "user",
    required: true
  },
  password: {
    type: String,
    required: [true, "no password provided"],
    minLength: 7,
    select: false
  },
  joinedAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  phone: {
    type: [String]
  }
})
UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
})
UserSchema.methods.matchPassword = async function (inputPassword) {
  // console.log(inputPassword,this.password)
  return await bcrypt.compare(inputPassword, this.password);
}
UserSchema.pre("deleteOne", async function (next) {
  await Reservation.deleteMany({
    reservorId: this._id
  });
  next()
})
module.exports = mongoose.model('User', UserSchema);