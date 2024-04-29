// const mbToBytes = require("../utils/mbToBytes");
// const multer = require("multer");
import mbToBytes from "../utils/mbToBytes";
import multer from "multer";
import { NextFunction, Request, Response, response } from "express";
export default function upload(maxSize: number, allowedMimeTypes: string[]) {
  function fileFilter(
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback,
  ) {
    if (allowedMimeTypes.includes(file.mimetype)) {
      return cb(null, true);
    }
    cb(null, false);
  }

  let upload = multer({
    fileFilter: fileFilter,
    limits: {
      fileSize: mbToBytes(maxSize),
    },
  }).single("image");
  return function (req: Request, res: Response, next: NextFunction) {
    upload(req, res, function onError(err) {
      if (err == undefined) {
        // console.log("lol");
        next();
        return;
      }
      if (err instanceof multer.MulterError) {
        console.log(err);
        res.status(413).json({ success: false });
        return;
      }
      console.log(err);
      res.status(500).json({ success: false });
    });
  };
}
