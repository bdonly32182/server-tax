const multer = require("multer");
const excelFilter = (req, file, cb) => {
  //filter file
    if (
      file.mimetype.includes("excel") ||
      file.mimetype.includes("spreadsheetml")
    ) {
      cb(null, true);
    } else {
      cb("Please upload only excel file.", false);
    }
  };
  var storage = multer.diskStorage({
    //storage file
    destination: (req, file, cb) => {
      cb(null, __basedir + "/resource/upload/");
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  let uploadFile = multer({ storage: storage, fileFilter: excelFilter });
  module.exports = uploadFile  