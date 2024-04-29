import { Duration } from "typed-duration";
import { User } from "../models/User";
import { Reservation } from "../models/Reservation";
import env from "../config/env";
import { BeAnObject } from "@typegoose/typegoose/lib/types";
import { isDocument, isDocumentArray } from "@typegoose/typegoose";

export default function (populatedUser: User | null) {
  if (populatedUser != undefined && isDocumentArray(populatedUser.reservationHistory)) {
    console.log(JSON.stringify(populatedUser,null,2))
    const reservationHistory = populatedUser.reservationHistory;
    if(populatedUser.lastestChurnDate==undefined){
      return reservationHistory.length!=0;
    }
    const lastestChurnDuration = Duration.milliseconds.of(new Date().getTime() - populatedUser.lastestChurnDate.getTime());
    if(reservationHistory.length==0){
      return false;
    }
    const lastReservationIndex = reservationHistory.length - 1;
    const lastestReservation = reservationHistory[lastReservationIndex];
    const lastestReservationDuration = Duration.milliseconds.of(new Date().getTime() - lastestReservation.reservationDate.getTime());
    const lastestChurnDateVerified = Duration.days.from(lastestChurnDuration) < env.CHURN_DURATION
    const lastestReservationVerified = Duration.days.from(lastestReservationDuration) < env.CHURN_DURATION;
    return lastestChurnDateVerified && lastestReservationVerified;
  }
  return false;
}