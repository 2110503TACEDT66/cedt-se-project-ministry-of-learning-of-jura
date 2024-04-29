import { Router } from "express";
import { canRedeem, redeem } from "../controllers/redeem";
import { checkToken } from "../middleware/auth";
const router = Router();

router.route("/").post(checkToken, redeem).get(checkToken, canRedeem);

export default router;
