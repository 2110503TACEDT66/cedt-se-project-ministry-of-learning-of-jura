import express from "express"
import { checkToken, checkRole } from "../middleware/auth"
import { getReservations, getReservation, addReservation, updateReservation, deleteReservation } from "../controllers/reservation"
import { UserType } from "../models/User";
const router = express.Router();

router.route("/")
    .get(checkToken,checkRole(UserType.User,UserType.RestaurantOwner),getReservations)
    .post(checkToken,checkRole(UserType.User),addReservation)
router.route("/:id")
    .get(checkToken,getReservation)
    .put(checkToken,checkRole(UserType.User,UserType.RestaurantOwner),updateReservation)
    .delete(checkToken,checkRole(UserType.User,UserType.RestaurantOwner),deleteReservation)
export default router