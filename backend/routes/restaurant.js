const express = require("express");
const Restaurant = require("../models/Restaurant");
const {
  uploadRestaurantImage,
  getRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  updateRestaurantImage,
  deleteRestaurantImage,
  getRestaurantImage 
} = require("../controllers/restaurants");
const {
  checkToken,
  checkRole,
  checkTokenIfExists,
} = require("../middleware/auth");
const router = express.Router();
const upload = require("../middleware/upload")

router.route("/")
  .get(checkTokenIfExists, getRestaurants)
  .post(checkToken, checkRole("restaurantOwner"), createRestaurant);
router.route("/:id")
  .get(checkTokenIfExists, getRestaurant)
  .put(checkToken, checkRole("restaurantOwner"), updateRestaurant)
  .delete(checkToken, checkRole("restaurantOwner"), deleteRestaurant)
router.route("/:id/image")
  .get(checkTokenIfExists, getRestaurantImage)
  .post(
    checkToken,
    checkRole("restaurantOwner"),
    upload(process.env.MAX_IMAGE_MB_SIZE, ["image/jpeg", "image/png"]),
    uploadRestaurantImage
  )
  .put(
    checkToken,
    checkRole("restaurantOwner"),
    upload(process.env.MAX_IMAGE_MB_SIZE, ["image/jpeg", "image/png"]),
    updateRestaurantImage
  )
  .delete(
    checkToken,
    checkRole("restaurantOwner"),
    deleteRestaurantImage
  );
module.exports = router;
