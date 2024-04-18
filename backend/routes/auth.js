const express = require("express");
const {register,login,getMe, deleteAccount, logout, superUserLogin} = require("../controllers/auth");
const {checkSuperUserToken, checkToken, checkRole } = require("../middleware/auth");
const router = express.Router();

router.post("/register",checkSuperUserToken,register)
router.post("/login",login)
router.post("/superuser/login",express.text(),superUserLogin)
router.get("/me",checkToken,getMe)
router.get("/logout",logout)
module.exports=router;