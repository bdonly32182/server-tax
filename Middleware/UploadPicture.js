const multer = require("multer");

  var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, __basedir + "/public/Image/Profile/");
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  let uploadFile = multer({ storage: storage,limits:{fileSize:2000000} });
  //limits is size file image
  module.exports = uploadFile  