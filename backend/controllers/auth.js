const User = require('../models/User');
const Reservation = require('../models/Reservation');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {dayToMilliseconds} = require("../utils/time")

const tokenCookieOptions = {
    maxAge: dayToMilliseconds(process.env.JWT_EXPIRING_DAYS),
    httpOnly: true
}
if(process.env.DEPLOY_MODE=="production"){
    tokenCookieOptions.secure=true;
}
//@desc   : Register User
//@route  : POST /api/v1/auth/register
//@access : Public
exports.register = async (req,res,next) => {
    try {
        const {username, email, password, role} = req.body;
        
        if(role=="admin" && !req.isSuperUser){
            return res.status(400).json({
                success:false,
                message:"not authorized"
            })
        }
        const user = await User.create({username, email, password, role});

        responseWithToken(user,200,res);
    } catch(err) {
        res.status(400).json({success: false});
        console.log(err.stack);
    }
}

//@desc   : Login user
//@route  : POST /api/v1/auth/login
//@access : Public
exports.login = async (req,res,next)=>{
    console.log("login attempt",req.body)
    const {username, email,password} = req.body;
    if ((!username && !email) || !password){
        return res.status(400).json({success: false, msg: 'Please provide an emall and password'});
    }
    let filterQuery = {};
    if(username){
        filterQuery.username=username;
    }
    if(email){
        filterQuery.email=email;
    }

    const user = await User.findOne(filterQuery).select("email password");
    
    if (!user){
        return res.status(400).json({success: false, msg: 'Invalid credentials'});
    }
    
    const isMatch = await user.matchPassword(password);
    if(!isMatch){
        return res.status(401).json({success: false, msg: "Wrong password"});
    }
    responseWithToken(user,200,res)
}

//@desc   : Login superuser
//@route  : POST /api/v1/auth/superuser/login
//@access : Private
exports.superUserLogin = async function(req,res,next){
    const isMatch = await bcrypt.compare(req.body,process.env.SUPERUSER_PASSWORD);
    if(!isMatch){
        return res.status(400).json({
            success:false,
            message:"wrong password"
        })
    }
    const user = {
        superuser: "superuser"
    }
    responseWithTokenSuperUser(user,200,res);
}

//@desc   : logout
//@route  : POST /api/v1/auth/logout
//@access : Private
exports.logout = async function(req,res,next){
    res.status(200).clearCookie("token").json({
        success:true
    })
}

//@desc   : get user data
//@route  : GET /api/v1/auth/me
//@access : Private
exports.getMe = async function(req,res,next){
    if(!req.user){
        return res.status(401).json({
            success: false,
            message: "Token is invalid"
        })
    }
    return res.status(200).json(req.user);
}

//@desc   : delete user account
//@route  : DELETE /api/v1/auth/deleteAccount
//@access : Private
exports.deleteAccount = async function(req,res,next){
    try{
        await User.deleteOne({
            username:req.params.username,
            role:"user"
        });
        res.status(200).json({
            success:true
        })
    }
    catch(err){
        res.status(400).json({
            success:false
        })
    }
}

function responseWithToken(user,statusCode,res){
    const {_id,email,password} = user;
    const signedJwt = jwt.sign({
        id:_id,
        email,
        password
    },process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRING_DAYS+"d"
    });
    res.cookie("token",signedJwt,tokenCookieOptions);
    res.status(statusCode).json({
        success: true,
        token: signedJwt
    })
}

function responseWithTokenSuperUser(superuser,statusCode,res){
    const signedJwt = jwt.sign(superuser,process.env.JWT_SECRET,{
        expiresIn: "1h"
    });
    res.cookie("token",signedJwt,tokenCookieOptions);
    res.status(statusCode).json({
        success: true,
        token: signedJwt
    })
}