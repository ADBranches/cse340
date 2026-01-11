import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

//  file filter
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
