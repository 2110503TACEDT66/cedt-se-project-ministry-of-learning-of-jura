import { Duration } from "typed-duration";
import { User } from "../models/User";
import { Reservation } from "../models/Reservation";
import env from "../config/env";
import { BeAnObject } from "@typegoose/typegoose/lib/types";
import { isDocument, isDocumentArray } from "@typegoose/typegoose";

export default function (populatedUser: User | null) {
  if (populatedUser != undefined && isDocumentArray(populatedUser.reservationHistory)) {
    console.log(JSON.stringify(populatedUser,null,2))
    let reservationHistory = populatedUser.reservationHistory;
    let lastReservationIndex = reservationHistory.length - 1;
    let diffMillisecond = Duration.milliseconds.of(new Date().getTime() - new Date(lastReservation.reservationDate).getTime());
    const lastestChurnDateVerified = Duration.days.from(diffMillisecond) >= env.CHURN_DURATION 
    if(lastReservationIndex<0){
      return lastestChurnDateVerified;
    }
    let lastReservation = populatedUser.reservationHistory[lastReservationIndex];

    return lastestChurnDateVerified
    && (
      populatedUser.lastestChurnDate == undefined 
      || populatedUser.lastestChurnDate.getTime() < lastReservation.reservationDate.getTime()
    )
  }
  return false;
}