// utilities/upload.js

import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

// ✅ Enhanced file filter with friendly feedback
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.mimetype)) {
    req.fileValidationError =
      "Unsupported format. Only JPG, PNG, and WEBP images are accepted.";
    return cb(null, false);
  }
  cb(null, true);
};

export const upload = multer({ storage, fileFilter });
