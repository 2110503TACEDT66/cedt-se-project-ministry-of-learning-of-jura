import express from "express";
import {
  uploadRestaurantImage,
  getRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  deleteRestaurantImage,
  getRestaurantImage
} from "../controllers/restaurants";
import {
  checkToken,
  checkRole,
  checkTokenIfExists,
} from "../middleware/auth";
import upload from "../middleware/upload"
import { UserType } from "../models/User";
import env from "../config/env";
const router = express.Router();

router.route("/")
  .get(checkTokenIfExists, getRestaurants)
  .post(checkToken, checkRole(UserType.RestaurantOwner), createRestaurant);
router.route("/:id")
  .get(checkTokenIfExists, getRestaurant)
  .put(checkToken, checkRole(UserType.RestaurantOwner), updateRestaurant)
  .delete(checkToken, checkRole(UserType.RestaurantOwner), deleteRestaurant)
router.route("/:id/image")
  .get(checkTokenIfExists, getRestaurantImage)
  .post(
    checkToken,
    checkRole(UserType.RestaurantOwner),
    upload(env.MAX_IMAGE_MB_SIZE, ["image/jpeg", "image/png"]),
    uploadRestaurantImage
  )
  // .put(
  //   checkToken,
  //   checkRole(UserType.RestaurantOwner),
  //   upload(process.env.MAX_IMAGE_MB_SIZE, ["image/jpeg", "image/png"]),
  //   updateRestaurantImage
  // )
  .delete(
    checkToken,
    checkRole(UserType.RestaurantOwner),
    deleteRestaurantImage
  );
export default router;
