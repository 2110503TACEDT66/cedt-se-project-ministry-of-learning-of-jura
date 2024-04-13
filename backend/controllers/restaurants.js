

const { populate } = require('../models/Reservation');
const Restaurant = require('../models/Restaurant');
const { getGridFsBucket } = require('../config/connectDB');
const mongoose = require("mongoose")
const { Readable } = require('stream');
const File = require("../models/File")

//@desc   : Get all restaurants
//@route  : GET /api/v1/restaurant
//@access : Public
exports.getRestaurants = async (req,res,next) => {
    let query;
    const reqQuery = {...req.query};
    const removeFields = ['select','sort','page','limit'];
    removeFields.forEach(params => delete reqQuery[params]);

    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in|regex)\b/g, match => `$${match}`);
    query = Restaurant.find(JSON.parse(queryStr));

    if(req.user){
        let populateQuery = {
            path:'reservations'
        }
        if(req.user.role!="admin"){
            populateQuery.match={
                reservorId: req.user._id
            }
        }
        // console.log(populateQuery);
        query = query.populate(populateQuery)
    }

    if (req.query.select){
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }
    if (req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('name');
    }

    const page = parseInt(req.query.page,10) || 1;
    const limit = parseInt(req.query.limit,10) || 3;
    const startIndex = (page-1) * limit;
    const endIndex = page * limit;

    try {
        const total = await Restaurant.countDocuments(query);
        query = query.skip(startIndex).limit(limit);
        
        const result = await query;

        const pagination = {limit,total};

        if (endIndex < total){
            pagination.next = {page: page+1}
        }

        if (startIndex > 0){
            pagination.prev = {page: page-1}
        }

        res.status(200).json({success: true, count: result.length, pagination, data: result});
    } catch(err) {
        console.log(err)
        res.status(400).json({success: false});
    }
}

//@desc   : Get a restaurant
//@route  : GET /api/v1/restaurant/:id
//@access : Public
exports.getRestaurant = async (req,res,next) => {
    try {
        let restaurant = await Restaurant.findById(req.params.id);
        let query = Restaurant.findById(req.params.id).select("_id");
        if(req.user){
            let populateQuery = {
                path:'reservations'
            }
            if(req.user.role!="restaurantOwner" && !restaurant.restaurantOwner.equals(req.user._id)){
                populateQuery.match={
                    reservorId: req.user._id
                }
            }
            // console.log(populateQuery);
            query = query.populate(populateQuery)
        }

        const reservationsJson = await query;
        restaurant.reservations=reservationsJson.reservations;
        if(!restaurant){
            return res.status(404).json({success: false, message: 'Not found'});
        }
        res.status(200).json({
            success: true,
            data: restaurant
        })
    } catch(err) {
        console.log(err)
        res.status(500).json({success: false, message: 'Not valid ID'});
    }
}

//@desc   : Create a restaurant
//@route  : POST /api/v1/restaurants
//@access : Private
exports.createRestaurant = async (req,res,next) => {
    try{
        req.body.restaurantOwner=req.user._id;
        const restaurant = await Restaurant.create(req.body);
        res.status(201).json({success: true, data: restaurant});
    }
    catch(err){
        console.log(err)
        res.status(400).json({
            success:false,
            message:"restaurant with this name already exists"
        })
    }
}

//@desc   : Update a restaurant
//@route  : PUT /api/v1/restaurants/:id
//@access : Private
exports.updateRestaurant = async (req,res,next) => {
    try {
        const restaurant = await Restaurant.findByIdAndUpdate(req.params.id,req.body);
        if(!restaurant){
            return res.status(404).json({success: false, message: `Not found restaurant with id ${req.params.id}`});
        }
        if(!restaurant.restaurantOwner.equals(req.user._id)){
            return res.status(401).json({success:false,message:"Not Authorized"})
        }
        res.status(200).json({success: true, data: restaurant});
    } catch(err) {
        res.status(400).json({success: false, message: 'Not valid ID'});
    }
}

//@desc   : Delete a restaurant
//@route  : DELETE /api/v1/restaurants/:id
//@access : Private
exports.deleteRestaurant = async (req,res,next) => {
    try {
        let restaurant
        if(req.params.id){
            restaurant = await Restaurant.findById(req.params.id);
        }
        
        if(!restaurant){
            return res.status(404).json({success: false, message: `Not found restaurant with id ${req.params.id}`});
        }
        if(!restaurant.restaurantOwner.equals(req.user._id)){
            return res.status(401).json({success:false,message:"Not Authorized"})
        }
        await restaurant.deleteOne();
        res.status(200).json({success: true, data: {}});
    } catch(err) {
        console.log(err)
        res.status(400).json({success: false, message: 'Not valid ID'});
    }
}

exports.uploadRestaurantImage = async(req,res,next)=>{
    try{
        let restaurant = await Restaurant.findById(req.params.id).select("restaurantOwner");
        if(restaurant==undefined){
            return res.status(404).json({success:false,message:"cannot find restaurant with id "+req.params.id})
        }
        if(!req.user._id.equals(restaurant.restaurantOwner)){
            return res.status(401).json({success:false,message:"Not Authorized"})
        }
        let bucket = getGridFsBucket()
        let uploadStream = bucket.openUploadStream(restaurant.id,{
            metadata:{
                contentType: req.file.mimetype
            },
        });
        let fileStream = Readable.from(req.file.buffer);
        fileStream.pipe(uploadStream)
        res.status(200).json({success:true});
    }
    catch(err){
        res.status(400).json({success:false,message:"restaurant already has image"})
    }
}
