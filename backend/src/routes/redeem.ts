import {Router} from "express";
import { redeem } from "../controllers/redeem";
import { checkToken } from "../middleware/auth";
const router = Router();

router.post("/",checkToken,redeem);

export default router;