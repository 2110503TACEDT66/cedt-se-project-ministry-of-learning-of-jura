const express = require("express");
const Restaurant = require("../models/Restaurant");
const upload = require("../middleware/upload");
const {
  uploadRestaurantImage,
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
const upload = require("../middleware/upload")

router.route("/")
    .get(checkTokenIfExists,getRestaurants)
    .post(checkToken, checkRole("restaurantOwner"), createRestaurant);
router.route("/:id")
    .get(checkTokenIfExists,getRestaurant)
    .put(checkToken, checkRole("restaurantOwner"), updateRestaurant)
    .delete(checkToken, checkRole("restaurantOwner"), deleteRestaurant)
router.route("/:id/image")
    .post(
      checkToken, 
      checkRole("restaurantOwner"),
      upload(process.env.MAX_IMAGE_MB_SIZE,["image/jpeg","image/png"]), 
      uploadRestaurantImage
    );
module.exports=router
    .put(
      checkToken,
      checkRole("restaurantOwner"),
      upload(process.env.MAX_IMAGE_MB_SIZE, ["image/jpeg", "image/png"]),
      updateRestaurantImage
    );
module.exports = router;
