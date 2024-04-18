const express = require("express");
const { checkToken, checkRole } = require("../middleware/auth");
const { getReservations, getReservation, addReservation, updateReservation, deleteReservation } = require("../controllers/reservation");
const router = express.Router();

router.route("/")
    .get(checkToken,checkRole("user","restaurantOwner"),getReservations)
    .post(checkToken,addReservation)
router.route("/:id")
    .get(checkToken,getReservation)
    .put(checkToken,checkRole("user","restaurantOwner"),updateReservation)
    .delete(checkToken,checkRole("user","restaurantOwner"),deleteReservation)
module.exports=router