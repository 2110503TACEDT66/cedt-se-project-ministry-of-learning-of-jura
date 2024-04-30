import { NextFunction, Request, Response } from "express";
import { Reservation } from "../models/Reservation";
import env from "../config/env";
import { Duration } from "typed-duration";
import { UserModel } from "../models/User";
import redeemable from "../utils/redeemable";
import { isDocument, isDocumentArray } from "@typegoose/typegoose";

export async function redeem(req: Request, res: Response, next: NextFunction) {
  if (req.user == undefined) {
    throw new Error("Middleware might be broken");
  }
  // console.log(JSON.stringify(req.user,null,2),req.user.reservationHistory)

  let populatedUser = await req.user.populate("reservationHistory");
  // let populatedUser = await UserModel.findOne({}).populate("reservationHistory");
  if (redeemable(populatedUser)) {
    await UserModel.findByIdAndUpdate(req.user._id, {
      $inc: {
        point: env.CHURN_POINTS,
      },
      $set: {
        lastestChurnDate: new Date(),
      },
    });
    return res.status(200).json({ success: true });
  }

  res.status(400).json({ success: false });
}

export async function canRedeem(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.user == undefined) {
    throw new Error("Middleware might be broken");
  }
  let populatedUser = await req.user.populate("reservationHistory");
  // let populatedUser = await UserModel.findOne({}).populate("reservationHistory");
  if (redeemable(populatedUser)) {
    return res.status(200).json({ success: true, data: true });
  }

  return res.status(200).json({ success: true, data: false });
}
