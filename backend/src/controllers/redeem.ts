import { NextFunction, Request, Response } from "express";
import { Reservation } from "../models/Reservation";
import env from "../config/env";
import {Duration} from "typed-duration"

export async function redeem(req: Request, res: Response, next: NextFunction){
    if(req.user==undefined){
        throw new Error("Middleware might be broken")
    }
    console.log(JSON.stringify(req.user,null,2),req.user.reservationHistory)

    let populated = await req.user.populate<{
        reservationHistory: Reservation[]
    }>("reservationHistory");
    let reservationHistory = req.user.reservationHistory;
    let lastReservationIndex = reservationHistory.length-1;
    let lastReservation = populated.reservationHistory[0];

    let diffMillisecond =  Duration.milliseconds.from(new Date().getTime() - new Date(lastReservation.reservationDate).getTime());

    if(Duration.days.from(diffMillisecond)>=env.CHURN_DURATION){
        req.user.updateOne({
            "$inc":{
                
            }
        })
    }

    res.status(200).json({success:true});
}