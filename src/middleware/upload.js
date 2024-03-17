import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/upload");
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtantion = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + fileExtantion);
  },
});

const upload = multer({ storage });
module.exports = upload;
