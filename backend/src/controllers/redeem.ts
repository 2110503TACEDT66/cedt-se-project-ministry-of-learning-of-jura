import { NextFunction, Request, Response } from "express";
import { Reservation } from "../models/Reservation";
import env from "../config/env";
import {Duration} from "typed-duration"
import { UserModel } from "../models/User";

export async function redeem(req: Request, res: Response, next: NextFunction){
    if(req.user==undefined){
        throw new Error("Middleware might be broken")
    }
    // console.log(JSON.stringify(req.user,null,2),req.user.reservationHistory)

    let populated = await req.user.populate<{
        reservationHistory: Reservation[]
    }>("reservationHistory");
    let reservationHistory = req.user.reservationHistory;
    let lastReservationIndex = reservationHistory.length-1;
    let lastReservation = populated.reservationHistory[lastReservationIndex];

    let diffMillisecond =  Duration.milliseconds.of(new Date().getTime() - new Date(lastReservation.reservationDate).getTime());
    // console.log(req.user.lastestChurnDate,lastReservation.reservationDate,req.user.lastestChurnDate!=undefined && req.user.lastestChurnDate<lastReservation.reservationDate)
    if(Duration.days.from(diffMillisecond)>=env.CHURN_DURATION && (req.user.lastestChurnDate==undefined || req.user.lastestChurnDate.getTime()<lastReservation.reservationDate.getTime())){
        await UserModel.findByIdAndUpdate(req.user._id,{
            "$inc":{
                point: env.CHURN_POINTS
            },
            "$set":{
                lastestChurnDate: new Date()
            }
        })
        return res.status(200).json({success:true});
    }

    res.status(400).json({success:false})
}