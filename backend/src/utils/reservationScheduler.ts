import cron from "node-cron";
import { UserModel } from "../models/User";
import { ReservationModel } from "../models/Reservation";
import { KARMA_DEDUCTED_FOR_CANCELLATION, POINTS_DEDUCTED_FOR_CANCELLATION } from "../config/constants";

async function checkAndDecreaseKarmaAndPoints() {
  try {
    const currentDayOfMonth = new Date().getDate()
    const yesterdayDate  = new Date(new Date().setDate(currentDayOfMonth - 1))
    yesterdayDate.setUTCHours(0,0,0,0);
    const reservations = await ReservationModel.find({
      reservationDate: { $lt: yesterdayDate.toISOString() },
      isConfirmed: false
    });
    for (const reservation of reservations) {
      await UserModel.findByIdAndUpdate(reservation.reservorId, {
        $inc: {
           point: POINTS_DEDUCTED_FOR_CANCELLATION, 
           karma: KARMA_DEDUCTED_FOR_CANCELLATION 
          } 
        }
      );
      await ReservationModel.findByIdAndDelete(reservation._id);
    }

  } catch (error) {
    console.error("Error while checking and decreasing karma and points:", error);
  }
}

export default cron.schedule("0 0 * * *", () => {
  checkAndDecreaseKarmaAndPoints();
}, {
  scheduled: true,
  timezone: "Asia/Bangkok"
});