import { NextFunction, Request, Response } from "express";
import { Reservation, ReservationModel } from "../models/Reservation";
import { Restaurant, RestaurantModel } from "../models/Restaurant";
import { UserModel } from "../models/User";
import { UserType } from "../models/User";
import { ObjectId, Document } from "mongoose";

export async function getReservations(
    req: Request,
    res: Response,
    next: NextFunction
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
    next: NextFunction
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
    next: NextFunction
) {
    try {
        let {
            restaurantId,
            reservationDate,
            restaurantName,
            discountIndex,
            welcomeDrink,
            reservationPeriod
        } = req.body;
        const reservorId = req.user!._id;
        let existingReservations = ReservationModel.find({ reservorId });
        const existingReservationsCount = await existingReservations.countDocuments(
            existingReservations
        );
        if (existingReservationsCount >= 3) {
            return res.status(400).json({
                success: false,
                message: "reservations exceeding limits",
            });
        }        
        let findRestaurant = restaurantId==undefined?RestaurantModel.findOne({name:restaurantName}):RestaurantModel.findById(restaurantId);
        
        //Implement checking capacity when making a reservation
        const [reservationCount, restaurant] = await Promise.all([
            ReservationModel.countDocuments({
                restaurantId,
                reservationPeriod
            }),
            findRestaurant,
        ]);
        if(restaurant==undefined){
            return res.status(404).json({success:false});
        }
        restaurantId=restaurant?._id;
        const capacity = restaurant?.reserverCapacity;

        if (reservationCount >= capacity!) {
            return res.status(400).json({
                success: false,
                message: `${restaurantName} is full. Please try another restaurant.`,
            });
        }

        if (!restaurant?.reservationPeriods.some((period)=>period.equals(reservationPeriod))){
            return res.status(400).json({success:false,message:"wrong period"})
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
                { runValidators: true }
            );
        }

        const reservation = await ReservationModel.create({
            restaurantId,
            reservorId,
            reservationDate,
            welcomeDrink,
            discountIndex,
            reservationPeriod
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
    next: NextFunction
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
                runValidators: true
            }
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
    next: NextFunction
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
