import express from "express";
import cookieParser from "cookie-parser";
import restaurantRoute from "./routes/restaurant";
import authRoute from "./routes/auth";
import { connectDB } from "./config/connectDB";
import reservationRouter from "./routes/reservation";
import reservationScheduler from "./utils/reservationScheduler";
import cors from "cors";
import redeem from "./routes/redeem";
import env from "./config/env";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "../swagger/output.json";
export const app = express();

connectDB().then(() => {
  reservationScheduler.start();
});

app.use(
  cors({
    origin: env.FRONTEND,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/restaurants", restaurantRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/reservations", reservationRouter);
app.use("/api/v1/redeem", redeem);
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));
// app.listen(env.PORT);
