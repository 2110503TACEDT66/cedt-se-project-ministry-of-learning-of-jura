import { NextFunction, Request, Response } from "express";
import { UserType } from "../models/User";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/User";
import env from "../config/env";

export async function checkSuperUserToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let token = getTokenFromReq(req);
  if (token == null) {
    return next();
  }
  try {
    const decoded: any = jwt.verify(token, env.JWT_SECRET);
    if (decoded.superuser == "superuser") {
      req.isSuperUser = true;
    }
  } catch (err) {
    // console.log(err)
  } finally {
    next();
  }
}
export async function checkTokenIfExists(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let token = getTokenFromReq(req);
  if (token == null) {
    return next();
  }
  try {
    const decoded: any = jwt.verify(token, env.JWT_SECRET);
    const user = await UserModel.findById(decoded.id);
    req.user = user;
  } catch (err) {
    console.log(err);
  } finally {
    next();
  }
}
export async function checkToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let token = getTokenFromReq(req);
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorize to access this route" });
  }

  try {
    const decoded: any = jwt.verify(token, env.JWT_SECRET);

    req.user = await UserModel.findById(decoded.id);

    next();
  } catch (err) {
    console.log(err);
    return res
      .status(401)
      .json({ success: false, message: "Not authorize to access this route" });
  }
}
export function checkRole(...roles: UserType[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (req.user != undefined && roles.includes(req.user.role)) {
      return next();
    }
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  };
}
export function getTokenFromReq(req: Request) {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
}
