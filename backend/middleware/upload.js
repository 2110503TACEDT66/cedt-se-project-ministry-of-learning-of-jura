const mbToBytes = require("../utils/mbToBytes");
const multer = require("multer");

module.exports = function (maxSize, allowedMimeTypes) {
  function fileFilter(req, file, cb) {
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
  return function (req, res, next) {
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
};
