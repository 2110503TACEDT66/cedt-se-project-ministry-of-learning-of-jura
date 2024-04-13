const express = require("express");
const cookieParser = require("cookie-parser")
const dotenv = require("dotenv");
dotenv.config({
    path:"./config/config.env"
})

const restaurantRoute = require("./routes/restaurant");
const authRoute = require("./routes/auth");
const { connectDB } = require("./config/connectDB");
const reservationRouter = require("./routes/reservation");
const cors = require('cors')
const app = express();

connectDB();

app.use(cors({
    origin: 'http://localhost:3000' // Replace with your frontend's origin
}));
// app.options('*', cors());
app.use(express.json())
app.use(cookieParser());
app.use("/api/v1/restaurants",restaurantRoute);
app.use("/api/v1/auth",authRoute);
app.use("/api/v1/reservations",reservationRouter)
app.listen(process.env.PORT);