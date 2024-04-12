const express = require("express");
const {uploadRestaurantImage,getRestaurants,getRestaurant,createRestaurant,updateRestaurant,deleteRestaurant} = require("../controllers/restaurants");
const { checkToken,checkRole,checkTokenIfExists } = require("../middleware/auth");
const router = express.Router();
const upload = require("../middleware/upload")

router.route("/")
    .get(checkTokenIfExists,getRestaurants)
    .post(checkToken, checkRole("restaurantOwner"), createRestaurant);
router.route("/:id")
    .get(checkTokenIfExists,getRestaurant)
    .put(checkToken, checkRole("restaurantOwner"), updateRestaurant)
    .delete(checkToken, checkRole("restaurantOwner"), deleteRestaurant)
router.route("/:id/image")
    .post(checkToken, checkRole("restaurantOwner"),upload(process.env.MAX_IMAGE_MB_SIZE,["image/jpeg","image/png"]), uploadRestaurantImage);
module.exports=router