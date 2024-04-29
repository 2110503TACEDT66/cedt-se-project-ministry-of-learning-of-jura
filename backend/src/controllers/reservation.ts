import { NextFunction, Request, Response } from "express";
import { ReservationModel } from "../models/Reservation";
import { Restaurant, RestaurantModel } from "../models/Restaurant";
import { UserModel, UserType } from "../models/User";
import { ObjectId, Document } from "mongoose";
import {
  KARMA_DEDUCTED_FOR_CANCELLATION,
  POINTS_DEDUCTED_FOR_CANCELLATION,
} from "../config/constants";

export async function getReservations(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const restaurantId = req.body.restaurantId || req.params.restaurantId;
    let filterQuery: {
      reservorId?: ObjectId;
      restaurantId?: ObjectId;
    } = {};
    if (req.user!.role != UserType.RestaurantOwner) {
      filterQuery.reservorId = req.user!._id;
    }
    if (restaurantId) {
      filterQuery.restaurantId = restaurantId;
    }
    let reservations = await ReservationModel.find(filterQuery);
    res.status(200).json({
      success: true,
      data: reservations,
    });
  } catch (err: any) {
    console.log(err.stack);
    res.status(400).json({
      success: false,
    });
  }
}

export async function getReservation(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    let filterQuery: {
      _id?: string;
      reservorId?: ObjectId;
    } = {};
    if (req.user!.role != UserType.RestaurantOwner) {
      filterQuery.reservorId = req.user!.id;
    }
    filterQuery._id = req.params.id;
    let reservation = await ReservationModel.findOne(filterQuery);
    res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (err: any) {
    console.log(err.stack);
    res.status(400).json({
      success: false,
    });
  }
}
export async function addReservation(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    let {
      restaurantId,
      reservationDate: reservationDateISOString,
      restaurantName,
      discountIndex,
      welcomeDrink,
      reservationPeriod,
      room,
    } = req.body;
    const reservationDate = new Date(reservationDateISOString);
    reservationDate.setUTCHours(0, 0, 0, 0);
    const reservorId = req.user!._id;
    let existingReservations = ReservationModel.find({
      reservorId,
      isConfirmed: false,
    });
    const existingReservationsCount =
      await existingReservations.countDocuments(existingReservations);
    if (existingReservationsCount >= 3) {
      return res.status(400).json({
        success: false,
        message: "reservations exceeding limits",
      });
    }

    if (restaurantId == undefined && restaurantName != undefined) {
      let restaurantResponse: (Restaurant & Document) | null =
        await RestaurantModel.findOne({
          name: restaurantName,
        });
      restaurantId = restaurantResponse?._id;
    }

    //Implement checking capacity when making a reservation
    const [reservationCount, restaurant] = await Promise.all([
      ReservationModel.countDocuments({
        restaurantId,
        reservationPeriod,
      }),
      RestaurantModel.findOne({ _id: restaurantId }),
    ]);
    if (restaurant == undefined) {
      return res.status(404).json({ success: false });
    }
    restaurantId = restaurant?._id;
    restaurantName = restaurant?.name;
    const capacity = restaurant?.reserverCapacity;

    if (reservationCount >= capacity!) {
      return res.status(400).json({
        success: false,
        message: `${restaurantName} is full. Please try another restaurant.`,
      });
    }

    if (
      !restaurant?.reservationPeriods.some((period) =>
        period.equals(reservationPeriod),
      )
    ) {
      return res.status(400).json({ success: false, message: "wrong period" });
    }

    let pointsToDeduct = 0;
    if (discountIndex != undefined) {
      const restaurant = await RestaurantModel.findById(restaurantId);
      const discount = restaurant!.discounts[discountIndex];
      pointsToDeduct = -discount!.points;
      if (!discount?.isValid) {
        return res.status(400).json({
          success: false,
          message: "This discount is not valid.",
        });
      }
      if (req.user!.point + pointsToDeduct < 0) {
        return res.status(400).json({
          success: false,
          message: "The required points is more than the available points.",
        });
      }
      await UserModel.findByIdAndUpdate(
        req.user!._id,
        { $inc: { point: pointsToDeduct } },
        { runValidators: true },
      );
    }

    const reservation = await ReservationModel.create({
      restaurantId,
      reservorId,
      reservationDate,
      welcomeDrink,
      discountIndex,
      reservationPeriod,
      room,
    });
    res.status(201).json({
      success: true,
      data: reservation,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
    });
  }
}
export async function updateReservation(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    delete req.body.reservorId;
    let filterQuery: any = {
      _id: req.params.id,
    };
    if (req.user!.role != UserType.RestaurantOwner) {
      filterQuery.reservorId = req.user!.id;
    }
    const reservation = await ReservationModel.findOneAndUpdate(
      filterQuery,
      req.body,
      {
        new: true,
      },
    );
    if (!reservation) {
      return res.status(400).json({
        success: false,
        message: "reservation not found",
      });
    }
    res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
    });
  }
}
export async function deleteReservation(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const reservation = await ReservationModel.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({
        success: false,
      });
    }
    await reservation.deleteOne();
    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
    });
  }
}

export async function confirmReservation(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    console.log(req.params);
    const reservation = await ReservationModel.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({
        success: false,
      });
    }
    const restaurant = await RestaurantModel.findById(
      reservation.restaurantId,
    ).select("restaurantOwner");
    if (restaurant == undefined) {
      return res.status(404).json({
        success: false,
        message: "cannot find restaurant with id " + req.params.id,
      });
    }
    if (!req.user!.isOwner(restaurant)) {
      return res.status(401).json({
        success: false,
        message: "User is not the owner of this restaurant",
      });
    }
    if (reservation.isConfirmed) {
      return res.status(400).json({
        success: false,
        message: "reservation already confirmed",
      });
    }
    const reserver = await UserModel.findById(reservation.reservorId);
    if (!reserver) {
      return res.status(404).json({
        success: false,
        message: "Cannot find user with id " + reservation.reservorId,
      });
    }

    reservation.isConfirmed = true;
    reserver.reservationHistory.push(reservation);
    if (reserver.reservationHistory.length > 10) {
      reserver.reservationHistory.shift();
    }

    console.log(reserver);

    const session = await ReservationModel.startSession();
    session.startTransaction();
    try {
      await reservation.save({ session });
      await reserver.save({ session });
      await session.commitTransaction();
      session.endSession();
      // await ReservationModel.findByIdAndDelete(reservation._id);
      return res.status(200).json({
        success: true,
        data: reservation,
      });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.log(err);
      return res.status(400).json({
        success: false,
        message: "An error occurred while confirming the reservation.",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: "An error occurred while confirming the reservation.",
    });
  }
}
