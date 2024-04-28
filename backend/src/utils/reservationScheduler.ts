import cron from "node-cron";
import { UserModel } from "../models/User";
import { ReservationModel } from "../models/Reservation";
import { KARMA_DEDUCTED_FOR_CANCELLATION, POINTS_DEDUCTED_FOR_CANCELLATION } from "../config/constants";

async function checkAndDecreaseKarmaAndPoints() {
    try {
        const reservations = await ReservationModel.find({
            reservationDate: { $lt: new Date() },
            isConfirmed: false
        });

        for (const reservation of reservations) {
            await UserModel.findByIdAndUpdate(reservation.reservorId, { $inc: { point: POINTS_DEDUCTED_FOR_CANCELLATION } });
            await UserModel.findByIdAndUpdate(reservation.reservorId, { $inc: { karma: KARMA_DEDUCTED_FOR_CANCELLATION } });
            await ReservationModel.findByIdAndDelete(reservation._id);
        }

    } catch (error) {
        console.error("Error while checking and decreasing karma and points:", error);
    }
}

cron.schedule("0 0 * * *", () => {
    checkAndDecreaseKarmaAndPoints();
});