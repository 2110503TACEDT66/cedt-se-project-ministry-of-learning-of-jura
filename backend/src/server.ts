import express from "express"
import cookieParser from "cookie-parser";
import restaurantRoute from "./routes/restaurant"
import authRoute from "./routes/auth"
import { connectDB } from "./config/connectDB";
import reservationRouter from "./routes/reservation";
import cors from 'cors'
import redeem from "./routes/redeem"
import env from "./config/env";
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
app.use("/api/v1/redeem",redeem);
app.listen(env.PORT);