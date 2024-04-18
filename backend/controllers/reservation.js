const Reservation = require("../models/Reservation");
const Restaurant = require("../models/Restaurant");

exports.getReservations = async function(req,res,next){
    try{
        const restaurantId = req.body.restaurantId || req.params.restaurantId
        let filterQuery = {};
        if(req.user.role!="restaurantOwner"){
            filterQuery.reservorId=req.user.id
        }
        if(restaurantId){
            filterQuery.restaurantId=restaurantId
        }
        let reservations = await Reservation.find(filterQuery)
        res.status(200).json({
            success:true,
            data:reservations
        })
    }
    catch(err){
        console.log(err.stack)
        res.status(400).json({
            success:false
        })
    }
}

exports.getReservation = async function(req,res,next){
    try{
        let filterQuery = {};
        if(req.user.role!="restaurantOwner"){
            filterQuery.reservorId=req.user.id
        }
        filterQuery._id=req.params.id
        let reservation = await Reservation.findOne(filterQuery)
        res.status(200).json({
            success:true,
            data:reservation
        })
    }
    catch(err){
        console.log(err.stack)
        res.status(400).json({
            success:false
        })
    }
}
exports.addReservation = async function(req,res,next){
    try{
        let {restaurantId,reservationDate,restaurantName,welcomedrink} = req.body;
        const reservorId = req.user.id
        let existingReservations = Reservation.find({reservorId});
        const existingReservationsCount = await Reservation.countDocuments(existingReservations);
        if(existingReservationsCount>=3){
            return res.status(400).json({
                success:false,
                message:"reservations exceeding limits"
            })
        }
        if(!restaurantId && restaurantName){
            const restaurant = await Restaurant.findOne({name:req.body.restaurantName}).select("id")
            console.log(restaurant);
            restaurantId=restaurant.id;
        }
        const reservation = await Reservation.create({
            restaurantId,
            reservorId,
            reservationDate,
            welcomedrink
        })
        res.status(201).json({
            success:true,
            data:reservation
        })
    }
    catch(err){
        console.log(err)
        res.status(400).json({
            success:false
        })
    }
}
exports.updateReservation = async function(req,res,next){
    try{
        delete req.body.reservorId;
        let filterQuery = {
            _id:req.params.id
        };
        if(req.user.role!="restaurantOwner"){
            filterQuery.reservorId=req.user.id;
        }
        const reservation = await Reservation.findOneAndUpdate(
        filterQuery,
        req.body,
        {
            new:true,
        })
        if(!reservation){
            return res.status(400).json({
                success:false,
                message:"reservation not found"
            })
        }
        res.status(200).json({
            success:true,
            data:reservation
        })
    }
    catch(err){
        console.log(err)
        res.status(400).json({
            success:false
        })
    }
}
exports.deleteReservation = async function(req,res,next){
    try{
        const reservation = await Reservation.findById(req.params.id);
        if(!reservation){
            return res.status(404).json({
                success:false
            })
        }
        await reservation.deleteOne();
        return res.status(200).json({
            success:true,
            data:{}
        })
    }
    catch(err){
        console.log(err)
        res.status(400).json({
            success:false
        })
    }
}