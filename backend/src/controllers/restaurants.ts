import { Restaurant, RestaurantModel } from "../models/Restaurant";
import { getGridFsBucket } from "../config/connectDB";
import mongoose, { ObjectId } from "mongoose";
import { Readable } from "stream";
import File from "../models/File";
import { Request, Response, NextFunction } from "express";
import { UserType } from "../models/User";
import filterKeyAllDepth from "../utils/filterKeyAllDepth";
import Discount from "../models/Discount";
import { isDocument, isDocumentArray } from "@typegoose/typegoose";
import validUpdateDiscounts from "../utils/validUpdateDiscounts";

//@desc   : Get all restaurants
//@route  : GET /api/v1/restaurants
//@access : Public
export async function getRestaurants(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let query;
  const reqQuery = { ...req.query };
  const removeFields = ["select", "sort", "page", "limit"];
  removeFields.forEach((params) => delete reqQuery[params]);

  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in|regex)\b/g,
    (match) => `$${match}`,
  );
  query = RestaurantModel.find(JSON.parse(queryStr));

  if (req.user != undefined) {
    let populateQuery: {
      path: string;
      match?: {
        reservorId: ObjectId;
      };
    } = {
      path: "reservations",
    };
    if (req.user.role != UserType.RestaurantOwner) {
      populateQuery.match = {
        reservorId: req.user._id,
      };
    }
    // console.log(populateQuery);
    query = query.populate(populateQuery);
  }

  if (req.query.select) {
    req.query.select = req.query.select as string;
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }
  query = query.select("+restaurantOwner");

  if (req.query.sort) {
    req.query.sort = req.query.select as string;
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("name");
  }

  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 3;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  try {
    const total = await RestaurantModel.countDocuments(query);
    query = query.skip(startIndex).limit(limit);
    let result = await query;

    let resultWithIsOwner = result.map((restaurant) => {
      let reservations = restaurant.reservations
      let { restaurantOwner, reservations: _, ...rest } = restaurant.toJSON();
      const isOwner = req.user?._id.equals(restaurantOwner);
      if (req.user?.role == UserType.RestaurantOwner && isDocumentArray(reservations!) && !isOwner) {
        reservations = [];
      }
      return {
        ...rest,
        reservations,
        isOwner: isOwner,
      };
    });

    const pagination: {
      limit: number;
      total: number;
      next?: {
        page: number;
      };
      prev?: {
        page: number;
      };
    } = { limit, total };

    if (endIndex < total) {
      pagination.next = { page: page + 1 };
    }

    if (startIndex > 0) {
      pagination.prev = { page: page - 1 };
    }

    res.status(200).json({
      success: true,
      count: result.length,
      pagination,
      data: resultWithIsOwner,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
}

//@desc   : Get a restaurant
//@route  : GET /api/v1/restaurants/:id
//@access : Public
export async function getRestaurant(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    let restaurant = await RestaurantModel.findById(req.params.id).select(
      "restaurantOwner",
    );
    if (restaurant == undefined) {
      return res.status(404).json({ success: false });
    }
    let query = RestaurantModel.findById(req.params.id);
    if (req.user != undefined) {
      let populateQuery: {
        path: string;
        match?: {
          reservorId: string;
        };
      } = {
        path: "reservations",
      };
      if (
        req.user.role != UserType.RestaurantOwner ||
        !req.user.isOwner(restaurant)
      ) {
        populateQuery.match = {
          reservorId: req.user._id.toString(),
        };
      }
      // console.log(populateQuery);
      query = query.populate(populateQuery);
    }

    const reservationsJson = (await query)?.toObject({depopulate: false,virtuals:true});
    if (isDocumentArray(reservationsJson?.reservations)) {
      // const reservations = reservationsJson.reservations
      const { reservations, ...rest } = reservationsJson

      const result = {
        ...rest,
        reservations
      }
      if (!restaurant) {
        return res.status(404).json({ success: false, message: "Not found" });
      }
      return res.status(200).json({
        success: true,
        data: result,
      });
    }
    res.status(200).json({
      success: true,
      data: reservationsJson,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Not valid ID" });
  }
}

//@desc   : Create a restaurant
//@route  : POST /api/v1/restaurantss
//@access : Private
export async function createRestaurant(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const restaurantOwner = req.user!._id;
    const {
      name,
      address,
      menus,
      openingHours,
      closingHours,
      discounts,
      tags,
      reserverCapacity,
      reservationPeriods,
      rooms,
    } = req.body;
    const requestRestaurant: Omit<Restaurant, "_id"> = {
      name,
      address,
      menus,
      openingHours,
      closingHours,
      discounts,
      tags,
      reserverCapacity,
      reservationPeriods,
      restaurantOwner,
      rooms,
    };
    const restaurant = await RestaurantModel.create(requestRestaurant);
    res.status(201).json({ success: true, data: restaurant });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: "restaurant with this name already exists",
    });
  }
}

//@desc   : Update a restaurant
//@route  : PUT /api/v1/restaurantss/:id
//@access : Private
export async function updateRestaurant(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const restaurant = await RestaurantModel.findOne({
      _id: req.params.id,
    }).select("restaurantOwner discounts");
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: `Not found restaurant with id ${req.params.id}`,
      });
    }
    if (!req.user!.isOwner(restaurant)) {
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized" });
    }

    const {
      name,
      discounts: requestDiscounts,
      address,
      menus,
      openingHours,
      closingHours,
      tags,
      reserverCapacity,
      reservationPeriods,
      rooms,
    } = req.body;
    let updateDiscounts: any = {};
    if (requestDiscounts != undefined) {
      for (let indexStr in requestDiscounts) {
        let index = parseInt(indexStr);
        if (index >= restaurant.discounts.length) {
          const { name, description, points, isValid } =
            requestDiscounts[indexStr];
          updateDiscounts["discounts." + index] = {
            name,
            description,
            points,
            isValid,
          };
          // continue;
        } else if (restaurant.discounts[index].isValid) {
          const { isValid } = requestDiscounts[indexStr];
          updateDiscounts["discounts." + index + ".isValid"] = isValid;
        }
      }
    }
    if (!validUpdateDiscounts(updateDiscounts, restaurant.discounts.length)) {
      return res
        .status(400)
        .json({ success: false, message: "invalid discounts" });
    }
    const updatedRestaurant = await RestaurantModel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        address,
        menus,
        openingHours,
        closingHours,
        tags,
        reserverCapacity,
        reservationPeriods,
        rooms,
        $set: updateDiscounts,
      },
      { new: true, runValidators: true },
    );
    res.status(200).json({ success: true, data: updatedRestaurant });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: "Not valid ID" });
  }
}

//@desc   : Delete a restaurant
//@route  : DELETE /api/v1/restaurantss/:id
//@access : Private
export async function deleteRestaurant(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    let restaurant;
    if (req.params.id) {
      restaurant = await RestaurantModel.findById(req.params.id).select(
        "restaurantOwner",
      );
    }

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: `Not found restaurant with id ${req.params.id}`,
      });
    }
    if (!req.user!.isOwner(restaurant)) {
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized" });
    }
    await restaurant.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: "Not valid ID" });
  }
}

export async function uploadRestaurantImage(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    let restaurant = await RestaurantModel.findById(req.params.id).select(
      "restaurantOwner",
    );
    if (restaurant == undefined) {
      return res.status(404).json({
        success: false,
        message: "cannot find restaurant with id " + req.params.id,
      });
    }
    if (!req.user!.isOwner(restaurant)) {
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized" });
    }
    let file = await File.findOne({ filename: restaurant.id });
    if (req.file == undefined) {
      return res
        .status(400)
        .json({ success: false, message: "invalid file attached" });
    }
    if (file != undefined) {
      await file.deleteOne();
      // return res.status(404).json({success:false,message:"restaurant already has image"})
    }
    let bucket = getGridFsBucket();
    let uploadStream = bucket!.openUploadStream(restaurant.id, {
      metadata: {
        contentType: req.file.mimetype,
      },
    });
    let fileStream = Readable.from(req.file.buffer);
    const stream = fileStream.pipe(uploadStream)
    stream.on("finish", () => {
      res.status(200).json({ success: true });
    })
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "restaurant already has image" });
  }
}

// export async function updateRestaurantImage(req: Request,res: Response,next: NextFunction) => {
//   try {
//     let restaurant = await RestaurantModel.findById(req.params.id).select(
//       "restaurantOwner"
//     );
//     let file = await File.findOne({ filename: req.params.id });
//     if (restaurant == undefined) {
//       return res.status(404).json({
//         success: false,
//         message: "cannot find restaurant with id " + req.params.id,
//       });
//     }
//     if (!req.user._id.equals(restaurant.restaurantOwner)) {
//       // console.log(restaurant.restaurantOwner);
//       // console.log(req.user._id);
//       return res
//         .status(401)
//         .json({ success: false, message: "Not Authorized" });
//     }
//     if (!file) {
//       return res.status(404).json({
//         success: false,
//         message: "cannot find image file with id " + req.params.id,
//       });
//     }
//     // console.log(req.user._id);
//     // let deleter = await File.findOneAndDelete({ filename: req.params.id });
//     await file.deleteOne();
//     let bucket = getGridFsBucket();
//     let uploadStream = bucket.openUploadStream(restaurant.id, {
//       metadata: {
//         contentType: req.file.mimetype,
//       },
//     });
//     let fileStream = Readable.from(req.file.buffer);
//     fileStream.pipe(uploadStream);
//     res.status(200).json({ success: true });
//   } catch (err) {
//     console.log(err);
//     res
//       .status(400)
//       .json({ success: false, message: "restaurant already has image" });
//   }
// };

export async function deleteRestaurantImage(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    let restaurant = await RestaurantModel.findById(req.params.id).select(
      "restaurantOwner",
    );
    if (restaurant == undefined) {
      return res.status(404).json({
        success: false,
        message: "cannot find restaurant with id " + req.params.id,
      });
    }
    if (!req.user!.isOwner(restaurant)) {
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized" });
    }
    let file = await File.findOne({ filename: restaurant.id });
    if (file == undefined) {
      return res
        .status(404)
        .json({ success: false, message: "restaurant has no image" });
    }
    let bucket = getGridFsBucket();
    await bucket!.delete(file._id);
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: "An error occured" });
  }
}

//@desc   : Get image of a restaurant
//@route  : GET /api/v1/restaurantss/:id/image
//@access : Public
export async function getRestaurantImage(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const restaurant = await RestaurantModel.findById(req.params.id).select(
      "restaurantOwner",
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Cannot find restaurant with id " + req.params.id,
      });
    }

    const bucket = getGridFsBucket();
    const downloadStream = bucket!.openDownloadStreamByName(
      req.params.id,
    );
    downloadStream.on("error", (err) => {
      console.log(err);
      res.status(404).json({
        success: false,
        message: "This restaurant has no images",
      });
    });

    downloadStream.pipe(res);
  } catch (err) {
    // console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
