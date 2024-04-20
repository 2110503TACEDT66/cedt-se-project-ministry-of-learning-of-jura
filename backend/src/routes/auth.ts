import express from "express";
import {register,login,getMe, deleteAccount, logout, superUserLogin} from "../controllers/auth";
import {checkSuperUserToken, checkToken, checkRole } from "../middleware/auth";
const router = express.Router();

router.post("/register",checkSuperUserToken,register)
router.post("/login",login)
router.post("/superuser/login",express.text(),superUserLogin)
router.get("/me",checkToken,getMe)
router.get("/logout",logout)
export default router;