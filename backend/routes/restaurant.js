const express = require("express");
const Restaurant = require("../models/Restaurant");
const upload = require("../middleware/upload");
const {
  getRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  updateRestaurantImage,
} = require("../controllers/restaurants");
const {
  checkToken,
  checkRole,
  checkTokenIfExists,
} = require("../middleware/auth");
const router = express.Router();

router
  .route("/")
  .get(checkTokenIfExists, getRestaurants)
  .post(checkToken, checkRole("admin"), createRestaurant);
router
  .route("/:id")
  .get(checkTokenIfExists, getRestaurant)
  .put(checkToken, checkRole("admin"), updateRestaurant)
  .delete(checkToken, checkRole("admin"), deleteRestaurant);
router
  .route("/:id/image")
  .put(
    checkToken,
    checkRole("restaurantOwner"),
    upload(process.env.MAX_IMAGE_MB_SIZE, ["image/jpeg", "image/png"]),
    updateRestaurantImage
  );
module.exports = router;
