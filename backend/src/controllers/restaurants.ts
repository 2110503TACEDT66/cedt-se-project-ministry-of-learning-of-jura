// const { populate } = require('../models/Reservation');
// const RestaurantModel = require('../models/RestaurantModel');
// const { getGridFsBucket } = require('../config/connectDB');
// const mongoose = require("mongoose")
// const { Readable } = require('stream');
// const File = require("../models/File")
import { RestaurantModel } from "../models/Restaurant";
import { getGridFsBucket } from "../config/connectDB";
import mongoose, { ObjectId } from "mongoose";
import {Readable} from "stream";
import File from "../models/File";
import { Request,Response,NextFunction } from "express";
import { UserType } from "../models/User";

//@desc   : Get all restaurants
//@route  : GET /api/v1/restaurant
//@access : Public
export async function getRestaurants(req: Request,res: Response,next: NextFunction){
  let query;
  const reqQuery = { ...req.query };
  const removeFields = ["select", "sort", "page", "limit"];
  removeFields.forEach((params) => delete reqQuery[params]);

  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in|regex)\b/g,
    (match) => `$${match}`
  );
  query = RestaurantModel.find(JSON.parse(queryStr));

  if (req.user!=undefined) {
    let populateQuery:{
      path: string,
      match?: {
        reservorId: ObjectId
      }
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

    const result = await query;

    const pagination:{
      limit: number,
      total: number,
      next?: {
        page: number
      },
      prev?:{
        page: number
      }
    } = { limit, total };

    if (endIndex < total) {
      pagination.next = { page: page + 1 };
    }

    if (startIndex > 0) {
      pagination.prev = { page: page - 1 };
    }

    res
      .status(200)
      .json({ success: true, count: result.length, pagination, data: result });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
};

//@desc   : Get a restaurant
//@route  : GET /api/v1/restaurant/:id
//@access : Public
export async function getRestaurant(req: Request,res: Response,next: NextFunction){
  try {
    let restaurant = await RestaurantModel.findById(req.params.id).select("restaurantOwner");
    if(restaurant==undefined){
      return res.status(404).json({success:false})
    }
    let query = RestaurantModel.findById(req.params.id);
    if (req.user) {
      let populateQuery:{
        path:string,
        match?:{
          reservorId:string
        }
      } = {
        path: 'reservations'
      }
      if (req.user.role != UserType.RestaurantOwner || !restaurant.restaurantOwner.equals(req.user._id)) {
        populateQuery.match = {
          reservorId: req.user._id.toString()
        }
      }
      // console.log(populateQuery);
      query = query.populate(populateQuery)
    }

    const reservationsJson = await query;
    // console.log(restaurant.restaurantOwner)
    // restaurant.reservations=reservationsJson.reservations;
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }
    res.status(200).json({
      success: true,
      data: reservationsJson
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, message: 'Not valid ID' });
  }
};

//@desc   : Create a restaurant
//@route  : POST /api/v1/restaurants
//@access : Private
export async function createRestaurant(req: Request,res: Response,next: NextFunction){
  try {
    req.body.restaurantOwner = req.user!._id;
    const restaurant = await RestaurantModel.create(req.body);
    res.status(201).json({ success: true, data: restaurant });
  }
  catch (err) {
    console.log(err)
    res.status(400).json({
      success: false,
      message: "restaurant with this name already exists"
    })
  }
}

//@desc   : Update a restaurant
//@route  : PUT /api/v1/restaurants/:id
//@access : Private
export async function updateRestaurant(req: Request,res: Response,next: NextFunction){
  try {
    const restaurant = await RestaurantModel.findOne({
      _id: req.params.id,
    }).select("restaurantOwner");;
    if (!restaurant) {
      return res.status(404).json({ success: false, message: `Not found restaurant with id ${req.params.id}` });
    }
    if (!restaurant.restaurantOwner.equals(req.user!._id)) {
      return res.status(401).json({ success: false, message: "Not Authorized" })
    }
    const updatedRestaurant = await RestaurantModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: updatedRestaurant });
  } catch (err) {
    console.log(err)
    res.status(400).json({ success: false, message: 'Not valid ID' });
  }
};

//@desc   : Delete a restaurant
//@route  : DELETE /api/v1/restaurants/:id
//@access : Private
export async function deleteRestaurant(req: Request,res: Response,next: NextFunction){
  try {
    let restaurant
    if (req.params.id) {
      restaurant = await RestaurantModel.findById(req.params.id).select("restaurantOwner");
    }

    if (!restaurant) {
      return res.status(404).json({ success: false, message: `Not found restaurant with id ${req.params.id}` });
    }
    if (!restaurant.restaurantOwner.equals(req.user!._id)) {
      return res.status(401).json({ success: false, message: "Not Authorized" })
    }
    await restaurant.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    console.log(err)
    res.status(400).json({ success: false, message: 'Not valid ID' });
  }
}

export async function uploadRestaurantImage(req: Request,res: Response,next: NextFunction){
  try {
    let restaurant = await RestaurantModel.findById(req.params.id).select("restaurantOwner");
    if (restaurant == undefined) {
      return res.status(404).json({ success: false, message: "cannot find restaurant with id " + req.params.id })
    }
    if (!req.user!._id.equals(restaurant.restaurantOwner)) {
      return res.status(401).json({ success: false, message: "Not Authorized" })
    }
    let file = await File.findOne({ filename: restaurant.id });
    if (file != undefined) {
      await file.deleteOne();
      // return res.status(404).json({success:false,message:"restaurant already has image"})
    }
    if(req.file == undefined){
      return res.status(400).json({success:false,message:"invalid file attached"})
    }
    let bucket = getGridFsBucket()
    let uploadStream = bucket!.openUploadStream(restaurant.id, {
      metadata: {
        contentType: req.file.mimetype
      },
    });
    let fileStream = Readable.from(req.file.buffer);
    fileStream.pipe(uploadStream)
    res.status(200).json({ success: true });
  }
  catch (err) {
    res.status(400).json({ success: false, message: "restaurant already has image" })
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

export async function deleteRestaurantImage(req: Request,res: Response,next: NextFunction){
  try {
    let restaurant = await RestaurantModel.findById(req.params.id).select("restaurantOwner");
    if (restaurant == undefined) {
      return res.status(404).json({ success: false, message: "cannot find restaurant with id " + req.params.id })
    }
    if (!req.user!._id.equals(restaurant.restaurantOwner)) {
      return res.status(401).json({ success: false, message: "Not Authorized" })
    }
    let file = await File.findOne({ filename: restaurant.id });
    if (file == undefined) {
      return res.status(404).json({ success: false, message: "restaurant has no image" })
    }
    let bucket = getGridFsBucket();
    bucket!.delete(file._id);
    res.status(200).json({ success: true });
  }
  catch (err) {
    console.log(err)
    res.status(400).json({ success: false, message: "An error occured" })
  }
}

//@desc   : Get image of a restaurant
//@route  : GET /api/v1/restaurants/:id/image
//@access : Public
export async function getRestaurantImage (req: Request,res: Response,next: NextFunction) {
  try {
    const restaurant = await RestaurantModel.findById(req.params.id).select("restaurantOwner");

    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Cannot find restaurant with id " + req.params.id });
    }

    const bucket = getGridFsBucket()
    const downloadStream = await bucket!.openDownloadStreamByName(req.params.id);
    downloadStream.on('error', (err) => {
      console.log(err);
      res.status(404).json({
        success: false,
        message: "This restaurant has no images"
      });
    });

    downloadStream.pipe(res);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}