const express = require("express");
const Restaurant = require("../models/Restaurant");
const { getRestaurants, getRestaurant, createRestaurant, updateRestaurant, deleteRestaurant, getRestaurantImage } = require("../controllers/restaurants");
const { checkToken,checkRole,checkTokenIfExists } = require("../middleware/auth");
const router = express.Router();

router.route("/")
    .get(checkTokenIfExists,getRestaurants)
    .post(checkToken, checkRole("admin"), createRestaurant);
router.route("/:id")
    .get(checkTokenIfExists,getRestaurant)
    .put(checkToken, checkRole("admin"), updateRestaurant)
    .delete(checkToken, checkRole("admin"), deleteRestaurant)
router.route("/:id/image")
    .get(checkTokenIfExists, getRestaurantImage)
module.exports=router